const { series, dest, src, watch } = require('gulp')
const sass = require('gulp-sass')(require('sass'))
const postcss = require('gulp-postcss')
const spawn = require('cross-spawn')
const browserSync = require('browser-sync').create()
const chokidar = require('chokidar')

function styles() {
  let result = src('./assets/styles/main.scss')
    .pipe(sass())
    .pipe(postcss())
    .pipe(dest('./_site/assets/css'))
  browserSync.reload()
  return result
}

function serveJekyll(cb) {
  return new Promise((resolve) => {
    let c = spawn(
      'bundle',
      [
        'exec',
        'jekyll',
        'serve',
        '--port',
        4000,
        '--livereload',
        '--livereload-port',
        35115,
      ],
      {
        killSignal: 'SIGINT',
        stdio: 'inherit',
      }
    )
    if (!c.killed) {
      resolve(true)
    }
  })
}

function buildJekyll() {
  return spawn('bundle', ['exec', 'jekyll', 'build'], {
    stdio: 'inherit',
  })
}

function server() {
  browserSync.init({
    proxy: {
      target: 'http://localhost:4000',
      ws: true,
    },
    port: 8000,
    open: false,
  })

  let siteWatcher = chokidar.watch('./_site', { depth: 1 })
  siteWatcher.on('raw', () => {
    setTimeout(() => {
      styles()
      browserSync.reload()
    }, 1000)
  })

  watch(
    [
      './assets/**/*.{scss,js}',
      './_includes/**/*.html',
      './_posts/**/*.{html,md}',
      './_layouts/**/*.html',
    ],
    {
      delay: 500,
    },
    styles
  )
}

function start() {
  let isRunning = serveJekyll()
  isRunning.then((response) => {
    if (response) {
      setTimeout(() => {
        styles()
        server()
      }, 2000)
    }
  })
}

exports.build = series(styles)
exports.default = series(start)
