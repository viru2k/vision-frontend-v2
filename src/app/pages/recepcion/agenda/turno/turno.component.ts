import { PopupObrasocialComponent } from './../../../mantenimiento/popup/popup-obrasocial/popup-obrasocial.component';
import { ObraSocialService } from './../../../../services/obra-social.service';
import { MedicoObraSocial } from './../../../../models/medico-obrasocial.model';
import { PopupPacienteNuevoComponent } from './../../../paciente/popup-paciente/popup-paciente.component';
import { PopupPacienteObrasocialComponent } from './../../../../shared/components/popups/popup-paciente-obrasocial/popup-paciente-obrasocial.component';

import { calendarioIdioma } from './../../../../config/config';
import { AgendaService } from './../../../../services/agenda.service';
import { ObraSocial } from './../../../../models/obra-social.model';
import { Medico } from './../../../../models/medico.model';
import { Paciente } from './../../../../models/paciente.model';
import { Agenda } from './../../../../models/agenda.model';
import { Component, OnInit } from '@angular/core';
import { FormControl, Validators, FormGroup, Form } from '@angular/forms';


import swal from 'sweetalert2';
import { AgendaMedico } from '../../../../models/agenda-medico.model';
import { DatePipe, formatDate } from '@angular/common';

import { DynamicDialogConfig, MessageService, DynamicDialogRef } from 'primeng/api';
import { DialogService } from 'primeng/components/common/api';
import { PopupTurnoUsuarioObraSocialComponent } from './popup-turno-usuario-obra-social/popup-turno-usuario-obra-social.component';
import { AgendaTurno } from '../../../../models/agenda-turno.model';
import { PacienteService } from 'src/app/services/paciente.service';
import { Router, ActivatedRoute } from '@angular/router';
import { PopupAgendaObservacionComponent } from '../../../../shared/components/popups/popup-agenda-observacion/popup-agenda-observacion.component';

import { User } from '../../../../models/user.model';
import { UserService } from './../../../../services/user.service';



@Component({
  selector: 'app-turno',
  templateUrl: './turno.component.html',
  styleUrls: ['./turno.component.css'],
  providers: [MessageService,DialogService,DatePipe]

})
export class TurnoComponent implements OnInit {

  resultSave:boolean;
  colsAgenda:any;
  selectedItem: Agenda;

  es:any;
  agendaMedico:AgendaMedico;
  loading: boolean;
  loadingAccion:boolean;
  elemento:AgendaTurno = null;
  elementoPaciente:Paciente = null;
  elementoPacienteInicio:AgendaTurno = null;
  elementos:AgendaTurno[];
  agendaTurno:AgendaTurno[] = null;
  calendarioBloqueado:any[]=null;
  popItemPaciente:Paciente;
  popItemMedicoObraSocial:MedicoObraSocial;
  cities: any[];
  es_sobreturno:boolean = false;
  formPaciente: FormGroup;
  AgendaForm:FormGroup;
  _fechaHoy:string;
  fechaHoy:Date;
  invalidDate: Date;
  invalidDates:Date[]=[];
  invalidDatesCompleta: Array<Date>;
  usuario_id:string;
  usuario_medico_factura_id:string;
  paciente_id:string;
  observaciones:string;
  motivo_atencion:string = '';
  dia: any[];
  checked: boolean = false;
 DateForm:FormGroup;
 esInvocado:boolean = false; // cuando es invocada la pagina desde afuera
 display:boolean;
 formasPago:any[];
 motivoObservaciones:any[] = [];
 sobreturno:string = 'NO';

 selectedMotivo:string;
 selectedObraSocial:string = '';
 selectedEstudio:string;
 selectedMedicoEfector:string;
 observacion:string;
 motivoatencion:any[];
 estudios:any[];
 motivos:any[];
 obrasocial: any[];
 usuarios:User[];
 medico_nombre:string;
 medico_nombre_factura:string;
 apellido:string;
 nombre:string;
 obra_social_nombre:string;
 dni:string;
 fecha_nacimiento:Date;

