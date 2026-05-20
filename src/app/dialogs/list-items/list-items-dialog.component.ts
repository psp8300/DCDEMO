import { Component, Inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatDialogRef, MAT_DIALOG_DATA, MatDialogModule, MatDialog } from '@angular/material/dialog';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatChipsModule } from '@angular/material/chips';
import { MatTooltipModule } from '@angular/material/tooltip';
import { ListsService } from '../../services/lists.service';
import { ItemModel } from '../../services/items.service';
import { ItemDetailDialogComponent } from '../item-detail/item-detail-dialog.component';

@Component({
  selector: 'app-list-items-dialog',
  standalone: true,
  imports: [
    CommonModule,
    MatDialogModule, MatButtonModule, MatIconModule,
    MatProgressSpinnerModule, MatChipsModule, MatTooltipModule,
  ],
  template: `
    <div class="list-items-wrapper">
      <!-- Header -->
      <div class="dialog-header">
        <div class="dialog-title">
          <mat-icon>list_alt</mat-icon>
          <span>{{ data.list.listName }}</span>
        </div>
        <button mat-icon-button (click)="close()"><mat-icon>close</mat-icon></button>
      </div>

      <!-- Loading -->
      <div class="centered" *ngIf="loading">
        <mat-spinner diameter="36"></mat-spinner>
      </div>

      <!-- Error -->
      <div class="error-box" *ngIf="error">
        <mat-icon>error_outline</mat-icon>
        <span>{{ error }}</span>
      </div>

      <!-- Items -->
      <div class="items-body" *ngIf="!loading">
        <!-- Empty state -->
        <div class="empty-state" *ngIf="items.length === 0 && !error">
          <mat-icon>inbox</mat-icon>
          <p>No items in this list</p>
        </div>

        <!-- Item rows -->
        <div class="item-row" *ngFor="let item of items" (click)="openDetail(item)" matRipple>
          <div class="item-type-icon" [style.background]="typeColor(item.itemTypeName) + '18'">
            <mat-icon [style.color]="typeColor(item.itemTypeName)">{{ typeIcon(item.itemTypeName) }}</mat-icon>
          </div>
          <div class="item-info">
            <div class="item-name">{{ getLabel(item) }}</div>
            <div class="item-sub">
              <span class="type-chip">{{ item.itemTypeName }}</span>
              <span class="inactive-chip" *ngIf="!item.isActive">Inactive</span>
            </div>
          </div>
          <mat-icon class="chevron">chevron_right</mat-icon>
        </div>
      </div>

      <!-- Footer -->
      <div class="dialog-footer">
        <span class="count-label" *ngIf="!loading">{{ items.length }} item{{ items.length !== 1 ? 's' : '' }}</span>
        <button mat-button (click)="close()">Close</button>
      </div>
    </div>
  `,
  styles: [`
    .list-items-wrapper {
      display: flex;
      flex-direction: column;
      width: 500px;
      max-width: 100%;
      max-height: 80vh;
    }

    .dialog-header {
      display: flex;
      align-items: center;
      justify-content: space-between;
      padding: 20px 24px 12px;
      border-bottom: 1px solid #f0f0f0;
      flex-shrink: 0;
    }

    .dialog-title {
      display: flex;
      align-items: center;
      gap: 10px;
      font-size: 18px;
      font-weight: 700;
      color: #1a237e;
      mat-icon { color: #3949ab; }
    }

    .items-body {
      flex: 1;
      overflow-y: auto;
      padding: 8px 0;
    }

    .item-row {
      display: flex;
      align-items: center;
      gap: 14px;
      padding: 12px 20px;
      cursor: pointer;
      transition: background 0.12s;

      &:hover { background: #f5f7ff; }
      &:not(:last-child) { border-bottom: 1px solid #f5f5f5; }
    }

    .item-type-icon {
      width: 40px;
      height: 40px;
      border-radius: 10px;
      display: flex;
      align-items: center;
      justify-content: center;
      flex-shrink: 0;
      mat-icon { font-size: 20px; width: 20px; height: 20px; }
    }

    .item-info {
      flex: 1;
      min-width: 0;
    }

    .item-name {
      font-size: 14px;
      font-weight: 600;
      color: #1a1a2e;
      white-space: nowrap;
      overflow: hidden;
      text-overflow: ellipsis;
    }

    .item-sub {
      display: flex;
      gap: 6px;
      margin-top: 3px;
      align-items: center;
    }

    .type-chip {
      font-size: 11px;
      background: #e8eaf6;
      color: #3949ab;
      padding: 2px 8px;
      border-radius: 8px;
      font-weight: 600;
    }

    .inactive-chip {
      font-size: 11px;
      background: #fff3e0;
      color: #e65100;
      padding: 2px 8px;
      border-radius: 8px;
    }

    .chevron { color: #ccc; flex-shrink: 0; }

    .centered { display: flex; justify-content: center; align-items: center; padding: 40px; }

    .error-box { display: flex; align-items: center; gap: 8px; padding: 12px 20px;
      background: #ffebee; color: #c62828; }

    .empty-state {
      display: flex;
      flex-direction: column;
      align-items: center;
      padding: 48px;
      color: #aaa;
      gap: 8px;
      mat-icon { font-size: 48px; width: 48px; height: 48px; }
      p { margin: 0; font-size: 14px; }
    }

    .dialog-footer {
      display: flex;
      align-items: center;
      justify-content: space-between;
      padding: 12px 20px 16px;
      border-top: 1px solid #f0f0f0;
      flex-shrink: 0;
    }

    .count-label { font-size: 13px; color: #888; }
  `]
})
export class ListItemsDialogComponent implements OnInit {
  items: ItemModel[] = [];
  loading = true;
  error = '';

  constructor(
    public dialogRef: MatDialogRef<ListItemsDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: { userId: number; list: { listId: number; listName: string } },
    private listsService: ListsService,
    private dialog: MatDialog
  ) {}

  ngOnInit(): void {
    this.listsService.getListItems(this.data.userId, this.data.list.listId).subscribe({
      next: res => {
        this.loading = false;
        this.items = res.success ? res.items : [];
        if (!res.success) this.error = res.message ?? 'Failed to load.';
      },
      error: () => {
        this.loading = false;
        this.error = 'Could not load list items.';
      }
    });
  }

  openDetail(item: ItemModel): void {
    this.dialog.open(ItemDetailDialogComponent, {
      data: { userId: this.data.userId, item },
      panelClass: 'dclutter-dialog',
      maxHeight: '90vh',
    });
  }

  getLabel(item: ItemModel): string {
    return item.shortDescription || item.description || `Item #${item.itemId}`;
  }

  typeIcon(typeName: string): string {
    const map: Record<string, string> = {
      Activity: 'bolt', WorkUnit: 'task_alt', Contact: 'person',
      Document: 'description', Location: 'place', Credentials: 'lock',
      Notes: 'sticky_note_2', HyperLink: 'link', Entity: 'business',
      Money: 'payments', 'Knowledge Repo': 'psychology',
    };
    return map[typeName] ?? 'inventory_2';
  }

  typeColor(typeName: string): string {
    const map: Record<string, string> = {
      Activity: '#e65100', WorkUnit: '#1565c0', Contact: '#2e7d32',
      Document: '#6a1b9a', Location: '#00838f', Credentials: '#c62828',
      Notes: '#f57c00', HyperLink: '#0277bd', Entity: '#37474f',
      Money: '#2e7d32', 'Knowledge Repo': '#4527a0',
    };
    return map[typeName] ?? '#3949ab';
  }

  close(): void { this.dialogRef.close(); }
}
