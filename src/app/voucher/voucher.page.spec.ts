import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { VoucherPage } from './voucher.page';

describe('VoucherPage', () => {
  let component: VoucherPage;
  let fixture: ComponentFixture<VoucherPage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ VoucherPage ],
      schemas: [CUSTOM_ELEMENTS_SCHEMA],
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(VoucherPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
