/**
 * Created by Obscurity on 2016/5/29.
 */


(function() {

    var tags = [];
    MathJax.Hub.Config({
        tex2jax: {inlineMath: [['$','$'], ['\\(','\\)']]}
    });
    var renderer = new marked.Renderer();
    renderer.image = function(href, title, text) {
        var out = '<img style="width: 100%;" src="' + href + '" alt="' + text + '"';
        if (title) {
            out += ' title="' + title + '"';
        }
        out += this.options.xhtml ? '/>' : '>';
        return out;
    };

    var prepare_column_detail = function () {
        var column_introduction_container = $("#column-introduction");
        MathJax.Hub.Queue(["Typeset", MathJax.Hub], function () {
            var column_raw_content = marked(column_introduction_container.html(), {renderer: renderer});
            column_introduction_container.html(column_raw_content);
            $('pre code').each(function() {
                hljs.highlightBlock(this);
            });
        });
        prepare_column_share();
    };

    var prepare_column_share = function () {
        $("#hshare").hshare({
            size: "large",
            renderText: false,
            platforms: [{
                name: "qzone"
            }, {
                name: "qq"
            }, {
                name: "douban"
            }, {
                name: "renren"
            }, {
                name: "sinaweibo"
            }, {
                name: "wechat"
            }],
            stat: {
                loadUrl: "/shares",
                updateUrl: "/shares"
            }
        });
    };

    var prepare_column_previewer = function () {
        var rawEditor = $("#column_content_input");
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
        var column_previewer_entry = $("#column_previewer_entry");
        column_previewer_entry.on("click", function () {
            var column_previewer = $("#column_previewer");
            var column_previewer_content = $("#column_previewer_content");
            myCodeMirror.save();
            var column_raw_content = rawEditor.val();
            column_previewer_content.html(column_raw_content);
            MathJax.Hub.Queue(["Typeset", MathJax.Hub], function () {
                column_raw_content = marked(column_previewer_content.html(), {renderer: renderer});
                column_previewer_content.html(column_raw_content);
                column_previewer_content.children('pre').each(function() {
                    hljs.highlightBlock(this);
                });
            });
        });
    };

    var prepare_column_tag_uploader = function () {
        var container = $("#tags-container");
        var update_tags_container = function () {
            container.empty();
            container.append("<br>");
            container.append("<span class='column-tag-divider'>关键词: " + (tags.length == 0 ? "暂无" : "") + "</span>");
            for(var i = 0; i < tags.length; i++) {
                container.append("<span class='column-tag'>" + tags[i] + "</span>");
                var remove_entry = $("<a class='column-tag'>×</a>");
                remove_entry.click(function () {
                    for(var j = 0; j < tags.length; j++) {
                        if (tags[j] == $(this).prev().text().trim()) {
                            tags.splice(j, 1);
                            break;
                        }
                    }
                    $("input[name='tags']").val(JSON.stringify(tags));
                    update_tags_container();
                });
                container.append(remove_entry);
                if (i < tags.length - 1) {
                    container.append("<span class='column-tag-divider'> / </span>");
                }
            }
        };
        $("#add-tag-entry").click(function () {
            var input = $("input[name='tag']");

            var tag = input.val();
            if (!tag || tag.length > 20 || tag.length == 0) {
                alert("标签字数控制在1~20个字符内")
            }
            else if (tags.includes(tag)) {
                alert("已添加当前标签")
            }
            else {
                tags.push(tag);
                $("input[name='tags']").val(JSON.stringify(tags));
                update_tags_container();
            }
            input.val("");
        });
        container.children("span.column-tag").each(function () {
            if ($(this).text().trim() == "×") {
                $(this).click(function () {
                    for(var j = 0; j < tags.length; j++) {
                        if (tags[j] == $(this).prev().text().trim()) {
                            tags.splice(j, 1);
                            break;
                        }
                    }
                    $("input[name='tags']").val(JSON.stringify(tags));
                    update_tags_container();
                });
            }
            else {
                tags.push($(this).text().trim());
                $("input[name='tags']").val(JSON.stringify(tags));
            }
        });
    };

    $(document).on('ready', function () {
        if (window.location.href.match(/\/columns\/\w+\/edit/) != null) {
            prepare_column_previewer();
            prepare_column_tag_uploader();
        }
        else if (window.location.href.match(/\/columns\/new/) != null) {
            prepare_column_previewer();
            prepare_column_tag_uploader();
        }
        else if (window.location.href.match(/\/columns\/\w+/) != null) {
            prepare_column_detail();
        }
    });
})();