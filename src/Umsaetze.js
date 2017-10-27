"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const Workspace_1 = require("./Workspace");
console.log(Workspace_1.default);
const Backbone = require("backbone");
const $ = require("jquery");
class Umsaetze {
    constructor() {
        this.router = new Workspace_1.default();
        console.log('Umsaetze.router', this.router);
        const ok = Backbone.history.start({
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
        let tour = new Tour({
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