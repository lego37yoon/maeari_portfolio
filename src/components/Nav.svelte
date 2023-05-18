<script>
    import "@material/web/icon/icon.js";
    import '@material/web/segmentedbutton/outlined-segmented-button.js';
    import '@material/web/segmentedbuttonset/outlined-segmented-button-set.js';
    import { goto } from "$app/navigation";
    //import { onMount } from "@sveltejs/kit"

    export let selectedId = "home";
    let currentSelectedPage = "home";
    let sets = undefined;
    const pages = {
        home: undefined, 
        news: undefined, 
        resume: undefined, 
        contacts:undefined
    };

    $: if (pages.home) {
        if (selectedId === "") {
            selectedId = "home";
        }
        pages[currentSelectedPage].removeAttribute("selected");
        pages[selectedId].setAttribute("selected", "");
        currentSelectedPage = selectedId;
    }

    function movePage(event) {
        console.log(event.detail.button.href);
        goto(event.detail.button.getAttribute("href"));
    }
</script>

<nav id="submenu">
    <md-outlined-segmented-button-set bind:this={sets} on:segmented-button-set-selection={movePage}>
        <md-outlined-segmented-button bind:this={pages.home} label="홈" href="/">
            <md-icon slot="icon">home</md-icon>
        </md-outlined-segmented-button>
        <md-outlined-segmented-button bind:this={pages.news} label="소식" href="/news">
            <md-icon slot="icon">newspaper</md-icon>
        </md-outlined-segmented-button>
        <md-outlined-segmented-button bind:this={pages.resume} label="CV" href="/resume">
            <md-icon slot="icon">receipt_long</md-icon>
        </md-outlined-segmented-button>
        <md-outlined-segmented-button bind:this={pages.contacts} label="연락처" href="/contacts">
            <md-icon slot="icon">mail</md-icon>
        </md-outlined-segmented-button>
    </md-outlined-segmented-button-set>
    <ul class="smallMenu">
        <li>
            <a href="/"><md-icon>home</md-icon>홈</a>
        </li>
        <li>
            <a href="/news"><md-icon>newspaper</md-icon>소식</a>
        </li>
        <li>
            <a href="/resume"><md-icon>receipt_long</md-icon>CV</a>
        </li>
        <li>
            <a href="/contacts"><md-icon>mail</md-icon>연락처</a>
        </li>
    </ul>
</nav>

<style>

    #submenu {
        margin: 1em;
    }

    md-outlined-segmented-button {
        word-break: keep-all;
        --md-segmented-button-with-icon-icon-size: 18px;
    }

    md-outlined-segmented-button md-icon {
        vertical-align: top;
    }

    .smallMenu {
        display: none;
        list-style-type: none;
        background: var(--md-sys-color-secondary-container);
        border-radius: 24px;
        padding: 1em 0.5em;
    }

    .smallMenu a {
        text-decoration: none;
        display: block;
    }

    .smallMenu a md-icon {
        --md-icon-size: 20px;
        vertical-align: top;
        margin-inline-end: 5px;
    }

    .smallMenu li {
        padding-left: 0.5em;
        padding-right: 0.5em;
    }

    .smallMenu li:hover {
        background: var(--md-sys-color-background);
        opacity: 0.8;
        border-radius: 24px;
    }

    @media screen and (max-width: 331px) {
        md-outlined-segmented-button-set{
            display: none;
        }

        .smallMenu {
            display: block;
        }
    }
</style>