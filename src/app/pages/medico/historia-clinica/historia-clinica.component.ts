import { Component, OnInit, ɵConsole } from '@angular/core';
import { Router } from '@angular/router';
import { DialogService } from 'primeng/components/common/api';
import { MessageService } from 'primeng/api';
import { DatePipe, formatDate } from '@angular/common';

declare const require: any;
const jsPDF = require('jspdf');
require('jspdf-autotable');
import { FormControl, Validators, FormGroup, Form } from '@angular/forms';


import swal from 'sweetalert2';
import { MedicoService } from '../../../services/medico.service';
import { HistoriaClinica } from '../../../models/historia-clinica.model';
import { Paciente } from '../../../models/paciente.model';
import { Agenda } from '../../../models/agenda.model';
import { PopupPacienteObrasocialComponent } from '../../../shared/components/popups/popup-paciente-obrasocial/popup-paciente-obrasocial.component';
import { AgendaTurno } from '../../../models/agenda-turno.model';
import { OverlayPanel } from 'primeng/overlaypanel';
import { PopupHistoriaClinicaRegistroComponent } from '../../../shared/components/popups/popup-historia-clinica-registro/popup-historia-clinica-registro.component';
import { PopupHistoriaClinicaRegistroNuevoComponent } from '../../../shared/components/popups/popup-historia-clinica-registro-nuevo/popup-historia-clinica-registro-nuevo.component';
import { PopupHistoriaClinicaListaConsultaComponent } from '../../../shared/components/popups/popup-historia-clinica-lista-consulta/popup-historia-clinica-lista-consulta.component';
import { PopupMedicoComponent } from '../../../shared/components/popups/popup-medico/popup-medico.component';
import { Medico } from '../../../models/medico.model';
import { MedicoObraSocial } from '../../../models/medico-obrasocial.model';
import { PopupDerivarAsesoramientoComponent } from '../../../shared/components/popups/popup-derivar-asesoramiento/popup-derivar-asesoramiento.component';

import { PopupEstudiosImagenComponent } from '../../../shared/components/popups/popup-estudios-imagen/popup-estudios-imagen.component';
@Component({
  selector: 'app-historia-clinica',
  templateUrl: './historia-clinica.component.html',
  styleUrls: ['./historia-clinica.component.css'],
  providers: [MessageService,DialogService,DatePipe]
})
export class HistoriaClinicaComponent implements OnInit {
  
  fechaHoy:Date;
  _fechaHoy:string;
  cols:any;
  popItem:HistoriaClinica;
  newPopItem: boolean;
  resultSave:boolean;
  es:any;
  displayDialog: boolean;
  // LOADING
  loading: boolean;
  val1: number;
  popItemHistoriaClinica:HistoriaClinica;
  elemento:HistoriaClinica;
  elementos:HistoriaClinica[];
  paciente:AgendaTurno = null;
  selecteditems:HistoriaClinica[] = [];
  selectedItem: HistoriaClinica;
  elementosFiltrados:HistoriaClinica[] = null;
  edad:number;
  popItemPaciente:Paciente;
  formPaciente:FormGroup;
  existe:boolean;
  condicion:string;
  selectedHistoriaClinica:HistoriaClinica;
  popItemAgenda:AgendaTurno;
  display:boolean;
  historia_clinica_resumen:string = '';
  diagnostico_receta:string = '';
  listarecetas:any[];
  listaindicacionesmedicas:any[];
  selectedReceta:string[] = [];
  selectedIndicaciones:string;
  historia_clinicadiagnostico:string = '';

  constructor(private miServicio:MedicoService,private router: Router,private messageService: MessageService ,public dialogService: DialogService ) {
    if(this.router.getCurrentNavigation().extras.state != undefined){
      console.log(this.router.getCurrentNavigation().extras.state.paciente);
      // si es llamado desde la agenda del paciente busco los datos
      this.paciente = this.router.getCurrentNavigation().extras.state.paciente;
      console.log(this.paciente);
      //this.formPaciente.patchValue(this.popItemPaciente); 
      
    }
    
    this.listarecetas = [
      {label:'TEXTO', value:{id:1, name: 'TEXTO', code: 'TEXTO'}},
      {label:'TEXTO CON DIAGNOSTICO', value:{id:1, name: 'TEXTO CON DIAGNOSTICO', code: 'TEXTO CON DIAGNOSTICO'}},
      {label:'RECETA', value:{id:1, name: 'RECETA', code: 'RECETA'}},
      {label:'RG', value:{id:2, name: 'RG', code: 'RG'}},
      {label:'RFG', value:{id:3, name: 'RFG', code: 'RFG'}},
      {label:'CVC', value:{id:4, name: 'CVC', code: 'CVC'}},
      {label:'PAQUIMETRIA CORNEAL', value:{id:5, name: 'PAQUIMETRIA CORNEAL', code: 'PAQUIMETRIA CORNEAL'}},
      {label:'TOPOGRAFIA CORNEAL', value:{id:6, name: 'TOPOGRAFIA CORNEAL', code: 'TOPOGRAFIA CORNEAL'}},
      {label:'RECUENTO ENDOTELIAL', value:{id:7, name: 'RECUENTO ENDOTELIAL', code: 'RECUENTO ENDOTELIAL'}},
      {label:'OCT DE MACULA', value:{id:8, name: 'OCT DE MACULA', code: 'OCT DE MACULA'}},
      {label:'OCT DE PAPILA', value:{id:9, name: 'OCT DE PAPILA', code: 'OCT DE PAPILA'}},
      {label:'VERION', value:{id:10, name: 'VERION', code: 'VERION'}},
      {label:'YAG LASER', value:{id:10, name: 'VERION', code: 'YAG LASER'}},
      {label:'LASER ARGON', value:{id:10, name: 'VERION', code: 'LASER ARGON'}},

  ];

  this.listaindicacionesmedicas = [
    {name: 'SIN RECETAS', code: 'SIN RECETAS'},
    {name: 'SE NECESITAN RECETAS ', code: 'SE NECESITAN RECETAS'},
  ];
    
    this.cols = [
      
      { field: 'accion', header: 'Accion' , width: '4%'} ,
      { field: 'FECHA', header: 'Fecha',  width: '10%' },
      { field: 'MEDICONOM', header: 'Médico',  width: '15%' },
      {field: 'MC', header: 'Motivo' , width: '25%' },
      { field: 'OBSERVACIO', header: 'TRATAMIENTO' , width: '25%'},      
      { field: 'SINTOMAS', header: 'Sintomas' , width: '30%'}   
      
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
    'ESTUDIOSES': new FormControl('', Validators.required),
    'MEDICONOM': new FormControl('', Validators.required),
    
    });


 
  }



  ngOnInit() {
    
    if(this.paciente != null){
      console.log(this.paciente);
      if(this.paciente.plan === '0'){
        this.formPaciente.patchValue({plan: ''});   
      }
      this.formPaciente.patchValue({paciente_nombre: this.paciente.paciente_apellido + ' '+this.paciente.paciente_nombre});   
      this.formPaciente.patchValue({paciente_id:this.paciente.id});
      this.formPaciente.patchValue({numero_afiliado:this.paciente.numero_afiliado});
      this.formPaciente.patchValue({plan:this.paciente.plan});
      this.formPaciente.patchValue({domicilio:this.paciente.domicilio});
      this.formPaciente.patchValue({obra_social_nombre:this.paciente.paciente_obra_social_nombre});
      this.formPaciente.patchValue({dni:this.paciente.paciente_dni});
      this.formPaciente.patchValue({barra_afiliado:this.paciente.barra_afiliado});
      this.formPaciente.patchValue({numero_afiliado:this.paciente.numero_afiliado});
      this.formPaciente.patchValue({paciente_obra_social_id:this.paciente.paciente_obra_social_id});
      
      this.edad =(new Date()).getFullYear() - (new Date(this.paciente.paciente_fecha_nacimiento)).getFullYear();
      this.formPaciente.patchValue({edad: this.edad});
      console.log(this.formPaciente);
    this.loadhistoriaClinica();
    }else{ //10029750
      this.paciente = new AgendaTurno('',new Date(), new Date(), new Date(),'','','','','','','','','','','','','','','888888','' ,'','','','','','','','','', new Date(),'','','','','', '','','','','','','','','');
    //  this.historiaClinica();
    }
  }

  derivar(){}


  verReceta(){
    this.historia_clinica_resumen = '';
    console.log(this.selectedReceta["label"]);
    if(this.selectedReceta["label"] === 'TEXTO'){}else{
      
    }
   // this.receta = 'Solicito: '+this.selectedReceta["name"];
    this.display = true;
  }
