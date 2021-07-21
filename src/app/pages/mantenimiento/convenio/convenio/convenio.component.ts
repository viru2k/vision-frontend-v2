import { EditConvenioComponent } from './../edit-convenio/edit-convenio.component';
import { ObraSocialService } from './../../../../services/obra-social.service';
import { Component, OnInit,Output, EventEmitter,ViewChild, PipeTransform, ElementRef, OnDestroy } from '@angular/core';
import { ConvenioService } from './../../../../services/convenio.service';
import {Convenio} from   '../../../../models/convenio.model';

import { calendarioIdioma } from '../../../../config/config';
import { FormGroup, FormControl, Validators } from '@angular/forms';

import swal from 'sweetalert2';
declare const require: any;
const jsPDF = require('jspdf');
require('jspdf-autotable');

import { MessageService } from 'primeng/api';
import { DialogService } from 'primeng/components/common/api';


@Component({
  selector: 'app-convenio',
  templateUrl: './convenio.component.html',
  styleUrls: ['./convenio.component.css'],
 
  providers: [MessageService,DialogService]
})
export class ConvenioComponent implements OnInit {

    
  
  cols: any[];
  selectedItem: Convenio;
  popItem:Convenio;
  newPopItem: boolean;
  resultSave:boolean;
  es:any;
  displayDialog: boolean;
  // LOADING
  loading: boolean;
  updateDataForm: FormGroup;
  elemento:Convenio = null;
  elementos:Convenio[] = null;
  _id:number = 0;
  columns: any[];
 

    constructor(private miServico:ConvenioService, private miServicoOs:ObraSocialService,private messageService: MessageService ,public dialogService: DialogService ) {
  
          this.cols = [
            { field: 'obra_social_nombre', header: 'Obra Social',  width: '20%' },
              {field: 'codigo', header: 'Codigo' , width: '7%' },
              { field: 'pmo_descripcion', header: 'Descripción',  width: '30%' },
              { field: 'complejidad', header: 'Nivel',  width: '7%' },
              { field: 'es_habilitado', header: 'Hab' , width: '6%'},
              { field: 'valor', header: 'Valor' , width: '7%'},
              { field: 'accion', header: 'Accion' , width: '70px'} 
             
           ];         
           
           this.columns = [
            {title: "Obra social", dataKey: "obra_social_nombre"},
            {title: "Código", dataKey: "codigo"}, 
            {title: "Descripción", dataKey: "pmo_descripcion"}, 
            {title: "Nivel", dataKey: "complejidad"}, 
            {title: "Valor", dataKey: "valor"}
        ];
          
          }
  
    ngOnInit() {
      
      this.loadList();

    }
  

    /** CARGA LA LISTA **/
  
    
     showDialogToAdd() {
          this.popItem = new Convenio("",0,"","","","",0,"","","","","","","","");     
            let data:any; 
            const ref = this.dialogService.open(EditConvenioComponent, {
            data,
             header: 'Crear /Modificar registro', 
             width: '70%'
         });
 
         ref.onClose.subscribe((editConvenioComponent:Convenio) => {
             if (editConvenioComponent) {
             console.log(editConvenioComponent);    
                  this.popItem = editConvenioComponent;
             if( this.nuevoItem()){
                this.throwAlert("success","Se creo el registro con éxito","","");
               } 
             }
         });

      }
  
     showDialogToUpdate(event) {
          console.log(event);
          this.popItem = new Convenio(event.id,event.valor, event.obra_social_id,event.obra_social_nombre,"","",0,event.es_habilitada,
            event.pmo_id,event.codigo,event.pmo_descripcion,event.complejidad, event.es_habilitado, event.es_coseguro, event.tiene_distribucion);          
          let data:any; 
          data = this.popItem;
          const ref = this.dialogService.open(EditConvenioComponent, {
           data,
            header: 'Crear /Modificar registro', 
            width: '70%'
        });

        ref.onClose.subscribe((editConvenioComponent:Convenio) => {
            if (editConvenioComponent) {
            console.log(editConvenioComponent);
            
          
            this.throwAlert("success","Se modifico el registro con éxito","","");
            try { 
              this.miServico.putItem(this.popItem, this.popItem.id)
              .subscribe(resp => {
              this.elemento = resp;
                 
              this.loading = false;
             this.loadList();
              this.resultSave = true;
             
              
              },   
              error => { // error path
                  console.log(error.message);
                  console.log(error.status);
                  this.throwAlert("error","Error: "+error.status,"  Error al insertar los registros",error.status);
                  this.resultSave = false;
                  
       });    
          } catch (error) {
              this.throwAlert("error","Error al cargar los registros",error,error.status);
          }
          return this.resultSave;
           }
            
        });
      }
  
      editRow(row){
        console.log(row.data);
        this.popItem = row.data;
             if( this.actualizarDatos()){
            this.showToast('exito',"Registro modificado","Exito al modificar");
        }
    }

      loadList(){
        this.es = calendarioIdioma;
        this.loading = true;
        try {
            this.miServico.getItems()    
            .subscribe(resp => {
            this.elementos = resp;                 
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

     actualizarLista(){
         this.loadList();
     }
 
      actualizarDatos(){
        
              try { 
                  this.miServico.putItem(this.popItem, this.popItem.id)
                  .subscribe(resp => {
                  this.elemento = resp;
                     
                  this.loading = false;
                 
                  this.resultSave = true;
                  this.showToast('exito',"Registro modificado","Exito al modificar");
                  
                  },   
                  error => { // error path
                      console.log(error.message);
                      console.log(error.status);
                      this.throwAlert("error","Error: "+error.status,"  Error al insertar los registros",error.status);
                      this.resultSave = false;
                      
           });    
              } catch (error) {
                  this.throwAlert("error","Error al cargar los registros",error,error.status);
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
                      this.throwAlert("error","Error: "+error.status,  "Error al cargar los registros",error.status);
                      this.resultSave = false;
                    });    
              } catch (error) {
                  this.throwAlert("error","Error al cargar los registros",error,error.status);
              }
              return this.resultSave;
      }

      insertarPracticas(){
        this.es = calendarioIdioma;
        this.loading = true;
        try {
            this.miServicoOs.insertarCoseguro()    
            .subscribe(resp => {
           // this.elementos = resp;       
           this.showToast('exito',"Registros insertados","Exito al insertar registros");          
                this.loading = false;
                this.loadList();
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

      ActualizarValores(){
        this.es = calendarioIdioma;
        this.loading = true;
        try {
            this.miServicoOs.actualizarCoseguro()    
            .subscribe(resp => {
              this.showToast('exito',"Registros actualizados","Exito al actualizar");          
                this.loading = false;
                this.loadList();
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
 
      generarPdf(){
        var a:any;
        var doc = new jsPDF('l', 'pt');
        
     /** */   doc.autoTable(this.columns, this.elementos,
            {
               
                margin: {horizontal: 7},
                bodyStyles: {valign: 'top'},
                styles: {overflow: 'linebreak', columnWidth: 'wrap'},
                columnStyles: {text: {columnWidth: 'auto'}}
            }
            );
        doc.save("table.pdf");    
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

          if(errorNumero =="422"){
            mensaje ="Los datos que esta tratando de guardar son iguales a los que ya poseia";
            swal({   
                type: 'warning',
                title: 'Atención..',
                text: mensaje,
                footer: motivo
              })
        }
          
          if((estado== "error")&&(errorNumero!="422")){
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