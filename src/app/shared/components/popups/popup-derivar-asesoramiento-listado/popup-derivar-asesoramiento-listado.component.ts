import { Component, OnInit } from '@angular/core';
import { CirugiaFicha } from '../../../../models/cirugia-ficha.model';
import { OverlayPanel } from 'primeng/overlaypanel';
import { MessageService } from 'primeng/api';
import { DialogService } from 'primeng/components/common/api';

import swal from 'sweetalert2';

declare const require: any;
const jsPDF = require('jspdf');
require('jspdf-autotable');
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { calendarioIdioma } from './../../../../config/config';
import { CirugiaService } from './../../../../services/cirugia.service';
import { PopupLentesComponent } from '../../../../shared/components/popups/popup-lentes/popup-lentes.component';
import { CirugiaLente } from 'src/app/models/cirugia-lente.model';
import { PopupFichaQuirurgicaLenteComponent } from '../../../../shared/components/popups/popup-ficha-quirurgica-lente/popup-ficha-quirurgica-lente.component';
import { PopupFichaQuirurgicaEstadoComponent } from '../../../../shared/components/popups/popup-ficha-quirurgica-estado/popup-ficha-quirurgica-estado.component';
import { PopupFichaQuirurgicaMedicoGrupoComponent } from '../../../../shared/components/popups/popup-ficha-quirurgica-medico-grupo/popup-ficha-quirurgica-medico-grupo.component';

import { AsesoramientoListadoPaciente } from '../../../../models/asesoramiento-listado-pacientes.model';
import { PopupFichaQuirurgicaAnesteciaComponent } from '../../../../shared/components/popups/popup-ficha-quirurgica-anestecia/popup-ficha-quirurgica-anestecia.component';
import { CirugiaFichaAnestesia } from '../../../../models/cirugia-ficha-anestecia.model';
import { CirugiaFichaMedico } from './../../../../models/cirugia-ficha-medico.model';
import { PopupHistoriaClinicaListaConsultaComponent } from '../../../../shared/components/popups/popup-historia-clinica-lista-consulta/popup-historia-clinica-lista-consulta.component';
import { MedicoService } from '../../../../services/medico.service';
import { HistoriaClinica } from '../../../../models/historia-clinica.model';
import { formatDate } from '@angular/common';


@Component({
  selector: 'app-popup-derivar-asesoramiento-listado',
  templateUrl: './popup-derivar-asesoramiento-listado.component.html',
  styleUrls: ['./popup-derivar-asesoramiento-listado.component.css']
})
export class PopupDerivarAsesoramientoListadoComponent implements OnInit {

  
  elementosHistoriaClinica:HistoriaClinica[];
  FormFicha:FormGroup;
  DateForm:FormGroup;
  loading: boolean;
  selecteditem:any;;
  es:any;
  elemento:CirugiaFicha = null;
  elementos:CirugiaFicha[] = null;
  elementosFiltrados:CirugiaFicha[] = null;
  selecteditems:CirugiaFicha[] = [];
  selecteditemRegistro:CirugiaFicha= null;
  popItem:CirugiaFicha;
  popItemLente:CirugiaLente;
  columns: any[];
  cols: any[];
  fechaHoy:Date;
  _fechaHoy:string;
  formPaciente:FormGroup;

