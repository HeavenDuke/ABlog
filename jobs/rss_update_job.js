/**
 * Created by Obscurity on 2016/6/21.
 */

var database = require('../model').loader;
var path = require('path');

module.exports = function (callback) {

    function getBaseTemplate (channels) {
        var result = "";
        result += '<?xml version="1.0" encoding="UTF-8" ?>';
        result += '<rss version="2.0">';
        for(var index in channels) {
            result += channels[index];
        }
        result += '</rss>';
        console.log(result);
        return result;
    }

    function getChannel(title, link, description, items) {
        var result = "";
        result += "<channel>";
        result += "<title>" + title + "</title>";
        result += "<link>" + link + "</link>";
        result += "<description>" + description + "</description>";
        for(var index in items) {
            result += items[index];
        }
        result += "</channel>";
        return result;
    }

    function getItemTemplate(title, link, description, category) {
        var result = "";
        result += "<item>";
        result += "<title>" + title + "</title>";
        result += "<link>" + link + "</link>";
        result += "<description>" + description + "</description>";
        if (category) {
            result += "<category>" + category + "</category>";
        }
        result += "</item>";
        return result;
    }

    var Journal = database.models.journal;
    var Column = database.models.column;
    var Article = database.models.article;
    var articles_rss = [];
    var journals_rss = [];
    var rss_channels = [];
    Journal.find({is_public: true}, function (err, journals) {
        if (err) callback(err);
        journals.forEach(function(journal) {
            journals_rss.push(getItemTemplate(journal.title, "http://www.heavenduke.com/journals/" + journal._id, journal.title, 200));
        });
        Article.find({}, function(err, articles) {
            if (err) callback(err);
            var total_articles = articles.length;
            var counter = 0;
            articles.forEach(function(article) {
                Column.findById(article.column_id, function (err, column) {
                    if (err) callback(err);
                    articles_rss.push(getItemTemplate(article.title, "http://www.heavenduke.com/columns/" + column._id + "/articles/" + article._id, article.title, column.name));
                    counter++;
                    if (counter >= total_articles) {
                        rss_channels.push(getChannel("专栏", "http://www.heavenduke.com/columns", "HeavenDuke的专栏栏目，用来记录一些系统化的技术文章。", articles_rss));
                        rss_channels.push(getChannel("博文", "http://www.heavenduke.com/journals", "HeavenDuke的博文栏目，用来记录一些闲杂琐碎的技术文章。", journals_rss));
                        require('fs').writeFile(path.join(__dirname, "../", "public", "rss", "rss.xml"), getBaseTemplate(rss_channels), {
                            flag: "w",
                            encoding: "UTF-8",
                            mode: 0o666
                        }, function (err) {
                            if (err) callback(err);
                            else callback();
                        });
                    }
                });
            });
        });
    });
};