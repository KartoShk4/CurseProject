import {NgModule} from '@angular/core';
import {BrowserModule} from '@angular/platform-browser';

import {AppRoutingModule} from './app-routing.module';
import {AppComponent} from './app.component';
import {HttpClientModule} from "@angular/common/http";
import {MainComponent} from './views/main/main.component';
import {BrowserAnimationsModule} from '@angular/platform-browser/animations';
import {MAT_SNACK_BAR_DEFAULT_OPTIONS, MatSnackBarModule} from "@angular/material/snack-bar";
import {MatMenuModule} from "@angular/material/menu";
import {SliderComponent} from './views/main/slider/slider.component';
import {ServiceCardComponent} from './views/main/service-card/service-card.component';
import {ReviewsComponent} from './views/main/reviews/reviews.component';
import {SharedModule} from "./shared/shared.module";
import {RouterModule} from "@angular/router";


@NgModule({
  declarations: [
    AppComponent,
    MainComponent,
    SliderComponent,
    ServiceCardComponent,
    ReviewsComponent,
  ],
  imports: [
    BrowserModule,
    RouterModule,
    HttpClientModule,
    MatSnackBarModule,
    MatMenuModule,
    AppRoutingModule,
    BrowserAnimationsModule,
    SharedModule,

  ],
  providers: [
    {provide: MAT_SNACK_BAR_DEFAULT_OPTIONS, useValue: {duration: 2500}}
  ],
  exports: [],
  bootstrap: [AppComponent]
})
export class AppModule {
}
