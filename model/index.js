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
var JournalSchema = new Schema(Journal.Schema, Journal.collection);
JournalSchema.methods.link = Journal.link;

database.models.journal = mongoose.model("journal", JournalSchema);

module.exports = {
    loader:database
}