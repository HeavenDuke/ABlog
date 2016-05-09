/**
 * Created by heavenduke on 16-5-5.
 */

var journal = {};

journal.Schema = {
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
    placed_top: {
        type: Boolean,
        required: true,
        default: false
    },
    content: {
        type: String,
        required: false
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
    }
};

journal.collection = {
    collection: 'Journals'
};

journal.link = function(router, _id) {
    router.url('journals-detail', {journal_id: _id})
};

journal.title_top = function() {
    return '[置顶]' + this.title;
};

module.exports = journal;