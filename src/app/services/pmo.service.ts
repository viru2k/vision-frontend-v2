import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';


import { URL_SERVICIOS, PARAMS } from '../config/config';
import {Pmo} from '../models/pmo.model';

@Injectable({
  providedIn: 'root'
})
export class PmoService {

  private url:string  = URL_SERVICIOS + 'pmo';

  constructor(public http: HttpClient) { }

getItem(id:number){
  return this.http.get<Pmo>(this.url+"/"+id);
  }

getItems(){
  return this.http.get<Pmo[]>(this.url);
  }

putItem(val:Pmo, id:string){
//   console.log(this.url+"/"+id);
  console.log(val); 
  return this.http.put<Pmo>(this.url+"/"+id,val);
}

postItem(val:Pmo){
  console.log(val); 
  return this.http.post<Pmo>(this.url, val);
}

}
