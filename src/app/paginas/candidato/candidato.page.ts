import { Component, OnInit, ViewChild } from '@angular/core';
import { AlertController, NavController } from '@ionic/angular';
import { GeneralService } from 'src/app/services/general.service';
import { ChartComponent, ApexAxisChartSeries, ApexChart, ApexXAxis, ApexTitleSubtitle, ApexPlotOptions, ApexNonAxisChartSeries } from "ng-apexcharts";
import { HttpClient } from '@angular/common/http';

export type BarChartOptions = {
  series: ApexAxisChartSeries;
  chart: ApexChart;
  xaxis: ApexXAxis;
  title: ApexTitleSubtitle;
  plotOptions: ApexPlotOptions;
};

export type PieChartOptions = {
  series: ApexNonAxisChartSeries;
  chart: ApexChart;
  labels: string[];
  title: ApexTitleSubtitle;
  colors: string[];  // Añadimos colores en la configuración de PieChartOptions
};

@Component({
  selector: 'app-candidato',
  templateUrl: './candidato.page.html',
  styleUrls: ['./candidato.page.scss'],
  standalone: false,
})
export class CandidatoPage implements OnInit {
  dignidadesGenerales: any[] = [];
  selectedDignidad: string = '';
  metodo: string = '';
  resultados: any[] = [];
  listaActas: any[] = [];
  ganadores: any[] = [];
  ganador : any;

  public barChartOptions!: BarChartOptions;
  public pieChartOptions!: PieChartOptions;

  constructor(
    private alertController: AlertController,
    private navCtrl: NavController,
    private generalService: GeneralService,
    private http: HttpClient
  ) {}

  ngOnInit() {
    this.initializeBarChart();
    this.initializePieChart();
    this.loadDignidadGeneral();

  }

  @ViewChild("chart") chart!: ChartComponent;

  onDignidadChange(event: any) {
    this.selectedDignidad = event.detail.value;
    console.log('Dignidad seleccionada:', this.selectedDignidad);
    
    if (this.selectedDignidad) {
      this.loadResultadosGenerales(this.selectedDignidad);
      this.loadActasProcesadas(this.selectedDignidad);  // Cargar actas cuando se selecciona dignidad
      this.loadResultadoGeneral(this.selectedDignidad); // Cargar los resultados generales con los nuevos datos
      this.loadGanador(this.selectedDignidad); // Cargar el ganador
    }
  }

  doRefresh(event: any) {
    console.log('Comenzando refresco...');
    
    // Recarga los datos necesarios
    this.loadDignidadGeneral();
    if (this.selectedDignidad) {
      this.loadResultadosGenerales(this.selectedDignidad);
      this.loadActasProcesadas(this.selectedDignidad);
      this.loadResultadoGeneral(this.selectedDignidad);
      this.loadGanador(this.selectedDignidad);
    }
  
    // Finaliza el refresco después de 1 segundo
    setTimeout(() => {
      console.log('Refresco completo.');
      event.target.complete();
    }, 1000);
  }
  

  private loadResultadosGenerales(idDignidadProceso: string) {
    if (!this.metodo) {
      console.error("Método no definido.");
      return;
    }

    this.generalService.getResultadosGenerales(idDignidadProceso, this.metodo).subscribe({
      next: (response) => {
        const resultados = response.lista_general;

        const seriesData = resultados.map((item: any) => item.votos);
        const categories = resultados.map((item: any) => item.lista);
        const labels = resultados.map((item: any) => item.partido);
        const colors = resultados.map((item: any) => item.colorPartido);

        this.resultados = resultados;

        this.initializeBarChart(seriesData, categories, colors);
        this.initializePieChart(seriesData, labels, colors);

        console.log('Resultados cargados:', resultados);
      },
      error: (err) => {
        console.error('Error al cargar resultados:', err);
      },
    });
  }

  loadDignidadGeneral() {
    this.generalService.getDignidadesGenerales().subscribe(
      (response) => {
        this.dignidadesGenerales = response.lista_dignidad_general;
        if (this.dignidadesGenerales.length > 0) {
          this.metodo = this.dignidadesGenerales[0].metodo;
        }
      },
      (error) => {
        console.error("Error al cargar las dignidades generales:", error);
      }
    );
  }

  porcentajeEscrutadas: string = '0.00';
  porcentajePorEscrutar: string = '0.00';
  juntasEscrutadas: number = 0;
  juntasPorEscrutar: number = 0;
  totalJuntas: number = 0;
  