buscarPaciente(){

  let data:any; 
  const ref = this.dialogService.open(PopupPacienteObrasocialComponent, {
  data,
   header: 'Buscar paciente', 
   width: '98%',
   height: '90%'
  });

  ref.onClose.subscribe((PopupPacienteObrasocialComponent: Paciente) => {
      if (PopupPacienteObrasocialComponent) {
        console.log(PopupPacienteObrasocialComponent);
       this.popItemPaciente = PopupPacienteObrasocialComponent;
       console.log( this.popItemPaciente);
       this.formPaciente.patchValue(this.popItemPaciente); 
       this.formPaciente.patchValue({paciente_nombre: this.popItemPaciente.apellido + ' '+this.popItemPaciente.nombre});   
       this.formPaciente.patchValue({paciente_id:this.popItemPaciente.id});
       this.formPaciente.patchValue({PACIENTE:this.popItemPaciente.dni});
       this.formPaciente.patchValue({obra_social:this.popItemPaciente.obra_social_nombre});
       this.edad =(new Date()).getFullYear() - (new Date(this.popItemPaciente.fecha_nacimiento)).getFullYear();
       this.formPaciente.patchValue({edad: this.edad});
       this.formPaciente.patchValue({numero_afiliado:PopupPacienteObrasocialComponent.numero_afiliado});
       this.formPaciente.patchValue({plan:PopupPacienteObrasocialComponent.plan});
       this.formPaciente.patchValue({dni:PopupPacienteObrasocialComponent.dni});
       this.paciente = this.formPaciente.value;
       this.paciente.paciente_dni=   this.formPaciente.value.PACIENTE;
       console.log( this.paciente);
       console.log( this.formPaciente);
      
      this.loadhistoriaClinica();
      }
  });

}
 

verRegistro(){

  let data:any; 
  data = this.popItemHistoriaClinica;
  const ref = this.dialogService.open(PopupHistoriaClinicaRegistroComponent, {
  data,
   header: 'Registro', 
   width: '98%',
   height: '90%'
  });

  ref.onClose.subscribe((PopupHistoriaClinicaRegistroComponent: Paciente) => {
      if (PopupPacienteObrasocialComponent) {
        console.log(PopupPacienteObrasocialComponent);
    
      }
  });

}

verEstudios(estudio_id:string){

  let data:any; 
  data =  estudio_id;
  const ref = this.dialogService.open(PopupEstudiosImagenComponent, {
  data,
   header: 'Estudios', 
   width: '98%',
   height: '90%'
  });

  ref.onClose.subscribe((PopupEstudiosImagenComponent: Paciente) => {
      if (PopupEstudiosImagenComponent) {
        console.log(PopupEstudiosImagenComponent);
    
      }
  });

}


agregarHistoria(){
  if(this.paciente){
  let userData = JSON.parse(localStorage.getItem('userData'));
  
  //userData["id"], userData["nombreyapellido"]
  this.elemento = new HistoriaClinica('','',userData["id"],userData["nombreyapellido"], '','','','','','','','','','','','','','','','','','','','','','','','','',
  '','','','','','','','','','','','','','','','','','','','','','','','','','','','','','','','','','', userData["id"], userData["nombreyapellido"],'',this.paciente.paciente_dni,this.formPaciente.value.plan, this.formPaciente.value.numero_afiliado, this.formPaciente.value.edad, this.formPaciente.value.obra_social_nombre,'', this.formPaciente.value.paciente_nombre,'',this.formPaciente.value.dni, ''
  , '', '', '', '', '', '', '', '', '', '', '', '',this.paciente.domicilio,this.paciente.paciente_obra_social_id,this.paciente.barra_afiliado, this.formPaciente.value.historia_clinica,'','','');
  let data:any;   
  data = this.elemento; 
  console.log(this.formPaciente.value.historia_clinica);
  const ref = this.dialogService.open(PopupHistoriaClinicaRegistroNuevoComponent, {
  data,
   header: 'Agregar historia clínica', 
   width: '100%', 
   height: '98%'
  });

  ref.onClose.subscribe((PopupHistoriaClinicaRegistroNuevoComponent: HistoriaClinica) => {
    
      if (PopupHistoriaClinicaRegistroNuevoComponent) {
        this.loadhistoriaClinica();
      }
  });
}else{
  this.throwAlert('warning','Error: No hay paciente seleccionado',  'Practica sin numero de bono','404');
}
}





verHistoriaClinicaListado(){

  let data:any;    
  data = this.elementos;
  const ref = this.dialogService.open(PopupHistoriaClinicaListaConsultaComponent, {
  data,
   header: 'Ver de historia clínica', 
   width: '100%',
   height: '100%'
  });
  ref.onClose.subscribe((PopupHistoriaClinicaListaConsultaComponent: HistoriaClinica) => {
      if (PopupPacienteObrasocialComponent) {
        console.log(PopupPacienteObrasocialComponent);
     
      }
  });

}



