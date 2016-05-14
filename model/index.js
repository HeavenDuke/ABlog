/**
 * Created by Obscurity on 2016/5/2.
 */

var path = require('path');
var fs = require('fs');
var mongoose = require('mongoose');
var _ = require('underscore');
var Schema = mongoose.Schema;
var database = {
    models: {}
};

var Journal = require('./journal');
var User = require('./user');
var Comment = require('./comment');
var Diary = require('./diary');

var JournalSchema = new Schema(Journal.Schema, Journal.collection);
var UserSchema = new Schema(User.Schema, User.collection);
var CommentSchema = new Schema(Comment.Schema, Comment.collection);
var DiarySchema = new Schema(Diary.Schema, Diary.collection);

JournalSchema.methods.link = Journal.link;
JournalSchema.methods.title_top = Journal.title_top;
UserSchema.methods.encasePassword = User.encasePassword;
UserSchema.methods.parsePassword = User.parsePassword;
UserSchema.methods.validatePassword = User.validatePassword;
DiarySchema.methods.mood_to_color = Diary.mood_to_color;
DiarySchema.methods.translate_mood = Diary.translate_mood;
DiarySchema.methods.tag_to_icon = Diary.tag_to_icon;
DiarySchema.methods.translate_tag = Diary.translate_tag;
DiarySchema.statics.mood_list = Diary.mood_list;
DiarySchema.statics.tag_list = Diary.tag_list;
DiarySchema.statics.get_thumb_image = Diary.get_thumb_image;

database.models.journal = mongoose.model("journal", JournalSchema);
database.models.user = mongoose.model("user", UserSchema);
database.models.comment = mongoose.model('comment', CommentSchema);
database.models.diary = mongoose.model('diary', DiarySchema);

module.exports = {
    loader:database
};