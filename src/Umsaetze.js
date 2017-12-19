"use strict";
var Workspace_1 = require('./Workspace');
console.log(Workspace_1.default);
// import Backbone from 'backbone-es6/src/Backbone.js';
var Backbone = require('backbone');
var $ = require("jquery");
var bootstrap_tour_1 = require('bootstrap-tour');
var Umsaetze = (function () {
    function Umsaetze() {
        this.router = new Workspace_1.default();
        console.log('Umsaetze.router', this.router);
        var ok = Backbone.history.start({
            root: '/umsaetze/docs/web/'
        });
        console.log('history.start', ok);
        if (!ok) {
            console.log(this.router.routes);
        }
        this.inlineEdit();
        this.tour();
        console.log('Umsaetze.constructor() done');
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
                span.html(input.val().toString().trim());
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
        var tour = new bootstrap_tour_1.default({
            steps: [
                {
                    element: "#app",
                    title: "Let me show you how it works",
                    content: "Here you will see all your expenses in a selected month."
                },
            ] });
        setTimeout(function () {
            // Initialize the tour
            // tour.init();
            // Start the tour
            // tour.start();
        }, 5);
    };
    return Umsaetze;
}());
exports.Umsaetze = Umsaetze;