  constructor(private miServicoPaciente:PacienteService ,
    private obraSocialServicio:ObraSocialService,
    private miUserServico:UserService, private miServico:AgendaService, private datePipe: DatePipe,  private messageService: MessageService ,public dialogService: DialogService,  private route: ActivatedRoute,     private router: Router ) {

    this.popItemPaciente =  new Paciente('0','','','','','',new Date(),'','','','','','','','','0','0','','','0','','','','','','');
    if(this.router.getCurrentNavigation().extras.state != undefined){
      console.log(this.router.getCurrentNavigation().extras.state.paciente);
      this.buscarPacienteByDni(this.router.getCurrentNavigation().extras.state.paciente.paciente_dni, this.router.getCurrentNavigation().extras.state.paciente );
    }
     this.es = calendarioIdioma;
     this.colsAgenda = [
      {field: 'dia_nombre', header: 'Dia' },
      {field: 'hora_desde', header: 'Hora desde' },
      {field: 'nombreyapellido', header: 'Usuario' },
      {field: 'boton', header: '' },
      ];

      this.estudios = [
        {name: 'SIN ESTUDIOS', code: '16'},
        {name: 'ESTUDIOS COMBINADOS', code: '13'},
        {name: 'RFG + OCT', code: '14'},
        {name: 'RFG + OCT + PAQUIMETRIA', code: '15'},
        {name: 'LASER ARGON', code: '1'},
        {name: 'YAG LASER', code: '2'},
        {name: 'ECOGRAFIA', code: '3'},
        {name: 'ECOMETRIA', code: '4'},
        {name: 'RETINOGRAFIA', code: '5'},
        {name: 'RETINOFLUORESCEINOGRAFIA', code: '6'},
        {name: 'PAQUIMETRIA', code: '7'},
        {name: 'CAMPIMETRIA COMPUTARIZADA', code: '8'},
        {name: 'OCT', code: '9'},
        {name: 'TOPOGRAFIA', code: '10'},
        {name: 'IOL MASTER', code: '11'},
        {name: 'MICROSCOPIA', code: '12'},

    ];

    this.motivos = [
      {name: 'SIN SELECCION', code: '1'},
      {name: 'CONSULTA', code: '2'},
      {name: 'ESTUDIOS', code: '3'},
      {name: 'CONTROL PREQUIRURGICO', code: '4'},
      {name: 'CONTROL POSQUIRURGICO', code: '5'},
      {name: 'ANESTESIA', code: '6'},
      {name: 'ASESORAMIENTO QUIRURGICO', code: '7'},
      {name: 'CIRUGIA', code: '8'},
      {name: 'ADVERTENCIA', code: '9'},


  ];

      this.DateForm = new FormGroup({
        'fechaHoy': new FormControl('', Validators.required)
        });


}

  ngOnInit() {

        //this.fechaHoy = new Date();
        let today = new Date();
        let invalidDate = new Date();
        let invalidDate2 = new Date();
        let invalidDate3 = new Date();
        let invalidDate4 = new Date();

        this.selectedEstudio =  this.estudios[0];
        this.selectedMotivo =  this.motivos[1];

    this.invalidDatesCompleta = [invalidDate, invalidDate];
    this.formPaciente = new FormGroup({
      'id': new FormControl(''),
      'nombre': new FormControl(''),
      'apellido': new FormControl(''),
      'dni': new FormControl('', Validators.required),
      'obra_social_nombre': new FormControl(''),
      'obra_social_nombre_adicional': new FormControl(''),
      'obra_social_nombre_adicional_id': new FormControl(86),
      'fecha_nacimiento': new FormControl('')
  });
  this.AgendaForm = new FormGroup({
    'medico_nombre': new FormControl(''),
    'obra_social': new FormControl(''),
    'medico_nombre_factura': new FormControl(''),
});

this.getUsuarioMedico();
this.loadListObraSocial();
  let newDate = new Date();
  this.DateForm.patchValue({fechaHoy: this.fechaHoy});
    if(this.esInvocado){
     // console.log(this.elementoPacienteInicio);
  //  this.cargarAgendaInicio(this.elementoPacienteInicio);
    }
  }



