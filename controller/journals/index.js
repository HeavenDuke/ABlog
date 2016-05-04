/**
 * Created by Obscurity on 2016/3/20.
 */

var Router = require('koa-router');

var index = function *(next) {
    var journals = [
        {
            id: 123,
            link: this.app.url('journals-detail', {journal_id: 123}),
            name: "青梅雪",
            read_count: 10,
            comment_count: 10,
            updated_at: "2016-01-01 01:01:01",
            content: "木匣轻启，乐声鸣响，女孩长袖凌风，揽过月色，跳起舞来。“你也来呀。”她脚下画着圆，来到男孩身旁。男孩端坐在石头上，岿然不动。“你跳，我看着。”他的眼睛紧随女孩的舞步。"
        },
        {
            id: "123",
            link: this.app.url('journals-detail', {journal_id: 123}),
            name: "青梅雪",
            read_count: 10,
            comment_count: 10,
            updated_at: "2016-01-01 01:01:01",
            content: "木匣轻启，乐声鸣响，女孩长袖凌风，揽过月色，跳起舞来。“你也来呀。”她脚下画着圆，来到男孩身旁。男孩端坐在石头上，岿然不动。“你跳，我看着。”他的眼睛紧随女孩的舞步。"
        },
        {
            id: "123",
            link: this.app.url('journals-detail', {journal_id: 123}),
            name: "青梅雪",
            read_count: 10,
            comment_count: 10,
            updated_at: "2016-01-01 01:01:01",
            content: "木匣轻启，乐声鸣响，女孩长袖凌风，揽过月色，跳起舞来。“你也来呀。”她脚下画着圆，来到男孩身旁。男孩端坐在石头上，岿然不动。“你跳，我看着。”他的眼睛紧随女孩的舞步。"
        },
        {
            id: "123",
            link: this.app.url('journals-detail', {journal_id: 123}),
            name: "青梅雪",
            read_count: 10,
            comment_count: 10,
            updated_at: "2016-01-01 01:01:01",
            content: "木匣轻启，乐声鸣响，女孩长袖凌风，揽过月色，跳起舞来。“你也来呀。”她脚下画着圆，来到男孩身旁。男孩端坐在石头上，岿然不动。“你跳，我看着。”他的眼睛紧随女孩的舞步。"
        },
        {
            id: "123",
            link: this.app.url('journals-detail', {journal_id: 123}),
            name: "青梅雪",
            read_count: 10,
            comment_count: 10,
            updated_at: "2016-01-01 01:01:01",
            content: "木匣轻启，乐声鸣响，女孩长袖凌风，揽过月色，跳起舞来。“你也来呀。”她脚下画着圆，来到男孩身旁。男孩端坐在石头上，岿然不动。“你跳，我看着。”他的眼睛紧随女孩的舞步。"
        }
    ];
    var pagination = {
        total_page: 10,
        current_index: parseInt(this.request.query.page) == 0 ? 1 : parseInt(this.request.query.page)
    };
    this.render('./journals/index',{"title":"文章列表", journals: journals, pagination: pagination}, true);
};

var show = function *(next) {
    var constructContent = function () {
        var result = "";
        var element = "<p> Consider a supervised learning problem where we have access to labeled training examples (x(i),y(i)). Neural networks give a way of defining a complex, non-linear form of hypotheses hW,b(x), with parameters W,b that we can fit to our data. </p>";
        for(var i = 0; i < 12; i++) {
            result += element;
        }
        return result;
    };
    var journal = {
        title: "测试标题",
        content: constructContent(),
        updated_at: "2016-01-01 01:01:01",
        read_count: 10
    };
    this.render('./journals/show',{"title":"koa demo", journal: journal}, true);
};

var init = function *(next) {
    this.render('./journals/new',{"title":"koa demo"}, true);
};

var create = function *(next) {
    var journal = {
        title: this.request.body.title,
        content: this.request.body.content
    };
    this.redirect("/journals");
};

var edit = function *(next) {
    var constructContent = function () {
        var result = "";
        var element = "<p> Consider a supervised learning problem where we have access to labeled training examples (x(i),y(i)). Neural networks give a way of defining a complex, non-linear form of hypotheses hW,b(x), with parameters W,b that we can fit to our data. </p>";
        for(var i = 0; i < 12; i++) {
            result += element;
        }
        return result;
    };
    var journal = {
        link: this.app.url('journals-update', {journal_id: this.params.journal_id}),
        title: "测试标题",
        content: constructContent()
    };
    this.render('./journals/edit',{"title":"koa demo", journal: journal}, true);
};

var update = function *(next) {
    var journal = {
        journal_id: this.params.journal_id,
        title: this.request.body.title,
        content: this.request.body.content
    };
    this.redirect(this.app.url('journals-update', {journal_id: journal.journal_id}));
};

var destroy = function *(next) {

};

module.exports = {
    index: index,
    show: show,
    init: init,
    create: create,
    edit: edit,
    update: update,
    destroy: destroy,
    categories: require('./categories')
};