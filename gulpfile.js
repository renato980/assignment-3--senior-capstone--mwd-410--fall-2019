const { src, dest } = require(`gulp`);
const babel = require(`gulp-babel`);
const sass = require(`gulp-sass`);
const sassLint = require(`gulp-sass-lint`);
const jsLinter = require(`gulp-eslint`);
const del = require(`del`);

// Note: All the linter-related config files mentioned in the comments below are
// empty. Part of this assignment is to populate them with your own config files from
// the previous assignment.

/**
 * Fetch all JS files and transpile into ES6, depending on the configurations
 * included in .babelrc, which is in the root of this project.
 *
 * @returns {*}
 */
let transpileJSForDev = () => {
    return src(`app/views/scripts/*.js`)
        .pipe(babel())
        .pipe(dest(`temp/scripts`));
};

/**
 * Before transpiling Sass → CSS, lint the former using the config options defined
 * in the file .sass-lint.yml, which is in the root of this project.
 *
 * @returns {*}
 */
let compileCSSForDev = () => {
    return src(`app/views/sass/main.scss`)
        .pipe(sassLint({configFile: './.sass-lint.yml'}))
        .pipe(sassLint.format())
        .pipe(sassLint.failOnError())
        .pipe(sass())
        .pipe(dest(`temp/styles`));
};

/**
 * Transpile ES5 → ES6, based on the configurations in ./eslintrc.json, which is in
 * the root of this project.
 *
 * @returns {*}
 */
let lintJS = () => {
    return src(`app/views/scripts/*.js`)
        .pipe(jsLinter(`./.eslintrc.json`))
        .pipe(jsLinter.formatEach(`compact`, process.stderr));
};

/**
 * Use pure Node to delete the “temp” folder. Add folder paths to the
 * “foldersToDelete” array below in order to delete more folders when running the
 * “clean” task.
 *
 * @returns {Promise<void>}
 */
async function clean () {
    let fs = require(`fs`),
        i,
        foldersToDelete = [`temp`];

    for (i = 0; i < foldersToDelete.length; i++) {
        try {
            fs.accessSync(foldersToDelete[i], fs.F_OK);
            process.stdout.write(`\n\tThe ` + foldersToDelete[i] +
                ` directory was found and will be deleted.\n`);
            del(foldersToDelete[i]);
        } catch (e) {
            process.stdout.write(`\n\tThe ` + foldersToDelete[i] +
                ` directory does NOT exist or is NOT accessible.\n`);
        }
    }

    process.stdout.write(`\n`);
}

exports.lintJS = lintJS;
exports.transpileJSForDev = transpileJSForDev;
exports.compileCSSForDev = compileCSSForDev;
exports.clean = clean;
