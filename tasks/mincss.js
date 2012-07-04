/**
 * Task: mincss
 * Description: Minify CSS files
 * Dependencies: clean-css
 * Contributor: @tbranyen
 */

module.exports = function(grunt) {
  grunt.registerMultiTask("mincss", "Minify CSS files", function() {
    var options = this.options();

    grunt.verbose.writeflags(options, "Options");

    this.files.forEach(function(file) {
      var srcFiles = grunt.file.expandFiles(file.src);
      var source = grunt.helper("concat", srcFiles);

      var min = grunt.helper("mincss", source);

      if (min.length > 0) {
        grunt.file.write(file.dest, min);
        grunt.log.writeln("File '" + file.dest + "' created.");
        grunt.helper('min_max_info', min, source);
      }
    });
  });

  grunt.registerHelper("mincss", function(source) {
    try {
      return require("clean-css").process(source);
    } catch (e) {
      grunt.log.error(e);
      grunt.fail.warn("css minification failed.");
    }
  });
};