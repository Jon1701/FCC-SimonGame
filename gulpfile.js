"use strict";

////////////////////////////////////////////////////////////////////////////////
// Gulp modules.
////////////////////////////////////////////////////////////////////////////////
var gulp = require("gulp");
var sass = require("gulp-sass");
var webserver = require("gulp-webserver");
var uglify = require("gulp-uglify");

////////////////////////////////////////////////////////////////////////////////
// Paths
////////////////////////////////////////////////////////////////////////////////
var srcPath = "./source/";
var destPath = "./build/";
var modulesPath = "./node_modules/";

////////////////////////////////////////////////////////////////////////////////
// Tasks
////////////////////////////////////////////////////////////////////////////////

// Move JavaScript.
gulp.task("javascript", function() {
  gulp.src(srcPath + "javascript/**/*")
    .pipe(uglify())
    .pipe(gulp.dest(destPath + "javascript/"));
});

// Move media.
gulp.task("media", function() {
  gulp.src(srcPath + "media/**/*")
    .pipe(gulp.dest(destPath + "media/"));
});

// Compile and move stylesheets.
gulp.task("stylesheets", function() {
  gulp.src(srcPath + "stylesheets/**/*")
    .pipe(sass({outputStyle: 'compressed'}).on("error", sass.logError))
    .pipe(gulp.dest(destPath + "stylesheets/"));
});

// Move HTML files.
gulp.task("html", function() {
  gulp.src(srcPath + "*.html")
    .pipe(gulp.dest(destPath));
});

// Move Components.
gulp.task("components", function() {

  // jQuery.
  gulp.src(modulesPath + "jquery/dist/jquery.js")
    .pipe(uglify())
    .pipe(gulp.dest(destPath + "components/jquery/"));

});

// Webserver.
gulp.task("webserver", function() {
  gulp.src(destPath)
    .pipe(webserver({
      fallback: "index.html",
      livereload: true,
      directoryListing: false,
      open: true
    }));
});

////////////////////////////////////////////////////////////////////////////////
// Watch Tasks.
////////////////////////////////////////////////////////////////////////////////

// Watch task
gulp.task("watch", function() {
  gulp.watch(srcPath + "javascript/**/*", ["javascript"]); // JavaScript.
  gulp.watch(srcPath + "media/**/*", ["media"]); // JavaScript.
  gulp.watch(srcPath + "stylesheets/**/*.scss", ["stylesheets"]); // SASS Main.
  gulp.watch(srcPath + "stylesheets/**/_*.scss", ["stylesheets"]); // SASS Partials.
  gulp.watch(srcPath + "*.html", ["html"]); // HTML files.
});

////////////////////////////////////////////////////////////////////////////////
// Default Task.
////////////////////////////////////////////////////////////////////////////////
gulp.task("default", ["javascript", "media", "stylesheets", "html", "components", "watch", "webserver"]);