guardarHistoria(){
  
  /* console.log(this.dataForm.value);
  this.dataForm.patchValue({PACIENTE: this.elemento_temp.PACIENTE});
  this.dataForm.patchValue({medico_id: this.elemento_temp.medico_id});
  this.dataForm.patchValue({paciente_id: this.elemento_temp.paciente_id});
  this.dataForm.patchValue({MEDICONOM: this.elemento_temp.MEDICONOM});
  this.dataForm.patchValue({MEDICO: this.elemento_temp.MEDICO});
  this.dataForm.patchValue({nombreyapellido: this.elemento_temp.nombreyapellido});
  this.dataForm.patchValue({numero_afiliado: this.elemento.numero_afiliado});
  this.dataForm.patchValue({domicilio: this.elemento.domicilio});
  this.dataForm.patchValue({edad: this.elemento.edad});
  this.dataForm.patchValue({obra_social_nombre: this.elemento.obra_social_nombre});
  this.dataForm.patchValue({paciente_nombre: this.elemento.paciente_nombre});
  this.dataForm.patchValue({plan: this.elemento.plan}); */
  if(this.formPaciente.value){
    
    let userData = JSON.parse(localStorage.getItem('userData'));
    console.log(userData["nombreyapellido"]);
    let _medico = userData["nombreyapellido"];
    this.formPaciente.patchValue({MEDICONOM: _medico});
    this.formPaciente.patchValue({medico_id: userData['id']});
    this.formPaciente.patchValue({nombreyapellido: userData['nombreyapellido']});
    this.formPaciente.patchValue({medico_nombre: userData['nombreyapellido']});
    console.log(this.diagnostico_receta);
  this.formPaciente.patchValue({TRATAMIENTO_MEDICO: this.historia_clinicadiagnostico});
     try {
        this.miServicio.setHistoriaClinicaFicha(this.formPaciente.value)
        .subscribe(resp => {
          swal({
            toast: false,
            type: 'success',
            title: 'Guardado',
            text: 'Se guardo la receta en  historia clínica',
            showConfirmButton: true,            
          });       
            console.log(resp);
            this.historia_clinica_resumen = '';
            this.diagnostico_receta = '';
            this.selectedReceta = [];
            this.historia_clinicadiagnostico = '';
            this.loadhistoriaClinica();
        },
        error => { // error path
            console.log(error.message);
            console.log(error.status);
            swal({
              toast: false,
              type: 'warning',
              title: error.status,
              text: error.message,
              showConfirmButton: false,
              timer: 2000
            });
         });    
    } catch (error) {
    
    }  
}
}


derivarAsesoramiento(){
  
  let userData = JSON.parse(localStorage.getItem('userData'));
  let agenda = new AgendaTurno('',new Date(),new Date(),new Date(), '','','','','','','',userData["id"], userData["nombreyapellido"], '','', this.paciente.paciente_id, this.paciente.paciente_nombre, this.paciente.paciente_apellido, this.paciente.paciente_dni, this.paciente.paciente_fecha_nacimiento, this.paciente.paciente_obra_social_id, this.paciente.paciente_obra_social_nombre,'','','','','','','',new Date(),'','','', '' ,'', '','','','','','','','','');
  let data:any;    
  data = agenda;
  const ref = this.dialogService.open(PopupDerivarAsesoramientoComponent, {
  data,
   header: 'Derivar a asesoramiento', 
   width: '60%',
   height: '50%'
  });
  ref.onClose.subscribe((PopupDerivarAsesoramientoComponent: HistoriaClinica) => {
      if (PopupPacienteObrasocialComponent) {
        console.log(PopupPacienteObrasocialComponent);
     
      }
  });

}


  
loadhistoriaClinica(){ 
  this.loading = true; 
  try { 
      this.miServicio.getHistoriaClinicaByPaciente(this.paciente.paciente_dni)
      .subscribe(resp => {
      this.elementos = resp;
      console.log(resp);      
      
      this.formPaciente.patchValue({historia_clinica: resp})
      console.log(this.formPaciente);
      this.loading = false;
      //this.loadList();
      //this.resultSave = true;
      },
      error => { // error path
          console.log(error.message);
          console.log(error.status);
          swal({
            toast: false,
            type: 'warning',
            title: error.status,
            text: error.message,
            showConfirmButton: false,
            timer: 2000
          });
     //     this.resultSave = false;
          this.loading = false;
        });    
  } catch (error) {
    
  }


}





darTurno(){
  let userData = JSON.parse(localStorage.getItem('userData'));

this.popItemAgenda = new AgendaTurno('',new Date(),new Date(),new Date(), '','','','','','','',userData["id"], userData["nombreyapellido"], '','', this.paciente.paciente_id, this.paciente.paciente_nombre, this.paciente.paciente_apellido, this.paciente.paciente_dni, this.paciente.paciente_fecha_nacimiento, this.paciente.paciente_obra_social_id, this.paciente.paciente_obra_social_nombre,'','','','','','','',new Date(),'',this.paciente.plan,this.paciente.domicilio,'','', '','','','','','','','','');
console.log(this.popItemAgenda);
  this.router.navigate(['/medico/turnos'],{ state: { paciente: this.popItemAgenda } });
}
accion(evt:any,overlaypanel:OverlayPanel,event:HistoriaClinica){    
  if(event){
   this.selectedHistoriaClinica = event;
  }
  console.log(event);

  overlaypanel.toggle(evt);
}



