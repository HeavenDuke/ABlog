/**
 * Created by Obscurity on 2016/3/20.
 */

exports.index = function *(next) {
    let Journal = global.database.models.journal;
    let Diary = global.database.models.diary;
    let Photo = global.database.models.photo;
    let Link = global.database.models.link;
    let User = global.database.models.user;
    let Article = global.database.models.article;
    let articles = yield Article.find({}).sort({updated_at: -1}).limit(global.conf.pagination.column);
    let journals = {}, diary = {}, photos = {}, links = {}, user = {};
    user = yield User.findOne({});
    if (this.session.user) {
        journals = yield Journal.find({}).sort({updated_at: -1}).limit(global.conf.homepage.pagination.journal);
        diary = yield Diary.find({}).sort({recorded_date: -1}).limit(1).findOne({});
    }
    else {
        journals = yield Journal.find({is_public: true}).sort({updated_at: -1}).limit(global.conf.homepage.pagination.journal);
        diary = yield Diary.find({is_public: true}).sort({recorded_date: -1}).limit(1).findOne({});
    }
    photos = yield Photo.find({}).sort({created_at: -1}).limit(global.conf.homepage.pagination.photo);
    links = yield Link.find({}).sort({name: 1});
    this.render('index', {
        title: "HeavenDuke的博客",
        current_user: this.session.user,
        current_guest: this.session.guest,
        redirect_url: this.request.url,
        photos: photos,
        journals: journals,
        diary: diary,
        links: links,
        articles: articles,
        owner: user.getBasicInfo(),
        Photo: Photo
    });
};