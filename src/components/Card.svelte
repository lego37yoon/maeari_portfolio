<script>
    export let icon;
    export let title;
    export let href;
    export let desc;
    export let type;

</script>

<a class="card" href={href} target="_blank">
    <md-icon>{icon}</md-icon>
    <span class="cardTitle">{title}</span>
    <span class="cardDesc">
        {#if type}
        <span class="cardType">{type}</span>
        {/if}
        {desc}
    </span>
</a>

<style>
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
        margin-top: 0.5em;
        display: block;
        color: cadetblue;
        word-break: keep-all;
    }

    .cardType {
        display: block;
        text-align: center;
        color: cornflowerblue;
        margin: 0.5em;
        background: var(--md-sys-color-background);
        border-radius: 24px;
        padding: 0.5em;
    }
</style>