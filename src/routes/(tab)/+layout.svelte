<script lang="ts">
    import "./tab.scss";
    import { fly } from 'svelte/transition';
    import Nav from '../../components/Nav.svelte';
    import Teaser from '../../components/Teaser.svelte';
    import { getCurrentPath } from '../../utils/path';
    import { buildTeaserPayload } from '../../utils/teaser';

    let { data, children } = $props();
    let currentPage = $derived(getCurrentPath());
    let pageContentContainer: HTMLElement | undefined = $state(undefined);
    const teaserData = $derived(buildTeaserPayload(data ?? {}));

    function scrollToPageContentTop(): void {
        if (!pageContentContainer || typeof document === "undefined") {
            return;
        }

        const mainContent = pageContentContainer.querySelector<HTMLElement>("main") ?? pageContentContainer;
        const headerHeight = document.querySelector("header")?.getBoundingClientRect().height ?? 0;
        const navHeight = document.getElementById("submenu")?.getBoundingClientRect().height ?? 0;
        const offset = Math.round(headerHeight + navHeight);
        mainContent.style.scrollMarginTop = `${Math.max(0, offset - 1)}px`;
        mainContent.scrollIntoView({
            behavior: "smooth",
            block: "start",
            inline: "nearest"
        });
    }
</script>

<Teaser teaserData={teaserData} />

<Nav selectedId={currentPage} />

{#key currentPage}
<div bind:this={pageContentContainer} in:fly="{{ x: 200, duration: 1000 }}" onintroend={scrollToPageContentTop}>
    {@render children()}
</div>
{/key}
