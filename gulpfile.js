const { src, dest, series } = require("gulp");
const rimraf = require("rimraf");
const fs = require("fs");
const merge = require("merge-stream");
const path = require("path");

const PACKAGE = JSON.parse(fs.readFileSync("./package.json"));
const RELEASE_PATH = `release/${PACKAGE.name} ${PACKAGE.version}`;

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

function cleanReleaseDirectory(cb) {
    rimraf(RELEASE_PATH + "/**", () => {
        cb();
    });
}

function copyReleaseFiles(cb) {
    const paths = [
        { src: "build/**", dest: path.join(RELEASE_PATH, "/build") },
        { src: "libraries/**", dest: path.join(RELEASE_PATH, "/libraries") },
        { src: "images/**", dest: path.join(RELEASE_PATH, "/images") },
        { src: "index.html", dest: RELEASE_PATH },
    ];

    var tasks = paths.map((path) => src(path.src).pipe(dest(path.dest)));
    return merge(tasks);
}

exports.update_libraries = series(cleanLibrariesDirectory, copyLibraries);
exports.release = series(cleanReleaseDirectory, copyReleaseFiles);
