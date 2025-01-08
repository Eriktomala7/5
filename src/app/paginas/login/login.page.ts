import { Component } from '@angular/core';
import { NavController } from '@ionic/angular';
import { AlertService } from 'src/app/services/alertas.service';
import { GeneralService } from 'src/app/services/general.service';
import { LoadingController } from '@ionic/angular';

@Component({
  selector: 'app-login',
  templateUrl: './login.page.html',
  styleUrls: ['./login.page.scss'],
  standalone: false
})
export class LoginPage {
  username: string = '';
  password: string = '';
  errorMessage: string = '';

  constructor(
    private alertService: AlertService,
    private navCtrl: NavController,
    private generalService: GeneralService,
    private loadingController: LoadingController
  ) {}

  async login() {
    if (!this.username || !this.password) {
      this.errorMessage = 'Por favor, ingresa todos los campos.';
      this.alertService.presentAlert('Error', this.errorMessage);
      return;
    }

    // Mostrar el LoadingController
    const loading = await this.loadingController.create({
      message: 'Iniciando sesión...',
      spinner: 'crescent',
    });
    await loading.present();

    this.generalService.postLogin(this.username, this.password).subscribe(
      async (response) => {
        await loading.dismiss(); // Ocultar el LoadingController al completar la autenticación

        if (response && response.idPersona && response.persona && response.usuario) {
          this.errorMessage = '';

          // Guardar datos temporalmente en sessionStorage
          sessionStorage.setItem('userId', response.idPersona);  
          sessionStorage.setItem('persona', response.persona);   
          sessionStorage.setItem('usuario', response.usuario);  
          sessionStorage.setItem('visualizador', response.visualizador);  

          console.log('Datos guardados temporalmente:');
          console.log('ID Persona:', response.idPersona);
          console.log('Nombre Persona:', response.persona);
          console.log('Usuario:', response.usuario);
          console.log('Visualizador:', response.visualizador);

          this.alertService.presentAlert('Bienvenido', `Hola ${response.persona}.`);
          this.verificarVisualizador(response.visualizador, response.idPersona);
        } else {
          this.errorMessage = 'Usuario o contraseña incorrectos.';
          this.alertService.presentAlert('Error', this.errorMessage);
        }
      },
      async (error) => {
        await loading.dismiss(); // Ocultar el LoadingController si ocurre un error

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
