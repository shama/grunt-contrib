/**
 * Task: less
 * Description: Compile LESS files to CSS
 * Dependencies: less
 * Contributor: @tkellen
 */

module.exports = function(grunt) {
  var _ = grunt.util._;
  var async = grunt.util.async;

  var lessError = function(e) {
    var pos = '[' + 'L' + e.line + ':' + ('C' + e.column) + ']';
    grunt.log.error(e.filename + ': ' + pos + ' ' + e.message);
    grunt.fail.warn("Error compiling LESS.", 1);
  };

  grunt.registerMultiTask("less", "Compile LESS files to CSS", function() {
    var options = this.options();
    var done = this.async();

    grunt.verbose.writeflags(options, "Options");

    async.forEachSeries(this.files, function(file, next) {
      var srcFiles = grunt.file.expandFiles(file.src);

      async.concatSeries(srcFiles, function(srcFile, nextConcat) {
        var lessOptions = _.extend({filename: srcFile}, options);
        var lessSource = grunt.file.read(srcFile);

        grunt.helper("less", lessSource, lessOptions, function(css) {
          nextConcat(css);
        });
      }, function(css) {
        grunt.file.write(file.dest, css);
        grunt.log.writeln("File '" + file.dest + "' created.");

        next();
      });

    }, function() {
      done();
    });
  });

  grunt.registerHelper("less", function(source, options, callback) {
    require("less").Parser(options).parse(source, function(parse_error, tree) {
      if (parse_error) {
        lessError(parse_error);
      }

      try {
        var css = tree.toCSS();
        callback(css);
      } catch (e) {
        lessError(e);
      }
    });
  });
};