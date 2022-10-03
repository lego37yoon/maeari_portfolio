<script>
    import { onMount } from 'svelte';
    
    onMount(async () => {
        await import("@material/mwc-list");
    });    
</script>

<svelte:head>
    <title>OSS Notice | 종이상자 공간</title>
</svelte:head>

<main id="oss">
    <section id="teaserArea">
        <h1 class="teaserTitle">OSS Notice | maeari for portfolio</h1>
        <p class="teaserText">Find open-source software used in this software below.</p>
        <p class="teaserText">Please contact to<a href="mailto:lego37yoon@outlook.com" class="teaserLink">this email</a>if you have any question.</p>
    </section>
    <section id="ossList">
        <mwc-list multi id="listContainer">
            <a href="https://github.com/sveltejs/svelte/blob/master/LICENSE.md" target="_blank">
                <mwc-list-item twoline>
                    <span>Svelte</span>
                    <span slot="secondary">MIT License</span>
                </mwc-list-item>
            </a>
            <a href="https://github.com/sveltejs/kit/blob/master/LICENSE" target="_blank">
                <mwc-list-item twoline>
                    <span>SvelteKit</span>
                    <span slot="secondary">MIT License</span>
                </mwc-list-item>
            </a>
            <a href="https://github.com/material-components/material-web/blob/mwc/LICENSE" target="_blank">
                <mwc-list-item twoline>
                    <span>Material Web Components</span>
                    <span slot="secondary">Apache License 2.0</span>
                </mwc-list-item>
            </a>
            <a href="https://github.com/material-icons/material-icons/blob/master/LICENSE" target="_blank">
                <mwc-list-item twoline>
                    <span>Material Icons</span>
                    <span slot="secondary">Apache License 2.0</span>
                </mwc-list-item>
            </a>
            <a href="https://scripts.sil.org/cms/scripts/page.php?site_id=nrsi&id=OFL" target="_blank">
                <mwc-list-item twoline>
                    <span>SUIT</span>
                    <span slot="secondary">SIL Open Font License</span>
                </mwc-list-item>
            </a>
        </mwc-list>
    </section>
</main>

<style>

    /* teaser 공간 CSS */
    #teaserArea {
        padding: 1rem;
        background: linear-gradient(45deg, cadetblue, cornflowerblue);
        word-break: keep-all;
        border-bottom-right-radius: 10px;
        border-bottom-left-radius: 10px;
    }

    .teaserText {
        color: white;
        font-weight: 300;
    }

    .teaserLink {
        text-decoration: none;
        margin: 0 5px 0 5px;
        color: white;
        border-bottom: solid 2px white;
    }
    .teaserLink:visited {
        text-decoration: none;
        color: white;
    }

    .teaserTitle {
        font-family: 'SUIT Variable', 'Noto Sans CJK KR Light', sans-serif;
        font-size: 2rem;
        font-weight: 200;
        color: white;
    }

    /* navigation bar CSS */
    section {
        font-size: 1.5rem;
    }

    mwc-list-item {
        border-radius: 10px;
    }

    mwc-list a {
        text-decoration: none;
    }

    mwc-list a:visited {
        text-decoration: none;
    }
</style>