  buscarObraSocial(){
    let data:any;
    const ref = this.dialogService.open(PopupObrasocialComponent, {
    data,
     header: 'Buscar obra social',
     width: '98%',
     height: '90%'
    });

    ref.onClose.subscribe((PopupObraSocialComponent:ObraSocial) => {
        if (PopupObraSocialComponent) {
          console.log(PopupObraSocialComponent);
          this.formPaciente.patchValue({obra_social_nombre_adicional_id: PopupObraSocialComponent.id});
          this.formPaciente.patchValue({obra_social_nombre_adicional: PopupObraSocialComponent.nombre});

        }
    });

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


  buscarPacienteByDni(dni: string, _agenda: any){
    this.loading = true;
    try {
        this.miServicoPaciente.getItems('paciente.dni',dni)
        .subscribe(resp => {
          console.log(resp);
      //    this.elementoPacienteInicio = resp[0];//this.router.getCurrentNavigation().extras.state.paciente;

      this.popItemPaciente = resp[0];
       this.formPaciente.patchValue(resp[0]);
      this.apellido = resp[0].apellido;
      this.nombre = resp[0].nombre;
      this.obra_social_nombre = resp[0].obra_social_nombre;
      this.dni =  resp[0].dni;
      this.fecha_nacimiento =  resp[0].fecha_nacimiento;
      this.esInvocado = true;
      this.usuario_id = _agenda.usuario_id;
      this.AgendaForm.patchValue({medico_nombre: _agenda.nombreyapellido});
      this.formPaciente.patchValue({fecha_nacimiento: _agenda.paciente_fecha_nacimiento});
      this.formPaciente.patchValue({obra_social_nombre_adicional_id: _agenda.obra_social_alterantiva_id});
      this.formPaciente.patchValue({obra_social_nombre_adicional: _agenda.obra_social_alterantiva_nombre});
      console.log(_agenda);
      console.log(this.formPaciente.value);
      this.calendarioBloqueo();

    //  console.log(this.elementoPacienteInicio);
            this.loading = false;
        },
        error => { // error path
            console.log(error.message);
            console.log(error.status);

         });
    } catch (error) {
        this.throwAlert('error','error','Error: '+error.status+'  Error al cargar los registros',error.message);
    }
  }


  guardarObservacion(){
    console.log(this.selectedObraSocial);
    let selectedMedicoEfector_:string;
    let selectedEstudio_:String;
    let selectedMotivo_:String;
    console.log(this.selectedMedicoEfector);
    if(!this.selectedMedicoEfector['nombreyapellido']){
      selectedMedicoEfector_ = '';
    }else{
      selectedMedicoEfector_ ='MEDICO:  '+ this.selectedMedicoEfector['nombreyapellido'];
    }

    if(!this.selectedEstudio['name']){
      selectedEstudio_ = '';
    }else{
      selectedEstudio_ ='ESTUDIO: '+ this.selectedEstudio['name'];
    }

    if(!this.selectedMotivo['name']){
      selectedMotivo_ = '';
    }else{
      selectedMotivo_ = this.selectedMotivo['name'];
    }
      this.motivoatencion = [];
    this.motivoatencion.push(selectedEstudio_);
    this.motivoatencion.push(selectedMedicoEfector_);
    this.motivoatencion.push(this.checked);
    this.motivoatencion.push(this.observacion);
    this.motivoatencion.push(selectedMotivo_);
    this.motivoObservaciones = this.motivoatencion;
    console.log(this.motivoObservaciones);
  }

  cargarAgendaInicio(agenda:AgendaTurno){

    this.popItemPaciente.id =   agenda.paciente_id;
    this.popItemPaciente.nombre =   agenda.paciente_nombre;
    this.popItemPaciente.apellido = agenda.paciente_apellido;
    this.popItemPaciente.dni =      agenda.paciente_dni;
    this.popItemPaciente.obra_social_nombre =   agenda.paciente_obra_social_nombre;
    this.formPaciente.patchValue({nombre: agenda.paciente_nombre});
    this.formPaciente.patchValue({apellido: agenda.paciente_apellido});
    this.formPaciente.patchValue({dni: agenda.paciente_dni});
    this.formPaciente.patchValue({obra_social_nombre: agenda.paciente_obra_social_nombre});
    this.usuario_id = agenda.usuario_id;
    this.AgendaForm.patchValue({medico_nombre: agenda.nombreyapellido});
    this.formPaciente.patchValue({fecha_nacimiento: agenda.paciente_fecha_nacimiento});
    this.calendarioBloqueo();
  }

  actualizarFecha(event){
    console.log(event);
    this.fechaHoy = event;
    console.log(new Date(this.fechaHoy));
    this._fechaHoy = formatDate(new Date(this.fechaHoy), 'yyyy-MM-dd HH:mm', 'en');
    console.log(this.fechaHoy);
    this.loadListTurno();
  }


loadListTurno(){

 this.es_sobreturno = false;
  this._fechaHoy = formatDate(this.fechaHoy, 'yyyy-MM-dd ', 'en');
  console.log(this._fechaHoy);
 if(this._fechaHoy!=''){

    this.loading = true;
    try {
      console.log(this._fechaHoy+' 1 '+this.usuario_id);
        this.miServico.getHorarioTurnoDisponibleByUsuario(this._fechaHoy,'1',this.usuario_id)
        .subscribe(resp => {

        this.agendaTurno = resp;
            this.loading = false;
            console.log(resp);
        },
        error => { // error path
          this.loading = false;
            console.log(error.message);
            console.log(error.status);
            swal({
              toast: false,
              type: 'error',
              title: 'Algo salio mal...',
              text:error.status+' '+error.message ,
              showConfirmButton: false,
              timer: 2000
            });
         });
    } catch (error) {

      swal({
        toast: false,
        type: 'error',
        title: 'Algo salio mal...',
        text:error.status+' '+error.message ,
        showConfirmButton: false,
        timer: 2000
      });
    }
  }else{
    this.throwAlert('error','Error: '+404+'  No se selecciono una fecha','Error en la fecha', '400');

  }
}


loadListTurnoTodos(){
  this.es_sobreturno = false;
  this._fechaHoy = formatDate(this.fechaHoy, 'yyyy-MM-dd', 'en');
 if(this._fechaHoy!=''){
  let _fechaHoy = this.parse(this.fechaHoy);
 console.log(this.fechaHoy);
    this.loading = true;
    try {
        this.miServico.getAgendaByMedicoDiaTodosEstado(this._fechaHoy,'1',this.usuario_id)
        .subscribe(resp => {

        this.agendaTurno = resp;
            this.loading = false;
            console.log(resp);
        },
        error => { // error path
            console.log(error.message);
            console.log(error.status);
            swal({
              toast: false,
              type: 'error',
              title: 'Algo salio mal...',
              text:error.status+' '+error.message ,
              showConfirmButton: false,
              timer: 2000
            });
         });
    } catch (error) {
      swal({
        toast: false,
        type: 'error',
        title: 'Algo salio mal...',
        text:error.status+' '+error.message ,
        showConfirmButton: false,
        timer: 2000
      });
    }
  }else{
    this.throwAlert('error','Error: '+404+'  No se selecciono una fecha','Error en la fecha', '400');

  }
}


loadSobreTurno(){
  this.es_sobreturno = true;
  this._fechaHoy = formatDate(this.fechaHoy, 'yyyy-MM-dd', 'en');
  if(this._fechaHoy!=''){
   let _fechaHoy = this.parse(this.fechaHoy);
  console.log(this.fechaHoy);
     this.loading = true;
     try {
      this.miServico.getHorarioTurnoDisponibleByUsuarioTodos(this._fechaHoy,'1',this.usuario_id)
         .subscribe(resp => {

         this.agendaTurno = resp;
             this.loading = false;
             console.log(resp);
         },
         error => { // error path
             console.log(error.message);
             console.log(error.status);
             this.loading = false;
             swal({
              toast: false,
              type: 'error',
              title: 'Algo salio mal...',
              text:error.status+' '+error.message ,
              showConfirmButton: false,
              timer: 2000
            });
          });
     } catch (error) {
      swal({
        toast: false,
        type: 'error',
        title: 'Algo salio mal...',
        text:error.status+' '+error.message ,
        showConfirmButton: false,
        timer: 2000
      });
     }
   }else{
     this.throwAlert('error','Error: '+404+'  No se selecciono una fecha','Error en la fecha', '400');

   }
}



calendarioBloqueo(){
  let tempdatebloque;
  this._fechaHoy = formatDate(new Date(), 'yyyy-MM-dd', 'en');
 if(this._fechaHoy!=''){
  let _fechaHoy = this.parse(this.fechaHoy);
 //console.log(this.fechaHoy);
    this.loadingAccion = true;
    try {
        this.miServico.getCalendarioBloqueoByMedico(this.usuario_id,formatDate(new Date(), 'yyyy-MM-dd', 'en'))
        .subscribe(resp => {

        this.calendarioBloqueado = resp;
        console.log(this.calendarioBloqueado[0]);

        if(this.calendarioBloqueado !=null){
          if(this.calendarioBloqueado.length !=undefined){
        this.calendarioBloqueado.forEach(element => {
          let _fecha:Date = new Date(element['fecha']);
          let dateFix = new Date(_fecha.getTime() + (_fecha.getTimezoneOffset() * 60 * 1000));
          this.invalidDate = dateFix;
        this.invalidDates.push(this.invalidDate);

        });
        console.log(this.invalidDates);
            this.loadingAccion = false;
            console.log(resp);
      }
      this.loadingAccion = false;
    }
        },
        error => { // error path
            console.log(error.message);
            console.log(error.status);
            this.loading = false;
            swal({
              toast: false,
              type: 'error',
              title: 'Algo salio mal...',
              text:error.status+' '+error.message ,
              showConfirmButton: false,
              timer: 2000
            });
         });
    } catch (error) {
      swal({
        toast: false,
        type: 'error',
        title: 'Algo salio mal...',
        text:error.status+' '+error.message ,
        showConfirmButton: false,
        timer: 2000
      });
    }
  }else{
    this.throwAlert('error','Error: '+404+'  No se selecciono una fecha','Error en la fecha', '400');

  }
}


buscarUsuarioObraSocial(){

  let data:any;
  const ref = this.dialogService.open(PopupTurnoUsuarioObraSocialComponent, {
  data,
   header: 'Buscar Medico por obra social',
   width: '900px',
   height: '90%'
  });
  ref.onClose.subscribe((PopupTurnoUsuarioObraSocialComponent:MedicoObraSocial) => {
    if (PopupTurnoUsuarioObraSocialComponent) {
      this.invalidDate = null;
      this.invalidDates = [];
      console.log(PopupTurnoUsuarioObraSocialComponent);
      this.usuario_id = PopupTurnoUsuarioObraSocialComponent.usuario_id;
      this.popItemMedicoObraSocial = PopupTurnoUsuarioObraSocialComponent;
      this.AgendaForm.patchValue({medico_nombre: PopupTurnoUsuarioObraSocialComponent.apellido +' '+  PopupTurnoUsuarioObraSocialComponent.nombre});
      this.apellido = PopupTurnoUsuarioObraSocialComponent.apellido;
      this.nombre = PopupTurnoUsuarioObraSocialComponent.nombre;
      this.obra_social_nombre = PopupTurnoUsuarioObraSocialComponent.obra_social_nombre;
      this.medico_nombre = PopupTurnoUsuarioObraSocialComponent.apellido +' '+  PopupTurnoUsuarioObraSocialComponent.nombre;
      this.usuario_medico_factura_id = PopupTurnoUsuarioObraSocialComponent.usuario_id;
      this.medico_nombre_factura = PopupTurnoUsuarioObraSocialComponent.apellido +' '+  PopupTurnoUsuarioObraSocialComponent.nombre;
     // this.dni =  PopupTurnoUsuarioObraSocialComponent.;
      this.calendarioBloqueo();
    }
});

}



buscarUsuarioObraSocialFactura(){

  let data:any;
  const ref = this.dialogService.open(PopupTurnoUsuarioObraSocialComponent, {
  data,
   header: 'Buscar Medico por obra social',
   width: '900px',
   height: '90%'
  });
  ref.onClose.subscribe((PopupTurnoUsuarioObraSocialComponent:MedicoObraSocial) => {
    if (PopupTurnoUsuarioObraSocialComponent) {
      this.invalidDate = null;
      this.invalidDates = [];
      console.log(PopupTurnoUsuarioObraSocialComponent);
      this.usuario_medico_factura_id = PopupTurnoUsuarioObraSocialComponent.usuario_id;
      this.medico_nombre_factura = PopupTurnoUsuarioObraSocialComponent.apellido +' '+  PopupTurnoUsuarioObraSocialComponent.nombre;
     // this.popItemMedicoObraSocial = PopupTurnoUsuarioObraSocialComponent;
    //  this.AgendaForm.patchValue({medico_nombre: PopupTurnoUsuarioObraSocialComponent.apellido +' '+  PopupTurnoUsuarioObraSocialComponent.nombre});

    //  this.apellido = PopupTurnoUsuarioObraSocialComponent.apellido;
     // this.nombre = PopupTurnoUsuarioObraSocialComponent.nombre;
     // this.obra_social_nombre = PopupTurnoUsuarioObraSocialComponent.obra_social_nombre;
     // this.medico_nombre = PopupTurnoUsuarioObraSocialComponent.apellido +' '+  PopupTurnoUsuarioObraSocialComponent.nombre;
     // this.dni =  PopupTurnoUsuarioObraSocialComponent.;
      this.calendarioBloqueo();
    }
});

}


AgregarMotivosAtencion(){

  let data:any;
  const ref = this.dialogService.open(PopupAgendaObservacionComponent, {
  data,
   header: 'Agregar motivos de atención',
   width: '90%',
   height: '50%'
  });
  ref.onClose.subscribe((PopupAgendaObservacionComponent:any[]) => {

   if(PopupAgendaObservacionComponent){
    console.log(PopupAgendaObservacionComponent);
   this.motivoObservaciones = PopupAgendaObservacionComponent;
   }

});

}




getUsuarioMedico(){
    this.loadingAccion = true;
  try {
      this.miUserServico.getItems()
      .subscribe(resp => {
      this.usuarios = resp;
          console.log(resp);
          this.selectedMedicoEfector = resp[0]['nombreyapellido'] ;
          this.loadingAccion = false;
      },
      error => { // error path
        this.loadingAccion = false;
          console.log(error.message);
          console.log(error.status);
          swal({
            toast: false,
            type: 'error',
            title: 'Algo salio mal...',
            text:error.status+' '+error.message ,
            showConfirmButton: false,
            timer: 2000
          });
       });
  } catch (error) {
    swal({
      toast: false,
      type: 'error',
      title: 'Algo salio mal...',
      text:error.status+' '+error.message ,
      showConfirmButton: false,
      timer: 2000
    });
  }

}


loadTurno(){
 this.loadListTurno();

}

loadTurnoTodos(){
  this.loadListTurnoTodos();

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
       this.formPaciente.patchValue(PopupPacienteObrasocialComponent);
       this.formPaciente.patchValue({obra_social_nombre_adicional: PopupPacienteObrasocialComponent.obra_social_nombre});
       this.formPaciente.patchValue({obra_social_nombre_adicional_id: PopupPacienteObrasocialComponent.obra_social_id});
       this.apellido = PopupPacienteObrasocialComponent.apellido;
       this.nombre = PopupPacienteObrasocialComponent.nombre;
       this.obra_social_nombre = PopupPacienteObrasocialComponent.obra_social_nombre;
       this.dni =  PopupPacienteObrasocialComponent.dni;
       this.fecha_nacimiento =  PopupPacienteObrasocialComponent.fecha_nacimiento;

      }
  });

}

