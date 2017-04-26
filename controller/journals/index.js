/**
 * Created by Obscurity on 2016/3/20.
 */
"use strict";

exports.index = async (ctx, next) => {
    let Journal = global.database.models.journal;
    let Stat = global.database.models.stat;
    let journal_per_page = global.conf.pagination.journal;
    let total_journal_count = null;
    let topped_journal_count = null;
    let current_page_index = null;
    let total_page = null;
    let offset = null;
    let journals = null;
    let journals_not_topped = null;
    let tag = ctx.request.query.tag;
    let stat = await Stat.findOne({});
    if (!stat) {
        stat = await Stat.create({tags: []});
    }
    let tags = stat.tags;
    if (ctx.session.user) {
        total_journal_count = await Journal.count(tag ? {"tags.name": tag} : {});
        topped_journal_count = await Journal.count(tag ? {"placed_top": true, "tags.name": tag} : {"placed_top": true});
        total_page = Math.ceil(total_journal_count / journal_per_page);
        current_page_index = parseInt(ctx.request.query.page) == 0 || isNaN(parseInt(ctx.request.query.page)) ? 1 : parseInt(ctx.request.query.page);
        offset = (current_page_index - 1) * global.conf.pagination.journal;
        journals = await Journal.find(tag ? {
            "placed_top": true,
            "tags.name": tag
        } : {"placed_top": true}).sort({updated_at: -1}).skip(offset).limit(journal_per_page);
        if (journals.length < journal_per_page) {
            journals_not_topped = await Journal.find(tag ? {
                "placed_top": false,
                "tags.name": tag
            } : {"placed_top": false}).sort({updated_at: -1}).skip(offset > topped_journal_count ? offset - topped_journal_count : 0).limit(journal_per_page - journals.length);
            journals = journals.concat(journals_not_topped);
        }
    }
    else {
        total_journal_count = await Journal.count(tag ? {is_public: true, "tags.name": tag} : {is_public: true});
        topped_journal_count = await Journal.count(tag ? {
            "placed_top": true,
            is_public: true,
            "tags.name": tag
        } : {"placed_top": true, is_public: true});
        total_page = Math.ceil(total_journal_count / journal_per_page);
        current_page_index = parseInt(ctx.request.query.page) == 0 || isNaN(parseInt(ctx.request.query.page)) ? 1 : parseInt(ctx.request.query.page);
        offset = (current_page_index - 1) * global.conf.pagination.journal;
        journals = await Journal.find(tag ? {
            placed_top: true,
            is_public: true,
            "tags.name": tag
        } : {
            placed_top: true,
            is_public: true
        }).sort({updated_at: -1}).skip(offset).limit(journal_per_page);
        if (journals.length < journal_per_page) {
            journals_not_topped = await Journal.find(tag ? {
                placed_top: false,
                is_public: true,
                "tags.name": tag
            } : {
                placed_top: false,
                is_public: true
            }).sort({updated_at: -1}).skip(offset > topped_journal_count ? offset - topped_journal_count : 0).limit(journal_per_page - journals.length);
            journals = journals.concat(journals_not_topped);
        }
    }
    let pagination = {
        total_page: total_page,
        current_index: current_page_index
    };
    tags.sort(function (tag1, tag2) {
        return tag1.journal_count > tag2.journal_count;
    });
    ctx.render('./journals/index', {
        "title": "博客列表",
        current_guest: ctx.session.guest,
        current_user: ctx.session.user,
        journals: journals,
        pagination: pagination,
        current_module: ctx.current_module,
        tag: tag,
        tags: tags,
        redirect_url: ctx.request.url
    }, true);
};

