import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';


import { URL_SERVICIOS, PARAMS } from '../config/config';
import {ObraSocial} from '../models/obra-social.model';

@Injectable({
  providedIn: 'root'
})
export class ObraSocialService {

  private url:string  = URL_SERVICIOS + 'obrasocial';

  constructor(public http: HttpClient) { }

getItem(id:number){
  return this.http.get<ObraSocial>(this.url);
  }

  

getItems(){
  return this.http.get<ObraSocial[]>(this.url);
  }

putItem(val:ObraSocial, id:string){
//   console.log(this.url+"/"+id);
  console.log(val.id); 
  return this.http.put<ObraSocial>(this.url+"/"+val.id,val);
}

postItem(val:ObraSocial){
  console.log(val); 
  return this.http.post<ObraSocial>(this.url, val);
}s

getObraSocialByIdAndPmo(obra_social_id:string,pmo_id:string){
  return this.http.get<ObraSocial>(URL_SERVICIOS+"obrasocialby/obrasocialpmo?obra_social_id="+obra_social_id+"&pmo_id="+pmo_id);
  }

insertarCoseguro(){
  return this.http.get<ObraSocial>(URL_SERVICIOS+"obrasocialby/insertarcoseguro");
  }

actualizarCoseguro(){
  return this.http.get<ObraSocial>(URL_SERVICIOS+"obrasocialby/actualizarcoseguro");
  }

  
  ActualizarValoresDistribucion(){
  return this.http.get<ObraSocial>(URL_SERVICIOS+"obrasocialby/actualizar/distribucion");
  }
    
    
  

}
