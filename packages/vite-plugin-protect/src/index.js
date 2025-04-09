import { createAuthMiddleWare } from './auth-middleware.js';
import { hookFs } from './hook-fs.js';

/**
 * @param {import('./public.d.ts').PluginOptions} opts
 * @return {import('./public.d.ts').PluginOptions}
 */
function applyDefaults(opts) {
	/** @type {import('./public.d.ts').PluginOptions} */
	const defaultOptions = {
		fs: true,
		auth: {
			realm: 'vite-dev-server',
			username: 'vite'
		},
		onViolation: {
			log: true,
			showOverlay: true,
			shutdown: false
		}
	};
	return {
		fs: opts?.fs ?? defaultOptions.fs,
		auth:
			opts?.auth === false
				? false
				: opts?.auth === true || opts?.auth === undefined
					? defaultOptions.auth
					: {
							// @ts-ignore
							...defaultOptions.auth,
							...opts.auth
						},
		onViolation: {
			...defaultOptions.onViolation,
			...opts?.onViolation
		}
	};
}

/**
 * @param {import('./public.d.ts').PluginOptions} opts
 * @return {import("vite").Plugin}
 */
export function protect(opts) {
	/** @type {import('./public.d.ts').PluginOptions & {server?: import('vite').ViteDevServer | import('vite').PreviewServer}} */
	const options = applyDefaults(opts);
	/** @type {import("vite").Plugin} */
	return {
		name: 'vite-plugin-protect',
		apply: 'serve',
		enforce: 'pre',
		config(c) {
			if (options.fs) {
				return {
					server: {
						fs: {
							strict: true // required for the check to work
						}
					}
				};
			}
		},
		configureServer(s) {
			options.server = s;
			hookFs(options);
			if (options.auth) {
				s.middlewares.use(createAuthMiddleWare(options));
			}
		},
		configurePreviewServer(s) {
			options.server = s;
			if (typeof options.auth === 'object' && options.auth.applyToPreview) {
				s.middlewares.use(createAuthMiddleWare(options));
			}
		}
	};
}
