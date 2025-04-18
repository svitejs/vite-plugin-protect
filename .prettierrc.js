/** @type {import("prettier").Config} */
export default {
	useTabs: true,
	singleQuote: true,
	trailingComma: 'none',
	printWidth: 100,
	overrides: [
		{
			files: [
				'**/CHANGELOG.md',
				'.github/renovate.json5',
				'**/types/index.d.ts',
				'**/types/index.d.ts.map',
				'**/pnpm-lock.yaml',
				'.changeset/pre.json',
				'**/vite.config.js.timestamp-*.mjs'
			],
			options: {
				rangeEnd: 0
			}
		},
		{
			files: ['**/package.json', '**/README.md', 'docs/**/*.md', '.changeset/pre.json'],
			options: {
				useTabs: false,
				tabWidth: 2
			}
		}
	]
};
