import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Folder } from '../common/folder';
import { Observable, map, BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class FolderService {
  folderUrl = "https://assets-backend.onrender.com/api/folders";
  public selectedFolder: BehaviorSubject<Folder> = new BehaviorSubject<Folder>(new Folder(0, ""));
  public fold: BehaviorSubject<String> = new BehaviorSubject<String>("");
  public createFolderPopup: BehaviorSubject<boolean> = new BehaviorSubject<boolean>(false);

  constructor(private http: HttpClient) { }

  getAllFolders(): Observable<Folder[]> {
    return this.http.get<GetResponseFolders>(this.folderUrl).pipe(
      map(response => response._embedded.folders)
    );
  }

  createFolder(newFolder: any) {
    return this.http.post("https://assets-backend.onrender.com/api/folders/uploadsw", newFolder).pipe(map(data => {}));
  }

  getFolderById(folder: number): Observable<Folder> {
    return this.http.get<Folder>(`${this.folderUrl}/${folder}`).pipe(
      map(response => response));
  }

}

interface GetResponseFolders {
  _embedded: {
    folders: Folder[]
  }
}

// interface GetResponseFolder {
//   _embedded: {
//     folder: Folder;
//   }
// }