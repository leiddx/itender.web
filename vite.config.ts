import Path from 'path'
import * as Vite from 'vite'
import Vue from '@vitejs/plugin-vue'
import VueJsx from '@vitejs/plugin-vue-jsx'

const cwd = process.cwd()

const env = Vite.loadEnv('development', cwd)

// https://vitejs.dev/config/
export default Vite.defineConfig(
	{
		plugins: [
			Vue(),
			VueJsx(),
		],

		resolve: {
			alias: {
				'@': Path.resolve(cwd, 'src'),

			},

		},

		server: {
			port: Number(env.VITE_PORT),

			proxy: {
				'/api': {
					changeOrigin: true,
					target: env.VITE_PROXY,
					rewrite: (path) => path.replace(/^\/api/, ''),

				},

			},

		},

	}
)
