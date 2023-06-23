<script>
    import "@material/web/icon/icon.js";
    import "@material/web/iconbutton/standard-icon-button.js";
    import "@material/web/tabs/tabs.js";
    import { goto } from "$app/navigation";

    export let selectedId = "home";
    let sets = undefined;
    
    $: if (sets) {
        switch(selectedId) {
            case "edu":
                sets.selected = 1;
                break;
            case "news":
                sets.selected = 2;
                break;
            case "contacts":
                sets.selected = 3;
                break;
            default:
                sets.selected = 0;
                if (sets.selectedItem)
                    sets.selectedItem.selected = true;
                break;
        }
    }

    function movePage() {
        goto(sets.focusedItem.getAttribute("href"), {
            keepFocus: true,
            noScroll: true
        });
    }
</script>

<nav id="submenu">
    <md-tabs variant="primary" bind:this={sets} on:click={movePage}>
        <md-tab variant="primary" href="/">
            <md-icon slot="icon">home</md-icon>
            홈
        </md-tab>
        <md-tab variant="primary" href="/edu">
            <md-icon slot="icon">history_edu</md-icon>
            학업
        </md-tab>
        <md-tab variant="primary" href="/news">
            <md-icon slot="icon">newspaper</md-icon>
            소식
        </md-tab>
        <md-tab variant="primary" href="/contacts">
            <md-icon slot="icon">mail</md-icon>
            연락하기
        </md-tab>
    </md-tabs>
</nav>

<style>

    md-tabs {
        border-radius: 5px;
    }

    md-tab {
        word-break: keep-all;
    }

    md-tab md-icon {
        vertical-align: top;
    }

</style>