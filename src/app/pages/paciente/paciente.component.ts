import { PopupPacienteNuevoComponent } from './popup-paciente/popup-paciente.component';
import { PopupPacienteComponent } from '../../shared/components/popups/popup-paciente/popup-paciente.component';

import { Component, OnInit, PipeTransform } from '@angular/core';

import { PacienteService } from '../../services/paciente.service';
import {Paciente} from '../../models/paciente.model';
import { calendarioIdioma } from '../../config/config';

import {  formatDate } from '@angular/common';
import swal from 'sweetalert2';
declare const require: any;
const jsPDF = require('jspdf');
require('jspdf-autotable');
import { MessageService, DialogService } from 'primeng/api';
@Component({
  selector: 'app-paciente',
  templateUrl: './paciente.component.html',
  styleUrls: ['./paciente.component.css'],
  providers: [MessageService,DialogService]
})



export class PacienteComponent implements OnInit {

resultSave:boolean;
cols: any[];
selectedItem: Paciente;
displayDialog: boolean;
popItem:Paciente;
newPopItem: boolean;
// LOADING
loading: boolean;

elemento:Paciente = null;
elementos:Paciente[] = null;
_id:number = 0;

columns: any[];
rows: any[];
busqueda: string = 'paciente.apellido';
  textoBusqueda:string = '';

  constructor(private miServico:PacienteService, private messageService: MessageService ,public dialogService: DialogService ) {

        this.cols = [
            {field: 'apellido', header: 'Apellido',   width: '20%'  },
        { field: 'nombre', header: 'Nombre' ,  width: '20%' },
        { field: 'dni', header: 'DNI' ,  width: '10%' },
        { field: 'fecha_nacimiento', header: 'F. nacimiento' ,  width: '20%'  },
        { field: 'domicilio', header: 'Domicilio' ,  width: '30%'  },
         ];

         
    this.columns = [
        {title: 'Nombre', dataKey: 'nombre'},
        {title: 'Apellido', dataKey: 'apellido'}, 
        {title: 'DNI', dataKey: 'dni'},
        {title: 'Fecha nacimiento', dataKey: 'fecha_nacimiento'},
        {title: 'Domicilio', dataKey: 'domicilio'}
    ];
 
        }

  ngOnInit() {
    //this.loadList();
  }

 
  
  showDialogToAdd() {
                   
    this.popItem = new Paciente('0','','','','','',new Date(),'','','','sin_correo@delavision.com.ar','','','','','86','86','0','0','0','','','','','','');
      let data:any; 
      data = this.popItem;
      const ref = this.dialogService.open(PopupPacienteNuevoComponent, {
      data,
       header: 'Crear /Modificar registro', 
       width: '95%',
       height: '90%'
   });

   ref.onClose.subscribe((PopupPacienteNuevoComponent:Paciente) => {
       if (PopupPacienteNuevoComponent) {
       console.log(PopupPacienteNuevoComponent);    
            this.popItem = PopupPacienteNuevoComponent;
       if( this.nuevoItem()){
          this.throwAlert('success','Se creo el registro con éxito','','');
         } 
       }
   });

}

showDialogToUpdate(event) {
    console.log(event);
    this.popItem = new Paciente(event.data.id, event.data.dni, event.data.apellido, event.data.nombre, event.data.domicilio, event.data.sexo, event.data.fecha_nacimiento,
        event.data.ciudad, event.data.telefono_fijo, event.data.telefono_cel, event.data.email, event.data.tiene_whatsapp, event.data.obra_social_id, event.data.obra_social_nombre,
        event.data.coseguro_nombre, event.data.coseguro_id,event.data.usuario_alta_id, event.data.numero_afiliado, event.data.barra_afiliado,event.data.plan,event.data.tiene_distribucion, event.data.es_coseguro,
        event.data.coseguro_tiene_distribucion,event.data.coseguro_es_coseguro, event.data.es_habilitada, event.data.gravado_adherente);
                
    let data:any; 
    console.log(this.popItem);
    data = this.popItem;
    const ref = this.dialogService.open(PopupPacienteNuevoComponent, {
     data,
      header: 'Crear /Modificar registro', 
      width: '95%',
      height: '90%'
  });

  ref.onClose.subscribe((PopupPacienteNuevoComponent:Paciente) => {
      if (PopupPacienteNuevoComponent) {
      console.log(PopupPacienteNuevoComponent);
      this.popItem = PopupPacienteNuevoComponent;
     if( this.actualizarDatos()){
      this.throwAlert('success','Se modifico el registro con éxito','','');
     }
      }
  });
}

