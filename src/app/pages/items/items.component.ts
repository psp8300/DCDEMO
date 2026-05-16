import { Component, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { Subject } from 'rxjs';
import { debounceTime, distinctUntilChanged } from 'rxjs/operators';
import { MatCardModule } from '@angular/material/card';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatChipsModule } from '@angular/material/chips';
import { MatPaginatorModule, PageEvent } from '@angular/material/paginator';
import { MatTooltipModule } from '@angular/material/tooltip';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';
import { ItemsService, ItemModel, ItemType } from '../../services/items.service';
import { AuthService } from '../../services/auth.service';
import { CreateItemDialogComponent } from '../../dialogs/create-item/create-item-dialog.component';

@Component({
  selector: 'app-items',
  standalone: true,
  imports: [
    CommonModule, FormsModule,
    MatCardModule, MatIconModule, MatButtonModule,
    MatFormFieldModule, MatInputModule,
    MatProgressSpinnerModule, MatChipsModule,
    MatPaginatorModule, MatTooltipModule, MatDialogModule
  ],
  templateUrl: './items.component.html',
  styleUrl: './items.component.scss'
})
export class ItemsComponent implements OnInit, OnDestroy {
  items: ItemModel[] = [];
  itemTypes: ItemType[] = [];
  loading = true;
  typesLoading = true;
  error = '';

  searchTerm = '';
  selectedTypeId: number | null = null;
  currentPage = 0;
  pageSize = 50;
  totalCount = 0;

  private searchSubject = new Subject<string>();
  private userId = 0;
  private itemCreatedListener = () => {
    this.currentPage = 0;
    this.loadItemTypes();
    this.loadItems();
  };

  constructor(
    private itemsService: ItemsService,
    private auth: AuthService,
    private router: Router,
    private dialog: MatDialog
  ) {}

  ngOnInit() {
    const user = this.auth.getUser();
    if (!user) { this.router.navigate(['/login']); return; }
    this.userId = user.userId;

    this.searchSubject.pipe(debounceTime(400), distinctUntilChanged()).subscribe(() => {
      this.currentPage = 0;
      this.loadItems();
    });

    window.addEventListener('dclutter:item-created', this.itemCreatedListener);

    this.loadItemTypes();
    this.loadItems();
  }

  loadItemTypes() {
    this.typesLoading = true;
    this.itemsService.getItemTypes(this.userId).subscribe({
      next: res => {
        this.itemTypes = res.success ? res.types : [];
        this.typesLoading = false;
      },
      error: () => { this.typesLoading = false; }
    });
  }

  loadItems() {
    this.loading = true;
    this.error = '';
    this.itemsService.getItems(
      this.userId,
      this.searchTerm || undefined,
      this.selectedTypeId ?? undefined,
      this.currentPage + 1,
      this.pageSize
    ).subscribe({
      next: res => {
        if (res.success) {
          this.items = res.items;
          this.totalCount = res.totalCount;
        } else {
          this.error = res.message || 'Failed to load items.';
        }
        this.loading = false;
      },
      error: () => {
        this.error = 'Could not connect to API. Make sure DClutterAPI is running.';
        this.loading = false;
      }
    });
  }

  onSearch(value: string) {
    this.searchSubject.next(value);
  }

  selectType(typeId: number | null) {
    this.selectedTypeId = typeId;
    this.currentPage = 0;
    this.loadItems();
  }

  onPageChange(event: PageEvent) {
    this.currentPage = event.pageIndex;
    this.pageSize = event.pageSize;
    this.loadItems();
  }

  openCreateItem() {
    this.dialog.open(CreateItemDialogComponent, {
      data: { userId: this.userId },
      panelClass: 'dclutter-dialog'
    });
  }

  openCreateActivity() { this.openCreateItem(); }

  ngOnDestroy() {
    window.removeEventListener('dclutter:item-created', this.itemCreatedListener);
  }

  goHome() {
    this.router.navigate(['/home']);
  }

  getItemLabel(item: ItemModel): string {
    return item.shortDescription || item.description || `Item #${item.itemId}`;
  }

  getItemSub(item: ItemModel): string {
    if (item.shortDescription && item.description && item.shortDescription !== item.description) {
      return item.description.length > 120 ? item.description.slice(0, 120) + '…' : item.description;
    }
    return '';
  }

  typeIcon(typeName: string): string {
    const map: Record<string, string> = {
      Activity:       'bolt',
      WorkUnit:       'task_alt',
      Contact:        'person',
      Document:       'description',
      Location:       'place',
      Credentials:    'lock',
      Notes:          'sticky_note_2',
      HyperLink:      'link',
      Entity:         'business',
      Money:          'payments',
      Records:        'folder_special',
      'Knowledge Repo': 'psychology',
      Tag:            'label',
    };
    return map[typeName] ?? 'inventory_2';
  }

  formatDate(d?: string): string {
    if (!d) return '—';
    return new Date(d).toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' });
  }
}
