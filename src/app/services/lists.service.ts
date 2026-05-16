import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';

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

const MOCK_LISTS: ListItem[] = [
  { listId: 1, listName: 'Shopping List',        createdDate: '2026-04-01', lastUsedDate: '2026-05-15' },
  { listId: 2, listName: 'Work Tasks',            createdDate: '2026-03-15', lastUsedDate: '2026-05-14' },
  { listId: 3, listName: 'Home Maintenance',      createdDate: '2026-02-10', lastUsedDate: '2026-04-30' },
  { listId: 4, listName: 'Books to Read',         createdDate: '2026-01-05', lastUsedDate: '2026-05-10' },
  { listId: 5, listName: 'Project Alpha Backlog', createdDate: '2026-03-20', lastUsedDate: '2026-05-13' },
  { listId: 6, listName: 'Weekend Plans',         createdDate: '2026-05-01', lastUsedDate: '2026-05-12' },
];

@Injectable({ providedIn: 'root' })
export class ListsService {

  getLists(_userId: number): Observable<ListsResponse> {
    return of({ success: true, lists: MOCK_LISTS, message: 'OK' });
  }
}
