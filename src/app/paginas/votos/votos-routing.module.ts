import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { VotosPage } from './votos.page';

const routes: Routes = [
  {
    path: '',
    component: VotosPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class VotosPageRoutingModule {}
