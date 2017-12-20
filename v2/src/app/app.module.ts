import {BrowserModule} from '@angular/platform-browser';
import {NgModule} from '@angular/core';
import {FormsModule} from '@angular/forms';
import {HttpModule} from '@angular/http';

import {AppComponent} from './app.component';
import {ExpensesTableComponent} from './expenses-table/expenses-table.component';
import {JsonDataSourceService} from './json-data-source.service';
import {CategorySelectorComponent} from './category-selector/category-selector.component';
import {LocalStorageDataSourceService} from './local-storage-data-source.service';
import {ExpensesService} from './expenses.service';
import {CategoryList} from './category-list';

@NgModule({
	declarations: [
		AppComponent,
		ExpensesTableComponent,
		CategorySelectorComponent
	],
	imports: [
		BrowserModule,
		FormsModule,
		HttpModule
	],
	providers: [
		JsonDataSourceService,
		LocalStorageDataSourceService,
		ExpensesService,
		CategoryList
	],
	bootstrap: [AppComponent]
})
export class AppModule {

	constructor(public expenses: ExpensesService, public categories: CategoryList) {
		this.categories.setCategoriesFromExpenses(expenses);
	}

}
