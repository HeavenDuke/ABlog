/**
 * Created by Obscurity on 2016/5/2.
 */
let path = require('path');
let fs = require('fs');
let mongoose = require('mongoose');
let Schema = mongoose.Schema;
let database = {
    models: {}
};

let Journal = require('./journal');
let Project = require('./project');
let User = require('./user');
let Comment = require('./comment');
let Diary = require('./diary');
let VisitRecord = require('./visit_record');
let Column = require('./column');
let Article = require('./article');
let Writing = require('./writing');
let Guest = require('./guest');
let Attitude = require('./attitude');
let Photo = require('./photo');
let Link = require('./link');
let Share = require('./share');
let Stat = require('./stat');

mongoose.Promise = global.Promise;

let JournalSchema = new Schema(Journal.Schema, Journal.collection);
let UserSchema = new Schema(User.Schema, User.collection);
let CommentSchema = new Schema(Comment.Schema, Comment.collection);
let DiarySchema = new Schema(Diary.Schema, Diary.collection);
let VisitRecordSchema = new Schema(VisitRecord.Schema, VisitRecord.collection);
let ProjectSchema = new Schema(Project.Schema, Project.collection);
let ColumnSchema = new Schema(Column.Schema, Column.collection);
let ArticleSchema = new Schema(Article.Schema, Article.collection);
let WritingSchema = new Schema(Writing.Schema, Writing.collection);
let GuestSchema = new Schema(Guest.Schema, Guest.collection);
let AttitudeSchema = new Schema(Attitude.Schema, Attitude.collection);
let PhotoSchema = new Schema(Photo.Schema, Photo.collection);
let LinkSchema = new Schema(Link.Schema, Link.collection);
let ShareSchema = new Schema(Share.Schema, Share.colletion);
let StatSchema = new Schema(Stat.Schema, Stat.collection);

JournalSchema.methods.link = Journal.link;
JournalSchema.methods.title_top = Journal.title_top;
UserSchema.methods.encasePassword = User.encasePassword;
UserSchema.methods.parsePassword = User.parsePassword;
UserSchema.methods.validatePassword = User.validatePassword;
UserSchema.methods.getBasicInfo = User.getBasicInfo;
UserSchema.statics.validateConfirmPassword = User.validateConfirmPassword;
DiarySchema.methods.mood_to_color = Diary.mood_to_color;
DiarySchema.methods.translate_mood = Diary.translate_mood;
DiarySchema.methods.tag_to_icon = Diary.tag_to_icon;
DiarySchema.methods.translate_tag = Diary.translate_tag;
DiarySchema.methods.get_diary_container = Diary.get_diary_container;
DiarySchema.statics.mood_list = Diary.mood_list;
DiarySchema.statics.tag_list = Diary.tag_list;
DiarySchema.statics.get_thumb_image = Diary.get_thumb_image;
VisitRecordSchema.statics.ignore_minute = VisitRecord.ignore_minute;
GuestSchema.methods.encasePassword = Guest.encasePassword;
GuestSchema.methods.parsePassword = Guest.parsePassword;
GuestSchema.methods.validatePassword = Guest.validatePassword;
GuestSchema.statics.validateConfirmPassword = Guest.validateConfirmPassword;
PhotoSchema.methods.get_image_container = Photo.get_image_container;
PhotoSchema.statics.get_thumb_image = Photo.get_thumb_image;
PhotoSchema.statics.get_preview_image = Photo.get_preview_image;


database.models.journal = mongoose.model("journal", JournalSchema);
database.models.user = mongoose.model("user", UserSchema);
database.models.comment = mongoose.model('comment', CommentSchema);
database.models.diary = mongoose.model('diary', DiarySchema);
database.models.visit_record = mongoose.model('visit_record', VisitRecordSchema);
database.models.project = mongoose.model('project', ProjectSchema);
database.models.column = mongoose.model('column', ColumnSchema);
database.models.article = mongoose.model('article', ArticleSchema);
database.models.writing = mongoose.model('writing', WritingSchema);
database.models.guest = mongoose.model('guest', GuestSchema);
database.models.attitude = mongoose.model('attitude', AttitudeSchema);
database.models.photo = mongoose.model('photo', PhotoSchema);
database.models.link = mongoose.model('link', LinkSchema);
database.models.share = mongoose.model('share', ShareSchema);
database.models.stat = mongoose.model('stat', StatSchema);

module.exports = {
    loader:　database
};