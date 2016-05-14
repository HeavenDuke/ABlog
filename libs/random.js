/**
 * Created by Obscurity on 2016/5/12.
 */

Math.randint = function (min, max) {
    var random = Math.random();
    return min + Math.round(random * (max - min));
};