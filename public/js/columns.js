/**
 * Created by Obscurity on 2016/5/29.
 */


(function() {

    var prepare_column_detail = function () {
        let column_introduction_container = $("#column-introduction");
        column_introduction_container.html(column_introduction_container.text());
        MathJax.Hub.Config({
            tex2jax: {inlineMath: [['$','$'], ['\\(','\\)']]}
        });
        MathJax.Hub.Queue(["Typeset", MathJax.Hub]);
        $('pre code').each(function() {
            hljs.highlightBlock(this);
        });
        prepare_column_share();
    };

    let prepare_column_share = function () {
        $("#hshare").hshare({
            size: "medium",
            renderText: true,
            shares: [{
                platform: "qzone",
                icon: "/hshare/icons/qzone.png",
                text: "分享到QQ空间"
            }, {
                platform: "qq",
                icon: "/hshare/icons/qq.png",
                text: "QQ好友"
            }, {
                platform: "douban",
                icon: "/hshare/icons/douban.png",
                text: "豆瓣"
            }, {
                platform: "renren",
                icon: "/hshare/icons/renren.png",
                text: "人人网"
            }, {
                platform: "sinaweibo",
                icon: "/hshare/icons/sinaweibo.png",
                text: "新浪微博"
            }, {
                platform: "wechat",
                icon: "/hshare/icons/wechat.png",
                text: "微信"
            }]
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
            let renderer = new marked.Renderer();
            renderer.image = function(href, title, text) {
                let out = '<img style="width: 100%;" src="' + href + '" alt="' + text + '"';
                if (title) {
                    out += ' title="' + title + '"';
                }
                out += this.options.xhtml ? '/>' : '>';
                return out;
            };
            var column_raw_content = marked(rawEditor.val(), {renderer: renderer});
            column_previewer_content.html(column_raw_content);
            MathJax.Hub.Config({
                tex2jax: {inlineMath: [['$','$'], ['\\(','\\)']]}
            });
            MathJax.Hub.Queue(["Typeset", MathJax.Hub, column_raw_content]);
            column_previewer_content.children('pre').each(function() {
                hljs.highlightBlock(this);
            });
        });
    };

    $(document).on('ready', function () {
        if (window.location.href.match(/\/columns\/\w+\/edit/) != null) {
            prepare_column_previewer();
        }
        else if (window.location.href.match(/\/columns\/new/) != null) {
            prepare_column_previewer();
        }
        else if (window.location.href.match(/\/columns\/\w+/) != null) {
            prepare_column_detail();
        }
    });
})();