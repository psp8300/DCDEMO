import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';

export type WorkLocation = 'Office' | 'Home';
export type ActivityType = 'SystemWork' | 'LunchBreak' | 'CoffeeBreak' | 'ScreenLock' | 'PersonalBreak';

export interface WorkdaySession {
  sessionId: number;
  userId: number;
  sessionDate: string;
  loginTime: string;
  logoutTime?: string;
  location: WorkLocation;
  status: 'Active' | 'Completed';
}

export interface WorkActivity {
  workActivityId: number;
  sessionId: number;
  userId: number;
  activityType: ActivityType;
  startTime: string;
  endTime?: string;
  taskId?: number;
  taskName?: string;
  location: WorkLocation;
  durationMinutes?: number;
}

export interface DayAttendance {
  loginTime: string;
  logoutTime?: string;
  totalDurationMins: number;
  breakDurationMins: number;
  netTimeMins: number;
  earnings: number;
}

export interface DayViewResponse {
  success: boolean;
  session?: WorkdaySession;
  attendance?: DayAttendance;
  currentActivity?: WorkActivity;
  workHistory: WorkActivity[];
  message?: string;
}

export interface AttendanceSummary {
  sessionId: number;
  userId: number;
  userName: string;
  sessionDate: string;
  loginTime: string;
  logoutTime?: string;
  location: string;
  totalDurationMins: number;
  breakDurationMins: number;
  netTimeMins: number;
  earnings: number;
  status: string;
}

export interface TeamMember {
  userId: number;
  displayName: string;
  username: string;
  role: 'Manager' | 'Employee';
  hourlyRate: number;
  defaultLocation: WorkLocation;
}

export interface TeamMemberLiveStatus {
  userId: number;
  displayName: string;
  role: 'Manager' | 'Employee';
  defaultLocation: WorkLocation;
  sessionStatus: 'NotStarted' | 'Active' | 'Completed';
  location?: WorkLocation;
  currentActivity?: ActivityType;
  activityStartTime?: string;
  currentTaskName?: string;
  loginTime?: string;
  logoutTime?: string;
  netTimeMins?: number;
  breakDurationMins?: number;
  earnings?: number;
}

@Injectable({ providedIn: 'root' })
export class WorkdayService {
  private readonly api = environment.apiUrl;

  constructor(private http: HttpClient) {}

  startWorkday(userId: number, location: WorkLocation): Observable<{ success: boolean; sessionId?: number; message?: string }> {
    return this.http.post<{ success: boolean; sessionId?: number; message?: string }>(
      `${this.api}/workday/start`, { userId, location }
    );
  }

  endWorkday(sessionId: number): Observable<{ success: boolean; message?: string }> {
    return this.http.post<{ success: boolean; message?: string }>(
      `${this.api}/workday/${sessionId}/end`, {}
    );
  }

  changeActivity(sessionId: number, activityType: ActivityType, taskId?: number): Observable<{ success: boolean; workActivityId?: number; message?: string }> {
    return this.http.post<{ success: boolean; workActivityId?: number; message?: string }>(
      `${this.api}/workday/${sessionId}/activity`, { activityType, taskId }
    );
  }

  getDayView(userId: number, date: string): Observable<DayViewResponse> {
    return this.http.get<DayViewResponse>(`${this.api}/workday/day/${userId}`, {
      params: new HttpParams().set('date', date)
    });
  }

  getAttendance(userId: number, period: 'day' | 'week' | 'month', date: string): Observable<{ success: boolean; records: AttendanceSummary[] }> {
    return this.http.get<{ success: boolean; records: AttendanceSummary[] }>(`${this.api}/workday/attendance/${userId}`, {
      params: new HttpParams().set('period', period).set('date', date)
    });
  }

  getTeamMembers(managerId: number): Observable<{ success: boolean; members: TeamMember[] }> {
    return this.http.get<{ success: boolean; members: TeamMember[] }>(`${this.api}/workday/team/${managerId}`);
  }

  getTeamAttendance(managerId: number, period: 'day' | 'week' | 'month', date: string, memberId?: number): Observable<{ success: boolean; records: AttendanceSummary[] }> {
    let params = new HttpParams().set('period', period).set('date', date);
    if (memberId != null) params = params.set('memberId', memberId);
    return this.http.get<{ success: boolean; records: AttendanceSummary[] }>(
      `${this.api}/workday/team/${managerId}/attendance`, { params }
    );
  }

  getTeamLiveStatus(managerId: number): Observable<{ success: boolean; members: TeamMemberLiveStatus[] }> {
    return this.http.get<{ success: boolean; members: TeamMemberLiveStatus[] }>(
      `${this.api}/workday/team/${managerId}/live`
    );
  }
}
