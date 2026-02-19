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
    <section id="project">
        <div class="desc">
            <h1>지금 진행 중</h1>
            <p>
                취미부터 생활 속 불편함까지, 다양한 개인 및 팀 프로젝트를 기획하고 만들고 있어요.
                <Link href="https://github.com/lego37yoon?tab=repositories" external>
                    다른 프로젝트 찾아보기
                </Link>
            </p>
        </div>
        <div class="list">
            {#each data.project as project}
            <Card icon={project.data.icon}
                href={project.data.link} title={project.data.title} 
                desc={project.data.desc} type={project.data.type} />
            {/each}
        </div>
    </section>
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
        .list {
            justify-content: center;
        }

        div {
            width: 100%;
        }
    }
</style>
