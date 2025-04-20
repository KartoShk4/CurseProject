import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { BlogComponent } from './components/blog.component';
import { BlogRoutingModule } from './blog-routing.module';
import { SharedModule } from "../../shared/shared.module";
import { ArticleComponent } from './components/article/article.component';
import {AppModule} from "../../app.module";
import {FormsModule} from "@angular/forms";

@NgModule({
  declarations: [BlogComponent, ArticleComponent],
    imports: [
        CommonModule,
        BlogRoutingModule,
        SharedModule,
        FormsModule,
    ]
})
export class BlogModule { }
