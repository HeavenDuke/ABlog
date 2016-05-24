/**
 * Created by heavenduke on 16-5-5.
 */

var Tag = require('./tag');
var Journal = {};

Journal.Schema = {
    title: {
        type: String,
        required: true
    },
    read_count: {
        type: Number,
        required: true,
        default: 0,
        min: 0
    },
    is_public: {
        type: Boolean,
        required: true,
        default: false
    },
    comment_count: {
        type: Number,
        required: true,
        default: 0,
        min: 0
    },
    placed_top: {
        type: Boolean,
        required: true,
        default: false
    },
    content: {
        type: String,
        required: false
    },
    likes_count: {
        type: Number,
        required: true,
        default: 0
    },
    dislikes_count: {
        type: Number,
        required: true,
        default: 0
    },
    updated_at: {
        type: Date,
        required: true,
        default: Date.now
    },
    created_at: {
        type: Date,
        required: true,
        default: Date.now
    },
    category_id: {
        type: require('mongoose').Schema.ObjectId,
        required: false
    },
    tags: [Tag]
};

Journal.collection = {
    collection: 'Journals'
};

Journal.link = function(router, _id) {
    router.url('journals-detail', {journal_id: _id})
};

Journal.title_top = function() {
    return '[置顶]' + this.title;
};

module.exports = Journal;