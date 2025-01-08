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
  colors: string[];  
};

@Component({
  selector: 'app-candidato',
  templateUrl: './candidato.page.html',
  styleUrls: ['./candidato.page.scss'],
})
export class CandidatoPage implements OnInit {
  dignidadesGenerales: any[] = [];
  selectedDignidad: string = '';
  metodo: string = '';
  resultados: any[] = [];
  listaActas: any[] = [];
  ganador : any;
  totalJuntas: number = 0;


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
      this.loadActasProcesadas(this.selectedDignidad);  
      this.loadResultadoGeneral(this.selectedDignidad); 
      this.loadGanador(this.selectedDignidad); 
    }
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

  loadActasProcesadas(idDignidadProceso: string) {
    const url = `http://181.39.35.73:8080/api/listado-resultado-acta?idDignidadProceso=${idDignidadProceso}`;
  
    this.http.get(url).subscribe({
      next: (response: any) => {
        console.log('Respuesta de la API:', response); 
  
        this.listaActas = response.lista_acta;
  
        const totalActas = response.totalActas || 0; 
        const totalActasIngresadas = response.totalActasIngresadas || 0;
  
        console.log('Total de Actas:', totalActas); 
        console.log('Total de Actas Ingresadas:', totalActasIngresadas);
  
        // Calcula las juntas escrutadas y por escrutar
        this.totalJuntas = totalActas;
     
  
     
  
        const seriesData = this.listaActas.map((acta: any) => acta.porcentaje);
        const categories = this.listaActas.map((acta: any) => acta.parroquia);
        const colors = this.listaActas.map((acta: any) => acta.color);
  
        this.initializeBarChart(seriesData, categories, colors);
      },
      error: (err) => {
        console.error("Error al cargar las actas procesadas:", err);
      }
    });
  }
  private initializeBarChart(seriesData: number[] = [], categories: string[] = [], colors: string[] = []) {
    this.barChartOptions = {
      series: [
        {
          name: "Porcentaje",
          data: seriesData, 
        }
      ],
      chart: {
        type: "bar",
        height: 350,
      },
      plotOptions: {
        bar: {
          horizontal: true,
          barHeight: "50%", 
          distributed: true,
        },
      },
      xaxis: {
        categories: categories,
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
        width: 950,
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
      this.loadActasProcesadas(this.selectedDignidad);
    }
  }


  private loadResultadoGeneral(idDignidadProceso: string) {
    const url = `http://181.39.35.73:8080/api/listado-resultado-general?idDignidadProceso=${idDignidadProceso}`;
  
    this.http.get(url).subscribe({
      next: (response: any) => {
        const resultadosGenerales = response.lista_general; 
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
        this.ganador = response.lista_ganador; 
        console.log('Ganadores:', this.ganador); 
      },
      error: (err) => {
        console.error('Error al obtener los ganadores:', err);
      },
    });
  
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
  

    setTimeout(() => {
      console.log('Refresco completo.');
      event.target.complete();
    }, 1000);
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