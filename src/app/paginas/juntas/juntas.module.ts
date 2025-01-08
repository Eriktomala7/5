import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { JuntasPageRoutingModule } from './juntas-routing.module';

import { JuntasPage } from './juntas.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    JuntasPageRoutingModule
  ],
  declarations: [JuntasPage]
})
export class JuntasPageModule {}