imprimirRenglon(elemento){

  let _fechaEmision = formatDate(new Date(), 'dd/MM/yyyy', 'en');
  var  doc = new jsPDF();
  
  const pageSize = doc.internal.pageSize;
  const pageWidth = pageSize.width ? pageSize.width : pageSize.getWidth();
let x:number = 0;
let y:number = 20;
  doc.setFontSize(8);
  

  doc.text('Nombre: '+this.formPaciente.value.paciente_nombre+'      DNI: '+this.formPaciente.value.dni, 10 +x, 5+y);  
  doc.text('Domicilio: '+this.formPaciente.value.domicilio, 10 +x, 10+y);  
  doc.text('Obra social: '+this.formPaciente.value.obra_social_nombre, 10+x, 15+y);
  
  if( this.formPaciente.value.paciente_obra_social_id == '1'){
    console.log(this.formPaciente.value.paciente_obra_social_id);
    
    if(this.formPaciente.value.plan=== '0'){
      doc.text('Numero: '+this.formPaciente.value.numero_afiliado+'/'+this.formPaciente.value.barra_afiliado, 10+x, 20+y);
    }else{
      doc.text('Numero: '+this.formPaciente.value.numero_afiliado+'/'+this.formPaciente.value.barra_afiliado+'      Plan: '+this.formPaciente.value.plan, 10+x, 20+y);
    }
  }else{    
    if(this.formPaciente.value.plan=== '0'){
      doc.text('Numero: '+this.formPaciente.value.numero_afiliado, 10+x, 20+y);
    }else{
      doc.text('Numero: '+this.formPaciente.value.numero_afiliado+'      Plan: '+this.formPaciente.value.plan, 10+x, 20+y);
    }
  }

  doc.line(10+x, 25+y, pageWidth-10, 25+y);
  let yHistoria:number = 35;
  console.log(elemento);
  if(elemento.FECHA){
    let _fechaEmision = formatDate(elemento.FECHA, 'dd/MM/yyyy', 'en');
    doc.text('FECHA: '+_fechaEmision, 10+x, yHistoria+y);
    yHistoria = yHistoria +5;
  }

  if(elemento.MEDICONOM){
    doc.text('Médico : '+elemento.MEDICONOM, 10+x, yHistoria+y);
    yHistoria = yHistoria +5;
  }

  if(elemento.MC){
    doc.text('MC : '+elemento.MC, 10+x, yHistoria+y);
    yHistoria = yHistoria +5;
  }

  if(elemento.AEA){
    doc.text('AEA : '+elemento.AEA, 10+x, yHistoria+y);
    yHistoria = yHistoria +5;
  }

  if(elemento.APP){
    doc.text('APP : '+elemento.APP, 10+x, yHistoria+y);
    yHistoria = yHistoria +5;
  }

  if(elemento.AF){
    doc.text('AF : '+elemento.AF, 10+x, yHistoria+y);
    yHistoria = yHistoria +5;
  }

  if(elemento.SINTOMAS){
    doc.text('Síntomas : '+elemento.SINTOMAS, 10+x, yHistoria+y);
    yHistoria = yHistoria +5;
  }

  if(elemento.FO){
    doc.text('Fondo  de ojo : '+elemento.FO, 10+x, yHistoria+y);
    yHistoria = yHistoria +5;
  }

  if(elemento.TRATAMIENT){
    doc.text('Tratamiento : '+elemento.TRATAMIENT, 10+x, yHistoria+y);
    yHistoria = yHistoria +5;
  }

  if(elemento.DIAGNOSTIC){
    doc.text('Diagnostico : '+elemento.DIAGNOSTIC, 10+x, yHistoria+y);
    yHistoria = yHistoria +5;
  }

  if(elemento.BIO){
    doc.text('Biomicroscopia : '+elemento.BIO, 10+x, yHistoria+y);
    yHistoria = yHistoria +5;
  }

  
  if(elemento.COMENTARIO){
    doc.text('Comentario : '+elemento.COMENTARIO, 10+x, 35+y);
  }

  
  if(elemento.OBS_LENTES){
    doc.text('Observación de lentes : '+elemento.OBS_LENTES, 10+x, 35+y);
  }

  
  if(elemento.OBSERVACIO){
    doc.text('Observación : '+elemento.OBSERVACIO, 10+x, 35+y);
  }
  console.log(elemento);
 

  let esY:number= 0;
 
  //doc.save('my.pdf');
 // doc.autoPrint();
 window.open(doc.output('bloburl'));

}







imprimirRecetaEscrita(){
 
  let _fechaEmision = formatDate(new Date(), 'dd/MM/yyyy', 'en');
  var  doc = new jsPDF();
  
  const pageSize = doc.internal.pageSize;
  const pageWidth = pageSize.width ? pageSize.width : pageSize.getWidth();
let x:number = 20;
let y:number = 40;
let haytexto:boolean= false;
let haytextoDiagnostico:boolean= false;

  doc.setFontSize(8);
  
          /****
           * 
           * *ENCABEZADO 
           * 
           * */
  doc.text('Nombre: '+this.formPaciente.value.paciente_nombre+'      DNI: '+this.formPaciente.value.dni, 10 +x, 5+y);  
  doc.text('Domicilio: '+this.formPaciente.value.domicilio, 10 +x, 10+y);  
  doc.text('Obra social: '+this.formPaciente.value.obra_social_nombre, 10+x, 15+y);
  
  if( this.formPaciente.value.paciente_obra_social_id == '1'){
    console.log(this.formPaciente.value.paciente_obra_social_id);
    
    if(this.formPaciente.value.plan=== '0'){
      doc.text('Numero: '+this.formPaciente.value.numero_afiliado+'/'+this.formPaciente.value.barra_afiliado, 10+x, 20+y);
    }else{
      doc.text('Numero: '+this.formPaciente.value.numero_afiliado+'/'+this.formPaciente.value.barra_afiliado+'      Plan: '+this.formPaciente.value.plan, 10+x, 20+y);
    }
  }else{    
    if(this.formPaciente.value.plan=== '0'){
      doc.text('Numero: '+this.formPaciente.value.numero_afiliado, 10+x, 20+y);
    }else{
      doc.text('Numero: '+this.formPaciente.value.numero_afiliado+'      Plan: '+this.formPaciente.value.plan, 10+x, 20+y);
    }
  }

  /*****
   * 
   *  FIN ENCABEZADO 
   * 
   * */


  let esY:number= 0;
 
  if(this.selectedReceta){
    this.display = false;
    swal({
      toast: false,
      type: 'warning',
      title: 'No se puede imprimir',
      text: 'Debe seleccionar una acción ',
      showConfirmButton: true
    })
    .then((result) => {
      this.display = true;
      });  
  }
  if((this.selectedReceta[0]["name"] === 'TEXTO') || (this.selectedReceta[0]["name"] === 'TEXTO CON DIAGNOSTICO')){
  
  }else{
    
   
   
    for(let j= 0;j< this.selectedReceta.length;j++){
      if(this.selectedReceta[j]["name"] ==='TEXTO'){        
        haytexto = true;
       
    }
    }

    if(!haytexto){
      // SI ESTA MARCADO TEXTO CON DIAGNOSTICO AGREGO DIAGNOSTICO
      if(this.selectedReceta[0]['name'] !== 'TEXTO CON DIAGNOSTICO'){      
      doc.text('Solicito: ', 10 +x, 35+y);  
      }
    for(let j= 0;j< this.selectedReceta.length;j++){
      doc.text(' - '+this.selectedReceta[j]["name"] , 15 +x, 45+esY+y);   
      this.historia_clinicadiagnostico =  this.historia_clinicadiagnostico+ ' - '+this.selectedReceta[j]["name"];
      esY = esY+5;
    }
  }
    console.log(this.selectedReceta);
  }

  //doc.text('Solicita: '+medico, 10+x, 115+y);   
  doc.text('Firma ', 70+x, 130+y);   
  doc.text( _fechaEmision, 10+x, 130+y);  
  var pageHeight = doc.internal.pageSize.height;
  if(haytexto){
    if(this.diagnostico_receta != ''){
    var splitTitle_texto = doc.splitTextToSize(this.diagnostico_receta, +60);
       // VARIABLE PARA GUARDAR EN HC
       this.historia_clinicadiagnostico = this.historia_clinicadiagnostico+'  '+ splitTitle_texto;
  for (var i = 0; i < splitTitle_texto.length; i++) 
  {
    doc.text(10+x, 45+esY+y, splitTitle_texto[i]);
    y = y + 5;
  }
}
  }else{
  var xy = 80;
  var xy_diagnostico = 65;
  if((this.diagnostico_receta != '')|| (this.diagnostico_receta)){
    var splitTitle_diagnostico = doc.splitTextToSize(this.diagnostico_receta, +60);
    // VARIABLE PARA GUARDAR EN HC
    this.historia_clinicadiagnostico = 'Diagnostico presuntivo :'+ splitTitle_diagnostico+ '  ';
    // SI ES DISTINTO DE TEXTO COMUN NO COLOCO DIAGNOSTICO PRESUNTIVO
    if(this.selectedReceta[0]['name'] !== 'TEXTO CON DIAGNOSTICO'){
    doc.text('Diagnostico presuntivo :', 10+x, 60+y);   
    
    }
  for (var i = 0; i < splitTitle_diagnostico.length; i++) {                
    
    doc.text(10+x, xy_diagnostico+y, splitTitle_diagnostico[i]);
    y = y + 5;
}

  }

  var xy_historia_clinica = 95;
  if(this.historia_clinica_resumen !==''){
 
  

  var splitTitle_historia_clinica = doc.splitTextToSize(this.historia_clinica_resumen, 90);
  doc.text('Resumen historia clínica :', 10+x, 90+y); 
  let medico:string = '';
      // VARIABLE PARA GUARDAR EN HC
      this.historia_clinicadiagnostico = this.historia_clinicadiagnostico+' Resumen historia clínica : '+ splitTitle_historia_clinica;
  if(this.formPaciente.value.nombreyapellido=== undefined){
    medico= '';
  }else{
    medico = this.formPaciente.value.nombreyapellido;
  }
  
  for (var i = 0; i < splitTitle_historia_clinica.length; i++) {                
      if (xy > 80) {
          xy = 10;
          //doc.addPage();
      }
      doc.text(10+x, xy_historia_clinica+y, splitTitle_historia_clinica[i]);
      y = y + 5;
  }
}
}
  //doc.save('my.pdf');
 // doc.autoPrint();
 window.open(doc.output('bloburl'));
this.guardarHistoria();


}





