/**
 * Created by Obscurity on 2016/6/19.
 */

var init = function *(next) {
    
};

var create = function *(next) {
    
};

var edit = function *(next) {
    
};

var update = function *(next) {
    
};

module.exports = {
    init: init,
    create: create,
    edit: edit,
    update: update,
    sessions: require('./sessions'),
    passwords: require('./passwords'),
    sms: require('./sms')
};