/**
 * Created by heavenduke on 16-5-7.
 */

module.exports = function (input, limit) {
    var result = input.substr(0, limit);
    result = result.replace(/\$\$.*\$\$/g, "");
    result = result.replace(/\\\\\(.*\\\\\)/g, "");
    return result + "...";
};