  constructor(private miServicio:CirugiaService,private medicoService:MedicoService,private messageService: MessageService ,public dialogService: DialogService) {

    this.cols = [

      { field: 'paciente_apellido', header: 'Apellido',  width: '12%' },
      {field: 'paciente_nombre', header: 'Nombre' , width: '12%' },
      { field: 'paciente_dni', header: 'DNI',  width: '8%' },            
      { field: 'cirugia_practica', header: 'Cirugia' , width: '20%'},
      { field: 'fecha_derivacion', header: 'Derivado' , width: '8%'},
      { field: 'ojo', header: 'Ojo' , width: '6%'},
      { field: 'estado', header: 'Estado' , width: '8%'},
      { field: 'usuario_atendio', header: 'Atendio' , width: '15%'} ,
      { field: 'fecha_atencion', header: 'F. atencion' , width: '8%'} ,
      { field: '', header: '' , width: '8%'} ,
   ];


   this.columns = [
    {title: 'Apellido', dataKey: 'paciente_apellido'},
    {title: 'Nombre', dataKey: 'paciente_nombre'}, 
    {title: 'DNI', dataKey: 'paciente_dni'}, 
    {title: 'F. nacimiento', dataKey: 'paciente_fecha_nacimiento'}, 
    {title: 'Obra social', dataKey: 'obra_social_nombre'},
    {title: 'Cirugia', dataKey: 'cirugia_practica'}, 
    {title: 'Derivado', dataKey: 'fecha_derivacion'}, 
    {title: 'Ojo', dataKey: 'ojo'}, 
    {title: 'Estado', dataKey: 'estado'}, 
    {title: 'Medico', dataKey: 'medico_deriva'}, 
];
  


this.formPaciente = new FormGroup({
    
  'edad': new FormControl('', Validators.required),
  'numero_afiliado': new FormControl('', Validators.required),
  'plan': new FormControl('', Validators.required),
  'dni': new FormControl('', Validators.required),  
  'domicilio': new FormControl('', Validators.required),  
  'paciente_id': new FormControl('', Validators.required),
  'paciente_nombre': new FormControl('', Validators.required),
  'paciente_apellido': new FormControl('', Validators.required),
  'obra_social_nombre': new FormControl('', Validators.required),
  'NUMERO': new FormControl('', Validators.required),
  'PACIENTE': new FormControl('', Validators.required),
  'FECHA': new FormControl('', Validators.required),
  'MC': new FormControl('', Validators.required),
  'AEA': new FormControl('', Validators.required),
  'APP': new FormControl('', Validators.required),
  'AF': new FormControl('', Validators.required),
  'BIO': new FormControl('', Validators.required),
  'COMENTARIO': new FormControl('', Validators.required),
  'FO': new FormControl('', Validators.required),
  'CVC': new FormControl('', Validators.required),
  'OBSERVACIO': new FormControl('', Validators.required),
  'SINTOMAS': new FormControl('', Validators.required),
  'TRATAMIENT': new FormControl('', Validators.required),
  'medico_nombre': new FormControl('', Validators.required),
  'medico_id': new FormControl('0', Validators.required),
  'nombreyapellido': new FormControl('', Validators.required),    
  'usuario_id': new FormControl('', Validators.required),
  'DIAGNOSTIC': new FormControl('', Validators.required),
  'REFRACCION_OD': new FormControl('', Validators.required),
  'REFRACCION_OI': new FormControl('', Validators.required),
  'CICLOPEGIA_OD': new FormControl('', Validators.required),
  'CICLOPEGIA_OI': new FormControl('', Validators.required),
  'PIO_OD': new FormControl('', Validators.required),
  'PIO_OI': new FormControl('', Validators.required),
  'BIO_OD': new FormControl('', Validators.required),
  'BIO_OI': new FormControl('', Validators.required),
  'SINTOMAS_SIGNOS': new FormControl('', Validators.required),
  'FONDO_OD': new FormControl('', Validators.required),
  'FONDO_OI': new FormControl('', Validators.required),
  'DIAGNOSTICO_OD': new FormControl('', Validators.required),
  'DIAGNOSTICO_OI': new FormControl('', Validators.required),
  'TRATAMIENTO_MEDICO': new FormControl('', Validators.required),
  'TRATAMIENTO_QUIRURGICO': new FormControl('', Validators.required),
  'obra_social_id': new FormControl('', Validators.required),    
  'barra_afiliado': new FormControl('', Validators.required),
  'historia_clinica': new FormControl([], Validators.required),
  'estudio_id': new FormControl('', Validators.required),
  'estudio_nombre': new FormControl('', Validators.required),
  
  });

  this.DateForm = new FormGroup({
    'fecha_hoy': new FormControl('', Validators.required), 
    
    });
   }

