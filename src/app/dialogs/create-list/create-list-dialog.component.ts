import { Component, Inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA, MatDialogModule } from '@angular/material/dialog';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { ListsService } from '../../services/lists.service';

@Component({
  selector: 'app-create-list-dialog',
  standalone: true,
  imports: [
    CommonModule, FormsModule,
    MatDialogModule, MatButtonModule, MatIconModule,
    MatFormFieldModule, MatInputModule,
    MatProgressSpinnerModule, MatSnackBarModule,
  ],
  template: `
    <div class="dialog-wrapper">
      <div class="dialog-header">
        <div class="dialog-title">
          <mat-icon>playlist_add</mat-icon>
          New List
        </div>
        <button mat-icon-button (click)="cancel()"><mat-icon>close</mat-icon></button>
      </div>

      <div class="dialog-body">
        <mat-form-field appearance="outline" class="full-width">
          <mat-label>List name</mat-label>
          <input matInput [(ngModel)]="listName" placeholder="e.g. Home Project, Tax 2026…"
                 (keyup.enter)="save()" autofocus maxlength="80" />
          <mat-hint align="end">{{ listName.length }}/80</mat-hint>
        </mat-form-field>
      </div>

      <div class="dialog-footer">
        <button mat-button (click)="cancel()">Cancel</button>
        <button mat-flat-button color="primary" [disabled]="!canSave || saving" (click)="save()">
          <mat-spinner diameter="18" *ngIf="saving"></mat-spinner>
          <span *ngIf="!saving">Create List</span>
        </button>
      </div>
    </div>
  `,
  styles: [`
    .dialog-wrapper { display: flex; flex-direction: column; width: 400px; max-width: 100%; }
    .dialog-header { display: flex; align-items: center; justify-content: space-between; padding: 20px 24px 0; }
    .dialog-title { display: flex; align-items: center; gap: 10px; font-size: 18px; font-weight: 700; color: #1a237e;
      mat-icon { color: #3949ab; } }
    .dialog-body { padding: 20px 24px 8px; }
    .full-width { width: 100%; }
    .dialog-footer { display: flex; justify-content: flex-end; gap: 8px; padding: 12px 24px 20px;
      border-top: 1px solid #f0f0f0; }
    mat-spinner { display: inline-block; }
  `]
})
export class CreateListDialogComponent {
  listName = '';
  saving = false;

  constructor(
    public dialogRef: MatDialogRef<CreateListDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: { userId: number },
    private listsService: ListsService,
    private snackBar: MatSnackBar
  ) {}

  get canSave(): boolean { return this.listName.trim().length > 0; }

  save(): void {
    if (!this.canSave) return;
    this.saving = true;
    this.listsService.createList(this.data.userId, this.listName.trim()).subscribe({
      next: res => {
        this.saving = false;
        if (res.success) {
          this.snackBar.open('List created!', '', { duration: 3000 });
          this.dialogRef.close(true);
        } else {
          this.snackBar.open(res.message || 'Failed to create list', 'Close', { duration: 5000 });
        }
      },
      error: () => {
        this.saving = false;
        this.snackBar.open('Could not connect to API.', 'Close', { duration: 5000 });
      }
    });
  }

  cancel(): void { this.dialogRef.close(false); }
}
