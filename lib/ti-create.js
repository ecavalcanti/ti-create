var pw = require("pathwatcher"),
    File = pw.File,
    Directory = pw.Directory;

var at = require("atom"),
    EditorView = at.EditorView,
    BufferedProcess = at.BufferedProcess;

module.exports = {
    activate: function() {
        atom.workspaceView.command('ti-create:controller', this.createController);
        atom.workspaceView.command('ti-create:widget', this.createWidget);
        atom.workspaceView.command('ti-create:project', this.createProject);
    },

    createController: function() {
        create("controller");
    },
    createWidget: function() {
        create("widget");
    },
    createProject: function() {
        create("project");
    }
};

function create(what) {
    var editor = atom.workspace.activePaneItem;
    // get project path
    var ppath = atom.project.getPath();
    // check for alloy

    if (what == "project") {
        // create new alloy project

        edView = new EditorView({
            mini: true
        });
        edView.on("keyup", function(e) {
            // get text content
            var str = edView.getText();

            if (e.keyCode == 27) {
                // ESC
                edView.remove();
            } else if (e.keyCode == 13) {
                if (str !== "") {
                    args = new Array("create", "-n", str, "-p", "all", "-t", "app", "--no-prompt", "--id", "com." + str, "--workspace-dir", ppath);

                    var process = new BufferedProcess({
                        command: "titanium",
                        args: args,
                        stdout: function(e) {
                            console.log(e);
                        }
                    });
                    process.process.on('exit', function() {
                        // make it an alloy project

                        var options = {
                            cwd: ppath + "/" + str
                        };
                        var process = new BufferedProcess({
                            command: "alloy",
                            options: options,
                            args: ["new"],
                            stdout: function(e) {
                                console.log(e);
                            },
                            stderr: function(e) {
                                console.log(e);
                            }
                        });
                        process.process.on('exit', function() {
                            atom.notifications.addSuccess("Done");
                        });
                    });
                    edView.remove();
                } else {
                    edView.remove();
                }
            }
        });
        atom.workspaceView.appendToTop(edView);
        edView.focus();
    } else {
        var fold = new Directory(ppath + "/app/");
        if (fold.getEntriesSync().length > 0) {

            edView = new EditorView({
                mini: true
            });
            edView.on("keyup", function(e) {
                // get text content
                var str = edView.getText();

                if (e.keyCode == 27) {
                    // ESC
                    edView.remove();
                } else if (e.keyCode == 13) {
                    if (str !== "") {
                        // only if string is not empty
                        var options = {
                            cwd: atom.project.getPath()
                        };
                        var args;

                        if (what == "controller") {
                            args = ["generate", "controller", str];
                        } else if (what == "widget") {
                            // create widget
                            args = ["generate", "widget", str];
                        }
                        var process = new BufferedProcess({
                            command: "alloy",
                            options: options,
                            args: args,
                            stdout: function(e) {
                                console.log(e);
                            },
                            stderr: function(e) {
                                console.log(e);
                            }
                        });
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
}
