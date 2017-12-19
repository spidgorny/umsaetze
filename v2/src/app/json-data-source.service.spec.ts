/* tslint:disable:no-unused-variable */

import { TestBed, async, inject } from '@angular/core/testing';
import { JsonDataSourceService } from './json-data-source.service';

describe('JsonDataSourceService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [JsonDataSourceService]
    });
  });

  it('should ...', inject([JsonDataSourceService], (service: JsonDataSourceService) => {
    expect(service).toBeTruthy();
  }));
});
