import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { MatCardModule } from '@angular/material/card';
import { MatInputModule } from '@angular/material/input';
import { MatIconModule } from '@angular/material/icon';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatChipsModule } from '@angular/material/chips';
import { AuthService } from '../../services/auth.service';
import { ListsService, ListItem } from '../../services/lists.service';

@Component({
  selector: 'app-lists',
  standalone: true,
  imports: [
    CommonModule, FormsModule,
    MatCardModule, MatInputModule, MatIconModule,
    MatProgressSpinnerModule, MatChipsModule
  ],
  templateUrl: './lists.component.html',
  styleUrl: './lists.component.scss'
})
export class ListsComponent implements OnInit {
  lists: ListItem[] = [];
  searchTerm = '';
  loading = true;
  error = '';

  constructor(private auth: AuthService, private listsService: ListsService) {}

  ngOnInit() {
    const user = this.auth.getUser();
    if (user) {
      this.listsService.getLists(user.userId).subscribe({
        next: (res) => {
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
  }

  get filteredLists(): ListItem[] {
    if (!this.searchTerm.trim()) return this.lists;
    const term = this.searchTerm.toLowerCase();
    return this.lists.filter(l => l.listName.toLowerCase().includes(term));
  }

  formatDate(date?: string): string {
    if (!date) return '—';
    return new Date(date).toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric' });
  }
}
