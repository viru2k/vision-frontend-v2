

import { PracticaDistribucionService } from './../../../../services/PracticaDistribucionService';



import { Component, OnInit} from '@angular/core';
import { calendarioIdioma } from '../../../../config/config';

import { PracticaDistribucion } from '../../../../models/practica-distribucion.model';
import { DynamicDialogConfig, DynamicDialogRef, DialogService, MessageService } from 'primeng/api';

import swal from 'sweetalert2';
import { PracticaDistribucionRegistro } from '../../../../models/practica-distribucion-registro.model';

@Component({
  selector: 'app-popup-combinada-lectura',
  templateUrl: './popup-combinada-lectura.component.html',
  styleUrls: ['./popup-combinada-lectura.component.css'],
  providers: [MessageService,DialogService]
})
export class PopupCombinadaLecturaComponent implements OnInit {

  totalFacturado:number =  0;
  cols: any[];
  es:any;
  popItem:PracticaDistribucion;
  resultSave:boolean;
  // LOADING
  loading: boolean = false;
  selectedItem:PracticaDistribucionRegistro;
  item:PracticaDistribucionRegistro=null;
  elemento:PracticaDistribucion = null;
  elementos:PracticaDistribucion[] = [];
  elementoRegistro:PracticaDistribucionRegistro = null;
  _id:string; 
  totalcalculado:number = 0;

  constructor(private miServico:PracticaDistribucionService,public config: DynamicDialogConfig,private messageService: MessageService ,public ref: DynamicDialogRef,public dialogService: DialogService ) {

    this.cols = [
      { field: 'obra_social_nombre', header: 'Obra social' },
      { field: 'codigo', header: 'Codigo' },
      { field: 'obra_social_practica_nombre', header: 'Descripcion' },
      {field: 'practica_distribucion_valor', header: 'Valor' },
      {field: 'practica_distribucion_porcentaje', header: '%' },
      { field: 'practica_distribucion_total', header: 'Total' },      

   ];
  }

  ngOnInit() {
    console.log(this.config.data);
    this._id = this.config.data.convenio_os_pmo_id;
    this.loadList();
  }


  calcularTotal(){
    var i:number = 0;
    this.totalFacturado = 0;
    if(this.elementos){
      for (let entry of this.elementos) {
        console.log(entry["practica_distribucion_valor"]);
        this.totalcalculado = entry["practica_distribucion_total"];
      this.totalFacturado = this.totalFacturado + +entry["practica_distribucion_total"];
      }
  }
  }


 
 
  guardarRegistros(){
    this.ref.close(this.elementos);
  }

  loadList(){
    console.log(this._id);
    
    this.loading = true;
    try {
        this.miServico.getItems(this._id)     
        .subscribe(resp => {
        this.elementos = resp;                 
            this.loading = false;
            console.log(resp);
            this.calcularTotal();
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
 
eliminarRegistro(row){
  console.log(row);
          
          try { 
              this.miServico.delItem(row.id)
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
              this.miServico.postItem(this.item)
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


  throwAlert(estado:string, mensaje:string, motivo:string, errorNumero:string){
    let tipoerror:string;

    if(estado== "success"){
        swal({
            type: 'success',
            title: 'Exito',
            text: mensaje
          })
    }

  }
    


}
