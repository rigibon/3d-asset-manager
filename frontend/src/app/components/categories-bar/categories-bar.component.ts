import { Component } from '@angular/core';
import { Category } from 'src/app/common/category';
import { AssetsService } from 'src/app/services/assets.service';
import { FolderService } from 'src/app/services/folder.service';

@Component({
  selector: 'app-categories-bar',
  templateUrl: './categories-bar.component.html',
  styleUrls: ['./categories-bar.component.css']
})
export class CategoriesBarComponent {
  // @ts-ignore
  private selectedFolder: Folder;
  // @ts-ignore
  public selectedCategory: Category = new Category(1, "Model");
  // @ts-ignore
  public categories: Category[];

  constructor(public folderService: FolderService, public assetsService: AssetsService) {
    this.folderService.selectedFolder.subscribe(value => {
      this.selectedFolder = value;
    });

    this.listCategories();
  }

  changeBackground(event: any) {
    const active = document.querySelector('.active-btn');
    if (active) {
      active.classList.remove('active-btn')
    }
    event.target.className = "active-btn";
  }

  listCategories() {
    this.assetsService.getCategories().subscribe(
      data => {
        this.categories = data;
      }
    )
  }

  openCity(cityName: any, clickedButtonId: any, targetButtonId: any) {
    var i;
    var x = Array.from(document.getElementsByClassName("city") as HTMLCollectionOf<HTMLElement>);
    for (i = 0; i < x.length; i++) {
      x[i].style.display = "none";
    }
    document.getElementById(cityName)!.style.display = "block";

    const active = document.querySelector('.clicked');

    var clickedButton = document.getElementById(clickedButtonId);
    // var targetButton = document.getElementById(targetButtonId);
    //clickedButton);
    clickedButton!.classList.add('clicked');
    active!.classList.remove('clicked');
  }

  selectCategory(category: Category) {
    this.selectedCategory = category;
  }
}
