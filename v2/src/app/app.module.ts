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
import { MonthSelectorComponent } from './month-selector/month-selector.component';
import {CurrentMonthService} from './current-month.service';
import { RouterModule, Routes } from '@angular/router';
import {CategoryPageComponent} from './category-page/category-page.component';

const appRoutes: Routes = [
	{ path: 'categories', component: CategoryPageComponent},
	{ path: 'dashboard', component: ExpensesTableComponent},
	{ path: '',
		redirectTo: '/dashboard',
		pathMatch: 'full'
	},
	// { path: '**', component: PageNotFoundComponent }
];

@NgModule({
	declarations: [
		AppComponent,
		ExpensesTableComponent,
		CategorySelectorComponent,
		MonthSelectorComponent,
		CategoryPageComponent
	],
	imports: [
		RouterModule.forRoot(
			appRoutes,
			{ enableTracing: true } // <-- debugging purposes only
		),
		BrowserModule,
		FormsModule,
		HttpModule
	],
	providers: [
		JsonDataSourceService,
		LocalStorageDataSourceService,
		ExpensesService,
		CategoryList,
		CurrentMonthService
	],
	bootstrap: [AppComponent]
})
export class AppModule {

	constructor(public expenses: ExpensesService, public categories: CategoryList) {
		this.categories.setCategoriesFromExpenses(expenses);
	}

}
