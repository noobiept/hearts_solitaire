const { src, dest, series } = require("gulp");
const rimraf = require("rimraf");

function cleanLibrariesDirectory(cb) {
    rimraf("libraries/**", () => {
        cb();
    });
}

function copyLibraries(cb) {
    return src([
        "node_modules/easeljs/lib/easeljs.min.js",
        "node_modules/tweenjs/lib/tweenjs.min.js",
        "node_modules/preloadjs/lib/preloadjs.min.js",
    ]).pipe(dest("libraries/"));
}

exports.update_libraries = series(cleanLibrariesDirectory, copyLibraries);
