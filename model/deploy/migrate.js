/**
 * Created by Obscurity on 2016/5/2.
 */

var database = require('../index').loader;

var migrate = function () {

    function migrateJournal() {
        var Journal = database.models.journal;
        var Comment = database.models.comment;
        var journals = Journal.find({});
        for(var index in journals) {
            journals[index].comment_count = Comment.find({journal_id: journals[index]._id}).count();
            journals[index].save();
        }
    }

    var mongoose = require('mongoose');
    mongoose.connect(require('../../config/config')().mongodb);
    migrateJournal();
    console.log('finish migrating database seed.');
    mongoose.disconnect();
};

migrate();