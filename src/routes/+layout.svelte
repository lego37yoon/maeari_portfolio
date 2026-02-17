<script lang="ts">
    import "./index.scss";
    import "@material/web/icon/icon.js";
    import "@material/web/iconbutton/icon-button.js";
    import '@material/web/progress/circular-progress.js';
    import { onMount } from 'svelte';
    import { fly } from 'svelte/transition';
    import { page, navigating } from '$app/state';
    import { darkMode } from "../components/darkMode"; 
    
    import meta from "../../package.json";
    import Nav from "../components/Nav.svelte";
    import Link from "../components/Link.svelte";
    import Teaser from "../components/Teaser.svelte";

    let { data, children } = $props();
    let currentPage = $derived(page.url.pathname.substring(page.url.pathname.lastIndexOf('/') + 1));
    let loadingDialog = $state<HTMLDialogElement>();
    let darkModeButton = undefined;
    let darkModeState = $state(false);

    const admin = '종이상자';
    const version = meta.version;
    const currentYear = new Date().getFullYear();

    $effect(() => {
        const unsubscribe = darkMode.subscribe((value) => {
            darkModeState = value;
        });

        return unsubscribe;
    });

    function darkToggleEvent() {
        if (darkModeButton.selected) {
            document.body.classList.add("dark");
            darkMode.set(true);
        } else {
            document.body.classList.remove("dark");
            darkMode.set(false);
        }
    }
    
    onMount(async () => {
        if (window.matchMedia('(prefers-color-scheme: dark)').matches) {
            darkModeButton.setAttribute("selected", "");
            document.body.classList.add("dark");
            darkMode.set(true);
        }

        window.matchMedia('(prefers-color-scheme: dark)').addEventListener('change', event => {
            const colorSet = event.matches ? "dark":"light";
            if (colorSet === "dark") {
                darkModeButton.setAttribute("selected", "");
                document.body.classList.add("dark");
                darkMode.set(true);
            } else {
                darkModeButton.removeAttribute("selected");
                document.body.classList.remove("dark");
                darkMode.set(false);
            }
        });
    });

    $effect (() => {
        if (navigating.complete !== null && loadingDialog) {
            loadingDialog.showModal();
        } 
        
        if (navigating.complete === null && loadingDialog) {
            loadingDialog.close();
        }
    });

    $inspect(currentPage);
</script>

<dialog bind:this={loadingDialog}>
    <div>
        <md-circular-progress indeterminate></md-circular-progress>
        <p>데이터를 가져오는 중입니다</p>
    </div>
</dialog>

<header>
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
            <md-icon-button id="darkModeButton" bind:this={darkModeButton} toggle role="switch" aria-checked={darkModeState} tabindex="0" aria-label="toggle dark or light mode" onclick={darkToggleEvent} onkeypress={darkToggleEvent}>
                <md-icon>dark_mode</md-icon>
                <md-icon slot="selectedIcon">light_mode</md-icon>
            </md-icon-button>
        </li>
    </ul>
</header>

<Teaser teaserData={{
    intro: data?.intro ?? { title: '', desc: '' },
    notice: data?.notice ?? { data: [] }
}}></Teaser>
<Nav selectedId={currentPage} />

{#key currentPage}
<div in:fly="{{ x: 200, duration: 1000 }}">
    {@render children()}
</div>
{/key}

<footer>
    <p>© {currentYear} {admin}</p>
    <p>
        <span>Made with &lt;3 and Svelte. <Link href={`${page.url.origin}/oss`}>OSS Notice</Link></span>
        <span class="mfp-version">
            <Link href="https://github.com/lego37yoon/maeari_portfolio" external={true}>
                mfp v{version}
            </Link>
        </span>

    </p>
</footer>

<style>
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
        color: var(--mfp-primary-text-color);
        font-size: 1.5rem;
        height: 3.4rem;
        background: transparent;
        /* background for scroll down (light mode) */
        /* background: #ffffff80; */
    }

    header ul {
        list-style: none;
        display: inline;
        padding: 0;
    }

    header li {
        font-weight: lighter;
        color: var(--mfp-primary-text-color);
    }

    .title {
        margin: 0.6rem 1rem 0 1rem;
        font-weight: 600;
        float: left;
        color: var(--mfp-primary-text-color);
        text-decoration: none;
    }

    .title:visited {
        color: var(--mfp-primary-text-color);
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
        color: var(--mfp-primary-text-color);

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
        --md-icon-button-unselected-icon-color: #5f9ea0;
        --md-icon-button-unselected-focus-icon-color: #5f9ea0;
        --md-icon-button-selected-focus-icon-color: #5f9ea0;
        --md-icon-button-selected-icon-color: #5f9ea0;
    }
</style>
