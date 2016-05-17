/**
 * Created by Obscurity on 2016/5/17.
 */


var Reply = {};

Reply.Schema = {
    content: {
        type: String,
        required: false
    },
    created_at: {
        type: Date,
        required: true,
        default: Date.now
    }
};

module.exports = Reply;
