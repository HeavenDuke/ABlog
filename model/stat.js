/**
 * Created by heavenduke on 17-2-17.
 */

let Stat = {};

Stat.Schema = {
    tags: [require('./tag').Schema]
};

Stat.collection = {
    collection: "Stat"
};

module.exports = Stat;