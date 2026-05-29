import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';
import { delay } from 'rxjs/operators';

export type WorkLocation = 'Office' | 'Home';
export type ActivityType = 'SystemWork' | 'LunchBreak' | 'CoffeeBreak' | 'ScreenLock' | 'PersonalBreak';

export interface WorkdaySession {
  sessionId: number; userId: number; sessionDate: string;
  loginTime: string; logoutTime?: string;
  location: WorkLocation; status: 'Active' | 'Completed';
}

export interface WorkActivity {
  workActivityId: number; sessionId: number; userId: number;
  activityType: ActivityType; startTime: string; endTime?: string;
  taskId?: number; taskName?: string; location: WorkLocation; durationMinutes?: number;
}

export interface DayAttendance {
  loginTime: string; logoutTime?: string;
  totalDurationMins: number; breakDurationMins: number; netTimeMins: number; earnings: number;
}

export interface DayViewResponse {
  success: boolean; session?: WorkdaySession;
  attendance?: DayAttendance; currentActivity?: WorkActivity;
  workHistory: WorkActivity[]; message?: string;
}

export interface AttendanceSummary {
  sessionId: number; userId: number; userName: string; sessionDate: string;
  loginTime: string; logoutTime?: string; location: string;
  totalDurationMins: number; breakDurationMins: number; netTimeMins: number;
  earnings: number; status: string;
}

export interface TeamMember {
  userId: number; displayName: string; username: string;
  role: 'Manager' | 'Employee'; hourlyRate: number; defaultLocation: WorkLocation;
}

export interface TeamMemberLiveStatus {
  userId: number; displayName: string; role: 'Manager' | 'Employee';
  defaultLocation: WorkLocation; sessionStatus: 'NotStarted' | 'Active' | 'Completed';
  location?: WorkLocation; currentActivity?: ActivityType; activityStartTime?: string;
  currentTaskName?: string; loginTime?: string; logoutTime?: string;
  netTimeMins?: number; breakDurationMins?: number; earnings?: number;
}

// ─── Mock Data ────────────────────────────────────────────────────────────────

const TODAY = new Date().toISOString().split('T')[0];

function d(day: number): string {
  const dt = new Date(); dt.setDate(dt.getDate() - day);
  return dt.toISOString().split('T')[0];
}

function t(dateStr: string, hh: number, mm: number): string {
  return `${dateStr}T${String(hh).padStart(2,'0')}:${String(mm).padStart(2,'0')}:00`;
}

// ── Team members ──────────────────────────────────────────────────────────────
const TEAM_MEMBERS: TeamMember[] = [
  { userId: 1, displayName: 'Priya Sharma', username: 'priya',    role: 'Manager',  hourlyRate: 300, defaultLocation: 'Office' },
  { userId: 2, displayName: 'Demo User',    username: 'demouser', role: 'Employee', hourlyRate: 200, defaultLocation: 'Office' },
  { userId: 3, displayName: 'Arjun Mehta', username: 'arjun',    role: 'Employee', hourlyRate: 200, defaultLocation: 'Home'   },
];

// ── Today's sessions per user ─────────────────────────────────────────────────
const TODAY_SESSIONS: Record<number, WorkdaySession> = {
  1: { sessionId: 101, userId: 1, sessionDate: TODAY, loginTime: t(TODAY,8,50), location: 'Office', status: 'Active' },
  2: { sessionId: 102, userId: 2, sessionDate: TODAY, loginTime: t(TODAY,9,3),  location: 'Office', status: 'Active' },
  3: { sessionId: 103, userId: 3, sessionDate: TODAY, loginTime: t(TODAY,9,30), location: 'Home',   status: 'Active' },
};

