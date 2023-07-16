import { Component } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { AssetsService } from 'src/app/services/assets.service';

@Component({
  selector: 'app-board',
  templateUrl: './board.component.html',
  styleUrls: ['./board.component.css']
})
export class BoardComponent {
  id: string = "";
  openSettings: boolean = false;

  constructor(private route: ActivatedRoute, private assetsService: AssetsService) { 
    this.assetsService.openSettings.subscribe(value => {
      this.openSettings = value;
    })
  }

  ngOnInit() {
    this.id = this.route.snapshot.paramMap.get("id")!;
  }

  changeBackground(event: any){
    const active = document.querySelector('.active-btn');
    if(active){
      active.classList.remove('active-btn')
    }
    event.target.className = "active-btn";
  }
}
