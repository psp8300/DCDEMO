import { Component, OnInit, OnDestroy, HostListener } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatMenuModule } from '@angular/material/menu';
import { MatTooltipModule } from '@angular/material/tooltip';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { Subscription, interval } from 'rxjs';
import { catchError, of } from 'rxjs';
import { AuthService, UserInfo } from '../../services/auth.service';
import {
  WorkdayService, WorkdaySession, WorkActivity, DayAttendance,
  ActivityType, WorkLocation, DayViewResponse
} from '../../services/workday.service';

interface TaskGroup {
  taskId?: number;
  taskName?: string;
  activities: WorkActivity[];
}

@Component({
  selector: 'app-workday',
  standalone: true,
  imports: [
    CommonModule,
    MatIconModule,
    MatButtonModule,
    MatMenuModule,
    MatTooltipModule,
    MatProgressSpinnerModule,
    MatSnackBarModule,
  ],
  templateUrl: './workday.component.html',
  styleUrl: './workday.component.scss',
})
export class WorkdayComponent implements OnInit, OnDestroy {
  user: UserInfo | null = null;
  loading = true;
  actionLoading = false;

  viewDate = new Date();
  session: WorkdaySession | null = null;
  attendance: DayAttendance | null = null;
  currentActivity: WorkActivity | null = null;
  workHistory: WorkActivity[] = [];

  elapsedSeconds = 0;
  private timerSub?: Subscription;

  location: WorkLocation = 'Office';

  constructor(
    private auth: AuthService,
    private workdaySvc: WorkdayService,
    private snackBar: MatSnackBar,
  ) {}

  ngOnInit(): void {
    this.user = this.auth.getUser();
    this.location = this.user?.defaultLocation ?? 'Office';
    this.loadDay();
  }

  ngOnDestroy(): void {
    this.timerSub?.unsubscribe();
  }

  @HostListener('document:visibilitychange')
  onVisibilityChange(): void {
    if (!this.session || this.session.status !== 'Active' || !this.isToday) return;
    if (document.hidden) {
      if (this.currentActivity?.activityType === 'SystemWork') {
        this.changeActivity('ScreenLock', false);
      }
    } else {
      if (this.currentActivity?.activityType === 'ScreenLock') {
        this.changeActivity('SystemWork', false);
      }
    }
  }

  get viewDateStr(): string {
    return this.viewDate.toISOString().split('T')[0];
  }

  get isToday(): boolean {
    return this.viewDateStr === new Date().toISOString().split('T')[0];
  }

  get sessionActive(): boolean {
    return this.session?.status === 'Active';
  }

  get isOnBreak(): boolean {
    const t = this.currentActivity?.activityType;
    return t === 'LunchBreak' || t === 'CoffeeBreak' || t === 'PersonalBreak';
  }

  readonly activityOptions: ActivityType[] = ['SystemWork', 'PersonalBreak', 'LunchBreak', 'CoffeeBreak', 'ScreenLock'];

  isCurrentActivity(type: ActivityType): boolean {
    return this.currentActivity?.activityType === type;
  }

  get isScreenLocked(): boolean {
    return this.currentActivity?.activityType === 'ScreenLock';
  }

  get isWorking(): boolean {
    return this.currentActivity?.activityType === 'SystemWork';
  }

  get elapsedDisplay(): string {
    const h = Math.floor(this.elapsedSeconds / 3600);
    const m = Math.floor((this.elapsedSeconds % 3600) / 60);
    const s = this.elapsedSeconds % 60;
    if (h > 0) return `${h}h ${m}m`;
    if (m > 0) return `${m}m ${s}s`;
    return `${s}s`;
  }

  get workActivities(): WorkActivity[] {
    return this.workHistory.filter(a => a.activityType === 'SystemWork');
  }

  get breakActivities(): WorkActivity[] {
    return this.workHistory.filter(a => a.activityType !== 'SystemWork');
  }

  get taskGroups(): TaskGroup[] {
    const groups = new Map<string, TaskGroup>();
    for (const act of this.workActivities) {
      const key = act.taskId != null ? String(act.taskId) : '__none__';
      if (!groups.has(key)) {
        groups.set(key, { taskId: act.taskId, taskName: act.taskName, activities: [] });
      }
      groups.get(key)!.activities.push(act);
    }
    return Array.from(groups.values());
  }

  prevDay(): void {
    this.viewDate = new Date(this.viewDate.getTime() - 86400000);
    this.loadDay();
  }

  nextDay(): void {
    if (!this.isToday) {
      this.viewDate = new Date(this.viewDate.getTime() + 86400000);
      this.loadDay();
    }
  }

