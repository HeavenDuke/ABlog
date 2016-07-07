/**
 * Created by heavenduke on 16-7-8.
 */

(function() {

    var prepare_writings_index_page = function () {
        $("#record").fullCalendar({

        });
    };

    $(document).on('ready', function () {
        if (window.location.href.match(/\/writings/) != null) {
            prepare_writings_index_page();
        }
    });
})();