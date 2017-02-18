/**
 * Created by heavenduke on 16-5-8.
 */

let Comment = {};

Comment.Schema = {
    content: {
        type: String,
        required: false
    },
    is_checked: {
        type: Boolean,
        default: false
    },
    created_at: {
        type: Date,
        required: true,
        default: Date.now
    },
    journal_id: {
        type: require('mongoose').Schema.ObjectId,
        ref: "Journals"
    },
    article_id: {
        type: require('mongoose').Schema.ObjectId,
        ref: "Articles"
    },
    user_id: {
        type: require('mongoose').Schema.ObjectId,
        ref: "Users"
    },
    guest_id: {
        type: require('mongoose').Schema.ObjectId,
        ref: "Guests"
    },
    replies: [require('./reply').Schema]
};

Comment.collection = {
    collection: 'Comments'
};

module.exports = Comment;