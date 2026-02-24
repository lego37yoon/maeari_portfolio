<script>
    import Card from '../../components/Card.svelte';
    import Link from '../../components/Link.svelte';

    let { data } = $props();
</script>

<svelte:head>
    <meta property="og:title" content="종이상자 공간">
    <meta property="og:description" content="진행 중인 프로젝트, 활동 및 소식">
    <meta name="description" content="진행 중인 프로젝트, 활동 및 소식">
    <title>종이상자 공간</title>
</svelte:head>

<main>
    {#if data.active.length > 0}
    <section id="project_active">
        <div class="desc">
            <h1>지금 진행 중</h1>
            <p>
                개발과 운영이 활발하게 이뤄지는 프로젝트에요
                <Link href="https://github.com/lego37yoon?tab=repositories" external>
                    다른 프로젝트 찾아보기
                </Link>
            </p>
        </div>
        <div class="list">
            {#each data.active as project}
            <Card icon={project.data.icon}
                href={project.data.link} title={project.data.title} 
                desc={project.data.desc} type={project.data.type} />
            {/each}
        </div>
    </section>
    {/if}
    {#if data.in_development.length > 0}
    <section id="project_under_development">
        <div class="desc">
            <h1>개발 중</h1>
            <p>곧 만나보실 수 있어요</p>
        </div>
        <div class="list">
            {#each data.in_development as project}
            <Card icon={project.data.icon}
                href={project.data.link} title={project.data.title} 
                desc={project.data.desc} type={project.data.type} />
            {/each}
        </div>
    </section>
    {/if}
    {#if data.maintenance.length > 0}
    <section id="project_maintenance">
        <div class="desc">
            <h1>유지관리 중</h1>
            <p>활발하게 개발하고 있진 않지만, <br> 데이터 추가와 함께 최소한의 관리를 진행 중인 프로젝트에요</p>
        </div>
        <div class="list">
            {#each data.maintenance as project}
            <Card icon={project.data.icon}
                href={project.data.link} title={project.data.title} 
                desc={project.data.desc} type={project.data.type} />
            {/each}
        </div>
    </section>
    {/if}
    {#if data.deprecated.length > 0}
    <section id="project_deprecated">
        <div class="desc">
            <h1>개발 종료</h1>
            <p>연계 서비스 · 팀 활동 종료 등으로 마무리된 프로젝트에요</p>
        </div>
    </section>
    {/if}
</main>

<style>
    main {
        padding: 0 2rem;
    }

    section {
        display: flex;
    }

    section .desc {
        width: 24rem;
    }
    
    h1, p {
        margin: 0;
    }

    .list {
        display: flex;
        flex-wrap: wrap;
        gap: 1em;
    }
    
    @media screen and (max-width: 531px) {
        div {
            width: 100%;
        }
    }
</style>
