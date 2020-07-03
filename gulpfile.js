/*!
 * @Author: cloudyan <cloudcode@qq.com>
 * @Date: 2020-07-01 18:36:04
 * 功能说明: 编译传统 html 静态资源到 cdn，并启用强缓存
 */

// 微信无法直接使用本地图片，使用脚本把图片上传到七牛

var gulp = require('gulp');
var path = require('path');
var fs = require('fs');
var $ = require('gulp-load-plugins')();
var del = require('del');
var md5 = require('gulp-md5plus');
// var runSequence = require('run-sequence');
// var browserSync = require('browser-sync');
var qnConfig = require('./qnConfig');
var argv = require('yargs').argv;
var pump = require('pump');
// var through = require('through2');

var dir = argv.path || '.'

if (dir === '.') {
  console.warn('您正在操作当前项目 ./')
}
if (/\/$/.test(dir)) {
  dir = dir.replace(/\/$/, '');
}

var qnOptions = {
  accessKey: qnConfig.qnAK,
  secretKey: qnConfig.qnSK,
  bucket: qnConfig.qnBucketUIS,
  origin: qnConfig.qnDomainUIS,
}

var AUTOPREFIXER_BROWSERS = [
  'ie >= 9',
  'ie_mob >= 10',
  'ff >= 30',
  'chrome >= 34',
  'safari >= 7',
  'opera >= 23',
  'ios >= 7',
  'android >= 2.3',
  'bb >= 10',
];

// gulp --path=xxx
// copy src/xxx/json  -> dist/xxx
// md5 src/xxx/**/* (json) -> dist/xxx
// md5 json
// qn

var paths = {
  src: [
    dir + '/src/**/*',
    '!' + dir + '/src/*.html',
    '!' + dir + '/src/config.json',
  ],
  copySrc: dir + '/src/**/*.html',
  dist: dir + `/dist/`,
  quoteSrc: [
    // html
    `${dir}/dist/**/*.html`,
    `${dir}/dist/**/*.css`,
  ],
};

// console.log(paths)

// gulp.task(name[, deps], fn)
// deps 一个包含任务列表的数组，这些任务会在你当前任务运行之前完成。
// deps 里面的所有任务默认是最大限度的并行执行。

// clean
function clean(cb) {
  del(paths.dist);
  cb && cb();
}
gulp.task('clean', clean);

// copy
function copy(cb) {
  return pump([
    gulp.src(paths.copySrc),
    gulp.dest(paths.dist)
  ])
  cb && cb();
}
gulp.task('copy', copy);

// 资源 md5
const genMd5 = function genMd5(cb){
  pump([
    gulp.src(paths.src),
    // 匹配以下格式进行替换(必须使用相对路径，真实可用)
    // html `src="https://img1.haoshiqi.net/miniapp/xxx.png"`
    // css `url("https://img1.haoshiqi.net/miniapp/xxx.png"`
    // html `url("https://img1.haoshiqi.net/miniapp/xxx.png'`
    md5(6, paths.quoteSrc),
    gulp.dest(paths.dist)
  ]);
  cb && cb();
};
gulp.task('md5', genMd5);

// 上传七牛
const uploadQn = function uploadQn(cb){
// function uploadQn(cb){
  pump([
    gulp.src([
      paths.dist + '**/*',
      // '!' + paths.dist + '/*.json',
    ]),
    $.qndn.upload({
      prefix: 'yz/',
      qn: qnOptions,
    }),
  ]);
  console.log(`上传地址为： ${qnOptions.origin}yz/`)
  cb && cb();
};
gulp.task('qn', uploadQn);


// var regHtml = / src="\.\.\/\.\.\/img\//g
// var regCss = /url\("\.\.\/img\//g
// var regJs = /'.\.\/img\//g
const replaceRemote = function replaceRemote(cb){
  pump([
    gulp.src(paths.quoteSrc),
    // html 中
    $.replace('<link rel="stylesheet" href="css/', `<link rel="stylesheet" href="${qnOptions.origin}yz/css/`),
    $.replace('<script src="js/', `<script src="${qnOptions.origin}yz/js/`),
    // css 中
    $.replace('url("../img/', `url("${qnOptions.origin}yz/img/`),
    $.replace('url("../fonts/', `url("${qnOptions.origin}yz/fonts/`),
    // js 中
    $.replace('../img/', `'${qnOptions.origin}yz/img/`),
    gulp.dest(function(file) {
      return file.base;
    }),
  ]);
  console.log(`图片替换完成`)
  cb && cb();
};
gulp.task('replace', replaceRemote);

// https://fettblog.eu/gulp-4-parallel-and-series/
// gulp.series 用于顺序执行
// gulp.parallel 用于并行执行。
// gulp.task('default', gulp.series('clean', 'md5', 'qn'));

// gulp.task('default', function(){
//   runSequence('clean', 'qn');
// });

// 指定一个新的 cwd (当前工作目录)
gulp.task('default', $.shell.task([
  `gulp clean --path=${dir}`,
  `gulp copy --path=${dir}`,
  `gulp md5 --path=${dir}`,
  `gulp qn --path=${dir}`,
], {
  cwd: './'
}));

gulp.task('build', $.shell.task([
  `gulp clean --path=${dir}`,
  `gulp copy --path=${dir}`,
  `gulp md5 --path=${dir}`,
  `gulp qn --path=${dir}`,
  `gulp replace --path=${dir}`,
], {
  cwd: './'
}));
