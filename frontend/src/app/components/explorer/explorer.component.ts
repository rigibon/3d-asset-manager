import { Component } from '@angular/core';
import { NestedTreeControl } from '@angular/cdk/tree';
import { MatTreeNestedDataSource } from '@angular/material/tree';
import { FolderService } from 'src/app/services/folder.service';
import { AssetsService } from 'src/app/services/assets.service';
import { NgForm } from '@angular/forms';
import { Folder } from 'src/app/common/folder';

interface FoodNode {
  name: string;
  children?: FoodNode[];
}

@Component({
  selector: 'app-explorer',
  templateUrl: './explorer.component.html',
  styleUrls: ['./explorer.component.css']
})
export class ExplorerComponent {
  treeControl = new NestedTreeControl<FoodNode>(node => node.children);
  dataSource = new MatTreeNestedDataSource<FoodNode>();
  folders = [];
  // @ts-ignore
  selectedFolder: Folder;

  constructor(public folderService: FolderService, public assetsService: AssetsService) {
    this.folderService.getFolderById(1).subscribe((data: any) => {
      // console.log(data);
      this.folderService.selectedFolder.next(data);
    });
    this.folderService.fold.next("models");

    this.folderService.getAllFolders().subscribe(this.processFolders());
    this.folderService.selectedFolder.subscribe(value => {
      this.selectedFolder = value;
    });

    this.assetsService.reloadAssets.subscribe(value => {
      if (value) {
        this.folderService.getAllFolders().subscribe(this.processFolders());
        this.assetsService.reloadAssets.next(false);
      }
    });
  }

  processFolders() {
    this.dataSource = new MatTreeNestedDataSource<FoodNode>();
    return (data: any) => {
      for (var i = 0; i < data.length; i++) {
        var node = {name: data[i].name, children: [], type: "folder", id: data[i].id};

        this.getChildrenAssets(data[i], node);
      }
    }
  }

  getChildrenAssets(folder: any, node: any) {
    if (folder.name === "favorites") {
      this.assetsService.getFavorites().subscribe((data) => {
        var assets = [];

        var type = "model";
  
        for (var i = 0; i < data.length; i++) {
          if (data[i].category.id === 2) {
            type = "material";
          } else if (data[i].category.id === 3) {
            type = "image";
          }

          var asset = { name: data[i].name, children: [], type: type, asset: data[i]};
  
          assets.push(asset);
  
          // @ts-ignore
          node.children = assets;
        }
  
        var TREE_DATA = this.dataSource.data;
        TREE_DATA.push(node);
        this.dataSource.data = TREE_DATA;
      });
    } else {
      this.assetsService.getAssetsByFolder(folder).subscribe((data: any) => {
        var assets = [];

        var type = "model";
  
        for (var i = 0; i < data.length; i++) {
          if (data[i].category.id === 2) {
            type = "material";
          } else if (data[i].category.id === 3) {
            type = "image";
          }

          var asset = { name: data[i].name, children: [], type: type, asset: data[i]};
  
          assets.push(asset);
  
          // @ts-ignore
          node.children = assets;
        }
  
        var TREE_DATA = this.dataSource.data;
        TREE_DATA.push(node);
        this.dataSource.data = TREE_DATA;
      });
    }
  }

  hasChild = (_: number, node: FoodNode) => !!node.children && node.children.length > 0;

  onClickProjectSpan(event: any) {
    var content = document.getElementById("content");

    if (content!.style.display === "block") {
      content!.style.display = "none";
    } else {
      content!.style.display = "block";
    }
  }

  isProjectTabExpanded(): boolean {
    var content = document.getElementById("content");

    if (content!.style.display === "block") {
      return true;
    } else {
      return false;
    }
  }

  selectFolder(name: String, folder: number): void {
    this.folderService.getFolderById(folder).subscribe((data: any) => {
      this.folderService.selectedFolder.next(data);
    });
    this.folderService.fold.next(name);
  }

  openSettingsOnAsset(asset: any): void {
    this.assetsService.openSettings.next(true);
    this.assetsService.selectedAsset.next(asset);
  }

  openFolderCreation(): void {
    this.folderService.createFolderPopup.next(true);
  }
}
