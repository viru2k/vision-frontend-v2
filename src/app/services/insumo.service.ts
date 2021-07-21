
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';


import { URL_SERVICIOS, PARAMS } from '../config/config';

@Injectable({
  providedIn: 'root'
})
export class InsumoService {

  private url: string  = URL_SERVICIOS ;

  constructor(public http: HttpClient) { }


  getInsumo() {
    return this.http.get<any[]>(this.url + 'insumo/activo');
    }


    getInsumoStock() {
    return this.http.get<any[]>(this.url + 'insumo/stock');
    }

    getInsumoStockMovimiento(insumo_stock_id: string) {
    return this.http.get<any[]>(this.url + 'insumo/stock/movimiento?insumo_stock_id=' + insumo_stock_id);
    }

    crearInsumo(insumo: any) {
      return this.http.post<any>(this.url + 'insumo/nuevo', insumo);
      }

    actualizarInsumo(insumo: any, id: string) {
      return this.http.put<any>(this.url + 'insumo/actualizar/' + id, insumo);
      }

    crearInsumoStock(insumo: any) {
      return this.http.post<any>(this.url + 'insumo/stock/nuevo', insumo);
      }

    crearInsumoStockMovimiento(insumo: any) {
      return this.http.post<any>(this.url + 'insumo/stock/movimiento', insumo);
      }

}

