# IMPORTANT, READ FIRST

This is an experiment to see what can be achieved with plugins to adapt the behavior of vite dev server for additional needs
Some experiments might not ever be useful to you, others might land in vite.
The existance of this plugin does not the vite devserver is pushing users security out into a user concern, quite the opposite.

# @svitejs/vite-plugin-protect

[![npm version](https://img.shields.io/npm/v/@svitejs/vite-plugin-protect)](https://www.npmjs.com/package/@svitejs/vite-plugin-protect)
[![CI](https://github.com/svitejs/vite-plugin-protect/actions/workflows/ci.yml/badge.svg)](https://github.com/svitejs/vite-plugin-protect/actions/workflows/ci.yml)

A plugin to enhance security of the dev server in [Vite](https://vitejs.dev).




## Installation

```bash
npm install --save-dev @svitejs/vite-plugin-protect
```

## Usage

```js
// vite.config.js
import { defineConfig } from 'vite';
import { protect } from '@svitejs/vite-plugin-protect';

export default defineConfig({
  plugins: [
    protect({
      /* plugin options */
    })
  ]
});
```

## Documentation

- [Plugin options](./docs/config.md)

## Packages

| Package                                                      | Changelog                                              |
| ------------------------------------------------------------ | ------------------------------------------------------ |
| [@svitejs/vite-plugin-protect](packages/vite-plugin-protect) | [Changelog](packages/vite-plugin-protect/CHANGELOG.md) |

## Got a question? / Need help?

Join the [Vite Discord server](https://chat.vite.dev)!

## Development

- Run `pnpm i` to install dependencies
- Run `pnpm dev` in `packages/playground` to start a Vite app

Note that changes in the plugin needs restart of the Vite dev server.

## License

[MIT](./LICENSE)
