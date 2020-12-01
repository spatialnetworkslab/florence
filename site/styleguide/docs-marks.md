# Structure

## Name of mark

- Small description of what mark is, and what it is useful for. 
- Minimal example necessary to illustrate what mark does: a component plus a code block, showing both `Mark` and `Layer`

## Properties

- If 'Unit(s)' has no meaningful value, use ` - `.
- Common values for 'Unit(s)' include:
  - Local coordinate (with link to /docs/concepts/local-coordinates)
  - Pixel
  - Named, hex, rgb or hsl color
  - Number between 0 and 1
  - See explanation
  - Font
  - Degree

### Positioning

- A table with the following columns:
  - Name (plain text)
  - Required (backticks) (with `if` statement showing how the prop depends on other props, or `true` or `false`)
  - Type(s) (backticks) (`Array` etc, seperated by commas)
  - Default (backticks)
  - Unit(s) (plain text) (will usually be local coordinates, link to appriopriate page)

- Move descriptions of props to text block under table
- Extensive discussion of how positioning works
- Ideally with components and code blocks (even a REPL?) for illustration

### Aesthetics

- A table with the following columns:
  - Name (plain text)
  - Required (will always be plain text I guess)
  - Type(s) (backticks)
  - Default (backticks)
  - Units (plain text) (in most cases we can link through to MDN)

In the table, `fill` related stuff goes before `stroke` related stuff, and the order is always `stroke`, `strokeWidth`, `strokeOpacity`.

Explain how mark is analogous HTML element if appriopriate

### Transitions

Link to transitions docs

### Interactions

Link to interactions docs

### Other

- A table with the following columns:
  - Name (plain text)
  - Required (plain text)
  - Type(s) (backticks)
  - Default
  - Units (plain text)

This is almost the same for every mark/layer, and includes entries for

- `clip`
- `renderSettings`
- `_asPolygon`
- etc

## Examples

Link to example(s) with REPL that uses this mark.