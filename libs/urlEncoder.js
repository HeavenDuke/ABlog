/**
 * Created by Obscurity on 2016/5/30.
 */

exports.url_encode = function (url) {
    var result = url;
    result = result.replace("?", "%3F");
    result = result.replace("&", "%26");
    result = result.replace("=", "%3D");
    result = result.replace("/", "%2F");
    result = result.replace(":", "%3A");
    return result;
};