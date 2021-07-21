import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';


import { URL_SERVICIOS, PARAMS } from '../config/config';

@Injectable({
  providedIn: 'root'
})
export class NotificacionesService {
  
  private url_chat:string  = URL_SERVICIOS + 'chat/';
  private url_notificacion:string  = URL_SERVICIOS + 'notificacion/';
  
  constructor(public http: HttpClient) { }

  getChat(chat:string){
    return this.http.get<any>(this.url_chat+'desencriptar?texto='+chat);
    }

  setChat(chat:string){      
    return this.http.get<any>(this.url_chat+'encriptar?texto='+chat);
  }
    
  
  getNotificacionesBynotificacionId(id:string){
    return this.http.get<any>(this.url_notificacion+'notificacion/by/notificacion?id='+id);
    }

    getNotificacionesByUsuario(id:string){
    return this.http.get<any>(this.url_notificacion+'notificacion/by/usuario?id='+id);
    }  

    crearNotificacion(notificacion:any){
    return this.http.post<any>(this.url_notificacion+'usuario',notificacion);
    }
    
    confirmarNotificacionByUsuario(notificacion:any, id:string){
    return this.http.put<any>(this.url_notificacion+'notificacion/'+id,notificacion);
    }
}
