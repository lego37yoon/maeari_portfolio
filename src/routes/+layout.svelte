<script lang="ts">
    import "./index.scss";
    import "@material/web/icon/icon.js";
    import "@material/web/iconbutton/icon-button.js";
    import '@material/web/progress/circular-progress.js';
    import { onMount, tick } from 'svelte';
    import { fly } from 'svelte/transition';
    import { page, navigating } from '$app/state';
    import { darkMode } from "../components/darkMode"; 
    import { pickReadableTextColorForPageTop } from "../utils/color";
    
    import meta from "../../package.json";
    import Link from "../components/Link.svelte";
    import { getCurrentPath } from "../utils/path";
    
    let { children } = $props();
    let loadingDialog = $state<HTMLDialogElement>();
    let currentPage = $derived(getCurrentPath());
    let darkModeButton: (HTMLElement & { selected?: boolean }) | undefined = undefined;
    let headerElement: HTMLElement | undefined = undefined;
    let darkModeState = $state(false);
    let headerAtTop = $state(true);
    let headerHeroTextColor = $state("#ffffff");
    let heroStyleObserver: MutationObserver | undefined;

    const admin = '종이상자';
    const currentYear = new Date().getFullYear();

    $effect(() => {
        const unsubscribe = darkMode.subscribe((value) => {
            darkModeState = value;
        });

        return unsubscribe;
    });

    function applyDarkMode(enabled: boolean) {
        if (darkModeButton) {
            darkModeButton.selected = enabled;
        }

        if (enabled) {
            document.body.classList.add("dark");
            darkMode.set(true);
            darkModeState = true;
            refreshHeaderHeroTextColor();
            return;
        }

        document.body.classList.remove("dark");
        darkMode.set(false);
        darkModeState = false;

        refreshHeaderHeroTextColor();
    }

    function darkToggleEvent(event: Event) {
        const target = event.currentTarget as { selected?: boolean } | null;
        applyDarkMode(Boolean(target?.selected));
    }

    function updateHeaderScrollState(): void {
        headerAtTop = window.scrollY <= 1;
    }

    function refreshHeaderHeroTextColor(): void {
        if (typeof document === "undefined") {
            return;
        }

        updateHeaderHeroTextColorFromSource();
    }

    function doesElementIntersectHeaderArea(element: HTMLElement): boolean {
        const rect = element.getBoundingClientRect();
        const headerHeight = headerElement?.getBoundingClientRect().height ?? 0;
        const visibleHeaderHeight = headerHeight > 0 ? headerHeight : 54;
        return rect.top < visibleHeaderHeight && rect.bottom > 0;
    }

    function updateHeaderHeroTextColorFromSource(): void {
        const teaserArea = document.getElementById("teaserArea");
        headerHeroTextColor = pickReadableTextColorForPageTop(
            teaserArea,
            teaserArea ? doesElementIntersectHeaderArea(teaserArea) : false,
            {
                fallback: darkModeState ? "#ffffff" : "var(--mfp-primary-text-color)",
                lightBackgroundTextColor: darkModeState ? "#111111" : "var(--mfp-primary-text-color)",
                darkBackgroundTextColor: "#ffffff"
            }
        );
    }

    function connectHeroColorObserver(): void {
        if (typeof document === "undefined") {
            return;
        }

        heroStyleObserver?.disconnect();
        updateHeaderHeroTextColorFromSource();

        heroStyleObserver = new MutationObserver(() => {
            updateHeaderHeroTextColorFromSource();
        });

        const teaserArea = document.getElementById("teaserArea");
        if (teaserArea) {
            heroStyleObserver.observe(teaserArea, {
                attributes: true,
                attributeFilter: ["style", "class"]
            });
        }

        heroStyleObserver.observe(document.body, {
            attributes: true,
            attributeFilter: ["style", "class"]
        });
        heroStyleObserver.observe(document.documentElement, {
            attributes: true,
            attributeFilter: ["style", "class"]
        });
    }
    
    onMount(() => {
        const colorScheme = window.matchMedia('(prefers-color-scheme: dark)');
        applyDarkMode(colorScheme.matches);
        updateHeaderScrollState();

        const handleColorSchemeChange = (event: MediaQueryListEvent) => {
            const colorSet = event.matches ? "dark":"light";
            if (colorSet === "dark") {
                applyDarkMode(true);
            } else {
                applyDarkMode(false);
            }
        };

        colorScheme.addEventListener("change", handleColorSchemeChange);
        window.addEventListener("scroll", updateHeaderScrollState, { passive: true });
        connectHeroColorObserver();

        return () => {
            colorScheme.removeEventListener("change", handleColorSchemeChange);
            window.removeEventListener("scroll", updateHeaderScrollState);
            heroStyleObserver?.disconnect();
        };
    });

    $effect(() => {
        page.url.pathname;

        if (typeof document === "undefined") {
            return;
        }

        let cancelled = false;
        tick().then(() => {
            if (cancelled) {
                return;
            }

            connectHeroColorObserver();
        });

        return () => {
            cancelled = true;
        };
    });

    $effect (() => {
        if (navigating.complete !== null && loadingDialog) {
            loadingDialog.showModal();
        } 
        
        if (navigating.complete === null && loadingDialog) {
            loadingDialog.close();
        }
    });
</script>

<dialog bind:this={loadingDialog}>
    <div>
        <md-circular-progress indeterminate></md-circular-progress>
        <p>데이터를 가져오는 중입니다</p>
    </div>
