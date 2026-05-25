import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatIconModule } from '@angular/material/icon';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { AuthService } from '../../services/auth.service';
import { environment } from '../../../environments/environment';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [
    CommonModule, FormsModule,
    MatInputModule, MatButtonModule, MatCardModule,
    MatIconModule, MatProgressSpinnerModule
  ],
  templateUrl: './login.component.html',
  styleUrl: './login.component.scss'
})
export class LoginComponent {
  email = '';
  password = '';
  hidePassword = true;
  loading = false;
  errorMessage = '';
  readonly demoMode = environment.demo;

  readonly demoAccounts = [
    { label: 'Manager', email: 'manager@dc.com', password: 'dcm', icon: 'manage_accounts' },
    { label: 'Employee 1', email: 'employee1@dc.com', password: 'dce1', icon: 'person' },
    { label: 'Employee 2', email: 'employee2@dc.com', password: 'dce2', icon: 'person_outline' },
  ];

  constructor(private auth: AuthService, private router: Router) {}

  quickFill(email: string, password: string): void {
    this.email = email;
    this.password = password;
    this.errorMessage = '';
  }

  onLogin() {
    if (!this.email || !this.password) {
      this.errorMessage = 'Please enter email and password.';
      return;
    }
    this.loading = true;
    this.errorMessage = '';

    this.auth.login({ username: this.email, password: this.password }).subscribe({
      next: (res) => {
        this.loading = false;
        if (res.success && res.user) {
          this.auth.saveUser(res.user);
          this.router.navigate(['/home']);
        } else {
          this.errorMessage = res.message || 'Login failed.';
        }
      },
      error: () => {
        this.loading = false;
        this.errorMessage = 'Could not connect to server. Please try again.';
      }
    });
  }
}