imprimirHistoriaClinica(){

  
  let _fechaEmision = formatDate(new Date(), 'dd/MM/yyyy', 'en');
  var  doc = new jsPDF();
  
  const pageSize = doc.internal.pageSize;
  const pageWidth = pageSize.width ? pageSize.width : pageSize.getWidth();
let x:number = 10;
let y:number = 10;
let haytexto:boolean= false;

  doc.setFontSize(8);
  

  doc.text('Nombre: '+this.formPaciente.value.paciente_nombre+'      DNI: '+this.formPaciente.value.dni, 10 +x, y);  
  doc.text('Domicilio: '+this.formPaciente.value.domicilio, 10 +x, 5+y);  
  doc.text('Obra social: '+this.formPaciente.value.obra_social_nombre, 60+x, 5+y);
  
  if( this.formPaciente.value.paciente_obra_social_id == '1'){
    console.log(this.formPaciente.value.paciente_obra_social_id);
    
    if(this.formPaciente.value.plan=== '0'){
      doc.text('Numero: '+this.formPaciente.value.numero_afiliado+'/'+this.formPaciente.value.barra_afiliado, 10+x, 10+y);
    }else{
      doc.text('Numero: '+this.formPaciente.value.numero_afiliado+'/'+this.formPaciente.value.barra_afiliado+'      Plan: '+this.formPaciente.value.plan, 10+x, 10+y);
    }
  }else{    
    if(this.formPaciente.value.plan=== '0'){
      doc.text('Numero: '+this.formPaciente.value.numero_afiliado, 10+x, 10+y);
    }else{
      doc.text('Numero: '+this.formPaciente.value.numero_afiliado+'      Plan: '+this.formPaciente.value.plan, 10+x, 10+y);
    }
  }

  doc.line(15+x, 20+y, pageWidth-15, 20+y);

  let i:number;
  let renglon = 0;
  let contadorPagina = 0;
  var pageHeight = 295;
  for(i=0; i<this.elementos.length; i++){
    /*** AGREGO CADA RENGLO A LA HISTORIA CLINICA */

    /** si la cantidad de registros llego a 9 agrego nueva pagina */
    if( pageHeight< (renglon+y)){
      doc.addPage();
      renglon = 0;
      y = 15
      contadorPagina= 0;
    }
    if(contadorPagina>6){
      doc.addPage();
      renglon = 0;
      y = 0
      contadorPagina= 0;
    }

    if(this.elementos[i]['FECHA']){
       doc.text('FECHA: '+formatDate(this.elementos[i]['FECHA'], 'dd/MM/yyyy HH:mm', 'en'), 15+x, 30+y+renglon);
       renglon = renglon+5;
    }

    if(this.elementos[i]['MEDICONOM']){
      doc.text('MEDICO: '+this.elementos[i]['MEDICONOM'], 15+x, 30+y+renglon);
      renglon = renglon+5;
   }
console.log(this.elementos[i]['MC']);
   if(this.elementos[i]['MC']){
    doc.text('MC: ', 15+x, 30+y+renglon);
    renglon = renglon+5;
    var splitTitle_texto_mc = doc.splitTextToSize(this.elementos[i]['MC'], +150);
    for (var k = 0; k < splitTitle_texto_mc.length; k++) 
    {
      doc.text(15+x, 30+y+renglon, splitTitle_texto_mc[k]);
      y = y + 5;
    }
   
    renglon = renglon+5;
  }

  
  if(this.elementos[i]['AEA']){
    doc.text('AEA: '+this.elementos[i]['AEA'], 15+x, 30+y+renglon);
    renglon = renglon+5;
  }

  
  if(this.elementos[i]['APP']){
    doc.text('APP: '+this.elementos[i]['APP'], 15+x, 30+y+renglon);
    renglon = renglon+5;
  }

  
  if(this.elementos[i]['AF']){
    doc.text('AF: '+this.elementos[i]['AF'], 15+x, 30+y+renglon);
    renglon = renglon+5;
  }

  
  if(this.elementos[i]['SINTOMAS']){
    doc.text('SINTOMAS: ', 15+x, 30+y+renglon);
    renglon = renglon+5;
    var splitTitle_texto_sintomas = doc.splitTextToSize(this.elementos[i]['SINTOMAS'], +150);
    for (var k = 0; k < splitTitle_texto_sintomas.length; k++) 
    {
      doc.text(15+x, 30+y+renglon, splitTitle_texto_sintomas[k]);
      y = y + 5;
    }
  
  renglon = renglon+5;
  }

  
  if(this.elementos[i]['SINTOMAS_SIGNOS']){
    doc.text('SINTOMAS Y SIGNOS: '+this.elementos[i]['SINTOMAS_SIGNOS'], 15+x, 30+y+renglon);
    renglon = renglon+5;
  }

   
  if(this.elementos[i]['TRATAMIENT']){
    doc.text('TRATAMIENTO: '+this.elementos[i]['TRATAMIENT'], 15+x, 30+y+renglon);
    renglon = renglon+5;
  }

   
  if(this.elementos[i]['DIAGNOSTIC']){
    doc.text('DIAGNOSTICO: '+this.elementos[i]['DIAGNOSTIC'], 15+x, 30+y+renglon);
    renglon = renglon+5;
  }

   
  if(this.elementos[i]['BIO']){
    doc.text('BIO: '+this.elementos[i]['BIO'], 15+x, 30+y+renglon);
    renglon = renglon+5;
  }

   
  if(this.elementos[i]['COMENTARIO']){
    doc.text('COMENTARIO: '+this.elementos[i]['COMENTARIO'], 15+x, 30+y+renglon);
    renglon = renglon+5;
  }

   
  if(this.elementos[i]['OBS_LENTES']){
    doc.text('OBS LENTES: '+this.elementos[i]['OBS_LENTES'], 15+x, 30+y+renglon);
    renglon = renglon+5;
  }

   
  if(this.elementos[i]['OBSERVACIO']){
    doc.text('OBSERVACION: '+this.elementos[i]['OBSERVACIO'], 15+x, 30+y+renglon);
    renglon = renglon+5;
  } 

  if(this.elementos[i]['FO']){
    doc.text('FO: '+this.elementos[i]['FO'], 15+x, 30+y+renglon);
    renglon = renglon+5;
  } 

  if(this.elementos[i]['estudio_nombre']){
    doc.text('ESTUDIO: '+this.elementos[i]['estudio_nombre'], 15+x, 30+y+renglon);
    renglon = renglon+5;
  } 

  if(this.elementos[i]['REFRACCION_OD']||this.elementos[i]['REFRACCION_OD']){
    doc.text('REFRACCION OD: '+this.elementos[i]['REFRACCION_OD']+' '+'REFRACCION OI: '+this.elementos[i]['REFRACCION_OI'], 15+x, 30+y+renglon);
    renglon = renglon+5;
  } 

  if(this.elementos[i]['CICLOPEGIA_OD']||this.elementos[i]['CICLOPEGIA_OI']){
    doc.text('CICLOPEGIA OD: '+this.elementos[i]['CICLOPEGIA_OD']+' '+'CICLOPEGIA OI: '+this.elementos[i]['CICLOPEGIA_OI'], 15+x, 30+y+renglon);
    renglon = renglon+5;
  } 


  if(this.elementos[i]['FONDO_OD']||this.elementos[i]['FONDO_OI']){
    doc.text('FONDO OD: '+this.elementos[i]['FONDO_OD']+' '+'FONDO OI: '+this.elementos[i]['FONDO_OI'], 15+x, 30+y+renglon);
    renglon = renglon+5;
  } 

  if(this.elementos[i]['PIO_OD']||this.elementos[i]['PIO_OI']){
    doc.text('PIO OD: '+this.elementos[i]['PIO_OD']+' '+'PIO OI: '+this.elementos[i]['PIO_OI'], 15+x, 30+y+renglon);
    renglon = renglon+5;
  } 

  if(this.elementos[i]['BIO_OD']||this.elementos[i]['BIO_OI']){
    doc.text('BIO OD: '+this.elementos[i]['BIO_OD']+' '+'BIO OI: '+this.elementos[i]['BIO_OI'], 15+x, 30+y+renglon);
    renglon = renglon+5;
  } 

  
  if(this.elementos[i]['DIAGNOSTICO_OD']||this.elementos[i]['DIAGNOSTICO_OI']){
    doc.text('DIAGNOSTICO OD: '+this.elementos[i]['DIAGNOSTICO_OD']+' '+'DIAGNOSTICO OI: '+this.elementos[i]['DIAGNOSTICO_OI'], 15+x, 30+y+renglon);
    renglon = renglon+5;
  } 


  
  if(this.elementos[i]['TRATAMIENTO_QUIRURGICO']){
    doc.text('TRATAMIENTO QUIRURGICO: '+this.elementos[i]['TRATAMIENTO_QUIRURGICO'], 15+x, 30+y+renglon);
    renglon = renglon+5;
  } 

  if(this.elementos[i]['TRATAMIENTO_MEDICO']){
    doc.text('TRATAMIENTO MEDICO: '+this.elementos[i]['TRATAMIENTO_MEDICO'], 15+x, 30+y+renglon);
    renglon = renglon+5;
  } 

  if(this.elementos[i]['ESTUDIOSES']){
    doc.text('FONDO DE OJO: '+this.elementos[i]['ESTUDIOSES'], 15+x, 30+y+renglon);
    renglon = renglon+5;
  } 

  
doc.line(15+x, 30+y+renglon, pageWidth-15, 30+y+renglon);
contadorPagina++;
renglon = renglon+5;
}
window.open(doc.output('bloburl'));
  

}


