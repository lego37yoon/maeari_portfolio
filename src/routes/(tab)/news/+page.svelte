<script>
    import "@material/web/icon/icon.js";
    import '@material/web/list/list-item-link.js';
    import '@material/web/list/list-item.js';
    import '@material/web/divider/divider.js';
    import '@material/web/list/list.js';
    import { darkMode } from "../../../components/darkMode";
    import { onMount } from "svelte";

    /** @type {import('./$types').PageData} */
    export let data;

    const twitterHandle = import.meta.env.VITE_TWITTER_HANDLE;
    let notOverflowedList;
    let _postItems = [];
    $: postItems = _postItems.filter(Boolean);
    $: if (postItems.length > 0) {
        for(let i = 0; i < postItems.length; i++) {
            postItems[i].shadowRoot.adoptedStyleSheets = 
                [...postItems[i].shadowRoot.adoptedStyleSheets, notOverflowedList ];
        }
    }

    onMount(async () => {
        notOverflowedList = new CSSStyleSheet;
        notOverflowedList.replaceSync(`
            .label-text {
                display: block;
            }

            .body {
                min-width: 0;
            }
        `);
    });
</script>

<svelte:head>
    <meta name="description" content="최근 소식을 한 곳에서 확인하세요">
    <meta property="og:title" content="소식 | 종이상자 공간">
    <meta property="og:description" content="최근 소식을 한 곳에서 확인하세요">
    <meta name="twitter:title" content="소식 | 종이상자 공간">
    <meta name="twitter:description" content="최근 소식을 한 곳에서 확인하세요">
    <title>소식 | 종이상자 공간</title>
</svelte:head>

<main>
    <section id="blog">
        <h1>블로그에 새로 작성한 글을 만나보세요</h1>
        <p>기기 및 소프트웨어 리뷰, 개발 후기, 회고록 등을 게시하고 있어요.</p>
        <div id="postDecorator">
            <md-list id="postList">
                {#each data.posts as post, index}
                <a href={post.link} target="_blank">
                    <md-list-item bind:this={_postItems[index]} headline={post.title} supportingText={`${post.pubDate}${post.category ? ` | ${post.category[0]}` : ""}`}>
                        <md-icon slot="start">{post.category ? "post" : "announcement"}</md-icon>
                    </md-list-item>
                </a>
                {/each}
            </md-list>
        </div>
        <a class="more" href={`${data.url}`} target="_blank">
            <md-icon>link</md-icon>
            더보기
        </a>
    </section>
    
    <section id="twitter">
        <h1>트위터에서는 이런 소식을 안내하고 있어요</h1>
        {#key $darkMode}
        <section id="twitterSlot" >
            <a class="twitter-timeline more" data-width="500" data-height="500" data-lang="ko" data-dnt="true" 
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

    h1 {
        margin-bottom: 0;
    }

    #postDecorator {
        margin-bottom: 2em;
    }

    md-list {
        border-radius: 8px;
        border: 1px solid var(--md-sys-color-outline);
        overflow: hidden;
    }

    md-list a {
        text-decoration: none;
    }

    md-list-item {
        overflow-x: hidden;
        text-overflow: ellipsis;
        white-space: nowrap;
    }

    md-list-item md-icon {
        margin-inline-start: 1em;
    }

    #twitterSlot {
        margin-top: 2em;
    }

    .more {
        background: var(--md-sys-color-surface, #edf3f7);
        border: 1px solid var(--md-sys-color-surface, grey);
        border-radius: 24px;

        padding: 1em;

        text-decoration: none;
    }

    .more md-icon {
        vertical-align: middle;
        margin-inline-end: 0.2em;
    }

</style>