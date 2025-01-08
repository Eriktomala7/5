import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { DignidadesPageRoutingModule } from './dignidades-routing.module';

import { DignidadesPage } from './dignidades.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    DignidadesPageRoutingModule
  ],
  declarations: [DignidadesPage]
})
export class DignidadesPageModule {}
