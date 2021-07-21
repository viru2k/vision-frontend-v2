

import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';

import { URL_SERVICIOS, PARAMS } from '../config/config';



@Injectable({
  providedIn: 'root'
})
export class ChatService {

  private url:string  = URL_SERVICIOS;
  constructor(public http: HttpClient) { }



  getChatBySesion(id:string,sesion_id: string, grupo_nombre: string, limite:string){
    return this.http.get<any>(this.url+'chat/by/sesion?id='+id+'&sesion_id='+sesion_id+'&grupo_nombre='+grupo_nombre+'&limite='+limite);
  }


  altaUsuarioSesionLista(id:number){
    return this.http.get<any>(this.url+'/'+id);
  }
  

  crearSesionListado(id:number){
    return this.http.get<any>(this.url+'/'+id);
  }

  asociarUsuarioGrupo(id:number, usuario_carga:number, grupo:string, sesion_id:string){
    return this.http.get<any>(this.url+'chat/usuario/alta/sesion/grupo?usuario_id='+id+'&usuario_carga='+usuario_carga+'&grupo='+grupo+'&sesion_id='+sesion_id);
  }

  crearSesionListadoGrupo(grupo_nombre:string){
    return this.http.get<any>(this.url+'chat/alta/sesion/grupo?grupo_nombre='+grupo_nombre);
  }


  getSesionListByUsuario(id:number){
    return this.http.get<any[]>(this.url+'chat/usuario/lista/sesion?id='+id);
  }


  getGrupos(){
    return this.http.get<any[]>(this.url+'chat/grupos');
  }

  
  getGrupoDetalleUsuarios(sesion_id: string){
    return this.http.get<any[]>(this.url+'chat/grupo/detalle/usuarios?sesion_id=' + sesion_id);
  }

  destroyUsuarioGrupoSesion(sesion_id: string, usuario_id: string){
    return this.http.get<any[]>(this.url+'chat/grupo/detalle/usuarios/borrar?sesion_id=' + sesion_id + '&usuario_id=' + usuario_id);
  }
 

  getSesionListByGrupo(id:number){
    return this.http.get<any>(this.url+'chat/usuario/lista/sesion/grupo'+id);
  }


  insertarRenglonChat(renglon:any){
    return this.http.post<any>(this.url+'chat/renglon',renglon);
  }

  actualizarRenglonListado(id:string,sesion_id: string){
    return this.http.get<any>(this.url+'chat/renglon/leido?id='+id+'&sesion_id='+sesion_id);
  }

}