import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';
import { delay } from 'rxjs/operators';
import { environment } from '../../environments/environment';

export interface LoginRequest {
  username: string;
  password: string;
}

export interface UserInfo {
  userId: number;
  username: string;
  email: string;
  displayName: string;
  role?: 'Manager' | 'Employee';
  hourlyRate?: number;
  defaultLocation?: 'Office' | 'Home';
}

export interface LoginResponse {
  success: boolean;
  message: string;
  user?: UserInfo;
}

// ─── Demo Credentials ─────────────────────────────────────────────────────────
const DEMO_USERS: Array<{ email: string; password: string; user: UserInfo }> = [
  {
    email:    'manager@dc.com',
    password: 'dcm',
    user: {
      userId: 1, username: 'priya', email: 'manager@dc.com',
      displayName: 'Priya Sharma',
      role: 'Manager', hourlyRate: 300, defaultLocation: 'Office',
    },
  },
  {
    email:    'employee1@dc.com',
    password: 'dce1',
    user: {
      userId: 2, username: 'demouser', email: 'employee1@dc.com',
      displayName: 'Demo User',
      role: 'Employee', hourlyRate: 200, defaultLocation: 'Office',
    },
  },
  {
    email:    'employee2@dc.com',
    password: 'dce2',
    user: {
      userId: 3, username: 'arjun', email: 'employee2@dc.com',
      displayName: 'Arjun Mehta',
      role: 'Employee', hourlyRate: 200, defaultLocation: 'Home',
    },
  },
];

@Injectable({ providedIn: 'root' })
export class AuthService {

  login(request: LoginRequest): Observable<LoginResponse> {
    const match = DEMO_USERS.find(
      u => (u.email === request.username || u.user.username === request.username)
        && u.password === request.password
    );
    if (match) {
      return of({ success: true, message: 'Login successful', user: match.user }).pipe(delay(600));
    }
    return of({ success: false, message: 'Invalid credentials. Use one of the demo accounts below.' }).pipe(delay(400));
  }

  saveUser(user: UserInfo): void {
    localStorage.setItem('dclutter_user', JSON.stringify(user));
  }

  getUser(): UserInfo | null {
    const data = localStorage.getItem('dclutter_user');
    return data ? JSON.parse(data) : null;
  }

  isLoggedIn(): boolean { return this.getUser() !== null; }

  logout(): void { localStorage.removeItem('dclutter_user'); }
}
