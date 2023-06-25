<script>
    import '@material/web/list/list-item-link.js';
    import '@material/web/list/list-item.js';
    import '@material/web/list/list.js';

    /** @type {import('./$types').PageData} */
    export let data;
    const name = import.meta.env.VITE_REAL_NAME;
    const englishName = import.meta.env.VITE_ENGLISH_NAME;
</script>

<svelte:head>
    <meta name="description" content="개인 프로젝트 등 포트폴리오를 소개합니다">
    <meta property="og:title" content="{data.title} | 포트폴리오 | 종이상자 공간">
    <meta property="og:description" content="개인 프로젝트 등 포트폴리오를 소개합니다">
    <meta name="twitter:title" content="{data.title} | 포트폴리오 | 종이상자 공간">
    <meta name="twitter:description" content="개인 프로젝트 등 포트폴리오를 소개합니다">  
    <title>{data.title} | 포트폴리오 | 종이상자 공간</title>
</svelte:head>

<main>
    <section id="bcArea">
        <h1 id="bcName">{name}</h1>
        <p id="bcEngName">{englishName}</p>
        <p id="bcRole">{data.role}</p>
        <p id="bcLink">
            <a href="mailto:{data.email}">
                <md-icon>email</md-icon>
                <span id="bcEmail">{data.email}</span>    
            </a>
            <a href="{data.dev.url}" target="_blank">
                <md-icon>code</md-icon>
                <span id="bcGit">{data.dev.handle}</span>    
            </a>
        </p>
    </section>
    <section id="introduce">
        <h2>소개</h2>
        <svelte:component this={data.content.introduce} />
    </section>
    {#if data.content.education}
        <section id="education">
            <h2>학업</h2>
            <md-list>
                {#each data.content.education as school}
                <a href={school.data.link} target="_blank">
                    <md-list-item 
                        headline="{school.data.school}"
                        supportingText="{school.data["start-year"]} ~ {school.data["end-year"]}
                            | {school.data.status} | {school.data.major} 
                            {school.data.score ? `| GPA ${school.data.score}/${school.data['score-max']}`: ''}"
                    >
                        <md-icon slot="start">{school.id !== "univ" ? "location_city" : "school"}</md-icon>
                    </md-list-item>
                </a>
                {/each}
            </md-list>
        </section>
    {/if}
    {#if data.content.project}
        <section id="projects">
            <h2>유지보수 중인 주요 프로젝트</h2>
            <md-list>
                {#each data.content.project as product}
                <a href={product.data.link} target="_blank">
                    <md-list-item 
                        headline="{product.data.title}"
                        supportingText="{product.data.year} | {product.data.desc}">
                        <md-icon slot="start">{product.data.icon}</md-icon>
                    </md-list-item>
                </a>
                {/each}
            </md-list>
        </section>
    {/if}
    {#if data.content.contribution}
        <section id="contribution">
            <h2>오픈소스 기여활동</h2>
            <md-list>
                {#each data.content.contribution as product}
                <a href={product.data.link} target="_blank">
                    <md-list-item 
                        headline="{product.data.title}"
                        supportingText="{product.data["start-year"]} ~ {product.data["end-year"] || "현재"} 
                        | {product.data.desc}"
                    >
                        <md-icon slot="start">{product.data.icon}</md-icon>
                    </md-list-item>
                </a>
                {/each}
            </md-list>
        </section>
    {/if}
    {#if data.content.certification}
        <section id="certification">
            <h2>자격증 및 자격시험</h2>
            <md-list>
                {#each data.content.certification as cert}
                <md-list-item
                    headline="{cert.data.title} {cert.data.score}"
                    supportingText="{cert.data.date} | {cert.data.org}">
                    <md-icon slot="start">{cert.data.type === "certificate" ? "badge" : 
                        cert.data.type === "test" ? "quiz" : "glyphs"}</md-icon>
                </md-list-item>
                {/each}
            </md-list>
        </section>
    {/if}
</main>

<style>
    #bcArea {
        margin: 0 1.5em;
        padding: 1em;
        background: linear-gradient(45deg, #248386, #5F76AB);
        word-break: keep-all;
        border-radius: 8px;
    }

    #bcRole {
        color: white;
        font-weight: 300;
    }

    #bcLink a {
        color: white;
        font-weight: 300;
        text-decoration: none;
        display: inline-flex;
        gap: 0.2em;
        margin-inline-end: 0.5em;
    }

    #bcLink a:visited {
        color: white;
    }

    #bcName, #bcEngName {
        font-weight: 200;
        color: white;
    }

    #bcName {
        font-size: 2rem;
        margin-bottom: 0;
    }

    #bcEngName {
        margin-top: 0;
        font-size: 1.4rem;
    }

    section {
        margin: 0 1.5em;
        --mfp-primary-text-color: var(--mfp-static-header-text-color);
        font-weight: 300;
    }

    h2 {
        word-break: keep-all;
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

    md-list md-icon {
        margin-inline-start: 1em;
        color: var(--mfp-card-type-color);
    }
</style>