import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { HomeComponent } from './home/home.component';

const routes: Routes = [
  {
    path: 'customers', component: HomeComponent, loadChildren: () => import('./pages/customers/customers.module').then(m => m.CustomersModule) 
  },
  {
    path: 'requests', component: HomeComponent, loadChildren: () => import('./pages/requests/requests.module').then(m => m.RequestsModule) 
  },
  {
    path: '', redirectTo: 'customers', pathMatch: 'full'
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class HomeRoutingModule { }
