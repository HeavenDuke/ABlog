/**
 * Created by heavenduke on 16-7-8.
 */

(function() {

    var prepare_writings_index_page = function () {
        $("#record").fullCalendar({
            dayClick: function(date, jsEvent, view) {

                $("#record_date_title").text("字数 - " + date.format());
                $("#record_date").val(date.format());

                $("#edit_record_modal").modal('show');

            }
        });
    };

    $(document).on('ready', function () {
        if (window.location.href.match(/\/writings/) != null) {
            prepare_writings_index_page();
        }
    });
})();