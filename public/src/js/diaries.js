/**
 * Created by Obscurity on 2016/5/12.
 */

(function() {

    var delete_warning = function (link) {
        var confirm_message = confirm("删除后将无法恢复，确认要删除吗？");
        if (confirm_message) {
            window.location.href = link;
        }
    };

    var diaries = {};

    var show_update_form = function() {
        var diary_id = $(this).attr('diary_id');
        var brief = $("#" + diary_id + "_brief").text().trim();
        var content = $("#" + diary_id + "_content").attr("content");
        var date = $("#" + diary_id + "_date").attr("date");
        var mood = $("#" + diary_id + "_mood").attr("mood");
        var tag = $("#" + diary_id + "_tag").attr("tag");
        var is_public = $("#" + diary_id + "_publicity").attr("publicity") == "true";
        var image_container = $("#" + diary_id + "_images");
        var images = JSON.parse(image_container.attr("images"));
        var thumbs = image_container.children();
        $("#update_diary_brief").val(brief);
        $("#update_diary_content").val(content);
        $("#update_diary_date").attr("value", date);
        $("#update_diary_mood").val(mood);
        $("#update_diary_tag").val(tag);
        var image_form_container = $("#image_update_specifier");
        image_form_container.val(JSON.stringify(images));
        if (is_public) {
            $("#update_diary_publicity").attr("checked", "checked");
        }
        else {
            $("#update_diary_publicity").removeAttr("checked");
        }
        $("#update_uploaded_files").empty();
        for(var i = 0; i < images.length; i++) {
            var image_previewer = $('<a filename="' + images[i] + '" href="#"><img class="margin image_thumb" src="' + $(thumbs[i]).attr("thumb") + '"/></a>');
            image_previewer.appendTo('#update_uploaded_files');
            image_previewer.on('click', function () {
                confirm_delete_local_image($(this), image_form_container);
            });
        }
        $("#update_diary_form").attr("action", "/diaries/" + diary_id + "?_method=put");
    };

    var prepare_diary_form = function () {
        var diary_edit_form_entry = $("a[data-target='#edit_diary_modal']");
        diary_edit_form_entry.on('click', show_update_form);
    };

    var confirm_delete_local_image = function (trigger, inputs_container) {
        var double_check = confirm('确认要删除该照片吗？');
        if (double_check) {
            var filename = trigger.attr('filename');
            var images = JSON.parse(inputs_container.val());
            for (var i = 0; i < images.length; i++) {
                if (images[i] == filename) {
                    images.splice(i, 1);
                    break;
                }
            }
            inputs_container.val(JSON.stringify(images));
            trigger.remove();
        }
    };

    var prepare_diary_previewer = function () {
        var galleries = $("[id$='_gallery']");
        for(var i = 0; i < galleries.length; i++) {
            $(galleries[i]).lightGallery({
                thumbnail: true
            });
        }
    };

    var prepare_diary_image_uploader = function () {
        $('#image_creation_uploader').fileupload({
            url: "/images",
            dataType: 'json',
            type: "post",
            done: function (e, data) {
                $.each(data.result.files, function (index, file) {
                    var container = $("#image_creation_specifier");
                    var image_ids = JSON.parse(container.val());
                    image_ids.push(file.name);
                    container.val(JSON.stringify(image_ids));

                    var previewer = $('<a filename = "' + file.name + '" href="#"><img class="margin image_thumb" src="' + file.thumbnailUrl + '"/></a>');
                    previewer.appendTo('#create_uploaded_files');
                    previewer.on('click', function () {
                        confirm_delete_local_image($(this), container);
                    });

                });
            },
            progressall: function (e, data) {
                var progress = parseInt(data.loaded / data.total * 100, 10);
                $('#create_upload_progress .progress-bar').css(
                    'width',
                    progress + '%'
                );
            }
        });

        $('#image_update_uploader').fileupload({
            url: "/images",
            dataType: 'json',
            type: "post",
            done: function (e, data) {
                $.each(data.result.files, function (index, file) {
                    var container = $("#image_update_specifier");
                    var image_list = JSON.parse(container.val());
                    image_list.push(file.name);
                    container.val(JSON.stringify(image_list));
                    var previewer = $('<a filename = "' + file.name + '" href="#"><img class="margin image_thumb" src="' + file.thumbnailUrl + '"/></a>');
                    previewer.appendTo('#update_uploaded_files');
                    previewer.on('click', function () {
                        confirm_delete_local_image($(this), container);
                    });
                });
            },
            progressall: function (e, data) {
                var progress = parseInt(data.loaded / data.total * 100, 10);
                $('#update_upload_progress .progress-bar').css(
                    'width',
                    progress + '%'
                );
            }
        });
    };

    var prepare_diary_paragraphs = function () {

        var diary_to_paragraph = function (diary) {
            var split_content = diary.split("\n");
            var result = "";
            for(var index in split_content) {
                result += "<p>" + split_content[index] + "</p>"
            }
            return result;
        };

        var diaries_container = $("[id$='_content']");
        for(var i = 0; i < diaries_container.length; i++) {
            var id = $(diaries_container[i]).attr('id');
            var content = $(diaries_container[i]).text();
            $(diaries_container[i]).html(diary_to_paragraph(content));
            diaries[id.substring(0, id.indexOf('_content'))] = content;
        }
    };

    var prepare_diary_image = function () {
        var images = $("img");
        for(var i = 0; i < images.length; i++) {
            var image = $(images[i]);
            image.attr("src", image.attr("thumb_url"));
        }
    };

    var prepare_diary_scroll = function () {
        $('.jscroll').jscroll({
            autoTrigger: false,
            nextSelector: '#scroller',
            callback: function () {
                var added_container = $(".jscroll-added");
                var last_index = $("#pscroller");
                var added_items = added_container.children("li");
                added_items.find("a[data-target='#edit_diary_modal']").on("click", show_update_form);
                added_items.find(".delete-entry").on("click", function () {
                    delete_warning($(this).attr('href'));
                    return false;
                });
                last_index.before(added_items);
                var item_loader = added_container.children("#scroller");
                if (item_loader.length == 0) {
                    var end_marker = added_container.children("#end_marker");
                    last_index.after(end_marker);
                }
                last_index.remove();
                added_container.remove();
            }
        });
    };

    var prepare_diary_page = function () {
        prepare_diary_form();
        prepare_diary_paragraphs();
        prepare_diary_image();
        prepare_diary_scroll();
        prepare_diary_previewer();
        prepare_diary_image_uploader();
    };

    $(document).on('ready', function () {
        if (window.location.href.match(/\/diaries/) != null) {
            prepare_diary_page();
        }
    });
})();