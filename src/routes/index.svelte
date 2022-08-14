<script>
    import { onMount } from 'svelte';
    import Teaser from './_Teaser.svelte';
    
    onMount(async () => {
        await import("@material/mwc-tab-bar");
        await import("@material/mwc-tab");
        await import("@material/mwc-icon")
        await import("@material/mwc-icon-button-toggle");
    });
</script>

<Teaser></Teaser>

<mwc-tab-bar activeIndex="1">
    <mwc-tab isMinWidthIndicator label="전체"/>
    <mwc-tab isMinWidthIndicator label="진행 중"/>
    <mwc-tab isMinWidthIndicator label="과거 활동"/>
    <mwc-tab isMinWidthIndicator label="그 밖에"/>
</mwc-tab-bar>

<main>
    <h1></h1>
</main>

<style>
    mwc-tab {
        --mdc-typography-button-font-size: 1.0rem;
        --mdc-typography-button-font-weight: 300;
    }
</style>