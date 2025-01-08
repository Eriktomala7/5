import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { CandidatoPageRoutingModule } from './candidato-routing.module';

import { CandidatoPage } from './candidato.page';
import { BaseChartDirective } from 'ng2-charts';
import { NgApexchartsModule } from 'ng-apexcharts';


@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    CandidatoPageRoutingModule,
    NgApexchartsModule
    
  ],
  declarations: [CandidatoPage]
})
export class CandidatoPageModule {}
