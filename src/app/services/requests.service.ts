import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Requests } from '../interfaces/request.interface';

@Injectable({
  providedIn: 'root'
})
export class RequestsService {

  constructor(private http: HttpClient) { }

  getRequests(){
    return this.http.get<Requests[]>('http://localhost:3000/requests');
  }
  
  getRequest(id: number){
    return this.http.get<Requests>(`http://localhost:3000/requests/${id}`);
  }

  pay(id: number, body: Requests){
    return this.http.put(`http://localhost:3000/requests/${id}`, body)
  }
  
  createRequest(body: Requests){
    return this.http.post('http://localhost:3000/requests', body);
  }
}
