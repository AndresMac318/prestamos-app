import { Component, Input, OnDestroy, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { NzDrawerPlacement } from 'ng-zorro-antd/drawer';
import { NzMessageService } from 'ng-zorro-antd/message';
import { Observable, catchError, of } from 'rxjs';
import { RequestsService } from 'src/app/services/requests.service';
import { RequestsComponent } from '../../requests/requests.component';
import { BalanceService } from 'src/app/services/balance.service';

@Component({
  selector: 'app-pay',
  templateUrl: './pay.component.html',
  styleUrls: ['./pay.component.scss']
})
export class PayComponent implements OnInit {

  @Input() idRequest!: number;
  
  requestInfo: any;
  btnDisabled: boolean = false;

  public formRequest!: FormGroup<{
    codeRequest: FormControl<string>,
    nameApplicant: FormControl<string>,
    numDocument: FormControl<string>,
    amount: FormControl<number>,
  }>;

  public placement: NzDrawerPlacement = 'bottom';

  public visible = false;

  constructor(private formb: FormBuilder, private requestSvc: RequestsService, private message: NzMessageService, private requestsComp: RequestsComponent, private balanceSvc: BalanceService){}
  
  ngOnInit(): void {
    this.createForm();
    this.getRequest(this.idRequest);
  }

  open(): void {
    this.visible = true;
  }

  close(): void {
    this.visible = false;
  }

  getRequest(id: number){
    this.requestSvc.getRequest(id).subscribe( resp => {
      this.requestInfo = resp;
      if (resp.balanceStatus === 'saldada') {
        this.btnDisabled = true;
      }
    });
  }

  createForm(){
    this.formRequest = this.formb.group({
      codeRequest: new FormControl('', { validators: [ Validators.required], nonNullable: true }),
      nameApplicant: new FormControl('', { validators: [ Validators.required], nonNullable: true }),
      numDocument: new FormControl('', { validators: [ Validators.required, Validators.pattern('^[0-9]+$')], nonNullable: true}),
      amount: new FormControl(0, { validators: [ Validators.required, Validators.email], nonNullable: true})
    });
  }

  pay(){
    const data = this.requestInfo;
    const body = {...data, balanceStatus: "saldada" };
    this.requestSvc.pay(this.idRequest, body)
    .pipe(
      catchError(error => {
        console.log(error);
        return of({status: 'error'});
      })
    )
    .subscribe((resp: any) => {
      if(resp.status === "error"){
        this.message.create('error', 'Error al realizar la transacción, comuniquese con el administrador!');
        return;
      }
      this.message.create('success', 'Crédito saldado!');
      this.close();
      this.requestsComp.chargeRequests();

      /* Actualiza el balanceglobal */
      const balance = this.balanceSvc.getAmountBase();
      const newBalance = balance + this.requestInfo.amount;
      this.balanceSvc.setAmountBase(newBalance);
    })
    
  }

}
