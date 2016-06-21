/**
 * Created by Obscurity on 2016/6/22.
 */

var schedule = require('node-schedule');

(function () {
    schedule.scheduleJob('*/10 * * * *', function () {
        require('../').RSSUpdateJob(function (err) {
            if (err) {
                console.log(err);
            }
            else {
                console.log("rss updated");
            }
        });
    });
})();