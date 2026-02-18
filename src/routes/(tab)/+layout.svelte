<script lang="ts">
    import { fly } from 'svelte/transition';
    import Nav from '../../components/Nav.svelte';
    import Teaser from '../../components/Teaser.svelte';
    import { getCurrentPath } from '../../utils/path';
    

    let { data, children } = $props();
    let currentPage = $derived(getCurrentPath());
</script>

<Teaser teaserData={{
    intro: data?.intro ?? { title: '', desc: '' },
    notice: data?.notice ?? { data: [] }
}} />

<Nav selectedId={currentPage} />

{#key currentPage}
<div in:fly="{{ x: 200, duration: 1000 }}">
    {@render children()}
</div>
{/key}