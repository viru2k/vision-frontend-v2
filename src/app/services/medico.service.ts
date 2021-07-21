import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';


import { URL_SERVICIOS, PARAMS } from '../config/config';
import {Medico} from '../models/medico.model';
import { HistoriaClinica } from '../models/historia-clinica.model';

@Injectable({
  providedIn: 'root'
})
export class MedicoService {

 

  private url:string  = URL_SERVICIOS + 'medico';
  private url_historia_clinica = URL_SERVICIOS+'cirugia'
  constructor(public http: HttpClient) { }

getItem(id:number){
  return this.http.get<Medico>(this.url+"/"+id);
  }

getItems(){
  return this.http.get<Medico[]>(this.url);
  }

putItem(medico:Medico, id:string){
//   console.log(this.url+"/"+id);
  console.log(medico); 
  return this.http.put<Medico>(this.url+"/"+id,medico);
}

postItem(paciente:Medico){
  console.log(paciente); 
  return this.http.post<Medico>(this.url, paciente);
}

getHistoriaClinicaByPaciente(paciente_id:string){
  return this.http.get<HistoriaClinica[]>(this.url_historia_clinica+'/historia/'+paciente_id); 
  }

  setHistoriaClinicaFicha(registro:HistoriaClinica){
  return this.http.post<any>(this.url_historia_clinica+'/historia/registro/insertar',registro); 
}

updHistoriaClinicaById(registro:HistoriaClinica,id:string){
  return this.http.put<HistoriaClinica[]>(this.url_historia_clinica+'/historia/registro/actualizar'+id, registro); 
}
}
