import { ObraSocial } from './../../../../../models/obra-social.model';

import { DialogService } from 'primeng/components/common/api';
import { FormControl, Validators, FormGroup } from '@angular/forms';
import { DynamicDialogConfig, DynamicDialogRef, MessageService } from 'primeng/api';
import { Component, OnInit } from '@angular/core';
import { PopupEntidadFacturaComponent } from '../../../popup/popup-entidad-factura/popup-entidad-factura.component';
import { EntidadFactura } from '../../../../../models/entidad-factura.model';

@Component({
  selector: 'app-edit-obra-social',
  templateUrl: './edit-obra-social.component.html',
  styleUrls: ['./edit-obra-social.component.css'],
  providers: [MessageService,DialogService]
})
export class EditObraSocialComponent implements OnInit {

  updateDataForm: FormGroup;
  popItem:ObraSocial = null;
  newItem:boolean;
  listaCategoriaIva:any[];
  constructor(public ref: DynamicDialogRef, public config: DynamicDialogConfig,private messageService: MessageService ,public dialogService: DialogService  ) {

    this.listaCategoriaIva = [
      {label:'IVA Responsable Inscripto', value:{id:1, name: 'IVA Responsable Inscripto', code: 'IVA Responsable Inscripto'}},
      {label:'IVA Responsable no Inscripto', value:{id:2, name: 'IVA Responsable no Inscripto', code: 'IVA Responsable no Inscripto'}},
      {label:'IVA no Responsable', value:{id:3, name: 'IVA no Responsable', code: 'IVA no Responsable'}},
      {label:'IVA Sujeto Exento', value:{id:4, name: 'IVA Sujeto Exento', code: 'IVA Sujeto Exento'}},
      {label:'Consumidor Final', value:{id:5, name: 'Consumidor Final', code: 'Consumidor Final'}},
      {label:'Responsable Monotributo', value:{id:6, name: 'Responsable Monotributo', code: 'Responsable Monotributo'}},
      {label:'Sujeto no Categorizado', value:{id:7, name: 'Sujeto no Categorizado', code: 'Sujeto no Categorizado'}},
      {label:'Proveedor del Exterior', value:{id:8, name: 'Proveedor del Exterior', code: 'Proveedor del Exterior'}},
      {label:'Cliente del Exterior', value:{id:9, name: 'Cliente del Exterior', code: 'Cliente del Exterior'}},
      {label:'IVA Liberado – Ley Nº 19.640', value:{id:10, name: 'IVA Liberado – Ley Nº 19.640', code: 'IVA Liberado – Ley Nº 19.640'}},
      {label:'IVA Responsable Inscripto – Agente de Percepción', value:{id:11, name: 'IVA Responsable Inscripto – Agente de Percepción', code: 'IVA Responsable Inscripto – Agente de Percepción'}},
      {label:'Pequeño Contribuyente Eventual', value:{id:12, name: 'Pequeño Contribuyente Eventual', code: 'Pequeño Contribuyente Eventual'}},
      {label:'Monotributista Social', value:{id:13, name: 'Monotributista Social', code: 'Monotributista Social'}},
      {label:'Pequeño Contribuyente Eventual Social', value:{id:14, name: 'Pequeño Contribuyente Eventual Social', code: 'Pequeño Contribuyente Eventual Social'}},


  ];
   }

  ngOnInit() {
 
    this.updateDataForm = new FormGroup({
      'nombre': new FormControl("", Validators.required),
      'es_habilitada': new FormControl("", Validators.required),
      'descripcion': new FormControl("", Validators.required),                        
      'entidad_nombre': new FormControl("", Validators.required), 
      'es_coseguro': new FormControl("N"), 
      'tiene_distribucion': new FormControl("N"), 
  });
  this.updateDataForm.reset();
  console.log(this.config.data);
    if(this.config.data !=null){
      this.popItem =this.config.data;
      this.updateDataForm.patchValue(this.popItem);
      this.newItem = false;
    }else{
      this.popItem = new ObraSocial("","","","","","","N","N");
      this.newItem = true;
    }
  }



  
  
  editarEntidad(){

    const ref = this.dialogService.open(PopupEntidadFacturaComponent, {
            data: {
                id: '51gF3'
            },
            header: 'Seleccionar entidad a facturar',
            width: '90%'
        });

        ref.onClose.subscribe((entidadFactura:EntidadFactura) => {
            if (entidadFactura) {
            console.log(entidadFactura);
            this.popItem.descripcion= this.updateDataForm.value.descripcion;            
            this.popItem.es_habilitada = this.updateDataForm.value.es_habilitada;  
            this.popItem.nombre = this.updateDataForm.value.nombre;  


            this.popItem.entidad_factura_id = entidadFactura.id;
            this.popItem.entidad_nombre = entidadFactura.nombre;
            
            this.updateDataForm.patchValue(this.popItem);
            }
        });
}
  
  actualizarDatos(){
    this.popItem.descripcion= this.updateDataForm.value.descripcion;    
    this.popItem.entidad_nombre = this.updateDataForm.value.entidad_nombre;  
    this.popItem.es_habilitada = this.updateDataForm.value.es_habilitada;  
    this.popItem.nombre = this.updateDataForm.value.nombre;  
    console.log(this.popItem);
    this.ref.close(this.popItem);
  }
}