nuevoPaciente(){

  this.popItemPaciente = new Paciente('0','','','','','',new Date(),'','','','sin_correo@delavision.com.ar','','','','','86','86','0','0','','','0','','','','');
  let data:any;
  data = this.popItemPaciente;
  const ref = this.dialogService.open(PopupPacienteNuevoComponent, {
  data,
   header: 'Crear /Modificar registro',
   width: '95%',
   height: '90%'
});

ref.onClose.subscribe((PopupPacienteNuevoComponent:Paciente) => {
   if (PopupPacienteNuevoComponent) {
   console.log(PopupPacienteNuevoComponent);
        this.popItemPaciente = PopupPacienteNuevoComponent;
   if( this.nuevoItemPaciente()){
      this.throwAlert('success','Se creo el registro con éxito','','');

      this.formPaciente.patchValue(this.popItemPaciente);
      this.formPaciente.patchValue({paciente_id:this.popItemPaciente.id});
      this.formPaciente.patchValue({obra_social_nombre:this.popItemPaciente.obra_social_nombre});
     console.log( this.formPaciente.value);
      console.log(PopupPacienteObrasocialComponent);

     }
   }
});
}


editarPaciente(){
 console.log(this.popItemPaciente);
  if(this.popItemPaciente.id !== '0'){


      let data:any;
      data = this.popItemPaciente;
      const ref = this.dialogService.open(PopupPacienteNuevoComponent, {
      data,
      header: 'Crear /Modificar registro',
      width: '95%',
      height: '90%'
    });

    ref.onClose.subscribe((PopupPacienteNuevoComponent:Paciente) => {
      if (PopupPacienteNuevoComponent) {
      console.log(PopupPacienteNuevoComponent);
            this.popItemPaciente = PopupPacienteNuevoComponent;
            console.log( this.popItemPaciente);
      if( this.editarItemPaciente()){
          this.throwAlert('success','Se creo el registro con éxito','','');

          console.log(PopupPacienteObrasocialComponent);
        }
      }
    });

}else{
  this.throwAlert('warning','Debe seleccionar un paciente',  'Faltan datos','100');
}
}




