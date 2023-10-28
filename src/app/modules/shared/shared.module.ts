import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { NzMenuModule } from 'ng-zorro-antd/menu';
import { NzLayoutModule } from 'ng-zorro-antd/layout';
import { IconsProviderModule } from '../../icons-provider.module';
import { NzTableModule } from 'ng-zorro-antd/table';
import { NzIconModule } from 'ng-zorro-antd/icon';
import { NzButtonModule } from 'ng-zorro-antd/button';
import { NzDrawerModule } from 'ng-zorro-antd/drawer';
import { NzFormModule } from 'ng-zorro-antd/form';
import { NzPageHeaderModule } from 'ng-zorro-antd/page-header';
import { NzSpaceModule } from 'ng-zorro-antd/space';
import { NzStatisticModule } from 'ng-zorro-antd/statistic';
import { NzListModule } from 'ng-zorro-antd/list';
import { NzTagModule } from 'ng-zorro-antd/tag';
import { NzInputNumberModule } from 'ng-zorro-antd/input-number';
import { NzDatePickerModule } from 'ng-zorro-antd/date-picker';

import { ReactiveFormsModule } from '@angular/forms';
import { BalanceComponent } from './balance/balance.component';
import { CreateFormComponent } from './create-form/create-form.component';

@NgModule({
  declarations: [
    BalanceComponent,
    CreateFormComponent
  ],
  imports: [
    CommonModule,
    NzMenuModule,
    NzLayoutModule,
    IconsProviderModule,
    NzIconModule,
    NzButtonModule,
    NzDrawerModule,
    NzFormModule,
    NzPageHeaderModule,
    NzSpaceModule,
    NzStatisticModule,
    NzListModule,
    ReactiveFormsModule,
    NzTagModule,
    NzInputNumberModule,
    NzDatePickerModule
  ],
  exports: [
    NzMenuModule,
    NzLayoutModule,
    IconsProviderModule,
    NzTableModule,
    NzIconModule,
    NzButtonModule,
    NzDrawerModule,
    NzFormModule,
    NzPageHeaderModule,
    NzSpaceModule,
    NzStatisticModule,
    BalanceComponent,
    NzListModule,
    CreateFormComponent,
    NzTagModule,
    NzInputNumberModule,
    NzDatePickerModule
  ]
})
export class SharedModule { }
