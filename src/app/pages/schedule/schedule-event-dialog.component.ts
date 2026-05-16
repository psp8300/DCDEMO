import { Component, Inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MAT_DIALOG_DATA, MatDialogModule, MatDialogRef } from '@angular/material/dialog';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatDividerModule } from '@angular/material/divider';
import { ActivityItem } from '../../services/activity.service';

@Component({
  selector: 'app-schedule-event-dialog',
  standalone: true,
  imports: [CommonModule, MatDialogModule, MatIconModule, MatButtonModule, MatDividerModule],
  template: `
    <div class="event-dialog">
      <!-- Header -->
      <div class="dialog-header">
        <div class="event-dot"></div>
        <div class="header-info">
          <h2>{{ title }}</h2>
          <p>{{ formatDate(activity.date) }}</p>
        </div>
        <button mat-icon-button mat-dialog-close class="close-btn">
          <mat-icon>close</mat-icon>
        </button>
      </div>

      <mat-divider></mat-divider>

      <!-- Details -->
      <div class="dialog-body">
        <div class="detail-row" *ngIf="activity.activityId">
          <mat-icon>tag</mat-icon>
          <span>Activity #{{ activity.activityId }}</span>
        </div>

        <div class="detail-row" *ngIf="activity.durationMinutes">
          <mat-icon>timer</mat-icon>
          <span>{{ formatDuration(activity.durationMinutes) }}</span>
        </div>

        <div class="detail-row notes" *ngIf="activity.notes">
          <mat-icon>notes</mat-icon>
          <span>{{ activity.notes }}</span>
        </div>

        <div class="detail-row" *ngIf="activity.createdAt">
          <mat-icon>add_circle_outline</mat-icon>
          <span>Logged {{ formatDate(activity.createdAt) }}</span>
        </div>
      </div>

      <!-- Actions -->
      <div class="dialog-actions">
        <button mat-flat-button mat-dialog-close color="primary">Close</button>
      </div>
    </div>
  `,
  styles: [`
    .event-dialog { min-width: 360px; }

    .dialog-header {
      display: flex;
      align-items: flex-start;
      gap: 12px;
      padding: 20px 20px 16px;
    }

    .event-dot {
      width: 14px;
      height: 14px;
      border-radius: 50%;
      background: #6366f1;
      margin-top: 4px;
      flex-shrink: 0;
    }

    .header-info {
      flex: 1;
      h2 { margin: 0; font-size: 18px; font-weight: 700; color: #111827; line-height: 1.3; }
      p  { margin: 4px 0 0; font-size: 13px; color: #6b7280; }
    }

    .close-btn { margin: -8px -8px 0 0; color: #9ca3af; }

    .dialog-body {
      padding: 16px 20px;
      display: flex;
      flex-direction: column;
      gap: 12px;
    }

    .detail-row {
      display: flex;
      align-items: flex-start;
      gap: 12px;
      font-size: 14px;
      color: #374151;

      mat-icon {
        font-size: 18px;
        width: 18px;
        height: 18px;
        color: #9ca3af;
        flex-shrink: 0;
        margin-top: 1px;
      }

      &.notes span { white-space: pre-wrap; line-height: 1.5; }
    }

    .dialog-actions {
      display: flex;
      justify-content: flex-end;
      padding: 8px 20px 16px;
    }
  `],
})
export class ScheduleEventDialogComponent {
  activity: ActivityItem;

  get title(): string {
    return this.activity.notes?.trim() || `Activity #${this.activity.activityId}`;
  }

  constructor(
    @Inject(MAT_DIALOG_DATA) public data: { activity: ActivityItem },
    public dialogRef: MatDialogRef<ScheduleEventDialogComponent>,
  ) {
    this.activity = data.activity;
  }

  formatDate(date?: string): string {
    if (!date) return '—';
    return new Date(date).toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric', year: 'numeric' });
  }

  formatDuration(mins?: number): string {
    if (!mins) return '—';
    if (mins < 60) return `${mins} min`;
    const h = Math.floor(mins / 60), m = mins % 60;
    return m ? `${h}h ${m}m` : `${h}h`;
  }
}
