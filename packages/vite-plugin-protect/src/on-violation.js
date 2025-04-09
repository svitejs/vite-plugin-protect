/**
 * @param {{options: import("./public.d.ts").PluginOptions & { server?: import("vite").ViteDevServer | import("vite").PreviewServer; }, msg: string, details: string}} args
 */
export function onViolation({ options, msg, details }) {
	const message = `[PROTECT VIOLATION] ${msg}${details ? `\n\t - ${details}` : ''}`;
	const server = options.server;
	if (options?.onViolation?.log !== false) {
		if (server) {
			server.config.logger.error(message);
		} else {
			console.error(message);
		}
	}
	if (server && options?.onViolation?.showOverlay !== false) {
		// @ts-ignore
		server?.ws?.send({
			type: 'error',
			err: { message, stack: '', plugin: '@svitejs/vite-plugin-protect' }
		});
	}
	if (server && options?.onViolation?.shutdown === true) {
		server.close().then(() => {
			console.error('Server closed on violation by @svitejs/vite-plugin-protect');
		});
	}
}
