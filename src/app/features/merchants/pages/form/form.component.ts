import { Component, inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import {
  ReactiveFormsModule,
  FormBuilder,
  FormGroup,
  Validators,
  AbstractControl
} from '@angular/forms';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatSelectModule } from '@angular/material/select';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatTooltipModule } from '@angular/material/tooltip';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatNativeDateModule } from '@angular/material/core';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatSnackBarModule, MatSnackBar } from '@angular/material/snack-bar';
import { Store } from '@ngrx/store';
import { selectUser } from '../../../../store/auth/auth.selectors';
import { logout } from '../../../../store/auth/auth.actions';
import { MerchantsService } from '../../../../core/services/merchants.service';

// Validador personalizado: fecha no puede ser futura
function noFuturaValidator(control: AbstractControl) {
  if (!control.value) return null;
  const fecha = new Date(control.value);
  const hoy = new Date();
  hoy.setHours(23, 59, 59, 999);
  return fecha > hoy ? { fechaFutura: true } : null;
}

@Component({
  selector: 'app-form',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    RouterModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
    MatIconModule,
    MatSelectModule,
    MatProgressSpinnerModule,
    MatTooltipModule,
    MatDatepickerModule,
    MatNativeDateModule,
    MatCheckboxModule,
    MatSnackBarModule
  ],
  templateUrl: './form.component.html',
  styleUrl: './form.component.scss'
})
export class FormComponent implements OnInit {
  private fb = inject(FormBuilder);
  private store = inject(Store);
  private router = inject(Router);
  private route = inject(ActivatedRoute);
  private merchantsService = inject(MerchantsService);
  private snackBar = inject(MatSnackBar);

  user$ = this.store.select(selectUser);

  isEditMode = false;
  comercianteId: number | null = null;
  loading = false;
  saving = false;
  error = '';
  municipios: any[] = [];
  maxDate = new Date();

  // Footer — solo en modo edición
  totalIngresos: number = 0;
  cantidadEmpleados: number = 0;

  estados = [
    { id: 1, nombre: 'Activo' },
    { id: 2, nombre: 'Inactivo' }
  ];

  comercianteForm: FormGroup = this.fb.group({
    nombreRazonSocial: ['', [Validators.required, Validators.minLength(3), Validators.maxLength(255)]],
    correoElectronico: ['', [Validators.email, Validators.maxLength(150)]],
    telefono: ['', [Validators.maxLength(20)]],
    municipioId: ['', [Validators.required]],
    estadoId: [1, [Validators.required]],
    fechaRegistro: [new Date(), [Validators.required, noFuturaValidator]],
    poseeEstablecimientos: [false]
  });

  ngOnInit(): void {
    this.cargarMunicipios();
    const id = this.route.snapshot.paramMap.get('id');
    if (id) {
      this.isEditMode = true;
      this.comercianteId = +id;
      this.cargarComerciante(this.comercianteId);
      this.cargarDatosReporte(this.comercianteId);
    }
  }

  cargarMunicipios(): void {
    this.merchantsService.getMunicipios().subscribe({
      next: (response: any) => {
        this.municipios = response.data || response || [];
      },
      error: () => {
        this.mostrarSnackbar('Error al cargar los municipios', 'error');
      }
    });
  }

  cargarComerciante(id: number): void {
    this.loading = true;
    this.merchantsService.getComercianteById(id).subscribe({
      next: (response: any) => {
        const c = response.data || response;
        this.comercianteForm.patchValue({
          nombreRazonSocial: c.nombreRazonSocial,
          correoElectronico: c.correoElectronico || '',
          telefono: c.telefono || '',
          municipioId: c.municipioId,
          estadoId: c.estadoId,
          fechaRegistro: c.fechaRegistro ? new Date(c.fechaRegistro) : new Date(),
          poseeEstablecimientos: c.poseeEstablecimientos || false
        });
        this.loading = false;
      },
      error: () => {
        this.error = 'Error al cargar el comerciante';
        this.loading = false;
      }
    });
  }

  cargarDatosReporte(id: number): void {
  // Primero obtenemos el comerciante para tener su nombre
  this.merchantsService.getComercianteById(id).subscribe({
    next: (comercianteResp: any) => {
      const nombre = comercianteResp?.data?.nombreRazonSocial;
      if (!nombre) return;

      this.merchantsService.getReporteComerciantes().subscribe({
        next: (response: any) => {
          const lista = response.data || [];
          const comerciante = lista.find(
            (c: any) => c.nombreRazonSocial === nombre
          );
          if (comerciante) {
            this.totalIngresos = comerciante.totalIngresos || 0;
            this.cantidadEmpleados = comerciante.cantidadEmpleados || 0;
          }
        },
        error: () => {
          console.warn('No se pudieron cargar datos del reporte para el footer');
        }
      });
    },
    error: () => {
      console.warn('No se pudo obtener el nombre del comerciante para el reporte');
    }
  });
}


onSubmit(): void {
  
  
  if (this.comercianteForm.invalid) {
    
    this.comercianteForm.markAllAsTouched();
    return;
  }

  this.saving = true;
  this.error = '';

  const formValue = this.comercianteForm.value;
  const data = {
    nombreRazonSocial: formValue.nombreRazonSocial,
    correoElectronico: formValue.correoElectronico || null,
    telefono: formValue.telefono || null,
    municipioId: formValue.municipioId,
    estadoId: formValue.estadoId,
    fechaRegistro: formValue.fechaRegistro instanceof Date
      ? formValue.fechaRegistro.toISOString().split('T')[0]
      : formValue.fechaRegistro,
    poseeEstablecimientos: formValue.poseeEstablecimientos
  };


  const request = this.isEditMode
    ? this.merchantsService.updateComerciante(this.comercianteId!, data)
    : this.merchantsService.createComerciante(data);

  request.subscribe({
    next: (response) => {
      
      this.saving = false;
      this.mostrarSnackbar(
        this.isEditMode ? 'Comerciante actualizado correctamente' : 'Comerciante creado correctamente',
        'success'
      );
      setTimeout(() => this.router.navigate(['/merchants']), 1000);
    },
    error: (err: any) => {
  
      this.saving = false;
      const mensajeBackend = err?.error?.message || err?.error?.errors?.[0] || null;
      this.error = mensajeBackend || 'Error al guardar el comerciante. Intente nuevamente.';
    }
  });
}



  mostrarSnackbar(mensaje: string, tipo: 'success' | 'error'): void {
    this.snackBar.open(mensaje, 'Cerrar', {
      duration: 3000,
      panelClass: tipo === 'success' ? ['snack-success'] : ['snack-error'],
      horizontalPosition: 'end',
      verticalPosition: 'top'
    });
  }

  getFieldError(field: string): string {
    const control = this.comercianteForm.get(field);
    if (!control?.errors || !control.touched) return '';

    if (control.errors['required']) return 'Este campo es requerido';
    if (control.errors['email']) return 'Formato de correo inválido';
    if (control.errors['minlength']) return `Mínimo ${control.errors['minlength'].requiredLength} caracteres`;
    if (control.errors['maxlength']) return `Máximo ${control.errors['maxlength'].requiredLength} caracteres`;
    if (control.errors['fechaFutura']) return 'La fecha no puede ser futura';
    return '';
  }

  logout(): void {
    this.store.dispatch(logout());
  }
}