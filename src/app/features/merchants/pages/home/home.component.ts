import { Component, inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Store } from '@ngrx/store';
import { MatTableModule } from '@angular/material/table';
import { MatPaginatorModule, PageEvent } from '@angular/material/paginator';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatSelectModule } from '@angular/material/select';
import { MatChipsModule } from '@angular/material/chips';
import { MatTooltipModule } from '@angular/material/tooltip';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MerchantsService, Comerciante } from '../../../../core/services/merchants.service';
import { selectUser } from '../../../../store/auth/auth.selectors';
import { logout } from '../../../../store/auth/auth.actions';
import { RouterModule } from '@angular/router';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [
    CommonModule,
    RouterModule, 
    MatTableModule,
    MatPaginatorModule,
    MatButtonModule,
    MatIconModule,
    MatSelectModule,
    MatChipsModule,
    MatTooltipModule,
    MatProgressSpinnerModule
  ],
  templateUrl: './home.component.html',
  styleUrl: './home.component.scss'
})
export class HomeComponent implements OnInit {
  private store = inject(Store);
  private merchantsService = inject(MerchantsService);

  user$ = this.store.select(selectUser);

  comerciantes: Comerciante[] = [];
  comerciantesPaginados: Comerciante[] = [];
  loading = true;
  error = '';

  pageSize = 5;
  pageIndex = 0;
  pageSizeOptions = [5, 10, 15];

displayedColumns: string[] = [
  'nombreRazonSocial',
  'telefono',
  'correoElectronico',
  'fechaRegistro',
  'cantidadEstablecimientos',
  'estado',
  'acciones'
];

  ngOnInit(): void {
    this.cargarComerciantes();
  }

 cargarComerciantes(): void {
  this.loading = true;
  this.merchantsService.getComerciantesR().subscribe({
    next: (response: any) => {
      this.comerciantes = response.data || [];
      this.pageIndex = 0;
      this.comerciantesPaginados = [...this.comerciantes].slice(0, this.pageSize);
      this.loading = false;
    },
    error: () => {
      this.error = 'Error al cargar los comerciantes';
      this.loading = false;
    }
  });
}


  actualizarPaginacion(): void {
    const inicio = this.pageIndex * this.pageSize;
    const fin = inicio + this.pageSize;
    this.comerciantesPaginados = this.comerciantes.slice(inicio, fin);
  }

  onPageChange(event: PageEvent): void {
    this.pageSize = event.pageSize;
    this.pageIndex = event.pageIndex;
    this.actualizarPaginacion();
  }

  eliminar(id: number): void {
  if (confirm('¿Estás seguro de eliminar este comerciante?')) {
    this.merchantsService.deleteComerciante(id).subscribe({
      next: () => this.cargarComerciantes()
    });
  }
}

toggleEstado(comerciante: Comerciante): void {
  const nuevoEstado = comerciante.estadoId === 1 ? 'Inactivo' : 'Activo';
  this.merchantsService.toggleEstado(comerciante.comercianteId, nuevoEstado).subscribe({
    next: () => this.cargarComerciantes()
  });
}


  descargarCSV(): void {
    this.merchantsService.descargarCSV().subscribe({
      next: (blob) => {
        const url = window.URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = 'comerciantes.csv';
        a.click();
        window.URL.revokeObjectURL(url);
      }
    });
  }

  logout(): void {
    this.store.dispatch(logout());
  }

descargarIndividual(id: number): void {
  this.merchantsService.descargarCSV().subscribe({
    next: (blob) => {
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `comerciante-${id}.csv`;
      a.click();
      window.URL.revokeObjectURL(url);
    }
  });
}


}