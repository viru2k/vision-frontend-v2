import { Component, OnInit } from '@angular/core';
import swal from 'sweetalert2';
import { CirugiaService } from '../../../services/cirugia.service';
import { MessageService, DialogService } from 'primeng/api';
import { URL_ARCHIVO, calendarioIdioma } from './../../../config/config';

import { HistoriaClinica } from '../../../models/historia-clinica.model';
import { AgendaTurno } from '../../../models/agenda-turno.model';
import { Paciente } from '../../../models/paciente.model';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { PopupPacienteObrasocialComponent } from '../../../shared/components/popups/popup-paciente-obrasocial/popup-paciente-obrasocial.component';
import { Router } from '@angular/router';
import { DatePipe } from '@angular/common';
import { PopupMedicoComponent } from '../../../shared/components/popups/popup-medico/popup-medico.component';
import { MedicoObraSocial } from '../../../models/medico-obrasocial.model';
import { Estudios } from '../../../models/estudios.model';
import { formatDate, CurrencyPipe } from '@angular/common';

@Component({
  selector: 'app-estudio-carga',
  templateUrl: './estudio-carga.component.html',
  styleUrls: ['./estudio-carga.component.css'],
  providers: [MessageService, DialogService, DatePipe]
})
export class EstudioCargaComponent implements OnInit {
loading: boolean;
uplo: File;
uploadedFiles: any[] = [];
public url: string  = URL_ARCHIVO;


fechaHoy: Date;
  _fechaHoy: string;
  cols: any;
  popItem: HistoriaClinica;
  newPopItem: boolean;
  resultSave: boolean;
  es: any;
  displayDialog: boolean;
  // LOADING
  val1: number;
  elemento: HistoriaClinica;
  elementos: HistoriaClinica[];
  paciente: AgendaTurno = null;
  selecteditems: HistoriaClinica[] = [];
  selectedItem: HistoriaClinica;
  elementosFiltrados: HistoriaClinica[] = null;
  edad: number;
  popItemPaciente: Paciente;
  formPaciente: FormGroup;
  existe: boolean;
  condicion: string;
  selectedHistoriaClinica: HistoriaClinica;
  popItemAgenda: AgendaTurno;
  display: boolean;
  receta: string;
  listarecetas: any[];
  listaindicacionesmedicas: any[];
  selectedReceta: string[] = [];
  selectedIndicaciones: string;
  DateForm: FormGroup;
  popItemMedico: MedicoObraSocial = null;
  estudio: Estudios;
  estudios: Estudios[] = [];
  estudiosTexto: any[];
  selectedEstudio: string;
  userData: any;

