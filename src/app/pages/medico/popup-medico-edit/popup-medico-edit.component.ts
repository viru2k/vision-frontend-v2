import { PopupObraSocialMedicoComponent } from './../popup-obra-social-medico/popup-obra-social-medico.component';
import { PopupObrasocialComponent } from './../../mantenimiento/popup/popup-obrasocial/popup-obrasocial.component';
import { DynamicDialogConfig, DialogService, MessageService, DynamicDialogRef } from 'primeng/api';
import { Component, OnInit } from '@angular/core';
import swal from 'sweetalert2';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { calendarioIdioma } from '../../../config/config';
import { ObraSocial } from 'src/app/models/obra-social.model';
import { FacturacionService } from './../../../services/facturacion.service';
import { AlertServiceService } from '../../../services/alert-service.service';

@Component({
  selector: 'app-popup-medico-edit',
  templateUrl: './popup-medico-edit.component.html',
  styleUrls: ['./popup-medico-edit.component.css'],
  providers: [MessageService,DialogService]
})
export class PopupMedicoEditComponent implements OnInit {
  popItem:ObraSocial;
  es:any;
  updateDataForm: FormGroup;
  checked: boolean = false;
  elementosComprobante:any[] = null;
  elementosDocumento:any[] = null;
  elementosPtoVta:any[] = null;  
  elementosCondicionIva:any[]= null;
  elementoDocumento:number= null;
  elementoPtoVta:number= null;  
  elementoCondicionIva:number= null;
  elementoComprobante:number= null;
  pto_vta:string = '0';

  constructor(private facturacionService: FacturacionService, public config: DynamicDialogConfig, private messageService: MessageService ,public dialogService: DialogService, public ref: DynamicDialogRef, private alertServiceService: AlertServiceService) { 
    this.es = calendarioIdioma;
  }

