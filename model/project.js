/**
 * Created by heavenduke on 16-5-25.
 */

var Project = {};
var Progress = require('./progress');

Project.Schema = {
    name: {
        type: String,
        required: true
    },
    introduction: {
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
    },
    started_at: {
        type: Date,
        required: true,
        default: Date.now
    },
    closed_at: {
        type: Date,
        required: false
    },
    progress: [Progress]
};

Project.collection = {
    collection: 'Projects'
};

module.exports = Project;