// ── Today's work history per user ─────────────────────────────────────────────
const TODAY_HISTORY: Record<number, WorkActivity[]> = {
  1: [
    { workActivityId:11, sessionId:101, userId:1, activityType:'SystemWork',  startTime:t(TODAY,8,50), endTime:t(TODAY,10,30), durationMinutes:100, location:'Office', taskName:'Sprint planning & team review' },
    { workActivityId:12, sessionId:101, userId:1, activityType:'CoffeeBreak', startTime:t(TODAY,10,30),endTime:t(TODAY,10,45), durationMinutes:15,  location:'Office' },
    { workActivityId:13, sessionId:101, userId:1, activityType:'SystemWork',  startTime:t(TODAY,10,45),endTime:t(TODAY,13,0),  durationMinutes:135, location:'Office', taskName:'Workforce attendance review' },
    { workActivityId:14, sessionId:101, userId:1, activityType:'LunchBreak',  startTime:t(TODAY,13,0), endTime:t(TODAY,13,45), durationMinutes:45,  location:'Office' },
    { workActivityId:15, sessionId:101, userId:1, activityType:'SystemWork',  startTime:t(TODAY,13,45),location:'Office', taskName:'Manager approvals & live monitoring' },
  ],
  2: [
    { workActivityId:21, sessionId:102, userId:2, activityType:'SystemWork',  startTime:t(TODAY,9,3),  endTime:t(TODAY,10,45), durationMinutes:102, location:'Office', taskName:'DClutter Mobile – workday pages' },
    { workActivityId:22, sessionId:102, userId:2, activityType:'CoffeeBreak', startTime:t(TODAY,10,45),endTime:t(TODAY,11,0),  durationMinutes:15,  location:'Office' },
    { workActivityId:23, sessionId:102, userId:2, activityType:'SystemWork',  startTime:t(TODAY,11,0), endTime:t(TODAY,13,0),  durationMinutes:120, location:'Office', taskName:'DClutter Mobile – workday pages' },
    { workActivityId:24, sessionId:102, userId:2, activityType:'LunchBreak',  startTime:t(TODAY,13,0), endTime:t(TODAY,13,45), durationMinutes:45,  location:'Office' },
    { workActivityId:25, sessionId:102, userId:2, activityType:'SystemWork',  startTime:t(TODAY,13,45),location:'Office', taskName:'Routing & mock data integration' },
  ],
  3: [
    { workActivityId:31, sessionId:103, userId:3, activityType:'SystemWork',  startTime:t(TODAY,9,30), endTime:t(TODAY,11,0),  durationMinutes:90,  location:'Home', taskName:'API integration – schedule module' },
    { workActivityId:32, sessionId:103, userId:3, activityType:'PersonalBreak',startTime:t(TODAY,11,0),endTime:t(TODAY,11,15), durationMinutes:15,  location:'Home' },
    { workActivityId:33, sessionId:103, userId:3, activityType:'SystemWork',   startTime:t(TODAY,11,15),endTime:t(TODAY,13,0), durationMinutes:105, location:'Home', taskName:'API integration – schedule module' },
    { workActivityId:34, sessionId:103, userId:3, activityType:'LunchBreak',   startTime:t(TODAY,13,0),                       location:'Home' },
  ],
};

// ── Attendance history (past 4 weeks) ─────────────────────────────────────────
function attendance(uid: number, sid: number, dd: number, login: [number,number], logout: [number,number], brk: number, loc: WorkLocation): AttendanceSummary {
  const m = TEAM_MEMBERS.find(u => u.userId === uid)!;
  const total = (logout[0]*60+logout[1]) - (login[0]*60+login[1]);
  const net   = total - brk;
  return {
    sessionId: sid, userId: uid, userName: m.displayName,
    sessionDate: d(dd), loginTime: t(d(dd), login[0], login[1]),
    logoutTime: t(d(dd), logout[0], logout[1]),
    totalDurationMins: total, breakDurationMins: brk, netTimeMins: net,
    earnings: Math.round(net * m.hourlyRate / 60),
    location: loc, status: 'Completed',
  };
}

