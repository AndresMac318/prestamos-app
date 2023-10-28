import { Component, OnInit } from '@angular/core';
import { BalanceService } from 'src/app/services/balance.service';

@Component({
  selector: 'app-balance',
  templateUrl: './balance.component.html',
  styleUrls: ['./balance.component.scss']
})
export class BalanceComponent implements OnInit {

  amount_base!: number;

  constructor(private balanceSvc: BalanceService){ }
  
  ngOnInit(){
    this.chargeBalance();
    this.balanceSvc.getAmountBase$().subscribe(newAmount => {
      this.amount_base = newAmount;
    });
  }

  chargeBalance(){
    setTimeout(() => {
      this.amount_base = this.balanceSvc.getAmountBase();
    })
  }

}
