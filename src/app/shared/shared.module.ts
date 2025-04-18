import {ModalComponent} from "./components/modal/modal.component";
import {TruncateWordsPipe} from "./pipes/truncate.pipe";
import {NgModule} from "@angular/core";
import {CommonModule} from "@angular/common";
import {FormsModule, ReactiveFormsModule} from "@angular/forms";
import {PopularArticlesComponent} from "../views/main/popular-articles/popular-articles.component";
import {RouterModule} from "@angular/router";
import {MatButtonModule} from "@angular/material/button";
import {MatMenuModule} from "@angular/material/menu";
import {LayoutComponent} from "./layout/layout.component";
import {HeaderComponent} from "./layout/header/header.component";
import {FooterComponent} from "./layout/footer/footer.component";

@NgModule({
  declarations: [
    ModalComponent,
    TruncateWordsPipe,
    PopularArticlesComponent,
    LayoutComponent,
    HeaderComponent,
    FooterComponent,
  ],
  exports: [
    ModalComponent,
    TruncateWordsPipe,
    PopularArticlesComponent,
    LayoutComponent,
    HeaderComponent,
    FooterComponent,
  ],
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    RouterModule,
    MatButtonModule,
    MatMenuModule,
  ]
})
export class SharedModule { }
