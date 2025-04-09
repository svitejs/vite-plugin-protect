import auth from 'basic-auth';
import { onViolation } from './on-violation.js';

function getRemote(req) {
	return req.client?.remoteAddress?.replace('::ffff:', '');
}
function isLocal(req) {
	const r = getRemote(req);
	return r && ['127.0.0.1', 'localhost', '::1'].includes(r);
}

export function createAuthMiddleWare(options) {
	const password =
		options.auth.password ??
		Math.floor(Math.random() * 1000000)
			.toString()
			.padStart(6, '0');
	const username = options.auth.username;
	const realm = options.auth.realm;
	const server = options.server;
	server.config.logger.warn(
		`[PROTECT AUTH] connect with username "${username}" and password "${password}"`
	);
	return function authMiddleware(req, res, next) {
		if (options?.auth?.applyToLocalRequests || !isLocal(req)) {
			const user = auth(req);
			if (!user || !user.name || !user.pass) {
				res.statusCode = 401;
				res.setHeader('WWW-Authenticate', `Basic realm="${realm}"`);
				res.end('Authentication required');
				return;
			} else if (user.name !== username || user.pass !== password) {
				res.setHeader('Cache-Control', 'no-cache, no-store, max-age=0');
				res.statusCode = 403;
				res.end('forbidden');
				onViolation({
					msg: 'Authentication failed',
					details: `remoteAddress: ${getRemote(req)}`,
					options
				});
				return;
			}
		}
		next();
	};
}
