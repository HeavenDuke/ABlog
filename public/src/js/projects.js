/**
 * Created by Obscurity on 2016/5/25.
 */

(function() {

    var prepare_project_index_page = function () {
        var projects = $(".projects_introduction");
        for(var i = 0; i < projects.length; i++) {
            var project = $(projects[i]);
            project.html(project.text().trim());
        }
    };
    $(document).on('ready', function () {
        if (window.location.href.match(/\/projects/) != null) {
            prepare_project_index_page();
        }
    });
})();