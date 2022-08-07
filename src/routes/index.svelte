<script>
    import { onMount } from 'svelte';
    import { initializeApp } from "firebase/app";
    import { getFirestore } from "firebase/firestore";

    onMount(async () => {
        await import("@material/mwc-tab-bar");
        await import("@material/mwc-tab");
    });

    // TODO: Add SDKs for Firebase products that you want to use
    // https://firebase.google.com/docs/web/setup#available-libraries
    // Your web app's Firebase configuration
    // For Firebase JS SDK v7.20.0 and later, measurementId is optional

    

    // Initialize Firebase
    const app = initializeApp(firebaseConfig);
    
</script>

<section id="teaserArea">
    <h1 class="teaserTitle">안녕하세요, <br>종이상자입니다.</h1>
    <p class="teaserText">오픈소스를 좋아하고, 다양한 웹 기술에 관심이 많은 순천향대학교 컴퓨터소프트웨어공학과 2학년 휴학생이에요.</p>
    <p><a class="teaserLink" href="https://latios.pbdiary.pw">latiosOSC&nbsp;&gt;</a><a class="teaserLink" href="https://space.pbdiary.pw">과거 모습&nbsp;&gt;</a></p>
    <p class="teaserText smallText">&lowast; latiosOSC는 더이상 운영되지 않으며, pbspace와 통합되었습니다.</p>
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

    /* 글꼴 크기 조절 CSS */

    .smallText {
        font-size: 0.8em;
    }

    /* teaser 공간 CSS */
    #teaserArea {
        padding: 1em;
        background: linear-gradient(45deg, cadetblue, cornflowerblue);
        word-break: keep-all;
    }

    .teaserText {
        color: white;
        font-weight: 300;
    }

    .teaserLink {
        text-decoration: none;
        margin: 0 5px 0 5px;
        color: white;
        border-bottom: solid 2px white;
    }
    .teaserLink:visited {
        text-decoration: none;
        color: white;
    }

    .teaserTitle {
        font-family: 'SUIT Variable', 'Noto Sans CJK KR Light', sans-serif;
        font-size: 2em;
        font-weight: 200;
        color: white;
    }

    /* navigation bar CSS */
    section {
        font-size: 1.5em;
    }
</style>