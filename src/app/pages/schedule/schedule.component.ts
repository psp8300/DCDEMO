import { Component, OnInit, ViewChild } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatDialogModule, MatDialog } from '@angular/material/dialog';
import { MatTooltipModule } from '@angular/material/tooltip';
import { FullCalendarModule, FullCalendarComponent } from '@fullcalendar/angular';
import { CalendarOptions, EventClickArg, EventInput } from '@fullcalendar/core';
import dayGridPlugin from '@fullcalendar/daygrid';
import timeGridPlugin from '@fullcalendar/timegrid';
import listPlugin from '@fullcalendar/list';
import interactionPlugin from '@fullcalendar/interaction';
import { AuthService } from '../../services/auth.service';
import { ActivityService, ActivityItem } from '../../services/activity.service';
import { ScheduleEventDialogComponent } from './schedule-event-dialog.component';

export interface ActivityFilter {
  activityId: number;
  name: string;
  color: string;
  count: number;
}

const PALETTE = ['#6366f1','#10b981','#f59e0b','#8b5cf6','#ef4444','#06b6d4','#f97316','#ec4899','#14b8a6','#a855f7'];

@Component({
  selector: 'app-schedule',
  standalone: true,
  imports: [
    CommonModule, MatIconModule, MatButtonModule,
    MatDialogModule, MatTooltipModule, FullCalendarModule,
  ],
  templateUrl: './schedule.component.html',
  styleUrl: './schedule.component.scss',
})
export class ScheduleComponent implements OnInit {
  @ViewChild('calendar') calendarRef!: FullCalendarComponent;

  viewTitle = '';
  currentView: 'dayGridMonth' | 'timeGridWeek' | 'timeGridDay' | 'listYear' = 'dayGridMonth';
  loading = true;

  filters: ActivityFilter[] = [];
  selectedActivityId: number | null = null;       // null = All

  allEvents: EventInput[] = [];
  private colorMap = new Map<number, string>();

  calendarOptions: CalendarOptions = {
    plugins: [dayGridPlugin, timeGridPlugin, listPlugin, interactionPlugin],
    initialView: 'dayGridMonth',
    headerToolbar: false,
    height: 'auto',
    contentHeight: 620,
    editable: false,
    selectable: true,
    dayMaxEvents: 3,
    events: [],
    datesSet: (info) => { this.viewTitle = info.view.title; },
    eventClick: (info: EventClickArg) => this.onEventClick(info),
    eventDidMount: (info) => { info.el.style.cursor = 'pointer'; },
  };

  constructor(
    private auth: AuthService,
    private activityService: ActivityService,
    private dialog: MatDialog,
  ) {}

  ngOnInit(): void {
    const mockActivities = this.buildMockActivities();
    const user = this.auth.getUser();

    if (user) {
      this.activityService.getActivity(user.userId).subscribe({
        next: (res) => {
          this.loading = false;
          const apiItems = res.success ? res.activities : [];
          this.initCalendar([...apiItems, ...mockActivities]);
        },
        error: () => {
          this.loading = false;
          this.initCalendar(mockActivities);
        },
      });
    } else {
      this.loading = false;
      this.initCalendar(mockActivities);
    }
  }

  private initCalendar(activities: ActivityItem[]): void {
    // Build color map by activityId
    const uniqueIds = [...new Set(activities.map(a => a.activityId))];
    uniqueIds.forEach((id, i) => this.colorMap.set(id, PALETTE[i % PALETTE.length]));

    // Build filter list
    const countMap = new Map<number, number>();
    const nameMap = new Map<number, string>();
    activities.forEach(a => {
      countMap.set(a.activityId, (countMap.get(a.activityId) ?? 0) + 1);
      if (!nameMap.has(a.activityId)) {
        nameMap.set(a.activityId, a.activityName ?? `Activity #${a.activityId}`);
      }
    });
    this.filters = uniqueIds.map(id => ({
      activityId: id,
      name: nameMap.get(id)!,
      color: this.colorMap.get(id)!,
      count: countMap.get(id)!,
    }));

    // Build all events
    this.allEvents = activities
      .filter(a => !!a.date)
      .map(a => ({
        id: String(a.logId),
        title: a.activityName ?? a.notes?.trim() ?? `Activity #${a.activityId}`,
        date: a.date!.split('T')[0],
        backgroundColor: this.colorMap.get(a.activityId),
        borderColor: this.colorMap.get(a.activityId),
        textColor: '#ffffff',
        extendedProps: { activity: a },
      }));

    this.applyFilter();
  }

