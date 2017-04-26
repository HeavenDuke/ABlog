/**
 * Created by Obscurity on 2016/5/30.
 */

(function () {
    var delete_warning = function (link) {
        var confirm_message = confirm("删除后将无法恢复，确认要删除吗？");
        if (confirm_message) {
            window.location.href = link;
        }
    };

    var construct_notification = function (id, column_id, title) {
        var result = '<li>';
        if (column_id) {
            result += '<a href="/columns/' + column_id + '/articles/' + id + '">';
        }
        else {
            result += '<a href="/journals/' + id + '">';
        }
        result += '<div class="pull-left">';
        result += '<img src="/head.png" class="img-circle"/>';
        result += '</div>';
        result += '<h4>' + title + '<small>' + (column_id ? "专栏" : "博客") + '</small></h4>';
        result += '</a>';
        result += '</li>';
        return result;
    };

    var prepare_current_guest_head = function () {
        var heads = $('img.current_guest_head');
        for(var i = 0; i < heads.length; i++) {
            var head = $(heads[i]);
            var data = new Identicon(md5(head.attr('hash'))).toString();
            head.attr("src", "data:image/png;base64," + data);
            head.removeAttr('hash');
        }
    };

    var prepare_notification_listener = function () {
        $.get('/notifications', function (data, status) {
            var count = data.articles.length + data.journals.length;
            var container = $("#notification_container");
            var counter = $("#notification_counter");
            var intro = $("#notification_intro");
            counter.text(count);
            if (count != 0) {
                intro.text(count + "篇文章有新评论");
            }
            else {
                intro.text("暂无新评论");
            }
            data.articles.forEach(function (article) {
                container.append(construct_notification(article._id, article.column_id, article.title));
            });
            data.journals.forEach(function (journal) {
                container.append(construct_notification(journal._id, null, journal.title));
            });
        }, 'json');
    };

    $(document).ready(function () {

        Date.prototype.format = function (fmt) { //author: meizz
            var o = {
                "M+": this.getMonth() + 1,                 //月份
                "d+": this.getDate(),                    //日
                "h+": this.getHours(),                   //小时
                "m+": this.getMinutes(),                 //分
                "s+": this.getSeconds(),                 //秒
                "q+": Math.floor((this.getMonth() + 3) / 3), //季度
                "S": this.getMilliseconds()             //毫秒
            };
            if (/(y+)/.test(fmt))
                fmt = fmt.replace(RegExp.$1, (this.getFullYear() + "").substr(4 - RegExp.$1.length));
            for (var k in o)
                if (new RegExp("(" + k + ")").test(fmt))
                    fmt = fmt.replace(RegExp.$1, (RegExp.$1.length == 1) ? (o[k]) : (("00" + o[k]).substr(("" + o[k]).length)));
            return fmt;
        }

        $(".delete-entry").on("click", function () {
            delete_warning($(this).attr('href'));
            return false;
        });

        prepare_notification_listener();
        prepare_current_guest_head();
    });
}());