import { Injectable } from '@angular/core';
import { URL_SERVICIOS, PARAMS } from '../config/config';
import { HttpClient } from '@angular/common/http';
import { MedicoObraSocial } from '../models/medico-obrasocial.model';
@Injectable({
  providedIn: 'root'
})
export class MedicoObraSocialService {

 
  private url:string  = URL_SERVICIOS + 'medico/';

  constructor(public http: HttpClient) { }

getItemsByMedico(id:string){
  console.log(id);
  return this.http.get<MedicoObraSocial[]>(this.url+"obrasocial/bymedico?medico_id="+id);
  }

getItemByObraSocial(id:string){
  return this.http.get<MedicoObraSocial[]>(this.url+"obrasocial/byobrasocial?obra_social_id="+id);
  }

  getItemByMedicoTodos(id:string){
    return this.http.get<MedicoObraSocial[]>(this.url+"obrasocial/bymedico/todos?medico_id="+id);
    
    }

  getItemMedicoTodos(){
    return this.http.get<MedicoObraSocial[]>(this.url+"obrasocial/todos");
    }
putItem(paciente:MedicoObraSocial, id:string){
//   console.log(this.url+"/"+id);
  console.log(paciente); 
  return this.http.get<MedicoObraSocial[]>(this.url+"obrasocial/"+id);
}

postItem(paciente:MedicoObraSocial){
  console.log(paciente); 
  return this.http.post<MedicoObraSocial>(URL_SERVICIOS+"medicoobrasocial", paciente);
}

postItemMedicoObraSocial(medico:MedicoObraSocial){
  console.log(medico); 
  return this.http.post<any>(URL_SERVICIOS+"medicoobrasocial", medico);
}

delItem(paciente:MedicoObraSocial){
  console.log(paciente); 
  return this.http.delete<any>(URL_SERVICIOS+"medicoobrasocial/"+paciente.id);
}

}
