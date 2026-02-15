<script>
    import "@material/web/icon/icon.js";
    import "@material/web/iconbutton/icon-button.js";
    import { onMount } from 'svelte';
    import { page } from '$app/state';
    import { darkMode } from "../../components/darkMode"; 

    let darkModeButton = undefined;
    let darkModeState = $state(false);
    let { children } = $props();

    $effect(() => {
        const unsubscribe = darkMode.subscribe((value) => {
            darkModeState = value;
        });

        return unsubscribe;
    });

    function darkToggleEvent() {
        if (darkModeButton.selected) {
            document.body.classList.add("dark");
            darkMode.set(true);
        } else {
            document.body.classList.remove("dark");
            darkMode.set(false);
        }
    }
    
    onMount(async () => {
        if (window.matchMedia('(prefers-color-scheme: dark)').matches) {
            darkModeButton.setAttribute("selected", "");
            document.body.classList.add("dark");
            darkMode.set(true);
        }

        window.matchMedia('(prefers-color-scheme: dark)').addEventListener('change', event => {
            const colorSet = event.matches ? "dark":"light";
            if (colorSet === "dark") {
                darkModeButton.setAttribute("selected", "");
                document.body.classList.add("dark");
                darkMode.set(true);
            } else {
                darkModeButton.removeAttribute("selected");
                document.body.classList.remove("dark");
                darkMode.set(false);
            }
        });
    });
</script>
<header>
    <ul>
        <li>
            <p>
                <md-icon-button href="javascript:window.history.back()" id="mainPageButton" aria-label="뒤로가기">
                    <md-icon>arrow_back</md-icon>
                </md-icon-button>
                <md-icon-button href={page.url.origin} id="mainPageButton" aria-label="홈으로 돌아가기">
                    <md-icon>home</md-icon>
                </md-icon-button>                
            </p>
        </li>
    </ul>
    <ul class="rightMenu">
        <li id="displayToggle">
            <p>
                <md-icon-button bind:this={darkModeButton} id="darkModeButton" toggle role="switch" aria-checked={darkModeState} tabindex="0" aria-label="toggle dark or light mode" onclick={darkToggleEvent} onkeypress={darkToggleEvent}>
                    <md-icon>dark_mode</md-icon>
                    <md-icon slot="selectedIcon">light_mode</md-icon>
                </md-icon-button>
            </p>
        </li> 
    </ul>
</header>

{@render children()}

<style>
    header {
        font-family: 'SUIT Variable', 'Noto Sans CJK KR Light', sans-serif;
        font-weight: lighter;
        font-size: 1.2em;
        height: 4rem;
    }

    header ul {
        list-style: none;
        display: inline;
        padding: 0;
    }

    header li {
        font-family: 'SUIT Variable', 'Noto Sans CJK KR Light', sans-serif;
        font-weight: 300;
        color: var(--mfp-primary-text-color);
    }

    header li p {
        margin: 0.5em;
        float: left;
        color: var(--mfp-static-header-text-color);
        text-decoration: none;
        display: flex;
        gap: 0.5em;
    }

    /* 같은 위치, 같은 CSS로 p 태그와 a 태그에 같은 margin을 부여해도 크기 차이가 나는 이유 알아보기: p의 0.6em과 a의 0.5em의 계산 값이 동일 */
    .rightMenu li p {
        margin: 0.6em;
        display: flex;
        float: right;
    }

    @media screen and (max-width: 265px) {
        .rightMenu {
            display: none;
        }
    }

    .rightMenu md-icon-button {
        --md-sys-color-on-surface-variant: var(--mfp-static-header-text-color);
        --md-sys-color-primary: var(--mfp-static-header-text-color);
    }
</style>
