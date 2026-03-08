import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatIconModule } from '@angular/material/icon';
import { Store } from '@ngrx/store';
import { loadAuth } from '../../../../store/auth/auth.actions';
import { selectAuthError, selectIsLoading } from '../../../../store/auth/auth.selectors';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    MatInputModule,
    MatButtonModule,
    MatCheckboxModule,
    MatFormFieldModule,
    MatProgressSpinnerModule,
    MatIconModule
  ],
  templateUrl: './login.component.html',
  styleUrl: './login.component.scss'
})
export class LoginComponent {
  private store = inject(Store);
  private fb = inject(FormBuilder);

  hidePassword = true;
  error$ = this.store.select(selectAuthError);
  loading$ = this.store.select(selectIsLoading);

  loginForm: FormGroup = this.fb.group({
    email: ['', [Validators.required, Validators.email]],
    password: ['', [Validators.required, Validators.minLength(6)]],
    terms: [false, [Validators.requiredTrue]]
  });

  onSubmit(): void {
  if (this.loginForm.valid) {
    const { email, password } = this.loginForm.value;
    this.store.dispatch(loadAuth({ email, password }));
  }
}

}