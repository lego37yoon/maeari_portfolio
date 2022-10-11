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
                if (subMenu != "contact") {
                    fetchedData = sectionData.data()["data-list"];
                } else {
                    fetchedData = sectionData.data();
                }
            } else {
                noData = true;
            }
        });
    } else {
        //TODO: get other resources
        //It means "all" section -> mainMenu not means section.

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
        await import("@material/mwc-dialog");
    });

</script>

<svelte:head>
    <link rel="stylesheet" href="https://fonts.googleapis.com/css2?family=Material+Symbols+Rounded">
</svelte:head>

{#if noData === false}
    <h2>{subMenuName}</h2>
{#if ifLoaded === true}
    {#if subMenu != "contact"}
        <mwc-list>
            {#each fetchedData as listData}
            <mwc-list-item graphic="icon" twoline>
                <span>{listData.organization ? listData.organization : ""} {listData.name ? listData.name : listData.major}</span>
                <span slot="secondary">
                    {#if listData["start-year"] != undefined}
                        {listData["start-year"]} ~ {listData["end-year"] ? listData["end-year"] : "현재"}
                    {:else if listData["start-date"] != undefined}
                        {listData["start-date"]} ~ {listData["end-date"] ? listData["end-date"] : "현재"} 
                    {:else}
                        일자 불명
                    {/if}
                </span>
                <span class="{listData['icon-type']}" slot="graphic">{listData.icon}</span>
            </mwc-list-item>
            {/each}
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
        --mdc-theme-text-icon-on-background: cadetblue;
        --mdc-theme-text-primary-on-background: cadetblue;
        --mdc-theme-text-secondary-on-background: cadetblue;
    }
    mwc-list-item span {
        font-weight: 400;
    }
    mwc-list-item span[slot="secondary"] {
        font-weight: 200;
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