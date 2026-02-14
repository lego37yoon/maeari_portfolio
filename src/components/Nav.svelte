<script>
	import "@material/web/icon/icon.js";
	import "@material/web/tabs/tabs.js";
	import "@material/web/tabs/primary-tab.js";
	import { goto } from "$app/navigation";

	let { selectedId = "home" } = $props();
	const tabs = $derived.by(() => [
		{ id: "home", href: "/" },
		{ id: "edu", href: "/edu" },
		{ id: "news", href: "/news" },
		{ id: "contacts", href: "/contacts" }
	]);
	const selectedIndex = $derived.by(() => {
		const index = tabs.findIndex((tab) => tab.id === selectedId);
		return index >= 0 ? index : 0;
	});

	function movePage(event) {
		const targetIndex = event.currentTarget?.activeTabIndex;
		if (typeof targetIndex !== "number") {
			return;
		}

		const target = tabs[targetIndex];
		if (!target) {
			return;
		}

		goto(target.href, {
			keepFocus: true,
			noScroll: true
		});
	}
</script>

<nav id="submenu">
	<md-tabs
		activeTabIndex={selectedIndex}
		onchange={movePage}
	>
        <md-primary-tab>
            <md-icon slot="icon">home</md-icon>
            홈
        </md-primary-tab>
        <md-primary-tab>
            <md-icon slot="icon">history_edu</md-icon>
            학업
        </md-primary-tab>
        <md-primary-tab>
            <md-icon slot="icon">newspaper</md-icon>
            소식
        </md-primary-tab>
        <md-primary-tab>
            <md-icon slot="icon">mail</md-icon>
            연락하기
        </md-primary-tab>
    </md-tabs>
</nav>

<style>

    md-tabs {
        border-radius: 5px;
    }

    md-primary-tab {
        word-break: keep-all;
    }

    md-primary-tab md-icon {
        vertical-align: top;
    }

</style>
