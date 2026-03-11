<script lang="ts">
    import "@material/web/icon/icon.js";
    import "@material/web/iconbutton/icon-button.js";
    import { onMount, tick } from "svelte";
    import { fly } from "svelte/transition";
    import { afterNavigate } from '$app/navigation';
    import { page, navigating } from '$app/state';
    import { applyDarkMode, darkMode } from "../utils/theme/darkMode";
    import {
        connectHeaderHeroColorObserver,
        type HeaderThemeContext,
        syncHeaderHeroTextColor,
        isHeaderAtTop
    } from "../utils/theme/header";
    import Link from "./Link.svelte";
    import { getCurrentPath } from "../utils/path";

    let headerElement: HTMLElement | undefined = undefined;
    let darkModeButton: (HTMLElement & { selected?: boolean }) | undefined = $state(undefined);
    let darkModeState = $state(false);
    let headerAtTop = $state(true);
    let headerHeroTextColor = $state("#ffffff");
    let heroStyleObserver: MutationObserver | undefined;
    let mobileMenuOpen = $state(false);
    let currentPage = $derived(getCurrentPath());
    const headerThemeContext: HeaderThemeContext = {
        getDarkModeState: () => darkModeState,
        getHeaderElement: () => headerElement
    };
    const updateHeaderHeroTextColor = (nextColor: string): void => {
        headerHeroTextColor = nextColor;
    };

    let menus = $derived([
        { href: "/", current: !["news", "cv"].includes(currentPage) ? true : false, title: "소개", external: false },
        // { href: "/news", current: currentPage === "news" ? true : false, title: "소식", external: false },
        // { href: "/cv", current: currentPage === "cv" ? true : false, title: "이력서", external: false },
        { href: "https://diary.paperbox.pe.kr", current: false, title: "블로그", external: true },
        { href: "https://github.com/lego37yoon", current: false, title: "GitHub", external: true },
        { href: "https://www.linkedin.com/in/jungmin-yoon", current: false, title: "LinkedIn", external: true },
        
    ]);

    $effect(() => {
        const unsubscribe = darkMode.subscribe((value) => {
            darkModeState = value;
        });

        return unsubscribe;
    });

    function closeMobileMenu(): void {
        mobileMenuOpen = false;
    }

    function toggleMobileMenu(): void {
        mobileMenuOpen = !mobileMenuOpen;
    }

    function darkToggleEvent(event: Event) {
        event.preventDefault();
        event.stopPropagation();
        const target = event.currentTarget as { selected?: boolean } | null;
        applyDarkMode(Boolean(target?.selected), {
            darkModeButton,
            onChanged: (enabled) => {
                syncHeaderHeroTextColor(headerThemeContext, updateHeaderHeroTextColor, enabled);
            }
        });
    }

    function updateHeaderScrollState(): void {
        headerAtTop = isHeaderAtTop();
    }

    function resetHeaderStateAfterNavigation(to: URL | undefined): void {
        if (typeof document === "undefined") {
            return;
        }

        window.scrollTo(0, 0);
        headerAtTop = true;
        if (to) {
            syncHeaderHeroTextColor(
                headerThemeContext,
                updateHeaderHeroTextColor,
                {
                    path: to.pathname,
                    overrideDarkModeState: darkModeState
                }
            );
        }
    }

    function syncHeaderState(): void {
        if (typeof document === "undefined") {
            return;
        }

        updateHeaderScrollState();
        syncHeaderHeroTextColor(headerThemeContext, updateHeaderHeroTextColor);
        heroStyleObserver?.disconnect();
        heroStyleObserver = connectHeaderHeroColorObserver(headerThemeContext, updateHeaderHeroTextColor);
    }

    afterNavigate(({ to }) => {
        resetHeaderStateAfterNavigation(to?.url);
        requestAnimationFrame(() => {
            syncHeaderState();
        });
    });
    
    onMount(() => {
        const colorScheme = window.matchMedia('(prefers-color-scheme: dark)');
        const mobileQuery = window.matchMedia('(max-width: 780px)');
        applyDarkMode(colorScheme.matches, {
            darkModeButton,
            onChanged: () => {
                syncHeaderHeroTextColor(headerThemeContext, updateHeaderHeroTextColor);
            }
        });
        updateHeaderScrollState();

        const handleColorSchemeChange = (event: MediaQueryListEvent) => {
            applyDarkMode(event.matches, {
                darkModeButton,
                onChanged: (enabled) => {
                    syncHeaderHeroTextColor(headerThemeContext, updateHeaderHeroTextColor, enabled);
                }
            });
        };
        const handleViewportChange = (event: MediaQueryListEvent) => {
            if (!event.matches) {
                closeMobileMenu();
            }
        };
        const handleWindowKeyDown = (event: KeyboardEvent) => {
            if (event.key === "Escape") {
                closeMobileMenu();
            }
        };

        colorScheme.addEventListener("change", handleColorSchemeChange);
        mobileQuery.addEventListener("change", handleViewportChange);
        heroStyleObserver = connectHeaderHeroColorObserver(headerThemeContext, updateHeaderHeroTextColor);

        return () => {
            colorScheme.removeEventListener("change", handleColorSchemeChange);
            mobileQuery.removeEventListener("change", handleViewportChange);
            heroStyleObserver?.disconnect();
        };
    });

    $effect(() => {
        page.url.pathname;
        closeMobileMenu();
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

            syncHeaderState();
        });

        return () => {
            cancelled = true;
        };
    });

    $effect(() => {
        if (navigating.complete === null) {
            syncHeaderState();
        }
    });
