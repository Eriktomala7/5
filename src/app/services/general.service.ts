import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { VotoData, ActaVoto } from 'src/app/interface/interface';



@Injectable({
  providedIn: 'root',
})
export class GeneralService {
  private apiUrl = 'http://181.39.35.73:8080/api/'; // URL de la API
  private apilogin = 'http://181.39.35.73:8080/api/login'; // URL de login

  constructor(private http: HttpClient) {}

  // Obtener dignidades de una persona
  getDignidades(idPersona: string): Observable<any> {
    return this.http.get<any>(`${this.apiUrl}listado-dignidad`, {
      params: { idPersona },
    });
  }

  // Obtener recinto en base a la ID de persona
  getRecinto(idPersona: string): Observable<any> {
    return this.http.get<any>(`${this.apiUrl}listado-dignidad`, {
      params: { idPersona },
    });
  }

  postLogin(user: string, clave: string): Observable<any> {
    const params = new HttpParams()
      .set('user', user)
      .set('clave', clave);

    console.log('Parámetros enviados:', params.toString());

    return this.http.post<any>(this.apilogin, null, { params });
  }

    // Nuevo método para obtener la lista de juntas
    getJuntas(idPersona: string, idDignidadProceso: string): Observable<any> {
      const url = `${this.apiUrl}listado-junta?idPersona=${idPersona}&idDignidadProceso=${idDignidadProceso}`;
      return this.http.get<any>(url);
    }

    getCandidatos(idDignidadProceso: string): Observable<any> {
      const url = `${this.apiUrl}listado-candidato?idDignidadProceso=${idDignidadProceso}`;
      
      return this.http.get<any>(url);
    }
    postVoto(voto: VotoData): Observable<any> { // VotoData: interface.ts
      const url = `${this.apiUrl}grabar-voto`;
      const headers = new HttpHeaders({
        'Content-Type': 'application/json'
      });
      return this.http.post<any>(url, voto, { headers });
    }

    getResultadosGenerales(idDignidadProceso: string, metodo: string): Observable<any> {
      const url = `${this.apiUrl}listado-resultado-general`;
      const params = { idDignidadProceso, metodo };
      return this.http.get<any>(url, { params });
    }

      // Nuevo método utilizando el endpoint listado-dignidad-general
      getDignidadesGenerales(): Observable<any> {
        const url = `${this.apiUrl}listado-dignidad-general`;
        return this.http.get<any>(url);
      }

      getResultadosActas(idDignidadProceso: string): Observable<any> {
        const url = `${this.apiUrl}listado-resultado-acta`;
        const params = { idDignidadProceso };
        return this.http.get<any>(url, { params });
      }

      getGanador(idDignidadProceso: string, metodo: string): Observable<any> {
        const url = `http://181.39.35.73:8080/api/listado-resultado-ganador?idDignidadProceso=${idDignidadProceso}&metodo=${metodo}`;
        return this.http.get<any>(url);
      }

      ActaResultado(idDignidadProceso: string): Observable<any> {
        const url = `${this.apiUrl}listado-resultado-acta`;
        const params = { idDignidadProceso };
        return this.http.get<any>(url, { params });
      }
      
}
