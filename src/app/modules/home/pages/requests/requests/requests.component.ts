import { Component } from '@angular/core';
import { NzMessageService } from 'ng-zorro-antd/message';

import { catchError, of } from 'rxjs';
import { ColumnItem, DataItem, Requests } from 'src/app/interfaces/request.interface';
import { RequestsService } from 'src/app/services/requests.service';

@Component({
  selector: 'app-requests',
  templateUrl: './requests.component.html',
  styleUrls: ['./requests.component.scss']
})
export class RequestsComponent {

  requests!: Requests[];

  columnItem: ColumnItem[] = [
    {
      name: 'Monto',
      sortOrder: null,
      sortFn: (a: DataItem, b: DataItem) => a.amount - b.amount,
      listOfFilter: [],
      filterFn: null
    },
    {
      name: 'Estado',
      sortFn: null,
      sortOrder: null,
      listOfFilter: [
        { text: 'Mora', value: 'mora' }, 
        { text: 'Saldada', value: 'saldada' }
      ],
      filterFn: (list: string[], item: DataItem) => list.some(balanceStatus => item.balanceStatus.indexOf(balanceStatus) !== -1)
    }
  ]

  constructor(private requestSvc: RequestsService, private message: NzMessageService){ }

  ngOnInit(): void {
    this.chargeRequests();
  }

  handleRequestCreated($event: {type: string}){
    if($event.type === 'request'){
      this.chargeRequests();
    }
  }

  chargeRequests(){
    this.requestSvc.getRequests()
    .pipe(      
      catchError(error => {
        console.log(error);
        return of({status: "error"});
      })
    )
    .subscribe((resp: any) => {
      if(resp.status === "error"){
        this.message.create('error', 'Error al cargar las solicitudes!');
        return;
      }
      this.requests = resp;
    })
  }

}
