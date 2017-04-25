/**
 * Created by Obscurity on 2016/3/20.
 */
"use strict";

exports.index = async (ctx, next) => {
    let Journal = global.database.models.journal;
    let Diary = global.database.models.diary;
    let Photo = global.database.models.photo;
    let Link = global.database.models.link;
    let User = global.database.models.user;
    let Article = global.database.models.article;
    let articles = await Article.find({}).sort({updated_at: -1}).limit(global.conf.pagination.column);
    let journals = {}, diary = {}, photos = {}, links = {}, user = {};
    user = await User.findOne({});
    if (ctx.session.user) {
        journals = await Journal.find({}).sort({updated_at: -1}).limit(global.conf.homepage.pagination.journal);
        diary = await Diary.find({}).sort({recorded_date: -1}).limit(1).findOne({});
    }
    else {
        journals = await Journal.find({is_public: true}).sort({updated_at: -1}).limit(global.conf.homepage.pagination.journal);
        diary = await Diary.find({is_public: true}).sort({recorded_date: -1}).limit(1).findOne({});
    }
    photos = await Photo.find({}).sort({created_at: -1}).limit(global.conf.homepage.pagination.photo);
    links = await Link.find({}).sort({name: 1});
    ctx.render('index', {
        title: "HeavenDuke的博客",
        current_user: ctx.session.user,
        current_guest: ctx.session.guest,
        redirect_url: ctx.request.url,
        photos: photos,
        journals: journals,
        diary: diary,
        links: links,
        articles: articles,
        owner: user.getBasicInfo(),
        Photo: Photo
    });
};