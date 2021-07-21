import { Component, OnInit } from '@angular/core';
import { CirugiaFicha } from '../../../../models/cirugia-ficha.model';
import { OverlayPanel } from 'primeng/overlaypanel';

import swal from 'sweetalert2';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { DynamicDialogConfig, DialogService, MessageService, DynamicDialogRef } from 'primeng/api';
import { CirugiaService } from '../../../../services/cirugia.service';
import { PopupMedicoComponent } from '../popup-medico/popup-medico.component';
import { MedicoObraSocial } from '../../../../models/medico-obrasocial.model';
import { CirugiaFichaMedico } from '../../../../models/cirugia-ficha-medico.model';
import { CirugiaFichaAnestesia } from '../../../../models/cirugia-ficha-anestecia.model';

@Component({
  selector: 'app-popup-ficha-quirurgica-medico-grupo',
  templateUrl: './popup-ficha-quirurgica-medico-grupo.component.html',
  styleUrls: ['./popup-ficha-quirurgica-medico-grupo.component.css'],
  providers: [MessageService,DialogService]
})
export class PopupFichaQuirurgicaMedicoGrupoComponent implements OnInit {
  loading:boolean;
  es:any;
  FormFicha:FormGroup;
  elemento:any;
  elementos:any[];
  cirugiaFichaMedico:CirugiaFichaMedico;
  tiene_datos:boolean = false;

  constructor(public config: DynamicDialogConfig, private miServicio:CirugiaService,private messageService: MessageService ,public dialogService: DialogService,public ref: DynamicDialogRef) { }

