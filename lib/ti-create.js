var pw = require("pathwatcher"),
    File = pw.File,
    Directory = pw.Directory;

var at = require("atom"),
    EditorView = at.EditorView;

module.exports = {
    activate: function () {
        atom.workspaceView.command(
            'ti-create:controller', this.create);
    },

    create: function () {
        var editor = atom.workspace.activePaneItem;
        edView = new EditorView({
            mini: true
        });
        edView.on("keyup", function (e) {
            if (e.keyCode == 13) {
                var ppath = atom.project.getPath();
                var f = new File(ppath + "/app/controllers/" + edView.getText() + ".js");
                if (!f.exists()) {
                    f.write("var args = arguments[0] || {};");
                }
                var f = new File(ppath + "/app/views/" + edView.getText() + ".xml");
                if (!f.exists()) {
                    f.write("<Alloy>\n\t<Window>\n\t</Window>\n</Alloy>");
                }

                var f = new File(ppath + "/app/styles/" + edView.getText() + ".tss");
                if (!f.exists()) {
                    f.write("");
                }
                edView.remove();
            }

        });

        atom.workspaceView.appendToTop(edView);
        edView.focus();
    }
};
