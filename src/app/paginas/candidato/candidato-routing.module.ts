import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { CandidatoPage } from './candidato.page';

const routes: Routes = [
  {
    path: '',
    component: CandidatoPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class CandidatoPageRoutingModule {}
