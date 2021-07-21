import { Component, OnInit } from '@angular/core';
import { Medico } from '../../../../../models/medico.model';
import { ObraSocial } from '../../../../../models/obra-social.model';
import swal from 'sweetalert2';
import { DialogService } from 'primeng/components/common/api';
import { MessageService, DynamicDialogRef } from 'primeng/api';
import { ObraSocialService } from '../../../../../services/obra-social.service';
import { MedicoObraSocialService } from '../../../../../services/medico-obra-social.service';
import { MedicoService } from '../../../../../services/medico.service';
import { MedicoObraSocial } from '../../../../../models/medico-obrasocial.model';

@Component({
  selector: 'app-popup-turno-usuario-obra-social',
  templateUrl: './popup-turno-usuario-obra-social.component.html',
  styleUrls: ['./popup-turno-usuario-obra-social.component.css']
})
export class PopupTurnoUsuarioObraSocialComponent implements OnInit {

  loading:boolean;
  cols:any;
  colsObraSocial:any;
  medico:Medico[];
  obrasocial:ObraSocial[];
  medicoObraSocial:MedicoObraSocial[];
  selectedItemObraSocial:ObraSocial;
  selectedItemMedico:MedicoObraSocial;
  radioselected: string = 'obrasocial';
  constructor(private medicoObraSocialServicio:MedicoObraSocialService,
    public ref: DynamicDialogRef,
    private obraSocialServicio:ObraSocialService ,
    private medicoServicio:MedicoService ,private messageService: MessageService ,public dialogService: DialogService ) {

   /*  this.colsMedico = [
      {field: 'nombre', header: 'Apellido' },
      {field: 'apellido', header: 'Nombre' },
    ]; */
    this.cols = [
      {field: 'apellido', header: 'Apellido',   width: '20%'  },
      { field: 'nombre', header: 'Nombre' ,  width: '20%' },
   ];

     this.colsObraSocial = [
    {field: 'dia_nombre', header: 'Dia' },
    ];
  }

  ngOnInit() {

    this.loadListObraSocial();
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

loadListMedico(){

  this.loading = true;

  try {
      this.medicoServicio.getItems()
      .subscribe(resp => {
      this.medico = resp;
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

/*
FindByListMedico(){

  this.loading = true;
  try {
      this.medicoObraSocialServicio.getItemsByMedico()
      .subscribe(resp => {
      this.medicoObraSocial = resp;
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
 */

FindByListObraSocial(){

  this.loading = true;
  this.medicoObraSocial = null;
  try {
      this.medicoObraSocialServicio.getItemByObraSocial(this.selectedItemObraSocial.id)
      .subscribe(resp => {
        if(resp.length){
          this.medicoObraSocial = resp;
        }

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



onRowObraSocial(){
  if(this.radioselected=="obrasocial"){
    this.FindByListObraSocial();
  }else{
    this.loadListMedico()
  }
}

onRowMedico(event){
  this.selectedItemMedico = event.data;
  console.log( this.selectedItemMedico );

}

buscarPor(){
  if(this.radioselected=="obrasocial"){
    this.loadListObraSocial();
  }else{
    this.loadListMedico()
  }
}


guardar(){
  this.ref.close(this.selectedItemMedico);
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


