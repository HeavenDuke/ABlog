/**
 * Created by heavenduke on 16-8-13.
 */

var Photo = {};

Photo.Schema = {
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
    },
    path: {
        type: String,
        required: true
    },
    gallery_id: {
        type: require('mongoose').Schema.ObjectId,
        required: true
    }
};

Photo.collection = {
    collection: 'Photos'
};

module.exports = Photo;