import fs from 'node:fs';
import fsp from 'node:fs/promises';
import { fileURLToPath } from 'node:url';
import path from 'node:path';
import { onViolation } from './on-violation.js';
import { isFileLoadingAllowed } from 'vite';
import { platform } from 'node:process';
const isWin = platform === 'win32';

const hooked = Symbol('hooked');

/**
 *
 * @param {object} from
 * @param {string[]} keys
 * @returns {{[p: string]: function}}
 */
function pick(from, keys) {
	return Object.fromEntries(Object.entries(from).filter(([key]) => keys.includes(key)));
}
const hook = {
	fs: pick(fs, ['open', 'openSync', 'readFile', 'readFileSync', 'writeFile', 'writeFileSync']),
	fsp: pick(fsp, ['open', 'readFile', 'writeFile'])
};

/**
 *
 * @param {import("node:fs").PathLike} pathlike
 * @param {import("./public.d.ts").PluginOptions & { server?: import("vite").ViteDevServer | import("vite").PreviewServer; }} options
 * @returns {boolean}
 */
function checkFile(pathlike, options) {
	/**
	 * @type {string}
	 */
	let resolvedPath;
	if (pathlike instanceof URL) {
		resolvedPath = fileURLToPath(pathlike);
	} else {
		resolvedPath = pathlike.toString();
	}
	resolvedPath = path.normalize(resolvedPath);

	if (options.server && !isFileLoadingAllowed(options.server.config, resolvedPath)) {
		onViolation({ options, msg: 'Illegal file access', details: `filename: ${resolvedPath}` });
		return false;
	}
	return true;
}

/**
 * @param {import("./public.d.ts").PluginOptions & { server?: import("vite").ViteDevServer | import("vite").PreviewServer; }} options
 */
export function hookFs(options) {
	// @ts-ignore
	if (options.fs && !globalThis[hooked]) {
		for (const [name, fn] of Object.entries(hook.fs)) {
			// @ts-ignore
			fs[name] = function (p, ...args) {
				if (checkFile(p, options)) {
					return fn(p, ...args);
				} else {
					return fn(isWin ? 'NUL' : '/dev/null', ...args);
				}
			};
		}
		for (const [name, fn] of Object.entries(hook.fsp)) {
			// @ts-ignore
			fsp[name] = async function (p, ...args) {
				if (checkFile(p, options)) {
					return fn(p, ...args);
				} else {
					// TODO: throw instead?
					return fn(isWin ? 'NUL' : '/dev/null', ...args);
				}
			};
		}
	}
}
