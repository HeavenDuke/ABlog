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

Photo.get_thumb_image = function (image_path) {
    let dotIndex = image_path.lastIndexOf(".");
    return image_path.substring(0, dotIndex) + "_thumb." + image_path.substring(dotIndex + 1);
};

Photo.collection = {
    collection: 'Photos'
};

module.exports = Photo;