/**
 * Created by Obscurity on 2016/5/30.
 */

exports.url_encode = function (url) {
    let result = url;
    result = result.replace("?", "%3F");
    result = result.replace("&", "%26");
    result = result.replace("=", "%3D");
    result = result.replace("/", "%2F");
    result = result.replace(":", "%3A");
    result = result.replace("?", "%3f");
    result = result.replace("&", "%26");
    result = result.replace("=", "%3d");
    result = result.replace("/", "%2f");
    result = result.replace(":", "%3a");
    return result;
};

exports.url_decode = function (url){
    url = encodeURIComponent(url);
    url = url.replace(/\%3A/g, ":");
    url = url.replace(/\%2F/g, "/");
    url = url.replace(/\%3F/g, "?");
    url = url.replace(/\%3D/g, "=");
    url = url.replace(/\%26/g, "&");
    url = url.replace(/\%3a/g, ":");
    url = url.replace(/\%2f/g, "/");
    url = url.replace(/\%3f/g, "?");
    url = url.replace(/\%3d/g, "=");
    url = url.replace(/\%26/g, "&");
    return url;
};