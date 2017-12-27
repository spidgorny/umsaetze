import { TestBed, inject } from '@angular/core/testing';

import { CurrentMonthService } from './current-month.service';

describe('CurrentMonthService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [CurrentMonthService]
    });
  });

  it('should be created', inject([CurrentMonthService], (service: CurrentMonthService) => {
    expect(service).toBeTruthy();
  }));
});
