/**
 * Created by Obscurity on 2016/5/11.
 */

exports.index = function *() {
    var Diary = global.database.models.diary;
    var diaries = yield Diary.find({}).sort({recorded_at: -1});
    if (!this.request.query.remote) {
        this.render('diaries/index', {title: "日记", current_user: this.session.user, diaries: diaries});
    }
    else {
        this.body = {diaries: diaries};
    }
};

exports.create = function *() {
    var Diary = global.database.models.diary;
    var diary = new Diary();
    diary.brief = this.request.body.brief;
    diary.content = this.request.body.content;
    diary.recorded_date = new Date(this.request.body.recorded_date);
    diary.save();
    this.redirect('/diaries');
};

exports.update = function *() {
    var Diary = global.database.models.diary;
    var diary = yield Diary.findById(this.params.diary_id);
    diary.brief = this.request.body.brief;
    diary.content = this.request.body.content;
    diary.recorded_date = new Date(this.request.body.recorded_date);
    diary.save();
    this.redirect('/diaries');
};

exports.destroy = function *() {
    var Diary = global.database.models.diary;
    var diary = yield Diary.findByIdAndRemove(this.params.diary_id);
    this.redirect('/diaries');
};