  ngOnInit() {
    this.es = calendarioIdioma;
    this.fechaHoy = new Date();

    this.DateForm = new FormGroup({
      'fechaHoy': new FormControl("", Validators.required), 
      'medico_nombre': new FormControl("")
      });

      this.FormFicha = new FormGroup({
        'id': new FormControl(""), 
        'paciente_id': new FormControl(""),
        'medico_deriva_id': new FormControl(""),
        'fecha_derivacion': new FormControl(""),
        'cirugia_medico_grupo_id': new FormControl(""),
        'estudios_id': new FormControl(""),
        'fecha_cirugia': new FormControl(""),
        'operacion_cobro_id': new FormControl(""),
        'ojo': new FormControl(""),
        'observacion': new FormControl(""),
        'obra_social_id': new FormControl(""),
        'cirugia_practica': new FormControl(""),
        'cirugia_lente_id': new FormControl(""),
        'cirugia_ficha_anestesia_id': new FormControl(""),
        'historia_clinica_id': new FormControl(""),
        'protocolo_quirurgico_id': new FormControl(""),
        'estado_cirugia_id': new FormControl(""),
        'fecha_internacion': new FormControl(""),
        'fecha_inicio_acto_quirurgico': new FormControl(""),
        'fecha_fin_acto_quirurgico': new FormControl(""),
        'fecha_alta': new FormControl(""),
        'es_atendido': new FormControl(""),
        
        });

    this.DateForm.patchValue({fechaHoy: this.fechaHoy});
    this.loadList();
  }

  filtered(event){
    console.log(event.filteredValue);
    this.elementosFiltrados  = event.filteredValue;
}

actualizarFecha(event){
  console.log(event);
  this.fechaHoy = event;    
  console.log(new Date(this.fechaHoy));
}


editRow(row){
  console.log(row.data);
  this.popItem = row.data;
      /* if( this.actualizarDatos()){
      this.showToast('exito',"Registro modificado","Exito al modificar");
  }*/
}

  accion(event: any,overlaypanel: OverlayPanel,elementos: CirugiaFicha) {
    if(elementos){
      this.selecteditem = elementos;
    }

      console.log(this.selecteditemRegistro);
      overlaypanel.toggle(event);
    }




