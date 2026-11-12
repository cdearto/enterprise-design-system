# Enterprise Design System

A hand-authored HTML and CSS design system for dense product UI, where every component page is its own reference implementation.

![The Button page: the component list at the left, the documentation in the middle, the live example and its code at the right](docs/screenshot.png)

Live at [doselos.com/design-system](https://doselos.com/design-system).

## What's inside

**Start here:** Introduction, Foundations, Standards. Read these before the components.

**10 components**

- Button
- Badge and status pill
- Card
- Table
- Form elements
- Tabs
- Breadcrumbs
- Page header
- Dropdown
- Toast

**3 compositions**

- Wizard system
- Inbox
- Upload wizard

Each page documents one part: overview, use cases, properties, variants, best practices, and a live example with the markup beside it.

## Four modes

Light, dim, dark, and high-contrast. Every value is a token in `components/_shared/tokens.css`, written in OKLCH, and each mode redefines the tokens, never the components. Set a mode with an attribute on `<html>`, or on any element to scope it to a subtree:

```html
<html data-mode="dark">   <!-- dim, dark, or hc; no attribute means light -->
```

A second axis, `data-accent`, swaps the brand color (blue, indigo, teal, violet, amber, slate) and composes with any mode.

## Accessibility

Built to WCAG AA. The Standards page sets the rules every component follows: color contrast, focus and keyboard behavior, reduced motion, and screen readers, plus interaction states and voice and tone.

## Run it locally

No build step and no dependencies. Clone the repo and open `index.html` in a browser, or serve the folder:

```sh
python3 -m http.server 8000
# then open http://localhost:8000
```

## Structure

```
index.html              the landing page
components/*.html       one page per component, composition, and reading page
components/_shared/
  tokens.css            tokens and component styles for all four modes
  docs.css              the documentation page layout
  docs.js               navigation, search, example panel, page chrome
```

## License

[MIT](LICENSE). Made by [Carlos deArtola](https://doselos.com).
