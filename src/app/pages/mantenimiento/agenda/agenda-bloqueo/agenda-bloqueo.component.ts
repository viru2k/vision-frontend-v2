import { AgendaDiaBloqueo } from './../../../../models/agenda-dia-bloqueo.model';
import { FormGroup, FormControl } from '@angular/forms';
import { UserService } from './../../../../services/user.service';
import { Component, OnInit } from '@angular/core';
import swal from 'sweetalert2';
import { calendarioIdioma } from '../../../../config/config';
import { AgendaService } from '../../../../services/agenda.service';
import { MessageService, DialogService } from 'primeng/api';
import { User } from '../../../../models/user.model';
import { Dia } from '../../../../models/dias.model';
import { AgendaDiaHora } from '../../../../models/agenda-dia-horario.model';
import { AgendaMedico } from '../../../../models/agenda-medico.model';
import { AgendaHorario } from '../../../../models/agenda-horario.model';
import { AgendaMedicoHorarioDia } from '../../../../models/agenda-medico-horario-dia.model';
import { formatDate } from '@angular/common';
import { THIS_EXPR } from '@angular/compiler/src/output/output_ast';

@Component({
  selector: 'app-agenda-bloqueo',
  templateUrl: './agenda-bloqueo.component.html',
  styleUrls: ['./agenda-bloqueo.component.css'],
  providers: [MessageService,DialogService]
})
export class AgendaBloqueoComponent implements OnInit {

 
  habilitado:string;
  botonEnabled:boolean =false;
  botonDiaEnabled:boolean = false;
  cols:any;
  colsDias:any;
  colsAgenda:any;
  es:any;
  dias:any;
  _fechaHoy:string;
  fechaHoy:Date;
  horario:AgendaHorario;
  loading: boolean;
  usuarios:User[];
  agendaDiaHora:AgendaDiaHora;
  agendaMedico:AgendaMedico;
  selectedItemUsuario:User;
  selectedItemUsuarios:User[];
  selectedItemDias:Dia[];
  selectedItemDia:Dia;
  selectedItemHorario:AgendaHorario;
  selectedItemAgenda:AgendaMedico;
  agendaMedicoHorarioDia:AgendaMedicoHorarioDia;
  //dates;
  _dates;
  dates: Date[];
  fechasBloqueo:AgendaDiaBloqueo[] =[]; 
  mfechasBloqueo:any[] =[]; 
  fechaBloqueo:AgendaDiaBloqueo;
  cont:number;
  DateForm:FormGroup;

  constructor(private miUserServico:UserService, private miServico:AgendaService ,private messageService: MessageService ,public dialogService: DialogService ) {     
    this.cols = [
      {field: 'nombreyapellido', header: 'Usuario' },
    ];

     this.colsDias = [
    {field: 'dia_nombre', header: 'Dia' },
    ];

    this.colsAgenda = [
    {field: 'dia_nombre', header: 'Dia' }, 
    {field: 'hora_desde_hasta', header: 'Hora desde - hasta' }, 
    {field: 'es_habilitado', header: 'Habilitado' },
    {field: 'boton', header: '' },
    ];

 
  }

  ngOnInit() {
    
    this.cont= 0;
    this.fechaHoy = new Date();
    let today = new Date();
    this.showToast("exito","Renglon actualizado","Guardado correcto");
    
this.loadList();
  }


  actualizarFechaBloqueo(evt){
    //console.log(evt);
   // console.log(this.dates);
    console.log("contador "+this.cont);
    if(this.cont==2){
      this.cont= 0;
      this.dates[0] = new Date(evt);
      this.dates[1] = new Date(evt);
    }
    if(this.cont==1){
      this.cont++;
      this.dates[1] = new Date(evt);        
    }if(this.cont==0){
      this.cont++;
      this.dates[0] = new Date(evt);
    }
    console.log("contador "+this.cont);
    console.log(this.dates);
    console.log(JSON.stringify(this.dates));
  }
 

