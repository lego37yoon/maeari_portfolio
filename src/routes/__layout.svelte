<style>
    /* 헤더 부분 UI CSS */

    header {
        font-family: 'SUIT Variable', 'Noto Sans CJK KR Light', sans-serif;
        font-weight: lighter;
        color: cadetblue;
        font-size: 1.5em;
        height: 3em;
        border-bottom: solid 2px cadetblue;
    }

    header ul {
        list-style: none;
        display: inline;
        padding: 0;
    }

    header li {
        font-family: 'SUIT Variable', 'Noto Sans CJK KR Light', sans-serif;
        font-weight: lighter;
        color: cadetblue;
    }

    .title {
        margin: 1em 1em 0.5em 1em;
        font-weight: 600;
        float: left;
    }
    .rightMenu {
        margin: 1em 1em 0.5em 1em;
        display: inline;
        float: right;
    }
    .rightMenu li {
        display: inline;
        font-size: 0.8em;
    }

    .rightMenu a {
        color: cadetblue;
        text-decoration: none;
    }

    /* 공통 CSS */
    p {
        font-family: 'SUIT Variable', 'Noto Sans CJK KR Light', sans-serif;
        font-weight: normal;
        color: cadetblue;
        font-size: 1.0em;
    }

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

<script>
    import {TabGroup, TabList, Tab} from "@rgossiaux/svelte-headlessui";
</script>

<header>
    <ul>
        <li class="title">paperbox</li>
        <ul class="rightMenu">
            <li><a href="https://pbdiary.pw" target="_blank">blog</a></li>
            <li><a href="https://github.com/lego37yoon" target="_blank">github</a></li>
        </ul>
    </ul>
</header>

<section id="teaserArea">
    <h1 class="teaserTitle">안녕하세요, <br>종이상자입니다.</h1>
    <p class="teaserText">오픈소스를 좋아하고, 다양한 웹 기술에 관심이 많은 순천향대학교 컴퓨터소프트웨어공학과 2학년 휴학생이에요.</p>
    <p><a class="teaserLink" href="https://latios.pbdiary.pw">latiosOSC&nbsp;&gt;</a><a class="teaserLink" href="https://space.pbdiary.pw">과거 모습&nbsp;&gt;</a></p>
    <p class="teaserText smallText">&lowast; latiosOSC는 더이상 운영되지 않으며, pbspace와 통합되었습니다.</p>
</section>

<TabGroup as="nav" defaultIndex={1}>
    <TabList>
        <Tab>전체</Tab>
        <Tab>하고 있는 것</Tab>
        <Tab>했던 것</Tab>
        <Tab>해보고 싶은 것</Tab>
        <Tab>그 밖에</Tab>
    </TabList>
    <slot></slot>
</TabGroup>

<footer>
    <p>copyright by 2022 종이상자. Made with Svelte + SvelteKit</p>
</footer>