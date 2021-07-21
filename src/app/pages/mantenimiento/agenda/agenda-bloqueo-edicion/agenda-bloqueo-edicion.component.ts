import { Component, OnInit } from '@angular/core';
import { calendarioIdioma } from '../../../../config/config';
import swal from 'sweetalert2';
import { UserService } from './../../../../services/user.service';
import { formatDate } from '@angular/common';
import { AgendaService } from '../../../../services/agenda.service';
import { User } from './../../../../models/user.model';


@Component({
  selector: 'app-agenda-bloqueo-edicion',
  templateUrl: './agenda-bloqueo-edicion.component.html',
  styleUrls: ['./agenda-bloqueo-edicion.component.css']
})
export class AgendaBloqueoEdicionComponent implements OnInit {

  habilitado:string;
  botonEnabled:boolean =false;
  botonDiaEnabled:boolean = false;
  agendaMedico:any;
  agendaMedicoDia:any;
  cols:any;
  colsDias:any;
  colsAgenda:any;
  colsAgendaDia:any;
  es:any;
  _fechaHoy:string;
  fechaHoy:Date;  
  loading: boolean;
  usuarios:User[];
  selectedItemUsuario:User;
  selectedItemUsuarios:User[];

  constructor(private miUserServico:UserService,  private miServico:AgendaService) { 

    
    this.colsAgenda = [
      {field: 'dia_nombre', header: 'Dia' }, 
      {field: 'hora_desde_hasta', header: 'Hora desde - hasta' }, 
      {field: 'fecha', header: 'Fecha' },
      {field: 'boton', header: '' },
      ];

      this.colsAgendaDia = [       
        {field: 'fecha', header: 'Fecha' },
        {field: 'boton', header: '' },
        ];
  
  }

  ngOnInit() {
    this.fechaHoy = new Date();
    this.loadList();
  }

  
  actualizarFecha(event){
    this.fechaHoy = event;
  }

loadList(){
  this.es = calendarioIdioma;
  this.loading = true;
  try {
      this.miUserServico.getItems()    
      .subscribe(resp => {
      this.usuarios = resp;                 
          this.loading = false;
          console.log(resp);
      },
      error => { // error path
          console.log(error.message);
          console.log(error.status);
          this.throwAlert("error","Error: "+error.status+"  Error al cargar los registros",error.message, error.status);
       });    
  } catch (error) {
  this.throwAlert("error","Error al cargar los registros",error,error.status);
  }  
}

  
onRowUsuario(){
  if(this.selectedItemUsuario){
    this.botonEnabled = true;
  }else{
    this.botonEnabled = false;
  }
  if((this.selectedItemUsuario != null)){
    this.botonDiaEnabled = true;
  }else{
    this.botonDiaEnabled = false;
  }
  console.log(this.selectedItemUsuario);
  this.getHorarioBloqueoByMedico(this.selectedItemUsuario);
  this.getDiasBloqueados(this.selectedItemUsuario);
}



confirmarBloqueoAgenda(res){

  console.log(res);
  this.loading = true;
  try {
      this.miServico.deleteAgendaMedicoHorario(res.agenda_medico_bloqueo_horario_id)
      .subscribe(resp => {
          this.loading = false;
          console.log(this.selectedItemUsuario);
        this.getHorarioBloqueoByMedico(this.selectedItemUsuario);
      },
      error => { // error path
          console.log(error.message);
          console.log(error.status);
          this.throwAlert("error","Error: "+error.status+"  Error al cargar los registros",error.message, error.status);
       });    
  } catch (error) {
  this.throwAlert("error","Error al cargar los registros",error,error.status);
  }  

}



confirmarBloqueoAgendaDia(res){

  console.log(res);
  this.loading = true;
  try {
      this.miServico.deleteAgendaMedico(res.agenda_medico_bloqueo_id)
      .subscribe(resp => {
        console.log(this.selectedItemUsuario);
          this.loading = false;
          this.getDiasBloqueados(this.selectedItemUsuario);
      },
      error => { // error path
          console.log(error.message);
          console.log(error.status);
          this.throwAlert("error","Error: "+error.status+"  Error al cargar los registros",error.message, error.status);
       });    
  } catch (error) {
  this.throwAlert("error","Error al cargar los registros",error,error.status);
  }  

}


getHorarioBloqueoByMedico(res){
  
  

    this._fechaHoy = formatDate(this.fechaHoy, 'yyyy-MM-dd', 'en');
    console.log(this._fechaHoy);
   if(this._fechaHoy!=""){
    console.log(res);
      this.loading = true;
      try {
          this.miServico.getHorarioBloqueoByMedico(res.id, this._fechaHoy)
          .subscribe(resp => {
        //    this.loadHorarios();
          this.agendaMedico = resp;
              this.loading = false;
         
              console.log(resp);
          },
          error => { // error path
              console.log(error.message);
              console.log(error.status);
              this.throwAlert("error","Error: "+error.status+"  Error al cargar los registros",error.message, error.status);
           });    
      } catch (error) {
      this.throwAlert("error","Error al cargar los registros",error,error.status);
      }  
    }else{
      this.throwAlert("error","Error: "+404+"  No se selecciono una fecha","Error en la fecha", "400");
  
    }
  
  }
  


  
getDiasBloqueados(res){
  

  this._fechaHoy = formatDate(this.fechaHoy, 'yyyy-MM-dd', 'en');
  console.log(this._fechaHoy);
 if(this._fechaHoy!=""){
  console.log(res);
    this.loading = true;
    try {
        this.miServico.getDiasBloqueados(res.id)
        .subscribe(resp => {
      //    this.loadHorarios();
        this.agendaMedicoDia = resp;                 
            this.loading = false;
            
            console.log(resp);
        },
        error => { // error path
            console.log(error.message);
            console.log(error.status);
            this.throwAlert("error","Error: "+error.status+"  Error al cargar los registros",error.message, error.status);
         });    
    } catch (error) {
    this.throwAlert("error","Error al cargar los registros",error,error.status);
    }  
  }else{
    this.throwAlert("error","Error: "+404+"  No se selecciono una fecha","Error en la fecha", "400");

  }

}



throwAlert(estado:string, mensaje:string, motivo:string, errorNumero:string){
  let tipoerror:string;

  if(estado== "success"){
      swal({
          type: 'success',
          title: 'Exito',
          text: mensaje
        })
  }


if(estado == "warning"){
    
  swal({   
      type: 'warning',
      title: 'Atención..',
      text: mensaje,
      footer: motivo
    })
}
  if(estado== "error"){
    if(errorNumero =="422"){
        mensaje ="Los datos que esta tratando de guardar son iguales a los que ya poseia";
    }
    if(errorNumero =="400 "){
        mensaje ="Bad Request ";
    }
    if(errorNumero =="404"){
        mensaje ="No encontrado ";
    }
    if(errorNumero =="401"){
        mensaje ="Sin autorización";
    }
    if(errorNumero =="403"){
        mensaje =" Prohibido : La consulta fue valida, pero el servidor rechazo la accion. El usuario puede no tener los permisos necesarios, o necesite una cuenta para operar ";
    }
    if(errorNumero =="405"){
        mensaje ="Método no permitido";
    }
    if(errorNumero =="500"){
        mensaje ="Error interno en el servidor";
    }
    if(errorNumero =="503"){
        mensaje ="Servidor no disponible";
    }
    if(errorNumero =="502"){
        mensaje ="Bad gateway";
    }
    
      swal({   
          type: 'error',
          title: 'Oops...',
          text: mensaje,
          footer: motivo
        })
  }
}
}

