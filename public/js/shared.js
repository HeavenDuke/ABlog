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

    $(document).ready(function () {
        $(".delete-entry").on("click", function () {
            delete_warning($(this).attr('href'));
            return false;
        });
    });
}());