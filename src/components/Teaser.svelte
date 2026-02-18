<script lang="ts">
    import "@material/web/icon/icon.js";
    import "@material/web/iconbutton/icon-button.js";
    import { fly, fade } from 'svelte/transition';
    import { onMount } from "svelte";
    import { pickReadableTextColorFromElement } from "../utils/contrast";

    const NOTICE_INTERVAL_MS = 5000;
    const defaultTeaserData = {
        intro: {
            title: "안녕하세요,",
            desc: "포트폴리오 사이트에 오신 것을 환영합니다"
        },
        notice: {
            data: [
                {
                    background: "linear-gradient(45deg, cadetblue, cornflowerblue)",
                    enabled: true,
                    text: "공지사항을 확인하고 있어요."
                }
            ]
        }
    };
    const defaultNotice = {
        background: "linear-gradient(45deg, cadetblue, cornflowerblue)",
        text: "공지사항을 확인하고 있어요."
    };

    let { teaserData = defaultTeaserData } = $props();
    const notices = $derived(teaserData.notice?.data?.length ? teaserData.notice.data : [defaultNotice]);
    const maxNoticeCount = $derived(notices.length || 1);
    let currentNoticeCount = $state(1);
    let isNoticePlaying = $state(false);
    let teaserTextColor = $state("#ffffff");
    let teaserAreaElement = $state();

    const currentNotice = $derived(notices[currentNoticeCount - 1] ?? notices[0]);
    const teaserNotice = $derived(currentNotice?.text ?? "공지사항을 확인하고 있어요.");
    const teaserLinkText = $derived(currentNotice["link-title"] ?? "");
    const teaserLink = $derived(currentNotice.link ?? "");
    const teaserBackground = $derived(currentNotice.background ?? "linear-gradient(45deg, cadetblue, cornflowerblue)");

    let carouselTimeoutId = null;
    let nextTickAt = 0;

    function updateTeaserTextColor() {
        if (!teaserAreaElement) {
            return;
        }
        teaserTextColor = pickReadableTextColorFromElement(teaserAreaElement, {
            fallback: "#ffffff",
            lightBackgroundTextColor: "#1a1a1a",
            darkBackgroundTextColor: "#ffffff"
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

<section id="teaserArea" bind:this={teaserAreaElement}
    style:background={teaserBackground} style={`--teaser-text-color: ${teaserTextColor};`}>
    <section id="Notice">
        {#if maxNoticeCount > 0}
        {#key `${teaserNotice}`}
        <div class="noticeContent" in:fly={{ x: 80, duration: 200, delay: 250 }} out:fly={{ x: -80, duration: 200 }}>
            <p class="teaserTitle">{teaserNotice}</p>
            <p class="teaserDesc">
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
        padding: calc(1rem + var(--mfp-header-height)) 1rem 1rem 1rem;
        display: flex;
        flex-direction: column;
        justify-content: end;
        word-break: keep-all;
        margin-top: calc(-1 * var(--mfp-header-height));
        height: calc(100vh - 10rem);
        width: 100%;
        box-sizing: border-box;
        transition: filter 200ms ease;
    }

    :global(body.dark) #teaserArea {
        filter: brightness(0.72);
    }

    #Notice {
        display: flex;
        padding: 1rem;
    }

    #Notice p {
        margin: 0;
    }

    .noticeContent {
        display: flex;
        flex-direction: column;
        gap: 0.5rem;
    }

    #teaserArea p,
    #teaserArea a {
        color: inherit;
    }

    .teaserTitle {
        color: currentColor;
        font-size: 2.2rem;
        font-weight: 300;
    }

    .teaserDesc {
        display: inline-flex;
        gap: 0.5rem;
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
