<script lang="ts">
    import "@material/web/icon/icon.js";
    import { tick } from "svelte";
    import type { Attachment } from "svelte/attachments";
    import Link from "./Link.svelte";

    let { selectedId = "home" } = $props();

    type Tab = {
        id: string;
        href: string;
        name: string;
        icon: string;
        element?: HTMLLIElement;
    };

    const tabs: Tab[] = [
        { id: "home", href: "/", name: "프로젝트", icon: "stacks" },
        { id: "edu", href: "/edu", name: "학업 · 교육 · 자격증", icon: "school" },
        { id: "comm", href: "/comm", name: "오픈소스 · 커뮤니티 활동", icon: "chat" },
        { id: "contacts", href: "/contacts", name: "연락하기", icon: "mail" }
    ];
    const selectedIndex = $derived.by(() => {
        const index = tabs.findIndex((tab) => tab.id === selectedId);
        return index >= 0 ? index : 0;
    });

    function attachTab(tab: Tab): Attachment {
        return (node) => {
            tab.element = node as HTMLLIElement;
            return () => {
                if (tab.element === node) {
                    tab.element = undefined;
                }
            };
        };
    }

    function scrollCurrentTabIntoView(): void {
        const selectedTab = tabs[selectedIndex];
        const selectedItem = selectedTab?.element;
        if (!selectedItem) {
            return;
        }

        const isLast = selectedIndex === tabs.length - 1;
        const inline: ScrollLogicalPosition = isLast ? "end" : "center";

        selectedItem.scrollIntoView({
            behavior: "smooth",
            block: "nearest",
            inline
        });
    }

    $effect(() => {
        selectedId;

        if (typeof document === "undefined") {
            return;
        }

        let cancelled = false;
        tick().then(() => {
            if (cancelled) {
                return;
            }

            requestAnimationFrame(() => {
                if (cancelled) {
					return;
				}

				scrollCurrentTabIntoView();
            });
        });

        return () => {
            cancelled = true;
        };
    });
</script>

<nav id="submenu">
    <ul>
        {#each tabs as tab}
        <li {@attach attachTab(tab)}>
            <Link href={tab.href} sub nav current={tabs[selectedIndex].href === tab.href}>
                {tab.name}
            </Link>
        </li>
        {/each}
    </ul>

</nav>

<style>
    nav {
        position: sticky;
        top: 3.25rem;
        z-index: 9;
        padding: 0.25rem 1.2rem;
        width: 100%;
        box-sizing: border-box;
        overflow-x: hidden;
        background: var(--mfp-header-scrolled-bg-color);
    }

    ul {
        list-style: none;
        margin: 0;
        padding: 1rem;
        display: flex;
        gap: 0.5rem;
        overflow-x: auto;
    }

    li {
        font-size: 2.2rem;
        text-wrap: nowrap;
    }

</style>
