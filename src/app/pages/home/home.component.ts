import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatSidenavModule } from '@angular/material/sidenav';
import { MatListModule } from '@angular/material/list';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatMenuModule } from '@angular/material/menu';
import { AuthService, UserInfo } from '../../services/auth.service';
import { ItemsService } from '../../services/items.service';
import { ListsService } from '../../services/lists.service';
import { ActivityService } from '../../services/activity.service';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [
    CommonModule,
    MatToolbarModule, MatSidenavModule, MatListModule,
    MatIconModule, MatButtonModule, MatCardModule, MatMenuModule
  ],
  templateUrl: './home.component.html',
  styleUrl: './home.component.scss'
})
export class HomeComponent implements OnInit {
  user: UserInfo | null = null;
  activeMenu = 'dashboard';

  menuItems = [
    { id: 'dashboard', label: 'Dashboard',   icon: 'dashboard',      route: null },
    { id: 'lists',     label: 'Lists',        icon: 'list_alt',       route: '/lists' },
    { id: 'items',     label: 'Items',        icon: 'inventory_2',    route: '/items' },
    { id: 'activity',  label: 'Activity Log', icon: 'history',        route: '/activity' },
    { id: 'schedule',  label: 'Schedule',     icon: 'calendar_month', route: null },
    { id: 'settings',  label: 'Settings',     icon: 'settings',       route: null },
  ];

  stats = [
    { label: 'Total Lists',      value: '—', icon: 'list_alt',     color: '#3949ab' },
    { label: 'Active Items',     value: '—', icon: 'check_circle', color: '#2e7d32' },
    { label: 'Activities Today', value: '—', icon: 'bolt',         color: '#f57c00' },
    { label: 'Scheduled',        value: '0', icon: 'event',        color: '#6a1b9a' },
  ];

  constructor(
    private auth: AuthService,
    private router: Router,
    private itemsService: ItemsService,
    private listsService: ListsService,
    private activityService: ActivityService
  ) {}

  ngOnInit() {
    this.user = this.auth.getUser();
    const userId = this.user?.userId ?? 1;
    const today = new Date().toISOString().slice(0, 10);

    this.listsService.getLists(userId).subscribe(res => {
      this.stats[0].value = String(res.lists.length);
    });

    this.itemsService.getItems(userId, undefined, undefined, 1, 1000).subscribe(res => {
      this.stats[1].value = String(res.totalCount);
    });

    this.activityService.getActivity(userId).subscribe(res => {
      const todayCount = res.activities.filter(a => a.date?.slice(0, 10) === today).length;
      this.stats[2].value = String(todayCount);
    });
  }

  navigate(item: { id: string; route: string | null }) {
    if (item.route) {
      this.router.navigate([item.route]);
    } else {
      this.activeMenu = item.id;
    }
  }

  logout() {
    this.auth.logout();
    this.router.navigate(['/login']);
  }

  getInitials(): string {
    if (!this.user) return 'U';
    return this.user.displayName.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2);
  }
}
