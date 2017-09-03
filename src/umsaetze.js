"use strict";
/// <reference path="../typings/index.d.ts" />
exports.__esModule = true;
var Workspace_1 = require("./Workspace");
// var bootstrap = require('bootstrap');
var _ = require('underscore');
var Backbone = require('backbone');
if (window.__backboneAgent) {
    window.__backboneAgent.handleBackbone(Backbone);
}
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
Object.values = function (obj) { return Object.keys(obj).map(function (key) { return obj[key]; }); };
// should not use =>
Array.prototype.average = function () {
    //console.log('average', this);
    if (this.length) {
        var sum = _.reduce(this, function (a, b) {
            return parseFloat(a) + parseFloat(b);
        });
        var avg = sum / this.length;
        //console.log(totals, sum, avg);
        return avg.toFixed(2);
    }
    else {
        return null;
    }
};
function debug(name) {
    return function () {
        //console.warn(name + ":", arguments);
    };
}
exports.debug = debug;
var Umsaetze = /** @class */ (function () {
    function Umsaetze() {
        new Workspace_1["default"]({
            root: 'umsaetze/web/'
        });
        // console.log(ws);
        Backbone.history.start();
        // console.log(start);
        this.inlineEdit();
        this.tour();
    }
    Umsaetze.prototype.inlineEdit = function () {
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
    };
    Umsaetze.prototype.tour = function () {
        var Tour = require('bootstrap-tour');
        var tour = new Tour({
            steps: [
                {
                    element: "#app",
                    title: "Let me show you how it works",
                    content: "Here you will see all your expenses in a selected month."
                },
            ]
        });
        setTimeout(function () {
            // Initialize the tour
            // tour.init();
            // Start the tour
            // tour.start();
        }, 5);
    };
    return Umsaetze;
}());
$(function () {
    new Umsaetze();
});
// only run this once
// import ImportKeywords from './ImportKeywords';
// let i = new ImportKeywords();
//# sourceMappingURL=umsaetze.js.map