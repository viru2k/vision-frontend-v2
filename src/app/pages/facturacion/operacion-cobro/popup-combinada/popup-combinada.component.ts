
import { PracticaDistribucionService } from './../../../../services/PracticaDistribucionService';
import { PopupCombinadaItemComponent } from './popup-combinada-item/popup-combinada-item.component';


import { Component, OnInit} from '@angular/core';
import { calendarioIdioma } from '../../../../config/config';

import { PracticaDistribucion } from '../../../../models/practica-distribucion.model';
import { DynamicDialogConfig, DynamicDialogRef, DialogService, MessageService } from 'primeng/api';

import swal from 'sweetalert2';
import { PracticaDistribucionRegistro } from '../../../../models/practica-distribucion-registro.model';

@Component({
  selector: 'app-popup-combinada',
  templateUrl: './popup-combinada.component.html',
  styleUrls: ['./popup-combinada.component.css'],
  providers: [MessageService,DialogService]
})
export class PopupCombinadaComponent implements OnInit {

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

  constructor(private miServico:PracticaDistribucionService, public ref: DynamicDialogRef,private messageService: MessageService ,public dialogService: DialogService, public config: DynamicDialogConfig) { 

    this.cols = [
      { field: 'obra_social_nombre', header: 'Obra social',  width: '20%' },
      { field: 'codigo', header: 'Codigo',  width: '10%' },
      { field: 'obra_social_practica_nombre', header: 'Descripcion',  width: '30%' },
      {field: 'practica_distribucion_valor', header: 'Valor' ,  width: '8%'},
      {field: 'practica_distribucion_porcentaje', header: '%',  width: '8%' },
      { field: 'practica_distribucion_total', header: 'Total' ,  width: '8%'},      
      { field: 'accion', header: 'Acción' ,  width: '10%'},      
   ];
  }

  ngOnInit() {
   // console.log(this.config.data.id);
    this._id = this.config.data.id;
    this.loadList();
  }

  agregarRegistro(){
    let data:any; 
    const ref = this.dialogService.open(PopupCombinadaItemComponent, {
    data,
     header: 'Buscar practica a combinar', 
     width: '98%',
     height: '90%'
    });
    ref.onClose.subscribe((PopupCombinadaItemComponent:PracticaDistribucionRegistro) => {
      if (PopupCombinadaItemComponent) {
        this.elementoRegistro = PopupCombinadaItemComponent;
        console.log(this.elementoRegistro);
        this.item = new PracticaDistribucionRegistro("0",this._id,this.elementoRegistro.practica_distribucion_id,this.elementoRegistro.porcentaje , this.elementoRegistro.valor, this.elementoRegistro.total,
        this.elementoRegistro.codigo, this.elementoRegistro.complejidad, this.elementoRegistro.es_habilitada, this.elementoRegistro.obra_social_id, this.elementoRegistro.obra_social_nombre, this.elementoRegistro.pmo_descripcion, this.elementoRegistro.pmo_id);
       // this.popItem.convenio_os_pmo_id = this.item.convenio_os_pmo_id;
        
     //   this.elementos.push(this.elementoRegistro);
        this.calcularTotal();
       this.nuevoItem();
      }
  });
     
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
          if (resp[0]) {
            this.elementos = resp;  
            console.log(this.elementos);
              }else{
                this.elementos =null;
              }
                      
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
