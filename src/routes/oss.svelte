<script>
    import { onMount } from 'svelte';

    onMount(async () => {
        await import("@material/mwc-list");
        await import("@material/mwc-dialog");
    });
</script>

<main id="oss">
    <section id="teaserArea">
        <h1 class="teaserTitle">오픈소스 소프트웨어 안내</h1>
        <p class="teaserText">메아리 for 포트폴리오에 사용된 오픈소스 소프트웨어를 소개합니다.</p>
        <p class="teaserText">본 소프트웨어에 사용된 오픈소스 소프트웨어에 대해 문의사항이 있는 경우 <a href="mailto:lego37yoon@outlook.com" class="teaserLink">이메일</a>로 연락주세요.</p>
    </section>
    <section id="ossList">
        <mwc-list multi>
            <mwc-list-item twoline>
                <span>Svelte</span>
                <span slot="secondary">MIT License</span>
            </mwc-list-item>
            <mwc-list-item twoline>
                <span>SvelteKit</span>
                <span slot="secondary">MIT License</span>
            </mwc-list-item>
            <mwc-list-item twoline>
                <span>Material Web Components</span>
                <span slot="secondary">Apache License 2.0</span>
            </mwc-list-item>
            <mwc-list-item twoline>
                <span>Material Icons</span>
                <span slot="secondary">Apache License 2.0</span>
            </mwc-list-item>
            <mwc-list-item twoline>
                <span>SUIT</span>
                <span slot="secondary">SIL Open Font License</span>
            </mwc-list-item>
        </mwc-list>
    </section>
    <section id="ossDialog">
        <mwc-dialog id="svelte" heading="Svelte">
            <p class="oss-md-file"></p>
            <mwc-button slot="primaryAction" dialogAction="close">닫기</mwc-button>
        </mwc-dialog>
    </section>
</main>

<style>
    /* teaser 공간 CSS */
    #teaserArea {
        padding: 1em;
        background: linear-gradient(45deg, cadetblue, cornflowerblue);
        word-break: keep-all;
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
        font-size: 2em;
        font-weight: 200;
        color: white;
    }

    /* navigation bar CSS */
    section {
        font-size: 1.5em;
    }

    mwc-list-item {
        border-radius: 10px;
    }
</style>