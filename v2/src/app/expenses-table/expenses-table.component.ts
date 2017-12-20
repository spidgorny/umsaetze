import {Component, OnInit} from '@angular/core';
import {JsonDataSourceService} from "../json-data-source.service";
import {ExpensesService} from '../expenses.service';

@Component({
	selector: 'app-expenses-table',
	templateUrl: './expenses-table.component.html',
	styleUrls: ['./expenses-table.component.css'],
	providers: [],
})
export class ExpensesTableComponent implements OnInit {

	dateFrom: Date;
	dateTill: Date;

	constructor(public data: ExpensesService) {
		// console.log(data.file);
		console.log('etc constructor', this.data.data.length);
		this.dateFrom = this.data.getEarliest();
		this.dateTill = this.data.getLatest();
		console.log('date extremes', this.dateFrom, this.dateTill);
	}

	ngOnInit() {
		console.log('etc ngOnInit', this.data.data.length);
		console.log('first', this.data.data[0]);
	}

}
