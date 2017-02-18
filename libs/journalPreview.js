/**
 * Created by heavenduke on 16-5-7.
 */

module.exports = function (input, limit) {
    let result = input.substr(0, limit);
    result = result.replace(/\$\$.*\$\$/g, "");
    result = result.replace(/\\\\\(.*\\\\\)/g, "");
    result = result.replace(/\n/g, "");
    result = result.replace(/\r/g, "");
    result = result.replace(/\s/g, "");
    return result + "...";
};
