import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { HttpModule } from '@angular/http';

import { AppComponent } from './app.component';
import { ExpensesTableComponent } from './expenses-table/expenses-table.component';
import {JsonDataSourceService} from "./json-data-source.service";
import { CategorySelectorComponent } from './category-selector/category-selector.component';

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
  providers: [JsonDataSourceService],
  bootstrap: [AppComponent]
})
export class AppModule { }
