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


@Component({
  selector: 'app-agenda-medico',
  templateUrl: './agenda-medico.component.html',
  styleUrls: ['./agenda-medico.component.css'],
  providers: [MessageService,DialogService]
})
export class AgendaMedicoComponent implements OnInit {

  habilitado:string;
  botonEnabled:boolean =false;
  botonDiaEnabled:boolean = false;
  cols:any;
  colsDias:any;
  colsAgenda:any;
  es:any;
  dias:any;
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
    this.showToast("exito","Renglon actualizado","Guardado correcto");
    
this.loadList();
this.loadDias();
this.loadHorasPeriodo();
  }


  
loadList(){
  this.es = calendarioIdioma;
  this.loading = true;
  try {
      this.miUserServico.getItems()    
      .subscribe(resp => {
        if (resp[0]) {
          this.usuarios = resp;  
          console.log(this.usuarios);
            }else{
              this.usuarios =null;
            }
                     
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



loadDias(){
  this.es = calendarioIdioma;
  this.loading = true;
  try {
      this.miServico.getDias()    
      .subscribe(resp => {
      this.dias = resp;                 
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



loadHorasPeriodo(){
  
  this.loading = true;
  try {
      this.miServico.getHorario()    
      .subscribe(resp => {
      this.horario = resp;                 
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
  try {    
      this.miServico.getAgendaByMedicoTodos(this.selectedItemUsuario.id,this.selectedItemDia.id,"S")   
      .subscribe(resp => {
        if (resp[0]) {
          this.agendaMedico = resp;   
          console.log(this.agendaMedico);
            }else{
              this.agendaMedico =null;
            }
                   
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




updateEstado(){
 // this.loading = true;
  try {
      this.miServico.putAgendaDeshabilitar(this.selectedItemAgenda.id,this.selectedItemAgenda)   
      .subscribe(resp => {
               
  this.showToast("exito","Renglon actualizado","Guardado correcto");
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

crearAgendaDia(){
  // this.loading = true;
   try {
       this.miServico.crearAgendaMedico(this.agendaMedicoHorarioDia)   
       .subscribe(resp => {
                
   this.showToast("exito","Renglon actualizado","Guardado correcto");
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


guardarDatos(){
  //console.log(this.selectedItemDia);
 // console.log(this.selectedItemUsuario);
  //console.log(this.selectedItemHorario);
  this.agendaMedicoHorarioDia = new AgendaMedicoHorarioDia("0",this.selectedItemUsuario.id, this.selectedItemDia.id, this.selectedItemHorario.id);
  console.log(this.agendaMedicoHorarioDia);
  this.confirmarOperacion();
}

confirmarOperacion(){

  swal({
    title: 'Va a generar un listado horario',
    text: "Desea proseguir",
    type: 'warning',
    showCancelButton: true,
    confirmButtonColor: '#3085d6',
    cancelButtonColor: '#d33',
    confirmButtonText: 'Si, guardar!'
  }).then((result) => {
    if (result.value) {
      this.crearAgendaDia();
    }
  })
}
verDias(){
  if((this.selectedItemDia)&&(this.selectedItemUsuario)){
 this.loadHorarios();
  }else{
    this.throwAlert("warning","Faltan datos","Por favor verifique los datos","Datos erroneos");
  }
}

habilitar(res){
  this.selectedItemAgenda = res;
  if(res.es_habilitado =='S'){
    this.selectedItemAgenda.es_habilitado = 'N';
  }else{
    this.selectedItemAgenda.es_habilitado = 'S';
  }
  this.updateEstado();
}

onRowUsuario(){
  if(this.selectedItemUsuario){
    this.botonEnabled = true;
  }else{
    this.botonEnabled = false;
  }
  if((this.selectedItemDia != null)&&(this.selectedItemUsuario != null)&&(this.selectedItemHorario != null)){
    this.botonDiaEnabled = true;
  }else{
    this.botonDiaEnabled = false;
  }
  console.log(this.selectedItemUsuario);
}

onRowDia(){
  if((this.selectedItemDia != null)&&(this.selectedItemUsuario != null)&&(this.selectedItemHorario != null)){
    this.botonDiaEnabled = true;
  }else{
    this.botonDiaEnabled = false;
  }
  console.log(this.selectedItemDia);
}

 onRowHorario(){
  if((this.selectedItemDia != null)&&(this.selectedItemUsuario != null)&&(this.selectedItemHorario != null)){
    this.botonDiaEnabled = true;
  }else{
    this.botonDiaEnabled = false;
  }
  console.log(this.selectedItemHorario);
}


colorRow(estado:string){
 
  if(estado == 'S') {  
      return {'es-habilitado'  :'null' };
  }
  
  if(estado == 'N') {  
      return {'es-deshabilitado'  :'null' };
  }
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

  if(estado== "warning"){
    swal({
        type: 'warning',
        title: 'Cuidado!',
        text: mensaje
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


