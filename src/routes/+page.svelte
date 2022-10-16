<script>
    import { onMount } from 'svelte';
    import Teaser from './Teaser.svelte';
    import SectionContent from './SectionContent.svelte';
    
    let itemTabs;
    let itemTitle;
    let viewMode = "now";

    onMount(async() => {
        await import("@material/mwc-tab-bar");
        await import("@material/mwc-tab");
        await import("@material/mwc-icon")
        await import("@material/mwc-icon-button-toggle");

        itemTabs.addEventListener('MDCTabBar:activated', function(data) {
            itemTitle.textContent = document.querySelectorAll("mwc-tab")[data.detail.index].label;

            switch(data.detail.index) {
                case 0: //전체
                    viewMode = "all";
                    break;
                case 2: //과거 활동
                    viewMode = "past";
                    break;
                case 3: //그 밖에
                    viewMode = "others";
                    break;
                case 1: //진행 중
                default:
                    viewMode = "now";
                    break;
            }
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
    {#key viewMode}
    <h1 bind:this={itemTitle}>진행 중</h1>
    {#if viewMode != "others"}
    <section id="dev">
        <SectionContent
            mainMenu={viewMode}
            subMenu="dev"
            subMenuName="개인 및 팀 프로젝트" />
    </section>
    <section id="contest">
        <SectionContent 
            mainMenu={viewMode}
            subMenu="contest"
            subMenuName="대회 및 공모전" />
    </section>
    <section id="act">
        <SectionContent 
            mainMenu={viewMode}
            subMenu="act"
            subMenuName="각종 대외활동" />
    </section>
    <section id="contribution">
        <SectionContent 
            mainMenu={viewMode}
            subMenu="contribution"
            subMenuName="오픈소스 기여" />
    </section>
    <section id="edu">
        <SectionContent 
            mainMenu={viewMode}
            subMenu="edu"
            subMenuName="학업" />
    </section>
    {/if}
    {#if viewMode == "others" || viewMode == "all"}
    <section id="contact">
        <SectionContent 
            mainMenu={viewMode}
            subMenu="contact"
            subMenuName="연락처 및 SNS" />
    </section>
    {/if}
    {/key}
</main>

<style>
    mwc-tab {
        --mdc-typography-button-font-size: 1.0rem;
        --mdc-typography-button-font-weight: 400;
    }

    main {
        padding: 0 1rem 0 1rem;
    }
</style>