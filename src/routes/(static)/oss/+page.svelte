<script>
    import '@material/web/list/list-item-link.js';
    import '@material/web/list/list-item.js';
    import '@material/web/divider/divider.js';
    import '@material/web/list/list.js';
</script>

<svelte:head>
    <title>OSS Notice | 종이상자 공간</title>
    <meta property="og:title" content="OSS Notice | 종이상자 공간">
    <meta name="description" content="메아리 for 포트폴리오의 오픈소스 라이선스 목록입니다.">
    <meta name="twitter:title" content="OSS Notice | 종이상자 공간">
    <meta name="twitter:description" content="메아리 for 포트폴리오의 오픈소스 라이선스 목록입니다.">
</svelte:head>

<main id="oss">
    <section id="teaserArea">
        <h1 class="teaserTitle">OSS Notice | maeari for portfolio</h1>
        <p class="teaserText">Find open-source software used in this software below.</p>
        <p class="teaserText">Please contact to<a href="mailto:lego37yoon@outlook.com" class="teaserLink">this email</a>if you have any question.</p>
    </section>
    <section id="ossList">
        <md-list id="listContainer">
            <a href="https://github.com/sveltejs/svelte/blob/master/LICENSE.md" target="_blank">
                <md-list-item headline="Svelte" supportingText="MIT License">
                    <md-icon slot="start">square_foot</md-icon>
                </md-list-item>
            </a>
            <a href="https://github.com/sveltejs/kit/blob/master/LICENSE" target="_blank">
                <md-list-item headline="SvelteKit" supportingText="MIT License">
                    <md-icon slot="start">construction</md-icon>
                </md-list-item>
            </a>
            <a href="https://github.com/firebase/firebase-js-sdk/blob/master/LICENSE" target="_blank">
                <md-list-item headline="Firebase JavaScript SDK Version 9" supportingText="Apache License 2.0">
                    <md-icon slot="start">cloud_upload</md-icon>
                </md-list-item>
            </a>
            <a href="https://github.com/material-components/material-web/LICENSE" target="_blank">
                <md-list-item headline="Material Web Components" supportingtext="Apache License 2.0">
                    <md-icon slot="start">brush</md-icon>
                </md-list-item>
            </a>
            <a href="https://github.com/sass/sass/blob/main/LICENSE" target="_blank">
                <md-list-item headline="Sass" supportingtext="MIT License">
                    <md-icon slot="start">css</md-icon>
                </md-list-item>
            </a>
            <a href="https://developers.google.com/fonts/docs/material_symbols" target="_blank">
                <md-list-item headline="Material Symbols" supportingtext="Apache License 2.0">
                    <md-icon slot="start">app_badging</md-icon>
                </md-list-item>
            </a>
            <a href="https://sunn.us/suit/" target="_blank">
                <md-list-item headline="SUIT" supportingtext="SIL Open Font License">
                    <md-icon slot="start">text_fields</md-icon>
                </md-list-item>
            </a>
        </md-list>
    </section>
</main>

<style>

    /* teaser 공간 CSS */
    #teaserArea {
        margin: 0 1em;
        padding: 1em;
        background: linear-gradient(45deg, cadetblue, cornflowerblue);
        word-break: keep-all;
        border-radius: 10px;
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

    #ossList {
        margin-top: 1em;
    }

    md-list {
        border-radius: 8px;
        border: 1px solid var(--md-sys-color-outline);
        overflow: hidden;
    }

    md-list a {
        text-decoration: none;
        border-radius: 8px;
    }

    md-list a:visited {
        text-decoration: none;
    }

    md-icon {
        margin-inline-start: 1em;
    }
</style>