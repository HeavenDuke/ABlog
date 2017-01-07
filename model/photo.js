/**
 * Created by heavenduke on 16-8-13.
 */

let Photo = {};

Photo.Schema = {
    title: {
        type: String,
        required: true
    },
    location: {
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
    },
    path: {
        type: String,
        required: true
    }
};

Photo.collection = {
    collection: 'Photos'
};

module.exports = Photo;