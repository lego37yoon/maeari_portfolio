<script>
    import Card from '../../../components/Card.svelte';
    import Link from '../../../components/Link.svelte';

    let { data } = $props();
</script>

<main>
    <section id="contribution">
        <div class="desc">
            <h1>오픈소스 기여 활동</h1>
            <p>번역에서 시작해, 더 다양한 기여를 할 수 있도록 노력하고 있어요.</p>
        </div>
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
        <div class="desc">
            <h1>참여한 활동</h1>
            <p>다양한 활동에 참여하여 성장하고 있어요.</p>
        </div>
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