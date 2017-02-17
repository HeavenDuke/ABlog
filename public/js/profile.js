/**
 * Created by Obscurity on 2016/5/3.
 */

(function() {

    var prepare_profile_share = function () {
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

    var prepare_profile_detail = function () {
        var profile_content_container = $("#profile-content");
        profile_content_container.html(profile_content_container.text());
        MathJax.Hub.Config({
            tex2jax: {inlineMath: [['$','$'], ['\\(','\\)']]}
        });
        setTimeout(function () {
            MathJax.Hub.Queue(["Typeset", MathJax.Hub]);
        }, 1000);
        $('pre code').each(function () {
            hljs.highlightBlock(this);
        });
        prepare_profile_share();
    };

    var prepare_profile_previewer = function () {
        var rawEditor = $("#profile_content_input");
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
        var profile_previewer_entry = $("#profile_previewer_entry");
        profile_previewer_entry.on("click", function () {
            var profile_previewer = $("#profile_previewer");
            var profile_previewer_content = $("#profile_previewer_content");
            myCodeMirror.save();
            var renderer = new marked.Renderer();
            renderer.image = function(href, title, text) {
                var out = '<img style="width: 100%;" src="' + href + '" alt="' + text + '"';
                if (title) {
                    out += ' title="' + title + '"';
                }
                out += this.options.xhtml ? '/>' : '>';
                return out;
            };
            var profile_raw_content = marked(rawEditor.val(), {renderer: renderer});
            profile_previewer_content.html(profile_raw_content);
            MathJax.Hub.Config({
                tex2jax: {inlineMath: [['$','$'], ['\\(','\\)']]}
            });
            MathJax.Hub.Queue(["Typeset", MathJax.Hub]);
            profile_previewer_content.children('pre').each(function() {
                hljs.highlightBlock(this);
            });
        });
    };

    $(document).on('ready', function () {
        if (window.location.href.match(/\/profile\/edit/) != null) {
            prepare_profile_previewer();
        }
        else if (window.location.href.match(/\/profile/) != null) {
            prepare_profile_detail();
        }
    });
})();