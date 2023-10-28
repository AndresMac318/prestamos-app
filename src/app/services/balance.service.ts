import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { environment } from 'src/environments/environment.development';

@Injectable({
  providedIn: 'root'
})
export class BalanceService {

  private amountBase!: number;
  private amountBase$: BehaviorSubject<number> = new BehaviorSubject<number>(0);

  constructor() {
    this.amountBase = environment.base_capital;
  }

  getAmountBase(): number {
    return this.amountBase;
  }
  
  getAmountBase$(): Observable<number> {
    return this.amountBase$.asObservable();
  }

  setAmountBase(newAmount: number): void {
    this.amountBase = newAmount;
    this.amountBase$.next(this.amountBase);
  }

}