imprimirReceta(){

  let _fechaEmision = formatDate(new Date(), 'dd/MM/yyyy', 'en');
  var  doc = new jsPDF();
  
  const pageSize = doc.internal.pageSize;
  const pageWidth = pageSize.width ? pageSize.width : pageSize.getWidth();
let x:number = 20;
let y:number = 40;
  doc.setFontSize(8);


  let paciente_nombre:string = '';
  let paciente_apellido:string='';
  let paciente_dni:string = '';
  let numero_afiliado:string = '';
  let domicilio:string = '';
  let paciente_obra_social_nombre:string='';
  let plan:string = '';

  let OBS_LENTES_:string = '';
  let OBSERVACIO:string = '';

  if((this.formPaciente.value.paciente_apellido=== null)){
    paciente_apellido = '';
  }else{
    paciente_apellido = this.formPaciente.value.paciente_apellido;
  }
 
  if((this.formPaciente.value.paciente_dni=== null)){
    paciente_dni = '';
  }else{
    paciente_dni = this.formPaciente.value.paciente_dni;
  }

  if((this.formPaciente.value.paciente_dni=== null)){
    paciente_dni = '';
  }else{
    paciente_dni = this.formPaciente.value.paciente_dni;
  }
  
  if((this.formPaciente.value.domicilio=== null)){
    domicilio = '';
  }else{
    domicilio = this.formPaciente.value.domicilio;
  }
  console.log(this.formPaciente.value.obra_social_nombre);
  if((this.formPaciente.value.obra_social_nombre=== null)){
    paciente_obra_social_nombre = '';
  }else{
    paciente_obra_social_nombre = this.formPaciente.value.obra_social_nombre;
  }

  if((this.formPaciente.value.numero_afiliado=== null)){
    numero_afiliado = '';
  }else{
    numero_afiliado = this.formPaciente.value.numero_afiliado;
  }

  if((this.formPaciente.value.plan=== null)){
    plan = '';
  }else{
    plan = this.formPaciente.value.plan;
  }
  
  
 

  doc.text('Nombre: '+this.formPaciente.value.paciente_nombre+'      DNI: '+this.formPaciente.value.dni, 10 +x, 5+y);  
  doc.text('Domicilio: '+this.formPaciente.value.domicilio, 10 +x, 10+y);  
  doc.text('Obra social: '+this.formPaciente.value.obra_social_nombre, 10+x, 15+y);
  console.log(this.formPaciente.value.paciente_obra_social_id);
  if( this.formPaciente.value.paciente_obra_social_id == '1'){
    console.log(this.formPaciente.value.paciente_obra_social_id);
    
    if(this.formPaciente.value.plan=== '0'){
      doc.text('Numero: '+this.formPaciente.value.numero_afiliado+'/'+this.formPaciente.value.barra_afiliado, 10+x, 20+y);
    }else{
      doc.text('Numero: '+this.formPaciente.value.numero_afiliado+'/'+this.formPaciente.value.barra_afiliado+'      Plan: '+this.formPaciente.value.plan, 10+x, 20+y);
    }
  }else{    
    if(this.formPaciente.value.plan=== '0'){
      doc.text('Numero: '+this.formPaciente.value.numero_afiliado, 10+x, 20+y);
    }else{
      doc.text('Numero: '+this.formPaciente.value.numero_afiliado+'      Plan: '+this.formPaciente.value.plan, 10+x, 20+y);
    }
  }
  

  /** BORDE* */
  /** HORIZONTAL */
  doc.setLineWidth(0.4);
  doc.line(10+x, 35+y, 85+x, 35+y);
  doc.line(10+x, 45+y, 85+x, 45+y);
  doc.line(10+x, 55+y, 85+x, 55+y);

  doc.line(10+x, 75+y, 85+x, 75+y);
  doc.line(10+x, 85+y, 85+x, 85+y);
  doc.line(10+x, 95+y, 85+x, 95+y);

   /** VERTICAL */
   doc.line(10+x, 35+y,10+x, 55+y);
   doc.line(25+x, 35+y,25+x, 55+y);
   doc.line(45+x, 35+y,45+x, 55+y);
   doc.line(65+x, 35+y,65+x, 55+y);
   doc.line(85+x, 35+y,85+x, 55+y);

   doc.line(10+x, 75+y,10+x, 95+y);
   doc.line(25+x, 75+y,25+x, 95+y);
   doc.line(45+x, 75+y,45+x, 95+y);
   doc.line(65+x, 75+y,65+x, 95+y);
   doc.line(85+x, 75+y,85+x, 95+y);

   /** TITULOS */
   doc.text('Lentes de lejos', 10+x, 25+y);  
   doc.text('Esférico', 30+x, 30+y);  
   doc.text('Cilíndro', 50+x, 30+y);  
   doc.text('Eje', 70+x, 30+y);  
   doc.text('Lentes de cerca', 10+x, 65+y);  
   doc.text('Esférico', 30+x,70+y );  
   doc.text('Cilíndro', 50+x, 70+y);  
   doc.text('Eje', 70+x, 70+y);  


   doc.text('OD', 15+x, 42+y);  
   doc.text('OI', 15+x, 52+y);  
   doc.text('OD', 15+x, 82+y);  
   doc.text('OI', 15+x, 92+y);  

  
   if((this.formPaciente.value.OBS_LENTES=== null)){
    OBS_LENTES_ = '';
   }else{
     OBS_LENTES_ = this.formPaciente.value.OBS_LENTES;
   }

   if((this.formPaciente.value.OBSERVACIO=== null)){
    OBSERVACIO = '';
  }else{
    OBSERVACIO = this.formPaciente.value.OBSERVACIO;
  }
  
   

   let LEJOS_OD_E:string='';
   let LEJOS_OD_C:string='';
   let LEJOS_OD_2:string='';
   let LEJOS_OI_E:string='';
   let LEJOS_OI_C:string='';
   let LEJOS_OI_2:string='';
   let CERCA_OD_E:string='';
   let CERCA_OD_C:string='';
   let CERCA_OD_2:string='';
   let CERCA_OI_E:string='';
   let CERCA_OI_C:string='';
   let CERCA_OI_2:string='';

  
   if(this.formPaciente.value.LEJOS_OD_E ){
    if(this.formPaciente.value.LEJOS_OD_E.charAt(0) === '-'){
      LEJOS_OD_E = (this.formPaciente.value.LEJOS_OD_E);
    }else{
      LEJOS_OD_E ='+'+this.formPaciente.value.LEJOS_OD_E;};
   }
   if(this.formPaciente.value.LEJOS_OD_C ){
    console.log(this.formPaciente.value.LEJOS_OD_C.charAt(0));
    if(this.formPaciente.value.LEJOS_OD_C.charAt(0) === '-'){
      LEJOS_OD_C = (this.formPaciente.value.LEJOS_OD_C);
    }else{ 
      LEJOS_OD_C ='+'+this.formPaciente.value.LEJOS_OD_C;
     };
   
   }
  
   if(this.formPaciente.value.LEJOS_OI_E){    
    console.log(this.formPaciente.value.LEJOS_OI_E.charAt(0));
    console.log(this.formPaciente.value.LEJOS_OI_E);
    let LEJOS_OI_E_T = Number(this.formPaciente.value.LEJOS_OI_E);
    if(this.formPaciente.value.LEJOS_OI_E.charAt(0) === '-'){
      LEJOS_OI_E = (this.formPaciente.value.LEJOS_OI_E);
    }else{ LEJOS_OI_E ='+'+this.formPaciente.value.LEJOS_OI_E;};
   }

   if(this.formPaciente.value.LEJOS_OI_C){
    console.log(this.formPaciente.value.LEJOS_OD_E.charAt(0));
    if(this.formPaciente.value.LEJOS_OI_C.charAt(0) === '-'){
      LEJOS_OI_C = (this.formPaciente.value.LEJOS_OI_C);
      }
      else{LEJOS_OI_C ='+'+this.formPaciente.value.LEJOS_OI_C };
   }
  

   if(this.formPaciente.value.CERCA_OD_E){
    let CERCA_OD_E_:string = String(this.formPaciente.value.CERCA_OD_E);
    if(CERCA_OD_E_.charAt(0) === '-'){
      CERCA_OD_E = (CERCA_OD_E_);
    }else{ CERCA_OD_E ='+'+CERCA_OD_E_;};
     console.log(this.formPaciente.value.CERCA_OD_E);
   /*  if(this.formPaciente.value.CERCA_OD_E>0){
      CERCA_OD_E ='+'+this.formPaciente.value.CERCA_OD_E;
     }else{
      CERCA_OD_E =this.formPaciente.value.CERCA_OD_E;
     }*/
   
   }
      
 
  
   if(this.formPaciente.value.CERCA_OI_E){
      let CERCA_OI_E_:string = String(this.formPaciente.value.CERCA_OI_E);
    if(CERCA_OI_E_.charAt(0) === '-'){
      CERCA_OI_E = (CERCA_OI_E_);
    }else{ CERCA_OI_E ='+'+CERCA_OI_E_;};
   /* if(this.formPaciente.value.CERCA_OI_E>0){
      CERCA_OI_E ='+'+this.formPaciente.value.CERCA_OI_E;
    }else{
      CERCA_OI_E =this.formPaciente.value.CERCA_OI_E;
    }*/
  }

  if(this.formPaciente.value.CERCA_OD_C){
    if(this.formPaciente.value.CERCA_OD_C.charAt(0) === '-'){
      CERCA_OD_C = (this.formPaciente.value.CERCA_OD_C);
     
    }else{  
      CERCA_OD_C ='+'+this.formPaciente.value.CERCA_OD_C;};
   }
   
   if(this.formPaciente.value.CERCA_OI_C){
    if(this.formPaciente.value.CERCA_OI_C.charAt(0) !== '-'){CERCA_OI_C ='+'+this.formPaciente.value.CERCA_OI_C}else{ CERCA_OI_C = (this.formPaciente.value.CERCA_OI_C);};
   }
   /** EJES  */
   if((this.formPaciente.value.CERCA_OI_2 === null)||(this.formPaciente.value.CERCA_OI_2 === '')){    
    
  }else{ 
    CERCA_OI_2 = (this.formPaciente.value.CERCA_OI_2)+'°';
   }
   if((this.formPaciente.value.CERCA_OD_2 === null)||(this.formPaciente.value.CERCA_OD_2 === '')){    
    
  }else{ 
    CERCA_OD_2 = (this.formPaciente.value.CERCA_OD_2)+'°';
   }

   if((this.formPaciente.value.LEJOS_OD_2 === null)||(this.formPaciente.value.LEJOS_OD_2 === '')){    
    
  }else{ 
     LEJOS_OD_2 = (this.formPaciente.value.LEJOS_OD_2)+'°';
   }


   if((this.formPaciente.value.LEJOS_OI_2 === null)||(this.formPaciente.value.LEJOS_OI_2 === '')){    
    
   }else{
    console.log(this.formPaciente.value.LEJOS_OI_2);
    LEJOS_OI_2 = (this.formPaciente.value.LEJOS_OI_2)+'°';
   }

   /****DATOS */
//   pipe.transform(LEJOS_OD_E,  '1.1-1')
   doc.text(String(LEJOS_OD_E), 30+x, 42+y);  
   doc.text(String(LEJOS_OD_C), 50+x, 42+y);  
   doc.text(String(LEJOS_OD_2), 70+x, 42+y);  

   doc.text(String(LEJOS_OI_E), 30+x, 52+y);  
   doc.text(String(LEJOS_OI_C), 50+x, 52+y);  
   doc.text(String(LEJOS_OI_2), 70+x, 52+y);  

   doc.text(String(CERCA_OD_E), 30+x, 82+y);   //ok
   doc.text(String(CERCA_OD_C), 50+x, 82+y);  
   doc.text(String(CERCA_OD_2), 70+x, 82+y);  
   
   doc.text(String(CERCA_OI_E), 30+x, 92+y);  //ok 
   doc.text(String(CERCA_OI_C), 50+x, 92+y);  
   doc.text(String(CERCA_OI_2), 70+x, 92+y);  

   doc.text('Observaciones: '+OBS_LENTES_, 10+x, 105+y);  
   doc.text('Diagnostico: '+OBSERVACIO, 10+x, 115+y);  
   doc.text('Firma ', 70+x, 130+y);   
   doc.text( _fechaEmision, 10+x, 130+y);  

   
  window.open(doc.output('bloburl'));

    LEJOS_OD_E= '';
    LEJOS_OD_C= '';
    LEJOS_OD_2= '';
    LEJOS_OI_E= '';
    LEJOS_OI_C= '';
    LEJOS_OI_2= '';
    CERCA_OD_E= '';
    CERCA_OD_C= '';
    CERCA_OD_2= '';
    CERCA_OI_E= '';
    CERCA_OI_C= '';
    CERCA_OI_2= '';
    
  paciente_nombre= '';
  paciente_apellido='';
  paciente_dni= '';
  numero_afiliado= '';
  domicilio= '';
  paciente_obra_social_nombre='';
  plan= '';
  OBS_LENTES_ = '';
  OBSERVACIO = '';

}