  ngOnInit() {
    this.FormFicha = new FormGroup({
      'cirugia_grupo_medico_id': new FormControl(''), 
      'cirugia_ficha_id': new FormControl(''), 
      'medico_opera_id': new FormControl(''), 
      'medico_deriva_id': new FormControl(''), 
      'medico_ayuda_id': new FormControl(''), 
      'medico_factura_id': new FormControl(''), 
      'medico_anestesista_id': new FormControl(''), 
      'medico_opera_nombre': new FormControl(''), 
      'medico_deriva_nombre': new FormControl(''), 
      'medico_ayuda_nombre': new FormControl(''), 
      'medico_factura_nombre': new FormControl(''), 
      'medico_anestesista_nombre': new FormControl(''), 
    });
    console.log(this.config.data.cirugia_medico_grupo_id !== 0);
    if(this.config.data.cirugia_medico_grupo_id !== 0){
      this.elemento = this.config.data;
      console.log(this.elemento);
      this.FormFicha.patchValue({cirugia_grupo_medico_id: this.config.data['cirugia_grupo_medico_id']});
      this.FormFicha.patchValue({cirugia_ficha_id: this.config.data.id});
      this.tiene_datos = true;
      console.log(this.FormFicha.value);
      this.loadList();
    }else{
      console.log('sin datos');      
      this.FormFicha.patchValue({cirugia_ficha_id: this.config.data.id});
      console.log(this.FormFicha.value);
    }
    
    this.cirugiaFichaMedico = new CirugiaFichaMedico('', '', '', '', '', '', '', '', '', '', '' );
   
  }


  
  loadList(){      
        try {
          this.miServicio.getFichaMedicoGrupo(this.elemento['cirugia_medico_grupo_id'])
           .subscribe(resp => {
             console.log(resp);
            let result:any = resp;
               this.loading = false;
            let medicos:CirugiaFichaAnestesia = result[0];
               console.log(medicos);
               
              this.FormFicha.patchValue(medicos);
              this.FormFicha.patchValue({cirugia_ficha_id: this.elemento['id']});
              console.log(this.FormFicha.value);
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
  
  guardarDatos(){      
    
  if(this.tiene_datos){

    if((this.FormFicha.value.medico_opera_id !== 0)&&(this.FormFicha.value.medico_deriva_id !== 0)&&(this.FormFicha.value.medico_ayuda_id !== 0)&&(this.FormFicha.value.medico_factura_id !== 0)&&(this.FormFicha.value.medico_anestesista_id !== 0)){
      console.log(this.FormFicha.value);
      try {
        this.miServicio.putFichaMedicoGrupo(this.FormFicha.value,this.FormFicha.value.cirugia_grupo_medico_id)
         .subscribe(resp => {
           console.log(resp);

             this.loading = false;
             console.log(resp);
             this.throwAlert('success', 'Se modificó el registro con éxito','','');
             this.ref.close();
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

  }else{
  if((this.FormFicha.value.medico_opera_id !== 0)&&(this.FormFicha.value.medico_deriva_id !== 0)&&(this.FormFicha.value.medico_ayuda_id !== 0)&&(this.FormFicha.value.medico_factura_id !== 0)&&(this.FormFicha.value.medico_anestesista_id !== 0)){
      console.log(this.FormFicha.value);
      try {
        this.miServicio.postLenteFichaMedicoGrupo(this.FormFicha.value)
         .subscribe(resp => {
           console.log(resp);
          
             this.loading = false;
             console.log(resp);
            
             this.throwAlert('success', 'Se creó el registro con éxito','','');
             this.ref.close();
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
  
}
}
 


  buscarOpera(){

  let data:any; 
  const ref = this.dialogService.open(PopupMedicoComponent, {
  data,
   header: 'Buscar médico opera', 
   width: '98%',
   height: '90%'
  });

  ref.onClose.subscribe((PopupMedicoComponent:MedicoObraSocial) => {
      if (PopupMedicoComponent) {
        console.log(PopupMedicoComponent);  
        this.FormFicha.patchValue({medico_opera_nombre: PopupMedicoComponent.apellido +' '+ PopupMedicoComponent.nombre});
        this.FormFicha.patchValue({medico_opera_id: PopupMedicoComponent.usuario_id});        
       console.log(this.FormFicha.value) ;
      }
  });
  }

  
  buscarAyuda(){
    let data:any; 
    const ref = this.dialogService.open(PopupMedicoComponent, {
    data,
     header: 'Buscar médico ayudante', 
     width: '98%',
     height: '90%'
    });
  
    ref.onClose.subscribe((PopupMedicoComponent:MedicoObraSocial) => {
        if (PopupMedicoComponent) {
          console.log(PopupMedicoComponent);  
          this.FormFicha.patchValue({medico_ayuda_nombre: PopupMedicoComponent.apellido +' '+ PopupMedicoComponent.nombre});
          this.FormFicha.patchValue({medico_ayuda_id: PopupMedicoComponent.usuario_id});
          
         console.log(this.FormFicha.value) ;
        }
    });
  }


  buscarFactura(){
    let data:any; 
    const ref = this.dialogService.open(PopupMedicoComponent, {
    data,
     header: 'Buscar médico factura', 
     width: '98%',
     height: '90%'
    });
  
    ref.onClose.subscribe((PopupMedicoComponent:MedicoObraSocial) => {
        if (PopupMedicoComponent) {
          console.log(PopupMedicoComponent);  
          this.FormFicha.patchValue({medico_factura_nombre: PopupMedicoComponent.apellido +' '+ PopupMedicoComponent.nombre});
          this.FormFicha.patchValue({medico_factura_id: PopupMedicoComponent.usuario_id});
          
         console.log(this.FormFicha.value) ;
        }
    });
  }

  
  buscarDeriva(){
    let data:any; 
    const ref = this.dialogService.open(PopupMedicoComponent, {
    data,
     header: 'Buscar anestesista', 
     width: '98%',
     height: '90%'
    });
  
    ref.onClose.subscribe((PopupMedicoComponent:MedicoObraSocial) => {
        if (PopupMedicoComponent) {
          console.log(PopupMedicoComponent);  
          this.FormFicha.patchValue({medico_deriva_nombre: PopupMedicoComponent.apellido +' '+ PopupMedicoComponent.nombre});
          this.FormFicha.patchValue({medico_deriva_id: PopupMedicoComponent.usuario_id});         
        }
    });
  }
  
  buscarAnestesista(){
    let data:any; 
    const ref = this.dialogService.open(PopupMedicoComponent, {
    data,
     header: 'Buscar anestesista', 
     width: '98%',
     height: '90%'
    });
  
    ref.onClose.subscribe((PopupMedicoComponent:MedicoObraSocial) => {
        if (PopupMedicoComponent) {
          console.log(PopupMedicoComponent);  
          this.FormFicha.patchValue({medico_anestesista_nombre: PopupMedicoComponent.apellido +' '+ PopupMedicoComponent.nombre});
          this.FormFicha.patchValue({medico_anestesista_id: PopupMedicoComponent.usuario_id});        
         console.log(this.FormFicha.value) ;
        }
    });
  }


  throwAlert(estado: string, mensaje: string, motivo: string, errorNumero: string){
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
  


