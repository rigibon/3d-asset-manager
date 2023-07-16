import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';

import { MatTreeModule } from '@angular/material/tree';
import { MatIconModule } from "@angular/material/icon";
import { MatMenuModule } from '@angular/material/menu';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { MatButtonModule } from "@angular/material/button";
import { MatCheckboxModule } from "@angular/material/checkbox";
import { ScrollingModule } from '@angular/cdk/scrolling';
import { ExplorerComponent } from './components/explorer/explorer.component';
import { MatGridListModule } from '@angular/material/grid-list';
import { MatTabsModule } from '@angular/material/tabs';
import { MatToolbarModule } from '@angular/material/toolbar';
import { AssetCardComponent } from './components/asset-card/asset-card.component';
import { HeaderComponent } from './components/header/header.component';
import { CategoriesBarComponent } from './components/categories-bar/categories-bar.component';
import { AssetsPanelComponent } from './components/assets-panel/assets-panel.component';
import { LoginComponent } from './components/login/login.component';
import { Routes, RouterModule, Router } from "@angular/router";
import { BoardComponent } from './components/board/board.component';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { SettingsComponent } from './components/settings/settings.component';
import { HttpClientModule } from '@angular/common/http';
import { AddAssetComponent } from './components/add-asset/add-asset.component';
import { FormsModule } from "@angular/forms";
import { AuthInterceptor } from './helpers/auth.interceptor';

import { HTTP_INTERCEPTORS } from "@angular/common/http";
import { AuthGuard } from './helpers/auth.guard';
import { RegisterComponent } from './components/register/register.component';

const routes: Routes = [
  {path: "board/:category/search/:keyword", component: BoardComponent, canActivate: [AuthGuard]},
  {path: "board/:category", component: BoardComponent, canActivate: [AuthGuard]},
  {path: "login", component: LoginComponent},
  {path: "register", component: RegisterComponent},
  {path: "board/Model", component: BoardComponent, canActivate: [AuthGuard]},
  {path: "**", redirectTo: "board/Model", pathMatch: "full" }
];
 
@NgModule({
  declarations: [
    AppComponent,
    ExplorerComponent,
    AssetCardComponent,
    HeaderComponent,
    CategoriesBarComponent,
    AssetsPanelComponent,
    LoginComponent,
    BoardComponent,
    SettingsComponent,
    AddAssetComponent,
    RegisterComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    MatTreeModule,
    MatIconModule,
    MatMenuModule,
    MatButtonModule,
    BrowserAnimationsModule,
    MatCheckboxModule,
    ScrollingModule,
    MatGridListModule,
    MatTabsModule,
    MatToolbarModule,
    MatProgressSpinnerModule,
    HttpClientModule,
    RouterModule.forRoot(routes),
    FormsModule
  ],
  providers: [{ provide: HTTP_INTERCEPTORS, useClass: AuthInterceptor, multi: true }],
  bootstrap: [AppComponent]
})
export class AppModule { 

  ngOnInit() {
    var coll = document.getElementsByClassName("collapsible");
    var content = document.getElementById("content");
    var i;

    for (i = 0; i < coll.length; i++) {
      //coll);
      coll[i].addEventListener("click", function() {
        // content.toggle("active");
        if (content!.style.display === "block") {
          content!.style.display = "none";
        } else {
          content!.style.display = "block";
        }
      });
    }
  }
}