nuevoItemPaciente(){
  this.loadingAccion = true;
  try {
      this.miServicoPaciente.postItem(this.popItemPaciente)
      .subscribe(resp => {
      this.elementoPaciente = resp;
      console.log(this.elementoPaciente);
      this.formPaciente.patchValue(this.elementoPaciente);
      this.popItemPaciente = this.elementoPaciente;

      this.loadingAccion = false;
      //this.loadList();
      this.resultSave = true;

      },
      error => { // error path
          console.log(error.message);
          console.log(error.status);
          swal({
            toast: false,
            type: 'error',
            title: 'Algo salio mal...',
            text:error.status+' '+error.message ,
            showConfirmButton: false,
            timer: 2000
          });
          this.resultSave = false;
          this.loadingAccion = false;
        });
  } catch (error) {
    swal({
      toast: false,
      type: 'error',
      title: 'Algo salio mal...',
      text:error.status+' '+error.message ,
      showConfirmButton: false,
      timer: 2000
    });
  }
  return this.resultSave;

}



editarItemPaciente(){
  this.loadingAccion = true;
  try {
    console.log(this.popItemPaciente);
      this.miServicoPaciente.putItem(this.popItemPaciente,this.popItemPaciente.id)
      .subscribe(resp => {
      this.elementoPaciente = resp;
      console.log(this.elementoPaciente);
      this.formPaciente.patchValue(this.elementoPaciente);

      this.loadingAccion = false;
      this.throwAlert('success','Se modificó agendo el paciente '+this.popItemPaciente.apellido,'','200');
      this.resultSave = true;
      },
      error => { // error path
          console.log(error.message);
          console.log(error.status);
          swal({
            toast: false,
            type: 'error',
            title: 'Algo salio mal...',
            text:error.status+' '+error.message ,
            showConfirmButton: false,
            timer: 2000
          });
          this.resultSave = false;
          this.loadingAccion = false;
        });
  } catch (error) {
    swal({
      toast: false,
      type: 'error',
      title: 'Algo salio mal...',
      text:error.status+' '+error.message ,
      showConfirmButton: false,
      timer: 2000
    });
  }
  return this.resultSave;

}

