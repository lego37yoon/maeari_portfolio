<script>
    import "@material/web/icon/icon.js";
    import { darkMode } from "../../components/darkMode";

    const twitterHandle = import.meta.env.VITE_TWITTER_HANDLE; 
</script>

<svelte:head>
    <title>소식 | 종이상자 공간</title>
</svelte:head>

<main>
    <section id="blog">
        <h1>블로그에 새로 작성한 글을 만나보세요</h1>
        <p>준비 중이에요</p>
    </section>
    
    <section id="twitter">
        <h1>트위터에서는 이런 소식을 안내하고 있어요</h1>
        {#key $darkMode}
        <section id="twitterSlot" >
            <a class="twitter-timeline" data-width="500" data-height="500" data-lang="ko" data-dnt="true" 
                data-theme={$darkMode ? "dark" : "light"}
                href="https://twitter.com/{twitterHandle}?ref_src=twsrc%5Etfw">
                <md-icon>link</md-icon>
                @{twitterHandle} 계정 바로가기
            </a>
            <script async src="https://platform.twitter.com/widgets.js" charset="utf-8"></script>
        </section>
        {/key}
    </section>
</main>

<style>
    main {
        padding: 0 1rem 0 1rem;
    }

    .twitter-timeline {
        background: var(--md-sys-color-surface, #edf3f7);
        border: 1px solid var(--md-sys-color-surface, grey);
        border-radius: 24px;

        padding: 1em;

        text-decoration: none;
    }

    .twitter-timeline md-icon {
        vertical-align: sub;
        margin-inline-end: 0.2em;
    }

</style>