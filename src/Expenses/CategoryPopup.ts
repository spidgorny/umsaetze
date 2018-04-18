import Keyword from "../Keyword/Keyword";
import * as $ from "jquery";
import handlebars from 'handlebars';
import CategoryCollection from "../Category/CategoryCollection";
import KeywordCollection from "../Keyword/KeywordCollection";
import Expenses from "./Expenses";

/**
 * Displays a second list of categories AFTER selecting some text
 */
export class CategoryPopup {

	$el: JQuery;

	constructor($el: JQuery,
				protected expenses: Expenses,
				protected categoryList: CategoryCollection,
				protected keywords: KeywordCollection) {
		this.$el = $el;
	}

	bindEvents() {
		console.warn('CategoryPopup.bindEvents', this.$el);
		this.$el
			.off('mouseup')
			.on('mouseup', 'td.note', this.textSelectedEvent.bind(this));
	}

	textSelectedEvent(event: MouseEvent) {
		let text = CategoryPopup.getSelectedText().trim();
		console.log('textSelectedEvent', text);
		if (text) {
			//console.log(text);
			let $contextMenu = this.$el.find('#contextMenu');
			if (!$contextMenu.length) {
				let template = handlebars.compile($('#categoryMenu').html());
				let menuHTML = template({
					catlist: this.categoryList.getOptions(),
				});
				$('body').append(menuHTML);
				$contextMenu = $('#contextMenu');	// after append
				console.log($contextMenu, event.clientX, event.clientY);
			}
			this.openMenu($contextMenu, event.clientX, event.clientY, this.applyFilter.bind(this, text));
		}
	}

	static getSelectedText() {
		if (window.getSelection) {
			return window.getSelection().toString();
		} else if (typeof document['selection'] != 'undefined') {
			return document['selection'].createRange().text;
		}
		return '';
	}

	/**
	 * Opens a popup menu at the specified position
	 * @param menuSelector
	 * @param clientX
	 * @param clientY
	 * @param callback
	 */
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
		//console.log($menu);

		// make sure menu closes on any click
		// since we use onmouseup we can't immediately close the popup
		setTimeout(function () {
			$('body').click(function () {
				$(menuSelector).hide();
				$('body').off('click');	// once
			});
		}, 0);
	}

	static getMenuPosition(mouse, direction, scrollDir, menuSelector) {
		let $win: any = $(window);
		let win = $win[direction](),
			scroll = $win[scrollDir](),
			menu = (<any>$(menuSelector))[direction](),
			position = mouse + scroll;

		// opening menu would pass the side of the page
		if (mouse + menu > win && menu < mouse)
			position -= menu;

		return position;
	}

	/**
	 * When clicking on the category item from the popup menu
	 * @param text
	 * @param menu
	 */
	applyFilter(text, menu) {
		let scrollTop = document.body.scrollTop;
		console.log('scrollTop', scrollTop);

		let categoryName = menu.text().trim();
		console.log(text, 'to be', categoryName);
		this.keywords.add(new Keyword({
			word: text,
			category: categoryName,
		}));
		this.expenses.setCategories(this.keywords);

		// hopefully events will handle rendering
		// console.log('this.render()');
		// this.render();

		// setTimeout(() => {
		// 	console.log('Scrolling', scrollTop);
		// 	$('body').scrollTop(scrollTop);
		// }, 0);
	}

}
