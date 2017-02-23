/**
 * Created by Obscurity on 2016/5/3.
 */

(function() {

    var tags = [];
    var renderer = new marked.Renderer();
    renderer.image = function(href, title, text) {
        var out = '<img style="width: 100%;" src="' + href + '" alt="' + text + '"';
        if (title) {
            out += ' title="' + title + '"';
        }
        out += this.options.xhtml ? '/>' : '>';
        return out;
    };
    MathJax.Hub.Config({
        tex2jax: {inlineMath: [['$','$'], ['\\(','\\)']]}
    });

    var prepare_journal_comments = function () {
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
    };

    var prepare_journal_comment_replies = function () {
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
    };

    var prepare_journal_comment_heads = function () {
        var heads = $("img.guest_comment");
        for(var i = 0; i < heads.length; i++) {
            var head = $(heads[i]);
            var data = new Identicon(md5(head.attr('hash'))).toString();
            head.attr("src", "data:image/png;base64," + data);
            head.removeAttr('hash');
        }
    };

    var prepare_journal_share = function () {
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

    var prepare_journal_detail = function () {
        var journal_content_container = $("#journal-content");
        MathJax.Hub.Queue(["Typeset", MathJax.Hub], function () {
            var journal_raw_content = marked(journal_content_container.html(), {renderer: renderer});
            journal_content_container.html(journal_raw_content);
            $('pre code').each(function () {
                hljs.highlightBlock(this);
            });

        });
        prepare_journal_comments();
        prepare_journal_comment_replies();
        prepare_journal_comment_heads();
        prepare_journal_share();
    };

    var prepare_journal_previewer = function () {
        var rawEditor = $("#journal_content_input");
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
        var journal_previewer_entry = $("#journal_previewer_entry");
        journal_previewer_entry.on("click", function () {
            var journal_previewer = $("#journal_previewer");
            var journal_previewer_content = $("#journal_previewer_content");
            myCodeMirror.save();
            var journal_raw_content = rawEditor.val();
            journal_previewer_content.html(journal_raw_content);
            MathJax.Hub.Queue(["Typeset", MathJax.Hub], function () {
                journal_raw_content = marked(journal_previewer_content.html(), {renderer: renderer});
                journal_previewer_content.html(journal_raw_content);
                journal_previewer_content.children('pre').each(function() {
                    hljs.highlightBlock(this);
                });
            });
        });
    };
    
    var prepare_journal_check_input = function () {
        $(document).ready(function(){
            $('input[type="checkbox"]').iCheck({
                checkboxClass: 'icheckbox_flat-blue'
            });
        });
    };

    var prepare_journal_tag_uploader = function () {
        var container = $("#tags-container");
        var update_tags_container = function () {
            container.empty();
            container.append("<br>");
            container.append("<span class='journal-tag-divider'>关键词: " + (tags.length == 0 ? "暂无" : "") + "</span>");
            for(var i = 0; i < tags.length; i++) {
                container.append("<span class='journal-tag'>" + tags[i] + "</span>");
                var remove_entry = $("<a class='journal-tag'>×</a>");
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
                    container.append("<span class='journal-tag-divider'> / </span>");
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
        container.children("span.journal-tag").each(function () {
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
        if (window.location.href.match(/\/journals\/\w+\/edit/) != null) {
            prepare_journal_previewer();
            prepare_journal_check_input();
            prepare_journal_tag_uploader();
        }
        else if (window.location.href.match(/\/journals\/new/) != null) {
            prepare_journal_previewer();
            prepare_journal_check_input();
            prepare_journal_tag_uploader();
        }
        else if (window.location.href.match(/\/journals\/\w+/) != null) {
            prepare_journal_detail();
        }
    });
})();