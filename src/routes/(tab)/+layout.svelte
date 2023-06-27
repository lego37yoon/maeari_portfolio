<script>
    import "../index.scss";
    import "@material/web/icon/icon.js";
    import "@material/web/iconbutton/standard-icon-button.js";
    import '@material/web/circularprogress/circular-progress.js';
    import { onMount } from 'svelte';
    import { fly } from 'svelte/transition';
    import { page } from '$app/stores';
    import Nav from "../../components/Nav.svelte";
    import Teaser from "../../components/Teaser.svelte";
    import { darkMode } from "../../components/darkMode"; 

    /** @type {import('./$types').LayoutData} */
    export let data;
    

    let currentPage;
    $: currentPage = $page.url.pathname.substr($page.url.pathname.lastIndexOf('/') + 1);

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
</script>

<header>
    <ul>
        <li><a href="{$page.url.origin}" class="title">paperbox</a></li>
    </ul>
    <ul class="rightMenu" role="navigation">
        <li><a href="https://github.com/lego37yoon" target="_blank">github</a></li>
        <li><a href="./resume/swuniv-hack-2023">resume</a></li>
        <li id="displayToggle">
            <md-standard-icon-button id="darkModeButton" toggle role="switch" aria-checked={$darkMode} tabindex="0" aria-label="toggle dark or light mode" on:click="{darkToggleEvent}" on:keypress={darkToggleEvent}>
                <md-icon>dark_mode</md-icon>
                <md-icon slot="selectedIcon">light_mode</md-icon>
            </md-standard-icon-button>
        </li> 
    </ul>
</header>

<Teaser teaserData={data}></Teaser>
<Nav selectedId={currentPage} />

{#key currentPage}
<div in:fly="{{ x: 200, duration: 1000 }}">
    <slot></slot>
</div>
{/key}

<style>
    /* 헤더 부분 UI CSS */
    header {
        font-weight: lighter;
        color: cadetblue;
        font-size: 1.5rem;
        height: 4rem;
        border-bottom: solid 2px cadetblue;
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
        margin: 1.5rem 1rem 0.5rem 1rem;
        font-weight: 600;
        float: left;
        color: cadetblue;
    }
    .title {
        text-decoration: none;
    }
    .title:visited {
        color: cadetblue;
    }
    .rightMenu {
        margin: 1.5rem 0.5rem 0.5rem 1rem;
        display: inline;
        float: right;
    }
    .rightMenu li {
        display: inline;
        font-size: 1.0em;
    }

    .rightMenu a {
        color: var(--mfp-primary-text-color);
        text-decoration: none;
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

    .rightMenu md-standard-icon-button {
        margin-top: -0.5rem;
        margin-bottom: -0.5rem;
        --md-icon-button-unselected-icon-color: #5f9ea0;
        --md-icon-button-unselected-focus-icon-color: #5f9ea0;
        --md-icon-button-selected-focus-icon-color: #5f9ea0;
        --md-icon-button-selected-icon-color: #5f9ea0;
    }
</style>