import { Injectable } from '@angular/core';
import { HttpClient, HttpResponse } from '@angular/common/http';
import { Observable, map, catchError, of, Subject, BehaviorSubject } from "rxjs";
import { Asset } from '../common/asset';
import { Category } from '../common/category';
import { Folder } from '../common/folder';

@Injectable({
  providedIn: 'root'
})
export class AssetsService {
  public openSettings: BehaviorSubject<boolean> = new BehaviorSubject<boolean>(false);
  public selectedAsset: BehaviorSubject<Asset> = new BehaviorSubject<Asset>(new Asset(0, "", 1, "", 0, "", "", false));
  public assetToMove: BehaviorSubject<Asset> = new BehaviorSubject<Asset>(new Asset(0, "", 1, "", 0, "", "", false));
  public reloadAssets: BehaviorSubject<boolean> = new BehaviorSubject<boolean>(false);
  public moveAssetPopup: BehaviorSubject<boolean> = new BehaviorSubject<boolean>(false);
  assetUrl: string = "https://assets-backend.onrender.com";
  userEmail: string = "";

  constructor(private http: HttpClient) { }

  getAllAssets(): Observable<Asset[]> {
    return this.http.get<GetResponseAssets>(this.assetUrl).pipe(
      map(response => response._embedded.assets)
    )
  }

  getFavorites(): Observable<any> {
    var favoritesUrl = this.assetUrl + `/favorites`;
    
    return this.http.get<GetResponseAssets>(favoritesUrl).pipe(
      map(response => response)
    );
  }

  getAssetsByFolder(folder: Folder): Observable<GetResponseAssets> {
    var assetsByFolderUrl = this.assetUrl + `/findByFolderIdCustom/${folder.id}`;
    
    return this.http.get<GetResponseAssets>(assetsByFolderUrl).pipe(
      map(response => response)
    );
  }

  getAssetById(id: number): Observable<GetResponseAsset> {
    var assetById = this.assetUrl + "/" + id;

    return this.http.get<GetResponseAsset>(assetById).pipe(
      map(response => response)
    );
  }

  getAssetByIdd(id: number): Observable<Asset> {
    var assetById = this.assetUrl + "/" + id;

    return this.http.get<Asset>(assetById).pipe(
      map(response => response)
    );
  }

  getAssetsByFolderAndCategory(folder: number, category: number): Observable<Asset[]> {
    var assetsByFolderAndCategory = this.assetUrl + `/search/findByFolderIdAndCategoryId?folder=${folder}&category=${category}`;

    return this.http.get<GetResponseAssets>(assetsByFolderAndCategory).pipe(
      map(response => response._embedded.assets)
    );
  }

  getSearchByFolderAndCategory(folder: number, category: number, theKeyword: string): Observable<Asset[]> {
    const searchUrl = this.assetUrl + `/search/findByFolderIdAndCategoryIdAndNameContaining?folder=${folder}&category=${category}&keyword=${theKeyword}`;

    return this.http.get<GetResponseAssets>(searchUrl).pipe(
      map(response => response._embedded.assets)
    );
  }

  getFavAssetsByFolderAndCategory(category: number): Observable<Asset[]> {
    var favAssetsByFolderAndCategory = this.assetUrl + `/favorites/${category}`;

    // @ts-ignore
    return this.http.get<GetResponseAssets>(favAssetsByFolderAndCategory).pipe(  
      map(response => response)
    )
  }

  getFolder(url: string): Observable<boolean> {
    return this.http
      .get(url, { observe: 'response', responseType: 'blob' })
      .pipe(
        map(response => {
          return true;
        }),
        catchError(() => of(false))
      );
  }

  getCategories(): Observable<Category[]> {
    return this.http.get<GetResponseCategories>("https://assets-backend.onrender.com/api/categories").pipe(
      map(response => response._embedded.categories)
    );
  }

  getCategoryById(id: number): Observable<Category> {
    return this.http.get<Category>(`https://assets-backend.onrender.com/api/categories/${id}`).pipe(
      map(response => response)
    );
  }

  getCategoryByName(name: string): Observable<Category> {
    return this.http.get<Category>(`https://assets-backend.onrender.com/api/categories/${name}`).pipe(
      map(response => response)
    );
  }

  uploadAsset(formData: FormData, headers: any): any {
    return this.http.post("https://assets-backend.onrender.com/uploadModel", formData, { headers: headers });
  }

  getCategoryByAsset(asset: Asset): any {
    return this.http.get(`https://assets-backend.onrender.com/${asset.id}/category`);
  }