  constructor(private cirugiaService: CirugiaService, private messageService: MessageService,
    private router: Router, public dialogService: DialogService) {

    this.userData = JSON.parse(localStorage.getItem('userData'));
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
    'selectedEstudio': new FormControl(''),

    });




  this.estudiosTexto = [

    {name: 'RG', code: '1'},
    {name: 'RFG', code: '2'},
    {name: 'OCT', code: '3'},
    {name: 'CVC', code: '10'},
    {name: 'PAQUIMETRIA CORNEAL', code: '4'},
    {name: 'TOPOGRAFIA CORNEAL', code: '5'},
    {name: 'RECUENTO ENDOTELIAL', code: '6'},
    {name: 'OCT DE MACULA', code: '7'},
    {name: 'OCT DE PAPILA', code: '8'},
    {name: 'VERION', code: '9'},
    {name: 'Lampara hendidura (im600)', code: '10'},

];

   }

  ngOnInit() {
    this.es = calendarioIdioma;
    this.fechaHoy = new Date();
    this.selectedEstudio =  this.estudiosTexto[0];
    if(this.paciente != null){
      console.log(this.paciente);
      if(this.paciente.plan === '0'){
        this.formPaciente.patchValue({plan: ''});
      }

      this.formPaciente.patchValue({FECHA: this.fechaHoy});
      this.formPaciente.patchValue({paciente_nombre: this.paciente.paciente_apellido + ' ' + this.paciente.paciente_nombre});
      this.formPaciente.patchValue({paciente_id: this.paciente.id});
      this.formPaciente.patchValue({numero_afiliado: this.paciente.numero_afiliado});
      this.formPaciente.patchValue({plan: this.paciente.plan});
      this.formPaciente.patchValue({domicilio: this.paciente.domicilio});
      this.formPaciente.patchValue({obra_social_nombre: this.paciente.paciente_obra_social_nombre});
      this.formPaciente.patchValue({dni: this.paciente.paciente_dni});
      this.formPaciente.patchValue({barra_afiliado: this.paciente.barra_afiliado});
      this.formPaciente.patchValue({numero_afiliado: this.paciente.numero_afiliado});
      this.formPaciente.patchValue({paciente_obra_social_id: this.paciente.paciente_obra_social_id});

    //  this.edad =(new Date()).getFullYear() - (new Date(this.paciente.paciente_fecha_nacimiento)).getFullYear();
      const timeDiff = Math.abs(Date.now() - new Date(this.paciente.paciente_fecha_nacimiento).getTime());
      const age = Math.floor((timeDiff / (1000 * 3600 * 24)) / 365.25);
      console.log(age)
      this.formPaciente.patchValue({edad: age});
      console.log(this.formPaciente);
 
    }else{ //10029750
      this.paciente = new AgendaTurno('',new Date(), new Date(), new Date(),'','','','','','','','','','','','','','','888888','' ,'','','','','','','','','', new Date(),'','','','','', '','','','','','','','','');
    //  this.historiaClinica();
    }
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

         let timeDiff = Math.abs(Date.now() - new Date(this.popItemPaciente.fecha_nacimiento).getTime());
         this.edad = Math.floor((timeDiff / (1000 * 3600 * 24))/365.25);
         console.log(this.edad);
     //    this.formPaciente.patchValue({edad: age});
         // this.edad =(new Date()).getFullYear() - (new Date(this.popItemPaciente.fecha_nacimiento)).getFullYear();
         this.formPaciente.patchValue({edad: this.edad});
         this.formPaciente.patchValue({numero_afiliado:PopupPacienteObrasocialComponent.numero_afiliado});
         this.formPaciente.patchValue({plan:PopupPacienteObrasocialComponent.plan});
         this.formPaciente.patchValue({dni:PopupPacienteObrasocialComponent.dni});
         this.paciente = this.formPaciente.value;
         this.paciente.paciente_dni=   this.formPaciente.value.PACIENTE;
         console.log( this.paciente);
         console.log( this.formPaciente);
        
        
        }
    });
  
  }


  
  buscarMedico(){
    let data:any; 
    const ref = this.dialogService.open(PopupMedicoComponent, {
    data,
     header: 'Buscar medico', 
     width: '98%',
     height: '90%'
    });

    ref.onClose.subscribe((PopupMedicoComponent:MedicoObraSocial) => {
        if (PopupMedicoComponent) {
          console.log(PopupMedicoComponent);    
          this.popItemMedico = PopupMedicoComponent;
          this.formPaciente.patchValue({medico_id: this.popItemMedico.usuario_id});
          this.formPaciente.patchValue({medico_nombre: this.popItemMedico.apellido+" "+this.popItemMedico.nombre});
         console.log(this.formPaciente.value);
        }
    });

  }
 

  verReceta(){
    this.receta = '';
    console.log(this.selectedReceta["label"]);
    if(this.selectedReceta["label"] === 'TEXTO'){}else{
      
    }
   // this.receta = 'Solicito: '+this.selectedReceta["name"];
    this.display = true;
  }

  actualizarFechaHasta(event){
    console.log(event);
    this.fechaHoy = event;
    this._fechaHoy = formatDate(new Date(this.fechaHoy), 'yyyy-MM-dd HH:mm', 'en');
    console.log(new Date(this.fechaHoy));
    this.formPaciente.patchValue({FECHA: this._fechaHoy});
  }


  
  onUpload(event) { 
  let  selectedEstudio_ =this.selectedEstudio['name'];  
    this._fechaHoy = formatDate(new Date(this.fechaHoy), 'yyyy-MM-dd HH:mm', 'en');
    console.log(event.files);
  //  let selectedReceta = this.listarecetas[0]['label'];
    for(let file of event.files) {
      this.estudio = new Estudios('',this.formPaciente.value.selectedEstudio['name'],this.formPaciente.value.paciente_id,this.formPaciente.value.medico_id,this._fechaHoy,this.userData['id'],file.name, URL_ARCHIVO,file.type, this.formPaciente.value.dni,this.formPaciente.value.SINTOMAS_SIGNOS);
      console.log(file.name);
      console.log(this.estudio);
      //  this.uploadedFiles.push(file);
      this.estudios.push(this.estudio);
    }
   
    
    
    console.log(this.estudios);
    this.uploadEstudioDatos(this.estudios);
}

  

  

  uploadEstudioDatos(datos:Estudios[]){ 
    this.loading = true; 
    try { 
     
        this.cirugiaService.uploadEstudioDatos(datos)
        .subscribe(resp => {
       // this.elementos = resp;
        console.log(resp);      
        this.throwAlert('success','Se subieron los archivos con éxito','','');
      //  this.formPaciente.patchValue({historia_clinica: resp})
        console.log(this.formPaciente);
        this.loading = false;
        //this.loadList();
        //this.resultSave = true;
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

