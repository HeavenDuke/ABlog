/**
 * Created by Obscurity on 2017/4/16.
 */
"use strict";
let qiniu_router = require('./qiniu');

module.exports = function(app) {

    qiniu_router(app);

};