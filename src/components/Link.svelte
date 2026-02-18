<script lang="ts">
    import type { Snippet } from "svelte";
    import Icon from "./Icon.svelte";

  let { external = false, nav = false, current = false, sub = false, href, onClick, children }
    : {
      external?: boolean,
      nav?: boolean,
      current?: boolean,
      sub?: boolean,
      href: string,
      onClick?: (event: MouseEvent) => void,
      children: Snippet<[]>
    } = $props();
</script>

{#if external}
<a {href} target="_blank" onclick={onClick} class={`mfp-link-external ${nav ? "mfp-link-nav":""} ${!current && sub ? "mfp-link-sub-not-current" : ""}`}>
  <span class={`mfp-link-label ${current ? "mfp-link-nav-current" : ""}`}>
    {@render children()}
  </span>
  <span class="mfp-link-icon">
    <Icon code={"open_in_new"} size="1em" ariaHidden={true} />
  </span>
</a>
{:else}
<a {href} onclick={onClick} class={`mfp-link-internal ${nav ? "mfp-link-nav":""} ${!current && sub ? "mfp-link-sub-not-current" : ""}`}>
  <span class={`mfp-link-label ${current ? "mfp-link-nav-current" : ""}`}>
    {@render children()}
  </span>
  {#if nav}
  <span class="mfp-link-icon">
    <Icon code={"arrow_forward"} size="1em" ariaHidden={true} />
  </span>
  {:else}
  <Icon code={"arrow_forward"} size="1em" ariaHidden={true} />
  {/if}
</a>
{/if}

<style>
  a {
    color: var(--mfp-link-color);
    word-break: keep-all;
    text-decoration: none;
    font-weight: 700;
  }

  .mfp-link-nav {
    color: var(--mfp-primary-text-color);
    font-weight: 600;
  }

  .mfp-link-external, .mfp-link-internal {
    display: inline-flex;
    align-items: center;
    gap: 0.25rem;
    position: relative;
  }

  .mfp-link-label {
    position: relative;
  }

  .mfp-link-icon {
    display: inline-flex;
    align-items: center;
    justify-content: center;
    align-self: center;
    line-height: 1;
  }

  .mfp-link-label::after {
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

  .mfp-link-nav-current::after {
    transform: scaleX(1);
  }

  .mfp-link-sub-not-current {
    color: gray;
  }

  .mfp-link-nav .mfp-link-icon {
    opacity: 0;
    transition: opacity 250ms ease;
  }

  .mfp-link-external:hover .mfp-link-label::after,
  .mfp-link-external:focus-visible .mfp-link-label::after,
  .mfp-link-internal:hover .mfp-link-label::after,
  .mfp-link-internal:focus-visible .mfp-link-label::after {
    transform: scaleX(1);
  }

  .mfp-link-nav:hover .mfp-link-icon,
  .mfp-link-nav:focus-visible .mfp-link-icon {
    opacity: 1;
  }
</style>