  downloadModel(asset: Asset): any {
    return this.http.get(`https://assets-backend.onrender.com/downloadModel/${asset.name}`, { responseType: 'blob' as 'json' }).pipe(map(data => data));
  }
  
  downloadImage(asset: Asset): any {
    return this.http.get(`https://assets-backend.onrender.com/downloadFile/${asset.name}`, { responseType: 'blob' as 'json' }).pipe(map(data => data));
  }

  getNewAsset(newAsset: any) {
    return this.http.post("https://assets-backend.onrender.com/uploadsw", newAsset).pipe(map(data => {}));
  }

  deleteAsset(id: number) {
    return this.http.delete(`https://assets-backend.onrender.com/${id}`).pipe(map(data => {}));
  }

  favAsset(asset: Asset, assetEntity: any) {
    var fav = !asset.favorite;
    // console.log(asset);

    var assetRequest = { name: assetEntity.name, categoryId: assetEntity.category.id, src: assetEntity.src, folderId: assetEntity.folder.id, format: assetEntity.format, favorite: fav };
    //assetRequest);
    return this.http.put(`https://assets-backend.onrender.com/${asset.id}`, assetRequest).pipe(map(data => {
      // @ts-ignore
      asset.favorite = data.favorite;
    }));
    
  }
  
  moveAssetToFolder(asset: Asset, folder: Folder) {
    var assetRequest = { name: asset.name, categoryId: asset.category, src: asset.src, folderId: folder.id, format: asset.format, favorite: asset.favorite };
    
    return this.http.put(`https://assets-backend.onrender.com/${asset.id}`, assetRequest).pipe(map(data => {
      // @ts-ignore
      // console.log(data);
    }));
  }

  saveDataUrlToFile(dataUrl: any, folderPath: any, fileName: any) {
    // Extract the base64-encoded data from the Data URL
    const base64Data = dataUrl.split(',')[1];
  
    // Convert the base64-encoded data to a binary string
    const binaryData = atob(base64Data);
  
    // Create a Blob object from the binary string
    const blob = new Blob([binaryData]);
  
    // Save the Blob object to the desired folder
    const fileUrl = `${folderPath}/${fileName}`;
    this.saveBlobToFile(blob, fileUrl);
  }
  
  saveBlobToFile(blob: any, fileUrl: any) {
    // Create a link element
    const link = document.createElement('a');
    link.href = URL.createObjectURL(blob);
    link.download = fileUrl;
  
    // Simulate a click event to trigger the download
    link.click();
  
    // Clean up the URL object
    URL.revokeObjectURL(link.href);
  }

  dataURItoBlob(dataURI: any) {
    var byteString = atob(dataURI.split(',')[1]);

    var mimeString = dataURI.split(',')[0].split(':')[1].split(';')[0];

    var ab = new ArrayBuffer(byteString.length);
    var ia = new Uint8Array(ab);
    for (var i = 0; i < byteString.length; i++) {
        ia[i] = byteString.charCodeAt(i);
    }

    return new Blob([ab], {type: mimeString});
  }

  uploadDataURI(dataURI: any, assetImageSrc: string) {
    var blob = this.dataURItoBlob(dataURI);
    // //dataURI);

    var fd = new FormData();
    fd.append("file", blob, assetImageSrc);
    this.http.post("https://assets-backend.onrender.com/uploadFile", fd).pipe(map((response: any) => {
      const body = response.body;
      const headers = response.headers;
      // //response)
      return body;
    })).subscribe(result => {
      // //result);
    });
  }

  duplicateFile(asset: any) {
    return this.http.post("https://assets-backend.onrender.com/duplicateFile", asset).pipe(map(data => {}));
  }

  login(creds: Credentials) {

    this.userEmail = creds.email;

    return this.http.post("https://assets-backend.onrender.com/login", creds, {
      observe: "response",
    }).pipe(map((response: HttpResponse<any>) => {
      const body = response.body;
      const headers = response.headers;

      const bearerToken = headers.get("Authorization")!;
      const token = bearerToken.replace("Bearer ", "");

      localStorage.setItem("token", token);

      return body;
    }));
  }

  register(userRegistrationRequest: any) {

    return this.http.post("https://assets-backend.onrender.com/register", userRegistrationRequest, {
      observe: "response",
    }).pipe(map((response: HttpResponse<any>) => {

    }));
  }

  getToken() {
    return localStorage.getItem("token");
  }
}

interface GetResponseAssets {
  _embedded: {
    assets: Asset[]
  }
}

interface GetResponseAsset {
  asset: Asset
}

interface GetResponseCategories {
  _embedded: {
    categories: Category[]
  }
}

export interface Credentials {
  email: string;
  password: string;
}