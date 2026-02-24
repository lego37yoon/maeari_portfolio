<script lang="ts">
    import Link from "./Link.svelte";

    let { icon, title, href, desc, type, align = "" } = $props();
</script>

<div class="card">
    <div class="cardProfile">
        <md-icon>{icon}</md-icon>
        <div class="cardMain">
            <h2 class="cardTitle">{title}</h2>
            {#if type}
            <p class="cardType">{type}</p>
            {/if}
        </div>
    </div>
    <div class="cardDesc {align}">
        {#if typeof desc === "object"}
            {#each desc as paragraph}
                <p class="descInnerParagraph">{paragraph}</p>
            {/each}
        {:else}
            {desc}
        {/if}
    </div>
    {#if href}
    <div class="cardButton">
        <Link href={href} external>
            관련 링크
        </Link>
    </div>
    {/if}
</div>



<style>
	.card {
        background: var(--md-sys-color-surface, #edf3f7);
        color: var(--mfp-card-type-color, #406CC5);
        text-decoration: none;

        border-radius: 24px;
        padding: 1em;
        border: 1px solid var(--md-sys-color-surface, grey);

        flex-basis: 16rem;
        width: 16rem;
        height: 12rem;

        display: flex;
        flex-direction: column;
        align-items: center;
        justify-content: space-between;
        gap: 0.5rem;
    }

    .cardProfile {
        display: flex;
        width: 100%;
        margin: 0.5rem 0;
        gap: 0.5rem;
        align-items: center;
    }

    .cardMain {
        min-width: 0;
    }

    .cardMain h2, .cardMain p {
        margin: 0 0 0.25rem 0;
        color: var(--mfp-card-type-color, #406CC5);
        text-align: start;
    }

    .cardType {
        border-radius: 24px;
        padding: 0.25rem 0.5rem;
        font-size: 0.8rem;
        font-weight: 600;
        background: var(--md-sys-color-background);
        width: max-content;
    }

    .cardButton {
        display: block;
        text-align: center;
        background: var(--md-sys-color-background);
        border-radius: 24px;
        padding: 0.5rem 1rem;
    }

    .cardTitle {
        font-size: 1.2em;
        font-weight: 600;        
        display: block;
        white-space: wrap;
        word-break: keep-all;
        max-width: 100%;
    }

    .card md-icon {
        display: block;
        text-align: center;
        --md-icon-size: 48px;
    }

    .cardDesc {
        display: block;
        text-align: center;
        color: var(--mfp-primary-text-color);
        word-break: keep-all;
        font-weight: 500;
    }

    .descInnerParagraph {
        margin: 0;
        padding: 0;
    }

</style>
