import { Component, OnInit } from '@angular/core';
import { AlertController, NavController } from '@ionic/angular';
import { Dignidad } from 'src/app/interface/interface';
import { GeneralService } from 'src/app/services/general.service';

@Component({
    selector: 'app-dignidades',
    templateUrl: './dignidades.page.html',
    styleUrls: ['./dignidades.page.scss'],
    standalone: false
})
export class DignidadesPage implements OnInit {
  loggedUserId: string = ''; 
  loggedUserName: string = ''; 
  recinto: string = ''; 
  dignidadesDisponibles: Dignidad[] = []; 

  constructor(
    private alertController: AlertController,
    private navCtrl: NavController,
    private generalService: GeneralService
  ) {}

  ngOnInit() {
    this.loadUserDetails();
  }

  loadUserDetails() {
    // Obtener el ID del usuario logueado desde sessionStorage
    this.loggedUserId = sessionStorage.getItem('userId') || '';
    this.loggedUserName = sessionStorage.getItem('persona') || '';
    
    // Cargar las dignidades disponibles usando la ID del usuario logueado
    this.generalService.getDignidades(this.loggedUserId).subscribe(
      (response) => {
        if (response && response.lista_dignidad) {
          // Asignar los datos de dignidades
          this.dignidadesDisponibles = response.lista_dignidad;

          // Obtener el recinto y mostrarlo en consola
          if (this.dignidadesDisponibles.length > 0) {
            this.recinto = this.dignidadesDisponibles[0].recinto; 
            console.log('Recinto:', this.recinto);

            // Mostrar los ID de dignidad y nombre en consola
            this.dignidadesDisponibles.forEach(dignidad => {
              console.log('ID Dignidad Proceso:', dignidad.idDignidadProceso);
              console.log('Nombre Dignidad:', dignidad.nombreDignidad);
            });
          }
        } else {
          console.log('No se encontraron dignidades disponibles.');
        }
      },
      (error) => {
        console.error('Error al cargar las dignidades:', error);
      }
    );
  }

  async confirmSelection(dignidad: Dignidad) { 
    const alert = await this.alertController.create({
      header: 'Confirmación',
      message: `¿Está seguro de elegir la dignidad de ${dignidad.nombreDignidad}?`,
      buttons: [
        {
          text: 'Cancelar',
          role: 'cancel',
        },
        {
          text: 'Confirmar',
          handler: () => {
            // Guardar el idDignidadProceso en localStorage
            localStorage.setItem('idDignidadProceso', dignidad.idDignidadProceso);
  
            // Mostrar los datos en consola antes de navegar
            console.log('Datos a enviar:', {
              dignidad: dignidad.nombreDignidad,
              idDignidadProceso: dignidad.idDignidadProceso,
              loggedUser: this.loggedUserName
            });
  
            // Realizar la navegación
            this.navCtrl.navigateForward('/juntas', {
              state: { 
                dignidad: dignidad.nombreDignidad,
                idDignidadProceso: dignidad.idDignidadProceso, 
                loggedUser: this.loggedUserName 
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
