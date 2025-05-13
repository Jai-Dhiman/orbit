import { defineConfig } from '@lynx-js/rspeedy'

import { pluginQRCode } from '@lynx-js/qrcode-rsbuild-plugin'
import { pluginReactLynx } from '@lynx-js/react-rsbuild-plugin'

import { pluginTailwindCSS} from  'rsbuild-plugin-tailwindcss'


export default defineConfig({
  plugins: [
    pluginQRCode({
      schema(url) {
        return `${url}?fullscreen=true`
      },
    }),
    pluginReactLynx(),
    pluginTailwindCSS({
      config: './tailwind.config.ts',
      include: /\.[jt]sx?/,
      exclude: ["./src/store/**", /[\\/]node_modules[\\/]/],
    })
  ],
})