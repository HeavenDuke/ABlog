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

    var prepare_guest_send_sms_page = function () {
        var email_input = $("#email");
        email_input.on('input', function () {
            $("#otp_sender").attr('link', "/guests/sms?_method=post&email=" + $(this).val());
        });
        $("#otp_sender").on('click', function () {
            $.get($(this).attr('link'), function (data, status) {
                console.log(data);
            });
        })
    };

    $(document).on('ready', function () {
        if (window.location.href.match(/\/guests\/edit/) != null) {
            prepare_guest_edit_page();
        }
        else if (window.location.href.match(/\/guests\/sms\/new/) != null) {
            prepare_guest_send_sms_page();
        }
    });
})();