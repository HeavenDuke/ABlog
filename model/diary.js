/**
 * Created by Obscurity on 2016/5/12.
 */

let Diary = {};

Diary.Schema = {
    brief: {
        type: String,
        required: true
    },
    is_public: {
        type: Boolean,
        required: true,
        default: true
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
    },
    images: {
        type: Array,
        required: false,
        default: []
    }
};

Diary.collection = {
    collection: 'Diaries'
};

Diary.mood_to_color = function () {
    let hash_table = {
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
    let hash_table = {
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
        "animation": {translation: "动漫", icon: "fa-photo"},
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
    let hash_table = {
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
    let hash_table = {
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

Diary.get_thumb_image = function (image_path) {
    let dotIndex = image_path.lastIndexOf(".");
    return image_path.substring(0, dotIndex) + "_thumb." + image_path.substring(dotIndex + 1);
};

Diary.get_diary_container = function (admin) {
    let result = "<li class='time-label'>";
    result += "<span class='bg-green'>" + this.recorded_date.format("yyyy年MM月dd日") + "</span>";
    result += "</li>";
    result += "<li>";
    result += "<i id='" + this._id + "_tag' tag='" + this.tag + "' class='fa " + this.mood_to_color() + " " + this.tag_to_icon() + "'></i>";
    result += "<div class='timeline-item'>";
    result += "<span class='time'>";
    result += "<div class='hidden' id='" + this._id + "_content' content='" + this.content + "'></div>";
    result += "<div class='hidden' id='" + this._id + "_date' date='" + this.recorded_date.format("yyyy-MM-dd") + "'></div>";
    result += "<div class='hidden' id='" + this._id + "_mood' mood='" + this.mood + "'></div>";
    result += "<div class='hidden' id='" + this._id + "_publicity' publicity='" + this.is_public + "'></div>";
    result += "<div class='hidden' id='" + this._id + "_images' images='" + (this.images ? JSON.stringify(this.images) : "[]") + "'>";
    if (this.images) {
        for (let i = 0; i < this.images.length; i++) {
            result += "<div thumb='" + Diary.get_thumb_image("/" + this.images[i]) + "'></div>";
        }
    }
    result += "</div>";
    result +=　"</span>";
    result += "<h3 class='hd timeline-header' id='" + this._id + "_brief'>" + this.brief + "</h3>";
    result += "<div class='hd timeline-body' id='" + this._id + "_content'>" + this.content + "</div>";
    result += "<div class='hd timeline-body' id='" + this._id + "_gallery'>";
    if (this.images) {
        for (let i = 0; i < this.images.length; i++) {
            result += "<a href='" + this.images[i] + "'>";
            result += "<img thumb_url='" + Diary.get_thumb_image("/" + this.images[i]) + "' class='margin image_thumb' src='" + Diary.get_thumb_image("/" + this.images[i]) + "'>";
            result += "</a>";
        }
    }
    result += "</div>";
    if (admin) {
        result += "<div class='timeline-footer'>";
        result += "<a diary_id='" + this._id + "'  data-toggle='modal' data-target='#edit_diary_modal' class='btn btn-xs btn-warning'>编辑</a>";
        result += "<a href='/diaries/" + this._id + "?_method=delete' style='margin-left: 10px;' class='btn btn-xs btn-danger delete-entry'>删除</a>";
        result += "</div>";
    }
    result += "</div>";
    result += "</li>";
    return result;
};

module.exports = Diary;