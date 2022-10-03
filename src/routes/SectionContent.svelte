<script>
    import { onMount } from 'svelte';
    import { fireData } from "./backend/+server.js";
    import { onSnapshot, doc } from "firebase/firestore";

    export let mainMenu;
    export let subMenu;
    export let subMenuName;
    let ifLoaded = false;
    let noData = false;

    onMount(async() => {
        await import("@material/mwc-list");
    });

</script>

{#if noData === false}
    <h2>{subMenuName}</h2>
{#if ifLoaded === true}
    <mwc-list>
        <mwc-list-item graphic="icon" twoline>

        </mwc-list-item>
        <li divider inset padded role="separator"></li>
    </mwc-list>
{:else}
    <p>데이터를 불러오는 중입니다. 잠시만 기다려주세요.</p>
{/if}
{/if}

<style>
    mwc-list {
        border-radius: 10px;
    }
</style>