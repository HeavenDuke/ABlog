/**
 * Created by heavenduke on 16-8-13.
 */

(function () {

    let prepare_photo_masonry = function () {
        let grid = $(".grid-masonry");
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

    let show_photo_detail = function () {
        let photo_info = JSON.parse($(this).attr("photoinfo"));
        let width = $(this).children('img')[0].naturalWidth;
        let height = $(this).children('img')[0].naturalHeight;
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
    };

    let prepare_photo_detail = function () {
        $(".grid-masonry-item").on('click', show_photo_detail);
    };

    let prepare_photo_scroll = function () {
        $('.jscoll').jscroll({
            autoTrigger: false,
            nextSelector: '#scroller',
            callback: function () {
                let added_container = $(".jscroll-added");
                let grid = $(".grid-masonry");
                let added_items = added_container.children(".grid-masonry-item");
                added_items.on("click", show_photo_detail);
                grid.append(added_items);
                let item_loader = added_container.children("#scroller");
                if (item_loader.length == 0) {
                    let end_marker = added_container.children("#end_marker");
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