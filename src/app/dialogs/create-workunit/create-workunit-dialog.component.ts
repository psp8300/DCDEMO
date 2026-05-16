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
  selector: 'app-create-workunit-dialog',
  standalone: true,
  imports: [CommonModule, FormsModule, MatDialogModule, MatButtonModule, MatIconModule,
    MatFormFieldModule, MatInputModule, MatProgressSpinnerModule, MatSnackBarModule],
  templateUrl: './create-workunit-dialog.component.html',
  styleUrl: './create-workunit-dialog.component.scss'
})
export class CreateWorkunitDialogComponent {
  taskName = '';
  details = '';
  dueDate = '';
  priority = 'Medium';
  priorities = ['Low', 'Medium', 'High', 'Critical'];
  saving = false;

  // Variant 36 = Task, ItemTypeId = 2
  constructor(
    public dialogRef: MatDialogRef<CreateWorkunitDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: { userId: number },
    private itemsService: ItemsService, private snackBar: MatSnackBar) {}

  get canSave() { return this.taskName.trim().length > 0; }

  save() {
    if (!this.canSave) return;
    this.saving = true;
    const parts = [this.taskName.trim()];
    if (this.priority !== 'Medium') parts.push(`[${this.priority}]`);
    if (this.dueDate) parts.push(`Due: ${this.dueDate}`);
    if (this.details.trim()) parts.push(this.details.trim());

    this.itemsService.createItem({
      userId: this.data.userId, itemTypeId: 2, variantId: 36,
      description: parts.join(' — ')
    }).subscribe({
      next: res => {
        this.saving = false;
        if (res.success) { this.snackBar.open('Task saved!', '', { duration: 3000 }); this.dialogRef.close(true); }
        else { this.snackBar.open(res.message || 'Failed', 'Close', { duration: 5000 }); }
      },
      error: () => { this.saving = false; this.snackBar.open('API error', 'Close', { duration: 5000 }); }
    });
  }

  cancel() { this.dialogRef.close(false); }
}
