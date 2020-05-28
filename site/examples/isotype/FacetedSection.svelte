<script>
  import { Section } from "@snlab/florence";
  export let iterable;
  export let scaleX, scaleY;
  export let groups;
</script>

{#each iterable as item, index}
  <Section
    {scaleX}
    {scaleY}
    y1={iterable[index]}
    y2={({ scaleY }) => scaleY(iterable[index]) + scaleY.bandwidth()}
  >
    <slot item={item} index={index} group={groups.column('$grouped')[index]}></slot>
  </Section>
{/each}