import { Component, OnInit, OnDestroy, Renderer2 } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { forkJoin, of } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { AuthService, UserInfo } from '../../services/auth.service';
import { ActivityService, ActivityItem } from '../../services/activity.service';
import { ItemsService, ItemType } from '../../services/items.service';

export interface DonutSlice {
  label: string;
  value: number;
  color: string;
  percent: number;
  offset: number;
}

export interface ScheduleEntry {
  title: string;
  date: string;
  notes?: string;
  durationMinutes?: number;
  color: string;
  isToday: boolean;
  isTomorrow: boolean;
}

const TYPE_COLORS: Record<string, string> = {
  Activity:    '#6366f1',
  WorkUnit:    '#10b981',
  Contact:     '#f59e0b',
  Document:    '#2563eb',
  Location:    '#9333ea',
  Credentials: '#e11d48',
  Notes:       '#ca8a04',
  HyperLink:   '#06b6d4',
  Entity:      '#15803d',
  Money:       '#16a34a',
  Records:     '#7c3aed',
};

const ACTIVITY_PALETTE = ['#6366f1','#10b981','#f59e0b','#8b5cf6','#ef4444','#06b6d4'];

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [CommonModule, RouterModule, MatIconModule, MatButtonModule, MatCardModule, MatProgressSpinnerModule],
  templateUrl: './home.component.html',
  styleUrl: './home.component.scss',
})
export class HomeComponent implements OnInit, OnDestroy {
  user: UserInfo | null = null;
  private watermarkEl: HTMLElement | null = null;

  // Stats
  totalItems = 0;
  totalActivities = 0;
  activitiesToday = 0;
  upcomingCount = 0;

  // Donut chart
  donutSlices: DonutSlice[] = [];
  donutLoading = true;
  readonly RADIUS = 70;
  readonly CIRCUMFERENCE = 2 * Math.PI * this.RADIUS;
  hoveredSlice: DonutSlice | null = null;

  // Schedule
  scheduleItems: ScheduleEntry[] = [];
  scheduleView: 'today' | 'tomorrow' = 'today';
  scheduleLoading = true;

  // Quick nav
  quickLinks = [
    { label: 'My Lists',      icon: 'list_alt',      route: '/lists' },
    { label: 'Browse Items',  icon: 'inventory_2',   route: '/items' },
    { label: 'Activity Log',  icon: 'history',       route: '/activity' },
    { label: 'Schedule',      icon: 'calendar_month', route: '/schedule' },
  ];

  private allActivities: ActivityItem[] = [];

  constructor(
    private auth: AuthService,
    private activityService: ActivityService,
    private itemsService: ItemsService,
    private renderer: Renderer2,
  ) {}

  ngOnInit(): void {
    // Inject watermark directly onto body — bypasses any layout overflow/transform containment
    this.watermarkEl = this.renderer.createElement('div');
    this.renderer.addClass(this.watermarkEl!, 'psp-watermark');
    this.renderer.appendChild(document.body, this.watermarkEl!);

    this.user = this.auth.getUser();
    if (!this.user) return;
    const userId = this.user.userId;

    forkJoin({
      types:      this.itemsService.getItemTypes(userId).pipe(catchError(() => of({ success: false, types: [] as ItemType[] }))),
      activities: this.activityService.getActivity(userId).pipe(catchError(() => of({ success: false, activities: [] as ActivityItem[], message: '' }))),
    }).subscribe(({ types, activities }) => {
      // ── Stats ──────────────────────────────────────────────────────────
      const typeList = types.success ? types.types : [];
      this.totalItems = typeList.reduce((s, t) => s + t.count, 0);
      const actType = typeList.find(t => t.itemType === 'Activity');
      this.totalActivities = actType?.count ?? 0;

      // ── Donut chart ────────────────────────────────────────────────────
      this.buildDonut(typeList);
      this.donutLoading = false;

      // ── Activities + schedule ──────────────────────────────────────────
      const apiActivities = activities.success ? activities.activities : [];
      this.allActivities = [...apiActivities, ...this.mockActivities()];
      this.buildSchedule();
      this.scheduleLoading = false;

      const today = new Date().toISOString().split('T')[0];
      this.activitiesToday = this.allActivities.filter(a => a.date?.startsWith(today)).length;
      this.upcomingCount   = this.allActivities.filter(a => a.date && a.date > today).length;
    });
  }

