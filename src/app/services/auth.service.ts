import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';

export interface LoginRequest {
  username: string;
  password: string;
}

export interface UserInfo {
  userId: number;
  username: string;
  email: string;
  displayName: string;
}

export interface LoginResponse {
  success: boolean;
  message: string;
  user?: UserInfo;
}

const DEMO_USER: UserInfo = {
  userId: 1,
  username: 'demo',
  email: 'demo@dclutter.app',
  displayName: 'Demo User',
};

@Injectable({ providedIn: 'root' })
export class AuthService {

  login(request: LoginRequest): Observable<LoginResponse> {
    if (request.username.trim() && request.password.trim()) {
      return of({ success: true, message: 'OK', user: DEMO_USER });
    }
    return of({ success: false, message: 'Please enter username and password.' });
  }

  saveUser(user: UserInfo): void {
    localStorage.setItem('dclutter_user', JSON.stringify(user));
  }

  getUser(): UserInfo | null {
    const data = localStorage.getItem('dclutter_user');
    return data ? JSON.parse(data) : null;
  }

  isLoggedIn(): boolean {
    return this.getUser() !== null;
  }

  logout(): void {
    localStorage.removeItem('dclutter_user');
  }
}
