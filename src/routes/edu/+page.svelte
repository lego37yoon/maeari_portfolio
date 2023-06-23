<script>
    import Card from '../../components/Card.svelte';

    /** @type {import('./$types').PageData} */
    export let data;
</script>

<svelte:head>
    <title>학업 | 종이상자 공간</title>
</svelte:head>

<main>
    <section id="education">
        <h1>정규 교육기관</h1>
        <div class="list">
            {#each data.education as school}
            <Card icon={school.id !== "univ" ? "location_city" : "school"}
                href={school.data.link}
                title={school.data.school}
                type={school.data.major}
                desc={`${school.data["start-year"]} ~ ${school.data["end-year"]} |
                    ${school.data.status} | ${school.data["school-type"]}
                `}
            />
            {/each}
        </div>
    </section>
    <section id="certification">
        <h1>자격증 및 자격시험</h1>
        <div class="list">
            {#each data.certification as cert}
            <Card icon={cert.data.type === "certificate" ? "badge" : 
                    cert.data.type === "test" ? "quiz" : "glyphs"}
                href={cert.data.link}
                title={cert.data.title}
                type={cert.data.score}
                desc={`${cert.data["date"]} | ${cert.data.org}`}
            />
            {/each}
        </div>
    </section>
</main>

<style>
   
    main {
        padding: 0 1rem 0 1rem;
    }

    .list {
        display: flex;
        flex-wrap: wrap;
        align-items: stretch;
        gap: 1em;
    }

    @media screen and (max-width: 531px) {
        .list {
            justify-content: center;
        }

        div {
            width: 100%;
        }
    }
</style>