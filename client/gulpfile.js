const gulp = require('gulp');
const concatenate = require('gulp-concat');
const cleanCSS = require('gulp-clean-css');
const autoPrefix = require('gulp-autoprefixer');
const gulpSASS = require('gulp-sass');
const rename = require('gulp-rename');

const sassFiles = [
    './src/styles/variables.scss',
    './src/styles/custom.scss',
    './src/styles/bootstrap/scss/_variables.scss'
];

gulp.task('sass', function(done){
    gulp
    .src(sassFiles)
    .pipe(gulpSASS())
    .pipe(concatenate('styles.css'))
    .pipe(gulp.dest('./src/css/'))
    .pipe(autoPrefix())
    .pipe(cleanCSS())
    .pipe(rename('styles.min.css'))
    .pipe(gulp.dest('./src/css/'));
    done();
});

gulp.task('watch', function(done){
    gulp.watch(sassFiles, gulp.series('sass'));
    done();
});

gulp.task('default', gulp.series('watch'));