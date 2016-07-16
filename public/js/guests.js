/**
 * Created by heavenduke on 16-7-17.
 */

(function() {

    var prepare_guest_edit_page = function () {
        $("#head_input_trigger").on('click', function () {
            $("#head_input").click();
        });

        $("#head_input").ajaxfileupload({
            action: '/guests/heads',
            valid_extensions: ["jpg", "jpeg", "gif", "png", "bmp"],
            dataType: 'json',
            onComplete: function(response) {
                $("#head_input_trigger").attr('src', response.url);
                $("#head_input_path").val(response.name);
            }
        });
    };
    
    $(document).on('ready', function () {
        if (window.location.href.match(/\/guests\/edit/) != null) {
            prepare_guest_edit_page();
        }
    });
})();