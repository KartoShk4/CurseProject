import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { BlogComponent } from './components/blog.component';
import {ArticleComponent} from "./components/article/article.component";

const routes: Routes = [
  { path: '', component: BlogComponent },
  { path: 'article/:url', component: ArticleComponent}
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class BlogRoutingModule { }
