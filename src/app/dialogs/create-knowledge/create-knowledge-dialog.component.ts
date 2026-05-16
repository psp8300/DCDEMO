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
  selector: 'app-create-knowledge-dialog',
  standalone: true,
  imports: [CommonModule, FormsModule, MatDialogModule, MatButtonModule, MatIconModule,
    MatFormFieldModule, MatInputModule, MatProgressSpinnerModule, MatSnackBarModule],
  templateUrl: './create-knowledge-dialog.component.html',
  styleUrl: './create-knowledge-dialog.component.scss'
})
export class CreateKnowledgeDialogComponent {
  variants = [
    { id: 31, name: 'Prompt',  icon: 'code',         color: '#4527a0', placeholder: 'Your AI prompt or command template…' },
    { id: 32, name: 'Idea',    icon: 'lightbulb',    color: '#f57c00', placeholder: 'Your idea or concept…' },
    { id: 33, name: 'Memory',  icon: 'auto_stories', color: '#1565c0', placeholder: 'Something worth remembering…' },
  ];
  selected = this.variants[1];

  title = '';
  content = '';
  saving = false;

  constructor(
    public dialogRef: MatDialogRef<CreateKnowledgeDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: { userId: number },
    private itemsService: ItemsService, private snackBar: MatSnackBar) {}

  get canSave() { return (this.title.trim() || this.content.trim()).length > 0; }

  save() {
    if (!this.canSave) return;
    this.saving = true;
    const desc = this.title.trim() || this.content.trim().substring(0, 100);
    const full = this.title && this.content ? `${this.title.trim()}\n\n${this.content.trim()}` : (this.title.trim() || this.content.trim());
    this.itemsService.createItem({
      userId: this.data.userId, itemTypeId: 10, variantId: this.selected.id, description: full
    }).subscribe({
      next: res => {
        this.saving = false;
        if (res.success) { this.snackBar.open('Saved!', '', { duration: 3000 }); this.dialogRef.close(true); }
        else { this.snackBar.open(res.message || 'Failed', 'Close', { duration: 5000 }); }
      },
      error: () => { this.saving = false; this.snackBar.open('API error', 'Close', { duration: 5000 }); }
    });
  }

  cancel() { this.dialogRef.close(false); }
}
