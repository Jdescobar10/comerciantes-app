import { ComponentFixture, TestBed, fakeAsync, tick } from '@angular/core/testing';
import { ReactiveFormsModule } from '@angular/forms';
import { RouterTestingModule } from '@angular/router/testing';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';
import { MatSnackBarModule } from '@angular/material/snack-bar';
import { MatNativeDateModule } from '@angular/material/core';
import { ActivatedRoute } from '@angular/router';
import { of, throwError } from 'rxjs';
import { provideMockStore, MockStore } from '@ngrx/store/testing';

import { FormComponent } from './form.component';
import { MerchantsService } from '../../../../core/services/merchants.service';

// ─── Mocks ───────────────────────────────────────────────────────────────────

const municipiosMock = [
  { municipioId: 1, nombre: 'Bogotá' },
  { municipioId: 2, nombre: 'Medellín' }
];

const comercianteMock = {
  data: {
    nombreRazonSocial: 'Empresa Test S.A.',
    correoElectronico: 'test@empresa.com',
    telefono: '3001234567',
    municipioId: 1,
    estadoId: 1,
    fechaRegistro: '2024-01-15',
    poseeEstablecimientos: true
  }
};

const reporteMock = {
  data: [
    { comercianteId: 5, totalIngresos: 500000, cantidadEmpleados: 10 }
  ]
};

const merchantsServiceMock = {
  getMunicipios: jest.fn().mockReturnValue(of({ data: municipiosMock })),
  getComercianteById: jest.fn().mockReturnValue(of(comercianteMock)),
  getReporteComerciantes: jest.fn().mockReturnValue(of(reporteMock)),
  createComerciante: jest.fn().mockReturnValue(of({ data: { id: 99 } })),
  updateComerciante: jest.fn().mockReturnValue(of({ data: {} }))
};

const initialState = {
  auth: {
    user: { nombre: 'Admin Test', rol: 'Administrador' },
    token: 'fake-token'
  }
};

// ─── Suite ────────────────────────────────────────────────────────────────────

