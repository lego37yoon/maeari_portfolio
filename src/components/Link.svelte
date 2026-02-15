<script lang="ts">
    import type { Snippet } from "svelte";
    import Icon from "./Icon.svelte";

  let { external = false, href, children }
   : { external?: boolean, href: string, children: Snippet<[]> } = $props();
</script>

{#if external}
<a {href} target="_blank" class="mfp-link-external">
  <span>
    {@render children()}
  </span>
  <Icon code={"open_in_new"} size="1em" ariaHidden={true} />
</a>
{:else}
<a {href} class="mfp-link-internal">
  <span>
    {@render children()}
  </span>
  <Icon code={"arrow_forward"} size="1em" ariaHidden={true} />
</a>
{/if}

<style>
  a {
    color: var(--mfp-link-color);
    word-break: keep-all;
    text-decoration: none;
    font-weight: 700;
  }

  .mfp-link-external, .mfp-link-internal {
    display: inline-flex;
    align-items: center;
    gap: 0.25rem;
    position: relative;
  }

  .mfp-link-external > span,
  .mfp-link-internal > span {
    position: relative;
  }

  .mfp-link-external > span::after,
  .mfp-link-internal > span::after {
    content: "";
    position: absolute;
    left: 0;
    bottom: -0.1em;
    width: 100%;
    height: 0.1em;
    background: currentColor;
    transform: scaleX(0);
    transform-origin: left center;
    transition: transform 400ms ease;
  }

  .mfp-link-external:hover > span::after,
  .mfp-link-external:focus-visible > span::after,
  .mfp-link-internal:hover > span::after,
  .mfp-link-internal:focus-visible > span::after {
    transform: scaleX(1);
  }
</style>
