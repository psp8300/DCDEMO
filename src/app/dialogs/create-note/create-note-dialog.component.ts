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
import { ItemsService } from '../../services/items.service';

@Component({
  selector: 'app-create-note-dialog',
  standalone: true,
  imports: [
    CommonModule, FormsModule,
    MatDialogModule, MatButtonModule, MatIconModule,
    MatFormFieldModule, MatInputModule,
    MatProgressSpinnerModule, MatSnackBarModule
  ],
  templateUrl: './create-note-dialog.component.html',
  styleUrl: './create-note-dialog.component.scss'
})
export class CreateNoteDialogComponent {
  title = '';
  content = '';
  saving = false;

  // Variant 25 = Notes, ItemTypeId = 6
  constructor(
    public dialogRef: MatDialogRef<CreateNoteDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: { userId: number },
    private itemsService: ItemsService,
    private snackBar: MatSnackBar
  ) {}

  get canSave() { return this.content.trim().length > 0; }

  save() {
    if (!this.canSave) return;
    this.saving = true;
    this.itemsService.createItem({
      userId: this.data.userId,
      itemTypeId: 6,
      variantId: 25,
      description: this.title.trim() || this.content.trim().substring(0, 80),
      noteTitle: this.title.trim() || undefined,
      noteContent: this.content.trim()
    }).subscribe({
      next: res => {
        this.saving = false;
        if (res.success) {
          this.snackBar.open('Note saved!', '', { duration: 3000 });
          this.dialogRef.close(true);
        } else {
          this.snackBar.open(res.message || 'Failed to save', 'Close', { duration: 5000 });
        }
      },
      error: () => {
        this.saving = false;
        this.snackBar.open('Could not connect to API.', 'Close', { duration: 5000 });
      }
    });
  }

  cancel() { this.dialogRef.close(false); }
}
