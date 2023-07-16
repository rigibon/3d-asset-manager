import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { Asset } from 'src/app/common/asset';
import { AssetsService } from 'src/app/services/assets.service';

@Component({
  selector: 'app-settings',
  templateUrl: './settings.component.html',
  styleUrls: ['./settings.component.css']
})
export class SettingsComponent {
  openSettings: boolean = false;
  // @ts-ignore
  selectedAsset: any;

  constructor(public assetsService: AssetsService, public router: Router) {
    this.assetsService.openSettings.subscribe(value => {
      this.openSettings = value;
    });
    this.assetsService.selectedAsset.subscribe(value => {
      this.assetsService.getAssetByIdd(value.id).subscribe(asset => {
        // console.log(asset);
        this.selectedAsset = asset;
      })
    })
  }

  deleteAsset(id: number): void {
    this.assetsService.deleteAsset(id).subscribe((data: any) => {
      this.openSettings = false;
      this.assetsService.openSettings.next(false);
      this.assetsService.reloadAssets.next(true);
    })
  }

  downloadAsset(asset: Asset): void {
    this.assetsService.getCategoryByAsset(asset).subscribe((data: any) => {
      if (data.name === "Model") {
        // console.log("A");
        // this.router.navigate([`http://localhost:5500/downloadModel/${asset.name}`]);
        this.assetsService.downloadModel(asset).subscribe((data: any) => {
            // console.log(data);
            const a = document.createElement('a');
            const file = new Blob([data], {type: data.type});
            a.href = URL.createObjectURL(file);
            a.download = asset.name;
            a.click();
        });
      } else if (data.name === "Images") {
        this.assetsService.downloadImage(asset).subscribe((data: any) => {
          // console.log(data);
          const a = document.createElement('a');
          const file = new Blob([data], {type: data.type});
          a.href = URL.createObjectURL(file);
          a.download = asset.name;
          a.click();
      });
      }
    })
  }

  openOnEditor(asset: Asset): void {
    // this.router.navigate([`http://localhost:8080/${asset.name}`]);
    window.location.href = `http://localhost:8080?model=${asset.name}`;
  }
}