  /** CARGA LA LISTA **/

  buscar(){
    this.loadList();
}

  loadList(){
    
    this.loading = true;
    try {
        this.miServico.getItems(this.busqueda,this.textoBusqueda)          
        .subscribe(resp => {
        this.elementos = resp;                 
            this.loading = false;
            console.log(resp);
        },
        error => { // error path
            console.log(error.message);
            console.log(error.status);
            this.throwAlert('error','Error: '+error.status+'  Error al cargar los registros',error.message, error.status);
         });    
    } catch (error) {
    this.throwAlert('error','Error al cargar los registros',error,error.status);
    }  
}
 




actualizarDatos(){
          
    try { 
        console.log(this.popItem);
      //  console.log(this.popItem.id);
        this.miServico.putItem(this.popItem, this.popItem.id)
        .subscribe(resp => {
        this.elemento = resp;
        console.log(this.elemento);    
        this.loading = false;
        this.loadList();
        this.resultSave = true;
        },   
        error => { // error path
            console.log(error.message);
       //     console.log(error.status);
            this.throwAlert('error','Error: '+error.status,'  Error al insertar los registros',error.status);
            this.resultSave = false;
 });    
    } catch (error) {
        this.throwAlert('error','Error al cargar los registros',error,error.status);
    }
    return this.resultSave;
}


nuevoItem(){ 
   
    try { 
        this.miServico.postItem(this.popItem)
        .subscribe(resp => {
        this.elemento = resp;
        console.log(this.elemento);    
        this.loading = false;                  
        this.loadList();
        this.resultSave = true;
        },
        error => { // error path
            console.log(error.message);
            console.log(error.status);
            this.throwAlert('error','Error: '+error.status,  'Error al cargar los registros',error.status);
            this.resultSave = false;
          });    
    } catch (error) {
        this.throwAlert('error','Error al cargar los registros',error,error.status);
    }
    return this.resultSave;
        
}

    /** ACCIONES */

    imprimirTodos(){

    }

    imprimirRenglon(){
      //  this.throwAlert('success','Se creo el registro con éxito','');
    }


    
     

    generarPdf(){
        var a:any;
        var doc = new jsPDF('l', 'pt');
        
        doc.autoTable(this.columns, this.elementos,
            {
                margin: {horizontal: 7},
                bodyStyles: {valign: 'top'},
                styles: {overflow: 'linebreak', columnWidth: 'wrap'},
                columnStyles: {text: {columnWidth: 'auto'}}
            }
            );
        doc.save('table.pdf');    
    }

   

    throwAlert(estado:string, mensaje:string, motivo:string, errorNumero:string){
        let tipoerror:string;

        if(estado== 'success'){
            swal({
                type: 'success',
                title: 'Exito',
                text: mensaje
              })
        }

        if(errorNumero =='422'){
          mensaje ='Los datos que esta tratando de guardar son iguales a los que ya poseia';
          swal({   
              type: 'warning',
              title: 'Atención..',
              text: mensaje,
              footer: motivo
            })
      }
        
        if((estado== 'error')&&(errorNumero!='422')){
          if(errorNumero =='422'){
              mensaje ='Los datos que esta tratando de guardar son iguales a los que ya poseia';
          }
          if(errorNumero =='400 '){
              mensaje ='Bad Request ';
          }
          if(errorNumero =='404'){
              mensaje ='No encontrado ';
          }
          if(errorNumero =='401'){
              mensaje ='Sin autorización';
          }
          if(errorNumero =='403'){
              mensaje =' Prohibido : La consulta fue valida, pero el servidor rechazo la accion. El usuario puede no tener los permisos necesarios, o necesite una cuenta para operar ';
          }
          if(errorNumero =='405'){
              mensaje ='Método no permitido';
          }
          if(errorNumero =='500'){
              mensaje ='Error interno en el servidor';
          }
          if(errorNumero =='503'){
              mensaje ='Servidor no disponible';
          }
          if(errorNumero =='502'){
              mensaje ='Bad gateway';
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
