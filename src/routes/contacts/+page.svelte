<script>
    import "@material/web/icon/icon.js";

    /** @type {import('./$types').PageData} */
    export let data;


</script>

<svelte:head>
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
            <a class="account" href="https://twitter.com/{account.handle}" target="_blank">
                <md-icon>badge</md-icon>
                <span class="accountTitle">@{account.handle}</span>
                <span class="accountDesc">{account.desc}</span>
            </a>
            {/each}
            </div>
        </div>
        {/if}
        
        {#if data.social.blog.length > 0}
        <div id="blog">
            <h3>블로그</h3>
            <div class="list">
            {#each data.social.blog as account}
            <a class="account" href="{account.url}" target="_blank">
                <md-icon>edit_note</md-icon>
                <span class="accountTitle">{account.title}</span>
                <span class="accountDesc">
                    <span class="accountType">{account.provider}</span>
                    {account.desc}
                </span>
            </a>
            {/each}
            </div>
        </div>
        {/if}

        {#if data.social.fediverse.length > 0}
        <div id="fediverse">
            <h3>연합우주</h3>
            <div class="list">
            {#each data.social.fediverse as account}
            <a class="account" href="https://{account.url}/@{account.handle}" target="_blank">
                <md-icon>chat_bubble</md-icon>
                <span class="accountTitle">@{account.handle}@{account.url}</span>
                <span class="accountDesc">
                    <span class="accountType">{account.type}</span>
                    {account.desc}
                </span>
            </a>
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
            <a class="account" href="{account.url}" target="_blank">
                <md-icon>{account.type === "개인" ? "terminal" : "stack"}</md-icon>
                <span class="accountTitle">{account.handle}</span>
                <span class="accountDesc">
                    <span class="accountType">{account.provider} | {account.type}</span>    
                    {account.desc}
                </span>
            </a>
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
            <a class="account" href="mailto:{account.address}">
                <md-icon>mail</md-icon>
                <span class="accountTitle">{account.address}</span>
                <span class="accountDesc">
                    <span class="accountType">{account.provider}</span>    
                    {account.desc}
                </span>
            </a>
            {/each}
            </div>
        </div>
        {/if}

        {#if data.email.school.length > 0}
        <div id="email">
            <h3>학교</h3>
            <div class="list">
            {#each data.email.school as account}
            <a class="account" href="mailto:{account.address}">
                <md-icon>school</md-icon>
                <span class="accountTitle">{account.address}</span>
                <span class="accountDesc">
                    <span class="accountType">{account.organization}</span>    
                    {account.desc}
                </span>
            </a>
            {/each}
            </div>
        </div>
        {/if}

        {#if data.email.work.length > 0}
        <div id="email">
            <h3>직장</h3>
            <div class="list">
            {#each data.email.work as account}
            <a class="account" href="mailto:{account.address}">
                <md-icon>school</md-icon>
                <span class="accountTitle">{account.address}</span>
                <span class="accountDesc">
                    <span class="accountType">{account.organization}</span>    
                    {account.desc}
                </span>
            </a>
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

    .account {
        aspect-ratio: 1 / 1;
        background: var(--md-sys-color-surface, #edf3f7);
        border: 1px solid var(--md-sys-color-surface, grey);
        border-radius: 24px;
        padding: 1em;
        text-decoration: none;
        flex-basis: 12em;
        width: 12em;
    }

    .accountTitle {
        font-size: 1.2em;
        text-align: center;
        display: block;
        overflow-x: hidden;
        text-overflow: ellipsis;
    }

    .account md-icon {
        display: block;
        text-align: center;
        --md-icon-size: 48px;
    }

    .accountDesc {
        margin-top: 0.5em;
        display: block;
        color: cadetblue
    }

    .accountType {
        display: block;
        text-align: center;
        color: cornflowerblue;
        margin: 0.5em;
        background: var(--md-sys-color-background);
        border-radius: 24px;
        padding: 0.5em;
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