  ngOnInit() {
    console.log(this.config.data);
    this.updateDataForm = new FormGroup({
      'apellido': new FormControl(''),
      'nombre': new FormControl(''),      
      'domicilio': new FormControl('San Juan'),      
      'email_laboral': new FormControl('sin_correo@delavision.com.ar'),
      'email': new FormControl('sin_correo@delavision.com.ar'),
      'fecha_matricula': new FormControl(''),
      'cuit': new FormControl('0'),
      'telefono_cel': new FormControl('0'),
      'telefono': new FormControl('0'),
      'ing_brutos': new FormControl('0'),
      'usuario_id': new FormControl('0'),
      'id': new FormControl('0'),     
      'categoria_iva_id': new FormControl(),   
      'factura_documento_comprador_id': new FormControl(),   
      'punto_vta_id': new FormControl(),   
      'factura_comprobante_id': new FormControl(),   
      'fecha_alta_afip': new FormControl(''),   
      'factura_key': new FormControl(''),   
      'factura_crt': new FormControl(''),   
  });
    if(this.config.data.id !=''){
      let newDate = new Date( this.config.data.fecha_matricula);
      let newDateAltaAfip = new Date( this.config.data.fecha_alta_afip);
     this.config.data.fecha_matricula = newDate;
     this.config.data.fecha_alta_afip = newDateAltaAfip;
      this.updateDataForm.patchValue(this.config.data);
    }
    this.config.data.fecha_matricula = new Date();
    this.config.data.fecha_alta_afip = new Date();
    this.PtoVta();
    this.CategoriaIva();
    this.Documento();
    this.Comprobante();
  }

  
obtenerPuntoVta(event:any){
  this.pto_vta = this.padLeft(this.elementoPtoVta['punto_vta'], '0', 4); 
  console.log(this.pto_vta);  
  this.updateDataForm.patchValue({punto_vta_id: this.elementoPtoVta['id']});
}

obtenerCondicionIva(event:any){ 
  console.log(this.elementoCondicionIva);  
  this.updateDataForm.patchValue({categoria_iva_id: this.elementoCondicionIva['id']});
}

obtenerTipoDocumento(event:any){
 
  console.log(this.elementoDocumento);  
  this.updateDataForm.patchValue({factura_documento_comprador_id: this.elementoDocumento['id']});
}


obtenerComprobante(event:any){
 
  console.log(this.elementoComprobante);  
  this.updateDataForm.patchValue({factura_comprobante_id: this.elementoComprobante['id']});
}



padLeft(text:string, padChar:string, size:number): string {
  return (String(padChar).repeat(size) + text).substr( (size * -1), size) ;
}

CategoriaIva(){

  try {
    this.facturacionService.CategoriaIva()
    .subscribe(resp => {
        this.elementosCondicionIva = resp;
      console.log(resp);
        this.elementoCondicionIva =  this.elementosCondicionIva.find(x => x.id == this.config.data['categoria_iva_id']);    
        console.log(resp);
    },
    error => { // error path
        console.log(error.message);
        console.log(error.status);
        swal({
          toast: false,
          type: 'error',
          text: error.message,
          title: 'error.status',
          showConfirmButton: false,
          timer: 2000
        });
     });    
} catch (error) {

}  
}




Comprobante(){

  try {
    this.facturacionService.Comprobante()
    .subscribe(resp => {      
      let i = 0;
      let resultado = resp;
      resultado.forEach(element => {
        resp[i]['descripcion'] =  resp[i]['descripcion'] +' - '+ resp[i]['letra'];
        i++;
      });
        this.elementosComprobante = resp;
       
        console.log( this.elementosComprobante);
        this.elementoComprobante =  this.elementosComprobante.find(x => x.id == this.config.data['factura_comprobante_id']);
        this.updateDataForm.patchValue({factura_comprobante_id: this.elementoComprobante['id']});
    },
    error => { // error path
        console.log(error.message);
        console.log(error.status);
        swal({
          toast: false,
          type: 'error',
          text: error.message,
          title: 'error.status',
          showConfirmButton: false,
          timer: 2000
        });
     });    
} catch (error) {

}  
}


Documento(){

  try {
    this.facturacionService.Documento()
    .subscribe(resp => {      
        this.elementosDocumento = resp;

        console.log(  this.elementosDocumento);       
       this.elementoDocumento =  this.elementosDocumento.find(x => x.id == this.config.data['factura_documento_comprador_id']);
    },
    error => { // error path
        console.log(error.message);
        console.log(error.status);
        swal({
          toast: false,
          type: 'error',
          text: error.message,
          title: 'error.status',
          showConfirmButton: false,
          timer: 2000
        });
     });    
} catch (error) {

}  
}



PtoVta(){

  try {
    this.facturacionService.PtoVta()
    .subscribe(resp => {      
      let i:number = 0;
          let resultado = resp;
         
          resultado.forEach(element => {
            resp[i]['punto_vta'] =  this.padLeft(resp[i]['punto_vta'], '0', 4);
            i++;
          });
        this.elementosPtoVta = resp;
        this.elementoPtoVta =  this.elementosPtoVta.find(x => x.id == this.config.data['punto_vta_id']);
          
      
        console.log(this.elementosPtoVta);
        
    },
    error => { // error path
        console.log(error.message);
        console.log(error.status);
        swal({
          toast: false,
          type: 'error',
          text: error.message,
          title: 'error.status',
          showConfirmButton: false,
          timer: 2000
        });
     });    
} catch (error) {

}  
}

  buscarObraSocial(){
    this.popItem = new ObraSocial('','','','','','','','');
      let data:any; 
      const ref = this.dialogService.open(PopupObrasocialComponent, {
      data,
       header: 'Crear /Modificar registro', 
       width: '95%',
       height: '90%'
   });

   ref.onClose.subscribe((PopupObrasocialComponent:ObraSocial) => {
       if (PopupObrasocialComponent) {
       console.log(PopupObrasocialComponent);    
            this.popItem = PopupObrasocialComponent;
            this.config.data = this.updateDataForm.value;
            this.config.data.obra_social_nombre = this.popItem.nombre;
            this.config.data.obra_social_id = this.popItem.id;
            this.updateDataForm.patchValue(this.config.data);
       }
   });
  }

  agregarObraSocial(){
    this.popItem = new ObraSocial('','','','','','','','');
      let data:any; 
      data =this.config.data;
      const ref = this.dialogService.open(PopupObraSocialMedicoComponent, {
      data,
       header: 'Agregar obra social', 
       width: '95%',
       height: '90%'
   });

   ref.onClose.subscribe((PopupObraSocialMedicoComponent:ObraSocial) => {
       if (PopupObrasocialComponent) {
       console.log(PopupObrasocialComponent);    
          /*  this.popItem = PopupObrasocialComponent;
            this.config.data = this.updateDataForm.value;
            this.config.data.coseguro_nombre = this.popItem.nombre;
            this.config.data.coseguro_id = this.popItem.id;
            this.updateDataForm.patchValue(this.config.data);*/
       }
   });
  }

  guardarDatos(){
    this.config.data = this.updateDataForm.value;
    console.log(this.config.data);
    this.ref.close(this.updateDataForm.value);
  }

 
  }
