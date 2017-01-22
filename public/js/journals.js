/**
 * Created by Obscurity on 2016/5/3.
 */

(function() {

    let prepare_journal_comments = function () {
        let owos = $("div[class$='OwO']");
        for(let i = 0; i < owos.length; i++) {
            let comment_id = $(owos[i]).attr("comment_id");
            let reply_owo = null;
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

    let prepare_journal_comment_replies = function () {
        $("a[id$='_reply_entry']").on('click', function () {
            let entry_id = $(this).attr('id');
            let toggle_hash = {
                "回复": "收起",
                "收起": "回复"
            };
            $(this).text(toggle_hash[$(this).text().trim()]);
            let comment_id = entry_id.substring(0, entry_id.indexOf("_reply_entry"));
            $("#" + comment_id + "_reply_container").slideToggle();
        });
    };

    let prepare_journal_comment_heads = function () {
        let heads = $("img.guest_comment");
        for(let i = 0; i < heads.length; i++) {
            let head = $(heads[i]);
            let data = new Identicon(md5(head.attr('hash'))).toString();
            head.attr("src", "data:image/png;base64," + data);
            head.removeAttr('hash');
        }
    };

    let prepare_journal_share = function () {
        $("#hshare").hshare({
            size: "medium",
            shares: [{
                platform: "qzone"
            }, {
                platform: "qq"
            }, {
                platform: "douban"
            }, {
                platform: "renren"
            }, {
                platform: "sinaweibo"
            }, {
                platform: "wechat"
            }]
        });
    };

    let prepare_journal_detail = function () {
        let journal_content_container = $("#journal-content");
        journal_content_container.html(journal_content_container.text());
        MathJax.Hub.Config({
            tex2jax: {inlineMath: [['$','$'], ['\\(','\\)']]}
        });
        setTimeout(function () {
            MathJax.Hub.Queue(["Typeset", MathJax.Hub]);
        }, 1000);
        $('pre code').each(function () {
            hljs.highlightBlock(this);
        });
        prepare_journal_comments();
        prepare_journal_comment_replies();
        prepare_journal_comment_heads();
        prepare_journal_share();
    };

    let prepare_journal_previewer = function () {
        let rawEditor = $("#journal_content_input");
        let myCodeMirror = CodeMirror.fromTextArea(rawEditor[0], {
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
        let journal_previewer_entry = $("#journal_previewer_entry");
        journal_previewer_entry.on("click", function () {
            let journal_previewer = $("#journal_previewer");
            let journal_previewer_content = $("#journal_previewer_content");
            myCodeMirror.save();
            let renderer = new marked.Renderer();
            renderer.image = function(href, title, text) {
                let out = '<img style="width: 100%;" src="' + href + '" alt="' + text + '"';
                if (title) {
                    out += ' title="' + title + '"';
                }
                out += this.options.xhtml ? '/>' : '>';
                return out;
            };
            let journal_raw_content = marked(rawEditor.val(), {renderer: renderer});
            journal_previewer_content.html(journal_raw_content);
            MathJax.Hub.Config({
                tex2jax: {inlineMath: [['$','$'], ['\\(','\\)']]}
            });
            MathJax.Hub.Queue(["Typeset", MathJax.Hub]);
            journal_previewer_content.children('pre').each(function() {
                hljs.highlightBlock(this);
            });
        });
    };

    $(document).on('ready', function () {
        if (window.location.href.match(/\/journals\/\w+\/edit/) != null) {
            prepare_journal_previewer();
        }
        else if (window.location.href.match(/\/journals\/new/) != null) {
            prepare_journal_previewer();
        }
        else if (window.location.href.match(/\/journals\/\w+/) != null) {
            prepare_journal_detail();
        }
    });
})();