import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatCardModule } from '@angular/material/card';
import { MatIconModule } from '@angular/material/icon';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { AuthService } from '../../services/auth.service';
import { ActivityService, ActivityItem } from '../../services/activity.service';

@Component({
  selector: 'app-activity',
  standalone: true,
  imports: [CommonModule, MatCardModule, MatIconModule, MatProgressSpinnerModule],
  templateUrl: './activity.component.html',
  styleUrl: './activity.component.scss'
})
export class ActivityComponent implements OnInit {
  activities: ActivityItem[] = [];
  loading = true;
  error = '';

  constructor(private auth: AuthService, private activityService: ActivityService) {}

  ngOnInit() {
    const user = this.auth.getUser();
    if (user) {
      this.activityService.getActivity(user.userId).subscribe({
        next: (res) => {
          this.loading = false;
          this.activities = res.success ? res.activities : [];
          if (!res.success) this.error = res.message;
        },
        error: () => {
          this.loading = false;
          this.error = 'Could not load activity. Is the API running?';
        }
      });
    }
  }

  formatDate(date?: string): string {
    if (!date) return '—';
    return new Date(date).toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric' });
  }

  formatDuration(mins?: number): string {
    if (!mins) return '—';
    if (mins < 60) return `${mins}m`;
    return `${Math.floor(mins / 60)}h ${mins % 60}m`;
  }
}
