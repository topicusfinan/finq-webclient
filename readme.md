#[Finq Webclient](http://finq.io) [![Build Status](https://travis-ci.org/topicusfinan/finq-webclient.svg?branch=master)](https://travis-ci.org/topicusfinan/finq-webclient) [![Coverage Status](https://img.shields.io/coveralls/topicusfinan/finq-webclient.svg)](https://coveralls.io/r/topicusfinan/finq-webclient?branch=master) [![Code Climate](https://codeclimate.com/github/topicusfinan/finq-webclient/badges/gpa.svg)](https://codeclimate.com/github/topicusfinan/finq-webclient)

###A behavior based testing webclient

The Finq Webclient allows a test to use a browser for enterprise testing. To finally get rid of the need to use complex tools for use-case testing to ensure that testing becomes fun, Finq introduces behavior based testing the webclient support. Tests will become self documenting, humanly readable, easy to manage and easy to write, by taking advantage of a [Behavior-driven development](http://en.wikipedia.org/wiki/Behavior-driven_development) and domain specific languages for test specification.

Finq is currently a work in progress in the early stages of development.

##Developing

To develop you must have the following tools installed and added to your PATH:

* [Node](http://nodejs.org/) as the application is developed in [Angular](https://angularjs.org/) to run on node
* [Git](http://git-scm.com/) as we are using git for version control
* [Ruby](https://www.ruby-lang.org/) required for Sass
* [Sass](http://sass-lang.com/) since all styling is developed using Sass
* [Karma](http://karma-runner.github.io/) for automated testing during development
* [Grunt](http://gruntjs.com/) for execution of our automated tasks
* [Bower](http://bower.io/) for application dependency management

###Install
First you have to make sure you install Node, Git and Ruby. After these components are installed you can use Ruby to install Sass globaly. To do so run the following command:

    $ gem install sass

After this Sass should be available (which you can check by executing `sass -v` on your commandline). If you're on Windows you might have an issue with Ruby not being set on your path automatically. This will block the abovementioned command. To ensure it is, you can manually add the location of your ruby install to the system path. 

To get the proper toolset after installing node you can use the node package manager:

    $ npm install -g grunt-cli
    $ npm install -g bower
    $ npm install
    $ bower install

This will install Grunt on your command line and makes sure that bower is available for dependency management. Run the above commands in the application directory so all packages and dependencies are retrieved.

####Code style
To support consistent code styling we make use of [jshint](http://www.jshint.com/) for javascript convention validation and [scss-lint](https://github.com/causes/scss-lint) for SASS convention validation. Even though JShint is automatically installed with the above commands, scss-lint requires an additional Ruby Gem to be installed as follows:

    $ gem install scss-lint

Grunt is setup to automatically validate the `.scss` files in `app/sass`, so any changes to those files are immediately validated in case you're running Grunt on the background.

##Running
When you're all setup you can run the development server using `grunt serve` or generate a distributable using `grunt serve:dist`. A distributable requires you to also have a backend available. The [Finq Runner](https://github.com/topicusfinan/jbehave-rest-runner) has to be installed and running to be able to pass the preloader screen. The non distributable contains a mocked backend for isolated development purposes.

###Testing
To run the unit and end to end tests, execute `grunt test`.

##License
Finq version 0, Copyright (C) 2014 Christian Kramer. 

The Finq webclient comes with ABSOLUTELY NO WARRANTY; This is free software, and you are welcome to redistribute it under certain conditions as mentioned in the enclosed License file.