  selectFilter(activityId: number | null): void {
    this.selectedActivityId = activityId;
    this.applyFilter();
  }

  private applyFilter(): void {
    const events = this.selectedActivityId === null
      ? this.allEvents
      : this.allEvents.filter(e => (e as any).extendedProps?.activity?.activityId === this.selectedActivityId);

    this.calendarOptions = { ...this.calendarOptions, events };
  }

  previous(): void { this.calendarRef.getApi().prev(); }
  next(): void     { this.calendarRef.getApi().next(); }
  today(): void    { this.calendarRef.getApi().today(); }

  changeView(view: 'dayGridMonth' | 'timeGridWeek' | 'timeGridDay' | 'listYear'): void {
    this.currentView = view;
    this.calendarRef.getApi().changeView(view);
  }

  onEventClick(info: EventClickArg): void {
    this.dialog.open(ScheduleEventDialogComponent, {
      data: { activity: info.event.extendedProps['activity'] },
      width: '420px',
    });
  }

  private buildMockActivities(): ActivityItem[] {
    const d = (offset: number) => {
      const date = new Date();
      date.setDate(date.getDate() + offset);
      return date.toISOString().split('T')[0];
    };
    return [
      { logId: 101, activityId: 1, activityName: 'Sorting & Decluttering', date: d(-5), durationMinutes: 40,  notes: 'Cleaned out attic storage' },
      { logId: 102, activityId: 2, activityName: 'Donation Drop-off',       date: d(-3), durationMinutes: 70,  notes: 'Sold furniture sets' },
      { logId: 103, activityId: 1, activityName: 'Sorting & Decluttering',  date: d(-1), durationMinutes: 45,  notes: 'Sorted living room boxes' },
      { logId: 104, activityId: 2, activityName: 'Donation Drop-off',       date: d(0),  durationMinutes: 30,  notes: 'Donated old clothes to charity' },
      { logId: 105, activityId: 3, activityName: 'Garage Cleanup',          date: d(0),  durationMinutes: 60,  notes: 'Cleared garage shelves' },
      { logId: 106, activityId: 4, activityName: 'Marketplace Listing',     date: d(1),  durationMinutes: 20,  notes: 'Listed items on marketplace' },
      { logId: 107, activityId: 3, activityName: 'Garage Cleanup',          date: d(2),  durationMinutes: 90,  notes: 'Deep cleaned kitchen cabinets' },
      { logId: 108, activityId: 2, activityName: 'Donation Drop-off',       date: d(3),  durationMinutes: 35,  notes: 'Packed donation boxes' },
      { logId: 109, activityId: 5, activityName: 'Wardrobe Organisation',   date: d(4),  durationMinutes: 50,  notes: 'Organised bedroom wardrobe' },
      { logId: 110, activityId: 6, activityName: 'Document Shredding',      date: d(5),  durationMinutes: 25,  notes: 'Scanned & shredded old documents' },
      { logId: 111, activityId: 2, activityName: 'Donation Drop-off',       date: d(7),  durationMinutes: 55,  notes: 'Drop-off at recycling centre' },
      { logId: 112, activityId: 4, activityName: 'Marketplace Listing',     date: d(8),  durationMinutes: 30,  notes: 'Updated inventory list' },
    ];
  }
}
