import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { MatCardModule } from '@angular/material/card';
import { MatInputModule } from '@angular/material/input';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatChipsModule } from '@angular/material/chips';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { MatTooltipModule } from '@angular/material/tooltip';
import { AuthService } from '../../services/auth.service';
import { ListsService, ListItem } from '../../services/lists.service';
import { CreateListDialogComponent } from '../../dialogs/create-list/create-list-dialog.component';
import { ListItemsDialogComponent } from '../../dialogs/list-items/list-items-dialog.component';

@Component({
  selector: 'app-lists',
  standalone: true,
  imports: [
    CommonModule, FormsModule,
    MatCardModule, MatInputModule, MatIconModule, MatButtonModule,
    MatProgressSpinnerModule, MatChipsModule,
    MatDialogModule, MatSnackBarModule, MatTooltipModule,
  ],
  templateUrl: './lists.component.html',
  styleUrl: './lists.component.scss'
})
export class ListsComponent implements OnInit {
  lists: ListItem[] = [];
  searchTerm = '';
  loading = true;
  error = '';
  deletingId: number | null = null;

  private userId = 0;

  constructor(
    private auth: AuthService,
    private listsService: ListsService,
    private router: Router,
    private dialog: MatDialog,
    private snackBar: MatSnackBar
  ) {}

  ngOnInit(): void {
    const user = this.auth.getUser();
    if (!user) { this.router.navigate(['/login']); return; }
    this.userId = user.userId;
    this.loadLists();
  }

  loadLists(): void {
    this.loading = true;
    this.error = '';
    this.listsService.getLists(this.userId).subscribe({
      next: res => {
        this.loading = false;
        this.lists = res.success ? res.lists : [];
        if (!res.success) this.error = res.message;
      },
      error: () => {
        this.loading = false;
        this.error = 'Could not load lists. Is the API running?';
      }
    });
  }

  get filteredLists(): ListItem[] {
    if (!this.searchTerm.trim()) return this.lists;
    const term = this.searchTerm.toLowerCase();
    return this.lists.filter(l => l.listName.toLowerCase().includes(term));
  }

  openCreateList(): void {
    const ref = this.dialog.open(CreateListDialogComponent, {
      data: { userId: this.userId },
      panelClass: 'dclutter-dialog',
    });
    ref.afterClosed().subscribe(created => {
      if (created) this.loadLists();
    });
  }

  openListItems(list: ListItem): void {
    this.dialog.open(ListItemsDialogComponent, {
      data: { userId: this.userId, list },
      panelClass: 'dclutter-dialog',
      maxHeight: '90vh',
    });
  }

  deleteList(event: MouseEvent, list: ListItem): void {
    event.stopPropagation();
    if (this.deletingId === list.listId) {
      // Second tap confirms
      this.deletingId = null;
      this.listsService.deleteList(this.userId, list.listId).subscribe({
        next: res => {
          if (res.success) {
            this.snackBar.open(`"${list.listName}" deleted`, '', { duration: 3000 });
            this.loadLists();
          } else {
            this.snackBar.open(res.message || 'Delete failed', 'Close', { duration: 5000 });
          }
        },
        error: () => this.snackBar.open('API error', 'Close', { duration: 5000 })
      });
    } else {
      // First tap — arm it
      this.deletingId = list.listId;
      setTimeout(() => {
        if (this.deletingId === list.listId) this.deletingId = null;
      }, 3000);
    }
  }

  formatDate(date?: string): string {
    if (!date) return '—';
    return new Date(date).toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric' });
  }
}
