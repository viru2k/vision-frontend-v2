import { Pmo } from './../../../../models/pmo.model';
import { DialogService } from 'primeng/components/common/api';
import { PopupPmoComponent } from './../../popup/popup-pmo/popup-pmo.component';
import { ObraSocial } from './../../../../models/obra-social.model';
import { PopupObrasocialComponent } from './../../popup/popup-obrasocial/popup-obrasocial.component';
import { FormControl, Validators, FormGroup } from '@angular/forms';
import { DynamicDialogConfig, DynamicDialogRef, MessageService } from 'primeng/api';
import { Component, OnInit } from '@angular/core';
import {Convenio} from   '../../../../models/convenio.model';

@Component({
  selector: 'app-edit-convenio',
  templateUrl: './edit-convenio.component.html',
  styleUrls: ['./edit-convenio.component.css'],
  providers: [MessageService,DialogService]
})
export class EditConvenioComponent implements OnInit {

  updateDataForm: FormGroup;
  popItem:Convenio = null;
  newItem:boolean;
  constructor(public ref: DynamicDialogRef, public config: DynamicDialogConfig,private messageService: MessageService ,public dialogService: DialogService  ) { }

  ngOnInit() {
 
    this.updateDataForm = new FormGroup({
      'obra_social_nombre': new FormControl("", Validators.required),
      'codigo': new FormControl("", Validators.required),
      'pmo_descripcion': new FormControl("", Validators.required),
      'complejidad': new FormControl("", Validators.required),                
      'valor': new FormControl("", Validators.required),
      'es_habilitado': new FormControl("", Validators.required),
  });
  this.updateDataForm.reset();
  console.log(this.config.data);
    if(this.config.data !=null){
      this.popItem =this.config.data;
      this.updateDataForm.patchValue(this.popItem);
      this.newItem = false;
    }else{
      this.popItem = new Convenio("",0,"","","","",0,"","","","","","","","");
      this.newItem = true;
    }
  }


  
  editarObraSocial(){

    const ref = this.dialogService.open(PopupObrasocialComponent, {
            data: {
                id: '51gF3'
            },
            header: 'Seleccionar obra social',
            width: '100%'
        });

        ref.onClose.subscribe((obraSocial:ObraSocial) => {
            if (obraSocial) {
            console.log(obraSocial);
            this.popItem.obra_social_nombre = obraSocial.nombre;
            this.popItem.obra_social_id = obraSocial.id;
            this.updateDataForm.patchValue(this.popItem);
            }
        });
}

editarPmo(){
    const ref = this.dialogService.open(PopupPmoComponent, {
        data: {
            id: '51gF3'
        },
        header: 'Seleccionar Pmo',
        width: '100%'
    });

    ref.onClose.subscribe((pmo:Pmo) => {
        if (pmo) {
        console.log(pmo);
        this.popItem.codigo = pmo.codigo;
    this.popItem.complejidad = String(pmo.complejidad);
    this.popItem.pmo_descripcion = pmo.descripcion;
    this.popItem.pmo_id = pmo.id;
    
    this.updateDataForm.patchValue(this.popItem);
        }
    });
}

  actualizarDatos(){    
    this.popItem.valor = this.updateDataForm.value.valor;  
    this.popItem.es_habilitado = this.updateDataForm.value.es_habilitado;  
    console.log(this.popItem);
    this.ref.close(this.popItem);
  }
}
