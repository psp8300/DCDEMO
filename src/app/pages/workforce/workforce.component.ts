import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatTooltipModule } from '@angular/material/tooltip';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { catchError, of } from 'rxjs';
import { AuthService } from '../../services/auth.service';
import { WorkdayService, AttendanceSummary, TeamMember } from '../../services/workday.service';

type Period = 'day' | 'week' | 'month';

@Component({
  selector: 'app-workforce',
  standalone: true,
  imports: [
    CommonModule,
    MatIconModule,
    MatButtonModule,
    MatTooltipModule,
    MatProgressSpinnerModule,
  ],
  templateUrl: './workforce.component.html',
  styleUrl: './workforce.component.scss',
})
export class WorkforceComponent implements OnInit {
  membersLoading = true;
  loading = false;
  period: Period = 'day';
  viewDate = new Date();
  members: TeamMember[] = [];
  selectedMemberId: number | undefined = undefined;
  records: AttendanceSummary[] = [];

  constructor(private auth: AuthService, private workdaySvc: WorkdayService) {}

  ngOnInit(): void {
    const user = this.auth.getUser();
    if (!user) return;
    this.workdaySvc.getTeamMembers(user.userId)
      .pipe(catchError(() => of({ success: false, members: [] as TeamMember[] })))
      .subscribe(res => {
        this.membersLoading = false;
        this.members = res.members ?? [];
        this.loadAttendance();
      });
  }

  selectMember(id: number | undefined): void {
    this.selectedMemberId = id;
    this.loadAttendance();
  }

  setPeriod(p: Period): void {
    this.period = p;
    this.loadAttendance();
  }

  prev(): void {
    this.viewDate = this.shiftDate(-1);
    this.loadAttendance();
  }

  next(): void {
    if (!this.isCurrentPeriod) {
      this.viewDate = this.shiftDate(1);
      this.loadAttendance();
    }
  }

  goCurrentPeriod(): void {
    this.viewDate = new Date();
    this.loadAttendance();
  }

  get isCurrentPeriod(): boolean {
    const now = new Date();
    if (this.period === 'day')   return this.isSameDay(this.viewDate, now);
    if (this.period === 'week')  return this.isSameWeek(this.viewDate, now);
    return this.isSameMonth(this.viewDate, now);
  }

  get periodLabel(): string {
    if (this.period === 'day') {
      return this.viewDate.toLocaleDateString('en-GB', { weekday: 'long', day: '2-digit', month: 'short', year: 'numeric' });
    }
    if (this.period === 'week') {
      const mon = this.getWeekStart(this.viewDate);
      const sun = new Date(mon.getTime() + 6 * 86400000);
      return `${mon.toLocaleDateString('en-GB', { day: '2-digit', month: 'short' })} – ${sun.toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' })}`;
    }
    return this.viewDate.toLocaleDateString('en-GB', { month: 'long', year: 'numeric' });
  }

  get selectedMemberName(): string {
    if (!this.selectedMemberId) return 'All Members';
    return this.members.find(m => m.userId === this.selectedMemberId)?.displayName ?? 'Member';
  }

  get totalPresent(): number {
    return this.records.filter(r => r.status !== 'Absent').length;
  }

  get totalNetMins(): number {
    return this.records.reduce((s, r) => s + r.netTimeMins, 0);
  }

  get totalEarnings(): number {
    return this.records.reduce((s, r) => s + r.earnings, 0);
  }

  private loadAttendance(): void {
    const user = this.auth.getUser();
    if (!user) return;
    this.loading = true;
    const dateStr = this.viewDate.toISOString().split('T')[0];
    this.workdaySvc.getTeamAttendance(user.userId, this.period, dateStr, this.selectedMemberId)
      .pipe(catchError(() => of({ success: false, records: [] as AttendanceSummary[] })))
      .subscribe(res => {
        this.loading = false;
        this.records = res.records ?? [];
      });
  }

  private shiftDate(dir: number): Date {
    const d = new Date(this.viewDate);
    if (this.period === 'day')   d.setDate(d.getDate() + dir);
    if (this.period === 'week')  d.setDate(d.getDate() + dir * 7);
    if (this.period === 'month') d.setMonth(d.getMonth() + dir);
    return d;
  }

  private isSameDay(a: Date, b: Date): boolean {
    return a.toISOString().split('T')[0] === b.toISOString().split('T')[0];
  }

  private isSameWeek(a: Date, b: Date): boolean {
    return this.getWeekStart(a).getTime() === this.getWeekStart(b).getTime();
  }

  private isSameMonth(a: Date, b: Date): boolean {
    return a.getFullYear() === b.getFullYear() && a.getMonth() === b.getMonth();
  }

  private getWeekStart(d: Date): Date {
    const day = new Date(d);
    const diff = day.getDay() === 0 ? -6 : 1 - day.getDay();
    day.setDate(day.getDate() + diff);
    day.setHours(0, 0, 0, 0);
    return day;
  }

  formatDuration(mins: number): string {
    if (!mins) return '—';
    const h = Math.floor(mins / 60);
    const m = mins % 60;
    return h > 0 ? `${h}h${m > 0 ? ':' + String(m).padStart(2, '0') + 'm' : ''}` : `${m}m`;
  }

  formatTime(iso?: string): string {
    if (!iso) return '—';
    return new Date(iso).toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit', hour12: true });
  }

  formatDate(iso: string): string {
    return new Date(iso).toLocaleDateString('en-GB', { weekday: 'short', day: '2-digit', month: 'short' });
  }

  formatEarnings(n: number): string {
    return '₹' + n.toLocaleString('en-IN');
  }

  initials(name: string): string {
    return name.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2);
  }

  memberRate(userId: number): string {
    const rate = this.members.find(m => m.userId === userId)?.hourlyRate;
    return rate != null ? '₹' + rate : '—';
  }
}
