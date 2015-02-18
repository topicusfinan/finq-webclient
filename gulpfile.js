//region Require
var gulp = require('gulp');
var gulpif = require('gulp-if');
var del = require('del');
var concat = require('gulp-concat');
var uglify = require('gulp-uglify');
var sourcemaps = require('gulp-sourcemaps');
var browserSync = require('browser-sync');
var reload = browserSync.reload;
var sass = require('gulp-sass');
var minimist = require('minimist');
var jshint = require('gulp-jshint');
var stylish = require('jshint-stylish');
var autoprefixer = require('gulp-autoprefixer');
var csso = require('gulp-csso');
var inject = require('gulp-inject');
var ngAnnotate = require('gulp-ng-annotate');
var karma = require('karma').server;
var mainBowerFiles = require('main-bower-files');
var scssLint = require('gulp-scss-lint');
var notify = require('gulp-notify');
var bourbon = require('node-bourbon');
var neat = require('node-neat');
//endregion

// region Config
var config = require('./gulpconfig.json');
var paths = config.paths;

var knownOptions = {
    string: 'env',
    default: {env: config.env.default}
};

var options = minimist(process.argv.slice(2), knownOptions);
var env = config.env[options.env];
//endregion

gulp.task('default', ['clean', 'scripts', 'sass', 'moveViews', 'injectDependencies', 'moveVendors', 'moveStatics', 'moveConfig', 'moveLang', 'moveFontAwesomeFonts']);
gulp.task('serve', ['default', 'browser-sync']);

gulp.task('clean', Clean);
gulp.task('moveVendors', ['clean'], MoveVendorFiles);
gulp.task('moveViews', ['clean'], MoveViews);
gulp.task('moveStatics', ['clean'], MoveStatics);
gulp.task('moveConfig', ['clean'], MoveConfig);
gulp.task('moveLang', ['clean'], MoveLang);
gulp.task('moveFontAwesomeFonts', ['clean'], MoveFontAwesomeFonts);
gulp.task('injectDependencies', ['moveVendors', 'scripts', 'sass'], InjectDependencies);
gulp.task('jslint', JsLint);
gulp.task('scsslint', ScssLint);
gulp.task('scripts', ['clean'], Scripts);
gulp.task('sass', ['clean'], Sass);
gulp.task('browser-sync', ['injectDependencies'], BrowserSync);
gulp.task('karma', Karma);

/**
 * Clean
 */
function Clean(cb) {
    del(['build'], cb);
}

/**
 * Wire dependencies and sources in index and move to build
 */
function MoveVendorFiles() {
    return gulp.src(mainBowerFiles())
        .pipe(gulp.dest(paths.dest.vendor));
}

function MoveFontAwesomeFonts() {
    return gulp.src(paths.src.fafonts)
        .pipe(gulp.dest(paths.dest.fonts));
}

/**
 * Move vendor libraries
 */
function MoveViews() {
    return gulp.src(paths.src.views + "/**/*")
        .pipe(gulp.dest(paths.dest.views));
}

/**
 * Move files in source root, exclude index.html because that is parsed
 */
function MoveStatics() {
    return gulp.src([
        paths.sourcedir + "/*",
        "!" + paths.sourcedir + "/index.html"
    ], {nodir: true, dot: true})
        .pipe(gulp.dest(paths.basedir));
}

/**
 * Move config json file
 */
function MoveConfig() {
    return gulp.src(paths.src.scripts + "/config.json")
        .pipe(gulp.dest(paths.dest.scripts));
}

/**
 * Move language files
 */
function MoveLang() {
    return gulp.src(paths.src.lang + "/**/*")
        .pipe(gulp.dest(paths.dest.lang));
}

/**
 * Inject dependencies into index.html
 */
function InjectDependencies() {
    return gulp.src(paths.src.index)
        .pipe(inject(gulp.src([
            // Inject vendor libraries, always include angular first, then everything else
            paths.dest.vendor + "/angular.js",
            paths.dest.vendor + "/**/*"], {read: false}), {name: 'vendor', ignorePath: 'build'}))
        .pipe(inject(gulp.src([
            // Inject scripts, always include app.js first, then mocks, then everything else
            paths.dest.scripts + "/app.js",
            paths.dest.scripts + "/modules/mock.js",
            paths.dest.scripts + "/{mockdata,mockdata/**/*}", // Matcher for folder first, files second
            paths.dest.scripts + "/**/*"], {read: false}), {name: 'scripts', ignorePath: 'build'}))
        .pipe(inject(gulp.src([
            // Inject css
            paths.dest.css + "/**/*",
            paths.dest.vendor + "/**/*.css"
        ], {read: false}), {ignorePath: 'build'}))
        .pipe(gulp.dest("build"));
}

/**
 * Check JS with jshint
 */
function JsLint() {
    return gulp.src(paths.src.scripts + "/**/*")
        .pipe(jshint())
        .pipe(jshint.reporter(stylish))
        .pipe(jshint.reporter('fail'));
}

/**
 * Check SCSS with scssLint
 */
function ScssLint() {
    gulp.src(paths.src.scss)
        .pipe(scssLint())
}

/**
 * Generate sourcemaps and output to build
 * Minify if specified in current environment
 */
function Scripts() {
    console.log("mockdata: " + env.mockdata);
    var sources = [
        paths.src.scripts + "/app.js",
        (env.mockdata ? "" : "!") + paths.src.scripts + "/modules/mock.js",
        (env.mockdata ? "" : "!") + paths.src.scripts + "/mockdata/**/*",
        paths.src.scripts + "/**/*.js"
    ];

    console.log(sources[1]);

    var concatFileName = 'all.min.js';

    return gulp.src(sources, {base: paths.src.scripts})
        .pipe(sourcemaps.init({gulpWarnings: false}))
        .pipe(ngAnnotate({gulpWarnings: false}))
        .pipe(gulpif(env.jsminify, uglify()))
        .pipe(gulpif(env.jsconcat, concat(concatFileName)))
        .pipe(sourcemaps.write())
        .pipe(gulp.dest(paths.dest.scripts))
        .pipe(reload({stream: true}));
}

/**
 * Generate CSS from SASS and output to build
 * Includes autoprefixer and sourcemaps
 * Minify if specified in current environment
 */
function Sass() {
    gulp.src(paths.src.scss)
        .pipe(sourcemaps.init())
        .pipe(sass({
            includePaths: bourbon.with(neat.includePaths)
        }))
        .pipe(gulpif(env.scssminify, csso()))
        .pipe(autoprefixer('last 1 version'))
        .pipe(sourcemaps.write())
        .pipe(gulp.dest(paths.dest.css))
        .pipe(reload({stream: true}));
}

function Karma(done) {
    karma.start({
        configFile: __dirname + "/test/karma.conf.js",
        //singleRun: true,
        action: 'run',
        captureConsole: true
    }, function(){
        done();
    });
}

/**
 * Serve files and watch for changes
 */
function BrowserSync() {
    browserSync({
        server: {
            baseDir: paths.basedir
        }
    });

    gulp.watch(paths.src.scss, ['sass']);
    gulp.watch(paths.src.scripts + "/**/*", ['scripts']);
    gulp.watch('bower.json', ['moveVendors', 'injectDependencies'])
}




