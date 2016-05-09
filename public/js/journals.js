/**
 * Created by Obscurity on 2016/5/3.
 */

(function() {

    var prepare_journal_detail = function () {
        var journal_content_container = $("#journal-content");
        journal_content_container.html(journal_content_container.text());
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
            var journal_raw_content = markdown.toHTML(rawEditor.val(), "Maruku");
            journal_previewer_content.html(journal_raw_content);
        });
    }

    $(document).on('ready', function () {
        if (window.location.href.match(/\/journals\/\w+\/edit/) != null) {
            prepare_journal_previewer();
        }
        else if (window.location.href.match(/\/journals\/new/) != null) {
            console.log(2222)
            prepare_journal_previewer();
        }
        else if (window.location.href.match(/\/journals\/\w+/) != null) {
            prepare_journal_detail();
        }
    });
})();