import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { VotosPageRoutingModule } from './votos-routing.module';

import { VotosPage } from './votos.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    VotosPageRoutingModule
  ],
  declarations: [VotosPage]
})
export class VotosPageModule {}
