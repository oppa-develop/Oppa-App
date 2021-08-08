import { TestBed } from '@angular/core/testing';

import { ModalsAndAlertsService } from './modals-and-alerts.service';

describe('ModalsAndAlertsService', () => {
  let service: ModalsAndAlertsService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(ModalsAndAlertsService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
