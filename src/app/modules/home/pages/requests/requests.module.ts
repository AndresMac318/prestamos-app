import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { RequestsRoutingModule } from './requests-routing.module';
import { ReactiveFormsModule } from '@angular/forms';
import { SharedModule } from 'src/app/modules/shared/shared.module';

import { RequestsComponent } from './requests/requests.component';
import { PayComponent } from './components/pay/pay.component';

@NgModule({
  declarations: [
    RequestsComponent,
    PayComponent
  ],
  imports: [
    CommonModule,
    RequestsRoutingModule,
    ReactiveFormsModule,
    SharedModule,
  ]
})
export class RequestsModule { }
