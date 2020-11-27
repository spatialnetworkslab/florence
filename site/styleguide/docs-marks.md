# Structure

## Name of mark

- Small description of what mark is, and what it is useful for. 
- Minimal example necessary to illustrate what mark does: a component plus a code block
- Slightly longer (but still brief) description of how positioning etc works for this particular mark
- If appropriate: make clear that there exists a complementary `Layer` for this `Mark`, and how they relate to each other
- Illustrate this with a code block

## Properties

### Positioning

- A table with the following columns:
  - Name (plain text)
  - Required (backticks if code, plain text otherwise) (with `if` statement showing how the prop depends on other props)
  - Type(s) (backticks) (`Array` etc, seperated by pipes (|))
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
  - Unit(s) (plain text) (in most cases we can link through to MDN)

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
  - Unit(s) (plain text)

This is almost the same for every mark/layer, and includes entries for

- `clip`
- `renderSettings`
- `_asPolygon`
- etc
