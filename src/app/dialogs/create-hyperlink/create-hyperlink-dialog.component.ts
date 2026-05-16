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
  selector: 'app-create-hyperlink-dialog',
  standalone: true,
  imports: [
    CommonModule, FormsModule,
    MatDialogModule, MatButtonModule, MatIconModule,
    MatFormFieldModule, MatInputModule,
    MatProgressSpinnerModule, MatSnackBarModule
  ],
  templateUrl: './create-hyperlink-dialog.component.html',
  styleUrl: './create-hyperlink-dialog.component.scss'
})
export class CreateHyperlinkDialogComponent {
  linkName = '';    // becomes Item_Description (title)
  url = '';
  description = ''; // link type / description
  saving = false;

  // Variant 26 = HyperLinks, ItemTypeId = 7
  constructor(
    public dialogRef: MatDialogRef<CreateHyperlinkDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: { userId: number },
    private itemsService: ItemsService,
    private snackBar: MatSnackBar
  ) {}

  get canSave() { return this.linkName.trim().length > 0 && this.url.trim().length > 0; }

  save() {
    if (!this.canSave) return;
    this.saving = true;
    this.itemsService.createItem({
      userId: this.data.userId,
      itemTypeId: 7,
      variantId: 26,
      description: this.linkName.trim(),
      hyperlinkUrl: this.url.trim(),
      hyperlinkDescription: this.description.trim() || undefined
    }).subscribe({
      next: res => {
        this.saving = false;
        if (res.success) {
          this.snackBar.open('Link saved!', '', { duration: 3000 });
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
