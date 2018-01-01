"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const Keyword_1 = require("../Keyword/Keyword");
const $ = require("jquery");
const handlebars_1 = require("handlebars");
class CategoryPopup {
    constructor($el, expenses, categoryList, keywords) {
        this.expenses = expenses;
        this.categoryList = categoryList;
        this.keywords = keywords;
        this.$el = $el;
    }
    bindEvents() {
        this.$el
            .off('mouseup', 'td.note')
            .on('mouseup', 'td.note', this.textSelectedEvent.bind(this));
    }
    textSelectedEvent(event) {
        let text = CategoryPopup.getSelectedText().trim();
        console.log('textSelectedEvent', text);
        if (text) {
            let $contextMenu = this.$el.find('#contextMenu');
            if (!$contextMenu.length) {
                let template = handlebars_1.default.compile($('#categoryMenu').html());
                let menuHTML = template({
                    catlist: this.categoryList.getOptions(),
                });
                $('body').append(menuHTML);
                $contextMenu = $('#contextMenu');
                console.log($contextMenu, event.clientX, event.clientY);
            }
            this.openMenu($contextMenu, event.clientX, event.clientY, this.applyFilter.bind(this, text));
        }
    }
    static getSelectedText() {
        if (window.getSelection) {
            return window.getSelection().toString();
        }
        else if (typeof document['selection'] != 'undefined') {
            return document['selection'].createRange().text;
        }
        return '';
    }
    openMenu(menuSelector, clientX, clientY, callback) {
        let $menu = $(menuSelector)
            .show()
            .css({
            position: "absolute",
            left: CategoryPopup.getMenuPosition(clientX, 'width', 'scrollLeft', menuSelector),
            top: CategoryPopup.getMenuPosition(clientY, 'height', 'scrollTop', menuSelector)
        })
            .off('click')
            .on('click', 'a', function (e) {
            let $selectedMenu = $(e.target);
            if ($selectedMenu.length) {
                $menu.hide();
                callback.call(this, $selectedMenu);
            }
        });
        setTimeout(function () {
            $('body').click(function () {
                $(menuSelector).hide();
                $('body').off('click');
            });
        }, 0);
    }
    static getMenuPosition(mouse, direction, scrollDir, menuSelector) {
        let $win = $(window);
        let win = $win[direction](), scroll = $win[scrollDir](), menu = $(menuSelector)[direction](), position = mouse + scroll;
        if (mouse + menu > win && menu < mouse)
            position -= menu;
        return position;
    }
    applyFilter(text, menu) {
        let scrollTop = document.body.scrollTop;
        console.log('scrollTop', scrollTop);
        let categoryName = menu.text().trim();
        console.log(text, 'to be', categoryName);
        this.keywords.add(new Keyword_1.default({
            word: text,
            category: categoryName,
        }));
        this.expenses.setCategories(this.keywords);
    }
}
exports.CategoryPopup = CategoryPopup;
//# sourceMappingURL=CategoryPopup.js.map