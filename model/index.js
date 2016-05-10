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
var JournalSchema = new Schema(Journal.Schema, Journal.collection);
var UserSchema = new Schema(User.Schema, User.collection);
var CommentSchema = new Schema(Comment.Schema, Comment.collection);
JournalSchema.methods.link = Journal.link;
JournalSchema.methods.title_top = Journal.title_top;
UserSchema.methods.encasePassword = User.encasePassword;
UserSchema.methods.parsePassword = User.parsePassword;
UserSchema.methods.validatePassword = User.validatePassword;

database.models.journal = mongoose.model("journal", JournalSchema);
database.models.user = mongoose.model("user", UserSchema);
database.models.comment = mongoose.model('comment', CommentSchema);

module.exports = {
    loader:database
};