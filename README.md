[![Build Status](https://travis-ci.org/TiddlySpace/tiddlyspacesockets.png)](https://travis-ci.org/TiddlySpace/tiddlyspacesockets)

# twsock

A node application using [socket.io](http://socket.io/) to update browsers with Tiddler activity on TiddlyWeb/Space

# Contributing

## Requirements

* [node](http://nodejs.org/)
* grunt: `npm install -g grunt-cli`
* [beanstalkd](http://kr.github.io/beanstalkd/)
* [tsapp](https://github.com/cdent/tsapp) - if you want to run the example client.

## Project Setup

Run `npm install` then `grunt --help` for a list of available project tasks.

### Running the Server

The node application listens for incoming data from beanstalkd, so this should be running first.  Then run:

    node server/twsock.js

This will be running on localhost, port 8081.

### Running TiddlySpace

In order to try out the server side code effectively, you will want to run a local instance of TiddlySpace.
This is covered [elsewhere](http://tiddlyweb.tiddlyspace.com/Hosting%20Your%20Own%20TiddlySpace).  Additional steps
beyond this are:

1. Install the dispatcher plugin:

    `pip install -U tiddlywebplugins.dispatcher`

2. Copy `listener.py` from the `dispatcher` folder to the TiddlySpace instance directory.

3. In tiddlywebconfig.py add the following:

   'use_dispatcher': True,
   'beanstalk.listeners': ['listener'],

4. In one terminal run `twanager server` and in another run `twanager dispatcher`

### Running the Example Client

The example client expects an instance of TiddlySpace running against localhost on port 8080.  If you are not running
the server side code, you can change this to point to tiddlyspace.com by commenting out (#) the `target_server` line in
the `client/.tsapp` file.

Run the following:

    grunt curl
    cd client && tsapp serve

Then navigate to `http://localhost:8082/index.html`

## Packaging and Installation

Run:

    grunt package

This produces a gzipped tarball that can be installed as follows:

    grunt install

This installs twsock as a global application.  It will be available in the path to run as `twsock`.