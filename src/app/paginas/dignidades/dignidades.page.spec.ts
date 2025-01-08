import { ComponentFixture, TestBed } from '@angular/core/testing';
import { DignidadesPage } from './dignidades.page';

describe('DignidadesPage', () => {
  let component: DignidadesPage;
  let fixture: ComponentFixture<DignidadesPage>;

  beforeEach(() => {
    fixture = TestBed.createComponent(DignidadesPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
