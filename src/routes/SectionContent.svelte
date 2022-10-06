<script>
    import { onMount } from 'svelte';
    import { fireData } from "./backend/+server.js";
    import { onSnapshot, doc } from "firebase/firestore";

    export let mainMenu;
    export let subMenu;
    export let subMenuName;
    let ifLoaded = false;
    let noData = false;
    let fetchedData = null;

    if (mainMenu != "all") {
        onSnapshot(doc(fireData, mainMenu, subMenu), (sectionData) => {
            if (sectionData.data() != undefined) {
                ifLoaded = true;
                fetchedData = sectionData.data();
            } else {
                noData = true;
            }
        });
    } else {
        //TODO: get other resources

        onSnapshot(doc(fireData, "others", "contact"), (sectionData) => {
            if (sectionData != undefined) {
                ifLoaded = true;
                if (fetchedData != null) {
                    fetchedData = fetchedData.concat(sectionData.data());
                } else {
                    fetchedData = sectionData.data();
                }
            } else {
                noData = true;
            }
        });
    }
    

    onMount(async() => {
        await import("@material/mwc-list");
        await import("@material/mwc-icon");
    });

</script>

{#if noData === false}
    <h2>{subMenuName}</h2>
{#if ifLoaded === true}
    {#if subMenu != "contact"}
        <mwc-list>
            <mwc-list-item graphic="icon" twoline>
                <span>개발 중인 버전이어서 아직 구현되지 않았습니다.</span>
                <span slot="secondary">조금만 더 기다려주시면 이 부분도 보실 수 있도록 개선할게요.</span>
                <mwc-icon slot="graphic">warning</mwc-icon>
            </mwc-list-item>
            <li divider inset padded role="separator"></li>
        </mwc-list>
    {:else}
        <p id="person_name">{fetchedData.name} a.k.a {fetchedData.nickname}</p>
        <p class="person_info" id="person_email"><mwc-icon>email</mwc-icon><a href="mailto:{fetchedData.email}" target="_blank">{fetchedData.email} ↗</a></p>
        <p class="person_info" id="person_github"><mwc-icon>code</mwc-icon><a href="https://github.com/{fetchedData.github}">GitHub ({fetchedData.github}) ↗</a></p>
        <p class="person_info" id="person_blog"><mwc-icon>rss_feed</mwc-icon><a href="{fetchedData.blog}" target="_blank">Blog ↗</a></p>
        <p class="person_info" id="person_twitter"><mwc-icon>forum</mwc-icon><a href="https://twitter.com/{fetchedData.twitter}" target="_blank">Twitter (@{fetchedData.twitter}) ↗</a></p>
    {/if}
{:else}
    <p>데이터를 불러오는 중입니다. 잠시만 기다려주세요.</p>
{/if}
{/if}

<style>
    mwc-list-item {
        border-radius: 10px;
    }
    #person_name {
        font-size: 1.4rem;
        font-weight: 300;
    }

    .person_info a {
        vertical-align: super;
        margin: auto 5px auto 5px;
        text-decoration: none;
        color: cadetblue;
    }
</style>