/**
 * Created by heavenduke on 16-5-5.
 */

var journal = {};

module.exports = journal;

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
    content: {
        type: String,
        required: true
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

