const tailwindcss = require('tailwindcss')
const cssMqpacker = require('@hail2u/css-mqpacker')
const pxtorem = require('postcss-pxtorem')
const cssnano = require('cssnano')
const cssnanoAdvanced = require('cssnano-preset-advanced')
const postcssImport = require('postcss-import')
const tailwindcssNesting = require('tailwindcss/nesting')

const preset = cssnanoAdvanced({
  minifyFontValues: false,
})

module.exports = {
  parser: require('postcss-scss'),
  plugins: [
    pxtorem(),
    cssMqpacker(),
    require('autoprefixer'),
    postcssImport(),
    tailwindcssNesting(),
    tailwindcss('./tailwind.config.js'),
    cssnano({
      preset,
    }),
  ],
}
