"use strict";
/**
 * Created by heavenduke on 17-1-28.
 */

let shares_controller = require('../../controller').shares;
let set_redirection = require('../../middlewares/set_redirection');
let Router = require('koa-router');
let router = new Router({
    prefix: "/shares"
});

router.get('shares-index', '/', shares_controller.show);

router.post('shares-update', '/', shares_controller.update);

module.exports = router;