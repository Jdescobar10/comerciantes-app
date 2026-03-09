import { Component, inject, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, RouterModule, NavigationEnd } from '@angular/router';
import { Store } from '@ngrx/store';
import { filter, Subscription } from 'rxjs';
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
export class HomeComponent implements OnInit, OnDestroy {
  private store = inject(Store);
  private merchantsService = inject(MerchantsService);
  private router = inject(Router);

  private routerSub!: Subscription;

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

    this.routerSub = this.router.events.pipe(
      filter(event => event instanceof NavigationEnd),
      filter((event: any) => event.urlAfterRedirects === '/merchants')
    ).subscribe(() => {
      this.cargarComerciantes();
    });
  }

  ngOnDestroy(): void {
    this.routerSub?.unsubscribe();
  }

 cargarComerciantes(): void {
  this.loading = true;
  this.merchantsService.getComerciantesConReporte().subscribe({
    next: (response: any) => {
      console.log('🟢 Respuesta:', response);
      this.comerciantes = response.data || [];
      this.pageIndex = 0;
      this.comerciantesPaginados = [...this.comerciantes].slice(0, this.pageSize);
      this.loading = false;
    },
    error: (err) => {
      console.log('🔴 Error completo:', err);
      console.log('🔴 Status:', err?.status);
      console.log('🔴 Message:', err?.message);
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
  this.merchantsService.toggleEstado(comerciante.comercianteId, comerciante.estadoId).subscribe({
    next: () => this.cargarComerciantes(),
    error: (err) => console.log('🔴 Error toggleEstado:', err)
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

  logout(): void {
    this.store.dispatch(logout());
  }
}