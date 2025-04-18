import {NgModule} from '@angular/core';
import {BrowserModule} from '@angular/platform-browser';

import {AppRoutingModule} from './app-routing.module';
import {AppComponent} from './app.component';
import {LayoutComponent} from './shared/layout/layout.component';
import {HeaderComponent} from './shared/layout/header/header.component';
import {FooterComponent} from './shared/layout/footer/footer.component';
import {HttpClientModule} from "@angular/common/http";
import {MainComponent} from './views/main/main.component';
import {BrowserAnimationsModule} from '@angular/platform-browser/animations';
import {MAT_SNACK_BAR_DEFAULT_OPTIONS, MatSnackBarModule} from "@angular/material/snack-bar";
import {MatMenuModule} from "@angular/material/menu";
import {SliderComponent} from './views/main/slider/slider.component';
import {ServiceCardComponent} from './views/main/service-card/service-card.component';
import {PopularArticlesComponent} from './views/main/popular-articles/popular-articles.component';
import {ReviewsComponent} from './views/main/reviews/reviews.component';
import {SharedModule} from "./shared/shared.module";
import {RouterModule} from "@angular/router";


@NgModule({
  declarations: [
    AppComponent,
    LayoutComponent,
    HeaderComponent,
    FooterComponent,
    MainComponent,
    SliderComponent,
    ServiceCardComponent,
    PopularArticlesComponent,
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
  bootstrap: [AppComponent]
})
export class AppModule {
}
