/**
 * Created by Obscurity on 2016/5/3.
 */

(function() {

    MathJax.Hub.Config({
        tex2jax: {inlineMath: [['$','$'], ['\\(','\\)']]}
    });
    var renderer = new marked.Renderer();
    renderer.image = function(href, title, text) {
        var out = '<img class="md-image" style="max-height: 300px; max-width: 100%;" src="' + href + '" alt="' + text + '"';
        if (title) {
            out += ' title="' + title + '"';
        }
        out += this.options.xhtml ? '/>' : '>';
        return out;
    };

    var prepare_image_container = function () {
        $('img.md-image').each(function () {
            $(this).parent().addClass("text-center");
        });
    };
    
    var prepare_article_comment_heads = function () {
        var heads = $("img.guest_comment");
        for(var i = 0; i < heads.length; i++) {
            var head = $(heads[i]);
            var data = new Identicon(md5(head.attr('hash'))).toString();
            head.attr("src", "data:image/png;base64," + data);
            head.removeAttr('hash');
        }
    };

    var prepare_article_detail = function () {
        var article_content_container = $("#article-content");
        MathJax.Hub.Queue(["Typeset", MathJax.Hub], function () {
            var article_raw_content = marked(article_content_container.html(), {renderer: renderer});
            article_content_container.html(article_raw_content);
            $('pre code').each(function() {
                hljs.highlightBlock(this);
            });
            prepare_image_container();
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
        prepare_article_share();
    };

    var prepare_article_share = function () {
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
            var article_raw_content = rawEditor.val();
            article_previewer_content.html(article_raw_content);
            MathJax.Hub.Queue(["Typeset", MathJax.Hub], function () {
                article_raw_content = marked(article_previewer_content.html(), {renderer: renderer});
                article_previewer_content.html(article_raw_content);
                article_previewer_content.children('pre').each(function() {
                    hljs.highlightBlock(this);
                });
                prepare_image_container();
            });
        });

        var tokens = ["#", "##", "###", "####", "#####"];
        tokens.forEach(function (token) {
            $(".markdown-h" + token.length).click(function () {
                var selections = myCodeMirror.getSelections();
                for (var j = 0; j < selections.length; j++) {
                    if (selections[j].length != 0) {
                        selections[j] = token + " " + selections[j];
                    }
                    else {
                        selections[j] = token + " " + selections[j];
                    }
                }
                myCodeMirror.replaceSelections(selections);
            });
        });

        $(".markdown-bold").click(function () {
            var token = "**";
            var selections = myCodeMirror.getSelections();
            for (var j = 0; j < selections.length; j++) {
                selections[j] = token + selections[j] + token;
            }
            myCodeMirror.replaceSelections(selections);
        });

        $(".markdown-italic").click(function () {
            var token = "*";
            var selections = myCodeMirror.getSelections();
            for (var j = 0; j < selections.length; j++) {
                selections[j] = token + selections[j] + token;
            }
            myCodeMirror.replaceSelections(selections);
        });

        $(".markdown-bulleted-list").click(function () {
            var token = "*";
            var selections = myCodeMirror.getSelections();
            for (var j = 0; j < selections.length; j++) {
                selections[j] = token + " " + selections[j];
            }
            myCodeMirror.replaceSelections(selections);
        });

        $(".markdown-numbered-list").click(function () {
            var token = "1.";
            var selections = myCodeMirror.getSelections();
            for (var j = 0; j < selections.length; j++) {
                selections[j] = token + " " + selections[j];
            }
            myCodeMirror.replaceSelections(selections);
        });

        $(".markdown-link").click(function () {
            $("#markdown-new-link").modal('show');
        });

        $(".markdown-image").click(function () {
            $("#markdown-new-image").modal('show');
        });

        $(".save-markdown-link").click(function () {
            var name = $("#markdown-new-link").find("input[name='markdown-link-name']").val();
            var link = $("#markdown-new-link").find("input[name='markdown-link']").val();
            myCodeMirror.replaceSelection("[" + name + "](" + link + ")");
            return true;
        });

        $(".save-markdown-image").click(function () {
            var name = $("#markdown-new-image").find("input[name='markdown-image-name']").val();
            var link = $("#markdown-new-image").find("input[name='markdown-image-link']").val();
            myCodeMirror.replaceSelection("![" + name + "](" + link + ")");
            return true;
        });

        $(".markdown-code-inline").click(function () {
            var token = "```";
            var selections = myCodeMirror.getSelections();
            for (var j = 0; j < selections.length; j++) {
                selections[j] = token + selections[j] + token;
            }
            myCodeMirror.replaceSelections(selections);
        });

        $(".markdown-code").click(function () {
            var token = "```";
            var language = $(".markdown-code-entry").attr('value') ? $(".markdown-code-entry").attr('value') : "";
            var selections = myCodeMirror.getSelections();
            for (var j = 0; j < selections.length; j++) {
                selections[j] = token + language + "\n" + selections[j] + "\n" + token;
            }
            myCodeMirror.replaceSelections(selections);
        });

        $(".markdown-latex-inline").click(function () {
            var token = "$";
            var selections = myCodeMirror.getSelections();
            for (var j = 0; j < selections.length; j++) {
                selections[j] = token + selections[j] + token;
            }
            myCodeMirror.replaceSelections(selections);
        });

        $(".markdown-latex").click(function () {
            var token = "$$";
            var selections = myCodeMirror.getSelections();
            for (var j = 0; j < selections.length; j++) {
                selections[j] = token + selections[j] + token;
            }
            myCodeMirror.replaceSelections(selections);
        });

        $(".markdown-html").click(function () {
            var token = "<html>\n#{content}\n</html>";
            var selections = myCodeMirror.getSelections();
            for (var j = 0; j < selections.length; j++) {
                selections[j] = token.replace(/#\{content}/, selections[j]);
            }
            myCodeMirror.replaceSelections(selections);
        });

        $(".markdown-code-language").click(function () {
            var language = $(this).attr('value');
            $(".markdown-code-entry").html("<i class='fa fa-code'></i>　" + language);
            $(".markdown-code-entry").attr('value', language);
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