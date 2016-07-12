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
    },
    is_checked: {
        type: Boolean,
        default: false
    },
    user_id: {
        type: require('mongoose').Schema.ObjectId,
        ref: "Users"
    },
    guest_id: {
        type: require('mongoose').Schema.ObjectId,
        ref: "Guests"
    }
};

module.exports = Reply;
