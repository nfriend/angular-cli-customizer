# angular-cli-customizer
A small command-line Node module that allows Angular CLI's Webpack config file to be customized

## Installation

```bash
npm install @angular/cli -g
npm install angular-cli-customizer -g
```

## Usage

1. Define a `webpack.config.js` file at the root of your project containing the Webpack configuration settings you wish modify/add to the Angular CLI's build:

```javascript
const path = require('path');

module.exports = {
    resolve: {
        alias: {
            angular: path.resolve(__dirname, 'node_modules/angular')
        }
    }
};
```

2. Use the command line interface exposed by this module - `cng` - exactly as you would with the `@angular/cli` module (`ng`):

```bash
cng serve --open
```

## API

The `cng` command is simply a wrapper for the `ng` command, so its API is identical to the standard `ng` command!

## Why is this necessary?

[Angular's CLI](https://cli.angular.io/) is a fantastic tool for generating and developing Angular applications. Unfortunately, it has one major flaw - at the time of writing, there is no way to customize or extend the CLI's stock functionality. Even though the Angular CLI is built on top of the infinitely configurable [Webpack](https://webpack.js.org/), the CLI doesn't allow its internal Webpack configuration to be altered.

## What does this module do?

This module does some acrobatics (modifying the `require` function) to surgically replace the internal function (`buildConfig()`) that is responsible for generating the CLI's Webpack configuration object.  The replacement function takes the result of the original `buildConfig()` call, merges in any changes defined in the custom `webpack.config.js` file, and returns the merged result.

Other than that, the `cng` command is simply a wrapper for the `ng` command.

## Isn't this a hack?

Yep. It depends on internal implementation details of the CLI, which could change during any update of the `@angular/cli` package.  Hopefully a better customization solution will be eventually be built into the CLI.


