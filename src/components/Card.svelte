<script>
    export let icon;
    export let title;
    export let href;
    export let desc;
    export let type;
    export let align = "";
</script>

{#if href}
    <a class="card" href={href} target="_blank">
        <md-icon>{icon}</md-icon>
        <span class="cardTitle">{title}</span>
        {#if type}
        <span class="cardType">{type}</span>
        {/if}
        <span class="cardDesc {align}">
            {#if typeof desc === "object"}
                {#each desc as paragraph}
                    <p class="descInnerParagraph">{paragraph}</p>
                {/each}
            {:else}
                {desc}
            {/if}
        </span>
    </a>
{:else}
    <p class="card" href={href} target="_blank">
        <md-icon>{icon}</md-icon>
        <span class="cardTitle">{title}</span>
        {#if type}
        <span class="cardType">{type}</span>
        {/if}
        <span class="cardDesc {align}">
            {#if typeof desc === "object"}
                {#each desc as paragraph}
                    <p class="descInnerParagraph">{paragraph}</p>
                {/each}
            {:else}
                {desc}
            {/if}
        </span>
    </p>
{/if}

<style>
    p.card {
        color: var(--mfp-card-type-color, #406CC5);
        margin: 0;
    }

    .card {
        aspect-ratio: 1 / 1;
        background: var(--md-sys-color-surface, #edf3f7);
        border: 1px solid var(--md-sys-color-surface, grey);
        border-radius: 24px;
        padding: 1em;
        text-decoration: none;
        flex-basis: 12em;
        width: 12em;
    }

    .cardTitle {
        font-size: 1.2em;
        text-align: center;
        display: block;
        overflow-x: hidden;
        text-overflow: ellipsis;
        white-space: nowrap;
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
    }

    .descInnerParagraph {
        margin: 0;
        padding: 0;
    }

    .cardType {
        display: block;
        text-align: center;
        color: var(--mfp-card-type-color, #406CC5);
        margin: 1em 0.5em 0.5em 0.5em; 
        background: var(--md-sys-color-background);
        border-radius: 24px;
        padding: 0.5em;
    }
</style>