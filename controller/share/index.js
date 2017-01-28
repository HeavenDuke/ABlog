/**
 * Created by heavenduke on 17-1-28.
 */


let show = function *(next) {
    let Share = global.database.models.share;
    let url = this.request.query.url;
    try {
        let share = yield Share.mapReduce({
            map: function () {
                emit(this.url, this.stat);
            },
            reduce: function (key, values) {
                let sum = 0;
                for (let i = 0; i < values.length; i++) {
                    sum += values[i];
                }
                return sum;
            },
            query: {url: url}
        });
        console.log(share);
        this.body = share;
    } catch(e) {
        this.body = {stat: 0};
    }
};

let update = function *(next) {
    let Share = global.database.models.share;
    let url = this.request.body.url;
    let name = this.request.body.name;
    let share = yield Share.findOne({
        url: this.request.body.url,
        name: this.request.body.name
    });
    if (!share) {
        share = new Share();
        share.url = url;
        share.name = name;
        share.stat = 0;
    }
    share.stat += 1;
    share.save();
    this.body = {message: "success"};
};

module.exports = {
    show: show,
    update: update
};