import { Component, OnInit, OnDestroy, ViewChild, ElementRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatTooltipModule } from '@angular/material/tooltip';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { catchError, interval, of, Subscription } from 'rxjs';
import { AuthService } from '../../services/auth.service';
import {
  WorkdayService, TeamMemberLiveStatus, ActivityType,
  DayViewResponse, WorkActivity
} from '../../services/workday.service';

interface TaskGroup { taskId?: number; taskName?: string; activities: WorkActivity[]; }
type ViewMode = 'cards' | 'table';

@Component({
  selector: 'app-live-status',
  standalone: true,
  imports: [CommonModule, MatIconModule, MatButtonModule, MatTooltipModule, MatProgressSpinnerModule],
  templateUrl: './live-status.component.html',
  styleUrl: './live-status.component.scss',
})
export class LiveStatusComponent implements OnInit, OnDestroy {
  @ViewChild('detailsPanel') detailsPanelRef?: ElementRef<HTMLElement>;

  loading = true;
  members: TeamMemberLiveStatus[] = [];
  lastRefreshed = new Date();
  now = new Date();
  viewMode: ViewMode = 'cards';

  selectedMember: TeamMemberLiveStatus | null = null;
  dayView: DayViewResponse | null = null;
  detailsLoading = false;

  expandedRows = new Set<number>();
  tableRowDayViews = new Map<number, DayViewResponse>();
  tableRowLoading = new Set<number>();

  private refreshSub?: Subscription;
  private timerSub?: Subscription;

  constructor(private auth: AuthService, private workdaySvc: WorkdayService) {}

  ngOnInit(): void {
    this.load();
    this.refreshSub = interval(30000).subscribe(() => this.load());
    this.timerSub = interval(1000).subscribe(() => this.now = new Date());
  }

  ngOnDestroy(): void {
    this.refreshSub?.unsubscribe();
    this.timerSub?.unsubscribe();
  }

  load(): void {
    const user = this.auth.getUser();
    if (!user) return;
    this.workdaySvc.getTeamLiveStatus(user.userId)
      .pipe(catchError(() => of({ success: false, members: [] as TeamMemberLiveStatus[] })))
      .subscribe(res => {
        this.loading = false;
        this.members = res.members ?? [];
        this.lastRefreshed = new Date();
        // refresh selected member data too
        if (this.selectedMember) {
          const updated = this.members.find(m => m.userId === this.selectedMember!.userId);
          if (updated) { this.selectedMember = updated; this.loadDayView(updated.userId); }
        }
      });
  }

  refresh(): void {
    this.loading = true;
    this.load();
  }

  selectMember(m: TeamMemberLiveStatus): void {
    if (this.selectedMember?.userId === m.userId) { this.selectedMember = null; this.dayView = null; return; }
    this.selectedMember = m;
    this.loadDayView(m.userId);
  }

  toggleTableRow(m: TeamMemberLiveStatus): void {
    if (this.expandedRows.has(m.userId)) {
      this.expandedRows.delete(m.userId);
      return;
    }
    this.expandedRows.add(m.userId);
    if (!this.tableRowDayViews.has(m.userId)) {
      this.tableRowLoading.add(m.userId);
      const today = new Date().toISOString().split('T')[0];
      this.workdaySvc.getDayView(m.userId, today)
        .pipe(catchError(() => of({ success: false, workHistory: [] })))
        .subscribe(res => {
          this.tableRowLoading.delete(m.userId);
          this.tableRowDayViews.set(m.userId, res as DayViewResponse);
        });
    }
  }

  tableRowDayView(userId: number): DayViewResponse | undefined {
    return this.tableRowDayViews.get(userId);
  }

  tableWorkActs(userId: number): WorkActivity[] {
    const dv = this.tableRowDayViews.get(userId);
    if (!dv) return [];
    const hist = dv.workHistory ?? [];
    const cur = dv.currentActivity;
    const all = cur ? [...hist, cur] : hist;
    return all.filter(a => a.activityType === 'SystemWork');
  }

  tableBreakActs(userId: number): WorkActivity[] {
    const dv = this.tableRowDayViews.get(userId);
    if (!dv) return [];
    const hist = dv.workHistory ?? [];
    const cur = dv.currentActivity;
    const all = cur ? [...hist, cur] : hist;
    return all.filter(a => a.activityType !== 'SystemWork');
  }

