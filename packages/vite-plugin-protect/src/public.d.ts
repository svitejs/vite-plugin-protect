export interface PluginOptions {
	/**
	 * require authentication for requests to the dev server
	 *
	 * - false: no authentication
	 * - true: default configuration: authenticate remote requests with username "vite" and generated password
	 * - object: custom configuration
	 *
	 * @default true
	 */
	auth?:
		| boolean
		| {
				/**
				 * authentication realm
				 * @default vite-dev-server
				 */
				realm?: string;
				/**
				 * authentication username
				 * @default vite
				 */
				username?: string;
				/**
				 * authentication password
				 * @default random 6-digit logged to console
				 */
				password?: string;

				/**
				 * also authenticate local requests.
				 * These can theoretically be abused to escalate priviliges from another local process
				 * that cannot access the files that the dev server has access to
				 *
				 * @default false
				 */
				applyToLocalRequests?: boolean;

				/**
				 * also authenticate server started with vite preview
				 */
				applyToPreview?: boolean;
		  };
	/**
	 * hook into node fs calls to prevent bypass attacks at the vite server level
	 *
	 * In addition to reads coming from the vite dev server itself this can also protect you
	 * from simple attacks by malicious vite plugins or application dependencies.
	 *
	 * @default true
	 */
	fs?: boolean;

	onViolation?: {
		/**
		 * log violations
		 *
		 * @default true
		 */
		log?: boolean;
		/**
		 * show an overlay message on connected clients
		 *
		 * @default true
		 */
		showOverlay?: boolean;

		/**
		 * shutdown devserver on violation to eliminate further risk
		 * @default false
		 */
		shutdown?: boolean;
	};
}
