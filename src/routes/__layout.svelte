<script>
    import "./index.scss";
    import { onMount } from 'svelte';

    const currentYear = new Date().getFullYear();
    
    onMount(async () => {
        await import("@material/mwc-tab-bar");
        await import("@material/mwc-tab");
        await import("@material/mwc-icon-button-toggle");

        if (window.matchMedia('(prefers-color-scheme: dark)').matches) {
            darkModeButton.setAttribute("on", "");
            document.body.classList.add("dark");
        }

        window.matchMedia('(prefers-color-scheme: dark)').addEventListener('change', event => {
            let colorSet = event.matches ? "dark":"light";
            if (colorSet == "dark") {
                darkModeButton.setAttribute("on", "");
                document.body.classList.add("dark");
            } else {
                darkModeButton.removeAttribute("on");
                document.body.classList.remove("dark");
            }
        });

        darkModeButton.addEventListener("icon-button-toggle-change", function() {
            if (darkModeButton.on) {
                document.body.classList.add("dark");
            } else {
                document.body.classList.remove("dark");
            }
        });
    });
</script>

<header>
    <ul>
        <li class="title"><a href="./">paperbox</a></li>
        <ul class="rightMenu" role="navigation">
            <li><a href="https://pbdiary.pw" target="_blank">blog</a></li>
            <li><a href="https://github.com/lego37yoon" target="_blank">github</a></li>
            <li><mwc-icon-button-toggle id="darkModeButton" onIcon="light_mode" offIcon="dark_mode" aria-label="toggle dark or light mode"></mwc-icon-button-toggle></li> 
        </ul>
    </ul>
</header>

<slot></slot>

<footer>
    <p>copyright by {currentYear} 종이상자. Made with &lt;3 and Svelte. <a href="./oss" target="_blank">OSS Notice</a></p>
</footer>

<style>
    /* 헤더 부분 UI CSS */
    header {
        font-family: 'SUIT Variable', 'Noto Sans CJK KR Light', sans-serif;
        font-weight: lighter;
        color: cadetblue;
        font-size: 1.5rem;
        height: 4rem;
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
        margin: 1.5rem 1rem 0.5rem 1rem;
        font-weight: 600;
        float: left;   
    }
    .title a {
        text-decoration: none;
    }
    .title a:visited {
        color: cadetblue;
    }
    .rightMenu {
        padding: 1.5rem 1rem 0.5rem 1rem;
        display: inline;
        float: right;
    }
    .rightMenu li {
        display: inline;
        font-size: 1.0em;
    }

    .rightMenu a {
        color: cadetblue;
        text-decoration: none;
    }

    .rightMenu mwc-icon-button-toggle {
        margin-top: -0.5rem;
        margin-bottom: -0.5rem;
    }

    /* 푸터 부분 CSS */
    footer p {
        padding: 1rem 1rem 0.5rem 1rem;
    }
</style>