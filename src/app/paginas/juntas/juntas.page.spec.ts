import { ComponentFixture, TestBed } from '@angular/core/testing';
import { JuntasPage } from './juntas.page';

describe('JuntasPage', () => {
  let component: JuntasPage;
  let fixture: ComponentFixture<JuntasPage>;

  beforeEach(() => {
    fixture = TestBed.createComponent(JuntasPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
