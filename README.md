# Scripture Overview

This application is intended to be able to view where various words occur. Currently only Book of Mormon shows.

## Recommended IDE Setup

[VS Code](https://code.visualstudio.com/) + [Vue (Official)](https://marketplace.visualstudio.com/items?itemName=Vue.volar) (and disable Vetur).

## Recommended Browser Setup

- Chromium-based browsers (Chrome, Edge, Brave, etc.):
  - [Vue.js devtools](https://chromewebstore.google.com/detail/vuejs-devtools/nhdogjmejiglipccpnnnanhbledajbpd)
  - [Turn on Custom Object Formatter in Chrome DevTools](http://bit.ly/object-formatters)
- Firefox:
  - [Vue.js devtools](https://addons.mozilla.org/en-US/firefox/addon/vue-js-devtools/)
  - [Turn on Custom Object Formatter in Firefox DevTools](https://fxdx.dev/firefox-devtools-custom-object-formatters/)

## Type Support for `.vue` Imports in TS

TypeScript cannot handle type information for `.vue` imports by default, so we replace the `tsc` CLI with `vue-tsc` for type checking. In editors, we need [Volar](https://marketplace.visualstudio.com/items?itemName=Vue.volar) to make the TypeScript language service aware of `.vue` types.

## Customize configuration

See [Vite Configuration Reference](https://vite.dev/config/).

## Project Setup

```sh
npm install
```

### Compile and Hot-Reload for Development

```sh
npm run dev
```

### Type-Check, Compile and Minify for Production

```sh
npm run build
```

## TODO

- [ ] dark/light/+ theme toggle (top)
- [ ] theme for pie chart colors
  - [ ] display theme to results (menu?)
  - [ ] have a few themes
  - [ ] option to edit themes
  - [ ] option to create themes
- [ ] view scriptures
  - [x] read
  - [x] view footnotes
  - [ ] view labels
  - [ ] view notes
  - [ ] TG link (if not add, link to official)
  - [ ] bible link (if not add, link to official,...maybe option for translation)
- [ ] edit scriptures
  - [ ] add labels
  - [ ] add notes/highlights
  - [ ] add official footnotes to json
  - [ ] save to file
- [ ] search shows result word (for regex/partial-in parenthesis next to verse)
- [ ] add option for opacity in pie charts, depends on total result count
- [ ] add more
  - [ ] bible
  - [ ] D&C
  - [ ] add topical guide (is copywrite expired)?
  - [ ] bom witness, intro, random sections
