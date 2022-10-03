<script>
    import { onMount } from 'svelte';
    import { fade } from 'svelte/transition';
    import { fireData } from "./backend/+server.js";
    import { onSnapshot, doc } from "firebase/firestore";

    export const prerender = true;
    const delay = (ms) => new Promise((resolve) => setTimeout(resolve, ms));
    
    // Initialize variables
    let currentNoticeCount = 1;
    let maxNoticeCount = 2;
    let teaserTitle="안녕하세요, 여러분!";
    let teaserText="제 포트폴리오 웹사이트에 오신 걸 환영합니다."
    let noticeArray;
    let noticeChange = true;
    let slideWorking = false;
    let teaserNotice="현재 공지사항을 확인하고 있습니다.";
    let teaserLinkText="";
    let teaserLink="";
    let teaserBackground="linear-gradient(45deg, cadetblue, cornflowerblue)";

    async function slideShow() {
        for (let i = 0; i < noticeArray.length;) {
            if (noticeChange) {
                currentNoticeCount = i + 1;
                teaserNotice = noticeArray[i].text;
                teaserLinkText = noticeArray[i]["link-title"] + " >";
                teaserLink = noticeArray[i].link;
                teaserBackground = noticeArray[i].background;    
                if (i == noticeArray.length - 1) {
                    i = -1;
                }
                i++;
            }
            await delay(5000);
        }
    }

    onSnapshot(doc(fireData, "teaser", "intro"), (teaserData) => {
        if (teaserData.data().title !== undefined) {
            teaserTitle = teaserData.data().title;
            teaserText = teaserData.data().desc;
        }
    });

    onSnapshot(doc(fireData, "teaser", "notice"), (noticeData) => {
        if (teaserData.data().data !== undefined) {
            noticeArray = noticeData.data().data;
            maxNoticeCount = noticeArray.length;

            if (!slideWorking) {
                slideWorking = true;
                slideShow();
            }
        }
    });

    function playPauseEvent() {
        if (playNoticeButton.on) {
            noticeChange = false;
        } else {
            noticeChange = true;
        }
    }

    onMount(async () => {
        await import("@material/mwc-icon")
        await import("@material/mwc-icon-button-toggle");
    });
</script>

{#key teaserNotice}
<section id="teaserArea" style:background={teaserBackground}>
    <section id="Notice">
        <p class="teaserTitle">{teaserTitle}</p>
        <p class="teaserText normalBannerText">{teaserText}</p>
        {#if maxNoticeCount > 0}
        <p class="smallBannerText teaserText" in:fade><mwc-icon>announcement</mwc-icon>{teaserNotice}</p>
        <p class="smallBannerText teaserText" in:fade>
            <a class="teaserLink" href="{teaserLink}">{teaserLinkText}</a>
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
        <mwc-icon-button-toggle id="playNoticeButton" onIcon="play_arrow" offIcon="pause" aria-label="teaser play or pause button" on:icon-button-toggle-change="{playPauseEvent}"></mwc-icon-button-toggle>
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
        font-weight: 300;
        color: white;
    }

    .teaserLink {
        color: white;
        text-decoration: none;
        margin: 0 5px 0 5px;
        border-bottom: solid 2px white;
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

    #teaserCount mwc-icon-button-toggle {
        margin-top: -1rem;
        margin-right: -1rem;
    }

    /* navigation bar CSS */
    section {
        font-size: 1.5rem;
    }

    mwc-icon {
        margin-right: 0.5rem;
        --mdc-icon-size: 16px;
    }
</style>