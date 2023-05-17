<script>
    import "@material/web/icon/icon.js";
    import "@material/web/iconbutton/standard-icon-button.js";
    import { fade } from 'svelte/transition';
    
    const delay = (ms) => new Promise((resolve) => setTimeout(resolve, ms));
    
    // Initialize variables
    export let teaserData = {
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

    let currentNoticeCount = 1;
    let maxNoticeCount = teaserData.notice.data.length ?? 1;
    let noticeChange = true;
    let teaserNotice = teaserData.notice.data[0].text;
    let teaserLinkText = teaserData.notice.data[0]["link-title"];
    let teaserLink = teaserData.notice.data[0].link;
    let teaserBackground="linear-gradient(45deg, cadetblue, cornflowerblue)";

    if (teaserData.notice.data.length > 1) {
        slideShow();
    }

    async function slideShow() {
        for (let i = 0; i < teaserData.notice.data.length;) {
            if (noticeChange) {
                currentNoticeCount = i + 1;
                teaserNotice = teaserData.notice.data[i].text;
                teaserLinkText = teaserData.notice.data[i]["link-title"];
                teaserLink = teaserData.notice.data[i].link;
                teaserBackground = teaserData.notice.data[i].background;    
                if (i === teaserData.notice.data.length - 1) {
                    i = -1;
                }
                i++;
            }
            await delay(7000);
        }
    }

    function playPauseEvent() {
        if (playNoticeButton.selected) {
            noticeChange = false;
        } else {
            noticeChange = true;
        }
    }

</script>

{#key teaserNotice}
<section id="teaserArea" style:background={teaserBackground}>
    <section id="Notice">
        <p class="teaserTitle">{teaserData.intro.title}</p>
        <p class="teaserText normalBannerText">{teaserData.intro.desc}</p>
        {#if maxNoticeCount > 0}
        <p class="smallBannerText teaserText" in:fade>
            <md-icon>tips_and_updates</md-icon>
            {teaserNotice}
            {#if teaserLink}
                <a class="teaserLink" href={teaserLink ? teaserLink : "#"} target="_blank">{teaserLinkText ? teaserLinkText : "이동하기"} &gt;</a>
            {/if}
        </p>
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
        <md-standard-icon-button id="playNoticeButton" toggle aria-label="안내사항 일시정지 혹은 재생하기" on:click={playPauseEvent} on:keypress={playPauseEvent}>
            <md-icon>pause</md-icon>
            <md-icon slot="selectedIcon">play_arrow</md-icon>
        </md-standard-icon-button>
    </section>
    {/if}
</section>
{/key}

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
        font-family: 'SUIT Variable', 'Noto Sans CJK KR Light', sans-serif;
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

    #teaserCount md-standard-icon-button {
        margin-top: -1rem;
        margin-right: -0.5rem;
        --md-icon-button-unselected-icon-color: #ffffff;
        --md-icon-button-unselected-focus-icon-color: #ffffff;
        --md-icon-button-selected-focus-icon-color: #ffffff;
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