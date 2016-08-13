/**
 * Created by heavenduke on 16-8-13.
 */

var Gallery = {};

Gallery.Schema = {
    name: {
        type: String,
        required: true
    },
    introduction: {
        type: String,
        required: true
    },
    created_at: {
        type: Date,
        required: true,
        default: Date.now
    },
    updated_at: {
        type: Date,
        required: true,
        default: Date.now
    }
};

Gallery.collection = {
    collection: 'Galleries'
};

module.exports = Gallery;