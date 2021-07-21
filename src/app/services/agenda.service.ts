import { AgendaDiaBloqueo } from './../models/agenda-dia-bloqueo.model';
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';


import { URL_SERVICIOS, PARAMS } from '../config/config';
import { Agenda } from '../models/agenda.model';
import { AgendaDiaHora } from '../models/agenda-dia-horario.model';
import { AgendaMedico } from '../models/agenda-medico.model';
import { AgendaHorario } from '../models/agenda-horario.model';
import { AgendaMedicoHorarioDia } from '../models/agenda-medico-horario-dia.model';
import { AgendaTurno } from '../models/agenda-turno.model';

@Injectable({
  providedIn: 'root'
})
export class AgendaService {
  private url_simple:string =URL_SERVICIOS;
  private url:string  = URL_SERVICIOS + 'pacienteagenda';
  private url_agenda:string  = URL_SERVICIOS + 'agenda/';

  constructor(public http: HttpClient) { }

getItem(id:number){
  return this.http.get<Agenda>(this.url+"/"+id);
  }

getItems(){
  return this.http.get<Agenda[]>(this.url);
  }

putItem(val:AgendaTurno, id:string){
  console.log(val); 
  return this.http.put<AgendaTurno>(this.url_agenda+id,val);
}

crearAgendaMedico(val:AgendaMedicoHorarioDia){
  console.log(val); 
  return this.http.post<AgendaMedicoHorarioDia>(this.url_agenda+"crear/medico", val);
}

getItembyDateToday(){
  return this.http.get<Agenda[]>(this.url_simple+"pacienteagenda/bydate/today");
  }

getItembyDateSelected(fecha:string){
  return this.http.get<Agenda[]>(this.url_simple+"pacienteagenda/bydateselected/"+fecha);
  }


getItembyDni(dni:string){
  console.log(this.url_simple+"pacienteagenda/bydatedni/"+dni);
  return this.http.get<Agenda[]>(this.url_simple+"pacienteagenda/bydatedni/"+dni);
  }
  getItemsAgendaByhorario(){
    console.log(this.url_agenda+"horarios");
    return this.http.get<AgendaDiaHora[]>(this.url_agenda+"horarios");
    } 
  getItemsAgendaByMedico(dni:string){
    console.log(this.url_simple+"pacienteagenda/bydatedni/"+dni);
    return this.http.get<Agenda[]>(this.url_simple+"pacienteagenda/bydatedni/"+dni);
    }

  getItemsAgendaByDiaHorario(dni:string){
    console.log(this.url_agenda+"pacienteagenda/bydatedni/"+dni);
    return this.http.get<AgendaDiaHora[]>(this.url_agenda+"pacienteagenda/bydatedni/"+dni);
    }  


    getAgendaByMedicoTodos(usuario_id:string,agenda_dia_id:string, es_habilitado:string){
      return this.http.get<AgendaMedico>(this.url_agenda+"medico/todo?usuario_id="+usuario_id+"&agenda_dia_id="+agenda_dia_id+"&es_habilitado="+es_habilitado);
    }
  getAgendaByMedico(usuario_id:string,agenda_dia_id:string, es_habilitado:string){
    return this.http.get<AgendaMedico>(this.url_agenda+"medico/dia?usuario_id="+usuario_id+"&agenda_dia_id="+agenda_dia_id+"&es_habilitado="+es_habilitado);
  }
  
  getAgendaDisponible(usuario_id:string,agenda_dia_id:string, es_habilitado:string){
    return this.http.get<AgendaMedico>(this.url_agenda+"medico/disponilible?usuario_id="+usuario_id+"&agenda_dia_id="+agenda_dia_id+"&es_habilitado="+es_habilitado);
  }

  putAgendaDeshabilitar(id:string, val:AgendaMedico){
    return this.http.put<AgendaMedico>(this.url_agenda+"deshabilitar/"+id,val);
  }
  
  getDias(){
    return this.http.get<AgendaMedico>(this.url_agenda+"horarios/dias");
  }

  getHorario(){
    return this.http.get<AgendaHorario>(this.url_agenda+"horarios/periodo");
  }

  
  getHorarioTurnoTodos(agendaTurno:AgendaTurno){
    console.log(this.url_agenda+"horarios/turno/todos?fecha_turno="+agendaTurno.fecha_turno+"&agenda_estado_id="+agendaTurno.agenda_estado_id+"&usuario_id="+agendaTurno.usuario_id);
    return this.http.get<AgendaTurno[]>(this.url_agenda+"horarios/turno/todos?fecha_turno="+agendaTurno.fecha_turno+"&agenda_estado_id="+agendaTurno.agenda_estado_id+"&usuario_id="+agendaTurno.usuario_id);
  }

