import { ComponentFixture, TestBed } from '@angular/core/testing';
import { VotosPage } from './votos.page';

describe('VotosPage', () => {
  let component: VotosPage;
  let fixture: ComponentFixture<VotosPage>;

  beforeEach(() => {
    fixture = TestBed.createComponent(VotosPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