</script>

<svelte:window on:scroll|passive={updateHeaderScrollState} on:keydown={handleWindowKeyDown} />

<header bind:this={headerElement} class:with-teaser={headerAtTop} class:scrolled={!headerAtTop} style={`--mfp-header-hero-text-color: ${headerHeroTextColor};`}>
    <ul>
        <li><a href={page.url.origin} class="title">paperbox</a></li>
    </ul>
    <ul class="rightMenu" role="navigation">
        {#each menus as menu}
        <li class="desktopLink"><Link href={menu.href} nav current={menu.current} external={menu.external}>{menu.title}</Link></li>
        {/each}
        <li class="displayToggle">
            <md-icon-button id="darkModeButton" bind:this={darkModeButton} toggle role="switch" aria-checked={darkModeState} tabindex="0" aria-label="toggle dark or light mode" onchange={darkToggleEvent}>
                <md-icon>dark_mode</md-icon>
                <md-icon slot="selected">light_mode</md-icon>
            </md-icon-button>
        </li>
        <li id="mobileMenuToggle">
            <md-icon-button toggle aria-label="toggle site menu" aria-expanded={mobileMenuOpen} onclick={toggleMobileMenu} onkeypress={toggleMobileMenu} selected={mobileMenuOpen} role="button" tabindex="0">
                <md-icon>menu</md-icon>
                <md-icon slot="selected">close</md-icon>
            </md-icon-button>
        </li>
    </ul>
    {#if mobileMenuOpen}
    <button class="mobileMenuBackdrop" onclick={closeMobileMenu} aria-label="close site menu"></button>
    <nav id="mobileMenuPopup" transition:fly={{ y: -12, duration: 160 }} aria-label="mobile menu" class:scrolled={!headerAtTop}>
        <ul>
            {#each menus as menu}
            <li><Link href={menu.href} onClick={closeMobileMenu} nav current={menu.current} external={menu.external}>{menu.title}</Link></li>
            {/each}
            <li class="displayToggle">
                <md-icon-button id="darkModeButton" bind:this={darkModeButton} toggle role="switch" aria-checked={darkModeState} tabindex="0" aria-label="toggle dark or light mode" onchange={darkToggleEvent}>
                    <md-icon>dark_mode</md-icon>
                    <md-icon slot="selected">light_mode</md-icon>
                </md-icon-button>
            </li>
        </ul>
    </nav>
    {/if}
</header>

<style>
    :global(body) {
        --mfp-header-height: 3.4rem;
        --mfp-header-scrolled-bg-color: #ffffff;
    }

    :global(body.dark) {
        --mfp-header-scrolled-bg-color: #000000;
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

    #mobileMenuToggle {
        display: none;
    }

    .mobileMenuBackdrop {
        position: fixed;
        inset: var(--mfp-header-height) 0 0 0;
        border: none;
        margin: 0;
        padding: 0;
        background: rgba(0, 0, 0, 0.28);
        z-index: 10;
    }

    #mobileMenuPopup {
        position: fixed;
        top: var(--mfp-header-height);
        margin: 0.5rem;
        width: calc(100% - 1rem);
        background: transparent;
        padding: 0.5rem;
        z-index: 11;
        box-sizing: border-box;
    }

    #mobileMenuPopup .displayToggle {
        display: none;
    }

    #mobileMenuPopup.scrolled {
        background: var(--mfp-header-scrolled-bg-color);
    }

    #mobileMenuPopup ul {
        list-style: none;
        margin: 0;
        padding: 0;
        display: flex;
        flex-direction: column;
        align-items: end;
        gap: 0.2rem;
    }

    #mobileMenuPopup li {
        font-size: 1.2rem;
        padding: 0.25rem 0.35rem;
    }

    @media screen and (max-width: 780px) {
        .rightMenu .desktopLink {
            display: none;
        }

        #mobileMenuToggle {
            display: inline;
        }
    }

    @media screen and (max-width: 263px) {
        .rightMenu .displayToggle {
            display: none;
        }

        #mobileMenuPopup .displayToggle {
            display: block;
            margin-right: 1rem;
        }
    }

    @media screen and (max-width: 213px) {
        #mobileMenuToggle {
            display: none;
        }
    }

    .rightMenu md-icon-button, #mobileMenuPopup md-icon-button {
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
