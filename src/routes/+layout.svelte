<script>
    import "./index.scss";
    import { page, navigating } from '$app/state';

    let { children } = $props();
    const currentYear = new Date().getFullYear();
</script>

{#if navigating.complete !== null}
    <dialog open>
        <md-circular-progress indeterminate></md-circular-progress>
        <p>데이터를 읽어오는 중입니다</p>
    </dialog>
{/if}

{@render children()}

<footer>
    <p>copyright by {currentYear} 종이상자. Made with &lt;3 and Svelte. <a href={`${page.url.origin}/oss`}>OSS Notice</a></p>
</footer>

<style>
    dialog {
        z-index: 999;
        outline: none;
        border: 1px var(--md-sys-color-surface-variant) solid;
        background: var(--md-sys-color-surface-variant);
        border-radius: 24px;
        text-align: center;
        top: 50%;
        position: fixed;
    }

    /* 푸터 부분 CSS */
    footer p {
        padding: 1rem 1rem 0.5rem 1rem;
    }

    footer a {
        display: inline-block;
    }
</style>
