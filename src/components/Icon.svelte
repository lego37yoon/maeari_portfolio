<script lang="ts">
  const { code, size, ariaHidden = false }
   : { code: string, size?: string | number, ariaHidden?: boolean } = $props();
</script>

<span class="material-symbols-outlined" style:font-size={size ?? 24} aria-hidden={ariaHidden}>{code}</span>
