<script>
    import "./index.scss";
    import "@material/web/icon/icon.js";
    import "@material/web/iconbutton/standard-icon-button.js";
    import '@material/web/segmentedbutton/outlined-segmented-button.js';
    import '@material/web/segmentedbuttonset/outlined-segmented-button-set.js';
    import { onMount } from 'svelte';
    import { page } from '$app/stores';
    import Teaser from "./Teaser.svelte";

    const currentYear = new Date().getFullYear();
    /** @type {import('./$types').LayoutData} */
    export let data;

    function darkToggleEvent() {
        if (darkModeButton.selected) {
            document.body.classList.add("dark");
        } else {
            document.body.classList.remove("dark");
        }
    }
    
    onMount(async () => {
        if (window.matchMedia('(prefers-color-scheme: dark)').matches) {
            darkModeButton.setAttribute("selected", "");
            document.body.classList.add("dark");
        }

        window.matchMedia('(prefers-color-scheme: dark)').addEventListener('change', event => {
            let colorSet = event.matches ? "dark":"light";
            if (colorSet == "dark") {
                darkModeButton.setAttribute("selected", "");
                document.body.classList.add("dark");
            } else {
                darkModeButton.removeAttribute("selected");
                document.body.classList.remove("dark");
            }
        });
    });
</script>

<header>
    <ul>
        <li><a href="./" class="title">paperbox</a></li>
        <ul class="rightMenu" role="navigation">
            <li><a href="https://pbdiary.pw" target="_blank">blog</a></li>
            <li><a href="https://github.com/lego37yoon" target="_blank">github</a></li>
            <li>
                <md-standard-icon-button id="darkModeButton" toggle aria-label="toggle dark or light mode" on:click="{darkToggleEvent}">
                    <md-icon>light_mode</md-icon>
                    <md-icon slot="selectedIcon">dark_mode</md-icon>
                </md-standard-icon-button>
            </li> 
        </ul>
    </ul>
</header>

{#if $page.url.pathname.substr($page.url.pathname.lastIndexOf('/')) !== "/oss"}
<Teaser teaserData={data}></Teaser>
<md-outlined-segmented-button-set>
    <md-outlined-segmented-button selected label="프로젝트">
        <md-icon slot="icon">design_services</md-icon>
    </md-outlined-segmented-button>
    <md-outlined-segmented-button label="CV(한국어)">
        <md-icon slot="icon">receipt_long</md-icon>
    </md-outlined-segmented-button>
    <md-outlined-segmented-button label="소식">
        <md-icon slot="icon">newspaper</md-icon>
    </md-outlined-segmented-button>
    <md-outlined-segmented-button label="연락하기">
        <md-icon slot="icon">mail</md-icon>
    </md-outlined-segmented-button>
</md-outlined-segmented-button-set>
{/if}
<slot></slot>

<footer>
    <p>copyright by {currentYear} 종이상자. Made with &lt;3 and Svelte. <a href="./oss">OSS Notice</a></p>
</footer>

<style>
    /* 헤더 부분 UI CSS */
    header {
        font-family: 'SUIT Variable', 'Noto Sans CJK KR Light', sans-serif;
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
        font-family: 'SUIT Variable', 'Noto Sans CJK KR Light', sans-serif;
        font-weight: lighter;
        color: cadetblue;
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
        padding: 1.5rem 1rem 0.5rem 1rem;
        display: inline;
        float: right;
    }
    .rightMenu li {
        display: inline;
        font-size: 1.0em;
    }

    .rightMenu a {
        color: cadetblue;
        text-decoration: none;
    }

    .rightMenu md-standard-icon-button {
        margin-top: -0.5rem;
        margin-bottom: -0.5rem;
        --md-icon-button-unselected-icon-color: #5f9ea0;
        --md-icon-button-unselected-focus-icon-color: #5f9ea0;
        --md-icon-button-selected-focus-icon-color: #5f9ea0;
    }

    md-outlined-segmented-button-set {
        margin: 1em;
    }

    /* 푸터 부분 CSS */
    footer p {
        padding: 1rem 1rem 0.5rem 1rem;
    }
</style>