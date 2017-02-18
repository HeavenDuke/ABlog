/**
 * Created by Obscurity on 2016/7/12.
 */

let Attitude = {};

Attitude.Schema = {
    like: {
        type: Boolean,
        required: true
    },
    guest_id: {
        type: require('mongoose').Schema.ObjectId,
        ref: "Guests"
    },
    article_id: {
        type: require('mongoose').Schema.ObjectId,
        ref: "Articles"
    },
    journal_id: {
        type: require('mongoose').Schema.ObjectId,
        ref: "Journals"
    }
};

Attitude.collection = {
    collection: 'Attitudes'
};

module.exports = Attitude;