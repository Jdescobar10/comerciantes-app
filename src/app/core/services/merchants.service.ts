import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { forkJoin, map, catchError, of } from 'rxjs';

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

getComerciantes(pageSize: number = 100): Observable<ComerciantesResponse> {
  return this.http.get<ComerciantesResponse>(
    `${this.apiUrl}/Comerciantes?pageSize=${pageSize}`
  );
}

getComerciantesR(): Observable<any> {
  return this.http.get<any>(`${this.apiUrl}/Reporte/comerciantes`);
}

deleteComerciante(id: number): Observable<any> {
  return this.http.delete(`${this.apiUrl}/Comerciantes/${id}`);
}

toggleEstado(id: number, estadoActual: number): Observable<any> {
  const nuevoEstadoId = estadoActual === 1 ? 2 : 1;
  return this.http.patch(`${this.apiUrl}/Comerciantes/${id}/estado`, { 
    estadoId: nuevoEstadoId 
  });
}

descargarCSV(): Observable<Blob> {
  return this.http.get(`${this.apiUrl}/Reporte/comerciantes/csv`, {
    responseType: 'blob'
  });
}

getMunicipios(): Observable<any> {
  return this.http.get<any>(`${this.apiUrl}/Municipios`);
}

getComercianteById(id: number): Observable<any> {
  return this.http.get<any>(`${this.apiUrl}/Comerciantes/${id}`);
}

createComerciante(data: any): Observable<any> {
  return this.http.post<any>(`${this.apiUrl}/Comerciantes`, data);
}

updateComerciante(id: number, data: any): Observable<any> {
  return this.http.put<any>(`${this.apiUrl}/Comerciantes/${id}`, data);
}

getReporteComerciantes(): Observable<any> {
  return this.http.get<any>(`${this.apiUrl}/reporte/comerciantes`);
}


getComerciantesConReporte(): Observable<any> {
  return forkJoin({
    comerciantes: this.getComerciantes(),
    reporte: this.getReporteComerciantes().pipe(
      catchError(() => of({ data: [] }))
    )
  }).pipe(
    map(({ comerciantes, reporte }) => {
      console.log('🟡 comerciantes raw:', comerciantes);
      console.log('🟡 reporte raw:', reporte);

      const listaComerciantes: any[] = 
  (comerciantes as any)?.data?.items ||
  (comerciantes as any)?.data ||
  (Array.isArray(comerciantes) ? comerciantes : []);

      const reporteMap = new Map<string, any>();
      (reporte.data || []).forEach((r: any) => {
        reporteMap.set(r.nombreRazonSocial, r);
      });

      const merged = listaComerciantes.map((c: any) => {
        const rep = reporteMap.get(c.nombreRazonSocial);
        return {
          ...c,
          cantidadEstablecimientos: rep?.cantidadEstablecimientos ?? 0,
          totalIngresos: rep?.totalIngresos ?? 0,
          cantidadEmpleados: rep?.cantidadEmpleados ?? 0
        };
      });

      return { data: merged };
    })
  );
}



}