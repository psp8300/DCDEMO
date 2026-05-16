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
  selector: 'app-create-money-dialog',
  standalone: true,
  imports: [CommonModule, FormsModule, MatDialogModule, MatButtonModule, MatIconModule,
    MatFormFieldModule, MatInputModule, MatProgressSpinnerModule, MatSnackBarModule],
  templateUrl: './create-money-dialog.component.html',
  styleUrl: './create-money-dialog.component.scss'
})
export class CreateMoneyDialogComponent {
  description = '';
  amount = '';
  date = new Date().toISOString().split('T')[0];
  category = '';
  merchant = '';
  saving = false;

  // Variant 37 = Expenses/Receipts, ItemTypeId = 12
  constructor(
    public dialogRef: MatDialogRef<CreateMoneyDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: { userId: number },
    private itemsService: ItemsService, private snackBar: MatSnackBar) {}

  get canSave() { return this.description.trim().length > 0 || this.amount.trim().length > 0; }

  save() {
    if (!this.canSave) return;
    this.saving = true;
    const parts: string[] = [];
    if (this.description.trim()) parts.push(this.description.trim());
    if (this.amount) parts.push(`₹${this.amount}`);
    if (this.merchant.trim()) parts.push(`@ ${this.merchant.trim()}`);
    if (this.category.trim()) parts.push(`[${this.category.trim()}]`);
    if (this.date) parts.push(this.date);

    this.itemsService.createItem({
      userId: this.data.userId, itemTypeId: 12, variantId: 37,
      description: parts.join(' — ')
    }).subscribe({
      next: res => {
        this.saving = false;
        if (res.success) { this.snackBar.open('Expense saved!', '', { duration: 3000 }); this.dialogRef.close(true); }
        else { this.snackBar.open(res.message || 'Failed', 'Close', { duration: 5000 }); }
      },
      error: () => { this.saving = false; this.snackBar.open('API error', 'Close', { duration: 5000 }); }
    });
  }

  cancel() { this.dialogRef.close(false); }
}
