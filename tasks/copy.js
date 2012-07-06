/**
 * Task: copy
 * Description: Copy files into another directory
 * Contributor: @ctalkington
 */

module.exports = function(grunt) {
  var path = require("path");

  var _ = grunt.util._;
  var kindOf = grunt.util.kindOf;

  grunt.registerMultiTask("copy", "Copy files into another directory.", function() {
    var options = this.options({
      basePath: null,
      processName: false,
      processContent: false,
      processContentExclude: []
    });

    var copyOptions = {
      process: options.processContent,
      noProcess: options.processContentExclude
    };

    if (options.basePath !== null) {
      options.basePath = _(options.basePath).trim("/");
    }

    grunt.verbose.writeflags(options, "Options");

    this.files.forEach(function(file) {
      var srcFiles = grunt.file.expandFiles(file.src);

      file.dest = _(file.dest).trim("/");

      if (grunt.file.exists(file.dest) === false) {
        grunt.file.mkdir(file.dest);
      }

      var count = 0;

      var filename = "";
      var relative = "";

      var destFile = "";

      srcFiles.forEach(function(srcFile) {
        filename = path.basename(srcFile);
        relative = path.dirname(srcFile);

        if (options.basePath !== null && options.basePath.length > 1) {
          relative = _(relative).strRightBack(options.basePath);
          relative = _(relative).trim("/");
        }

        if (options.processName && kindOf(options.processName) === "function") {
          filename = options.processName(filename);
        }

        // make paths outside grunts working dir relative
        relative = relative.replace(/\.\.\//g, "");

        destFile = path.join(file.dest, relative, filename);

        grunt.file.copy(srcFile, destFile, copyOptions);

        count++;
      });

      grunt.log.writeln("Copied " + count + ' file(s) to "' + file.dest + '".');
    });
  });
};