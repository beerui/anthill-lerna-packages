import { resolve } from 'path'
import { ConfigEnv, defineConfig, UserConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import vueJsx from '@vitejs/plugin-vue-jsx';
import dts from 'vite-plugin-dts'

export default ({ mode }: ConfigEnv): UserConfig => {
  const isProd = mode === 'prod'
  const isDev = mode === 'dev'

  let build = {}
  if (isProd) {
    build = {
      cssCodeSplit: false,
      lib: {
        entry: resolve(__dirname, 'src/index.ts'),
        name: '@anthill/utils',
      },
      rollupOptions: {
        external: [
          'vue',
          'TDesign',
          'vue-router',
          /node_modules/
        ],
        output: {
          dir: 'lib',
          exports: 'named',
          globals: {
            'vue': 'Vue',
            'TDesign': 'TDesign',
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
    publicDir: resolve(__dirname, 'src/'),
    plugins: [vue(), vueJsx(), dts({ outDir: "lib" })],
    optimizeDeps,
    build,
    resolve: {
      // alias: [
      //   {
      //     find: '@',
      //     replacement: resolve(__dirname, './src'),
      //   },
      // ],
    },
  }
};
