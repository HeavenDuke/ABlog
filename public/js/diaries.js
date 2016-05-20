/**
 * Created by Obscurity on 2016/5/12.
 */

(function() {

    var diaries = [];

    var prepare_diary_form = function () {
        var diary_edit_form_entry = $("a[data-target='#edit_diary_modal']");
        diary_edit_form_entry.on('click', function() {
            var diary_id = $(this).attr('diary_id');
            var brief = $("#" + diary_id + "_brief").text().trim();
            var content = $("#" + diary_id + "_content").text().trim();
            var date = $("#" + diary_id + "_date").attr("date");
            var mood = $("#" + diary_id + "_mood").attr("mood");
            var tag = $("#" + diary_id + "_tag").attr("tag");
            $("#update_diary_brief").val(brief);
            $("#update_diary_content").val(content);
            $("#update_diary_date").attr("value", date);
            $("#update_diary_mood").val(mood);
            $("#update_diary_tag").val(tag);
            $("#update_diary_form").attr("action", "/diaries/" + diary_id + "?_method=put");
        });
    };

    var prepare_diary_previewer = function () {
        var all_thumbs = $(".image_thumb");
        all_thumbs.on('click', function() {
            var full_src = $(this).attr('full_src');
            $("#previewer_content").attr('src', full_src);
            $("#image_previewer").modal("show");
        });
    };

    var prepare_diary_paragraphs = function () {
        var diaries_container = $("[id$='_content']");
        for(var i = 0; i < diaries_container.length; i++) {
            var id = $(diaries_container[i]).attr('id');
            var diary = {
                id: id.substring(0, id.indexOf('_content')),
                content: $(diaries_container[i]).text()
            };
            console.log(diary);
            $(diaries_container[i]).html(diary.content);
            diaries.push(diary);
        }
    };

    var prepare_diary_page = function () {
        prepare_diary_form();
        prepare_diary_previewer();
        prepare_diary_paragraphs();
    };

    $(document).on('ready', function () {
        if (window.location.href.match(/\/diaries/) != null) {
            prepare_diary_page();
        }
    });
})();