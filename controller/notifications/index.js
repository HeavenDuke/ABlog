/**
 * Created by heavenduke on 16-7-11.
 */

var index = function *(next) {
    var Journal = global.database.models.journal;
    var Article = global.database.models.article;
    var Comment = global.database.models.comment;
    var comments = yield Comment.find({"$or": [{is_checked: false}, {'replies.is_checked': false}]});
    var article_ids = [];
    var journal_ids = [];
    comments.forEach(function (comment) {
        if (comment.article_id) {
            article_ids.push(comment.article_id);
        }
        else {
            journal_ids.push(comment.journal_id);
        }
    });
    var notifications = {
        articles: yield Article.find({_id: {"$in": article_ids}}),
        journals: yield Journal.find({_id: {"$in": journal_ids}})
    };
    this.body = JSON.stringify(notifications);
};

module.exports = {
    index: index
};