filtered(event){
  console.log(event.filteredValue);
  this.elementosFiltrados  = event.filteredValue;  
}

editRow(row){
  console.log(row.data);
  this.popItem = row.data;
      /* if( this.actualizarDatos()){
      this.showToast('exito',"Registro modificado","Exito al modificar");
  }*/
}




colorRow(estado:string){
 
  if(estado == 'ATENDIDO') {  
      return {'es-atendido'  :'null' };
  }
  
  if(estado == 'PENDIENTE') {  
      return {'es-pendiente'  :'null' };
  }

  if(estado == 'AUSENTE') {  
      return {'es-ausente'  :'null' };
  }
  
  if(estado == 'INGRESADO') {  
      return {'es-ingresado'  :'null' };
  }

  if(estado == 'ESPERA') {  
      return {'es-espera'  :'null' };
  }

  if(estado == 'SOBRETURNO') {  
    return {'es-sobreturno'  :'null' };
  }
  if(estado == 'CANCELADO') {  
    return {'es-cancelado'  :'null' };
}  

}

throwAlert(estado:string, mensaje:string, motivo:string, errorNumero:string){
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

if(errorNumero =='99'){
  mensaje ='Debe seleccionar un paciente antes de cargar las prácticas';
  swal({   
      type: 'warning',
      title: 'Atención..',
      text: mensaje,
      footer: motivo
    })
}

if(errorNumero =='100'){
  mensaje ='El paciente posee una obra social que no esta habilitada';
  swal({   
      type: 'warning',
      title: 'Atención..',
      text: mensaje,
      footer: motivo
    })
}
  if(estado == 'warning'){
    
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


