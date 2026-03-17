<script lang="ts">
    let { children } = $props();

</script>

<main id="static-content">
    {@render children()}
</main>

<style>
    #static-content {
        padding: 4rem 0 0 0;
        margin: 0 1rem;
    }
</style>
