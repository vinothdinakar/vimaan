'use strict';

var program = require('commander');
var fs = require('fs');
var mkdirp = require('mkdirp');
var path = require('path');
var chalk = require('chalk');

var MODE_0666 = parseInt('0666', 8);
var MODE_0755 = parseInt('0755', 8);

program
    .version('0.0.1')
    .description('An application for creating modules')
    .option('-n, --moduleName', 'Name of the module')
    .parse(process.argv);


main();

/*
if (program.name) console.log('  - name');

var cheese = true === program.cheese
    ? 'marble'
    : program.cheese || 'no';

console.log('  - %s cheese', cheese);
console.log(program.args);
*/


/**
 *  Main Program
 */

function main(){
    // Path
    if (program.moduleName) {
        var nameArg = program.args.shift();
    }else{
        console.log(chalk.red('Please enter a module name with -n.'));
        console.log(chalk.red('Example: node libs/scripts/module -n sample'));
        console.log(chalk.red('Try --help for help.'));
        exit(1);
    }
    var modulesPath = path.resolve('./modules');
    var destinationPath = modulesPath + '\\' + nameArg;

    // App name
    var appName = createAppName(path.resolve(destinationPath));

    // Generate application
    emptyDirectory(destinationPath, function (empty) {
        if (empty) {
            createApplication(appName, destinationPath)
        } else {
            console.log(chalk.red('Module exist with the same name. Please try with a different name'));
            exit(1);
        }
    });

}

/**
 * Create an app name from a directory path, fitting npm naming requirements.
 *
 * @param {String} pathName
 */

function createAppName (pathName) {
    return path.basename(pathName)
        .replace(/[^A-Za-z0-9.()!~*'-]+/g, '-')
        .replace(/^[-_.]+|-+$/g, '')
        .toLowerCase()
}

/**
 * Check if the given directory `path` is empty.
 *
 * @param {String} path
 * @param {Function} fn
 */

function emptyDirectory (path, fn) {
    fs.readdir(path, function (err, files) {
        if (err && err.code !== 'ENOENT') throw err
        fn(!files || !files.length)
    })
}

/**
 * Create application at the given directory `path`.
 *
 * @param {String} path
 */

function createApplication (name, path) {

    console.log(chalk.green('--------------------------------------------------------------------------------------------------'));
    console.log(chalk.green('---------------------------------------Creating Module--------------------------------------------'));
    console.log(chalk.green('--------------------------------------------------------------------------------------------------'));

    function complete () {
        console.log();
        console.log(chalk.green('-----------------------------Module '+ name + ' created successfully------------------------------'));
        console.log(chalk.green('--------------------------------------------------------------------------------------------------'));
    };

    mkdir(path, function () {
        mkdir(path + '/controllers');
        mkdir(path + '/routes');
        mkdir(path + '/test');
        setTimeout(console.log(), 1000);
        copyTemplate('./libs/scripts/template/sample.controllers.js', path + '/controllers/'+ name +'.controllers.js');
        copyTemplate('./libs/scripts/template/sample.routes.js', path + '/routes/'+ name +'.routes.js');
        copyTemplate('./libs/scripts/template/sample.test.js', path + '/test/'+ name +'.test.js');
        complete();
    });

}

function exit(){
    process.exit();
}

/**
 * Mkdir -p.
 *
 * @param {String} path
 * @param {Function} fn
 */

function mkdir (path, fn) {
    mkdirp(path, MODE_0755, function (err) {
        if (err) throw err
        //console.log('   \x1b[36mcreate\x1b[0m : ' + path)
        fn && fn()
    })
}

/**
 * Copy file from template directory.
 */

function copyTemplate (from, to) {
    from = path.resolve(from);
    write(to, fs.readFileSync(from, 'utf-8'))
}

/**
 * echo str > path.
 *
 * @param {String} path
 * @param {String} str
 */

function write (path, str, mode) {
    fs.writeFileSync(path, str, { mode: mode || MODE_0666 })
    console.log('   \x1b[36mcreate\x1b[0m : ' + path)
}