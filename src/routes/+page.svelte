<script>
    import { onMount } from 'svelte';
    import Teaser from './_Teaser.svelte';
    
    let itemTabs;
    let itemTitle;

    onMount(async () => {
        await import("@material/mwc-tab-bar");
        await import("@material/mwc-tab");
        await import("@material/mwc-icon")
        await import("@material/mwc-icon-button-toggle");

        itemTabs.addEventListener('MDCTabBar:activated', function(data) {
            itemTitle.textContent = document.querySelectorAll("mwc-tab")[data.detail.index].label;
        });
    });

</script>

<svelte:head>
    <title>종이상자 공간</title>
</svelte:head>

<Teaser></Teaser>

<mwc-tab-bar activeIndex="1" bind:this={itemTabs}>
    <mwc-tab isMinWidthIndicator label="전체"/>
    <mwc-tab isMinWidthIndicator label="진행 중"/>
    <mwc-tab isMinWidthIndicator label="과거 활동"/>
    <mwc-tab isMinWidthIndicator label="그 밖에"/>
</mwc-tab-bar>

<main>
    <h1 bind:this={itemTitle}>진행 중</h1>
</main>

<style>
    mwc-tab {
        --mdc-typography-button-font-size: 1.0rem;
        --mdc-typography-button-font-weight: 300;
    }

    main {
        padding: 0 1rem 0 1rem;
    }
</style>