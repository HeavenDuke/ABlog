/**
 * Created by heavenduke on 16-5-25.
 */

var Project = {};

Project.Schema = {
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

Project.collection = {
    collection: 'Projects'
};

module.exports = Project;