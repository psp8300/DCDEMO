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

// ─── Per-user activity history ────────────────────────────────────────────────

const ACTIVITIES_BY_USER: Record<number, ActivityItem[]> = {
  // Priya Sharma – Manager
  1: [
    { logId:1,  activityId:13, activityName:'Team Meeting',     date:'2026-05-29', durationMinutes:30,  notes:'Daily standup – reviewed sprint progress, assigned tasks for the week.',       createdAt:'2026-05-29T09:00:00' },
    { logId:2,  activityId:1,  activityName:'Phone Call',       date:'2026-05-28', durationMinutes:20,  notes:'Called John about resource allocation for the Q2 feature rollout.',             createdAt:'2026-05-28T14:00:00' },
    { logId:3,  activityId:13, activityName:'Team Meeting',     date:'2026-05-27', durationMinutes:60,  notes:'Quarterly planning session – reviewed roadmap, prioritised backlog items.',    createdAt:'2026-05-27T10:00:00' },
    { logId:4,  activityId:5,  activityName:'Online Meeting',   date:'2026-05-26', durationMinutes:45,  notes:'Stakeholder sync via Google Meet – demo of new DClutter workday module.',      createdAt:'2026-05-26T15:00:00' },
    { logId:5,  activityId:3,  activityName:'Client Visit',     date:'2026-05-23', durationMinutes:90,  notes:'On-site visit at Tech Solutions to discuss upcoming integration requirements.',  createdAt:'2026-05-23T11:00:00' },
    { logId:6,  activityId:1,  activityName:'Phone Call',       date:'2026-05-22', durationMinutes:15,  notes:'Follow-up call with Sarah Johnson regarding emergency protocol update.',        createdAt:'2026-05-22T16:30:00' },
  ],
  // Demo User – Employee (Office)
  2: [
    { logId:11, activityId:13, activityName:'Team Meeting',     date:'2026-05-29', durationMinutes:30,  notes:'Daily standup – discussed blocking issue with the mobile routing module.',     createdAt:'2026-05-29T09:00:00' },
    { logId:12, activityId:1,  activityName:'Phone Call',       date:'2026-05-28', durationMinutes:15,  notes:'Phone call with Arjun regarding API endpoint for schedule module.',            createdAt:'2026-05-28T14:30:00' },
    { logId:13, activityId:3,  activityName:'Client Visit',     date:'2026-05-26', durationMinutes:60,  notes:'Client visit at Tech Solutions – showed DCMobile prototype, positive feedback.', createdAt:'2026-05-26T11:00:00' },
    { logId:14, activityId:5,  activityName:'Online Meeting',   date:'2026-05-23', durationMinutes:45,  notes:'Online meeting with remote team to align on mobile demo release strategy.',    createdAt:'2026-05-23T16:00:00' },
    { logId:15, activityId:7,  activityName:'Appointment',      date:'2026-05-20', durationMinutes:90,  notes:'Annual health check-up at city clinic.',                                       createdAt:'2026-05-20T10:00:00' },
    { logId:16, activityId:9,  activityName:'Emergency Call',   date:'2026-05-19', durationMinutes:20,  notes:'Emergency call with John Smith – server down alert, resolved in 20 mins.',    createdAt:'2026-05-19T17:15:00' },
  ],
  // Arjun Mehta – Employee (Home)
  3: [
    { logId:21, activityId:13, activityName:'Team Meeting',     date:'2026-05-29', durationMinutes:30,  notes:'Standup via Google Meet – shared progress on schedule API integration.',       createdAt:'2026-05-29T09:30:00' },
    { logId:22, activityId:5,  activityName:'Online Meeting',   date:'2026-05-28', durationMinutes:45,  notes:'Online design review for attendance module with Priya and Demo User.',         createdAt:'2026-05-28T11:00:00' },
    { logId:23, activityId:1,  activityName:'Phone Call',       date:'2026-05-27', durationMinutes:10,  notes:'Quick call with Demo User to clarify mock data structure for mobile app.',     createdAt:'2026-05-27T15:30:00' },
    { logId:24, activityId:5,  activityName:'Online Meeting',   date:'2026-05-26', durationMinutes:60,  notes:'Sprint retrospective – all team, remote via Google Meet.',                     createdAt:'2026-05-26T16:00:00' },
    { logId:25, activityId:3,  activityName:'Client Visit',     date:'2026-05-23', durationMinutes:120, notes:'Visited main client office (exceptional – WFH day swap) for live demo.',       createdAt:'2026-05-23T10:00:00' },
    { logId:26, activityId:9,  activityName:'Emergency Call',   date:'2026-05-20', durationMinutes:25,  notes:'DB connection timeout emergency – diagnosed and fixed migration script.',       createdAt:'2026-05-20T18:00:00' },
  ],
};

// Fallback shared list
const MOCK_ACTIVITIES = ACTIVITIES_BY_USER[2];

@Injectable({ providedIn: 'root' })
export class ActivityService {

  getActivity(userId: number): Observable<ActivityResponse> {
    const activities = ACTIVITIES_BY_USER[userId] ?? MOCK_ACTIVITIES;
    return of({ success: true, activities, message: 'OK' });
  }
}
