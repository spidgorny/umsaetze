import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { KeywordsPageComponent } from './keywords-page.component';

describe('KeywordsPageComponent', () => {
  let component: KeywordsPageComponent;
  let fixture: ComponentFixture<KeywordsPageComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ KeywordsPageComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(KeywordsPageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
