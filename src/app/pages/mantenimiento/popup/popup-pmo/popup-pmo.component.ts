import { DynamicDialogRef, DynamicDialogConfig } from 'primeng/api';

import { Component, OnInit, PipeTransform, EventEmitter, Output } from '@angular/core';
import { PmoService } from './../../../../services/pmo.service';
import { Pmo } from './../../../../models/pmo.model';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import swal from 'sweetalert2';

@Component({
  selector: 'app-popup-pmo',
  templateUrl: './popup-pmo.component.html',
  styleUrls: ['./popup-pmo.component.css']
})
export class PopupPmoComponent implements OnInit {

  
  cols: any[];
  selectedItem: Pmo;
  displayDialog: boolean;
  popItem:Pmo;
  newPopItem: boolean;
  es:any;
  // LOADING
  loading: boolean;
  updateDataForm: FormGroup;
  elemento:Pmo = null;
  elementos:Pmo[] = null;
  _id:number = 0;
  columns: any[];
  @Output() messageEvent = new EventEmitter<Pmo>();

    constructor(private miServico:PmoService, public ref: DynamicDialogRef, public config: DynamicDialogConfig ) {
  
          this.cols = [
          { field: 'codigo', header: 'Codigo' },
          { field: 'descripcion', header: 'Descripción' },
          { field: 'complejidad', header: 'Complejidad' },
           ];

          
          }
  
ngOnInit() {

    this.loadList();
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
           //     console.log(this.elementos);    
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
     
    this.selectedItem = event.data;
    console.log(this.selectedItem);
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
    
    