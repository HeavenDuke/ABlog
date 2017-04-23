/**
 * Created by heavenduke on 17-4-23.
 */

(function () {

    $.richText = function (myCodeMirror) {
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

        $('#image_creation_uploader').fileupload({
            url: "/images?_method=POST",
            dataType: 'json',
            done: function (e, data) {
                $.each(data.result.files, function (index, file) {
                    $("#image-preview-container").css("display", "block");
                    $("#image-previewer").attr("src", "/" + file.url);
                    $("#markdown-new-image").find("input[name='markdown-image-link']").val("/" + file.url);
                });
            },
            progressall: function (e, data) {
                var progress = parseInt(data.loaded / data.total * 100, 10);
                $('#create_upload_progress .progress-bar').css(
                    'width',
                    progress + '%'
                );
            }
        });
    }

})();