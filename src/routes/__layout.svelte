<script>
    import "./index.scss";
</script>

<header>
    <ul>
        <li class="title">paperbox</li>
        <ul class="rightMenu" role="navigation">
            <li><a href="https://pbdiary.pw" target="_blank">blog</a></li>
            <li><a href="https://github.com/lego37yoon" target="_blank">github</a></li>
        </ul>
    </ul>
</header>

<slot></slot>

<footer>
    <p>copyright by 2022 종이상자. Made with Svelte + SvelteKit</p>
</footer>

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
</style>