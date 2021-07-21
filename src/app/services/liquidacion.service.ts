import { Liquidacion } from './../models/liquidacion.model';
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

import * as FileSaver from 'file-saver';
import * as XLSX from 'xlsx';
const EXCEL_TYPE = 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet;charset=UTF-8';
const EXCEL_EXTENSION = '.xlsx';
import { URL_SERVICIOS, PARAMS } from '../config/config';
import { LiquidacionDistribucion } from '../models/liquidacion-distribucion-model';

@Injectable({
  providedIn: 'root'
})
export class LiquidacionService {

  private url:string  = URL_SERVICIOS + 'liquidacion';

  constructor(public http: HttpClient) { }

  public exportAsExcelFile(json: any[], excelFileName: string): void {
    const worksheet: XLSX.WorkSheet = XLSX.utils.json_to_sheet(json);
    const workbook: XLSX.WorkBook = { Sheets: { 'data': worksheet }, SheetNames: ['data'] };
    const excelBuffer: any = XLSX.write(workbook, { bookType: 'xlsx', type: 'array' });
    this.saveAsExcelFile(excelBuffer, excelFileName);
  }
  private saveAsExcelFile(buffer: any, fileName: string): void {
     const data: Blob = new Blob([buffer], {type: EXCEL_TYPE});
     FileSaver.saveAs(data, fileName + '_export_' + new  Date().getTime() + EXCEL_EXTENSION);
  }

  
getItem(id:number){
  return this.http.get<Liquidacion>(this.url);
  }

getItems(){
  return this.http.get<Liquidacion[]>(this.url);
  }

putItem(val:Liquidacion, id:string){
//   console.log(this.url+"/"+id);
  console.log(val); 
  return this.http.put<Liquidacion>(this.url+"/"+id,val);
}

postItem(val:Liquidacion){
  console.log(val); 
  return this.http.post<Liquidacion>(this.url, val);
}


getLiquidacionDetalle(estado:string){
  return this.http.get<Liquidacion[]>(this.url+'/detalle?estado='+estado);
  }

    
  getListadoPreFactura(selected:any){
    return this.http.post<any[]>(this.url+"/detalle/prefactura",selected);
    } 

  getListadoPreFacturaCirugia(selected:any){
    return this.http.post<any[]>(this.url+"/detalle/prefactura/cirugia",selected);
    } 

    getListadoPreFacturaCirugiaCoseguro(selected:any){
      return this.http.post<any[]>(this.url+"/detalle/prefactura/cirugia/coseguro",selected);
      } 

  generarTxt(selected:any){
    return this.http.post<any[]>(URL_SERVICIOS+"multiuploads/texto",selected);
    } 

    generarTxtCirugia(selected:any){
      return this.http.post<any[]>(URL_SERVICIOS+"multiuploads/texto/cirugia",selected);
      } 

    liquidarOperacionCobro(selected:LiquidacionDistribucion){
    return this.http.post<any[]>(URL_SERVICIOS+"distribucion/operacion/cobro/medico",selected);
    } 

    liquidarOperacionCobroActualizar(selected:LiquidacionDistribucion){
      console.log(selected);
      return this.http.put<any[]>(URL_SERVICIOS+"distribucion/operacion/cobro/medico/actualizar/"+selected.id,selected);
      } 
 
    DistribuirOperacionCobro(liquidacion:Liquidacion[]){  
      return this.http.post<any>(URL_SERVICIOS+'operacioncobro/distribuir/orden',liquidacion);
    }

    GetDistribucionByExpediente(liquidacion:Liquidacion[]){  
      return this.http.post<any>(URL_SERVICIOS+'operacioncobro/distribucion/expediente',liquidacion);
      }

      GetDistribucionByNumero(id: string){  
      return this.http.get<any>(URL_SERVICIOS+'operacioncobro/distribucion/numero?id=' + id);
      }
   
      GetDistribucionByMedico(liquidacion:Liquidacion[]){  
        return this.http.post<any>(URL_SERVICIOS+'operacioncobro/distribucion/medico', liquidacion);
        }
      
      GetDistribucionByMedicoDetalle(liquidacion:Liquidacion[]){  
        return this.http.post<any>(URL_SERVICIOS+'operacioncobro/distribucion/medico/detalle', liquidacion);
        }
  
        clonarLiquidacion(liquidacion: Liquidacion[]) {
    return this.http.post<Liquidacion[]>(this.url+'/distribucion/clonar', liquidacion);
    }

    LiquidarExpedientes(liquidacion:Liquidacion[], numero: string) {
      return this.http.post<any>(URL_SERVICIOS+'operacioncobro/distribuir/orden/liquidar?numero=' + numero, liquidacion);
    }

    generarLiquidacionNumero(liquidacion) {
      console.log(liquidacion);
      return this.http.post<any>(URL_SERVICIOS+'operacioncobro/liquidacion/generdada/id', liquidacion);
    }


    getLiquidacionNumero(id: string){  
      return this.http.get<any>(URL_SERVICIOS+'operacioncobro/liquidacion/generdada?id=' + id);
      }
   
    
}
