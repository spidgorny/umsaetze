import { Injectable } from '@angular/core';
import * as JSONData from '../data/umsaetze-2017-04-20.json';

@Injectable()
export class JsonDataSourceService {

  file = '../data/umsaetze-2017-04-20.json';
  data: any;

  constructor() {
    this.data = JSONData;
    console.log('jdss constructor', this.data.length);
  }

}
