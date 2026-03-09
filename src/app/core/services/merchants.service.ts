import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';

export interface Comerciante {
  comercianteId: number;
  nombreRazonSocial: string;
  municipioId: number;
  municipio: string;
  estadoId: number;
  estado: string;
  numeroIdentificacion?: string;
  correoElectronico?: string;
  cantidadEstablecimientos?: number;
  fechaRegistro?: string;
}

export interface ComerciantesResponse {
  success: boolean;
  data: Comerciante[];
  totalRecords: number;
}

@Injectable({
  providedIn: 'root'
})
export class MerchantsService {
  private apiUrl = 'http://localhost:8080/api';

  constructor(private http: HttpClient) {}

  getComerciantes(): Observable<ComerciantesResponse> {
  return this.http.get<ComerciantesResponse>(`${this.apiUrl}/Comerciantes`);
}

getComerciantesR(): Observable<any> {
  return this.http.get<any>(`${this.apiUrl}/Reporte/comerciantes`);
}

deleteComerciante(id: number): Observable<any> {
  return this.http.delete(`${this.apiUrl}/Comerciantes/${id}`);
}

toggleEstado(id: number, estado: string): Observable<any> {
  return this.http.patch(`${this.apiUrl}/Comerciantes/${id}/estado`, { estado });
}

descargarCSV(): Observable<Blob> {
  return this.http.get(`${this.apiUrl}/Reporte/comerciantes/csv`, {
    responseType: 'blob'
  });
}


}