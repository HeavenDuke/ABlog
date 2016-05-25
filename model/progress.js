/**
 * Created by Obscurity on 2016/5/25.
 */

var Progress = {};

Progress.Schema = {
    title: {
        type: String,
        required: true
    },
    version: {
        type: String,
        required: false
    },
    created_at: {
        type: Date,
        required: true,
        default: Date.now
    },
    description: {
        type: String,
        required: true,
        default: ""
    }
};

module.exports = Progress;