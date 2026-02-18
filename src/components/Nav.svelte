<script lang="ts">
	import "@material/web/icon/icon.js";
  import Link from "./Link.svelte";

	let { selectedId = "home" } = $props();
	const tabs = [
		{ id: "home", href: "/", name: "프로젝트", icon: "stacks" },
		{ id: "edu", href: "/edu", name: "학업 · 교육 · 자격증", icon: "school" },
		{ id: "comm", href: "/comm", name: "오픈소스 · 커뮤니티 활동", icon: "chat" },
		{ id: "contacts", href: "/contacts", name: "연락하기", icon: "mail" }
	];
	const selectedIndex = $derived.by(() => {
		const index = tabs.findIndex((tab) => tab.id === selectedId);
		return index >= 0 ? index : 0;
	});
</script>

<nav id="submenu">
	<ul>
		{#each tabs as tab}
		<li>
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
		background: var(--mfp-header-scrolled-bg-color);
	}

	ul {
		list-style: none;
		padding: 0;
		display: flex;
		gap: 0.5rem;
	}

	li {
		font-size: 2.2rem;
	}

</style>