const ALL_ATTENDANCE: AttendanceSummary[] = [
  // Today (active)
  { sessionId:101,userId:1,userName:'Priya Sharma', sessionDate:TODAY, loginTime:t(TODAY,8,50),  totalDurationMins:0, breakDurationMins:60, netTimeMins:340, earnings:1700, location:'Office', status:'Active' },
  { sessionId:102,userId:2,userName:'Demo User',    sessionDate:TODAY, loginTime:t(TODAY,9,3),   totalDurationMins:0, breakDurationMins:60, netTimeMins:320, earnings:1067, location:'Office', status:'Active' },
  { sessionId:103,userId:3,userName:'Arjun Mehta',  sessionDate:TODAY, loginTime:t(TODAY,9,30),  totalDurationMins:0, breakDurationMins:15, netTimeMins:265, earnings:883,  location:'Home',   status:'Active' },
  // Yesterday
  attendance(1,201,1,[8,55],[17,15],60,'Office'), attendance(2,202,1,[9,5],[17,10],60,'Office'), attendance(3,203,1,[9,30],[17,0],30,'Home'),
  // 2 days ago
  attendance(1,211,2,[9,0],[17,0],55,'Office'),   attendance(2,212,2,[9,10],[17,0],60,'Office'), attendance(3,213,2,[9,25],[17,5],45,'Home'),
  // 3 days ago
  attendance(1,221,3,[8,50],[17,30],60,'Office'),  attendance(2,222,3,[9,0],[17,15],60,'Office'),attendance(3,223,3,[9,30],[16,45],60,'Home'),
  // 4 days ago
  attendance(1,231,4,[9,5],[17,0],50,'Office'),    attendance(2,232,4,[9,15],[17,0],55,'Office'),attendance(3,233,4,[9,20],[17,10],30,'Home'),
  // 7 days ago
  attendance(1,241,7,[8,55],[17,10],60,'Office'),  attendance(2,242,7,[9,0],[17,0],60,'Office'), attendance(3,243,7,[9,30],[17,0],45,'Home'),
  attendance(1,251,8,[9,0],[17,15],55,'Office'),   attendance(2,252,8,[9,5],[17,5],60,'Office'),  attendance(3,253,8,[9,35],[17,0],30,'Home'),
  attendance(1,261,9,[8,50],[17,0],60,'Office'),   attendance(2,262,9,[9,10],[17,0],60,'Home'),   attendance(3,263,9,[9,25],[17,10],45,'Home'),
  attendance(1,271,10,[9,5],[17,20],50,'Office'),  attendance(2,272,10,[9,0],[17,0],60,'Office'), attendance(3,273,10,[9,30],[16,50],60,'Home'),
  attendance(1,281,11,[9,0],[17,0],60,'Office'),   attendance(2,282,11,[9,15],[17,0],60,'Office'),attendance(3,283,11,[9,30],[17,0],45,'Home'),
  attendance(1,291,14,[8,55],[17,15],60,'Office'), attendance(2,292,14,[9,0],[17,5],55,'Office'), attendance(3,293,14,[9,30],[17,0],30,'Home'),
  attendance(1,301,15,[9,0],[17,0],60,'Office'),   attendance(2,302,15,[9,5],[17,0],60,'Office'), attendance(3,303,15,[9,25],[17,10],45,'Home'),
  attendance(1,311,16,[8,50],[17,30],55,'Office'),  attendance(2,312,16,[9,10],[17,0],60,'Office'),attendance(3,313,16,[9,30],[17,0],30,'Home'),
  attendance(1,321,17,[9,5],[17,0],60,'Office'),   attendance(2,322,17,[9,0],[17,0],60,'Home'),   attendance(3,323,17,[9,20],[17,5],45,'Home'),
  attendance(1,331,18,[9,0],[17,10],50,'Office'),  attendance(2,332,18,[9,15],[17,0],60,'Office'),attendance(3,333,18,[9,30],[17,0],30,'Home'),
];

// ── Live status ───────────────────────────────────────────────────────────────
const TEAM_LIVE: TeamMemberLiveStatus[] = [
  {
    userId:1, displayName:'Priya Sharma', role:'Manager', defaultLocation:'Office',
    sessionStatus:'Active', location:'Office', loginTime:t(TODAY,8,50),
    netTimeMins:340, breakDurationMins:60, earnings:1700,
    currentActivity:'SystemWork', activityStartTime:t(TODAY,13,45),
    currentTaskName:'Manager approvals & live monitoring',
  },
  {
    userId:2, displayName:'Demo User', role:'Employee', defaultLocation:'Office',
    sessionStatus:'Active', location:'Office', loginTime:t(TODAY,9,3),
    netTimeMins:320, breakDurationMins:60, earnings:1067,
    currentActivity:'SystemWork', activityStartTime:t(TODAY,13,45),
    currentTaskName:'Routing & mock data integration',
  },
  {
    userId:3, displayName:'Arjun Mehta', role:'Employee', defaultLocation:'Home',
    sessionStatus:'Active', location:'Home', loginTime:t(TODAY,9,30),
    netTimeMins:265, breakDurationMins:15, earnings:883,
    currentActivity:'LunchBreak', activityStartTime:t(TODAY,13,0),
  },
  {
    userId:4, displayName:'Kavya Reddy', role:'Employee', defaultLocation:'Office',
    sessionStatus:'Completed', location:'Office',
    loginTime:t(TODAY,8,45), logoutTime:t(TODAY,15,0),
    netTimeMins:315, breakDurationMins:60, earnings:1050,
  },
  {
    userId:5, displayName:'Ravi Nair', role:'Employee', defaultLocation:'Office',
    sessionStatus:'NotStarted',
  },
];

