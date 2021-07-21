import { Component, OnInit } from '@angular/core';
import { CirugiaService } from '../../../../services/cirugia.service';
import swal from 'sweetalert2';
import { DialogService } from 'primeng/components/common/api';
import { DynamicDialogRef, MessageService, DynamicDialogConfig } from 'primeng/api';
import { HistoriaClinica } from '../../../../models/historia-clinica.model';
import { DomSanitizer, SafeResourceUrl, SafeUrl } from '@angular/platform-browser';
import { URL_ARCHIVO } from './../../../../config/config';
@Component({
  selector: 'app-popup-estudios-imagen',
  templateUrl: './popup-estudios-imagen.component.html',
  styleUrls: ['./popup-estudios-imagen.component.css']
})
export class PopupEstudiosImagenComponent implements OnInit {
  pdfSrc:string = '';
  images: any[] = [];
  elementos:HistoriaClinica[];
  estudio_id:string;
  Url : SafeUrl;
  constructor(private sanitizer: DomSanitizer, private cirugiaService:CirugiaService,public config: DynamicDialogConfig,private messageService: MessageService ,public ref: DynamicDialogRef,public dialogService: DialogService ) { }

  ngOnInit() {
    //this.images = [];
    console.log(this.config.data);  
    this.estudio_id = this.config.data;
    this.cargarImagenes();
  }

  cargarImagenes(){

    try { 
     
      this.cirugiaService.getEstudioImagen(this.estudio_id)
      .subscribe(resp => {
     // this.elementos = resp;
      console.log(resp);
      let resultado = resp;
      let temp_images:any[] = [];
      resultado.forEach(element => {            
       // element['usuario_audita_id']= 1; // DEBE SER MODIFICADO PARA QUE AUDITE EL USUARIO
       if(element['file']==='application/pdf'){
        this.pdfSrc = 'application/pdf';
          /* this.Url = this.sanitizer.bypassSecurityTrustResourceUrl(URL_ARCHIVO+element['url']+'/'+element['nombre']);
           this.pdfSrc = this.Url['changingThisBreaksApplicationSecurity'];
           console.log(this.Url['changingThisBreaksApplicationSecurity']);*/
           const fileURL = URL_ARCHIVO+element['url']+'/'+element['nombre'];
  window.open(fileURL, '_blank');
          this.images = [];
       } 
       if(element['file']==='image/jpeg'){
       temp_images.push({source: URL_ARCHIVO+element['url']+'/'+element['nombre'], alt: element['estudio'], title:element['nombre']});
       this.images = temp_images;
       }

    });                 
      },
      error => { // error path
          console.log(error.message);
          console.log(error.status);
          this.throwAlert('error','error','Error: '+error.status+'  Error al cargar los registros',error.message);
     //     this.resultSave = false;
       //   this.loading = false;
        });    
  } catch (error) {
    this.throwAlert('error','error','Error: '+error.status+'  Error al cargar los registros',error.message);
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
  
  
