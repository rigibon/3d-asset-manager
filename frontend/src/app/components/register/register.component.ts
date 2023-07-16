import { Component } from '@angular/core';
import { NgForm } from '@angular/forms';
import { Router } from '@angular/router';
import { AssetsService } from 'src/app/services/assets.service';

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.css']
})
export class RegisterComponent {
  creds = {
    username: "",
    email: "",
    password: ""
  }

  constructor(public assetsService: AssetsService, public router: Router) { }

  register(form: NgForm) {
    var userRequest = { name: this.creds.username, email: this.creds.email, password: this.creds.password };

    this.assetsService.register(userRequest)
      .subscribe(response => {
        this.router.navigate(["/login"]);
    });
  }
}
