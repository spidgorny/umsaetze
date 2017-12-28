import {BrowserModule} from '@angular/platform-browser';
import {NgModule} from '@angular/core';
import {FormsModule} from '@angular/forms';
import {HttpModule} from '@angular/http';
import {AppComponent} from './app.component';
import {ExpensesTableComponent} from './components/expenses-table/expenses-table.component';
import {JsonDataSourceService} from './datasource/json-data-source.service';
import {CategorySelectorComponent} from './components/category-selector/category-selector.component';
import {LocalStorageDataSourceService} from './datasource/local-storage-data-source.service';
import {ExpensesService} from './services/expenses.service';
import {CategoryList} from './services/category-list';
import { MonthSelectorComponent } from './components/month-selector/month-selector.component';
import {CurrentMonthService} from './services/current-month.service';
import { RouterModule, Routes } from '@angular/router';
import { SparklineComponent } from './components/sparkline/sparkline.component';
import { KeywordsPageComponent } from './pages/keywords-page/keywords-page.component';
import {CategoryPageComponent} from './pages/category-page/category-page.component';
import { CategoryStatsComponent } from './components/category-stats/category-stats.component';
import { CategoryChartComponent } from './components/category-chart/category-chart.component';
import { SyncComponent } from './pages/sync/sync.component';

const appRoutes: Routes = [
	{ path: 'dashboard', component: ExpensesTableComponent},
	{ path: 'sync', component: SyncComponent},
	{ path: 'categories', component: CategoryPageComponent},
	{ path: 'keywords', component: KeywordsPageComponent},
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
		CategoryPageComponent,
		CategoryStatsComponent,
		CategoryChartComponent,
		SparklineComponent,
		KeywordsPageComponent,
		CategoryChartComponent,
		SyncComponent
	],
	imports: [
		RouterModule.forRoot(
			appRoutes,
			{ enableTracing: false } // <-- debugging purposes only
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

	constructor(protected expenses: ExpensesService,
				protected categories: CategoryList,
				protected currentMonth: CurrentMonthService) {
		this.categories.setCategoriesFromExpenses(
			expenses.getVisible(this.currentMonth));
	}

}
