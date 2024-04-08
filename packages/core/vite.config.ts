import { resolve } from 'path'
import { ConfigEnv, defineConfig, UserConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import vueJsx from '@vitejs/plugin-vue-jsx';
import cssInjectedByJsPlugin from 'vite-plugin-css-injected-by-js'
import dts from 'vite-plugin-dts'

export default ({ mode }: ConfigEnv): UserConfig => {
  const isProd = mode === 'prod'
  const isDev = mode === 'dev'

  let build = {}
  if (isProd) {
    build = {
      cssCodeSplit: false,
      lib: {
        entry: resolve(__dirname, 'src/index.js'),
        name: '@anthill/core',
        fileName: 'index',
        formats: ['es', 'cjs', 'umd'],
      },
      rollupOptions: {
        external: [
          'vue',
          'TDesign',
          'vue-router',
        ],
        output: {
          dir: 'lib',
          exports: 'named',
          globals: {
            'vue': 'Vue',
            'TDesign': 'TDesign',
            'vue-router': 'vue-router',
          },
        },
      },
    }
  }

  let optimizeDeps = {}
  if (isDev) {
    optimizeDeps = {
      exclude: ['TDesign'],
    }
  }

  return {
    publicDir: resolve(__dirname, 'src/packages/types'),
    plugins: [vue(), vueJsx(), cssInjectedByJsPlugin(), dts({ outDir: "lib" })],
    optimizeDeps,
    build,
    resolve: {
      alias: [
        {
          find: '@',
          replacement: resolve(__dirname, './src'),
        },
      ],
    },
  }
};
