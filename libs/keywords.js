"use strict";
/**
 * Created by heavenduke on 17-2-16.
 */

let Keywords = function (array) {
    this.value = array;
    this.toString = function () {
        let result = "";
        for(let i = 0; i < this.value.length; i++) {
            result += this.value[i];
            if (i < this.value.length - 1) {
                result += ","
            }
        }
        return result;
    }
};

module.exports = Keywords;