// ─── Helpers ──────────────────────────────────────────────────────────────────

function weekStart(d: Date): Date {
  const r = new Date(d);
  const diff = r.getDay() === 0 ? -6 : 1 - r.getDay();
  r.setDate(r.getDate() + diff); r.setHours(0,0,0,0);
  return r;
}

function filterByPeriod(records: AttendanceSummary[], period: string, date: string): AttendanceSummary[] {
  const vd = new Date(date);
  return records.filter(r => {
    const rd = new Date(r.sessionDate);
    if (period === 'day')   return r.sessionDate === date;
    if (period === 'week') {
      const ws = weekStart(vd), we = new Date(ws.getTime() + 6*86400000);
      return rd >= ws && rd <= we;
    }
    return rd.getFullYear() === vd.getFullYear() && rd.getMonth() === vd.getMonth();
  });
}

// ─── Service ──────────────────────────────────────────────────────────────────

@Injectable({ providedIn: 'root' })
export class WorkdayService {

  startWorkday(_userId: number, _location: WorkLocation): Observable<{ success: boolean; sessionId?: number; message?: string }> {
    return of({ success: true, sessionId: 999, message: 'Demo mode – workday started' }).pipe(delay(400));
  }

  endWorkday(_sessionId: number): Observable<{ success: boolean; message?: string }> {
    return of({ success: true, message: 'Demo mode – workday ended' }).pipe(delay(400));
  }

  changeActivity(_sessionId: number, _activityType: ActivityType): Observable<{ success: boolean; message?: string }> {
    return of({ success: true, message: 'Demo mode – activity changed' }).pipe(delay(300));
  }

  getDayView(userId: number, _date: string): Observable<DayViewResponse> {
    const session   = TODAY_SESSIONS[userId] ?? null;
    const history   = TODAY_HISTORY[userId] ?? [];
    const current   = history.find(a => !a.endTime) ?? null;
    const completed = history.filter(a => !!a.endTime);
    const breakMins = completed.filter(a => a.activityType !== 'SystemWork').reduce((s,a) => s+(a.durationMinutes??0),0);
    const workMins  = completed.filter(a => a.activityType === 'SystemWork').reduce((s,a) => s+(a.durationMinutes??0),0);
    const rate      = TEAM_MEMBERS.find(m => m.userId === userId)?.hourlyRate ?? 200;

    const attendance: DayAttendance | undefined = session ? {
      loginTime: session.loginTime,
      logoutTime: session.logoutTime,
      totalDurationMins: workMins + breakMins,
      breakDurationMins: breakMins,
      netTimeMins: workMins,
      earnings: Math.round(workMins * rate / 60),
    } : undefined;

    return of({ success: true, session: session ?? undefined, attendance, currentActivity: current ?? undefined, workHistory: history }).pipe(delay(300));
  }

  getAttendance(userId: number, period: 'day' | 'week' | 'month', date: string): Observable<{ success: boolean; records: AttendanceSummary[] }> {
    const records = filterByPeriod(ALL_ATTENDANCE.filter(r => r.userId === userId), period, date);
    return of({ success: true, records }).pipe(delay(300));
  }

  getTeamMembers(_managerId: number): Observable<{ success: boolean; members: TeamMember[] }> {
    return of({ success: true, members: TEAM_MEMBERS }).pipe(delay(300));
  }

  getTeamAttendance(_managerId: number, period: 'day' | 'week' | 'month', date: string, memberId?: number): Observable<{ success: boolean; records: AttendanceSummary[] }> {
    const base    = memberId ? ALL_ATTENDANCE.filter(r => r.userId === memberId) : ALL_ATTENDANCE;
    const records = filterByPeriod(base, period, date);
    return of({ success: true, records }).pipe(delay(300));
  }

  getTeamLiveStatus(_managerId: number): Observable<{ success: boolean; members: TeamMemberLiveStatus[] }> {
    return of({ success: true, members: TEAM_LIVE }).pipe(delay(300));
  }
}
