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

interface EntVariant { id: number; name: string; icon: string; color: string; }

@Component({
  selector: 'app-create-entity-dialog',
  standalone: true,
  imports: [CommonModule, FormsModule, MatDialogModule, MatButtonModule, MatIconModule,
    MatFormFieldModule, MatInputModule, MatProgressSpinnerModule, MatSnackBarModule],
  templateUrl: './create-entity-dialog.component.html',
  styleUrl: './create-entity-dialog.component.scss'
})
export class CreateEntityDialogComponent {
  variants: EntVariant[] = [
    { id: 27, name: 'Service Entity',       icon: 'support_agent',  color: '#1565c0' },
    { id: 28, name: 'Business Entity',      icon: 'storefront',     color: '#2e7d32' },
    { id: 29, name: 'Govt Organisation',    icon: 'account_balance', color: '#37474f' },
  ];
  selected: EntVariant = this.variants[1];

  name = '';
  website = '';
  hours = '';
  saving = false;

  constructor(
    public dialogRef: MatDialogRef<CreateEntityDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: { userId: number },
    private itemsService: ItemsService,
    private snackBar: MatSnackBar
  ) {}

  get canSave() { return this.name.trim().length > 0; }

  save() {
    if (!this.canSave) return;
    this.saving = true;
    this.itemsService.createItem({
      userId: this.data.userId,
      itemTypeId: 8,
      variantId: this.selected.id,
      description: this.name.trim(),
      entityWebsiteUrl: this.website.trim() || undefined,
      entityAvailabilityHours: this.hours.trim() || undefined,
    }).subscribe({
      next: res => {
        this.saving = false;
        if (res.success) { this.snackBar.open('Entity saved!', '', { duration: 3000 }); this.dialogRef.close(true); }
        else { this.snackBar.open(res.message || 'Failed', 'Close', { duration: 5000 }); }
      },
      error: () => { this.saving = false; this.snackBar.open('API error', 'Close', { duration: 5000 }); }
    });
  }

  cancel() { this.dialogRef.close(false); }
}
