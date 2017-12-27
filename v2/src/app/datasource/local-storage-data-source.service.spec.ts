import { TestBed, inject } from '@angular/core/testing';

import { LocalStorageDataSourceService } from './local-storage-data-source.service';

describe('LocalStorageDataSourceService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [LocalStorageDataSourceService]
    });
  });

  it('should be created', inject([LocalStorageDataSourceService], (service: LocalStorageDataSourceService) => {
    expect(service).toBeTruthy();
  }));
});
