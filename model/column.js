/**
 * Created by Obscurity on 2016/5/28.
 */

var Column = {};

Column.Schema = {
    name: {
        type: String,
        required: true
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

Column.collection = {
    collection: 'Columns'
};

module.exports = Column;