generarTurno(event:AgendaTurno){
  this.guardarObservacion();
  console.log(this.motivoObservaciones);
  console.log(this.popItemPaciente.id);

  let fecha = new Date(this.fechaHoy);
  console.log(fecha);
  this._fechaHoy = formatDate(fecha, 'yyyy-MM-dd', 'en');
  event.fecha_turno = this._fechaHoy;
  console.log(this._fechaHoy);

  let userData = JSON.parse(localStorage.getItem('userData'));

  if(this.motivoObservaciones.length >0){
  // verifico si es alerta
      if(this.motivoObservaciones[2]){
        event.es_alerta = 'S';
      }else{
        event.es_alerta = 'N';
      }
      // valido si se cargo alguna observacion


      if(this.motivoObservaciones[3]=== undefined){
        this.observaciones = '-';
        if(this.motivoObservaciones[0]=== 'SIN ESTUDIOS'){
          console.log(this.observaciones);
          this.observaciones = this.motivoObservaciones[1];
        }else{
          this.observaciones =this.motivoObservaciones[1]+'     '+ this.motivoObservaciones[0];
          console.log(this.observaciones);
        }

      }else{
        if(this.motivoObservaciones[0]=== 'SIN ESTUDIOS'){
      console.log(this.motivoObservaciones[0]);
          this.observaciones =this.motivoObservaciones[1]+'       '+ this.motivoObservaciones[3];
        }else{
          console.log(this.motivoObservaciones[0]);
          this.observaciones = this.motivoObservaciones[1]+'       '+this.motivoObservaciones[0]+'       '+this.motivoObservaciones[3];
        }

        console.log(this.observaciones);
      }

      if(this.motivoObservaciones[4]=== undefined){
        this.motivo_atencion = '-';
      }else{
        this.motivo_atencion = this.motivoObservaciones[4];
      }
      //this.elemento.es_observacion = this.motivo_atencion;
    }else{
      event.es_alerta = 'N';
      this.motivo_atencion = '-';
      this.observaciones = '-';

     // this.elemento.es_observacion = this.observaciones;

    }

    event.paciente_id = this.popItemPaciente.id;
  //if(this.esInvocado){
  //event.paciente_id = this.elementoPacienteInicio.paciente_id;
  //}


  // valido si la consulta proviene de un turno regular o sobreturno
  if(!!this.es_sobreturno){
    this.sobreturno = 'SI';
    event.agenda_estado_id = '6';
  }else{
    event.agenda_estado_id = '1';
    this.sobreturno = 'NO';
  }

  this.elemento = event;
  console.log(this.usuario_medico_factura_id);
  console.log(this.elemento);

 if(!!this.elemento.usuario_medico_factura_id){
  this.elemento.usuario_medico_factura_id = this.usuario_id;
 }else {
  this.elemento.usuario_medico_factura_id = this.usuario_medico_factura_id;
 }
  this.elemento.observacion = this.observaciones;
  this.elemento.es_observacion = this.motivo_atencion;
  this.elemento.usuario_id =  userData['id'];
  this.elemento.es_sobreturno =  this.sobreturno;
 console.log(event);
  if(this.elemento.paciente_id){
  let datos_validos:boolean = false;
    console.log(this.elemento);
  try {
    // valido datos del paciente y observacion
    this.loadingAccion = true;
    if(this.elemento.paciente_id !== '0'){
      datos_validos = true;
    }else{
      this.throwAlert('error','El id del paciente es 0, verifique los datos del paciente ','Datos de paciente invalidos','500');
    }
    if(this.elemento.observacion !== undefined){
      datos_validos = true;
    }else{
      this.throwAlert('warning','la observacion no fue definida correctamente, verifique los datos','Observación con datos undefined','500');
    }
    if(datos_validos){
      console.log('turno');
      console.log(this.elemento);
      // FUERZO EL DATO SI ESTA ERRONEO, MOTIVO DE UN COMPORTAMIENTO EXTRAÑO EN LA ASIGNACION DE SOBRE TURNO

      if(this.elemento.es_sobreturno === 'SI'){
        this.elemento.agenda_estado_id = '6';
      }
      if( (this.elemento.agenda_estado_id === '1')){
        this.elemento.es_sobreturno === 'NO';
      }
      console.log(this.formPaciente.value.obra_social_nombre_adicional_id);
      this.elemento.obra_social_nombre_adicional_id = this.formPaciente.value.obra_social_nombre_adicional_id;
    this.miServico.agendarTurno(this.elemento)
    .subscribe(resp => {
      this.loadingAccion = false;
      this.throwAlert('success','Se  agendo el paciente '+this.popItemPaciente.apellido+' '+this.popItemPaciente.nombre+' con el medico '+event.nombreyapellido,'','200');

      swal({
        title:'¿Dar otro turno?',
        text: '¿Desea dar otro turno para el paciente'+this.popItemPaciente.apellido+' '+this.popItemPaciente.nombre+' con el medico '+event.nombreyapellido +' ?',
        type: 'info',
        showCancelButton: true,
        confirmButtonColor: '#A5D6A7',
        cancelButtonColor: '#F9A825',
        confirmButtonText: 'Si, dar otro turno',
        cancelButtonText: 'No, buscar otro paciente'
      }).then((result) => {
        if (result.value) {
        console.log('datos conservados');
        this.calendarioBloqueado = null;
        this.popItemMedicoObraSocial = null;
        this.AgendaForm.reset();

        }else{
          // LIMPIAR DATOS
          console.log('datos limpiados');
          this.formPaciente.reset();
          this.AgendaForm.reset();
          this.DateForm.reset();
          this.invalidDate = new Date();
          this.DateForm.patchValue({fechaHoy: new Date()});
          this.agendaTurno = [];
          this.invalidDate = null;
          this.invalidDates = [];
          this.es_sobreturno = false;
          this.sobreturno = 'NO';
          this.calendarioBloqueado = null;
          this.motivoObservaciones = [];

          /***************  POR SEGURRIDAD RESETEO TODOS LOS DATOS */
          this.selectedItem = null;
          this.agendaMedico = null;
          this.elemento = null;
          this.elementoPaciente = null;
          this.elementoPacienteInicio = null;
          this.elementos= null;
          this.popItemPaciente= null;
          this.popItemMedicoObraSocial= null;
          this.usuario_id = '';
          this.paciente_id = '';
          this.observaciones = '';
          this.motivo_atencion = '';
          this.checked = false;
          this.esInvocado = false;
          this.sobreturno = '';



        }
      })


      this.loadingAccion = false;
    this.loadTurno();
    this.resultSave = true;
    },
    error => { // error path
        console.log(error.message);
        console.log(error.status);
        swal({
          toast: false,
          type: 'error',
          title: 'Algo salio mal...',
          text:error.status+' '+error.message ,
          showConfirmButton: false,
          timer: 2000
        });
        this.resultSave = false;
        this.loadingAccion = false;
      });
    }
} catch (error) {
  this.loadingAccion = false;
  swal({
    toast: false,
    type: 'error',
    title: 'Algo salio mal...',
    text:error.status+' '+error.message ,
    showConfirmButton: false,
    timer: 2000
  });
}
  }else{
    console.log(event+ 'aerrera');
    this.throwAlert('warning','Debe seleccionar un paciente',  'Faltan datos','100');
  }
return this.resultSave;

}

