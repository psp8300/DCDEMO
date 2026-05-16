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
  selector: 'app-create-document-dialog',
  standalone: true,
  imports: [CommonModule, FormsModule, MatDialogModule, MatButtonModule, MatIconModule,
    MatFormFieldModule, MatInputModule, MatProgressSpinnerModule, MatSnackBarModule],
  templateUrl: './create-document-dialog.component.html',
  styleUrl: './create-document-dialog.component.scss'
})
export class CreateDocumentDialogComponent {
  variants = [
    { id: 16, name: 'ID Document',      icon: 'badge',          color: '#6a1b9a' },
    { id: 17, name: 'General Document', icon: 'description',    color: '#1565c0' },
  ];
  selected = this.variants[0];

  name = '';
  docNumber = '';
  issuedDate = '';
  expiryDate = '';
  authority = '';
  saving = false;

  constructor(
    public dialogRef: MatDialogRef<CreateDocumentDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: { userId: number },
    private itemsService: ItemsService, private snackBar: MatSnackBar) {}

  get canSave() { return this.name.trim().length > 0; }

  save() {
    if (!this.canSave) return;
    this.saving = true;
    // Pack extra fields into description since no local extension table
    const parts = [this.name.trim()];
    if (this.docNumber) parts.push(`No: ${this.docNumber}`);
    if (this.issuedDate) parts.push(`Issued: ${this.issuedDate}`);
    if (this.expiryDate) parts.push(`Expiry: ${this.expiryDate}`);
    if (this.authority) parts.push(`By: ${this.authority}`);

    this.itemsService.createItem({
      userId: this.data.userId, itemTypeId: 4, variantId: this.selected.id,
      description: parts.join(' | ')
    }).subscribe({
      next: res => {
        this.saving = false;
        if (res.success) { this.snackBar.open('Document saved!', '', { duration: 3000 }); this.dialogRef.close(true); }
        else { this.snackBar.open(res.message || 'Failed', 'Close', { duration: 5000 }); }
      },
      error: () => { this.saving = false; this.snackBar.open('API error', 'Close', { duration: 5000 }); }
    });
  }

  cancel() { this.dialogRef.close(false); }
}