  goToday(): void {
    this.viewDate = new Date();
    this.loadDay();
  }

  setLocation(loc: WorkLocation): void {
    this.location = loc;
  }

  startWorkday(): void {
    if (!this.user) return;
    this.actionLoading = true;
    this.workdaySvc.startWorkday(this.user.userId, this.location)
      .pipe(catchError(() => of({ success: false, message: 'Could not connect to server' })))
      .subscribe(res => {
        this.actionLoading = false;
        if (res.success) {
          this.snackBar.open('Workday started!', '', { duration: 2000 });
          this.loadDay();
        } else {
          this.snackBar.open(res.message ?? 'Error starting workday', '', { duration: 3000 });
        }
      });
  }

  endWorkday(): void {
    if (!this.session) return;
    this.actionLoading = true;
    this.workdaySvc.endWorkday(this.session.sessionId)
      .pipe(catchError(() => of({ success: false, message: 'Could not connect to server' })))
      .subscribe(res => {
        this.actionLoading = false;
        if (res.success) {
          this.snackBar.open('Workday ended. Great work today!', '', { duration: 2500 });
          this.loadDay();
        } else {
          this.snackBar.open(res.message ?? 'Error ending workday', '', { duration: 3000 });
        }
      });
  }

  changeActivity(type: ActivityType, showSnack = true): void {
    if (!this.session) return;
    this.actionLoading = true;
    this.workdaySvc.changeActivity(this.session.sessionId, type)
      .pipe(catchError(() => of({ success: false })))
      .subscribe(res => {
        this.actionLoading = false;
        if (res.success) {
          if (showSnack) {
            const labels: Partial<Record<ActivityType, string>> = {
              LunchBreak: 'Lunch break started',
              CoffeeBreak: 'Coffee break started',
              ScreenLock: 'Screen locked',
              SystemWork: 'Welcome back!',
            };
            this.snackBar.open(labels[type] ?? 'Activity changed', '', { duration: 1800 });
          }
          this.loadDay();
        }
      });
  }

  private loadDay(): void {
    if (!this.user) return;
    this.loading = true;
    this.timerSub?.unsubscribe();

    this.workdaySvc.getDayView(this.user.userId, this.viewDateStr)
      .pipe(catchError(() => of({ success: false, workHistory: [] as WorkActivity[] } as DayViewResponse)))
      .subscribe(res => {
        this.loading = false;
        if (res.success) {
          this.session = res.session ?? null;
          this.attendance = res.attendance ?? null;
          this.currentActivity = res.currentActivity ?? null;
          this.workHistory = res.workHistory;
          if (this.session?.status === 'Active' && this.currentActivity) {
            this.startElapsedTimer();
          }
        }
      });
  }

  private startElapsedTimer(): void {
    if (!this.currentActivity) return;
    const start = new Date(this.currentActivity.startTime).getTime();
    this.elapsedSeconds = Math.floor((Date.now() - start) / 1000);
    this.timerSub = interval(1000).subscribe(() => this.elapsedSeconds++);
  }

  formatDuration(mins?: number): string {
    if (mins == null) return '—';
    if (mins < 0) return '0m';
    const h = Math.floor(mins / 60);
    const m = mins % 60;
    return h > 0 ? `${h}h${m > 0 ? ':' + String(m).padStart(2, '0') + 'm' : ''}` : `${m}m`;
  }

  formatTime(iso?: string): string {
    if (!iso) return '—';
    return new Date(iso).toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit', hour12: true });
  }

  formatDate(date: Date): string {
    return date.toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' });
  }

  formatEarnings(amount: number): string {
    return '₹' + amount.toLocaleString('en-IN');
  }

  activityLabel(type: ActivityType): string {
    const map: Record<ActivityType, string> = {
      SystemWork: 'System Work', LunchBreak: 'Lunch Break',
      CoffeeBreak: 'Coffee Break', ScreenLock: 'Screen Locked',
      PersonalBreak: 'Personal Break',
    };
    return map[type];
  }

  activityIcon(type: ActivityType): string {
    const map: Record<ActivityType, string> = {
      SystemWork: 'computer', LunchBreak: 'restaurant',
      CoffeeBreak: 'coffee', ScreenLock: 'lock',
      PersonalBreak: 'person',
    };
    return map[type];
  }

  activityColor(type: ActivityType): string {
    const map: Record<ActivityType, string> = {
      SystemWork: '#10b981', LunchBreak: '#f59e0b',
      CoffeeBreak: '#6366f1', ScreenLock: '#ef4444',
      PersonalBreak: '#8b5cf6',
    };
    return map[type];
  }
}