</dialog>

<header bind:this={headerElement} class:with-teaser={headerAtTop} class:scrolled={!headerAtTop} style={`--mfp-header-hero-text-color: ${headerHeroTextColor};`}>
    <ul>
        <li><a href={page.url.origin} class="title">paperbox</a></li>
    </ul>
    <ul class="rightMenu" role="navigation">
        <li><Link href="/" nav current={currentPage !== "cv" ? true : false}>소개</Link></li>
        <li><Link href="/cv" nav current={currentPage === "cv" ? true : false}>이력서</Link></li>
        <li><Link href="https://diary.paperbox.pe.kr" external nav>블로그</Link></li>
        <li><Link href="https://github.com/lego37yoon" external nav>GitHub</Link></li>
        <li><Link href="https://www.linkedin.com/in/%EC%A0%95%EB%AF%BC-%EC%9C%A4-216106227/" external nav>LinkedIn</Link></li>
        <li id="displayToggle">
            <md-icon-button id="darkModeButton" bind:this={darkModeButton} toggle role="switch" aria-checked={darkModeState} tabindex="0" aria-label="toggle dark or light mode" onchange={darkToggleEvent}>
                <md-icon>dark_mode</md-icon>
                <md-icon slot="selected">light_mode</md-icon>
            </md-icon-button>
        </li>
    </ul>
</header>

{@render children()}

<footer>
    <p>© {currentYear} {admin}</p>
    <p>
        <span>Made with &lt;3 and Svelte. <Link href={`${page.url.origin}/oss`}>OSS Notice</Link></span>
        <span class="mfp-version">
            <Link href="https://github.com/lego37yoon/maeari_portfolio" external={true}>
                mfp v{meta.version}
            </Link>
        </span>

    </p>
</footer>

<style>
    :global(body) {
        --mfp-header-height: 3.4rem;
        --mfp-header-scrolled-bg-color: #ffffff;
    }

    :global(body.dark) {
        --mfp-header-scrolled-bg-color: #000000;
    }

    dialog {
        --cut-size: 1rem;
        z-index: 999;
        outline: none;
        border: none;
        background: var(--md-sys-color-surface-variant);
        border-radius: 10px;

        -webkit-clip-path: polygon(
            var(--cut-size) 0,
            100% 0,
            100% calc(100% - var(--cut-size)),
            calc(100% - var(--cut-size)) 100%,
            0 100%,
            0 var(--cut-size)
        );
        
        clip-path: polygon(
            var(--cut-size) 0,
            100% 0,
            100% calc(100% - var(--cut-size)),
            calc(100% - var(--cut-size)) 100%,
            0 100%,
            0 var(--cut-size)
        );
    }

    dialog > div {
        display: flex;
        gap: 0.5rem;
        align-items: center;
    }

    dialog::backdrop {
        opacity: 0.5;
    }

    footer {
        padding: 1rem;
        display: flex;
        flex-wrap: wrap;
        justify-content: space-between;
    }

    footer p {
        margin: 0;
    }

    .mfp-version {
        padding: 0.25rem 0.5rem;
        background: #d2c77303;
        border: 1px solid #d2c77380;
        border-radius: 25px;
    }

    /* 헤더 부분 UI CSS */
    header {
        font-weight: lighter;
        color: var(--mfp-header-hero-text-color);
        font-size: 1.5rem;
        height: var(--mfp-header-height);
        background: transparent;
        position: absolute;
        top: 0;
        left: 0;
        right: 0;
        z-index: 10;
        transition: background-color 250ms ease, color 250ms ease, box-shadow 250ms ease;
    }

    header.scrolled {
        position: fixed;
        background: var(--mfp-header-scrolled-bg-color);
        color: var(--mfp-primary-text-color);
        box-shadow: 0 1px 4px rgba(0, 0, 0, 0.12);
    }

    header ul {
        list-style: none;
        display: inline;
        padding: 0;
        margin: 0;
    }

    header li {
        font-weight: lighter;
        color: currentColor;
    }

    .title {
        margin: 0.6rem 1rem 0 1rem;
        font-weight: 600;
        float: left;
        color: currentColor;
        text-decoration: none;
    }

    .title:visited {
        color: currentColor;
    }

    .rightMenu {
        margin: 1rem 1rem 0 1rem;
        display: flex;
        gap: 1rem;
        float: right;
    }

    .rightMenu li {
        display: inline;
        font-size: 1.2rem;
        color: currentColor;
    }

    @media screen and (max-width: 388px) {
        .rightMenu li {
            display: none;
        }

        #displayToggle {
            display: inline;
        }
    }

    @media screen and (max-width: 223px) {
        .rightMenu {
            display: none;
        }
    }

    .rightMenu md-icon-button {
        margin-top: -0.5rem;
        margin-bottom: -0.5rem;
        color: currentColor;
        --md-sys-color-on-surface-variant: currentColor;
        --md-sys-color-primary: currentColor;
        --md-icon-button-unselected-icon-color: currentColor;
        --md-icon-button-unselected-focus-icon-color: currentColor;
        --md-icon-button-selected-focus-icon-color: currentColor;
        --md-icon-button-selected-icon-color: currentColor;
    }

    :global(header.with-teaser .mfp-link-nav) {
        color: var(--mfp-header-hero-text-color);
    }

    :global(header.scrolled .mfp-link-nav) {
        color: var(--mfp-primary-text-color);
    }
</style>
