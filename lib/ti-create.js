var pw = require("pathwatcher"),
    File = pw.File,
    Directory = pw.Directory;

var at = require("atom"),
    EditorView = at.EditorView;

module.exports = {
    activate: function () {
        atom.workspaceView.command('ti-create:controller', this.createController);
        atom.workspaceView.command('ti-create:widget', this.createWidget);
    },

    createController: function () {
        create("controller");
    },
    createWidget: function () {
        create("widget");
    }
};

function create(what) {
    var editor = atom.workspace.activePaneItem;
    // get project path
    var ppath = atom.project.getPath();
    // check for alloy
    var fold = new Directory(ppath + "/app/");
    if (fold.getEntriesSync().length>0) {

        edView = new EditorView({
            mini: true
        });
        edView.on("keyup", function (e) {
            // get text content
            var str = edView.getText();

            if (e.keyCode == 27) {
                // ESC
                edView.remove();
            } else if (e.keyCode == 13) {
                if (str != "") {
                    // only if string is not empty
                    if (what == "controller") {

                        var f = new File(ppath + "/app/controllers/" + str + ".js");
                        if (!f.exists()) {
                            f.write("var args = arguments[0] || {};");
                        }
                        var f = new File(ppath + "/app/views/" + str + ".xml");
                        if (!f.exists()) {
                            f.write("<Alloy>\n\t<Window>\n\t</Window>\n</Alloy>");
                        }

                        var f = new File(ppath + "/app/styles/" + str + ".tss");
                        if (!f.exists()) {
                            f.write("");
                        }
                    } else if (what == "widget") {
                        // create widget
                        var f = new File(ppath + "/app/widgets/" + str + "/controllers/widget.js");
                        if (!f.exists()) {
                            f.write("var args = arguments[0] || {};");
                        }
                        var f = new File(ppath + "/app/widgets/" + str + "/styles/widget.tss");
                        if (!f.exists()) {
                            f.write("");
                        }
                        var f = new File(ppath + "/app/widgets/" + str + "/views/widget.xml");
                        if (!f.exists()) {
                            f.write("<Alloy>\n\t<Window>\n\t</Window>\n</Alloy>");
                        }
                        var f = new File(ppath + "/app/widgets/" + str + "/widget.json");
                        if (!f.exists()) {
                            f.write('{\n\t"id": "'+str+'",\n\t"name": "'+str+'",\n\t"description" : "",\n\t"author": "",\n\t"version": "1.0",\n\t"copyright":"Copyright (c) 2014",\n\t"license":"Public Domain",\n\t"min-alloy-version": "1.0",\n\t"min-titanium-version":"2.1",\n\t"tags":"",\n\t"platforms":"android,ios"\n}');
                        }
                    }
                }
                edView.remove();
            }

        });

        atom.workspaceView.appendToTop(edView);
        edView.focus();
    } else {
        alert("Doesn't look like an Alloy project");

    }
}
