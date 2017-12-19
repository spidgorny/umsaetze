import { Component, OnInit } from '@angular/core';
import {JsonDataSourceService} from "../json-data-source.service";

@Component({
  selector: 'app-expenses-table',
  templateUrl: './expenses-table.component.html',
  styleUrls: ['./expenses-table.component.css'],
    providers: [JsonDataSourceService],
})
export class ExpensesTableComponent implements OnInit {

  items = [
      'asd',
      'qwe',
  ];

  constructor(public data: JsonDataSourceService) {
    // console.log(data.file);
    console.log('etc constructor', this.data.data.length);
  }

  ngOnInit() {
	  console.log('etc ngOnInit', this.data.data.length);
  }

}
