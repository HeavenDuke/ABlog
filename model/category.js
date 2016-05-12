/**
 * Created by Obscurity on 2016/5/12.
 */
var Category = {};

Category.Schema = {
    name: {
        type: String,
        required: true
    }
};

Category.collection = {
    collection: 'Categories'
};

module.exports = Category;