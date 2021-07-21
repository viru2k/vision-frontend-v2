import { Component, OnInit, PipeTransform, EventEmitter, Output, OnDestroy } from '@angular/core';

import { EntidadFactura } from './../../../../models/entidad-factura.model';
import { EntidadService } from './../../../../services/entidad.service';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import swal from 'sweetalert2';
import { DynamicDialogRef, DynamicDialogConfig } from 'primeng/api';

@Component({
  selector: 'app-popup-entidad-factura',
  templateUrl: './popup-entidad-factura.component.html',
  styleUrls: ['./popup-entidad-factura.component.css']
})
export class PopupEntidadFacturaComponent implements OnInit, OnDestroy {

 
  cols: any[];
  selectedItem: EntidadFactura;
  displayDialog: boolean;
  popItem:EntidadFactura;
  newPopItem: boolean;
  es:any;
  // LOADING
  loading: boolean;
  updateDataForm: FormGroup;
  elemento:EntidadFactura = null;
  elementos:EntidadFactura[] = null;
  _id:number = 0;
  columns: any[];
  @Output() messageEvent = new EventEmitter<EntidadFactura>();
    constructor(private miServico:EntidadService, public ref: DynamicDialogRef, public config: DynamicDialogConfig ) {
  
          this.cols = [
          { field: 'nombre', header: 'Entidad a facturar' },
           ];

          
          }
  
ngOnInit() {
this.displayDialog = false;
  this.loadList();
  }
  
  ngOnDestroy(){
      this.displayDialog = false;
  }
  
  /** CARGA LA LISTA **/
  
  public saludo() {
    //this.mensaje = value;
    console.log("hola");
  }
  
  loadList(){
      
      this.loading = true;
      try {
          this.miServico.getItems()    
          .subscribe(resp => {
          this.elementos = resp;
              console.log(this.elementos);    
              this.loading = false;
          },
          error => { // error path
              console.log(error.message);
              console.log(error.status);
              this.throwAlert("error","Error: "+error.status+"  Error al cargar los registros",error.message);
           });    
      } catch (error) {
      this.throwAlert("error","Error al cargar los registros",error);
      }  
  }
  
  
  onRowSelect(event) {
      console.log(event.data);
      this.messageEvent.emit(event.data);
      this.ref.close(this.selectedItem);
  }
  
  
  /** ACCIONES */
  
  
  throwAlert(estado:string, mensaje:string, motivo:string){
      if(estado== "success"){
          swal({
              type: 'success',
              title: 'Exito',
              text: mensaje
            })
      }
      if(estado== "error"){
          swal({
              type: 'error',
              title: 'Oops...',
              text: mensaje,
              footer: motivo
            })
      }
  }
  }
  
  