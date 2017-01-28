/**
 * Created by heavenduke on 17-1-28.
 */

let Share = {};

Share.Schema = {
    stat: {
        type: Number,
        default: 0,
        required: true
    },
    platform: {
        type: String,
        required: true
    },
    url: {
        type: String,
        required: true
    }
};

Share.colletion = {
    collection: "Shares"
};

module.exports = Share;