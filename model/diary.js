/**
 * Created by Obscurity on 2016/5/12.
 */

var Diary = {};

Diary.Schema = {
    brief: {
        type: String,
        required: true
    },
    mood: {
        type: String,
        required: true,
        default: "happy"
    },
    tag: {
        type: String,
        required: true,
        default: 'coding'
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

Diary.mood_to_color = function () {
    var hash_table = {
        "excited": "bg-orange",
        "happy": "bg-green",
        "angry": "bg-red",
        "tired": "bg-gray",
        "distracted": "bg-aqua",
        "gloomy": "bg-blue",
        "desperate": "bg-black"
    };
    return hash_table[this.mood];
};

Diary.mood_list = function () {
    return {
        "excited": {translation: "一颗赛艇", color: "bg-orange"},
        "happy": {translation: "2333", color: "bg-green"},
        "angry": {translation: "I'm angry!", color: "bg-red"},
        "tired": {translation: "あっ、疲れた。", color: "bg-gray"},
        "distracted": {translation: "忧桑啊...", color: "bg-aqua"},
        "gloomy": {translation: "找静静中...", color: "bg-blue"},
        "desperate": {translation: "日了狗了", color: "bg-black"}
    };
};

Diary.translate_mood = function () {
    var hash_table = {
        "excited": "一颗赛艇",
        "happy": "2333",
        "angry": "I am angry!",
        "tired": "あっ、疲れた。",
        "distracted": "忧桑啊...",
        "gloomy": "找静静中...",
        "desperate": "日了狗了"
    };
    return hash_table[this.mood];
};

Diary.tag_list = function () {
    return {
        "everything": {translation: "不明", icon: "fa-user"},
        "read": {translation: "读书", icon: "fa-book"},
        "movie": {translation: "电影", icon: "fa-film"},
        "music": {translation: "音乐", icon: "fa-music"},
        "coding": {translation: "代码", icon: "fa-code-fork"},
        "academy": {translation: "学术", icon: "fa-university"},
        "writing": {translation: "写作", icon: "fa-keyboard-o"},
        "travel": {translation: "出游", icon: "fa-map"},
        "learning": {translation: "学习", icon: "fa-lightbulb-o"},
        "social": {translation: "社交", icon: "fa-comments-o"},
        "society": {translation: "社会", icon: "fa-transgender-alt"},
        "plan": {translation: "计划", icon: "fa-calendar"}
    };
};

Diary.translate_tag = function () {
    var hash_table = {
        "everything": "不明",
        "read": "读书",
        "movie": "电影",
        "music": "音乐",
        "coding": "代码",
        "academy": "学术",
        "writing": "写作",
        "travel": "出游",
        "learning": "学习",
        "social": "社交",
        "society": "社会",
        "plan": "计划",
        "animation": "动漫"
    };
    return hash_table[this.tag];
}

Diary.tag_to_icon = function () {
    var hash_table = {
        "everything": "fa-user",
        "read": "fa-book",
        "movie": "fa-film",
        "music": "fa-music",
        "coding": "fa-code-fork",
        "academy": "fa-university",
        "writing": "fa-keyboard-o",
        "travel": "fa-map",
        "learning": "fa-lightbulb-o",
        "social": "fa-comments-o",
        "society": "fa-transgender-alt",
        "plan": "fa-calendar",
        "animation": "fa-photo"
    };
    return hash_table[this.tag];
};

module.exports = Diary;