import { MedicoObraSocial } from './../../../models/medico-obrasocial.model';
import { DynamicDialogConfig, DialogService, DynamicDialogRef, MessageService } from 'primeng/api';
import { Component, OnInit } from '@angular/core';
import { MedicoObraSocialService } from 'src/app/services/medico-obra-social.service';
import { ObraSocialService } from 'src/app/services/obra-social.service';
import { ObraSocial } from 'src/app/models/obra-social.model';
import swal from 'sweetalert2';

@Component({
  selector: 'app-popup-obra-social-medico',
  templateUrl: './popup-obra-social-medico.component.html',
  styleUrls: ['./popup-obra-social-medico.component.css'],
  providers: [MessageService,DialogService]
})
export class PopupObraSocialMedicoComponent implements OnInit {

  resultSave:boolean;
  loading:boolean;
  colsObraSocial:any;
  obrasocial:ObraSocial[];
  medicosobrasocial:MedicoObraSocial[];
  medicoobrasocial:MedicoObraSocial;
  nuevomedicoobrasocial:MedicoObraSocial;
  selectedItemObraSocial:ObraSocial;
  selectedItemMedicoObraSocial:MedicoObraSocial[];
  medico_id:string;
  constructor( private obraSocialServicio:ObraSocialService,private messageService: MessageService,private medicoObraSocialService:MedicoObraSocialService,public config: DynamicDialogConfig,public dialogService: DialogService, public ref: DynamicDialogRef) { 
    console.log(this.config.data.id);
 
    this.medico_id = this.config.data.id ;
  //console.log(this.config.data);
 
    this.colsObraSocial = [
      {field: 'dia_nombre', header: 'Dia' },
      ];
  }

  ngOnInit() {
    this.loadListObraSocial();
    this.loadListObraSocialBymedico();    
  }

  
  loadListObraSocial(){
  
    this.loading = true;
    try {
        this.obraSocialServicio.getItems()    
        .subscribe(resp => {
        this.obrasocial = resp;                 
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


  
  loadListObraSocialBymedico(){
  
    this.loading = true;
    try {
        this.medicoObraSocialService.getItemsByMedico(this.medico_id)    
        .subscribe(resp => {
        this.medicosobrasocial = resp;                            
            this.loading = false;
            console.log(this.medicosobrasocial);
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


  onRowObraSocial(){
  
  }

  onRowMedicoObraSocial(event){
    
   this.medicoobrasocial = event.value;
   console.log(this.medicoobrasocial);
  }
 
  guardar(){
    var i = 0;
   
        console.log(this.selectedItemObraSocial);
        this.nuevomedicoobrasocial = new MedicoObraSocial("","",this.selectedItemObraSocial.id,this.medico_id,this.config.data.apellido,this.config.data.usuario_id,new Date(),this.selectedItemObraSocial.es_habilitada,this.selectedItemObraSocial.nombre,this.config.data.codigo_old);
        this.nuevoItem();
    

  }

  borrar(){
    
    try { 
      this.medicoObraSocialService.delItem(this.medicoobrasocial)
      .subscribe(resp => {
      //this.elemento = resp;
      console.log(resp);    
      this.showToast("warning","Registro eliminado","Se elimino el registro");                
      this.loadListObraSocialBymedico();
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

  nuevoItem(){ 
       
    try { 
        this.medicoObraSocialService.postItem(this.nuevomedicoobrasocial)
        .subscribe(resp => {
        //this.elemento = resp;
        console.log(resp);    
        this.showToast('exito',"Registro modificado","Exito al modificar");                
        this.loadListObraSocialBymedico();
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


  showToast(estado:string ,mensaje:string, encabezado:string){

    if(estado =="exito"){
        this.messageService.add({severity:'success', summary: mensaje, detail:encabezado});
    }
    if(estado =="info"){
      this.messageService.add({severity:'info', summary: mensaje, detail:encabezado});        
    }
    if(estado =="warning"){
      this.messageService.add({severity:'warning', summary: mensaje, detail:encabezado});        
    }
    if(estado =="error"){
      this.messageService.add({severity:'error', summary: mensaje, detail:encabezado});      
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
  
  
  
    if(estado== "warning"){
      swal({
          type: 'warning',
          title: 'Cuidado!',
          text: mensaje
        })
  }
    if(estado== "error"){
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
  
  
  
