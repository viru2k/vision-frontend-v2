

import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';

import 'rxjs/add/operator/toPromise';
import { URL_SERVICIOS, PARAMS } from '../config/config';
import { OperacionCobro } from '../models/operacion-cobro.model';
import { OperacionCobroDetalle } from '../models/operacion-cobro-detalle.model';
import { Liquidacion } from '../models/liquidacion.model';

const httpOptions = {
  headers: new HttpHeaders({ 'Content-Type': 'application/json' })
};


@Injectable({
  providedIn: 'root'
})
export class PracticaService {


  
  private url:string  = URL_SERVICIOS + 'practica';
  private URL_OPERACION_COBRO:string  = URL_SERVICIOS + 'operacioncobro/';

  constructor(public http: HttpClient) { }

getItem(id:number){
  return this.http.get<OperacionCobro>(this.url+'/'+id);
  }

getItems(){
  return this.http.get<OperacionCobro[]>(this.url);
  }

putItem(val:OperacionCobro, id:string){
//   console.log(this.url+'/'+id);
  console.log(val); 
  return this.http.put<OperacionCobro>(this.url+'/'+id,val);
}

postItem(val:OperacionCobro){
  console.log(val); 
  return this.http.post<OperacionCobro>(this.url, val);
}

getItemByObraSocial(id:number){
  return this.http.get<OperacionCobro>(this.url+'/byobrasocial/'+id);
  }

getItemByFecha(fechaDesde:string , fechaHasta:string){
  return this.http.get<OperacionCobro>(this.url+'/by/fecha/orden?fecha_desde='+fechaDesde+'&fecha_hasta='+fechaHasta);
  }

getItemByFechaAndObraSocialAndMedico(fechaDesde:string , fechaHasta:string, medico_id:string, obra_social_id:string){
  return this.http.get<OperacionCobro>(this.url+'/by/obrasocialmedico?medico_id='+medico_id+'&obra_social_id='+obra_social_id+'&fecha_desde='+fechaDesde+'&fecha_hasta='+fechaHasta);
  }

getItemByAgendaId(agendaId:string){
  console.log(this.url+'/by/agenda/'+agendaId);
  return this.http.get<OperacionCobro>(this.url+'/by/agenda/'+agendaId);
  }

getOperacionCobroRegistrosBetweenDates(fecha_desde:string,fecha_hasta:string,estado_liquidacion:string){
  
  return this.http.get<OperacionCobroDetalle[]>(this.URL_OPERACION_COBRO+'registros/by/dates?fecha_desde='+fecha_desde+'&fecha_hasta='+fecha_hasta+'&estado_liquidacion='+estado_liquidacion);
  }

  
getOperacionCobroRegistrosBetweenDatesAndMedico(fecha_desde:string,fecha_hasta:string,estado_liquidacion:string,user_medico_id:string){
  
  return this.http.get<OperacionCobroDetalle[]>(this.URL_OPERACION_COBRO+'registros/by/dates/medico?fecha_desde='+fecha_desde+'&fecha_hasta='+fecha_hasta+'&estado_liquidacion='+estado_liquidacion+'&user_medico_id='+user_medico_id);
  }

  getOperacionCobroRegistrosById(fecha_desde:string,fecha_hasta:string,estado_liquidacion:string,user_medico_id:string){
  return this.http.get<OperacionCobroDetalle[]>(this.URL_OPERACION_COBRO+'registros/by/id?fecha_desde='+fecha_desde+'&fecha_hasta='+fecha_hasta+'&estado_liquidacion='+estado_liquidacion+'&user_medico_id='+user_medico_id);
  } 

  getOperacionCobroRegistrosByIdOperacionCobro(id:string){
    return this.http.get<OperacionCobroDetalle[]>(this.URL_OPERACION_COBRO+'registros/by/operacioncobro?id='+id);
    } 
  
  getOperacionCobroRegistrosByPaciente(id:string){
    return this.http.get<OperacionCobroDetalle[]>(this.URL_OPERACION_COBRO+'registros/by/paciente?id='+id);
    } 
  getOperacionCobroRegistrosByLiquidacionNumero(id:string){
    return this.http.get<OperacionCobroDetalle[]>(this.URL_OPERACION_COBRO+'registros/by/liquidacion/numero?id='+id);
    } 

    getOperacionCobroRegistrosByLiquidacionNumeroMultiple(selected: any){      
      return this.http.post<any[]>(this.URL_OPERACION_COBRO+'registros/by/liquidacion/numero/multiple', selected);
      } 
  getOperacionCobroByConsulta(consulta:string,valor:string){
    console.log(this.URL_OPERACION_COBRO+'consulta?consulta='+consulta+'&valor='+valor);
    return this.http.get<OperacionCobroDetalle[]>(this.URL_OPERACION_COBRO+'consulta/varios?consulta='+consulta+'&valor='+valor);
  } 

