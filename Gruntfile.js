module.exports = function(grunt) {
  'use strict';

  grunt.initConfig({
    pkg: grunt.file.readJSON('package.json'),
    clean: {
      build: ['tmp', 'dist'],
      bower: ['src/bower_componentss']
    },
    version: {
      options: {
        prefix: '@version\\s+'
      },
      defaults: {
        src: ['dist/version']
      }
    },
    concat: {
      options: {
        separator: ';',
        sourceMap: true
      },
      target: {
        files: {
          'dist/js/<%= pkg.name %>.dist.js': [
            'src/app/**/*.module.js',
            'src/app/**/*.js',
            'src/app/app.js',
            '<%= ngtemplates.dist.dest %>'
          ]
        }
      }
    },
    'ngAnnotate': {
      options: {
        singleQuotes: true,
        separator: ';'
      },
      dist: {
        files: {
          'dist/js/<%= pkg.name %>.dist.js': ['dist/js/<%= pkg.name %>.dist.js']
        }
      }
    },
    'ngtemplates': {
      dist: {
        src: 'src/app/**/*.html',
        dest: 'tmp/templates.js',
        options: {
          module: 'app',
          url: function(url) {
            return url.substr(url.indexOf('src') + 'src'.length);
          }
        }
      }
    },
    uglify: {
      dist: {
        options: {
          banner: '/*! <%= pkg.name %> <%= grunt.template.today("dd-mm-yyyy") %> */\n',
          sourceMap: true,
          sourceMapIn: 'dist/js/<%= pkg.name %>.dist.js.map',
          sourceMapName: 'dist/js/<%= pkg.name %>.dist.min.js.map',
          mangle: false,
          compress: true
        },
        files: {
          'dist/js/<%= pkg.name %>.dist.min.js': [
            'dist/js/<%= pkg.name %>.dist.js'
          ]
        }
      }
    },
    'sass_globbing': {
      main: {
        files: {
          'src/assets/sass/maps/_base.scss': 'src/assets/sass/partial/*.scss',
          'src/assets/sass/maps/_components.scss': 'src/app/components/**/*.scss'
        },
        options: {
          useSingleQuotes: false
        }
      }
    },
    sass: {
      dist: {
        files: {
          'dist/css/<%= pkg.name %>.dist.css': 'src/assets/sass/main.scss'
        }
      },
      options: {
        style: 'expanded'
      }
    },
    cssmin: {
      options: {
        sourceMap: true
      },
      target: {
        files: {
          'dist/css/<%= pkg.name %>.dist.min.css': [
            'dist/css/<%= pkg.name %>.dist.css'
          ]
        }
      }
    },
    copy: {
      img: {
        cwd: 'src/assets/',
        src: 'images/**',
        dest: 'dist',
        expand: true
      },
      vendor: {
        cwd: 'src/vendor/',
        src: '**',
        dest: 'dist/',
        expand: true
      },
      index: {
        cwd: 'src/',
        src: 'index.html',
        dest: 'dist',
        expand: true
      }
    },
    jshint: {
      options: {
        reporter: require('jshint-html-reporter'),
        reporterOutput: 'check-style/jshint-report.html',
        jshintrc: './src/.jshintrc'
      },
      all: ['Gruntfile.js', 'src/app/*.js', 'src/app/**/*.js']
    },
    jscs: {
      src: ['Gruntfile.js', 'src/app/*.js', 'src/app/**/*.js'],
      options: {
        config: '.jscsrc',
        esnext: false, // If you use ES6 http://jscs.info/overview.html#esnext
        verbose: true, // If you need output with rule names http://jscs.info/overview.html#verbose
        reporter: require('jscs-html-reporter').path,
        reporterOutput: 'check-style/jscs-report.html'
      }
    },
    watch: {
      scripts: {
        files: ['src/**/*.js', 'src/**/*.html'],
        tasks: ['distjs', 'notify:watch'],
        options: {
          spawn: false,
          livereload: true
        }
      },
      sass: {
        files: ['src/**/*.scss', 'src/**/*.sass', 'src/**/*.html'],
        tasks: ['distcss', 'notify:watch'],
        options: {
          spawn: false,
          livereload: true
        }
      },
      bower: {
        files: ['bower.json'],
        tasks: ['clean:bower', 'dist', 'notify:watch'],
        options: {
          spawn: false,
          livereload: true
        }
      },
      version: {
        files: ['package.json'],
        tasks: ['version', 'dist', 'notify:watch'],
        options: {
          spawn: false
        }
      }
    },
    notify: {
      watch: {
        options: {
          message: 'Code updated by watch succesfully!' //required
        }
      },
      dist: {
        options: {
          message: 'Files created by dist succesfully!'
        }
      }
    },
    'bower_concat': {
      all: {
        dest: 'dist/js/bowerbundle.js',
        cssDest: 'dist/css/bowerbundle.css',
        bowerOptions: {
          relative: false
        },
        mainFiles: {
          'font-awesome': 'css/font-awesome.min.css'
        },
        dependencies: {
          'bootstrap-sass': 'jquery',
          'bootstrap-css': 'jquery'
        },
        exclude: [
          'compass-breakpoint',
          'compass-mixins',
          'sassy-maps'
        ]
      }
    },
    nodemon: {
      dev: {
        script: './server.js'
      }
    },
    concurrent: {
      dev: {
        tasks: ['nodemon', 'watch'],
        options: {
          logConcurrentOutput: true
        }
      }
    }
  });

  // ----- PLUGINS ------
  grunt.loadNpmTasks('grunt-nodemon');
  grunt.loadNpmTasks('grunt-contrib-clean');
  grunt.loadNpmTasks('grunt-concurrent');
  grunt.loadNpmTasks('grunt-version');
  grunt.loadNpmTasks('grunt-sass');
  grunt.loadNpmTasks('grunt-sass-globbing');
  grunt.loadNpmTasks('grunt-contrib-cssmin');
  grunt.loadNpmTasks('grunt-contrib-copy');
  grunt.loadNpmTasks('grunt-contrib-concat');
  grunt.loadNpmTasks('grunt-contrib-uglify');
  grunt.loadNpmTasks('grunt-contrib-watch');
  grunt.loadNpmTasks('grunt-contrib-jshint');
  grunt.loadNpmTasks('grunt-notify');
  grunt.loadNpmTasks('grunt-jscs');
  grunt.loadNpmTasks('grunt-bower-concat');
  grunt.loadNpmTasks('grunt-bower-install-task');
  // ----- OTHER TASKS ------

  grunt.registerTask('distjs', ['jshint', 'jscs', 'ngtemplates', 'concat', 'ngAnnotate', 'uglify', 'copy']);
  grunt.registerTask('distcss', ['sass_globbing:main', 'sass', 'cssmin', 'copy']);
  grunt.registerTask('dev', ['dist', 'concurrent:dev']);
  grunt.registerTask('dist', 'Task to create a distribution release.', [
    'clean:build', 'version', 'bower_install', 'distcss', 'distjs', 'copy', 'bower_concat'
  ]);
  grunt.registerTask('default', ['dist', 'notify:dist']);
};

