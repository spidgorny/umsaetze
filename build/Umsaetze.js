"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const Workspace_1 = require("./Workspace");
const Backbone = require("backbone");
const $ = require("jquery");
const bootstrap_tour_1 = require("bootstrap-tour");
class Umsaetze {
    constructor() {
        this.router = new Workspace_1.default();
        const ok = Backbone.history.start({
            root: '/web/'
        });
        if (!ok) {
            console.error('history start failed', this.router.routes);
        }
        this.inlineEdit();
    }
    inlineEdit() {
        $(document).on('click', '.inlineEdit span', (event) => {
            let span = $(event.target);
            let container = span.parent();
            let input = container.find('input').show();
            span.hide();
            input.focus().val(span.text().trim());
            input.keyup((event) => {
                console.log(event.key);
                if (event.keyCode === 13) {
                    $(event.target).blur();
                }
            });
            input.blur((event) => {
                span.html(input.val().toString().trim());
                input.hide();
                span.show();
                let callback = container.data('callback');
                if (typeof callback == 'function') {
                    callback(event, container, container.text().trim());
                }
            });
        });
    }
    tour() {
        let tour = new bootstrap_tour_1.Tour({
            steps: [
                {
                    element: "#app",
                    title: "Let me show you how it works",
                    content: "Here you will see all your expenses in a selected month."
                },
            ]
        });
        setTimeout(() => {
        }, 5);
    }
}
exports.Umsaetze = Umsaetze;
//# sourceMappingURL=Umsaetze.js.map