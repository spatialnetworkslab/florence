# Florence
Florence is a data visualization framework, based on the grammar of graphics, built on top of Svelte's template syntax.

Florence is built on top of existing open web standards that are already in intensive use for online map making today, but provides a framework that is firmly based on cartographic and visualization theory.

We adopt concepts from Bertin’s Semiology of Graphics and Wilkinson’s Grammar of Graphics to create a ‘language’ with a limited number of core concepts or verbs that are combined with a declarative style of ‘writing’ visualizations.

For more information, including documentation and interactive examples, check out https://florence.spatialnetworkslab.org/.

## Installation
Florence is available on NPM and can be added to any existing Svelte project by running `npm install @snlab/florence`. Florence [exports a series components](https://florence.spatialnetworkslab.org/docs) that can be used using ES6 imports. For example:

```markup
<script>
  import { Graphic, Point } from "@snlab/florence"
</script>

<Graphic width={500} height={500}>
  <Point x={0.5} y={0.5} radius={50} />
</Graphic>
```

To start from scratch, you can use the `florence-template` with [snowpack](https://www.snowpack.dev/) to get a nice starter template running in seconds. All you need to do is:

```
npx create-snowpack-app my-florence-app --template @snlab/florence-template
```

This will create a new Florence project in the `my-florence-app` directory. After you change into that directory (`cd my-florence-app`), you run `npm start` to run a development server and start coding.