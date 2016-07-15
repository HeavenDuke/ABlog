/**
 * Created by Obscurity on 2016/5/3.
 */

(function() {

    var prepare_article_comment_heads = function () {
        var heads = $("img.guest_comment");
        for(var i = 0; i < heads.length; i++) {
            var head = $(heads[i]);
            var data = new Identicon(head.attr('hash')).toString();
            head.attr("src", "data:image/png;base64," + data);
            head.removeAttr('hash');
        }
    };

    var prepare_article_detail = function () {
        var article_content_container = $("#article-content");
        article_content_container.html(article_content_container.text());
        $('pre code').each(function() {
            hljs.highlightBlock(this);
        });

        var owos = $("div[class$='OwO']");
        for(var i = 0; i < owos.length; i++) {
            var comment_id = $(owos[i]).attr("comment_id");
            var reply_owo = null;
            if (comment_id) {
                reply_owo = new OwO({
                    logo: 'OωO表情',
                    container: owos[i],
                    target: document.getElementById(comment_id + "_comment_reply"),
                    position: 'down',
                    api: "/OwO/OwO.json",
                    width: '100%',
                    maxHeight: '250px'
                });
            }
            else {
                reply_owo = new OwO({
                    logo: 'OωO表情',
                    container: owos[i],
                    target: document.getElementById('comment_input'),
                    position: 'down',
                    api: "/OwO/OwO.json",
                    width: '100%',
                    maxHeight: '250px'
                });
            }
        }

        $("a[id$='_reply_entry']").on('click', function () {
            var entry_id = $(this).attr('id');
            var toggle_hash = {
                "回复": "收起",
                "收起": "回复"
            };
            $(this).text(toggle_hash[$(this).text().trim()]);
            var comment_id = entry_id.substring(0, entry_id.indexOf("_reply_entry"));
            $("#" + comment_id + "_reply_container").slideToggle();
        });

        prepare_article_comment_heads();
    };

    var prepare_article_previewer = function () {
        var rawEditor = $("#article_content_input");
        var myCodeMirror = CodeMirror.fromTextArea(rawEditor[0], {
            value: rawEditor.val(),
            lineNumbers: true,
            mode: "gfm",
            matchBrackets: true,
            lineWrapping: true,
            tabSize: 4,
            theme: "monokai",
            keyMap: "sublime",
            extraKeys: {"Enter": "newlineAndIndentContinueMarkdownList"},
            autoCloseBrackets: true,
            smartIndent: true,
            showCursorWhenSelecting: true
        });
        var article_previewer_entry = $("#article_previewer_entry");
        article_previewer_entry.on("click", function () {
            var article_previewer = $("#article_previewer");
            var article_previewer_content = $("#article_previewer_content");
            myCodeMirror.save();
            var article_raw_content = marked(rawEditor.val());
            article_previewer_content.html(article_raw_content);
            MathJax.Hub.Queue(["Typeset", MathJax.Hub, article_raw_content]);
            article_previewer_content.children('pre').each(function() {
                hljs.highlightBlock(this);
            });
        });
    };

    $(document).on('ready', function () {
        if (window.location.href.match(/\/articles\/\w+\/edit/) != null) {
            prepare_article_previewer();
        }
        else if (window.location.href.match(/\/articles\/new/) != null) {
            prepare_article_previewer();
        }
        else if (window.location.href.match(/\/articles\/\w+/) != null) {
            prepare_article_detail();
        }
    });
})();