  tableTaskGroups(userId: number): TaskGroup[] {
    const groups: TaskGroup[] = [];
    for (const act of this.tableWorkActs(userId)) {
      const last = groups[groups.length - 1];
      if (last && last.taskId === act.taskId) { last.activities.push(act); }
      else { groups.push({ taskId: act.taskId, taskName: act.taskName, activities: [act] }); }
    }
    return groups;
  }

  private loadDayView(userId: number): void {
    this.detailsLoading = true;
    const today = new Date().toISOString().split('T')[0];
    this.workdaySvc.getDayView(userId, today)
      .pipe(catchError(() => of({ success: false, workHistory: [] })))
      .subscribe(res => {
        this.detailsLoading = false;
        this.dayView = res as DayViewResponse;
        setTimeout(() => this.detailsPanelRef?.nativeElement.scrollIntoView({ behavior: 'smooth', block: 'nearest' }), 80);
      });
  }

  // ── Computed helpers ────────────────────────────────────────────────────────

  get allActivities(): WorkActivity[] {
    if (!this.dayView) return [];
    const hist = this.dayView.workHistory ?? [];
    const cur = this.dayView.currentActivity;
    return cur ? [...hist, cur] : hist;
  }

  get workActivities(): WorkActivity[] {
    return this.allActivities.filter(a => a.activityType === 'SystemWork');
  }

  get breakActivities(): WorkActivity[] {
    return this.allActivities.filter(a => a.activityType !== 'SystemWork');
  }

  get taskGroups(): TaskGroup[] {
    const groups: TaskGroup[] = [];
    for (const act of this.workActivities) {
      const last = groups[groups.length - 1];
      if (last && last.taskId === act.taskId) { last.activities.push(act); }
      else { groups.push({ taskId: act.taskId, taskName: act.taskName, activities: [act] }); }
    }
    return groups;
  }

  // ── Formatters ──────────────────────────────────────────────────────────────

  elapsed(startTime?: string): string {
    if (!startTime) return '';
    const secs = Math.floor((this.now.getTime() - new Date(startTime).getTime()) / 1000);
    if (secs < 0) return '0s';
    const h = Math.floor(secs / 3600);
    const m = Math.floor((secs % 3600) / 60);
    const s = secs % 60;
    return h > 0 ? `${h}h ${String(m).padStart(2, '0')}m` : `${m}m ${String(s).padStart(2, '0')}s`;
  }

  formatTime(iso?: string): string {
    if (!iso) return '—';
    return new Date(iso).toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit', hour12: true });
  }

  formatDuration(mins?: number): string {
    if (mins == null) return '—';
    const h = Math.floor(mins / 60);
    const m = mins % 60;
    return h > 0 ? `${h}h:${String(m).padStart(2, '0')}m` : `${m}m`;
  }

  formatEarnings(val?: number): string {
    if (val == null) return '—';
    return '₹' + val.toLocaleString('en-IN');
  }

  activityLabel(type?: ActivityType): string {
    if (!type) return '';
    const map: Record<ActivityType, string> = {
      SystemWork: 'System Work', LunchBreak: 'Lunch Break',
      CoffeeBreak: 'Coffee Break', ScreenLock: 'Screen Locked', PersonalBreak: 'Personal Break',
    };
    return map[type] ?? type;
  }

  activityIcon(type?: ActivityType): string {
    const map: Record<ActivityType, string> = {
      SystemWork: 'computer', LunchBreak: 'restaurant',
      CoffeeBreak: 'coffee', ScreenLock: 'lock', PersonalBreak: 'person',
    };
    return (type && map[type]) ? map[type] : 'circle';
  }

  activityColor(type?: ActivityType): string {
    const map: Record<ActivityType, string> = {
      SystemWork: '#10b981', LunchBreak: '#f59e0b',
      CoffeeBreak: '#8b5cf6', ScreenLock: '#ef4444', PersonalBreak: '#6366f1',
    };
    return (type && map[type]) ? map[type] : '#6b7280';
  }

  initials(name: string): string {
    return name.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2);
  }

  statusDot(status: string): string {
    if (status === 'Active') return '#10b981';
    if (status === 'Completed') return '#6366f1';
    return '#d1d5db';
  }
}
