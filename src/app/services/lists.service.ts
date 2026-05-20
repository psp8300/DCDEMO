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

@Injectable({ providedIn: 'root' })
export class ListsService {

  getLists(_userId: number): Observable<ListsResponse> {
    return of({ success: true, lists: [], message: 'OK' });
  }

  createList(_userId: number, _listName: string): Observable<{ success: boolean; listId?: number; message?: string }> {
    return of({ success: true, listId: 0, message: 'List created' });
  }

  getListItems(_userId: number, _listId: number): Observable<ListItemsResponse> {
    return of({ success: true, items: [], totalCount: 0 });
  }

  deleteList(_userId: number, _listId: number): Observable<{ success: boolean; message?: string }> {
    return of({ success: true, message: 'List deleted' });
  }
}
