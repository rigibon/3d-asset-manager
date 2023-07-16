import { Component } from '@angular/core';
import { NgForm } from '@angular/forms';
import { Router } from '@angular/router';
import { AssetsService, Credentials } from 'src/app/services/assets.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent {
  creds: Credentials = {
    email: "",
    password: ""
  }

  constructor(private assetsService: AssetsService, private router: Router) { 

  }

  login(form: NgForm) {
    this.assetsService.login(this.creds)
      .subscribe(response => {
        this.router.navigate(["/board"]);
      })
  }
}
