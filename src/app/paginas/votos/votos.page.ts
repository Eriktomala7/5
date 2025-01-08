import { Component, OnInit } from '@angular/core';
import { AlertController, NavController } from '@ionic/angular';
import { ActaVoto, VotoData } from 'src/app/interface/interface';
import { GeneralService } from 'src/app/services/general.service';

interface Candidato {
  idCandidato: number;
  nombreCandidato: string;
  lista: string;
  votos?: number; // Propiedad para almacenar los votos, opcional
  idPartido: string; // Asegurando que cada candidato tiene su idPartido
}

@Component({
    selector: 'app-votos',
    templateUrl: './votos.page.html',
    styleUrls: ['./votos.page.scss'],
    standalone: false
})
export class VotosPage implements OnInit {
  loggedUserName: string = '';
  dignidadElegida: string = '';
  juntaElegida: string = '';
  recinto: string = '';
  idDignidadProceso: string = '';
  votosblancos: number = 0;
  votosnulos: number = 0;
  votantes: number = 0;
  candidatos: Candidato[] = [];
  candidatosAgrupados: { [lista: string]: Candidato[] } = {};
  tieneListasAgrupadas: boolean = false;
  junta: any;
  listasVotos: { [key: string]: number } = {};
  idPartido: string = '';

  constructor(
    private alertController: AlertController,
    private navCtrl: NavController,
    private generalService: GeneralService
  ) {}

  ngOnInit() {
    const state = history.state;
    this.loggedUserName = sessionStorage.getItem('persona') || '';
    this.dignidadElegida = state.dignidad || 'No seleccionada';
    this.juntaElegida = state.junta?.nombreJunta || 'No seleccionada';
    this.recinto = state.recinto || 'Recinto no disponible';
    this.idDignidadProceso = state.idDignidadProceso || localStorage.getItem('idDignidadProceso') || '';
    this.votantes = state.votantes || 0;
    this.junta = state.junta || null;
    this.idPartido = state.idPartido || '';

    // Guardar el idPartido en sessionStorage
    if (this.idPartido) {
      sessionStorage.setItem('idPartido', this.idPartido);
    }

    if (this.idDignidadProceso) {
      this.obtenerCandidatos();
    } else {
      console.warn('No se recibió un ID de Dignidad válido.');
    }
  }

  obtenerCandidatos() {
    this.generalService.getCandidatos(this.idDignidadProceso).subscribe(
      (response) => {
        if (response && response.lista_candidato) {
          this.candidatos = response.lista_candidato;
          this.agruparCandidatosPorLista();
        }
      },
      (error) => {
        console.error('Error al cargar los candidatos:', error);
        this.mostrarAlertaError('Error al cargar los candidatos.');
      }
    );
  }

  agruparCandidatosPorLista() {
    this.candidatosAgrupados = {};
    this.candidatos.forEach((candidato) => {
      if (!this.candidatosAgrupados[candidato.lista]) {
        this.candidatosAgrupados[candidato.lista] = [];
      }
      this.candidatosAgrupados[candidato.lista].push(candidato);
    });
    this.tieneListasAgrupadas = Object.keys(this.candidatosAgrupados).length > 0;
  }

  distribuirVotos(lista: string, votos: number) {
    if (votos < 0) {
      this.mostrarAlertaError("No se pueden ingresar votos negativos");
      return;
    }
    const candidatosDeLista = this.candidatosAgrupados[lista];
    if (candidatosDeLista) {
      const votosPorCandidato = Math.floor(votos / candidatosDeLista.length);
      const votosRestantes = votos % candidatosDeLista.length;

      candidatosDeLista.forEach((candidato, index) => {
        candidato.votos = votosPorCandidato + (index < votosRestantes ? 1 : 0);
      });
    }
  }

 async enviarVotos() {
    const actaVotos: ActaVoto[] = [];
  
    for (const lista in this.candidatosAgrupados) {
      this.candidatosAgrupados[lista].forEach(candidato => {
        // Agregar el idPartido y los votos del candidato en el objeto actaVotos
        actaVotos.push({
          idCandidato: candidato.idCandidato,
          votos: candidato.votos || 0,
          idPartido: candidato.idPartido // Enviar el idPartido del candidato
        });
      });
    }
  
    const votosData: VotoData = {
      idDignidadProceso: this.idDignidadProceso,
      idJunta: this.junta?.idJunta,
      votantes: this.votantes,
      votosBlancos: this.votosblancos,
      votosNulos: this.votosnulos,
      digitador: sessionStorage.getItem('usuario') || '',
      actaVotos: actaVotos
     
    };
  
    // Mostrar los datos que se enviarán al backend antes de enviarlos
  
  
    try {
      // Llamada a la API para enviar los votos y el idPartido
       //const response = await this.generalService.postVoto(votosData).toPromise();
       console.log("Datos que se enviarán al backend:", votosData);
  
      this.mostrarAlertaExito('Votos guardados exitosamente');
      this.navCtrl.navigateBack('/dignidades');
    } catch (error: any) {
      console.error('Error al guardar los votos:', error);
      if (error.error && error.error.message) {
        this.mostrarAlertaError(error.error.message);
      } else {
        this.mostrarAlertaError('Error al guardar los votos. Por favor, intente nuevamente.');
      }
    }
  }
  // Confirmación antes de grabar los votos
  async confirmarGrabarVotos() {
    const alert = await this.alertController.create({
      header: 'Confirmar',
      message: '¿Está seguro de que desea grabar los votos?',
      buttons: [
        {
          text: 'Cancelar',
          role: 'cancel',
        },
        {
          text: 'Grabar',
          handler: () => {
            this.enviarVotos(); // Si el usuario confirma, se envían los votos
          },
        },
      ],
    });

    await alert.present();
  }

  async mostrarAlertaError(message: string) {
    const alert = await this.alertController.create({
      header: 'Error',
      message: message,
      buttons: ['OK'],
    });
    await alert.present();
  }

  async mostrarAlertaExito(message: string) {
    const alert = await this.alertController.create({
      header: 'Éxito',
      message: message,
      buttons: ['OK'],
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
