import { Component, OnInit } from '@angular/core';
import { NzMessageService } from 'ng-zorro-antd/message';
import { catchError, of } from 'rxjs';
import { Customer } from 'src/app/interfaces/customer.interface';
import { CustomersService } from 'src/app/services/customers.service';

@Component({
  selector: 'app-customers',
  templateUrl: './customers.component.html',
  styleUrls: ['./customers.component.scss']
})
export class CustomersComponent implements OnInit {

  customers!: Customer[];

  constructor(private customerSvc: CustomersService, private message: NzMessageService){ }

  ngOnInit(): void {
    this.chargeCustomers();
  }

  chargeCustomers(){
    this.customerSvc.getCustomers()
    .pipe(
      catchError(error => {
        console.log(error);
        return of({status: "error"});
      })
    )
    .subscribe(resp => {
      if (Array.isArray(resp)) {
        this.customers = resp;
      } else {
        if (resp.status === "error") {
          this.message.create('error', 'Error al cargar los usuarios!');
          return;
        }
      }
    });
  }

  handleUserCreated($event: {type: string}){
    if ($event.type === 'customer') {
      this.chargeCustomers();
    }
  }
}
