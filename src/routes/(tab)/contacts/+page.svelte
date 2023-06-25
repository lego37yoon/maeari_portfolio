<script>
    import "@material/web/icon/icon.js";
    import Card from "../../../components/Card.svelte";

    /** @type {import('./$types').PageData} */
    export let data;


</script>

<svelte:head>
    <meta name="description" content="연락 방법을 확인하실 수 있습니다.">
    <title>연락처 | 종이상자 공간</title>
</svelte:head>

<main>
    {#if data.social}
    <h2>소셜 미디어에서 만나보세요</h2>
    <section id="social">
        {#if data.social.twitter.length > 0}
        <div id="twitter">
            <h3>트위터</h3>
            <div class="list">
            {#each data.social.twitter as account}
                <Card
                    icon="badge"
                    href="https://twitter.com/{account.handle}"
                    type={account.type}
                    title="@{account.handle}"
                    desc={account.desc}
                />
            {/each}
            </div>
        </div>
        {/if}
        
        {#if data.social.blog.length > 0}
        <div id="blog">
            <h3>블로그</h3>
            <div class="list">
            {#each data.social.blog as account}
                <Card
                    icon="edit_note"
                    href={account.url}
                    title={account.title}
                    type={account.provider}
                    desc={account.desc}
                />
            {/each}
            </div>
        </div>
        {/if}

        {#if data.social.fediverse.length > 0}
        <div id="fediverse">
            <h3>연합우주</h3>
            <div class="list">
            {#each data.social.fediverse as account}
                <Card
                    icon="chat_bubble"
                    href="https://{account.url}/@{account.handle}"
                    title={`@${account.handle}@${account.url}`}
                    type={account.type}
                    desc={account.desc}
                />
            {/each}
            </div>
        </div>
        {/if}
    </section>
    {/if}
    
    {#if data.dev}
    <h2>프로젝트 관련 오류, 개선사항 등은 저장소 이슈트래커에 남겨주세요</h2>
    <section id="dev">
        {#if data.dev.git.length > 0}
        <div id="git">
            <h3>Git 저장소</h3>
            <div class="list">
            {#each data.dev.git as account}
                <Card
                    href={account.url}
                    icon={account.type === "개인" ? "terminal" : "stack"}
                    title={account.handle}
                    type="{account.provider} | {account.type}"
                    desc={account.desc}
                />
            {/each}
            </div>
        </div>
        {/if}
    </section>
    {/if}

    {#if data.email}
    <h2>이메일로도 문의하실 수 있습니다</h2>
    <section id="email">
        {#if data.email.personal.length > 0}
        <div id="email">
            <h3>개인</h3>
            <div class="list">
            {#each data.email.personal as account}
                <Card href="mailto:{account.address}"
                    icon="mail"
                    title={account.address}
                    type={account.provider}
                    desc={account.desc}
                />
            {/each}
            </div>
        </div>
        {/if}

        {#if data.email.school.length > 0}
        <div id="email">
            <h3>학교</h3>
            <div class="list">
            {#each data.email.school as account}
                <Card href="mailto:{account.address}"
                    icon="school"
                    title={account.address}
                    type={account.organization}
                    desc={account.desc}
                />
            {/each}
            </div>
        </div>
        {/if}

        {#if data.email.work.length > 0}
        <div id="email">
            <h3>직장</h3>
            <div class="list">
            {#each data.email.work as account}
                <Card href="mailto:{account.address}"
                    icon="school"
                    title={account.address}
                    type={account.organization}
                    desc={account.desc}
                />
            {/each}
            </div>
        </div>
        {/if}
    </section>
    {/if}
</main>

<style>
   
    main {
        padding: 0 1rem 0 1rem;
    }

    h2 {
        margin-bottom: 0;
    }

    section {
        display: flex;
        flex-wrap: wrap;
        gap: 1em;
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