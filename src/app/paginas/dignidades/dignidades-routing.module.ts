import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { DignidadesPage } from './dignidades.page';

const routes: Routes = [
  {
    path: '',
    component: DignidadesPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class DignidadesPageRoutingModule {}