  limpiarFecha(evt){
    this.cont =0;
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







loadHorarios(){
  this.es = calendarioIdioma;
  this.loading = true;
  this._fechaHoy = formatDate(this.fechaHoy, 'yyyy-MM-dd', 'en');
  console.log(this._fechaHoy);
 if(this._fechaHoy!=""){
  try {    
      this.miServico.getAgendaBloqueoByMedicoAndDiaTodoEstado(this.selectedItemUsuario.id,this._fechaHoy)   
      .subscribe(resp => {
      this.agendaMedico = resp;                 
          this.loading = false;      
         
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
}

confirmarBloqueo(){
 console.log(this.dates);

  swal({
    title: 'Va a bloquear un rango de fechas',
    text: "Desea proseguir",
    type: 'warning',
    showCancelButton: true,
    confirmButtonColor: '#3085d6',
    cancelButtonColor: '#d33',
    confirmButtonText: 'Si, guardar!'
  }).then((result) => {
    if (result.value) {
      console.log(this.dates);
      this.bloquearPeriodo(this.dates);
   
    }
  })
}

confirmarBloqueoAgenda(res){

  swal({
    title: 'Va a bloquear un horario',
    text: "Desea proseguir",
    type: 'warning',
    showCancelButton: true,
    confirmButtonColor: '#3085d6',
    cancelButtonColor: '#d33',
    confirmButtonText: 'Si, guardar!'
  }).then((result) => {
    if (result.value) {
      this.bloquearTurno(res);
    }
  })
}

bloquerAgenda(res){
 
  console.log(res);
  console.log(this.dates);
}


bloquearTurno(res){
  
  
console.log(this.fechaHoy.getDay());
  this._fechaHoy = formatDate(this.fechaHoy, 'yyyy-MM-dd', 'en');
  console.log(this._fechaHoy);
 if(this._fechaHoy!=""){
  console.log(res);
    this.loading = true;
    try {
        this.miServico.bloquearTurno(this._fechaHoy,res.usuario_id,res.agenda_usuario_dia_horario_id)    
        .subscribe(resp => {
          this.loadHorarios();
       // this.agendaTurno = resp;                 
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



bloquearPeriodo(res){
  
let i =0;
    console.log(res);
    
    if(this.selectedItemUsuario!=undefined ){
    for(i=0;i<res.length;i++){
      this.fechaBloqueo = new AgendaDiaBloqueo("0",res[i],this.selectedItemUsuario.id);
      this.fechasBloqueo.push(this.fechaBloqueo);
      
      console.log(this.fechaBloqueo);
      console.log(this.fechasBloqueo[i]);
    }

    let t =JSON.stringify(this.fechasBloqueo);
    
    console.log(this.fechasBloqueo);
      this.loading = true;
      try {
          this.miServico.bloquearAgendaTurno(this.fechasBloqueo)    
          .subscribe(resp => {
           // this.loadHorarios();
           this.throwAlert("success","Se bloquearon las fechas para el usuario: "+this.selectedItemUsuario.nombreyapellido,"","");
         // this.agendaTurno = resp;                 
              this.loading = false;
              console.log(resp);
              this.fechasBloqueo = [];
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
      this.throwAlert("warning","error","Debe seleccionar un usuario","100");
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
}





showToast(estado:string ,mensaje:string, encabezado:string){

  if(estado =="exito"){
      this.messageService.add({severity:'success', summary: mensaje, detail:encabezado});
  }
  if(estado =="info"){
      this.messageService.add({severity:'info', summary: 'El campo no es correcto', detail:'Los datos del campo son incorrectos'});
  }
  if(estado =="warning"){
      this.messageService.add({severity:'warning', summary: 'El campo no es correcto', detail:'Los datos del campo son incorrectos'});
  }
  if(estado =="error"){
      this.messageService.add({severity:'error', summary: 'Error', detail:'No se pudo modificar el registro'});
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
