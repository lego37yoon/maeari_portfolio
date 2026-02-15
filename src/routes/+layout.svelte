<script lang="ts">
    import "./index.scss";
    import meta from "../../package.json";
    import { page, navigating } from '$app/state';
    import Link from "../components/Link.svelte";

    let { children } = $props();
    let loadingDialog = $state<HTMLDialogElement>();
    const admin = '종이상자';
    const version = meta.version;
    const currentYear = new Date().getFullYear();

    $effect (() => {
        if (navigating.complete !== null && loadingDialog) {
            loadingDialog.showModal();
        } 
        
        if (navigating.complete === null && loadingDialog) {
            loadingDialog.close();
        }
    })
</script>

<dialog bind:this={loadingDialog}>
    <div>
        <md-circular-progress indeterminate></md-circular-progress>
        <p>데이터를 가져오는 중입니다</p>
    </div>
</dialog>

{@render children()}

<footer>
    <p>© {currentYear} {admin}</p>
    <p>
        <span>Made with &lt;3 and Svelte. <Link href={`${page.url.origin}/oss`}>OSS Notice</Link></span>
        <span class="mfp-version">
            <Link href="https://github.com/lego37yoon/maeari_portfolio" external={true}>
                mfp v{version}
            </Link>
        </span>

    </p>
</footer>

<style>
    dialog {
        --cut-size: 1rem;
        z-index: 999;
        outline: none;
        border: none;
        background: var(--md-sys-color-surface-variant);
        border-radius: 10px;

        -webkit-clip-path: polygon(
            var(--cut-size) 0,
            100% 0,
            100% calc(100% - var(--cut-size)),
            calc(100% - var(--cut-size)) 100%,
            0 100%,
            0 var(--cut-size)
        );
        
        clip-path: polygon(
            var(--cut-size) 0,
            100% 0,
            100% calc(100% - var(--cut-size)),
            calc(100% - var(--cut-size)) 100%,
            0 100%,
            0 var(--cut-size)
        );
    }

    dialog > div {
        display: flex;
        gap: 0.5rem;
        align-items: center;
    }

    dialog::backdrop {
        opacity: 0.5;
    }

    footer {
        padding: 1rem;
        display: flex;
        flex-wrap: wrap;
        justify-content: space-between;
    }

    footer p {
        margin: 0;
    }

    .mfp-version {
        padding: 0.25rem 0.5rem;
        background: #d2c77303;
        border: 1px solid #d2c77380;
        border-radius: 25px;
    }
</style>
