<script>
    import "@material/web/icon/icon.js";
    import "@material/web/iconbutton/icon-button.js";
    import { fade } from 'svelte/transition';

    const delay = (ms) => new Promise((resolve) => setTimeout(resolve, ms));
    const defaultTeaserData = {
        intro: {
            title: "안녕하세요,",
            desc: "포트폴리오 사이트에 오신 것을 환영합니다"
        },
        notice: {
            data: [
                {
                    background: "linear-gradient(45deg, cadetblue, cornflowerblue)",
                    enabled: true,
                    text: "공지사항을 확인하고 있어요."
                }
            ]
        }
    };
    const defaultNotice = {
        background: "linear-gradient(45deg, cadetblue, cornflowerblue)",
        text: "공지사항을 확인하고 있어요."
    };

    let { teaserData = defaultTeaserData } = $props();
    const notices = $derived(teaserData.notice?.data?.length ? teaserData.notice.data : [defaultNotice]);
    const maxNoticeCount = $derived(notices.length || 1);
    let currentNoticeCount = $state(1);
    let noticeChange = $state(true);
    let startCarousel = $state(false);
    const currentNotice = $derived(notices[currentNoticeCount - 1] ?? notices[0]);
    const teaserNotice = $derived(currentNotice?.text ?? "공지사항을 확인하고 있어요.");
    const teaserLinkText = $derived(currentNotice["link-title"] ?? "");
    const teaserLink = $derived(currentNotice.link ?? "");
    const teaserBackground = $derived(currentNotice.background ?? "linear-gradient(45deg, cadetblue, cornflowerblue)");
    let isNoticePlaying = $state(true);

    $effect(() => {
        if (maxNoticeCount > 1 && !startCarousel) {
            startCarousel = true;
            void slideShow();
        }
    });

    async function slideShow() {
        for (let i = 0; i < notices.length;) {
            if (noticeChange) {
                currentNoticeCount = i + 1;
                if (i === notices.length - 1) {
                    i = -1;
                }
                i++;
            }
            await delay(7000);
        }
    }

    function playPauseEvent() {
        isNoticePlaying = !isNoticePlaying;
        noticeChange = isNoticePlaying;
    }

</script>

<section id="teaserArea" style:background={teaserBackground}>
    <section id="Notice">
        <p class="teaserTitle">{teaserData.intro.title}</p>
        <p class="teaserText normalBannerText">{teaserData.intro.desc}</p>
        {#if maxNoticeCount > 0}
        {#key teaserNotice}
        <p class="smallBannerText teaserText" in:fade>
            <md-icon>tips_and_updates</md-icon>
            {teaserNotice}
            {#if teaserLink}
                <a class="teaserLink" href={teaserLink} target="_blank">{teaserLinkText ? teaserLinkText : "이동하기"} &gt;</a>
            {/if}
        </p>
        {/key}
        {/if}
    </section>
    {#if maxNoticeCount > 1}
    <section id="teaserCount">
        <p id="currentCount">
            {#if currentNoticeCount < 10}0{/if}{currentNoticeCount}
        </p>
        <p id="countBar"></p>
        <p id="maxCount">
            {#if maxNoticeCount < 10}0{/if}{maxNoticeCount}
        </p>
        <md-icon-button id="playNoticeButton" toggle role="button" tabindex="0" aria-label="pause or play announcements" onclick={playPauseEvent} onkeypress={playPauseEvent}>
            <md-icon>pause</md-icon>
            <md-icon slot="selectedIcon">play_arrow</md-icon>
        </md-icon-button>
    </section>
    {/if}
</section>

<style>
    .smallBannerText {
        font-size: 1.0rem;
    }

    .normalBannerText {
        font-size: 1.2rem;
    }

    /* teaser 공간 CSS */
    #teaserArea {
        color: white;
        padding: 1rem;
        display: flex;
        justify-content: space-between;
        word-break: keep-all;
        border-bottom-right-radius: 10px;
        border-bottom-left-radius: 10px;
    }

    .teaserText {
        color: white;
    }

    .teaserLink {
        color: white;
        text-decoration: none;
        margin: 0 5px 0 5px;
        border-bottom: solid 2px white;
        display: inline-block;
    }
    .teaserLink:visited {
        text-decoration: none;
        color: white;
    }

    .teaserTitle {
        color: white;
        font-size: 2rem;
        font-weight: 200;
    }

    #teaserCount #currentCount, #teaserCount #maxCount {
        font-size: 1.1rem;
        font-weight: 900;
        text-align: end;
    }

    #currentCount {
        color: white;
    }

    #maxCount {
        color: gainsboro;
    }

    #teaserCount #countBar {
        height: calc(100% - 10rem);
        border-right: 3px solid white;
    }

    #teaserCount md-icon-button {
        margin-top: -1rem;
        margin-right: -0.5rem;
        --md-icon-button-unselected-icon-color: #ffffff;
        --md-icon-button-unselected-focus-icon-color: #ffffff;
        --md-icon-button-selected-focus-icon-color: #ffffff;
    }

    @media screen and (max-width: 231px) {
        #teaserCount {
            display: none;
        }
    }

    /* navigation bar CSS */
    section {
        font-size: 1.5rem;
    }

    p md-icon {
        margin-right: 0.5rem;
        --md-icon-size: 16px;
    }
</style>
