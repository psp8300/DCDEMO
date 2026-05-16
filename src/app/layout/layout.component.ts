import { Component, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, RouterModule, NavigationEnd } from '@angular/router';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatMenuModule } from '@angular/material/menu';
import { MatDividerModule } from '@angular/material/divider';
import { MatTooltipModule } from '@angular/material/tooltip';
import { filter, Subscription } from 'rxjs';
import { AuthService, UserInfo } from '../services/auth.service';

interface NavItem {
  id: string;
  label: string;
  icon: string;
  route: string;
}

@Component({
  selector: 'app-layout',
  standalone: true,
  imports: [
    CommonModule,
    RouterModule,
    MatIconModule,
    MatButtonModule,
    MatMenuModule,
    MatDividerModule,
    MatTooltipModule,
  ],
  templateUrl: './layout.component.html',
  styleUrl: './layout.component.scss',
})
export class LayoutComponent implements OnInit, OnDestroy {
  user: UserInfo | null = null;
  sidebarOpen = true;
  pageTitle = 'Dashboard';

  navItems: NavItem[] = [
    { id: 'home',     label: 'Dashboard',   icon: 'dashboard',      route: '/home' },
    { id: 'lists',    label: 'Lists',        icon: 'list_alt',       route: '/lists' },
    { id: 'items',    label: 'Items',        icon: 'inventory_2',    route: '/items' },
    { id: 'activity', label: 'Activity Log', icon: 'history',        route: '/activity' },
    { id: 'schedule', label: 'Schedule',     icon: 'calendar_month', route: '/schedule' },
  ];

  private routerSub!: Subscription;

  constructor(private auth: AuthService, private router: Router) {}

  get currentYear() { return new Date().getFullYear(); }

  get initials(): string {
    if (!this.user) return 'U';
    return this.user.displayName.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2);
  }

  ngOnInit(): void {
    this.user = this.auth.getUser();
    this.updateTitle(this.router.url);
    this.routerSub = this.router.events
      .pipe(filter(e => e instanceof NavigationEnd))
      .subscribe((e: any) => this.updateTitle(e.urlAfterRedirects));
  }

  ngOnDestroy(): void {
    this.routerSub?.unsubscribe();
  }

  toggleSidebar(): void {
    this.sidebarOpen = !this.sidebarOpen;
  }

  logout(): void {
    this.auth.logout();
    this.router.navigate(['/login']);
  }

  private updateTitle(url: string): void {
    const match = this.navItems.find(n => url.startsWith(n.route));
    this.pageTitle = match ? match.label : 'DClutter';
  }
}
