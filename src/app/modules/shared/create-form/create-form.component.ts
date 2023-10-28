import { Component, EventEmitter, Input, Output } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';

import { catchError, of, map, throwError } from 'rxjs';

import { NzMessageService } from 'ng-zorro-antd/message';
import { NzDrawerPlacement } from 'ng-zorro-antd/drawer';

import { CustomersService } from 'src/app/services/customers.service';
import { RequestsService } from 'src/app/services/requests.service';
import { BalanceService } from 'src/app/services/balance.service';
import { Customer } from 'src/app/interfaces/customer.interface';
import { Requests } from 'src/app/interfaces/request.interface';

@Component({
  selector: 'app-create-form',
  templateUrl: './create-form.component.html',
  styleUrls: ['./create-form.component.scss']
})
export class CreateFormComponent {

  @Input() customForm!: string;

  @Output() eventCreated: EventEmitter<{type: string}> = new EventEmitter();

  public visible = false;
  public textBtn = 'Crear'
  public placement: NzDrawerPlacement = 'bottom';
  public isLoading = false;

  public formCustomer!: FormGroup<{
    name: FormControl<string>,
    email: FormControl<string>,
    numDocument: FormControl<string>,
  }>;

  public formRequest!: FormGroup<{
    numDocument: FormControl<string>,
    nameApplicant: FormControl<string>,
    amount: FormControl<number>,
    paimentDate: FormControl<string>
  }>;

  private arrayInfo: {numDocument: string, name:string}[] = [];

  constructor(private formb: FormBuilder, private customerSvc: CustomersService, private message: NzMessageService, private requestsSvc: RequestsService, private balanceSvc: BalanceService){
    this.chargeDocuments();
  }
  
  ngOnInit(): void {
    this.createForm();
  }

  get titleDrawer(){
    return (this.customForm === 'customers') ? 'Crear Cliente' : 'Crear Solicitud';
  }

  open(): void {
    this.visible = true;
  }

  close(): void {
    this.visible = false;
    if (this.customForm === 'customers') {
      this.formCustomer.reset();
      return;
    }
    this.formRequest.reset();
  }

  chargeDocuments(){
    this.customerSvc.getCustomers()
    .pipe(
      map( customers => customers.map( customer => ({numDocument: customer.numDocument, name: customer.name}))),
      catchError(error => {
        console.log(error);
        return throwError(() => 'Ocurrio un error');
      })
    )
    .subscribe((resp: any) => {
      if (resp === 'Ocurrio un error') {
        this.message.create('error', 'Error al cargar los documentos!');
        return;
      }
      this.arrayInfo = resp;
    });
  }

  createForm(){
    if (this.customForm === 'customers') {
      this.formCustomer = this.formb.group({
        name: new FormControl('', { validators: [ Validators.required], nonNullable: true }),
        email: new FormControl('', { validators: [ Validators.required, Validators.email], nonNullable: true}),
        numDocument: new FormControl('', { validators: [ Validators.required, Validators.pattern('^[0-9]+$')], nonNullable: true})
      });
      return;
    }
    this.formRequest = this.formb.group({
      numDocument: new FormControl('', { validators: [Validators.required, Validators.pattern('^[0-9]+$')], nonNullable: true }),
      nameApplicant: new FormControl({value: '', disabled: true}, { validators: [Validators.required], nonNullable: true }),
      amount: new FormControl(0, { validators: [Validators.required], nonNullable: true }),
      paimentDate: new FormControl('', { validators: [Validators.required], nonNullable: true }),
    });
  }

  disabledStartDate(current: Date): boolean {
    const currentDate = new Date();
    return current < currentDate;
  }

  updateBalance(){ 
    const oldBalance = this.balanceSvc.getAmountBase();
    const amount = this.formRequest.get('amount')!.value;
    if (oldBalance <= amount) {
      this.message.create('error', 'Fondos insuficientes!');
      return;
    }
    const newBalance = oldBalance - amount;
    this.balanceSvc.setAmountBase(newBalance);
    this.message.create('success', 'La solicitud fue aprovada!');
    this.eventCreated.emit({type: 'request'});
    this.isLoading = false;
    this.close();
  }

  chargeName(numDoc: string){
    if (numDoc.length > 6) {
      if (this.arrayInfo.length <= 0) {
        this.message.create('error', 'Error al cargar la información de clientes!');
        return;
      }
      
      const customer = this.arrayInfo.find(customer => customer.numDocument === numDoc);

      if (!customer) {
        this.message.create('error', 'El documento ingresado no pertenece a ningun cliente registrado!');
        this.formRequest.controls.nameApplicant.setValue('');
        return;
      }
      this.message.create('success', 'Cliente encontrado!');
      //se asigna el nombre correspondiente al input
      this.formRequest.controls.nameApplicant.setValue(customer.name);
    }
  }

  sendForm(){
    
    if (this.customForm === 'customers') {
    
      if (this.formCustomer.invalid) {
        this.message.create('error', 'Diligencie los campos correctamente!');
        return;
      }
      this.customerSvc.createCustomer(this.formCustomer.value)
      .pipe(
        catchError(error => {
          console.log(error);
          return of({status: "error"});
        })
      ).subscribe((resp: any) => {
        if(resp.status === "error"){
          this.message.create('error', 'Error al crear el usuario!');
          return;
        }

        this.message.create('success', 'Cliente creado!');
        this.eventCreated.emit({type: 'customer'});
        this.formCustomer.reset();
        this.close();
      })
      return;
    }

    // create request
    if (this.formRequest.invalid) {
      this.message.create('error', 'Diligencie los campos correctamente!');
      return;
    }

    this.isLoading = true;
    
    const data: Requests = {
      numDocument: this.formRequest.get('numDocument')?.value!,
      nameApplicant: this.formRequest.get('nameApplicant')?.value!,
      amount: this.formRequest.get('amount')?.value!,
      paymentDate: this.formRequest.get('paimentDate')?.value!,
      requestStatus: Math.random() < 0.5 ? "aprovada" : "denegada", 
      balanceStatus: "mora",
    }

    if (data.requestStatus === 'denegada') {
      this.message.create('error', 'La solicitud fue denegada!');
      this.close();
      this.isLoading = false;
      return;
    }

    this.requestsSvc.createRequest(data)
    .pipe(
      catchError(error => {
        console.log(error);
        return of({status: "error"});
      })
    )
    .subscribe((resp: any) => { 
      if(resp.status === "error"){
        this.message.create('error', 'Error al crear la solicitud!');
        return;
      }
      
      
      this.updateBalance();
    })

    
  }

}
