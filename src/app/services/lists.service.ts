import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';
import { ItemModel } from './items.service';

export interface ListItem {
  listId: number;
  listName: string;
  createdDate?: string;
  lastUsedDate?: string;
}

export interface ListsResponse {
  success: boolean;
  lists: ListItem[];
  message: string;
}

export interface ListItemsResponse {
  success: boolean;
  items: ItemModel[];
  totalCount: number;
  message?: string;
}

let nextListId = 200;

const MOCK_LISTS: ListItem[] = [
  { listId: 1,  listName: 'Work Contacts',       createdDate: '2026-01-10', lastUsedDate: '2026-05-20' },
  { listId: 2,  listName: 'Personal Documents',   createdDate: '2026-01-15', lastUsedDate: '2026-04-20' },
  { listId: 3,  listName: 'App Credentials',      createdDate: '2026-02-01', lastUsedDate: '2026-05-25' },
  { listId: 4,  listName: 'Home & Bills',         createdDate: '2026-02-10', lastUsedDate: '2026-05-15' },
  { listId: 5,  listName: 'Project Tasks',        createdDate: '2026-03-05', lastUsedDate: '2026-05-28' },
  { listId: 6,  listName: 'Knowledge Base',       createdDate: '2026-04-01', lastUsedDate: '2026-05-27' },
  { listId: 7,  listName: 'Useful Links',         createdDate: '2026-04-15', lastUsedDate: '2026-05-22' },
  { listId: 8,  listName: 'Service Providers',    createdDate: '2026-05-01', lastUsedDate: '2026-05-18' },
];

const LIST_ITEMS: Record<number, ItemModel[]> = {
  1: [
    { itemId: 3,  description: 'John Smith – personal contact',       shortDescription: 'John Smith',    itemTypeId: 3,  itemTypeName: 'Contact',     isActive: true, createdDate: '2026-05-01' },
    { itemId: 12, description: 'Sarah Johnson – emergency contact',   shortDescription: 'Sarah Johnson', itemTypeId: 3,  itemTypeName: 'Contact',     isActive: true, createdDate: '2026-02-14' },
  ],
  2: [
    { itemId: 4,  description: 'Passport – Indian Government',        shortDescription: 'Passport',      itemTypeId: 4,  itemTypeName: 'Document',    isActive: true, createdDate: '2026-04-20' },
  ],
  3: [
    { itemId: 5,  description: 'Netflix account credentials',         shortDescription: 'Netflix',       itemTypeId: 5,  itemTypeName: 'Credentials', isActive: true, createdDate: '2026-03-15' },
    { itemId: 15, description: 'AWS console login credentials',       shortDescription: 'AWS Console',   itemTypeId: 5,  itemTypeName: 'Credentials', isActive: true, createdDate: '2026-01-10' },
  ],
  4: [
    { itemId: 11, description: 'Monthly rent payment – May 2026',     shortDescription: 'Rent – May',    itemTypeId: 12, itemTypeName: 'Money',       isActive: true, createdDate: '2026-05-01' },
    { itemId: 17, description: 'Electricity bill – ₹1,840 May 2026',  shortDescription: 'Electricity',   itemTypeId: 12, itemTypeName: 'Money',       isActive: true, createdDate: '2026-05-05' },
  ],
  5: [
    { itemId: 2,  description: 'Buy groceries and household supplies', shortDescription: 'Groceries',    itemTypeId: 2,  itemTypeName: 'WorkUnit',    isActive: true, createdDate: '2026-05-11' },
    { itemId: 14, description: 'Deploy dashboard feature by Friday',   shortDescription: 'Deploy Dashboard', itemTypeId: 2, itemTypeName: 'WorkUnit', isActive: true, createdDate: '2026-05-14' },
  ],
  6: [
    { itemId: 10, description: 'How to use RxJS operators effectively', shortDescription: 'RxJS Tips',    itemTypeId: 10, itemTypeName: 'Knowledge', isActive: true, createdDate: '2026-05-13' },
    { itemId: 19, description: 'Best practices for Angular state mgmt', shortDescription: 'Angular State', itemTypeId: 10, itemTypeName: 'Knowledge', isActive: true, createdDate: '2026-05-12' },
  ],
  7: [
    { itemId: 7,  description: 'Angular documentation site',           shortDescription: 'Angular Docs', itemTypeId: 7,  itemTypeName: 'HyperLink',   isActive: true, createdDate: '2026-05-08' },
    { itemId: 18, description: 'GitHub repository link – main project', shortDescription: 'GitHub Repo', itemTypeId: 7,  itemTypeName: 'HyperLink',   isActive: true, createdDate: '2026-05-09' },
  ],
  8: [
    { itemId: 8,  description: 'Tech Solutions Pvt Ltd – service',    shortDescription: 'Tech Solutions', itemTypeId: 8, itemTypeName: 'Entity',      isActive: true, createdDate: '2026-04-10' },
    { itemId: 20, description: 'City Telecom – service provider',     shortDescription: 'City Telecom',   itemTypeId: 8, itemTypeName: 'Entity',      isActive: true, createdDate: '2026-03-20' },
  ],
};

@Injectable({ providedIn: 'root' })
export class ListsService {

  private lists: ListItem[] = MOCK_LISTS.map(l => ({ ...l }));

  getLists(_userId: number): Observable<ListsResponse> {
    return of({ success: true, lists: [...this.lists], message: 'OK' });
  }

  createList(_userId: number, listName: string): Observable<{ success: boolean; listId?: number; message?: string }> {
    const listId = ++nextListId;
    this.lists.push({ listId, listName, createdDate: new Date().toISOString().split('T')[0] });
    return of({ success: true, listId, message: 'List created' });
  }

  getListItems(_userId: number, listId: number): Observable<ListItemsResponse> {
    const items = LIST_ITEMS[listId] ?? [];
    return of({ success: true, items, totalCount: items.length });
  }

  deleteList(_userId: number, listId: number): Observable<{ success: boolean; message?: string }> {
    this.lists = this.lists.filter(l => l.listId !== listId);
    return of({ success: true, message: 'List deleted' });
  }
}
