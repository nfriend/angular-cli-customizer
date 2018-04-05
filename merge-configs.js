var _ = require('lodash');

/**
 * Merges two Webpack config objects together.
 * Note that merging can only add or modify properties, not remove.
 * @param {*} originalConfig The original Angular Webpack config
 * @param {*} customConfig The custom Webpack config to merge in
 */
module.exports = function mergeConfigs(originalConfig, customConfig) {
    // the causes arrays to be concatenated
    // instead of replaced index-by-index.
    // i.e. merging [1, 2] and [3] becomes
    // [1, 2, 3], not [3, 2].
    // taken from https://lodash.com/docs/4.17.5#mergeWith
    function customizer(objValue, srcValue) {
        if (_.isArray(objValue)) {
            return objValue.concat(srcValue);
        }
    }

    return _.mergeWith({}, originalConfig, customConfig, customizer);
};
