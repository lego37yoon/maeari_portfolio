<script lang="ts">
    import "@material/web/icon/icon.js";
    import "@material/web/iconbutton/icon-button.js";
    import { fly, fade } from 'svelte/transition';
    import { onMount } from "svelte";
    import { pickReadableTextColorFromElement } from "../utils/contrast";
    import { buildTeaserPayload } from "../utils/teaser";

    const LIGHT_BG_TEXT_COLOR = "#1a1a1a";
    const DARK_BG_TEXT_COLOR = "#ffffff";
    const IMAGE_BRIGHTNESS_THRESHOLD = 195;
    const IMAGE_SAMPLE_SIZE = 24;
    const IMAGE_LUMINANCE_CACHE = new Map<string, number | null>();
    let textColorRequestId = 0;

    const NOTICE_INTERVAL_MS = 5000;
    let { teaserData = {} } = $props();
    const resolvedTeaserData = $derived(buildTeaserPayload(teaserData));
    const notices = $derived(resolvedTeaserData.notice.data);
    const maxNoticeCount = $derived(notices.length || 1);
    let currentNoticeCount = $state(1);
    let isNoticePlaying = $state(false);
    let teaserTextColor = $state("#ffffff");

    const currentNotice = $derived(notices[currentNoticeCount - 1] ?? notices[0]);
    const teaserNotice = $derived(currentNotice.text);
    const teaserDesc = $derived(currentNotice.desc);
    let teaserImageLuminance = $state<number | null>(null);
	const teaserLinkText = $derived(currentNotice["link-title"] ?? "");
	const teaserLink = $derived(currentNotice.link ?? "");
	const teaserBackground = $derived(currentNotice.background ?? "linear-gradient(45deg, cadetblue, cornflowerblue)");
	const isImageBackground = $derived(
		typeof teaserBackground === "string" && teaserBackground.trim().toLowerCase().startsWith("url(")
	);

    function getImageUrlFromBackground(background: string): string {
        const match = background.match(/url\(\s*['"]?(.*?)['"]?\s*\)/i);
        return match?.[1]?.trim() ?? "";
    }

    function parseImageLuminanceFromPixelData(data: ImageData): number {
        const rgbSamples: Array<number> = [];
        for (let i = 0; i < data.data.length; i += 4) {
            const alpha = data.data[i + 3];
            if (alpha <= 0) {
                continue;
            }
            const luminance = 0.2126 * data.data[i] + 0.7152 * data.data[i + 1] + 0.0722 * data.data[i + 2];
            rgbSamples.push(luminance);
        }

        if (rgbSamples.length === 0) {
            return -1;
        }

        return rgbSamples.reduce((sum, value) => sum + value, 0) / rgbSamples.length;
    }

    function getCachedImageLuminance(imageUrl: string): number | null | undefined {
        return IMAGE_LUMINANCE_CACHE.get(imageUrl);
    }

    async function fetchImageLuminance(imageUrl: string): Promise<number | null> {
        if (!imageUrl) {
            return null;
        }

        const cachedLuminance = getCachedImageLuminance(imageUrl);
        if (cachedLuminance !== undefined) {
            return cachedLuminance;
        }

        try {
            const response = await fetch(imageUrl, { mode: "cors" });
            if (!response.ok) {
                IMAGE_LUMINANCE_CACHE.set(imageUrl, null);
                return null;
            }

            const blob = await response.blob();
            const imageUrlForBlob = URL.createObjectURL(blob);

            try {
                const image = new Image();
                image.crossOrigin = "anonymous";
                image.referrerPolicy = "no-referrer";

                return await new Promise<number | null>((resolve) => {
                    image.onload = () => {
                        const canvas = document.createElement("canvas");
                        const context = canvas.getContext("2d");
                        if (!context) {
                            resolve(null);
                            return;
                        }

                        canvas.width = IMAGE_SAMPLE_SIZE;
                        canvas.height = IMAGE_SAMPLE_SIZE;
                        context.drawImage(image, 0, 0, IMAGE_SAMPLE_SIZE, IMAGE_SAMPLE_SIZE);

                        try {
                            const imageData = context.getImageData(0, 0, IMAGE_SAMPLE_SIZE, IMAGE_SAMPLE_SIZE);
                            const luminance = parseImageLuminanceFromPixelData(imageData);
                            resolve(luminance < 0 ? null : luminance);
                        } catch {
                            resolve(null);
                        } finally {
                            URL.revokeObjectURL(imageUrlForBlob);
                        }
                    };

                    image.onerror = () => {
                        resolve(null);
                        URL.revokeObjectURL(imageUrlForBlob);
                    };

                    image.src = imageUrlForBlob;
                });
            } catch {
                URL.revokeObjectURL(imageUrlForBlob);
                return null;
            }
        } catch {
            IMAGE_LUMINANCE_CACHE.set(imageUrl, null);
            return null;
        }
    }

    function getReadableTextByLuminance(luminance: number | null): string {
        if (luminance === null) {
            return DARK_BG_TEXT_COLOR;
        }

        return luminance >= IMAGE_BRIGHTNESS_THRESHOLD ? LIGHT_BG_TEXT_COLOR : DARK_BG_TEXT_COLOR;
    }

    async function updateTeaserTextColorFromImage(imageUrl: string, requestId: number) {
        const cachedLuminance = getCachedImageLuminance(imageUrl);
        if (cachedLuminance !== undefined) {
            if (requestId === textColorRequestId) {
                teaserImageLuminance = cachedLuminance;
                teaserTextColor = getReadableTextByLuminance(cachedLuminance);
            }
            return;
        }

        teaserImageLuminance = null;
        const luminance = await fetchImageLuminance(imageUrl);
        if (requestId !== textColorRequestId) {
            return;
        }

        IMAGE_LUMINANCE_CACHE.set(imageUrl, luminance);
        teaserImageLuminance = luminance;
        if (luminance === null && teaserAreaElement) {
            teaserTextColor = pickReadableTextColorFromElement(teaserAreaElement, {
                fallback: DARK_BG_TEXT_COLOR,
                lightBackgroundTextColor: LIGHT_BG_TEXT_COLOR,
                darkBackgroundTextColor: DARK_BG_TEXT_COLOR
            });
            return;
        }

        teaserTextColor = getReadableTextByLuminance(luminance);
    }

    let carouselTimeoutId = null;
    let nextTickAt = 0;
    let teaserAreaElement: HTMLElement = $state();

    function updateTeaserTextColor() {
        if (!teaserAreaElement) {
            return;
        }
        const requestId = ++textColorRequestId;
        if (isImageBackground && teaserBackground) {
            const imageUrl = getImageUrlFromBackground(teaserBackground);
            if (imageUrl) {
                void updateTeaserTextColorFromImage(imageUrl, requestId);
                return;
            }
        }

        teaserImageLuminance = null;

        if (requestId !== textColorRequestId) {
            return;
        }

        teaserTextColor = pickReadableTextColorFromElement(teaserAreaElement, {
            fallback: DARK_BG_TEXT_COLOR,
            lightBackgroundTextColor: LIGHT_BG_TEXT_COLOR,
            darkBackgroundTextColor: DARK_BG_TEXT_COLOR
        });
    }

    function clearCarouselTimer() {
        if (carouselTimeoutId !== null) {
            clearTimeout(carouselTimeoutId);
            carouselTimeoutId = null;
        }
    }

    function getNow() {
        return typeof performance !== "undefined" ? performance.now() : Date.now();
    }

    function advanceNotice() {
        currentNoticeCount = currentNoticeCount >= maxNoticeCount ? 1 : currentNoticeCount + 1;
    }

    function scheduleNextTick(reset = false) {
        if (!isNoticePlaying || maxNoticeCount <= 1) {
            clearCarouselTimer();
            return;
        }

        const now = getNow();
        if (reset || nextTickAt <= now) {
            nextTickAt = now + NOTICE_INTERVAL_MS;
        }

        const delay = Math.max(0, nextTickAt - now);
        clearCarouselTimer();
        carouselTimeoutId = setTimeout(() => {
            advanceNotice();
            nextTickAt += NOTICE_INTERVAL_MS;
            scheduleNextTick();
        }, delay);
    }

    onMount(() => {
        updateTeaserTextColor();

        if (!teaserAreaElement) {
            return;
        }

        const observer = new MutationObserver(() => {
            updateTeaserTextColor();
        });

        observer.observe(teaserAreaElement, {
            attributes: true,
            attributeFilter: ["style", "class"]
        });

        const onVisibilityChange = () => {
            if (document.hidden) {
                clearCarouselTimer();
                return;
            }
            scheduleNextTick(true);
        };
        document.addEventListener("visibilitychange", onVisibilityChange);

        isNoticePlaying = true;

        return () => {
            observer.disconnect();
            document.removeEventListener("visibilitychange", onVisibilityChange);
            isNoticePlaying = false;
            clearCarouselTimer();
        };
    });

    $effect(() => {
        teaserBackground;
        updateTeaserTextColor();
    });

    $effect(() => {
        if (currentNoticeCount > maxNoticeCount) {
            currentNoticeCount = 1;
        }
    });

    $effect(() => {
        isNoticePlaying;
        maxNoticeCount;
        scheduleNextTick(true);
    });

    function playPauseEvent() {
        isNoticePlaying = !isNoticePlaying;
    }

    function moveNotice(step) {
        if (maxNoticeCount <= 1) {
            return;
        }
        const zeroBased = currentNoticeCount - 1;
        const nextIndex = (zeroBased + step + maxNoticeCount) % maxNoticeCount;
        currentNoticeCount = nextIndex + 1;
        if (isNoticePlaying) {
            scheduleNextTick(true);
        }
    }

    function previousNotice() {
        moveNotice(-1);
    }

	    function nextNotice() {
	        moveNotice(1);
	    }
</script>

	<section
		id="teaserArea"
		bind:this={teaserAreaElement}
		style={`--teaser-background: ${teaserBackground}; --teaser-text-color: ${teaserTextColor};`}
	>
    <section id="Notice">
        {#if maxNoticeCount > 0}
        {#key `${teaserNotice}`}
        <div class="noticeContent" in:fly={{ x: 80, duration: 200, delay: 250 }} out:fly={{ x: -80, duration: 200 }}>
            <p class="teaserTitle">{teaserNotice}</p>
            <p class="teaserDesc">
                <span>{teaserDesc}</span>
                {#if teaserLink}
                <a class="teaserText teaserLink" href={teaserLink} target="_blank">
                    {teaserLinkText ? teaserLinkText : "이동하기"} &gt;
                </a>
                {/if}
            </p>
        </div>
        {/key}
        {/if}
    </section>
    {#if maxNoticeCount > 1}
    <section id="teaserCount">
        <p id="Counter">
            {#key currentNoticeCount}
            <span id="currentCount" in:fade>
                {#if currentNoticeCount < 10}0{/if}{currentNoticeCount}
            </span>
            {/key}
            <span id="divider"> / </span>
            <span id="maxCount">{#if maxNoticeCount < 10}0{/if}{maxNoticeCount}</span>
        </p>
        <div id="noticeControls">
            <md-icon-button aria-label="previous announcement" onclick={previousNotice} onkeypress={previousNotice} role="button" tabindex="0">
                <md-icon>navigate_before</md-icon>
            </md-icon-button>
            <md-icon-button id="playNoticeButton" toggle role="button" tabindex="0" aria-label="pause or play announcements" onclick={playPauseEvent} onkeypress={playPauseEvent} selected={!isNoticePlaying}>
                <md-icon>pause</md-icon>
                <md-icon slot="selected">play_arrow</md-icon>
            </md-icon-button>
            <md-icon-button aria-label="next announcement" onclick={nextNotice} onkeypress={nextNotice} role="button" tabindex="0">
                <md-icon>navigate_next</md-icon>
            </md-icon-button>
        </div>
    </section>
    {/if}
</section>

<style>
    /* teaser 공간 CSS */
	#teaserArea {
		color: var(--teaser-text-color, #ffffff);
		position: relative;
		padding: calc(1rem + var(--mfp-header-height)) 1rem 1rem 1rem;
		display: flex;
		flex-direction: column;
		justify-content: end;
		word-break: keep-all;
		margin-top: calc(-1 * var(--mfp-header-height));
		height: calc(100vh - 10rem);
		width: 100%;
		overflow: hidden;
		box-sizing: border-box;
		transition: filter 200ms ease;
		
	}

    #teaserArea::before {
        content: "";
        position: absolute;
        top: 0; left: 0; right: 0; bottom: 0;
        background: var(--teaser-background);
		background-repeat: no-repeat;
		background-size: cover;
		background-position: center;
        z-index: -1;

        filter: brightness(0.5);
    }

	#Notice,
	#teaserCount {
		position: relative;
		z-index: 1;
	}

    :global(body.dark) #teaserArea {
        filter: brightness(0.8);
    }

    #Notice {
        display: flex;
        padding: 1rem;
        height: 18rem;
        align-items: end;
    }

    #Notice p {
        margin: 0;
        text-shadow: 3px 3px 3px grey;
    }

    .noticeContent {
        display: flex;
        flex-direction: column;
        gap: 0.5rem;
        max-width: 50rem;
        min-width: 0;
    }

    #teaserArea p,
    #teaserArea a {
        color: inherit;
    }

    .teaserTitle {
        color: currentColor;
        font-size: 2.2rem;
        font-weight: 300;
        text-align: start;
        text-wrap: balance;
    }

    .teaserDesc {
        display: inline-flex;
        flex-direction: column;
        gap: 0.5rem;
    }

    .teaserDesc span {
        font-size: 1.2rem;
        display: -webkit-box;
        -webkit-box-orient: vertical;
        -webkit-line-clamp: 3;
        line-clamp: 3;
        overflow-wrap: anywhere;
        text-overflow: ellipsis;
        overflow: hidden;
    }

    .teaserText {
        font-size: 1rem;
        color: currentColor;
    }

    .teaserLink {
        color: currentColor;
        text-decoration: none;
        border-bottom: solid 2px currentColor;
        display: inline-block;
        max-width: max-content;
    }
    .teaserLink:visited {
        text-decoration: none;
        color: currentColor;
    }

    #teaserCount {
        display: flex;
        align-items: center;
        justify-content: end;
        gap: 0.5rem;
    }

    #Counter #currentCount, #Counter #maxCount {
        font-size: 1.1rem;
        font-weight: 900;
        text-align: end;
    }

    #maxCount {
        opacity: 0.75;
    }

    #teaserCount md-icon-button {
        --md-sys-color-on-surface-variant: currentColor;
        --md-sys-color-primary: currentColor;
        --md-icon-button-unselected-icon-color: currentColor;
        --md-icon-button-unselected-focus-icon-color: currentColor;
        --md-icon-button-selected-focus-icon-color: currentColor;
        --md-icon-button-selected-icon-color: currentColor;
    }

    #noticeControls {
        display: inline-flex;
        align-items: center;
        gap: 0.15rem;
    }

    @media screen and (max-width: 231px) {
        #teaserCount {
            display: none;
        }
    }

    /* navigation bar CSS */
    section {
        font-size: 1.5rem;
    }

</style>
