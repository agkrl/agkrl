const { series, dest, src, watch } = require('gulp')
const sass = require('gulp-sass')(require('sass'))
const postcss = require('gulp-postcss')
const spawn = require('cross-spawn')
const browserSync = require('browser-sync').create()
const htmlmin = require('gulp-htmlmin')
const babeljs = require('gulp-babel')

function styles() {
  return src('./assets/styles/main.scss')
    .pipe(sass())
    .pipe(postcss())
    .pipe(browserSync.reload({ stream: true }))
    .pipe(dest('./_site/css'))
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
        '--host',
        '0.0.0.0',
        '--livereload',
        '--livereload-port',
        35115,
        '--baseurl',
        '/agkrl',
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
      target: 'http://0.0.0.0:4000',
      ws: true,
    },
    port: 8000,
    open: true,
    startPath: '/agkrl/',
  })

  watch(
    [
      './_includes/**/*.html',
      './_posts/**/*.{html,md}',
      './_layouts/**/*.html',
      './_projects/**/*.html',
      './assets/**/*.{js,scss}',
    ],
    {
      delay: 500,
    },
    series(styles, scripts)
  )
}

function start() {
  let isRunning = serveJekyll()
  isRunning.then((response) => {
    if (response) {
      setTimeout(() => {
        styles()
        scripts()
        server()
      }, 2000)
    }
  })
}

function html() {
  return src('./_site/**/*.html')
    .pipe(
      htmlmin({
        removeComments: true,
        collapseWhitespace: true,
        minifyCSS: true,
        minifyJS: true,
      })
    )
    .pipe(browserSync.reload({ stream: true }))
    .pipe(dest('./_site/'))
}

function scripts() {
  return src('./assets/scripts/**/*.js')
    .pipe(babeljs())
    .pipe(browserSync.reload({ stream: true }))
    .pipe(dest('./_site/js/'))
}

exports.html = series(html)
exports.jekyll = series(buildJekyll)
exports.build = series(styles, scripts)
exports.default = series(start)
