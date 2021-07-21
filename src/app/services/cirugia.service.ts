
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';


import { URL_SERVICIOS, PARAMS } from '../config/config';
import { CirugiaFicha } from '../models/cirugia-ficha.model';
import { CirugiaLente } from '../models/cirugia-lente.model';
import { AgendaTurno } from '../models/agenda-turno.model';
import { CirugiaFichaMedico } from '../models/cirugia-ficha-medico.model';


@Injectable({
  providedIn: 'root'
})
export class CirugiaService {

  private url:string  = URL_SERVICIOS + 'cirugia';
  private url_simple:string  = URL_SERVICIOS ;
  constructor(public http: HttpClient) { }



  crearFichaQuirurgica(lente:CirugiaFicha){
    return this.http.post<CirugiaFicha[]>(this.url_simple+"cirugia/fichaquirurgica/crear",lente);
    }


getFichaListado(){
  console.log(this.url+"/ficha/ficha/estado/pendiente");
  return this.http.get<CirugiaFicha[]>(this.url+"/ficha/ficha/estado/pendiente");
  }

getFichaListadoHistorico(){
  return this.http.get<CirugiaFicha[]>(this.url+"/ficha/ficha/estado/pendiente");
  }

getFichaCompleta(cirugia_id:string){
  return this.http.get<CirugiaFicha[]>(this.url+"/ficha/fichacompleta/"+cirugia_id);
}

getFichaEstado(){
  return this.http.get<CirugiaFicha[]>(this.url+"/ficha/cirugia/estado");
  }

getFichaLente(cirugia_id:string){
  return this.http.get<any[]>(this.url+"/ficha/lente/"+cirugia_id);
  }

getFichaAnestesia(cirugia_id:string){
  return this.http.get<CirugiaFicha[]>(this.url+"/ficha/lente/"+cirugia_id);
  }

getFichaMedicoGrupo(cirugia_id:string){
  return this.http.get<any[]>(this.url+"/ficha/grupomedico/"+cirugia_id);
  }

  putFichaMedicoGrupo(cirugiaFichaMedico:CirugiaFichaMedico,id:string){
    return this.http.put<CirugiaFicha[]>(this.url+"/grupomedico/"+id,cirugiaFichaMedico);
    }

  postLenteFichaMedicoGrupo(CirugiaFichaMedico:any){
    return this.http.post<CirugiaLente[]>(this.url_simple+"cirugia/grupomedico",CirugiaFichaMedico);
    }



    getLentesTodosByDate(fecha_desde: string, fecha_hasta: string){
      return this.http.get<CirugiaLente[]>(this.url_simple+"stock/lente/by/dates/todos?fecha_desde=" +fecha_desde + '&fecha_hasta=' + fecha_hasta);
      }

  getLentesSinUso(es_baja: string){
    return this.http.get<CirugiaLente[]>(this.url_simple+"stock/lente/by/todos?es_baja=" +es_baja);
    }

    getLentesCirugiaByDates(fecha_desde: string, fecha_hasta: string){
      return this.http.get<CirugiaLente[]>(this.url_simple+"stock/lente/by/dates?fecha_desde=" +fecha_desde + '&fecha_hasta=' + fecha_hasta);
      }

      getLentesCirugiaByDatesAndBaja(fecha_desde: string, fecha_hasta: string, es_baja: string){
        return this.http.get<CirugiaLente[]>(this.url_simple+"stock/lente/by/dates/baja?fecha_desde=" +fecha_desde + '&fecha_hasta=' + fecha_hasta+ '&es_baja='+ es_baja);
        }

derviarPaciente(lente:CirugiaFicha){
  return this.http.post<CirugiaFicha[]>(this.url+"/ficha/derivar",lente);
  }

postLente(lente:CirugiaLente){
    return this.http.post<CirugiaFicha[]>(this.url_simple+"stock/lente",lente);
    }


putLente(lente:CirugiaLente,id:string){
  return this.http.put<CirugiaFicha[]>(this.url_simple+"stock/lente/"+id,lente);
  }


getLenteTipo(){
  return this.http.get<CirugiaLente[]>(this.url_simple+"lente/lente");
  }


  postLenteFichaQuirurgica(cirugiaLente:any){
    return this.http.post<CirugiaLente[]>(this.url_simple+"cirugia/registro/lente",cirugiaLente);
    }



  delLenteFichaQuirurgica(lente_id:string,cirugia_id:string){
    console.log(this.url_simple+"cirugia/ficha/registro/delete?lente_id="+lente_id+'&cirugia_id='+cirugia_id);
      return this.http.get<any>(this.url_simple+"cirugia/ficha/registro/delete?lente_id="+lente_id+'&cirugia_id='+cirugia_id);
      }

  uploadEstudioDatos(estudio:any){
    return this.http.post(this.url_simple+"multiuploads/estudios/datos",estudio);

  }

  getEstudioImagen(id:string){
    return this.http.get<any[]>(this.url_simple+"multiuploads/estudios/verimagen?id="+id);

  }

  getFichaDerivados(fecha_derivacion:string){
    return this.http.get<any[]>(this.url+"/ficha/derivar/listado?fecha_derivacion="+fecha_derivacion);
  }

  updFichaDerivados(fecha_derivacion:any[],id:string){
    return this.http.put<any>(this.url+"/ficha/derivar/listado/atender/"+id,fecha_derivacion);
  }

  getListadoQurifano(fecha_hoy:string){
    return this.http.get<any[]>(this.url+"/listado/quirofano?estado=PENDIENTE&fecha="+fecha_hoy);
  }

  getListadoQuirofanoByMedico(fecha_hoy:string,medico_id:string){
    return this.http.get<any[]>(this.url+"/listado/quirofano/by/medico?estado=PENDIENTE&fecha="+fecha_hoy+'&medico_id='+medico_id);
  }

  getListadoQuirofanoByMedicoByPeriodo(fecha_desde:string,fecha_hasta:string,medico_id:string){
    console.log(this.url+"/listado/quirofano/by/medico?estado=PENDIENTE&fecha_desde="+fecha_desde+'&fecha_hasta='+fecha_hasta+'&medico_id='+medico_id);
    return this.http.get<any[]>(this.url+"/listado/quirofano/by/medico/by/periodo?estado=PENDIENTE&fecha_desde="+fecha_desde+'&fecha_hasta='+fecha_hasta+'&medico_id='+medico_id);
  }

  getListadoQurifanoRealizado(){
    return this.http.get<any[]>(this.url+"/listado/quirofano/realizado");
  }

  updListadoQurifano(fecha_derivacion:any[],id:string){
    console.log(fecha_derivacion);
    return this.http.put<any>(this.url+"/listado/quirofano/"+id,fecha_derivacion);
  }

  postListadoQurifano(fecha_derivacion:any[],id:string){
    console.log(fecha_derivacion);
    return this.http.post<any>(this.url+"/listado/quirofano",fecha_derivacion);
  }


  updOperacionCobroQurifano(fecha_derivacion:CirugiaFicha,id:string){
    console.log(fecha_derivacion);
    return this.http.put<any>(this.url+"/practica/"+id,fecha_derivacion);
  }

  updEstadoQurifano(fecha_derivacion:any,id:string){
    console.log(fecha_derivacion);
    return this.http.put<any>(this.url+"/practica/estado/"+id,fecha_derivacion);
  }

  destroyCirugiaListado(id:string){

    return this.http.delete<any>(this.url+"/ficha/listado/"+id);
  }


  getDocumentacion(){
    return this.http.get<any[]>(this.url_simple+"multiuploads/documentacion");

  }

}