  loadList() {
    this._fechaHoy = formatDate(this.fechaHoy, 'yyyy-MM-dd', 'en');  
 this.loading = true;
    try {
        this.miServicio.getFichaDerivados(this._fechaHoy)
        .subscribe(resp => {

            this.elementos = resp;
            console.log(resp);
            this.loading = false;
        },
        error => { // error path
            console.log(error);
            console.log(error.status);
            this.throwAlert('error','Error: '+error.status+'  Error al cargar los registros',error.message, error.status);
            this.loading = false;
         });
    } catch (error) {
    this.throwAlert('error','Error al cargar los registros',error,error.status);
    }
}

atendido(event){
  console.log(event);
  let userData = JSON.parse(localStorage.getItem('userData'));
  event.usuario_atendio_id = userData['id'];
  this._fechaHoy = formatDate(this.fechaHoy, 'yyyy-MM-dd', 'en');  
 this.loading = true;
    try {
        this.miServicio.updFichaDerivados(event, event.id)
        .subscribe(resp => {

            this.elementos = resp;
            console.log(resp);
            this.loading = false;
            this.loadList();
        },
        error => { // error path
            console.log(error);
            console.log(error.status);
            this.throwAlert('error','Error: '+error.status+'  Error al cargar los registros',error.message, error.status);
            this.loading = false;
         });
    } catch (error) {
    this.throwAlert('error','Error al cargar los registros',error,error.status);
    }
}


verLente(selecteditems:any){
  console.log(this.selecteditem);
  let data:any; 
  data = this.selecteditem;
  const ref = this.dialogService.open(PopupFichaQuirurgicaLenteComponent, {
  data,
   header: 'Gestionar lente', 
   width: '90%',
   height: '90%'
  });

  ref.onClose.subscribe((PopupFichaQuirurgicaLenteComponent:CirugiaLente) => {
      if (PopupFichaQuirurgicaLenteComponent) {
        console.log(PopupFichaQuirurgicaLenteComponent);
        this.popItemLente = PopupFichaQuirurgicaLenteComponent;
        
        this.FormFicha.patchValue({id: this.popItemLente.id});
        this.FormFicha.patchValue({nombre: this.popItemLente.tipo_lente_id});
       
      }
  });
}
 

verHistoriaClinica(selecteditems){
 this.loading = true;
 console.log(this.selecteditem);
  try { 
    this.medicoService.getHistoriaClinicaByPaciente(this.selecteditem.paciente_dni)
    .subscribe(resp => {
    this.elementosHistoriaClinica = resp;
    console.log(resp);      

    this.formPaciente.patchValue({historia_clinica: resp})
    console.log(this.formPaciente);
    this.loading = false;
   
    console.log(resp);
    let data:any; 
    data = resp;
    const ref = this.dialogService.open(PopupHistoriaClinicaListaConsultaComponent, {
    data,
     header: 'Historia clínica', 
     width: '98%',
     height: '90%'
    });
  
    ref.onClose.subscribe((PopupHistoriaClinicaListaConsultaComponent:HistoriaClinica) => {

          console.log(PopupHistoriaClinicaListaConsultaComponent);

    });

    },
    error => { // error path
        console.log(error.message);
        console.log(error.status);
        this.throwAlert('error','error','Error: '+error.status+'  Error al cargar los registros',error.message);
   //     this.resultSave = false;
        this.loading = false;
      });    
} catch (error) {
  this.throwAlert('error','error','Error: '+error.status+'  Error al cargar los registros',error.message);
}
  
}



loadhistoriaClinica(){ 
  this.loading = true; 
 


}

verAnestesia(selecteditems){

  console.log(this.selecteditem);
  let data:any; 
  data = this.selecteditem['cirugia_ficha_anestesia_id'];
  const ref = this.dialogService.open(PopupFichaQuirurgicaAnesteciaComponent, {
  data,
   header: 'Ficha de anestecia de paciente', 
   width: '90%',
   height: '90%'
  });

  ref.onClose.subscribe((PopupFichaQuirurgicaAnesteciaComponent:CirugiaFichaAnestesia) => {
      if (PopupFichaQuirurgicaAnesteciaComponent) {
        console.log(PopupFichaQuirurgicaAnesteciaComponent);
       
       
      }
  });
}

verMedico(selecteditems){
  console.log(selecteditems);
  let data:any = this.selecteditem; 
  const ref = this.dialogService.open(PopupFichaQuirurgicaMedicoGrupoComponent, {
  data,
   header: 'Gestionar médicos', 
   width: '50%',
   height: '70%'
  });

  ref.onClose.subscribe((PopupFichaQuirurgicaMedicoGrupoComponent:CirugiaFichaMedico) => {
    this.loadList();
     
  });
}




imprimirListado(){}
verTodasLasCirugias(){}
verListadoCirugiaAtencion(selecteditems){
  console.log(selecteditems);
  let data:any = this.selecteditem; 
  const ref = this.dialogService.open(PopupDerivarAsesoramientoListadoComponent, {
  data,
   header: 'Listado atencion pacientes', 
   width: '80%',
   height: '80%'
  });

  ref.onClose.subscribe((PopupDerivarAsesoramientoListadoComponent:CirugiaFicha) => {
   // this.loadList();
     
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