  async getOperacionCobroDistribucionById(id:string,estado_liquidacion:string,obra_social_id:string): Promise<any[]>{
    
    return await  this.http.get<any[]>(this.URL_OPERACION_COBRO+'registros/by/distribucion?id='+id+'&estado_liquidacion='+estado_liquidacion+'&obra_social_id='+obra_social_id).toPromise();
  } 

  
  async getOperacionCobroDistribucionByIdPrefactura(id:string,estado_liquidacion:string,obra_social_id:string): Promise<any[]>{
    
    return await  this.http.get<any[]>(this.URL_OPERACION_COBRO+'registros/by/distribucion/prefactura?id='+id+'&estado_liquidacion='+estado_liquidacion+'&obra_social_id='+obra_social_id).toPromise();
  } 

  
  
  auditarpractica(registros:OperacionCobroDetalle[]){  
    return this.http.post<number>(this.URL_OPERACION_COBRO+'facturacion/auditarorden',registros);
  }

  auditarpracticaObservacuib(registros:OperacionCobroDetalle[]){  
    return this.http.post<number>(this.URL_OPERACION_COBRO+'facturacion/auditarorden',registros);
  }

  afectarOperacionCobro(liquidacion:Liquidacion){  
  
    // console.log(this.URL_OPERACION_COBRO+'afectar/orden?'+liquidacion.cant_orden+'&'+liquidacion.estado+'&'+liquidacion.fecha_desde+'&'+liquidacion.fecha_hasta+'&'+liquidacion.nivel+'&'+liquidacion.numero+'&'+liquidacion.obra_social_id+'&'+liquidacion.total+'&'+liquidacion.usuario_audito,registros);
    return this.http.post<any>(this.URL_OPERACION_COBRO+'afectar/orden',liquidacion);
  }



  postOperacionCobro(val:OperacionCobro){
    console.log(val); 

    return this.http.post<any>(URL_SERVICIOS+'operacioncobro/registros', val);
  }

  destroyByPracticaById(id:string){  
    return this.http.delete<number>(this.URL_OPERACION_COBRO+'practica/'+id);
  }

  putOperacionCobro(val:OperacionCobro,id:string){
    console.log(val); 
    return this.http.put<any>(URL_SERVICIOS+'operacioncobro/operacioncobro/actualizar/'+id, val);
  }
  

  putOperacionCobroRegistro(val:OperacionCobro,id:string){
    console.log(val); 
    return this.http.put<any>(URL_SERVICIOS+'operacioncobro/practica/actualizar/'+id, val);
  }


  
  putOperacionCobroRegistroAnular(val:any,id:string){
    console.log(val); 
    return this.http.put<any>(URL_SERVICIOS+'operacioncobro/practica/anular/'+id, val);
  }
 

  
  actualizarValoresPracticasByConvenio(selected:any){
    return this.http.post<any[]>(URL_SERVICIOS+'operacioncobro/recalcular/by/liquidacion', selected);
    //return this.http.get<any>(URL_SERVICIOS+'operacioncobro/recalcular/by/liquidacion');
    } 

  

   
  desafectarPresentacion(liquidacion_nro:string){
    
    return this.http.get<any>(URL_SERVICIOS+'liquidacion/detalle/prefactura/desafectar?liquidacion_nro='+liquidacion_nro);
  }
 
  updatePresentacion(registro:any,id:string){
    
    return this.http.put<any>(this.URL_OPERACION_COBRO+'presentacion/actualizar/'+id,registro);
  }


  updatePrestacion(id:string,prestacion:any){
    
    return this.http.put<any>(this.URL_OPERACION_COBRO+'registro/prestacion/'+id,prestacion);
  }

  getDistribucionbyOperacionCobro(operacion_cobro_id:string){  
    return this.http.get<OperacionCobroDetalle[]>(this.URL_OPERACION_COBRO+'distribucion/by/operacioncobro?operacion_cobro_id='+operacion_cobro_id);
  }
  
  getOperacionCobroByDistribucion(fecha_desde:string, fecha_hasta:String){  
    return this.http.get<any[]>(this.URL_OPERACION_COBRO+'consulta/varios/distribucion?fecha_desde='+fecha_desde+'&fecha_hasta='+fecha_hasta);
  }

  updateOperacionCobroDistribucion(registro:any){
    
    return this.http.put<any>(this.URL_OPERACION_COBRO+'practica/editar/distribucion/'+registro['id'], registro);
  }

  updateOperacionCobroDistribucionOperacionCobro(registro:any){
    
    return this.http.put<any>(this.URL_OPERACION_COBRO+'practica/editar/distribucion/operacioncobro/'+registro['operacion_cobro_id'], registro);
  }
  
}