exports.show = async (ctx, next) => {
    let Journal = global.database.models.journal;
    let Comment = global.database.models.comment;
    let Attitude = global.database.models.attitude;
    let Guest = global.database.models.guest;
    let User = global.database.models.user;
    let setReadSession = function (session, journal_id) {
        if (!session.read_history) {
            session.read_history = {};
        }
        journal.read_count += 1;
        journal.save();
        session.read_history[journal_id] = true;
    };
    let journal = await Journal.findById(ctx.params.journal_id);
    let attitude = ctx.session.guest ? await Attitude.findOne({
        guest_id: ctx.session.guest._id,
        journal_id: ctx.params.journal_id
    }) : null;
    let likes = await Attitude.count({like: true, journal_id: ctx.params.journal_id});
    let dislikes = await Attitude.count({like: false, journal_id: ctx.params.journal_id});
    if (journal.is_public || ctx.session.user) {
        if (!ctx.session.read_history || !ctx.session.read_history[journal._id]) {
            setReadSession(ctx.session, journal._id);
        }
        let comments = await Comment.find({journal_id: journal._id}).sort({created_at: 1});
        let user_id = null;
        let guest_ids = [];
        comments.forEach(function (comment) {
            if (ctx.session.user) {
                comment.is_checked = true;
            }
            comment.replies.forEach(function (reply) {
                if (ctx.session.user) {
                    reply.is_checked = true;
                }
                if (reply.user_id) {
                    user_id = reply.user_id;
                }
                if (reply.guest_id) {
                    guest_ids.push(reply.guest_id);
                }
            });
            if (comment.user_id) {
                user_id = comment.user_id;
            }
            if (comment.guest_id) {
                guest_ids.push(comment.guest_id);
            }
            comment.save();
        });
        let guests = await Guest.find({_id: {"$in": guest_ids}});
        let json_guests = {}, user = null;
        guests.forEach(function (guest) {
            json_guests[guest._id] = {
                _id: guest._id,
                username: guest.username,
                head: guest.head
            };
        });
        if (user_id) {
            user = await User.findById(user_id);
        }
        let json_comments = [];
        comments.forEach(function (comment) {
            let json_comment = {
                _id: comment._id,
                journal_id: comment.journal_id,
                content: comment.content,
                created_at: comment.created_at,
                replies: []
            };
            comment.replies.forEach(function (reply) {
                let json_reply = {
                    _id: reply._id,
                    content: reply.content,
                    created_at: reply.created_at
                };
                if (reply.user_id) {
                    json_reply.user = user;
                }
                if (reply.guest_id) {
                    json_reply.guest = json_guests[reply.guest_id];
                }
                json_comment.replies.push(json_reply);
            });
            if (comment.user_id) {
                json_comment.user = user;
            }
            if (comment.guest_id) {
                json_comment.guest = json_guests[comment.guest_id];
            }
            json_comments.push(json_comment);
        });
        console.log(json_comments);
        ctx.render('./journals/show', {
            "title": journal.title,
            likes: likes,
            dislikes: dislikes,
            attitude: attitude,
            journal: journal,
            comments: json_comments,
            keywords: journal.keywords().join(','),
            description: journal.keywords().join(','),
            current_guest: ctx.session.guest,
            current_user: ctx.session.user,
            current_module: ctx.current_module,
            redirect_url: ctx.request.url
        }, true);
    }
    else {
        ctx.redirect("/journals");
    }
};

exports.init = async (ctx, next) => {
    ctx.render('./journals/new', {
        "title": "写博客",
        current_guest: ctx.session.guest,
        current_user: ctx.session.user,
        redirect_url: ctx.request.url
    }, true);
};

exports.create = async (ctx, next) => {
    let Journal = global.database.models.journal;
    let Stat = global.database.models.stat;
    let journal = new Journal();
    let tags = JSON.parse(ctx.request.body.tags);
    let stat = await Stat.findOne({});
    if (!stat) {
        stat = new Stat();
    }
    journal.title = ctx.request.body.title;
    journal.content = !ctx.request.body.content ? "" : ctx.request.body.content;
    journal.placed_top = !!ctx.request.body.placed_top;
    journal.is_public = !!ctx.request.body.is_public;
    journal.tags = [];
    tags.forEach(function (tag) {
        journal.tags.push({name: tag});
        var exist = false;
        for (var i = 0; i < stat.tags.length; i++) {
            if (stat.tags[i].name == tag) {
                stat.tags[i].journal_count++;
                exist = true;
                break;
            }
        }
        if (!exist) {
            stat.tags.push({name: tag, journal_count: 1});
        }
    });
    await journal.save();
    await stat.save();
    ctx.redirect("/journals/" + journal._id);
};

exports.edit = async (ctx, next) => {
    let Journal = global.database.models.journal;
    let journal = await Journal.findById(ctx.params.journal_id);
    ctx.render('./journals/edit', {
        "title": "编辑博客",
        journal: journal,
        current_guest: ctx.session.guest,
        current_user: ctx.session.user,
        current_module: ctx.current_module,
        redirect_url: ctx.request.url
    }, true);
};

exports.update = async (ctx, next) => {
    let Journal = global.database.models.journal;
    let Stat = global.database.models.stat;
    let journal = await Journal.findById(ctx.params.journal_id);
    let stat = await Stat.findOne({});
    if (!stat) {
        stat = new Stat();
    }
    let tags = JSON.parse(ctx.request.body.tags);
    journal.title = ctx.request.body.title;
    journal.content = !ctx.request.body.content ? "" : ctx.request.body.content;
    journal.placed_top = !(!ctx.request.body.placed_top);
    journal.is_public = !!ctx.request.body.is_public;
    journal.updated_at = Date.now();
    journal.tags.forEach(function (tag) {
        for (var i = 0; i < stat.tags.length; i++) {
            if (stat.tags[i].name == tag.name) {
                stat.tags[i].journal_count--;
                if (stat.tags[i].journal_count == 0) {
                    stat.tags.splice(i, 1);
                }
                break;
            }
        }
    });
    journal.tags = [];
    tags.forEach(function (tag) {
        journal.tags.push({name: tag});
        var exist = false;
        for (var i = 0; i < stat.tags.length; i++) {
            if (stat.tags[i].name == tag) {
                stat.tags[i].journal_count++;
                exist = true;
                break;
            }
        }
        if (!exist) {
            stat.tags.push({name: tag, journal_count: 1});
        }
    });
    await journal.save();
    await stat.save();
    ctx.redirect("/journals/" + journal._id);
};

exports.destroy = async (ctx, next) => {
    let Journal = global.database.models.journal;
    let Comment = global.database.models.comment;
    let journal = await Journal.findById(ctx.params.journal_id);
    await Comment.remove({journal_id: journal._id});
    journal.remove();
    ctx.redirect("/journals");
};

exports.comments = require('./comments');
exports.likes = require('./likes');