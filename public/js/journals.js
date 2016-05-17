/**
 * Created by Obscurity on 2016/5/3.
 */

(function() {

    var prepare_journal_detail = function () {
        var journal_content_container = $("#journal-content");
        journal_content_container.html(journal_content_container.text());
        $('pre code').each(function() {
            hljs.highlightBlock(this);
        });

        var owo = new OwO({
            logo: 'OωO表情',
            container: document.getElementsByClassName('OwO')[0],
            target: document.getElementById('comment_input'),
            position: 'down',
            api: "/OwO/OwO.json",
            width: '100%',
            maxHeight: '250px'
        });

        $("a[id$='_reply_entry']").on('click', function () {
            var entry_id = $(this).attr('id');
            var toggle_hash = {
                "回复": "收起",
                "收起": "回复"
            }
            $(this).text(toggle_hash[$(this).text().trim()]);
            var comment_id = entry_id.substring(0, entry_id.indexOf("_reply_entry"));
            $("#" + comment_id + "_reply_container").slideToggle();
        });
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
            theme: "default",
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
            var journal_raw_content = marked(rawEditor.val());
            journal_previewer_content.html(journal_raw_content);
            MathJax.Hub.Queue(["Typeset", MathJax.Hub, journal_raw_content]);
            journal_previewer_content.children('pre').each(function() {
                hljs.highlightBlock(this);
            });
        });
    }

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