import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { HttpModule } from '@angular/http';

import { AppComponent } from './app.component';
import { ExpensesTableComponent } from './expenses-table/expenses-table.component';
import {JsonDataSourceService} from "./json-data-source.service";

@NgModule({
  declarations: [
    AppComponent,
    ExpensesTableComponent
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
