var gulp = require('gulp');
var bundler = require('aurelia-bundler');

var config = {
  force: true,
  packagePath: '.',
  bundles: {
      "www/app/app-build": {
          includes: [
            '*',
            '*.html!text',
            '*.css!text'
          ],
          excludes: [
            'npm:core-js',
            'github:jspm/nodelibs-process'
          ],
          options: {
              inject: true,
              minify: false
          }
      },
    "www/app/aurelia": {
        includes: [
            'aurelia-bootstrapper',
            'aurelia-fetch-client',
            'aurelia-router',
            'aurelia-animator-css',
            'github:aurelia/templating-binding',
            'github:aurelia/templating-resources',
            'github:aurelia/templating-router',
            'github:aurelia/loader-default',
            'github:aurelia/history-browser',
            'github:aurelia/logging-console',
            'github:aurelia/html-import-template-loader',
            'github:Dogfalo/materialize@0.97.0',
            'github:systemjs/plugin-text@0.0.2'
      ],
      options: {
        inject: true,
        minify: false
      }
    },
    "www/app/view-bundle": {
        htmlimport: true,
        includes: 'dist/*.html',
        options: {
            inject: {
                indexFile: 'www/index.html',
                destFile: 'www/dest_index.html',
            }
        }
    }
  }
};

gulp.task('bundle', function() {
    return bundler.bundle(config);
});

gulp.task('move', function () {
    return gulp.src(['./jspm_packages/system.js', './config.js'])
    .pipe(gulp.dest('./www/scripts'))
});

// copies changed html files to the output directory
//gulp.task('build-html', function () {
//    return gulp.src(paths.html)
//      .pipe(changed(paths.output, { extension: '.html' }))
//      .pipe(gulp.dest(paths.output));
//});


//gulp.task('unbundle', function() {
// return bundler.unbundle(config);
//});
