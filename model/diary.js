/**
 * Created by Obscurity on 2016/5/12.
 */

var Diary = {};

Diary.Schema = {
    brief: {
        type: String,
        required: true
    },
    content: {
        type: String,
        required: true
    },
    recorded_date: {
        type: Date,
        required: true,
        default: Date.now
    },
    recorded_at: {
        type: Date,
        required: true,
        default: Date.now
    },
    updated_at: {
        type: Date,
        required: true,
        default: Date.now
    }
};

Diary.collection = {
    collection: 'Diaries'
};

module.exports = Diary;