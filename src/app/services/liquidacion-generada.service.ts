import { LiquidacionGenerada } from './../models/liquidacion-generada.model';
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';


import { URL_SERVICIOS, PARAMS } from '../config/config';

@Injectable({
  providedIn: 'root'
})
export class LiquidacionGeneradaService {

  private url:string  = URL_SERVICIOS + 'liquidaciongenerada';

  constructor(public http: HttpClient) { }

getItem(id:number){
  return this.http.get<LiquidacionGenerada>(this.url);
  }

getItems(){
  return this.http.get<LiquidacionGenerada[]>(this.url);
  }

putItem(val:LiquidacionGenerada, id:string){
//   console.log(this.url+"/"+id);
  console.log(val); 
  return this.http.put<LiquidacionGenerada>(this.url+"/"+id,val);
}

postItem(val:LiquidacionGenerada){
  console.log(val); 
  return this.http.post<LiquidacionGenerada>(this.url, val);
}

}
