<script lang="ts">
    import "./index.scss";
    import '@material/web/progress/circular-progress.js';
    import { page, navigating } from '$app/state';
    import Header from "../components/Header.svelte";
    import Link from "../components/Link.svelte";

    import { version } from "../../package.json";

    let { children } = $props();
    let loadingDialog = $state<HTMLDialogElement>();
    const admin = import.meta.env.VITE_ADMIN_NAME;
    const currentYear = new Date().getFullYear();
    $effect (() => {
        if (navigating.complete === null && loadingDialog) {
            loadingDialog.close();
        }

        if (navigating.complete !== null && loadingDialog) {
            loadingDialog.showModal();
            if (typeof document !== "undefined") {
                window.scrollTo(0, 0);
            }
        }
    });
</script>

<dialog bind:this={loadingDialog}>
    <div>
        <md-circular-progress indeterminate></md-circular-progress>
        <p>데이터를 가져오는 중입니다</p>
    </div>
</dialog>

<Header />

{@render children()}

<footer>
    <p>© {currentYear} {admin}</p>
    <p class="software-info">
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
        align-items: center;
    }

    footer p {
        margin: 0;
        display: inline-flex;
        flex-wrap: wrap;
        gap: 0.25rem;
        align-items: center;
    }
    
    .mfp-version {
        padding: 0.25rem 0.5rem;
        background: #d2c77303;
        border: 1px solid #d2c77380;
        border-radius: 25px;
    }

    @media screen and (max-width: 576px) {
        .software-info {
            width: 100%;
        }
    }
</style>
