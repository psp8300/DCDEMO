import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
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

@Injectable({ providedIn: 'root' })
export class AuthService {
  private apiUrl = environment.apiUrl;

  constructor(private http: HttpClient) {}

  login(request: LoginRequest): Observable<LoginResponse> {
    return this.http.post<LoginResponse>(`${this.apiUrl}/auth/login`, request);
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
