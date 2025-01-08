import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { JuntasPage } from './juntas.page';

const routes: Routes = [
  {
    path: '',
    component: JuntasPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class JuntasPageRoutingModule {}