  getHorarioTurnoPresente(agendaTurno:AgendaTurno){
    console.log(this.url_agenda+"horarios/turno/presente?fecha_turno="+agendaTurno.fecha_turno+"&agenda_estado_id="+agendaTurno.agenda_estado_id+"&usuario_id="+agendaTurno.usuario_id);
    return this.http.get<AgendaTurno[]>(this.url_agenda+"horarios/turno/presente?fecha_turno="+agendaTurno.fecha_turno+"&agenda_estado_id="+agendaTurno.agenda_estado_id+"&usuario_id="+agendaTurno.usuario_id);
  }

  getAgendaAtencionOtrosEstados(agendaTurno:AgendaTurno){
    console.log(this.url_agenda+"horarios/turno/otrosestados?fecha_turno="+agendaTurno.fecha_turno+"&agenda_estado_id="+agendaTurno.agenda_estado_id+"&usuario_id="+agendaTurno.usuario_id);
    return this.http.get<AgendaTurno[]>(this.url_agenda+"horarios/turno/otrosestados?fecha_turno="+agendaTurno.fecha_turno+"&agenda_estado_id="+agendaTurno.agenda_estado_id+"&usuario_id="+agendaTurno.usuario_id);
  }

  getHorarioTurno(agendaTurno:AgendaTurno){
    return this.http.get<AgendaTurno[]>(this.url_agenda+"horarios/turno?fecha_turno="+agendaTurno.fecha_turno+"&agenda_estado_id="+agendaTurno.agenda_estado_id+"&usuario_id="+agendaTurno.usuario_id);
  }

  getHorarioTurnoMedico(agendaTurno:AgendaTurno){
    return this.http.get<AgendaTurno[]>(this.url_agenda+"horarios/turno/medico?fecha_turno="+agendaTurno.fecha_turno+"&agenda_estado_id="+agendaTurno.agenda_estado_id+"&usuario_id="+agendaTurno.usuario_id);
  }

  getHorarioTurnoMedicoSinEstado(agendaTurno:AgendaTurno){
    return this.http.get<AgendaTurno[]>(this.url_agenda+"horarios/turno/medico/noestado?fecha_turno="+agendaTurno.fecha_turno+"&agenda_estado_id="+agendaTurno.agenda_estado_id+"&usuario_id="+agendaTurno.usuario_id);
  }

  getHorarioTurnoTodosSinEstado(agendaTurno:AgendaTurno){
    return this.http.get<AgendaTurno[]>(this.url_agenda+"horarios/turno/todos/noestado?fecha_turno="+agendaTurno.fecha_turno+"&agenda_estado_id="+agendaTurno.agenda_estado_id+"&usuario_id="+agendaTurno.usuario_id);
  }

  
  getHorarioTurnoTodosSinEstadoByDates(fecha_desde:string, fecha_hasta:string){
    console.log('bydfates');
    return this.http.get<AgendaTurno[]>(this.url_agenda+"horarios/turno/todos/noestado/bydates?fecha_desde="+fecha_desde+"&fecha_hasta="+fecha_hasta);
  }

  getHorarioTurnoTodosSinEstadoByDatesGerencia(fecha_desde:string, fecha_hasta:string){
    console.log('bydfates');
    return this.http.get<AgendaTurno[]>(this.url_agenda+"horarios/turno/todos/noestado/bydates/gerencia?fecha_desde="+fecha_desde+"&fecha_hasta="+fecha_hasta);
  }

  getHorarioTurnoDisponible(fecha_turno:string,agenda_estado_id:string,usuario_id:string){
    return this.http.get<AgendaTurno[]>(this.url_agenda+"horarios/turno/nuevo?fecha_turno="+fecha_turno+"&agenda_estado_id="+agenda_estado_id+"&usuario_id="+usuario_id);
  }

  getHorarioTurnoDisponibleByUsuario(fecha_turno:string,agenda_estado_id:string,usuario_id:string){
    return this.http.get<AgendaTurno[]>(this.url_agenda+"horarios/turno/nuevo/usuario?fecha_turno="+fecha_turno+"&fecha="+fecha_turno+"&agenda_estado_id="+agenda_estado_id+"&usuario_id="+usuario_id);
  }