verComentario(){
  this.display = true;
}

colorRow(fecha:Date){
  let i:number;
  let t1:string;
  let t2:string;
 t2= this.leftPad(String(fecha['day']), 2, '0')+'/'+this.leftPad(String(fecha['month']+1), 2, '0')+'/'+this.leftPad(String(fecha['year']), 2, '0');

  for(i=0; i<this.invalidDatesCompleta.length;i++){

    t1= this.datePipe.transform(this.invalidDatesCompleta[i], 'dd/MM/yyyy');

    if( t1 ==  t2) {


    return {'es-deshabilitado'  :'null' };
    }else{
      return {'es-habilitado'  :'null' };
    }


 }
}

 leftPad(str: string, len: number, ch='.'): string {
  len = len - str.length + 1;
  return len > 0 ?
    new Array(len).join(ch) + str : str;
}

parse(value: any): string | null {
  if ((typeof value === 'string') && (value.indexOf('/') > -1)) {
    const str = value.split('/');

    const year = Number(str[2]);
    const month = Number(str[1]);
    const date = Number(str[0]);
    if(month<10){

    }
    return year+'-'+month+'-'+date;
    //return new Date(year, month, date);
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


  if(estado== 'warning'){
    swal({
        type: 'warning',
        title: 'Faltan datos',
        text: mensaje
      })
}

  if(estado== 'error'){
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
