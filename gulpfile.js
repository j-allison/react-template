var argv = require('yargs').argv;

var fs = require('fs'),
    gulp = require('gulp'),
    plumber = require('gulp-plumber'),
    path = require('path'),
    g = require('gulp-load-plugins')(),
    run = require('run-sequence');

run.use(gulp);

//==============================================================================

const ENVIRONMENT = g.util.env.type || 'development';
const PRODUCTION  = (ENVIRONMENT === 'production');
const PORT = g.util.env.port || 2312;
const SRC = __dirname + '/src/';
const WWW = __dirname + '/www/';

//==============================================================================

gulp.task('html', function() {
  return gulp.src(SRC + 'index.html')
    .pipe(gulp.dest(WWW))
    .pipe(g.size({ title : 'html' }))
    .pipe(g.connect.reload());
});

//------------------------------------------------------------------------------

gulp.task('styles',function(cb) {
  return gulp.src(SRC + 'stylus/main.styl')
    .pipe(plumber())
    .pipe(g.stylus({
      compress: PRODUCTION,
      'include css' : true
    }))
    .pipe(g.autoprefixer({
      browsers: [
        'ie >= 9',
        'ie_mob >= 10',
        'ff >= 30',
        'chrome >= 34',
        'safari >= 6',
        'opera >= 23',
        'ios >= 6',
        'android >= 4.4',
        'bb >= 10'
      ]
    }))
    .pipe(gulp.dest(WWW + 'css/'))
    .pipe(g.size({ title : 'css' }))
    .pipe(g.connect.reload());
});

//------------------------------------------------------------------------------

var webpack = require('webpack-stream'),
    entrypoint = SRC + 'scripts/main.js';

gulp.task('scripts', function() {
  return gulp.src(entrypoint)
    .pipe(webpack({
      entry: {
        app: entrypoint
      },
      output: {
        path: WWW,
        filename: 'main.js'
      },
      module: {
        loaders: [{
          exclude: /node_modules/,
          loader: 'babel-loader'
        }]
      }
    }))
    .pipe(PRODUCTION ? g.uglifyjs() : g.util.noop())
    .pipe(gulp.dest(WWW + 'js/'))
    .pipe(g.size({ title : 'js' }))
    .pipe(g.connect.reload());
});

//------------------------------------------------------------------------------

gulp.task('assets', function(cb) {
  return gulp.src(SRC + 'assets/**/*')
    .pipe(g.size({ title : 'assets' }))
    .pipe(gulp.dest(WWW + 'assets/'));
});

//==============================================================================

gulp.task('serve', function() {
  g.connect.server({
    root: WWW,
    port: PORT,
    livereload: true
  });
});

gulp.task('watch', function() {
  gulp.watch(SRC + 'index.html', ['html']);
  gulp.watch(SRC + 'stylus/*.styl', ['styles']);
  gulp.watch(SRC + 'scripts/**/*.js', ['scripts']);
  gulp.watch(SRC + 'scripts/**/*.jsx', ['scripts']);
});

gulp.task('clean', function(cb) {
  try { fs.unlinkSync(BUILD); }
  catch(e) {}

  return require('del')([WWW + "*"]);
});

// var cordova = require('cordova-lib').cordova.raw,
//     Q = require('q'),
//     parse_async = function(string) {
//       var d = Q.defer();

//       require('xml2js').parseString(string, function(err, data) {
//         if (err) { d.reject(err); }
//         else { d.resolve(data); }
//       });

//       return d.promise;
//     };

// gulp.task('cordova', function(cb) {
//   return run('cordova-plugins', 'cordova-build', cb);
// })

// gulp.task('cordova-build', function(cb) {
//   cordova.build()
//          .then(cb);
// });


function update_plugin(name, done) {
  var plugin = './plugins/' + name + '/plugin.xml';

  if (!fs.existsSync(plugin))
    throw new Error('plugin is not a valid cordova plugin');

  function process_platform(platform) {
    console.log('deploying platform', platform.$.name);

    var files = [].concat(platform['source-file']);

    if (platform['header-file'])
      files = files.concat(platform['header-file']);

    return files.reduce(function (previous, file) {
        return previous.then(function() {
          if (file.$['target-dir'].charAt(file.$['target-dir'].length - 1) == '/')
            file.$['target-dir'].slice(0, -1)

          return copy_async(
            ['.', 'plugins', name, file.$.src].join('/'),
            ['.', 'platforms', platform.$.name, file.$['target-dir'], file.$.src.split('/').pop()].join('/')
          );
        });
    }, Q());
  }

  function copy_async(source, target) {
    console.log('copying', source, 'to', target);
    var d = Q.defer();

    var rd = fs.createReadStream(source);
        rd.on('error', d.reject);

    var wr = fs.createWriteStream(target);
      wr.on('error', d.reject);
      wr.on('finish', d.resolve);

    rd.pipe(wr);

    return d.promise;
  }

  parse_async(fs.readFileSync(plugin))
    .then(function(xml) {
      return xml.plugin.platform.reduce(function (previous, platform) {
        return previous.then(function() {
          return process_platform(platform);
        });
      }, Q());
    })
    .then(function() {
      done();
    })
    .catch(function(err) {
      console.log(err);
    })
};

var request = require('request');

//task preventing hang after timeout
gulp.task('stop', function(cb) {
  process.nextTick(function () {
    process.exit(0);
  });
});

//==============================================================================

gulp.task('build', function(cb) {
  return run('clean', 'html', 'styles', 'scripts', 'assets', cb);
});

gulp.task('default', function(cb) {
  return run('build', 'serve', 'watch', cb);
});