  getHorarioTurnoDisponibleByUsuarioTodos(fecha_turno:string,agenda_estado_id:string,usuario_id:string){ 
    console.log(this.url_agenda+"horarios/turno/nuevo/usuario/todos?fecha_turno="+fecha_turno+"&fecha="+fecha_turno+"&agenda_estado_id="+agenda_estado_id+"&usuario_id="+usuario_id);
   // return this.http.get<AgendaTurno[]>(this.url_agenda+"horarios/turno/nuevo/usuario/todos?fecha_turno="+fecha_turno+"&fecha="+fecha_turno+"&agenda_estado_id="+agenda_estado_id+"&usuario_id="+usuario_id);
   return this.http.get<AgendaTurno[]>(this.url_agenda+"horarios/turno/medico/sobreturno?fecha_turno="+fecha_turno+"&agenda_estado_id="+agenda_estado_id+"&usuario_id="+usuario_id);
  }

  agendarTurno(turno:AgendaTurno){
    return this.http.post<AgendaTurno[]>(this.url_agenda+"asignar/turno",turno);
  }
 
  // BLOQUEA LA AGENDA POR UN PERIODO DE TIEMPO
  bloquearAgendaTurno(fechas:AgendaDiaBloqueo[]){
    return this.http.post<string>(this.url_agenda+"horarios/horarios/bloquear/periodo",fechas);
  }

  bloquearTurno(fecha:string,usuario_id:string, agenda_usuario_dia_horario_id:string){
    return this.http.get<AgendaTurno>(this.url_agenda+"horarios/horarios/bloquear/turno?agenda_usuario_dia_horario_id="+agenda_usuario_dia_horario_id+"&fecha="+fecha+"&usuario_id="+usuario_id);
  }

  getAgendaBloqueoByMedicoAndDiaTodoEstado(usuario_id:string,fecha:string){
    return this.http.get<AgendaMedico>(this.url_agenda+"horarios/horarios/bloquear/medico?fecha="+fecha+"&usuario_id="+usuario_id);
  }

  getCalendarioBloqueoByMedico(usuario_id:string,fecha:string){
    return this.http.get<any[]>(this.url_agenda+"horarios/medico/bloqueado?fecha_desde="+fecha+"&usuario_id="+usuario_id);
  }

  getAgendaByMedicoDiaTodosEstado(fecha:string, agenda_estado_id:string,usuario_id:string){
    console.log(this.url_agenda+"horarios/turno/nuevo?fecha_turno="+fecha+"&agenda_estado_id="+agenda_estado_id+"&usuario_id="+usuario_id);
    return this.http.get<AgendaTurno[]>(this.url_agenda+"horarios/turno/nuevo?fecha_turno="+fecha+"&agenda_estado_id="+agenda_estado_id+"&usuario_id="+usuario_id);
  }

  getHistoriaTurno(paciente_id:string){
    
    return this.http.get<AgendaTurno[]>(this.url_agenda+"horarios/paciente/historia/"+paciente_id);
  }
  

  cancelarTurno(id:string){
  console.log(this.url_agenda+"horarios/paciente/cancelar/"+id);
    return this.http.get<string>(this.url_agenda+"horarios/paciente/cancelar/"+id);
  }

  
  getTurnoCancelado(){
  console.log(this.url_agenda+" horarios/turno/eliminado");
    return this.http.get<AgendaTurno[]>(this.url_agenda+"horarios/turno/eliminado");
  }
  
  updateAgendaOperacionCobro( agendaturno:AgendaTurno, id:string){
    return this.http.put<AgendaMedico>(this.url_agenda+"horarios/turno/operacioncobro/actualizar/"+id,agendaturno);
  }


  getDiasBloqueados(usuario_id:string){
      return this.http.get<any>(this.url_agenda+"horarios/bloqueo/dia?usuario_id="+usuario_id);
    }

  getHorarioBloqueoByMedico(usuario_id:string,fecha:string){
      return this.http.get<any>(this.url_agenda+"horarios/bloqueo/turno?fecha="+fecha+'&usuario_id='+usuario_id);
    }   

  deleteAgendaMedicoHorario(id:string){
      return this.http.get<string>(this.url_agenda+"horarios/cancelar/horario/"+id);
    }

  deleteAgendaMedico(id:string){
  console.log(this.url_agenda+"horarios/cancelar/horario/"+id);
    return this.http.get<string>(this.url_agenda+"horarios/cancelar/agenda/"+id);
  }

  
  pacienteDerivado( agendaturno:AgendaTurno, id:string){
    console.log(this.url_agenda+"turno/derivado/"+id,agendaturno);
    return this.http.put<AgendaMedico>(this.url_agenda+"turno/derivado/"+id,agendaturno);
  }


  ActualizarTurnoLlamando( paciente_id:string, medico_id:string,puesto:string){
    
    return this.http.get<any>(this.url_agenda+"turno/pantalla/llamando?paciente_id="+paciente_id+'&medico_id='+medico_id+'&puesto='+puesto);
  }

  
} 


