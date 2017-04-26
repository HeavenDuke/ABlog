/**
 * Created by heavenduke on 16-7-8.
 */

(function() {

    var prepare_writings_index_page = function () {

        $("#record").fullCalendar({
            dayRender: function (date, cell) {
                $.get('/writings/' + date.format(), function (data, status) {
                    var writing_record = parseInt(data);
                    if (data == 0) {
                        $(cell[0]).attr('style', 'background-color: #FFFFFF;');
                    }
                    else if (data < 500) {
                        $(cell[0]).attr('style', 'background-color: #b0ff9e;');
                    }
                    else if (data < 1000) {
                        $(cell[0]).attr('style', 'background-color: #00FF00;');
                    }
                    else if (data < 2000) {
                        $(cell[0]).attr('style', 'background-color: #00AA00;');
                    }
                    else if (data < 5000) {
                        $(cell[0]).attr('style', 'background-color: #008800;');
                    }
                    else {
                        $(cell[0]).attr('style', 'background-color: #005500;');
                    }
                    $(cell[0]).attr('count', writing_record);
                });
            },
            dayClick: function(date, jsEvent, view) {

                $("#record_date_title").text("字数 - " + date.format());
                $("#record_date").val(date.format());
                $("#record_input").val(parseInt($(this).attr("count")));
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