  ngOnDestroy(): void {
    if (this.watermarkEl) {
      this.renderer.removeChild(document.body, this.watermarkEl);
      this.watermarkEl = null;
    }
  }

  private buildDonut(types: ItemType[]): void {
    const filtered = types.filter(t => t.count > 0);
    const total = filtered.reduce((s, t) => s + t.count, 0);
    if (!total) return;

    let offset = 0;
    this.donutSlices = filtered.map(t => {
      const pct    = t.count / total;
      const slice: DonutSlice = {
        label:   t.itemType,
        value:   t.count,
        color:   TYPE_COLORS[t.itemType] ?? '#94a3b8',
        percent: Math.round(pct * 100),
        offset,
      };
      offset += pct * this.CIRCUMFERENCE;
      return slice;
    });
  }

  // Dash-array length for each slice
  sliceDash(slice: DonutSlice): string {
    const len = slice.percent / 100 * this.CIRCUMFERENCE;
    return `${len} ${this.CIRCUMFERENCE - len}`;
  }

  sliceOffset(slice: DonutSlice): string {
    return String(this.CIRCUMFERENCE / 4 - slice.offset);
  }

  private buildSchedule(): void {
    const today    = new Date().toISOString().split('T')[0];
    const tomorrow = new Date(Date.now() + 86400000).toISOString().split('T')[0];

    const colorMap = new Map<number, string>();
    this.allActivities.forEach((a, i) => {
      if (!colorMap.has(a.activityId)) colorMap.set(a.activityId, ACTIVITY_PALETTE[colorMap.size % ACTIVITY_PALETTE.length]);
    });

    this.scheduleItems = this.allActivities
      .filter(a => a.date === today || a.date === tomorrow)
      .sort((a, b) => (a.date ?? '').localeCompare(b.date ?? ''))
      .map(a => ({
        title:           a.activityName ?? `Activity #${a.activityId}`,
        date:            a.date ?? '',
        notes:           a.notes,
        durationMinutes: a.durationMinutes,
        color:           colorMap.get(a.activityId) ?? '#6366f1',
        isToday:         a.date === today,
        isTomorrow:      a.date === tomorrow,
      }));
  }

  get filteredSchedule(): ScheduleEntry[] {
    return this.scheduleItems.filter(s => this.scheduleView === 'today' ? s.isToday : s.isTomorrow);
  }

  formatDuration(mins?: number): string {
    if (!mins) return '';
    return mins < 60 ? `${mins} min` : `${Math.floor(mins / 60)}h ${mins % 60 ? (mins % 60) + 'm' : ''}`.trim();
  }

  private mockActivities(): ActivityItem[] {
    const d = (offset: number) => {
      const date = new Date(); date.setDate(date.getDate() + offset);
      return date.toISOString().split('T')[0];
    };
    return [
      { logId: 201, activityId: 1, activityName: 'Sorting & Decluttering', date: d(0),  durationMinutes: 45,  notes: 'Sorted living room boxes' },
      { logId: 202, activityId: 2, activityName: 'Donation Drop-off',       date: d(0),  durationMinutes: 30,  notes: 'Donated old clothes' },
      { logId: 203, activityId: 3, activityName: 'Garage Cleanup',          date: d(0),  durationMinutes: 60,  notes: 'Cleared garage shelves' },
      { logId: 204, activityId: 4, activityName: 'Marketplace Listing',     date: d(1),  durationMinutes: 20,  notes: 'Listed items online' },
      { logId: 205, activityId: 5, activityName: 'Wardrobe Organisation',   date: d(1),  durationMinutes: 50,  notes: 'Organised bedroom wardrobe' },
    ];
  }
}