  loadActasProcesadas(idDignidadProceso: string) {
    const url = `https://api.ersatech.net/apice/api/listado-resultado-acta?idDignidadProceso=${idDignidadProceso}`;
  
    this.http.get(url).subscribe({
      next: (response: any) => {
        this.listaActas = response.lista_acta;
  
        // Calcular las sumas
        this.juntasEscrutadas = this.listaActas.reduce((sum: number, acta: any) => sum + acta.totalActaIngresado, 0);
        this.juntasPorEscrutar = this.listaActas.reduce((sum: number, acta: any) => sum + acta.totalActaPorIngresar, 0);
        this.totalJuntas = this.listaActas.reduce((sum: number, acta: any) => sum + acta.totalActa, 0);
  
        // Calcular los porcentajes
        this.porcentajeEscrutadas = ((this.juntasEscrutadas / this.totalJuntas) * 100).toFixed(2);
        this.porcentajePorEscrutar = ((this.juntasPorEscrutar / this.totalJuntas) * 100).toFixed(2);
  
        console.log('Juntas escrutadas:', this.juntasEscrutadas);
        console.log('Juntas por escrutar:', this.juntasPorEscrutar);
        console.log('Total juntas:', this.totalJuntas);
      },
      error: (err) => {
        console.error('Error al cargar las actas procesadas:', err);
      },
    });
  }
  
  
  

  private initializeBarChart(seriesData: number[] = [], categories: string[] = [], colors: string[] = []) {
    this.barChartOptions = {
      series: [
        {
          name: "Porcentaje",
          data: seriesData, // Asegúrate de que estos valores estén en porcentaje (ejemplo: [25, 50, 75])
        }
      ],
      chart: {
        type: "bar",
        height: 350,
      },
      plotOptions: {
        bar: {
          horizontal: true,
          barHeight: "50%", // Ajusta la altura de las barras
          distributed: true, // Colores diferentes por barra (si se necesitan)
        },
      },
      xaxis: {
        categories: categories, // Nombres de las categorías
        title: {
          text: "Parroquias",
        },
        labels: {
          formatter: function (val: any) {
            return `${val}%`;
          },
        },
      },
      title: {
        text: "Porcentaje de Actas Procesadas por Parroquia",
        align: "center",
      },
   // Aplica colores personalizados si se pasan
    };
  }

  private initializePieChart(seriesData: number[] = [], labels: string[] = [], colors: string[] = []) {
    if (colors.length !== seriesData.length) {
      console.warn("El número de colores no coincide con el número de datos");
    }

    this.pieChartOptions = {
      series: seriesData,
      chart: {
        type: "pie",        
        height: 400,
        width: 1050,
        toolbar: {
          show: true,
          tools: {
            download: true,
          }
        },
      },
      labels: labels,
      title: {
        text: "Distribución de Votos por Lista",
      },
      colors: colors, 
    };
  }

  selectedSegment: string = "resumen";

  onTabChange(event: any) {
    if (event.detail.value === 'actasProcesadas') {
      this.loadActasProcesadas(this.selectedDignidad);  // Actualizar las actas cuando se selecciona la pestaña
    }
  }


  private loadResultadoGeneral(idDignidadProceso: string) {
    const url = `https://api.ersatech.net/apice/api/listado-resultado-general?idDignidadProceso=${idDignidadProceso}`;
  
    this.http.get(url).subscribe({
      next: (response: any) => {
        const resultadosGenerales = response.lista_general; // Lista de resultados generales
        const votosBlancos = response.votos_blancos;
        const votosNulos = response.votos_nulos;
  
        // Sumar votos aprobados
        const votosAprobados = resultadosGenerales.reduce((total: number, item: any) => total + item.votos, 0);
  
        // Asignar los valores a las variables
        this.totalVotosAprobados = votosAprobados;
        this.totalVotosBlancos = votosBlancos;
        this.totalVotosNulos = votosNulos;
  
        // Mostrar en consola para ver los resultados
        console.log('Votos Aprobados:', this.totalVotosAprobados);
        console.log('Votos Blancos:', this.totalVotosBlancos);
        console.log('Votos Nulos:', this.totalVotosNulos);
      },
      error: (err) => {
        console.error('Error al cargar resultados generales:', err);
      },
    });
  }
  
  // Definir las variables para los votos
  totalVotosAprobados: number = 0;
  totalVotosBlancos: number = 0;
  totalVotosNulos: number = 0;


  private loadGanador(idDignidadProceso: string) {
    if (!this.metodo) {
      console.error("Método no definido.");
      return;
    }
  
    this.generalService.getGanador(idDignidadProceso, this.metodo).subscribe({
      next: (response) => {
        this.ganador = response.lista_ganador; // Almacena toda la lista de ganadores
        console.log('Ganadores:', this.ganador); // Verifica todos los datos en consola
      },
      error: (err) => {
        console.error('Error al obtener los ganadores:', err);
      },
    });
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