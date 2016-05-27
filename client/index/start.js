"use strict";
require('./index.scss');
window.__DESCRIPTION__ = 'Mouse Room';
var corona_client_1 = require('corona-client');
window.onload = function () {
    var client = new corona_client_1.Client('ws://localhost:8080/', function (controller) {
    });
};
