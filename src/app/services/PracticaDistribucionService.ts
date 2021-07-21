import { PracticaDistribucion } from './../models/practica-distribucion.model';
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { URL_SERVICIOS } from '../config/config';
import { PracticaDistribucionRegistro } from '../models/practica-distribucion-registro.model';
@Injectable({
  providedIn: 'root'
})
export class PracticaDistribucionService {
  private url: string = URL_SERVICIOS + 'practicadistribucion';
  constructor(public http: HttpClient) { }
  getItem(id: string) {
    console.log(this.url);
    return this.http.get<PracticaDistribucion[]>(this.url);
  }
  getItems(id: string) {
    console.log(this.url + "/byconvenioospmo/" + id);
    return this.http.get<PracticaDistribucion[]>(this.url + "/byconvenioospmo/" + id);
  }
  putItem(val: PracticaDistribucionRegistro, id: string) {
    //   console.log(this.url+"/"+id);
    console.log(val);
    return this.http.put<PracticaDistribucion>(this.url + "/" + id, val);
  }
  postItem(val: PracticaDistribucionRegistro) {
    console.log(val);
    return this.http.post<PracticaDistribucion>(this.url, val);
  }

  delItem(val: string) {
    console.log(val);
    return this.http.delete<PracticaDistribucion>(this.url+"/"+val);
  }


  updateValoresDistribucionBetwenDates(fecha_desde: string, fecha_hasta:string) {    
    return this.http.get<PracticaDistribucion[]>(URL_SERVICIOS + "operacioncobro/distribucion/recalcular/by/fecha?fecha_desde="+ fecha_desde+'&fecha_hasta='+fecha_hasta);
  }


 
}
