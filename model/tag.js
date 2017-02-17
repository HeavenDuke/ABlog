/**
 * Created by obscurity on 17-2-16.
 */

let Tag = {};

Tag.Schema = {
    name: {
        type: String,
        required: true
    },
    journal_count: {
        type: Number,
        required: false,
        default: 0
    }
};

module.exports = Tag;