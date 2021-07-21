import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';


import { URL_SERVICIOS, PARAMS } from '../config/config';
import {Convenio} from '../models/convenio.model';

@Injectable({
  providedIn: 'root'
})
export class ConvenioService {

  private url:string  = URL_SERVICIOS + 'convenio';

  constructor(public http: HttpClient) { }

getItem(id:number){
  return this.http.get<Convenio>(this.url);
  }

getItems(){
  return this.http.get<Convenio[]>(this.url);
  }

  getItemsByObraSocialAndCoseguro(obra_social_id:string, coseguro_id:string){
    return this.http.get<Convenio[]>(this.url+"/by/obrasocialandcoseguro?obra_social_id="+obra_social_id+"&coseguro_id="+coseguro_id);
    }
  

putItem(val:Convenio, id:string){
//   console.log(this.url+"/"+id);
  console.log(val); 
  return this.http.put<Convenio>(this.url+"/"+id,val);
}

postItem(val:Convenio){
  console.log(val); 
  return this.http.post<Convenio>(this.url, val);
}

getItemsByObraSocial(val:Convenio){
  console.log(val); 
  return this.http.post<Convenio[]>(this.url+"/byobrasocial/"+val.id, val);
}

}
