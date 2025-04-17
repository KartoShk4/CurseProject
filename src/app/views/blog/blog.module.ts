import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { BlogComponent } from './components/blog.component';
import { BlogRoutingModule } from './blog-routing.module';
import { SharedModule } from "../../shared/shared.module";

@NgModule({
  declarations: [BlogComponent],
  imports: [
    CommonModule,
    BlogRoutingModule,
    SharedModule
  ]
})
export class BlogModule { }
