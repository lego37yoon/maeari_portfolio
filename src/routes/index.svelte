<script>
    import { onMount } from 'svelte';
    import { initializeApp } from "firebase/app";
    import { getFirestore } from "firebase/firestore";
    import { firebaseConfig } from "./secrets.js";

    // Initialize Firebase
    const app = initializeApp(firebaseConfig);
    let maxTeaserContentCount = "02";
    let teaserTitle="안녕하세요, 종이상자입니다.";
    let teaserText="오픈소스를 좋아하고, 다양한 웹 기술에 관심이 많은 순천향대학교 컴퓨터소프트웨어공학과 2학년 휴학생이에요."
    let teaserNotice="latiosOSC는 더이상 운영되지 않으며, pbspace와 통합되었습니다.";
    let teaserLinkText="과거 모습 >";
    let teaserLink="https://space.pbdiary.pw"
    
    onMount(async () => {
        await import("@material/mwc-tab-bar");
        await import("@material/mwc-tab");
        await import("@material/mwc-icon")
        await import("@material/mwc-icon-button-toggle");
    });
</script>

<section id="teaserArea">
    <section id="teaserContent">
        <h1 class="teaserTitle">{teaserTitle}</h1>
        <p class="teaserText normalBannerText">{teaserText}</p>
        <p class="smallBannerText teaserText"><mwc-icon>announcement</mwc-icon>{teaserNotice}</p>
        <p class="smallBannerText teaserText">
            <a class="teaserLink" href="{teaserLink}">{teaserLinkText}</a>
        </p>
    </section>
    <section id="teaserCount">
        <h1 id="currentCount">01</h1>
        <p></p>
        <h1 id="maxCount">{maxTeaserContentCount}</h1>
        <mwc-icon-button-toggle onIcon="play_arrow" offIcon="pause" aria-label="teaser play or pause button"></mwc-icon-button-toggle>
    </section>
</section>

<mwc-tab-bar activeIndex="1">
    <mwc-tab isMinWidthIndicator label="전체"/>
    <mwc-tab isMinWidthIndicator label="진행 중"/>
    <mwc-tab isMinWidthIndicator label="과거 활동"/>
    <mwc-tab isMinWidthIndicator label="그 밖에"/>
</mwc-tab-bar>

<main>
    <h1></h1>
</main>

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
        background: linear-gradient(45deg, cadetblue, cornflowerblue);
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
        font-size: 2rem;
        font-weight: 200;
    }

    #teaserCount h1 {
        font-size: 1.1rem;
        text-align: end;
    }

    #maxCount {
        color: gainsboro;
    }

    #teaserCount p {
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

    mwc-tab {
        --mdc-typography-button-font-size: 1.0rem;
        --mdc-typography-button-font-weight: 300;
    }

    mwc-icon {
        margin-right: 0.5rem;
        --mdc-icon-size: 16px;
    }
</style>