xdescribe('FormComponent', () => {
  let component: FormComponent;
  let fixture: ComponentFixture<FormComponent>;
  let store: MockStore;
  let merchantsService: typeof merchantsServiceMock;

  // Configuración base para modo CREACIÓN
  const setupCreacion = async () => {
    await TestBed.configureTestingModule({
      imports: [
        FormComponent,
        ReactiveFormsModule,
        RouterTestingModule,
        NoopAnimationsModule,
        MatSnackBarModule,
        MatNativeDateModule
      ],
      providers: [
        provideMockStore({ initialState }),
        {
          provide: MerchantsService,
          useValue: merchantsServiceMock
        },
        {
          provide: ActivatedRoute,
          useValue: { snapshot: { paramMap: { get: () => null } } }
        }
      ]
    }).compileComponents();

    store = TestBed.inject(MockStore);
    merchantsService = TestBed.inject(MerchantsService) as any;
    fixture = TestBed.createComponent(FormComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  };

  // Configuración base para modo EDICIÓN
  const setupEdicion = async (id = '5') => {
    await TestBed.configureTestingModule({
      imports: [
        FormComponent,
        ReactiveFormsModule,
        RouterTestingModule,
        NoopAnimationsModule,
        MatSnackBarModule,
        MatNativeDateModule
      ],
      providers: [
        provideMockStore({ initialState }),
        {
          provide: MerchantsService,
          useValue: merchantsServiceMock
        },
        {
          provide: ActivatedRoute,
          useValue: { snapshot: { paramMap: { get: () => id } } }
        }
      ]
    }).compileComponents();

    store = TestBed.inject(MockStore);
    merchantsService = TestBed.inject(MerchantsService) as any;
    fixture = TestBed.createComponent(FormComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  };

  afterEach(() => {
    TestBed.resetTestingModule();
    jest.clearAllMocks();
  });

  // ── BLOQUE 1: Renderizado y modo ──────────────────────────────────────────

  describe('Inicialización', () => {
    it('debe crear el componente correctamente', async () => {
      await setupCreacion();
      expect(component).toBeTruthy();
    });

    it('debe estar en modo creación cuando no hay id en la ruta', async () => {
      await setupCreacion();
      expect(component.isEditMode).toBe(false);
      expect(component.comercianteId).toBeNull();
    });

    it('debe estar en modo edición cuando hay id en la ruta', async () => {
      await setupEdicion('5');
      expect(component.isEditMode).toBe(true);
      expect(component.comercianteId).toBe(5);
    });

    it('debe cargar la lista de municipios al iniciar', async () => {
      await setupCreacion();
      expect(merchantsServiceMock.getMunicipios).toHaveBeenCalled();
      expect(component.municipios.length).toBe(2);
    });
  });

  // ── BLOQUE 2: Validaciones del formulario ─────────────────────────────────

  describe('Validaciones del formulario', () => {
    beforeEach(async () => {
      await setupCreacion();
    });

    it('el formulario debe ser inválido cuando está vacío', () => {
      component.comercianteForm.reset();
      expect(component.comercianteForm.invalid).toBe(true);
    });

    it('debe requerir el campo nombreRazonSocial', () => {
      const control = component.comercianteForm.get('nombreRazonSocial');
      control?.setValue('');
      control?.markAsTouched();
      expect(control?.hasError('required')).toBe(true);
    });

    it('nombreRazonSocial debe exigir mínimo 3 caracteres', () => {
      const control = component.comercianteForm.get('nombreRazonSocial');
      control?.setValue('AB');
      control?.markAsTouched();
      expect(control?.hasError('minlength')).toBe(true);
    });

    it('correoElectronico debe validar formato de email', () => {
      const control = component.comercianteForm.get('correoElectronico');
      control?.setValue('correo-invalido');
      control?.markAsTouched();
      expect(control?.hasError('email')).toBe(true);
    });

    it('correoElectronico debe ser válido con formato correcto', () => {
      const control = component.comercianteForm.get('correoElectronico');
      control?.setValue('valid@email.com');
      expect(control?.hasError('email')).toBeFalsy();
    });

    it('debe rechazar fechaRegistro futura', () => {
      const control = component.comercianteForm.get('fechaRegistro');
      const fechaFutura = new Date();
      fechaFutura.setFullYear(fechaFutura.getFullYear() + 1);
      control?.setValue(fechaFutura);
      control?.markAsTouched();
      expect(control?.hasError('fechaFutura')).toBe(true);
    });

    it('debe aceptar fechaRegistro igual a hoy', () => {
      const control = component.comercianteForm.get('fechaRegistro');
      control?.setValue(new Date());
      expect(control?.hasError('fechaFutura')).toBeFalsy();
    });

    it('debe requerir municipioId', () => {
      const control = component.comercianteForm.get('municipioId');
      control?.setValue('');
      control?.markAsTouched();
      expect(control?.hasError('required')).toBe(true);
    });

    it('el formulario debe ser válido con todos los campos requeridos correctos', () => {
      component.comercianteForm.patchValue({
        nombreRazonSocial: 'Empresa Válida S.A.',
        correoElectronico: 'valido@empresa.com',
        telefono: '3001234567',
        municipioId: 1,
        estadoId: 1,
        fechaRegistro: new Date('2024-01-01'),
        poseeEstablecimientos: false
      });
      expect(component.comercianteForm.valid).toBe(true);
    });

    it('el formulario debe ser válido sin correo ni teléfono (son opcionales)', () => {
      component.comercianteForm.patchValue({
        nombreRazonSocial: 'Empresa Sin Contacto',
        correoElectronico: '',
        telefono: '',
        municipioId: 2,
        estadoId: 1,
        fechaRegistro: new Date('2023-06-15'),
        poseeEstablecimientos: false
      });
      expect(component.comercianteForm.valid).toBe(true);
    });
  });

  // ── BLOQUE 3: Modo Edición ────────────────────────────────────────────────

  describe('Modo edición', () => {
    beforeEach(async () => {
      await setupEdicion('5');
    });

    it('debe llamar a getComercianteById con el id correcto', () => {
      expect(merchantsServiceMock.getComercianteById).toHaveBeenCalledWith(5);
    });

    it('debe poblar el formulario con los datos del comerciante', () => {
      expect(component.comercianteForm.get('nombreRazonSocial')?.value)
        .toBe('Empresa Test S.A.');
      expect(component.comercianteForm.get('correoElectronico')?.value)
        .toBe('test@empresa.com');
    });

    it('debe cargar totalIngresos y cantidadEmpleados del reporte', () => {
      expect(component.totalIngresos).toBe(500000);
      expect(component.cantidadEmpleados).toBe(10);
    });

    it('debe llamar a updateComerciante al enviar en modo edición', () => {
      component.onSubmit();
      expect(merchantsServiceMock.updateComerciante).toHaveBeenCalledWith(
        5,
        expect.objectContaining({ nombreRazonSocial: 'Empresa Test S.A.' })
      );
    });
  });

  // ── BLOQUE 4: Modo Creación ────────────────────────────────────────────────

  describe('Modo creación', () => {
    beforeEach(async () => {
      await setupCreacion();
    });

    it('debe llamar a createComerciante al enviar en modo creación', () => {
      component.comercianteForm.patchValue({
        nombreRazonSocial: 'Nueva Empresa',
        municipioId: 1,
        estadoId: 1,
        fechaRegistro: new Date('2024-03-01')
      });
      component.onSubmit();
      expect(merchantsServiceMock.createComerciante).toHaveBeenCalled();
    });

    it('no debe llamar al servicio si el formulario es inválido', () => {
      component.comercianteForm.reset();
      component.onSubmit();
      expect(merchantsServiceMock.createComerciante).not.toHaveBeenCalled();
    });
  });

  // ── BLOQUE 5: Mensajes de error ───────────────────────────────────────────

  describe('getFieldError', () => {
    beforeEach(async () => {
      await setupCreacion();
    });

    it('debe retornar mensaje de requerido para nombreRazonSocial vacío', () => {
      const control = component.comercianteForm.get('nombreRazonSocial');
      control?.setValue('');
      control?.markAsTouched();
      expect(component.getFieldError('nombreRazonSocial')).toBe('Este campo es requerido');
    });

    it('debe retornar mensaje de email inválido', () => {
      const control = component.comercianteForm.get('correoElectronico');
      control?.setValue('no-es-email');
      control?.markAsTouched();
      expect(component.getFieldError('correoElectronico')).toBe('Formato de correo inválido');
    });

    it('debe retornar cadena vacía si el campo es válido', () => {
      const control = component.comercianteForm.get('correoElectronico');
      control?.setValue('ok@email.com');
      control?.markAsTouched();
      expect(component.getFieldError('correoElectronico')).toBe('');
    });

    it('debe retornar cadena vacía si el campo no fue tocado', () => {
      const control = component.comercianteForm.get('nombreRazonSocial');
      control?.setValue('');
      // No se llama markAsTouched
      expect(component.getFieldError('nombreRazonSocial')).toBe('');
    });
  });
});