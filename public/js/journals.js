/**
 * Created by Obscurity on 2016/5/3.
 */

(function() {

    var prepare_journal_detail = function () {
        var journal_content_container = $("#journal-content");
        journal_content_container.html(journal_content_container.text());
    };

    $(document).on('ready', function () {
        console.log(window.location.href.match(/\/journals/));
        if (window.location.href.match(/\/journals\/\w*/) != null) {
            prepare_journal_detail();
        }
    });
})();