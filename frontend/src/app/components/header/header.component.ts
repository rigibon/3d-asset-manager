import { Component } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Category } from 'src/app/common/category';
import { AssetsService } from 'src/app/services/assets.service';
import { FolderService } from 'src/app/services/folder.service';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.css']
})
export class HeaderComponent {
  // @ts-ignore
  selectedFolder: Folder;
  // @ts-ignore
  selectedCategory: Category;

  constructor(private router: Router, public folderService: FolderService, private route: ActivatedRoute, public assetsService: AssetsService) { }

  ngOnInit() {
    this.folderService.selectedFolder.subscribe(value => {
      this.selectedFolder = value;
    });
  }

  doSearch(value: string) {
    this.assetsService.getCategoryByName(this.route.snapshot.paramMap.get("category")!).subscribe((category: any) => {
      this.router.navigateByUrl(`/board/${category.name}/search/${value}`);
    });
  }

  logout() {
    window.localStorage.removeItem("token");
    this.router.navigate(["login"]);
  }
}
