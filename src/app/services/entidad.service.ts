import { EntidadFactura } from './../models/entidad-factura.model';
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';


import { URL_SERVICIOS, PARAMS } from '../config/config';


@Injectable({
  providedIn: 'root'
})
export class EntidadService {

  private url:string  = URL_SERVICIOS + 'liquidacion/entidad';

  constructor(public http: HttpClient) { }

getItem(id:number){
  return this.http.get<EntidadFactura>(this.url);
  }

getItems(){
  return this.http.get<EntidadFactura[]>(this.url);
  }

putItem(val:EntidadFactura, id:string){
//   console.log(this.url+"/"+id);
  console.log(val); 
  return this.http.put<EntidadFactura>(this.url+"/"+id,val);
}

postItem(val:EntidadFactura){
  console.log(val); 
  return this.http.post<EntidadFactura>(this.url, val);
}

}
