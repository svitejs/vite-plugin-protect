import { defineConfig } from 'vite';
import { protect } from '@svitejs/vite-plugin-protect';
export default defineConfig({
	plugins: [protect({ auth: { applyToPreview: true } })],
	server: {
		fs: {
			deny: ['.env', '.env.*', '*.{crt,pem}', '**/.git/**']
		}
	}
});
