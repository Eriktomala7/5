import { ComponentFixture, TestBed } from '@angular/core/testing';
import { CandidatoPage } from './candidato.page';

describe('CandidatoPage', () => {
  let component: CandidatoPage;
  let fixture: ComponentFixture<CandidatoPage>;

  beforeEach(() => {
    fixture = TestBed.createComponent(CandidatoPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
