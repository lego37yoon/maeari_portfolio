<script>
    import "@material/web/icon/icon.js";
    import '@material/web/segmentedbutton/outlined-segmented-button.js';
    import '@material/web/segmentedbuttonset/outlined-segmented-button-set.js';

    export let selectedId = "home";
    let currentSelectedPage = "home";
    const pages = {
        home: undefined, 
        news: undefined, 
        resume: undefined, 
        contacts:undefined
    };

    $: if (pages.home) {
        console.log(selectedId);
        if (selectedId === "") {
            selectedId = "home";
        }
        pages[currentSelectedPage].removeAttribute("selected");
        pages[selectedId].setAttribute("selected", "");
        currentSelectedPage = selectedId;
    }
</script>

<nav id="submenu">
    <md-outlined-segmented-button-set>
        <md-outlined-segmented-button bind:this={pages.home} label="홈">
            <md-icon slot="icon">home</md-icon>
        </md-outlined-segmented-button>
        <md-outlined-segmented-button bind:this={pages.news} label="소식">
            <md-icon slot="icon">newspaper</md-icon>
        </md-outlined-segmented-button>
        <md-outlined-segmented-button bind:this={pages.resume} label="CV">
            <md-icon slot="icon">receipt_long</md-icon>
        </md-outlined-segmented-button>
        <md-outlined-segmented-button bind:this={pages.contacts} label="연락처">
            <md-icon slot="icon">mail</md-icon>
        </md-outlined-segmented-button>
    </md-outlined-segmented-button-set>
</nav>

<style>

    #submenu {
        margin: 1em;
    }

    md-outlined-segmented-button {
        word-break: keep-all;
        --md-segmented-button-with-icon-icon-size: 18px;
    }

</style>