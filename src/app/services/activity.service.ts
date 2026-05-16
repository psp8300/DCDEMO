import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';

export interface ActivityItem {
  logId: number;
  activityId: number;
  activityName?: string;
  date?: string;
  durationMinutes?: number;
  notes?: string;
  createdAt?: string;
}

export interface ActivityResponse {
  success: boolean;
  activities: ActivityItem[];
  message: string;
}

const MOCK_ACTIVITIES: ActivityItem[] = [
  { logId: 1, activityId: 13, date: '2026-05-15', durationMinutes: 30,  notes: 'Daily standup – discussed sprint blockers and deployment status.', createdAt: '2026-05-15T09:00:00' },
  { logId: 2, activityId: 1,  date: '2026-05-13', durationMinutes: 15,  notes: 'Phone call with John Smith about project timeline updates.',       createdAt: '2026-05-13T14:30:00' },
  { logId: 3, activityId: 3,  date: '2026-05-10', durationMinutes: 60,  notes: 'Client visit at Tech Solutions office for requirement gathering.',  createdAt: '2026-05-10T11:00:00' },
  { logId: 4, activityId: 5,  date: '2026-05-08', durationMinutes: 45,  notes: 'Online meeting with remote team via Google Meet.',                  createdAt: '2026-05-08T16:00:00' },
  { logId: 5, activityId: 7,  date: '2026-05-05', durationMinutes: 90,  notes: 'Appointment at clinic for annual health check-up.',                 createdAt: '2026-05-05T10:00:00' },
  { logId: 6, activityId: 9,  date: '2026-04-30', durationMinutes: 20,  notes: 'Quick call with Sarah Johnson regarding emergency contact update.',  createdAt: '2026-04-30T17:15:00' },
];

@Injectable({ providedIn: 'root' })
export class ActivityService {

  getActivity(_userId: number): Observable<ActivityResponse> {
    return of({ success: true, activities: MOCK_ACTIVITIES, message: 'OK' });
  }
}
