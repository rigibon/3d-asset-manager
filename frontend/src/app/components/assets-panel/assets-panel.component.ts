import { Component } from '@angular/core';
import { NgForm } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { Asset } from 'src/app/common/asset';
import { AssetsService } from 'src/app/services/assets.service';
import { FolderService } from 'src/app/services/folder.service';
import { HttpHeaders } from '@angular/common/http';
import { Folder } from 'src/app/common/folder';
import { Category } from 'src/app/common/category';

@Component({
  selector: 'app-assets-panel',
  templateUrl: './assets-panel.component.html',
  styleUrls: ['./assets-panel.component.css']
})
export class AssetsPanelComponent {
  // @ts-ignore
  assets: Asset[];
  // @ts-ignore
  assetToMove: Asset;
  // @ts-ignore
  folders: Folder[];
  category: number = 1;
  // @ts-ignore
  selectedFolder: Folder = new Folder(1);
  // @ts-ignore
  fold: String = "";
  // @ts-ignore
  selectedCategory: Category;
  file: any;

  constructor(public assetsService: AssetsService, public folderService: FolderService, private route: ActivatedRoute) {
    this.folderService.selectedFolder.subscribe(value => {
      this.selectedFolder = value;
      this.ngOnInit();
    });
    this.folderService.createFolderPopup.subscribe(value => {
      var folderModal = document.getElementById("myFolderModal")!;
      if (folderModal) {
        folderModal.style.display = "block";
      }
    });
    this.assetsService.moveAssetPopup.subscribe(value => {
      var moveAssetModal = document.getElementById("myMoveAssetModal")!;
      if (moveAssetModal) {
        moveAssetModal.style.display = "block";
      }
    });
    this.assetsService.assetToMove.subscribe(value => {
      this.assetToMove = value;
    });
    this.folderService.fold.subscribe(value => {
      this.fold = value;
    });
    this.assetsService.reloadAssets.subscribe(value => {
      if (value) {
        this.assetsService.reloadAssets.next(false);
        this.assetsService.getCategoryByName(this.route.snapshot.paramMap.get("category")!).subscribe((category: any) => {
          this.selectedCategory = category;
          var searchMode = this.route.snapshot.paramMap.has("keyword");

          this.assetsService.getAssetsByFolderAndCategory(this.selectedFolder.id, this.selectedCategory.id).subscribe(this.processAssets());
        });
      }
    })
  }

  ngOnInit(): void {

    this.route.paramMap.subscribe((params) => {
      this.folderService.getAllFolders().subscribe(this.processFolders());
      if (this.route.snapshot.paramMap.has("category")) {
        this.assetsService.getCategoryByName(this.route.snapshot.paramMap.get("category")!).subscribe((category: any) => {
          this.selectedCategory = category;
          var searchMode = this.route.snapshot.paramMap.has("keyword");

          if (!searchMode) {
            this.assetsService.getAssetsByFolderAndCategory(this.selectedFolder.id, this.selectedCategory.id).subscribe(this.processAssets());
          } else {
            const theKeyword: string = this.route.snapshot.paramMap.get("keyword")!;
            this.assetsService.getSearchByFolderAndCategory(this.selectedFolder.id, this.selectedCategory.id, theKeyword).subscribe(this.processAssets());
          }
        });
      } else {
        this.assetsService.getAllAssets().subscribe(this.processAssets());
      }
    });

    // Get the modal
    var modal = document.getElementById("myModal")!;
    var folderModal = document.getElementById("myFolderModal")!;

    // Get the button that opens the modal
    var btn = document.getElementById("addAssetButton");

    // Get the <span> element that closes the modal
    var span = document.getElementsByClassName("close")[0];

    // When the user clicks on the button, open the modal
    // @ts-ignore
    if (btn) {
      btn.onclick = function() {
        modal.style.display = "block";
      }
    }

    if (span) {
      // When the user clicks on <span> (x), close the modal
      // @ts-ignore
      span.onclick = function() {
        modal.style.display = "none";
      }
    }

    window.onclick = function(event) {
      if (event.target == modal) {
        modal.style.display = "none";
      }

      if (event.target == folderModal) {
        folderModal.style.display = "none";
      }
    }
  }

  onChange(event: any) {
    this.file = event.target.files[0];
  }

  onSubmit(form: NgForm) {
    var formData: FormData = new FormData();

    formData.append("model", this.file);

    var headers = new HttpHeaders();

    headers = headers.append("enctype", "multipart/form-data");

    var modal = document.getElementById("myModal")!;

    this.assetsService.uploadAsset(formData, headers).subscribe((res: any) => {
      console.log(res);
      // @ts-ignore
      var modelName = res.fileName;
      modelName = modelName.slice(0, -4);

      // @ts-ignore
      var newAsset = { name: modelName + ".glb", categoryId: 1, src: modelName + ".png", folderId: 1, format: "glTF/GLB" };

      this.assetsService.getNewAsset(newAsset).subscribe((data: any) => {
        modal.style.display = "none";
        // this.ngOnInit();
        this.assetsService.reloadAssets.next(true);
      });
    });
  }

  onSubmitFolder(form: any) {
    var formData: FormData = new FormData();

    formData.append("folderName", form.value.folderName);

    var headers = new HttpHeaders();

    headers = headers.append("enctype", "multipart/form-data");

    var folderModal = document.getElementById("myFolderModal")!;

    var newFolder = { name: form.value.folderName };

    this.folderService.createFolder(newFolder).subscribe((res: any) => {
      folderModal.style.display = "none";
      // this.ngOnInit();
      this.assetsService.reloadAssets.next(true);
      this.folderService.getAllFolders().subscribe(this.processFolders());
    })
    //form.value.folderName);
  }

  closeFolderModal() {
    var folderModal = document.getElementById("myFolderModal")!;

    folderModal.style.display = "none";
  }

  closeMoveAssetModal() {
    var moveAssetModal = document.getElementById("myMoveAssetModal")!;

    moveAssetModal.style.display = "none";
  }

  processAssets() {
    return (data: any)  => {
      // console.log(data);
      this.assets = data;
      //this.assets);
    }
  }

  processFolders() {
    return (data: any) => {
      // console.log(data);
      this.folders = data;
      //this.assets);
    }
  }

  moveAsset(asset: Asset, folder: Folder) {
    this.closeMoveAssetModal();
    this.assetsService.moveAssetToFolder(asset, folder).subscribe((data: any) => {
      this.folderService.selectedFolder.next(folder);
      this.assetsService.reloadAssets.next(true);
    });
  }
}
