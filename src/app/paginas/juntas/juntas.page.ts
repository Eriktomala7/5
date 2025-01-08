import { Component, OnInit } from '@angular/core';
import { AlertController, NavController } from '@ionic/angular';
import { GeneralService } from 'src/app/services/general.service';

@Component({
    selector: 'app-juntas',
    templateUrl: './juntas.page.html',
    styleUrls: ['./juntas.page.scss'],
    standalone: false
})
export class JuntasPage implements OnInit {

  loggedUser: string = ''; 
  loggedUserName: string = ''; 

  recinto: string = ''; 
  dignidadElegida: string = ''; 
  idDignidadProceso: string = '';
  juntas: any[] = []; 
 
  constructor(
    private alertController: AlertController,
    private navCtrl: NavController,
    private generalService: GeneralService 
  ) {}

  ngOnInit() {
    this.loggedUserName = sessionStorage.getItem('persona') || '';
    const state = history.state;
    this.dignidadElegida = state.dignidad || 'No seleccionada';
    this.idDignidadProceso = state.idDignidadProceso || '';
    console.log('ID de Dignidad Proceso:', this.idDignidadProceso);
  
    const loggedUserId = sessionStorage.getItem('userId') || '';
  
    if (loggedUserId && this.idDignidadProceso) {
      this.generalService.getJuntas(loggedUserId, this.idDignidadProceso).subscribe(
        (response) => {
          if (response && response.lista_junta) {
            this.juntas = response.lista_junta;
            this.recinto = this.juntas[0]?.recinto || '';
            console.log('Juntas obtenidas:', this.juntas);
            console.log('Recinto:', this.recinto);
          }
        },
        (error) => {
          console.error('Error al cargar las juntas:', error);
        }
      );
    }
  }
  
  async confirmSelection(junta: any) {
    const votantes = junta.cantidadVotantes || junta.votantes || 0; 
    const alert = await this.alertController.create({
      header: 'Confirmación',
      message: `¿Está seguro de seleccionar ${junta.nombreJunta} - con ${votantes} votantes?`,
      buttons: [
        {
          text: 'Cancelar',
          role: 'cancel',
        },
        {
          text: 'Confirmar',
          handler: () => {
            console.log('Número de votantes:', votantes);
            this.navCtrl.navigateForward('/votos', {
              state: {
                junta,
                loggedUser: this.loggedUserName,
                dignidad: this.dignidadElegida,
                votantes,  
                idDignidadProceso: this.idDignidadProceso,
                recinto: this.recinto
              },
            });
          },
        },
      ],
    });
  
    await alert.present();
  }
  async confirmLogout() {
    const alert = await this.alertController.create({
      header: 'Cerrar Sesión',
      message: '¿Está seguro de cerrar sesión?',
      buttons: [
        {
          text: 'Cancelar',
          role: 'cancel',
        },
        {
          text: 'Cerrar Sesión',
          handler: () => {
            this.navCtrl.navigateBack('/login');
          },
        },
      ],
    });

    await alert.present();
  }
}
