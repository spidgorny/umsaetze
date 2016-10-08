/// <reference path="../typings/index.d.ts" />
"use strict";
var Workspace_1 = require("./Workspace");
// var bootstrap = require('bootstrap');
// var _ = require('underscore');
var Backbone = require('backbone');
var $ = require('jquery');
// const _ = require('underscore');
function asyncLoop(arr, callback, done) {
    (function loop(i) {
        //callback when the loop goes on
        callback(arr[i], i, arr.length);
        //the condition
        if (i < arr.length) {
            setTimeout(function () {
                loop(++i);
            }, 0); //rerun when condition is true
        }
        else {
            if (done) {
                //callback when the loop ends
                done();
            }
        }
    }(0)); //start with 0
}
exports.asyncLoop = asyncLoop;
function debug(name) {
    return function () {
        //console.warn(name + ":", arguments);
    };
}
exports.debug = debug;
$(function () {
    new Workspace_1.default({
        root: 'umsaetze/web/'
    });
    // console.log(ws);
    Backbone.history.start();
    // console.log(start);
    $(document).on('click', '.inlineEdit span', function (event) {
        var span = $(event.target);
        var container = span.parent();
        var input = container.find('input').show();
        span.hide();
        input.focus().val(span.text().trim());
        input.keyup(function (event) {
            console.log(event.key);
            if (event.keyCode === 13) {
                $(event.target).blur();
            }
        });
        input.blur(function (event) {
            span.html(input.val().trim());
            input.hide();
            span.show();
            var callback = container.data('callback');
            if (typeof callback == 'function') {
                callback(event, container, container.text().trim());
            }
        });
    });
});
// only run this once
// import ImportKeywords from './ImportKeywords';
// let i = new ImportKeywords();
//# sourceMappingURL=umsaetze.js.map