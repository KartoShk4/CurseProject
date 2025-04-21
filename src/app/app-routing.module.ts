import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import {MainComponent} from "./views/main/main.component";
import {LayoutComponent} from "./shared/layout/layout.component";
import {PolicyPageComponent} from "./views/policy-page/policy-page.component";

const routes: Routes = [
  {
    path: '',
    component: LayoutComponent,
    children: [
      {path:'', component: MainComponent},
      {path: 'user', loadChildren: () => import('./views/user/user.module').then(m => m.UserModule)},
      {path: 'blog', loadChildren: () => import('./views/blog/blog.module').then(m => m.BlogModule)},
      { path: 'policy', component: PolicyPageComponent }
    ]
  }
];

@NgModule({
  imports: [RouterModule.forRoot(routes, {
    anchorScrolling: 'enabled',
    scrollPositionRestoration: 'enabled',
  })],
  exports: [RouterModule]
})
export class AppRoutingModule { }
