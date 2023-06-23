<script>
    import Card from '../components/Card.svelte';

    /** @type {import('./$types').PageData} */
    export let data;
</script>

<svelte:head>
    <title>홈 | 종이상자 공간</title>
</svelte:head>

<main>
    <section id="project">
        <h1>주요 프로젝트 바로가기</h1>
        <p>
            취미부터 생활 속 불편함까지, 다양한 개인 및 팀 프로젝트를 기획하고 만들고 있어요.
            <a href="https://github.com/lego37yoon?tab=repositories" target="_blank">
                다른 프로젝트 찾아보기
            </a>
        </p>
        <div class="list">
            {#each data.project as project}
            <Card icon={project.data.icon}
                href={project.data.link} title={project.data.title} 
                desc={project.data.desc} type={project.data.type} />
            {/each}
        </div>
    </section>
    <section id="contribution">
        <h1>오픈소스 기여 활동</h1>
        <p>번역에서 시작해, 더 다양한 기여를 할 수 있도록 노력하고 있어요.</p>
        <div class="list">
            {#each data.contribution as project}
            <Card icon={project.data.icon}
                href={project.data.link} title={project.data.title} 
                desc={[(project.data["end-year"] !== undefined ?
                    `${project.data["start-year"]} ~ ${project.data["end-year"]}` :
                    `${project.data["start-year"]} ~ 현재`), project.data.desc]}
                type={project.data.role}
            />
            {/each}
        </div>
    </section>
    <section id="activity">
        <h1>참여한 활동</h1>
        <p>다양한 활동에 참여하여 성장하고 있어요.</p>
        <div class="list">
            {#each data.activity as act}
            <Card icon={act.data.icon}
                href={act.data.link} title={act.data.title} 
                desc={[act.data.team ? `${act.data.members}명 단체 참여` : "개인 참여",
                    `주최 | ${act.data.org[0]}`
                ]} 
                type={act.data.prize}
            />
            {/each}
        </div>
    </section>
</main>

<style>
    main {
        padding: 0 1rem 0 1rem;
    }

    h1 {
        margin-bottom: 0px;
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