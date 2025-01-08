import { Component } from '@angular/core';
import { NavController } from '@ionic/angular';
import { AlertService } from 'src/app/services/alertas.service';
import { GeneralService } from 'src/app/services/general.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.page.html',
  styleUrls: ['./login.page.scss'],
})
export class LoginPage {
  username: string = '';
  password: string = '';
  errorMessage: string = '';

  constructor(
    private alertService: AlertService,
    private navCtrl: NavController,
    private generalService: GeneralService 
  ) {}

  login() {
    if (!this.username || !this.password) {
      this.errorMessage = 'Por favor, ingresa todos los campos.';
      this.alertService.presentAlert('Error', this.errorMessage);
      return;
    }

    this.generalService.postLogin(this.username, this.password).subscribe(
      (response) => {
        if (response && response.idPersona && response.persona && response.usuario) {
          this.errorMessage = '';

          // Guardar datos temporalmente en sessionStorage
          sessionStorage.setItem('userId', response.idPersona);  
          sessionStorage.setItem('persona', response.persona);   
          sessionStorage.setItem('usuario', response.usuario);  +
          sessionStorage.setItem('visualizador', response.visualizador);  

          // Mostrar datos en consola
          console.log('Datos guardados temporalmente:');
          console.log('ID Persona:', response.idPersona);
          console.log('Nombre Persona:', response.persona);
          console.log('Usuario:', response.usuario);
          console.log('Visualizador:', response.visualizador);

          this.alertService.presentAlert('Bienvenido',` Hola ${response.persona}.`);
          
          // Redirigir según el valor del visualizador
          this.verificarVisualizador(response.visualizador, response.idPersona);
        } else {
          this.errorMessage = 'Usuario o contraseña incorrectos.';
          this.alertService.presentAlert('Error', this.errorMessage);
        }
      },
      (error) => {
        this.errorMessage = 'Hubo un error en la autenticación. Intenta de nuevo.';
        this.alertService.presentAlert('Error', this.errorMessage);
        console.error('Error de login:', error);
      }
    );
  }

  verificarVisualizador(visualizador: string, userId: string) {
    if (visualizador === 'N') {
      this.navCtrl.navigateForward('/dignidades', {
        state: { userId },
      });
    } else if (visualizador === 'S') {
      this.navCtrl.navigateForward('/candidato', {
        state: { userId },
      });
    } else {
      this.alertService.presentAlert('Error', 'Visualizador no válido.');
      console.error('Visualizador no válido:', visualizador);
    }
  }
}