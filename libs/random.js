"use strict";
/**
 * Created by Obscurity on 2016/5/12.
 */

module.exports = function () {
    Math.randint = function (min, max) {
        let random = Math.random();
        return min + Math.round(random * (max - min));
    };
};