#!/usr/bin/env node
'use strict';

var path = require('path');
var gmp = require('global-modules-path');
var chalk = require('chalk');
var mergeConfigs = require('./merge-configs');
var getCustomWebpackConfig = require('./get-custom-webpack-config');

// store a reference to the original require() function
var Module = require('module');
var originalRequire = Module.prototype.require;

// Get the custom Webpack configuration, if it exists
var customWebpackConfig = getCustomWebpackConfig();

/**
 * Creates a function which calls the original "buildConfig" function
 * and merges the result with a custom configuration, if it exists.
 * @param {*} originalBuildConfigFn Angular CLI's original "buildConfig"
 * function which will be called during this function's execution
 */
function getCustomBuildConfigFn(originalBuildConfigFn) {
    return function customBuildConfig() {
        var buildConfigResult = originalBuildConfigFn.apply(this, arguments);
        return mergeConfigs(buildConfigResult, customWebpackConfig);
    };
}

// Replace the global "require" function with one
// that calls through to the original "require" function
// in all cases but one - when the CLI is requesting the
// class that is responsible for building and returning
// its internal Webpack configuration object. Replace this
// function with our own version that includes the
// custom merging logic.
//
// Only do this if a custom Webpack config has been
// defined, though.  If not, leave the require() function alone.
if (customWebpackConfig) {
    Module.prototype.require = function() {
        var result = originalRequire.apply(this, arguments);

        if (/webpack-config$/gi.test(arguments[0])) {
            if (
                result &&
                result['NgCliWebpackConfig'] &&
                result['NgCliWebpackConfig'].prototype.buildConfig
            ) {
                var originalBuildConfig = result['NgCliWebpackConfig'].prototype.buildConfig;
                result['NgCliWebpackConfig'].prototype.buildConfig = getCustomBuildConfigFn(
                    originalBuildConfig
                );
            }
        }

        return result;
    };
}

// Now that we have our custom require() function set up the way we want,
// find the location of the Angular CLI's entry point and start the CLI
var angularCliBasePath = gmp.getPath('@angular/cli234');
if (!angularCliBasePath) {
    console.error(
        chalk.red(
            "Couldn't find the global installation of the Angular CLI... is it installed?\n" + 
            'You can install the CLI globally using "npm install @angular/cli -g"'
        )
    );
} else {
    var angularCliPath = path.join(angularCliBasePath, 'bin/ng');

    // start the CLI
    require(angularCliPath);
}
