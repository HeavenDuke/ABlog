/**
 * Created by heavenduke on 16-8-13.
 */

(function () {

    var prepare_photo_masonry = function () {
        var grid = $(".grid-masonry");
        grid.masonry({
            itemSelector: '.grid-masonry-item',
            columnWidth: '.grid-sizer',
            gutter: '.gutter-sizer'
        });

        grid.imagesLoaded().progress(function () {
            grid.masonry({
                itemSelector: '.grid-masonry-item',
                columnWidth: '.grid-sizer',
                gutter: '.gutter-sizer'
            });
        });
    };

    var show_photo_detail = function () {
        var photo_info = JSON.parse($(this).attr("photoinfo"));
        var width = $(this).children('img')[0].naturalWidth;
        var height = $(this).children('img')[0].naturalHeight;
        if (height - width <= 50) {
            $("#photo_long").css("display", "none");
            $("#photo_wide").css("display", "block");
            $("#photo_img_wide").attr("src", "/" + photo_info.path);
            $("#photo_introduction_wide").text(photo_info.introduction);
        }
        else {
            $("#photo_long").css("display", "block");
            $("#photo_wide").css("display", "none");
            $("#photo_img_long").attr("src", "/" + photo_info.path);
            $("#photo_introduction_long").text(photo_info.introduction);
        }
        $("#photo_title").text(photo_info.title);
        $("#photo_info").text(photo_info.location + "　" + new Date(photo_info.created_at).format("yyyy年MM月dd日"));
        $("#remove_entry").attr('href', "/photos/" + photo_info._id + "?_method=delete")
    };

    var prepare_photo_detail = function () {
        $(".grid-masonry-item").on('click', show_photo_detail);
    };

    var prepare_photo_scroll = function () {
        $('.jscoll').jscroll({
            autoTrigger: false,
            nextSelector: '#scroller',
            callback: function () {
                var added_container = $(".jscroll-added");
                var grid = $(".grid-masonry");
                var added_items = added_container.children(".grid-masonry-item");
                added_items.on("click", show_photo_detail);
                grid.append(added_items);
                grid.masonry('appended', added_items);
                var item_loader = added_container.children("#scroller");
                if (item_loader.length == 0) {
                    var end_marker = added_container.children("#end_marker");
                    added_container.after(end_marker);
                }
                added_container.remove();
            }
        });
    };

    $(document).on('ready', function () {
        if (window.location.href.match(/\/photos/) != null) {
            prepare_photo_masonry();
            prepare_photo_detail();
            prepare_photo_scroll();
        }
    });
})();