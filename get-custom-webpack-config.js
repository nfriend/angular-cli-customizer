var findup = require('findup');
var path = require('path');
var chalk = require('chalk');

/**
 * Gets the custom webpack.config.js from the file system.
 * If no webpack.config.js is found, undefined is returned.
 */
module.exports = function getCustomWebpackConfigs() {
    // get the path to the configuration file
    var configPath;
    try {
        var configDir = findup.sync(process.cwd(), 'webpack.config.js');
        configPath = path.join(configDir, 'webpack.config.js');
    } catch (err) {
        console.info(
            chalk.blue(
                'No custom webpack.config.js file was found. ' +
                    'The default CLI build will not be customized.'
            )
        );
        return undefined;
    }

    // require the configuration file
    var customConfig;
    try {
        customConfig = require(configPath);
    } catch (err) {
        console.error(
            chalk.red(
                'There was an issue require()-ing the custom ' +
                    'Webpack configuration file at "' +
                    configPath +
                    '". The default CLI build will not be customized.\n'
            ),
            err
        );
    }

    return customConfig;
};
