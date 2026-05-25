import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatTooltipModule } from '@angular/material/tooltip';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { catchError, of } from 'rxjs';
import { AuthService } from '../../services/auth.service';
import { WorkdayService, AttendanceSummary } from '../../services/workday.service';

type Period = 'day' | 'week' | 'month';

@Component({
  selector: 'app-attendance',
  standalone: true,
  imports: [
    CommonModule,
    MatIconModule,
    MatButtonModule,
    MatTooltipModule,
    MatProgressSpinnerModule,
  ],
  templateUrl: './attendance.component.html',
  styleUrl: './attendance.component.scss',
})
export class AttendanceComponent implements OnInit {
  loading = true;
  period: Period = 'month';
  viewDate = new Date();
  records: AttendanceSummary[] = [];

  constructor(private auth: AuthService, private workdaySvc: WorkdayService) {}

  ngOnInit(): void {
    this.load();
  }

  setPeriod(p: Period): void {
    this.period = p;
    this.load();
  }

  prev(): void {
    this.viewDate = this.shiftDate(-1);
    this.load();
  }

  next(): void {
    if (!this.isCurrentPeriod) {
      this.viewDate = this.shiftDate(1);
      this.load();
    }
  }

  goCurrentPeriod(): void {
    this.viewDate = new Date();
    this.load();
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

  get totalPresent(): number {
    return this.records.filter(r => r.status !== 'Absent').length;
  }

  get totalNetMins(): number {
    return this.records.reduce((s, r) => s + r.netTimeMins, 0);
  }

  get totalEarnings(): number {
    return this.records.reduce((s, r) => s + r.earnings, 0);
  }

  private load(): void {
    const user = this.auth.getUser();
    if (!user) return;
    this.loading = true;
    const dateStr = this.viewDate.toISOString().split('T')[0];
    this.workdaySvc.getAttendance(user.userId, this.period, dateStr)
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
}
