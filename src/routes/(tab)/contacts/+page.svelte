<script>
    import "@material/web/icon/icon.js";
    import Card from "../../../components/Card.svelte";

    let { data } = $props();


</script>

<svelte:head>
    <meta name="description" content="연락 방법을 확인하실 수 있습니다.">
    <meta property="og:title" content="연락처 | 종이상자 공간">
    <meta property="og:description" content="연락 방법을 확인하실 수 있습니다.">
    <meta name="twitter:title" content="연락처 | 종이상자 공간">
    <meta name="twitter:description" content="연락 방법을 확인하실 수 있습니다.">
    <title>연락하기: 종이상자 공간</title>  
</svelte:head>

<main>
    {#if data.social}
    <section id="social">
        <div class="desc">
            <h1>소셜 미디어</h1>
        </div>
        {#if data.social.twitter.length > 0}
        <div id="twitter">
            <h2>트위터</h2>
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
            <h2>블로그</h2>
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
            <h2>연합우주</h2>
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
    <section id="dev">
        <div class="desc">
            <h1>코드 저장소</h1>
        </div>
        {#if data.dev.git.length > 0}
        <div id="git">
            <h2>Git</h2>
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
    <section id="email">
        <div class="desc">
            <h1>이메일</h1>
        </div>
        {#if data.email.personal.length > 0}
        <div id="email">
            <h2>개인</h2>
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
            <h2>학교</h2>
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
            <h2>직장</h2>
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
