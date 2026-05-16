import { Component, Inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatDialogRef, MAT_DIALOG_DATA, MatDialogModule, MatDialog } from '@angular/material/dialog';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatTooltipModule } from '@angular/material/tooltip';
import { CreateActivityDialogComponent } from '../create-activity/create-activity-dialog.component';
import { CreateNoteDialogComponent } from '../create-note/create-note-dialog.component';
import { CreateHyperlinkDialogComponent } from '../create-hyperlink/create-hyperlink-dialog.component';
import { CreateContactDialogComponent } from '../create-contact/create-contact-dialog.component';
import { CreateCredentialsDialogComponent } from '../create-credentials/create-credentials-dialog.component';
import { CreateEntityDialogComponent } from '../create-entity/create-entity-dialog.component';
import { CreateLocationDialogComponent } from '../create-location/create-location-dialog.component';
import { CreateDocumentDialogComponent } from '../create-document/create-document-dialog.component';
import { CreateKnowledgeDialogComponent } from '../create-knowledge/create-knowledge-dialog.component';
import { CreateWorkunitDialogComponent } from '../create-workunit/create-workunit-dialog.component';
import { CreateMoneyDialogComponent } from '../create-money/create-money-dialog.component';

export interface ItemTypeCard {
  id: number;
  name: string;
  icon: string;
  color: string;
  description: string;
}

@Component({
  selector: 'app-create-item-dialog',
  standalone: true,
  imports: [
    CommonModule,
    MatDialogModule, MatButtonModule, MatIconModule, MatTooltipModule
  ],
  templateUrl: './create-item-dialog.component.html',
  styleUrl: './create-item-dialog.component.scss'
})
export class CreateItemDialogComponent {

  typeCards: ItemTypeCard[] = [
    { id: 1,  name: 'Activity',    icon: 'bolt',          color: '#1565c0', description: 'Log calls, visits, meetings' },
    { id: 6,  name: 'Note',        icon: 'sticky_note_2', color: '#f57c00', description: 'Quick notes and text' },
    { id: 7,  name: 'HyperLink',   icon: 'link',          color: '#0288d1', description: 'URLs and web links' },
    { id: 3,  name: 'Contact',     icon: 'person',        color: '#2e7d32', description: 'People and contacts' },
    { id: 4,  name: 'Document',    icon: 'description',   color: '#6a1b9a', description: 'ID cards, certificates' },
    { id: 5,  name: 'Credentials', icon: 'lock',          color: '#c62828', description: 'Bank & app passwords' },
    { id: 8,  name: 'Entity',      icon: 'business',      color: '#37474f', description: 'Services, businesses, govt' },
    { id: 9,  name: 'Location',    icon: 'place',         color: '#558b2f', description: 'Addresses and places' },
    { id: 10, name: 'Knowledge',   icon: 'psychology',    color: '#4527a0', description: 'Ideas, prompts, memories' },
    { id: 2,  name: 'Task',        icon: 'task_alt',      color: '#00838f', description: 'Tasks and work items' },
    { id: 12, name: 'Money',       icon: 'payments',      color: '#e65100', description: 'Expenses and receipts' },
  ];

  constructor(
    public dialogRef: MatDialogRef<CreateItemDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: { userId: number },
    private dialog: MatDialog
  ) {}

  openType(card: ItemTypeCard) {
    const cfg = { data: { userId: this.data.userId }, disableClose: false };
    let subDialog: ReturnType<MatDialog['open']> | null = null;

    switch (card.id) {
      case 1:  subDialog = this.dialog.open(CreateActivityDialogComponent,   cfg); break;
      case 6:  subDialog = this.dialog.open(CreateNoteDialogComponent,       cfg); break;
      case 7:  subDialog = this.dialog.open(CreateHyperlinkDialogComponent,  cfg); break;
      case 3:  subDialog = this.dialog.open(CreateContactDialogComponent,    cfg); break;
      case 4:  subDialog = this.dialog.open(CreateDocumentDialogComponent,   cfg); break;
      case 5:  subDialog = this.dialog.open(CreateCredentialsDialogComponent,cfg); break;
      case 8:  subDialog = this.dialog.open(CreateEntityDialogComponent,     cfg); break;
      case 9:  subDialog = this.dialog.open(CreateLocationDialogComponent,   cfg); break;
      case 10: subDialog = this.dialog.open(CreateKnowledgeDialogComponent,  cfg); break;
      case 2:  subDialog = this.dialog.open(CreateWorkunitDialogComponent,   cfg); break;
      case 12: subDialog = this.dialog.open(CreateMoneyDialogComponent,      cfg); break;
      default: return;
    }

    this.dialogRef.close(false);

    subDialog.afterClosed().subscribe(saved => {
      if (saved) window.dispatchEvent(new CustomEvent('dclutter:item-created'));
    });
  }

  cancel() { this.dialogRef.close(false); }
}
