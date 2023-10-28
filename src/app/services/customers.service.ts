import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Customer } from '../interfaces/customer.interface';

@Injectable({
  providedIn: 'root'
})
export class CustomersService {

  constructor(private http: HttpClient) { }

  getCustomers(){
    return this.http.get<Customer[]>('http://localhost:3000/customers');
  }
  
  createCustomer(body: any){
    return this.http.post('http://localhost:3000/customers', body);
  }
}
