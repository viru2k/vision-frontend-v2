import { PopupCombinadaComponent } from './popup-combinada/popup-combinada.component';
import { PracticaDistribucion } from './../../../models/practica-distribucion.model';
import { PacienteService } from 'src/app/services/paciente.service';
import { PopupObraSocialComponent } from './../../../shared/components/popups/popup-obra-social/popup-obra-social.component';
import { AgendaTurno } from './../../../models/agenda-turno.model';
import { ObraSocialService } from './../../../services/obra-social.service';
import { PopupPracticaPorcentajeComponent } from './../../../shared/components/popups/popup-practica-porcentaje/popup-practica-porcentaje.component';
import { Router } from '@angular/router';



import { PopupMedicoComponent } from './../../../shared/components/popups/popup-medico/popup-medico.component';
import { PopupPacienteNuevoComponent } from './../../paciente/popup-paciente/popup-paciente.component';
import { PopupPacienteObrasocialComponent } from './../../../shared/components/popups/popup-paciente-obrasocial/popup-paciente-obrasocial.component';
import { CirugiaCombinadaDatos } from './../../../models/cirugia-combinada-datos';
import { MedicoObraSocial } from './../../../models/medico-obrasocial.model';

import { PracticaService } from './../../../services/practica.service';

import { Component, OnInit, ɵConsole } from '@angular/core';
import { FormControl, Validators, FormGroup } from '@angular/forms';
import { DynamicDialogConfig, DynamicDialogRef, MessageService } from 'primeng/api';
import { calendarioIdioma } from '../../../config/config';
import swal from 'sweetalert2';
import { DialogService } from 'primeng/components/common/api';
import { Convenio } from './../../../models/convenio.model';

import { PopupAgendaComponent } from './../../../shared/components/popups/popup-agenda/popup-agenda.component';
import { PopupConvenioComponent } from './../../../shared/components/popups/popup-convenio/popup-convenio.component';
import { Agenda } from './../../../models/agenda.model';
import { Paciente } from '../../../models/paciente.model';
import { PracticaDistribucionRegistro } from '../../../models/practica-distribucion-registro.model';
import { PopupCombinadaLecturaComponent } from './popup-combinada-lectura/popup-combinada-lectura.component';
import { PopUpFormaPagoComponent } from '../../../shared/components/popups/popup-forma-pago/popup-forma-pago.component';
import { OperacionCobro } from '../../../models/operacion-cobro.model';
import { OperacionCobroMedico } from '../../../models/operacion-cobro-medico.model';
import { OperacionCobroPractica } from '../../../models/operacion-cobro-practica.model';
import { DatePipe, formatDate } from '@angular/common';
import { ObraSocial } from '../../../models/obra-social.model';
import { PracticaDistribucionService } from 'src/app/services/PracticaDistribucionService';
import { User } from 'src/app/models/user.model';
import { AgendaService } from '../../../services/agenda.service';

/*
*
* USUARIO NUEVO NO LO GUARDA
* NO SE ESTA ACTUALIZANDO LOS DATOS DE USUARIO
* OBRA SOCIAL ESTA LISTANDO CONVENIOS, DEBE SER OBRA SOCIAL SOLAMENTE
*/


@Component({
  selector: 'app-operacion-cobro',
  templateUrl: './operacion-cobro.component.html',
  styleUrls: ['./operacion-cobro.component.css'],
  providers: [MessageService,DialogService]
})
export class OperacionCobroComponent implements OnInit {

  usuario_id:string;
  user:User;
  resultSave:boolean;
  cols: any[];
  fecha_cobro:Date;
  newPopItem: boolean;
  es:any;
  // LOADING
  loading: boolean;
  operacionCobro:OperacionCobro;
  operacionCobroMedico:OperacionCobroMedico;
  operacionCobroPractica:OperacionCobroPractica;
  tmp_operacionCobroPractica:OperacionCobroPractica;
  operacionCobroPracticas:OperacionCobroPractica[] =[];
  popItemAgenda:AgendaTurno ;
  popItemAgendaInicio:AgendaTurno;
  popItemPaciente:Paciente;
  popItemObraSocial:ObraSocial;
  popItemCoseguro:ObraSocial;
  popItemMedicoObraSocial:MedicoObraSocial;
  popItemCirugiaCombinadaDatos:CirugiaCombinadaDatos;
  practicas:Convenio[]=[];
  DateForm:FormGroup;
  formFormaDepago:FormGroup;
  formAgenda: FormGroup;
  formMedico: FormGroup;
  formPaciente: FormGroup;
  formDatosObraSocial: FormGroup;
  formObraSocial: FormGroup;
  tmpdate:Date;
  popItem:Paciente;
  valTotalFinal:number = 0;
  valvalor:number;
  valvalorCoseguro:number;
  valCantidad:number;
  fechaHoy:Date;
  _fechaHoy:string;
  total_categoria:number = 0;
  categoria_obra_social:number = 0;
  categoria_coseguro:number = 0;
  total_coseguro:number = 0;
  total_obra_social:number= 0;
  total_honorario_obra_social:number = 0;
  total_honorario_coseguro:number =0;
  total_obra_social_coseguro:number =0;
  total_efectivo:number = 0;
  tieneCoseguro:boolean;
  tieneDistribucion:boolean;
  newItem:boolean;
  ochentaporciento:number;
  veinteporciento:number;
  medico_antiguedad:number;
  coseguro_id:string;
  observacion:string;
  practica_distribucion_total:number;
  obra_social_practica_nombre:string;
  practicaDistribucionElements:PracticaDistribucion[] =null;
  esInvocado:boolean = false; // cuando es invocada la pagina desde afuera
  operacioncobro_id:string;
  operacioncobrodistribucion:PracticaDistribucion[] = [];

  constructor(private miServico:PracticaService,private pacienteService:PacienteService,private obraSocialService:ObraSocialService,
    private practicaDistribucionService:PracticaDistribucionService,public agendaService:AgendaService,
     private messageService: MessageService ,public dialogService: DialogService,  private router: Router) {

    if(this.router.getCurrentNavigation().extras.state != undefined){
      console.log(this.router.getCurrentNavigation().extras.state.paciente);
      this.popItemAgendaInicio = this.router.getCurrentNavigation().extras.state.paciente;
      this.esInvocado = true;
    }
    this.cols = [
      { field: 'pmo_descripcion', header: 'Practica',  width: '55%' },
      {field: 'valor_facturado', header: ' $',  width: '25%' },
      {field: 'accion', header: 'Acción',  width: '20%' },
   ];
   }

  ngOnInit() {

    //INICIALIZAR OBJETOS
    this.user = JSON.parse(localStorage.getItem('userData'));
    this.usuario_id = this.user.id;
    console.log(this.user);
    this.tmpdate = new Date();

    this.popItemAgenda = new AgendaTurno('',new Date(),new Date(), new Date(), '','', '', '', '','','','','','','','','','','','','','','','','','','','','',new Date(),'','','','','', '','','','','','','','','');
    this.popItemPaciente =  new Paciente('0','','','','','',new Date(),'','','','','','','','','0','0','','','0','','','','','','');
    this.popItemObraSocial = new ObraSocial('','','','','','','','');
    this.popItemCoseguro = new ObraSocial('','','','','','','','');
    this.popItemMedicoObraSocial = new MedicoObraSocial('','','','','','', new Date(),'','','');



    this.DateForm = new FormGroup({
      'fechaHoy': new FormControl('', Validators.required),
      'medico_nombre': new FormControl('')
      });

    this.formAgenda = new FormGroup({
      'agenda': new FormControl('', Validators.required)
  });

    this.formMedico = new FormGroup({
      'apellido': new FormControl('', Validators.required),
      'nombre': new FormControl('', Validators.required),
      'cirugia_grupo_nombre': new FormControl('', Validators.required),
      'fecha_matricula': new FormControl(''),
      'medico_id': new FormControl(''),
      'usuario_id': new FormControl('')

  });

    this.formPaciente = new FormGroup({
      'nombre': new FormControl('', Validators.required),
      'apellido': new FormControl('', Validators.required),
      'dni': new FormControl('', Validators.required),
      'fecha_nacimiento': new FormControl('', Validators.required),
      'id': new FormControl('0')
  });



  this.formDatosObraSocial = new FormGroup({
    'numero_afiliado': new FormControl('', Validators.required),
    'barra_afiliado': new FormControl('', Validators.required),
    'bono_afiliado': new FormControl('', Validators.required),
  });

  this.formObraSocial = new FormGroup({
    'nombre': new FormControl('', Validators.required),
    'id': new FormControl('86'),
    'coseguro_nombre': new FormControl('Sin coseguro'),
    'coseguro_id': new FormControl('86'),
    'valor': new FormControl(0),
    'coseguro_valor': new FormControl(0),
    'pmo_descripcion': new FormControl(''),
    'codigo': new FormControl(''),
    'complejidad': new FormControl(''),
    'total_practica_coseguro': new FormControl(0),
    'total_practica': new FormControl(0),
    'es_coseguro': new FormControl(),
    'tiene_distribucion':  new FormControl()

  });

  /*** temporal */

 this.es = calendarioIdioma;
 this.fechaHoy = new Date();
 this.DateForm.patchValue({fechaHoy: this.fechaHoy});
 this.observacion = '';
 this.total_categoria = 0;
 this.total_coseguro = 0;
 this.total_obra_social = 0;
 this.total_obra_social_coseguro = 0;
 this.valTotalFinal = 0;
 this.valvalor = 0;
 this.valvalorCoseguro = 0;

if(this.esInvocado){
    // si es llamado desde la agenda del paciente busco los datos
    console.log(this.popItemAgendaInicio);
    this.cargarAgendaDesdeInicio(this.popItemAgendaInicio);
 }

  }

  actualizarFecha(event){
    console.log(event);
    this.fechaHoy = event;
    this._fechaHoy = formatDate(new Date(this.fechaHoy), 'yyyy-MM-dd HH:mm', 'es-AR');
    console.log(new Date(this.fechaHoy));
  }




  buscarDistribucion(event){
    console.log(event);
    let data:any;
    console.log(this.tmp_operacionCobroPractica);
    data = event;//this.tmp_operacionCobroPractica;
    const ref = this.dialogService.open(PopupCombinadaLecturaComponent, {
    data,
     header: 'Detalle de practica',
     width: '98%',
     height: '90%'
    });

    ref.onClose.subscribe((PopupMedicoComponent:MedicoObraSocial) => {

    });
  }



  buscarMedico(){

    let data:any;
    const ref = this.dialogService.open(PopupMedicoComponent, {
    data,
     header: 'Buscar médico a facturar',
     width: '98%',
     height: '90%'
    });

    ref.onClose.subscribe((PopupMedicoComponent:MedicoObraSocial) => {
        if (PopupMedicoComponent) {
          console.log(PopupMedicoComponent);
          this.popItemMedicoObraSocial.apellido = PopupMedicoComponent.apellido +' '+ PopupMedicoComponent.nombre;
          this.popItemMedicoObraSocial.medico_id = PopupMedicoComponent.medico_id;
         console.log(PopupMedicoComponent.usuario_id) ;
       //   this.popItemAgenda = PopupAgendaComponent;
          this.formMedico.patchValue(this.popItemMedicoObraSocial);
          this.formMedico.patchValue({usuario_id: PopupMedicoComponent.usuario_id })
          this.medico_antiguedad =(new Date()).getFullYear() - (new Date(PopupMedicoComponent.fecha_matricula)).getFullYear();
         console.log(  this.medico_antiguedad);
         this.operacionCobroMedico = new OperacionCobroMedico('0','0',PopupMedicoComponent.usuario_id,'0');

        }
    });
  }


  cargarAgendaDesdeInicio(PopupAgendaComponent:AgendaTurno){

    console.log(PopupAgendaComponent);
    console.log(PopupAgendaComponent.fecha_matricula);
    this.popItemAgenda = PopupAgendaComponent;
    this.formPaciente.patchValue({id: PopupAgendaComponent.paciente_id});
    this.formPaciente.patchValue({dni: PopupAgendaComponent.paciente_dni});
    this.formPaciente.patchValue({apellido: PopupAgendaComponent.paciente_apellido});
    this.formPaciente.patchValue({nombre: PopupAgendaComponent.paciente_nombre});
    this.formPaciente.patchValue({fecha_nacimiento: PopupAgendaComponent.paciente_fecha_nacimiento});
    this.formObraSocial.patchValue({coseguro_id: PopupAgendaComponent.paciente_coseguro_id});
    this.formObraSocial.patchValue({es_coseguro: PopupAgendaComponent.coseguro_es_coseguro});
    this.formObraSocial.patchValue({tiene_distribucion: PopupAgendaComponent.tiene_distribucion});
    this.formObraSocial.patchValue({id: PopupAgendaComponent.paciente_obra_social_id});
    this.formObraSocial.patchValue({nombre: PopupAgendaComponent.paciente_obra_social_nombre});
    this.formObraSocial.patchValue({coseguro_id: PopupAgendaComponent.paciente_coseguro_id});
    this.formObraSocial.patchValue({coseguro_nombre: PopupAgendaComponent.paciente_coseguro_nombre});
    this.formDatosObraSocial.patchValue({numero_afiliado: PopupAgendaComponent.numero_afiliado});
    this.formDatosObraSocial.patchValue({barra_afiliado: PopupAgendaComponent.barra_afiliado});
/** FALTA COMPLETAR DATOS DEL MEDICO PARA PODER REALIZAR OPERACION DE COBRO, EL FORMULARIO SOLO POSEE NOMBRE, SIN ID NI USUARIO ID */
    this.formMedico.patchValue({apellido: PopupAgendaComponent.nombreyapellido});
    this.formMedico.patchValue({usuario_id: PopupAgendaComponent.usuario_id});
    this.formMedico.patchValue({fecha_matricula: PopupAgendaComponent.fecha_matricula});
    this.medico_antiguedad =(new Date()).getFullYear() - (new Date(this.formMedico.value.fecha_matricula)).getFullYear();
    console.log(this.medico_antiguedad) ;
    this.popItemCoseguro.id = PopupAgendaComponent.paciente_coseguro_id;
    this.popItemCoseguro.es_coseguro = PopupAgendaComponent.coseguro_es_coseguro;
    this.popItemCoseguro.tiene_distribucion = PopupAgendaComponent.tiene_distribucion;
    this.popItemCoseguro.nombre = PopupAgendaComponent.paciente_coseguro_nombre;
    this.popItemAgenda = this.formAgenda.value;
    this.popItemPaciente = this.formPaciente.value;
    this.popItemObraSocial = this.formObraSocial.value;
    console.log(this.formObraSocial.value.tiene_distribucion);
    console.log(this.formMedico.value);
    // CARGO LOS DATOS DE LA OPERACION DE COBRO
    this.operacionCobroMedico = new OperacionCobroMedico('0','0',this.formMedico.value.usuario_id,'0');
    if(this.formObraSocial.value.tiene_distribucion == 'S'){
      this.tieneDistribucion = true;
    }else{
      this.tieneDistribucion = false;
    }

    /************VALIDO SI EL MEDICO ES ESTUDIOS*********** */
    console.log(PopupAgendaComponent);
    if(PopupAgendaComponent.usuario_id !== PopupAgendaComponent.usuario_medico_factura_id){
      swal({
        title:  'Diferencia en medicos a facturar',
        text: 'El médico  del turno ' +PopupAgendaComponent.nombreyapellido+ ' es distinto al que se va a realizar la O.C que es : ' + PopupAgendaComponent['nombreyapellido_factura'],
        type: 'info',
        showCancelButton: true,
        confirmButtonColor: '#E64A19',
            cancelButtonColor: '#0288D1',
            confirmButtonText: 'Cambiar de medico',
            cancelButtonText: 'Proseguir'
      }).then((result) => {
        if (result.value) {
          console.log('datos cambiados');
        this.buscarMedico();
        this.CrearEditarPaciente();
        }else{
          console.log('datos conservados');

          console.log(PopupMedicoComponent);
          this.popItemMedicoObraSocial.apellido = PopupAgendaComponent['nombreyapellido_factura'];
          this.popItemMedicoObraSocial.medico_id =  PopupAgendaComponent['usuario_medico_factura_id'];
          this.medico_antiguedad =(new Date()).getFullYear() - (new Date(PopupAgendaComponent['fecha_matricula_factura'])).getFullYear();
         console.log( 'antiguedad calculada '+ this.medico_antiguedad);
         this.operacionCobroMedico = new OperacionCobroMedico('0','0',PopupAgendaComponent['usuario_medico_factura_id'],'0')
          this.formMedico.patchValue({apellido: PopupAgendaComponent['nombreyapellido_factura']});
          this.formMedico.patchValue({usuario_id: PopupAgendaComponent['usuario_medico_factura_id']});
          this.formMedico.patchValue({fecha_matricula: PopupAgendaComponent['fecha_matricula_factura']});
          console.log('DISTINTO MEDICO');

          this.CrearEditarPaciente();


        }
      })

    }else{
      this.CrearEditarPaciente();
    }




  }


  buscarAgenda(){
    let data:any;
    const ref = this.dialogService.open(PopupAgendaComponent, {
    data,
     header: 'Buscar registro en agenda',
     width: '98%',
     height: '90%'
    });

    ref.onClose.subscribe((PopupAgendaComponent:AgendaTurno) => {

        if (PopupAgendaComponent) {
          console.log(PopupAgendaComponent);
          console.log(PopupAgendaComponent.fecha_matricula);
          this.popItemAgenda = PopupAgendaComponent;
          this.formPaciente.patchValue({id: PopupAgendaComponent.paciente_id});
          this.formPaciente.patchValue({dni: PopupAgendaComponent.paciente_dni});
          this.formPaciente.patchValue({apellido: PopupAgendaComponent.paciente_apellido});
          this.formPaciente.patchValue({nombre: PopupAgendaComponent.paciente_nombre});
          this.formPaciente.patchValue({fecha_nacimiento: PopupAgendaComponent.paciente_fecha_nacimiento});
          this.formObraSocial.patchValue({coseguro_id: PopupAgendaComponent.paciente_coseguro_id});
          this.formObraSocial.patchValue({es_coseguro: PopupAgendaComponent.coseguro_es_coseguro});
          this.formObraSocial.patchValue({tiene_distribucion: PopupAgendaComponent.tiene_distribucion});
          this.formObraSocial.patchValue({id: PopupAgendaComponent.paciente_obra_social_id});
          this.formObraSocial.patchValue({nombre: PopupAgendaComponent.paciente_obra_social_nombre});
          this.formObraSocial.patchValue({coseguro_id: PopupAgendaComponent.paciente_coseguro_id});
          this.formObraSocial.patchValue({coseguro_nombre: PopupAgendaComponent.paciente_coseguro_nombre});
          this.formDatosObraSocial.patchValue({numero_afiliado: PopupAgendaComponent.numero_afiliado});
          this.formDatosObraSocial.patchValue({barra_afiliado: PopupAgendaComponent.barra_afiliado});
/** FALTA COMPLETAR DATOS DEL MEDICO PARA PODER REALIZAR OPERACION DE COBRO, EL FORMULARIO SOLO POSEE NOMBRE, SIN ID NI USUARIO ID */
          this.formMedico.patchValue({apellido: PopupAgendaComponent.nombreyapellido});
          this.formMedico.patchValue({usuario_id: PopupAgendaComponent.usuario_id});
          this.formMedico.patchValue({fecha_matricula: PopupAgendaComponent.fecha_matricula});
          this.medico_antiguedad =(new Date()).getFullYear() - (new Date(this.formMedico.value.fecha_matricula)).getFullYear();
          console.log(this.medico_antiguedad) ;
          this.popItemCoseguro.id = PopupAgendaComponent.paciente_coseguro_id;
          this.popItemCoseguro.es_coseguro = PopupAgendaComponent.coseguro_es_coseguro;
          this.popItemCoseguro.tiene_distribucion = PopupAgendaComponent.tiene_distribucion;
          this.popItemCoseguro.nombre = PopupAgendaComponent.paciente_coseguro_nombre;
          this.popItemAgenda = this.formAgenda.value;
          this.popItemPaciente = this.formPaciente.value;
          this.popItemObraSocial = this.formObraSocial.value;
          console.log(this.formObraSocial.value.tiene_distribucion);
          console.log(this.formMedico.value);
          // CARGO LOS DATOS DE LA OPERACION DE COBRO
          this.operacionCobroMedico = new OperacionCobroMedico('0','0',this.formMedico.value.usuario_id,'0');
          if(this.formObraSocial.value.tiene_distribucion == 'S'){
            this.tieneDistribucion = true;
          }else{
            this.tieneDistribucion = false;
          }
        }

        if(PopupAgendaComponent.nombreyapellido === 'ESTUDIOS'){
          swal({
            title:'El médico es estudios',
            text: '¿Desea proseguir con este médico?',
            type: 'info',
            showCancelButton: true,
            confirmButtonColor: '#0288D1',
            cancelButtonColor: '#E64A19',
            confirmButtonText: 'Cambiar de medico',
            cancelButtonText: 'Proseguir'
          }).then((result) => {
            if (result.value) {
            console.log('datos conservados');
            this.buscarMedico();
            this.CrearEditarPaciente();
            }
          })

        }else{
          this.CrearEditarPaciente();
        }
    });

  }



  buscarPaciente(){
    let data:any;
    const ref = this.dialogService.open(PopupPacienteObrasocialComponent, {
    data,
     header: 'Buscar paciente',
     width: '98%',
     height: '90%'
    });

    ref.onClose.subscribe((PopupPacienteObrasocialComponent:Paciente) => {
        if (PopupPacienteObrasocialComponent) {
          if( this.popItemPaciente.es_habilitada =='N'){
            this.throwAlert('warning','error','Obra social deshabilitada','100');
          }

          console.log(PopupPacienteObrasocialComponent);
         this.popItemPaciente.nombre = PopupPacienteObrasocialComponent.nombre;
         this.popItemPaciente.apellido = PopupPacienteObrasocialComponent.apellido;
         this.popItemPaciente.dni = PopupPacienteObrasocialComponent.dni;
         this.popItemPaciente.fecha_nacimiento = PopupPacienteObrasocialComponent.fecha_nacimiento;
         this.popItemPaciente.domicilio = PopupPacienteObrasocialComponent.domicilio;
         this.popItemPaciente.es_coseguro = PopupPacienteObrasocialComponent.es_coseguro;
         this.popItemPaciente.tiene_distribucion = PopupPacienteObrasocialComponent.tiene_distribucion;
         this.popItemPaciente.coseguro_tiene_distribucion = PopupPacienteObrasocialComponent.coseguro_tiene_distribucion;
         this.popItemPaciente.coseguro_es_coseguro = PopupPacienteObrasocialComponent.coseguro_es_coseguro;
         this.popItemPaciente.id = PopupPacienteObrasocialComponent.id
         this.popItemObraSocial.nombre =  PopupPacienteObrasocialComponent.obra_social_nombre;
         this.popItemObraSocial.id =  PopupPacienteObrasocialComponent.id;
         this.popItemObraSocial.es_coseguro =  PopupPacienteObrasocialComponent.es_coseguro;
         this.popItemCoseguro.nombre =  PopupPacienteObrasocialComponent.coseguro_nombre;
         this.popItemCoseguro.id =  PopupPacienteObrasocialComponent.coseguro_id;
         this.popItemCoseguro.es_coseguro =  PopupPacienteObrasocialComponent.coseguro_es_coseguro;
          this.formPaciente.patchValue(this.popItemPaciente);

          this.formObraSocial.patchValue({id: PopupPacienteObrasocialComponent.obra_social_id}) ;
          this.formObraSocial.patchValue({nombre: PopupPacienteObrasocialComponent.obra_social_nombre}) ;
          this.formObraSocial.patchValue({coseguro_nombre: PopupPacienteObrasocialComponent.coseguro_nombre}) ;
          this.formObraSocial.patchValue({coseguro_id: PopupPacienteObrasocialComponent.coseguro_id}) ;
          this.formObraSocial.patchValue({obra_social_id_id: PopupPacienteObrasocialComponent.obra_social_id}) ;
          this.formDatosObraSocial.patchValue({barra_afiliado: PopupPacienteObrasocialComponent.barra_afiliado}) ;
          this.formDatosObraSocial.patchValue({numero_afiliado: PopupPacienteObrasocialComponent.numero_afiliado}) ;

        //  VERIFICO EL ESTADO DE LA OBRA SOCIAL
        if(PopupPacienteObrasocialComponent.tiene_distribucion == 'S'){
          this.tieneDistribucion = true;
        }else{
          this.tieneDistribucion = false;
        }
        }
    });
  }

  buscarObraSocial(){
    let data:any;
    const ref = this.dialogService.open(PopupObraSocialComponent, {
    data,
     header: 'Buscar obra social',
     width: '98%',
     height: '90%'
    });

    ref.onClose.subscribe((PopupObraSocialComponent:ObraSocial) => {
        if (PopupObraSocialComponent) {
          console.log(PopupObraSocialComponent);
          this.popItemObraSocial = PopupObraSocialComponent;

          this.formObraSocial.patchValue({id: this.popItemObraSocial.id});
          this.formObraSocial.patchValue({nombre: this.popItemObraSocial.nombre});

        }
    });

  }

  buscarObraSocialCoseguro(){
    let data:any;
    const ref = this.dialogService.open(PopupObraSocialComponent, {
      data,
       header: 'Buscar Coseguro',
       width: '98%',
       height: '90%'
      });

      ref.onClose.subscribe((PopupObraSocialComponent:ObraSocial) => {
          if (PopupObraSocialComponent) {
            console.log(PopupObraSocialComponent);
            this.popItemCoseguro = PopupObraSocialComponent;
            this.popItemObraSocial['coseguro_id'] = PopupObraSocialComponent.id;
            this.formObraSocial.patchValue({coseguro_id: this.popItemCoseguro.id});
            this.formObraSocial.patchValue({coseguro_nombre: this.popItemCoseguro.nombre});

          }
      });
  }


  CrearEditarPaciente(){
    // si el no se selecciono un paciente y por error se trata
    if(this.formPaciente.value.id == '0'){
      this.throwAlert('warning','No se puede editar sin seleccionar un paciente',  'Debe seleccionar un paciente previamente','404');
    }else{
      this.ObtenerPaciente();
    }
  }

  editarPaciente(){


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
      /*  this.popItemPaciente.nombre = PopupPacienteNuevoComponent.nombre;
       this.popItemPaciente.apellido = PopupPacienteNuevoComponent.apellido;
       this.popItemPaciente.dni = PopupPacienteNuevoComponent.dni;
       this.popItemPaciente.fecha_nacimiento = PopupPacienteNuevoComponent.fecha_nacimiento;
       this.popItemPaciente.domicilio = PopupPacienteNuevoComponent.domicilio;   */
       this.popItemObraSocial.nombre =  PopupPacienteNuevoComponent.obra_social_nombre;
       this.popItemObraSocial.es_coseguro =  PopupPacienteNuevoComponent.es_coseguro;
       this.popItemObraSocial.id =  PopupPacienteNuevoComponent.obra_social_id;
       this.popItemCoseguro.nombre =  PopupPacienteNuevoComponent.coseguro_nombre;
       this.popItemCoseguro.id =  PopupPacienteNuevoComponent.coseguro_id;
        this.formPaciente.patchValue(this.popItemPaciente);

        this.formObraSocial.patchValue({id: PopupPacienteNuevoComponent.obra_social_id}) ;
        this.formObraSocial.patchValue({nombre: PopupPacienteNuevoComponent.obra_social_nombre}) ;
        this.formObraSocial.patchValue({coseguro_nombre: PopupPacienteNuevoComponent.coseguro_nombre}) ;
        this.formObraSocial.patchValue({coseguro_id: PopupPacienteNuevoComponent.coseguro_id}) ;
        this.formDatosObraSocial.patchValue({barra_afiliado: PopupPacienteNuevoComponent.barra_afiliado}) ;
        this.formDatosObraSocial.patchValue({numero_afiliado: PopupPacienteNuevoComponent.numero_afiliado}) ;
        if( this.nuevoPaciente()){
          this.throwAlert('success','Se modificó el registro con éxito','','');
         } else{
          this.throwAlert('error','No se pudo crear el cliente','','');
         }
      }

    });

  }

  nuevoPaciente(){

    try {
      console.log(this.formPaciente.value);
      console.log(this.popItemPaciente);
    //  console.log(this.popItem.id);
      this.pacienteService.putItem(this.popItemPaciente, this.formPaciente.value.id)
      .subscribe(resp => {

      console.log(resp);
      this.loading = false;
     // this.loadList();
      this.resultSave = true;
      },
      error => { // error path
          console.log(error.message);
     //     console.log(error.status);
          this.throwAlert('error','Error: '+error.status,'  Error al insertar los registros',error.status);
          this.resultSave = false;
});
  } catch (error) {
      this.throwAlert('error','Error al cargar los registros',error,error.status);
  }
  return this.resultSave;



}


ObtenerPaciente(){

  try {
    console.log(this.formPaciente.value.id);
  //  console.log(this.popItem.id);
    this.pacienteService.getItem(this.formPaciente.value.id)
    .subscribe(resp => {

    console.log(resp[0]);
    this.loading = false;
    this.popItemPaciente = resp[0];
    this.popItemObraSocial.es_coseguro = this.popItemPaciente.es_coseguro;
    this.popItemCoseguro.es_coseguro = this.popItemPaciente.coseguro_es_coseguro;
    this.editarPaciente();
    this.resultSave = true;
    },
    error => { // error path
        console.log(error.message);
   //     console.log(error.status);
        this.throwAlert('error','Error: '+error.status,'  Error al insertar los registros',error.status);
        this.resultSave = false;
});
} catch (error) {
    this.throwAlert('error','Error al cargar los registros',error,error.status);
}
return this.resultSave;



}





agregarPractica(){

  let data:any;
  console.log(this.popItemPaciente);
  console.log(this.popItemObraSocial);
  if(this.popItemPaciente.dni!=''){
    data = this.popItemObraSocial;

    console.log(data);

  const ref = this.dialogService.open(PopupPracticaPorcentajeComponent, {
  data,
   header: 'Cargar practica',
   width: '98%',
   height: '90%'
  });

   ref.onClose.subscribe((PopupPracticaPorcentajeComponent:OperacionCobroPractica) => {
       if (PopupPracticaPorcentajeComponent) {

         console.log(PopupPracticaPorcentajeComponent);

         //VERIFICO DATOS DE COSEGURO SELECCIONADS EN LA VISTA ( NO PROVIENEN DE LA VENTANA EMERGENTE DE CARGAR REGISTRO )
         // SI ES COSEGURO O COSEGURO PARTICULAR Y NO PARTICULAR
         if((this.formObraSocial.value.coseguro_id !='86') &&(this.popItemCoseguro.es_coseguro =='S')){


           // SI ES PRACTICA NIVEL UNO NO CALCULA DISTRIBUCION NI CATEGORIZACION
           if(PopupPracticaPorcentajeComponent.pmo_nivel !='1'){
           this.tmp_operacionCobroPractica = PopupPracticaPorcentajeComponent;
            console.log('VALIDACION DEL REGISTRO SI TIENE DISTRIBUCION');
            console.log(this.popItemObraSocial);
            console.log(PopupPracticaPorcentajeComponent);
          if(PopupPracticaPorcentajeComponent.tiene_distribucion =='S'){
            // OBTENGO LA DISTRIBUCION PARA SUMAR EL TOTAL DE HONORARIOS DE LA LISTA OBTENIDA
            console.log('PRACTICA CON DISTRIBUCION DISTRIBUCION');
            this.cargarDistribucion(PopupPracticaPorcentajeComponent.convenio_os_pmo_id,PopupPracticaPorcentajeComponent);
          }

          console.log(PopupPracticaPorcentajeComponent);
          // this.obtenerCodigoCoseguro(this.popItemCoseguro.id,PopupPracticaPorcentajeComponent.pmo_id); --> movido a cargar distribuccion
        }

        this.total_obra_social_coseguro = this.total_obra_social + this.total_coseguro;
        this.valTotalFinal = this.total_obra_social+ this.total_coseguro+ this.total_categoria; //--> movido a cargar distribuccion
        }

        if((PopupPracticaPorcentajeComponent.obra_social_id =='99') &&(PopupPracticaPorcentajeComponent.es_coseguro =='S')){



           console.log('PRACTICA QUE ES COSEGURO');
           this.operacionCobroPractica = new OperacionCobroPractica(PopupPracticaPorcentajeComponent.id,PopupPracticaPorcentajeComponent.convenio_os_pmo_id,PopupPracticaPorcentajeComponent.obra_social_nombre+' - '+PopupPracticaPorcentajeComponent.pmo_descripcion,PopupPracticaPorcentajeComponent.obra_social_nombre,
           PopupPracticaPorcentajeComponent.obra_social_id,Number(PopupPracticaPorcentajeComponent.valor_original), PopupPracticaPorcentajeComponent.valor_facturado,PopupPracticaPorcentajeComponent.operacion_cobro_id,PopupPracticaPorcentajeComponent.observacion, PopupPracticaPorcentajeComponent.pmo_id,
            PopupPracticaPorcentajeComponent.pmo_nivel,this.categoria_obra_social,PopupPracticaPorcentajeComponent.cantidad, PopupPracticaPorcentajeComponent.es_coseguro,PopupPracticaPorcentajeComponent.tiene_distribucion,this.total_honorario_obra_social,this.total_honorario_coseguro,PopupPracticaPorcentajeComponent.forma_pago,this.usuario_id,'P',PopupPracticaPorcentajeComponent.usuario_cobro_nombre, 'NO', '-','','NO','A','0','');

            this.operacionCobroPracticas.push(this.operacionCobroPractica);
            console.log(this.operacionCobroPractica);
            //si es solo coseguro particular lo coloco en particulares
            if(this.operacionCobroPractica.obra_social_id == '99'){
              console.log(this.operacionCobroPractica.obra_social_id );
              if((this.operacionCobroPractica.forma_pago === 'EFECTIVO')||(this.operacionCobroPractica.forma_pago === 'TARJETA - CREDITO')||(this.operacionCobroPractica.forma_pago === 'TARJETA - DEBITO'))
              this.tmp_operacionCobroPractica.forma_pago =PopupPracticaPorcentajeComponent.forma_pago;
              this.total_efectivo =  this.total_efectivo +Number(PopupPracticaPorcentajeComponent.valor_facturado);
            }
            this.total_obra_social_coseguro = this.total_obra_social + this.total_coseguro;
           this.total_obra_social =  this.total_obra_social + PopupPracticaPorcentajeComponent.valor_facturado;
           //this.valTotalFinal = this.total_obra_social+ this.total_coseguro+ this.total_categoria;
          this.sumarTotales(this.total_obra_social,this.total_coseguro,this.total_categoria);

       }


        console.log(this.popItemObraSocial);
        console.log(this.popItemCoseguro);

        // PRACTICAS QUE NO SON PROVINCIA
          console.log('PRACTICA PORCENTAJE '+ PopupPracticaPorcentajeComponent);

        if((PopupPracticaPorcentajeComponent.es_coseguro =='N')&&(PopupPracticaPorcentajeComponent.tiene_distribucion=='N')){


          this.operacionCobroPractica = new OperacionCobroPractica(PopupPracticaPorcentajeComponent.id,PopupPracticaPorcentajeComponent.convenio_os_pmo_id,PopupPracticaPorcentajeComponent.obra_social_nombre+' - '+PopupPracticaPorcentajeComponent.pmo_descripcion,PopupPracticaPorcentajeComponent.obra_social_nombre,
          PopupPracticaPorcentajeComponent.obra_social_id,Number(PopupPracticaPorcentajeComponent.valor_original), PopupPracticaPorcentajeComponent.valor_facturado,PopupPracticaPorcentajeComponent.operacion_cobro_id,PopupPracticaPorcentajeComponent.observacion, PopupPracticaPorcentajeComponent.pmo_id,
           PopupPracticaPorcentajeComponent.pmo_nivel,this.categoria_obra_social,PopupPracticaPorcentajeComponent.cantidad, PopupPracticaPorcentajeComponent.es_coseguro,PopupPracticaPorcentajeComponent.tiene_distribucion,this.total_honorario_obra_social,this.total_honorario_coseguro,PopupPracticaPorcentajeComponent.forma_pago,this.usuario_id,'P',PopupPracticaPorcentajeComponent.usuario_cobro_nombre, 'NO', '-','','NO','A','0','');

           this.operacionCobroPracticas.push(this.operacionCobroPractica);
           console.log(this.operacionCobroPractica);
           if((this.operacionCobroPractica.obra_social_id =='86')||(this.operacionCobroPractica.obra_social_id =='99')){
            //si es particular y paga con una forma no trasnferencia lo calculo
            if(PopupPracticaPorcentajeComponent.forma_pago !='TRANSFERENCIA'){
              this.total_efectivo = this.total_efectivo+ PopupPracticaPorcentajeComponent.valor_facturado;
            }
          }else{
            this.total_obra_social =  this.total_obra_social + PopupPracticaPorcentajeComponent.valor_facturado;
          }
           this.total_obra_social_coseguro = this.total_obra_social + this.total_coseguro;

          //this.valTotalFinal = this.total_obra_social+ this.total_coseguro+ this.total_categoria;
         this.sumarTotales(this.total_obra_social,this.total_coseguro,this.total_categoria);


        }


          //PRACTICAS QUE SON DE PROVINCIA

        if((PopupPracticaPorcentajeComponent.es_coseguro =='N')&&(PopupPracticaPorcentajeComponent.tiene_distribucion=='S')){

         console.log('CATEGORIA');
         console.log(this.categoria_obra_social);
          this.operacionCobroPractica = new OperacionCobroPractica(PopupPracticaPorcentajeComponent.id,PopupPracticaPorcentajeComponent.convenio_os_pmo_id,PopupPracticaPorcentajeComponent.obra_social_nombre+' - '+PopupPracticaPorcentajeComponent.pmo_descripcion,PopupPracticaPorcentajeComponent.obra_social_nombre,
          PopupPracticaPorcentajeComponent.obra_social_id,Number(PopupPracticaPorcentajeComponent.valor_original), PopupPracticaPorcentajeComponent.valor_facturado,PopupPracticaPorcentajeComponent.operacion_cobro_id,PopupPracticaPorcentajeComponent.observacion, PopupPracticaPorcentajeComponent.pmo_id,
           PopupPracticaPorcentajeComponent.pmo_nivel,this.categoria_obra_social ,PopupPracticaPorcentajeComponent.cantidad, PopupPracticaPorcentajeComponent.es_coseguro,PopupPracticaPorcentajeComponent.tiene_distribucion,this.total_honorario_obra_social,this.total_honorario_coseguro,PopupPracticaPorcentajeComponent.forma_pago,this.usuario_id,'P',PopupPracticaPorcentajeComponent.usuario_cobro_nombre, 'NO', '-','','NO','A','0','');

           this.operacionCobroPracticas.push(this.operacionCobroPractica);
           console.log(this.operacionCobroPractica);
           this.total_obra_social_coseguro = this.total_obra_social + this.total_coseguro;
          this.total_obra_social =  this.total_obra_social + PopupPracticaPorcentajeComponent.valor_facturado;
          //this.valTotalFinal = this.total_obra_social+ this.total_coseguro+ this.total_categoria;
         this.sumarTotales(this.total_obra_social,this.total_coseguro,this.total_categoria);


        }
       }
   });
  }else{
this.throwAlert('warning','error','  Error al cargar los registros','99');
}
}






  // CALCULO LA DISTRIBUCION DE LAS PRACTICAS
   cargarDistribucion(id:string, PopupPracticaPorcentajeComponent:OperacionCobroPractica){

    try {
      console.log('CARGANDO DISTRIBUCION');
      console.log('id de distribucion '+id);
      // DEBE EXISTIR DISTRIBUCION PARA REALIZAR CORRECTAMENTE EL CALCULO
        this.practicaDistribucionService.getItems(id)
        .subscribe(resp => {
      // CUANDO TENGO EL RESULTADO SUMO SOBRE LA VARIABLE QUE SE LLAMA HONORARIOS
      console.log(resp);
        this.loading = false;
        try {
          resp.forEach(element => {
            this.operacioncobrodistribucion.push(element);
            });
        } catch (error) {

        }

        console.log(  this.operacioncobrodistribucion);
        console.log(resp.length);
        if(resp.length === undefined){
      // si el registro no tiene valores
      console.log('practica pmo  '+  this.tmp_operacionCobroPractica.pmo_nivel);
      let pmo_nivel = Number(this.tmp_operacionCobroPractica.pmo_nivel);
          console.log('sin asociacion para buscar honorarios');
          if(pmo_nivel=== 2){
            console.log('pmo id '+this.popItemCoseguro.id,PopupPracticaPorcentajeComponent.pmo_id);
          this.obtenerCodigoCoseguro(this.popItemCoseguro.id,PopupPracticaPorcentajeComponent.pmo_id);
          }
          if(pmo_nivel=== 4){
            console.log('pmo id '+this.popItemCoseguro.id,PopupPracticaPorcentajeComponent.pmo_id);
          this.obtenerCodigoCoseguro(this.popItemCoseguro.id,PopupPracticaPorcentajeComponent.pmo_id);
          }
      }else{
        this.practicaDistribucionElements = resp;
        this.obtenerCodigoCoseguro(this.popItemCoseguro.id,PopupPracticaPorcentajeComponent.pmo_id);  // agregados

      }
        this.resultSave = true;
        },
        error => { // error path
            console.log(error.message);
            console.log(error.status);
            this.throwAlert('error','Error: '+error.status,  'Error al cargar los registros',error.status);
            this.resultSave = false;
          });
    } catch (error) {
        this.throwAlert('error','Error al cargar los registros',error,error.status);
    }

    return this.resultSave;

}

async obtenerCodigoCoseguro(obra_social_id:string, pmo_id:string){

  let es_habilitada:string;
  try {
    console.log('OBTENCION DE CODIGO DE COSEGURO');
  //console.log(obra_social_id+' '+pmo_id) ;
      this.obraSocialService.getObraSocialByIdAndPmo(obra_social_id, pmo_id)
      .subscribe(resp => {
    // CUANDO TENGO EL RESULTADO SUMO SOBRE LA VARIABLE QUE SE LLAMA HONORARIOS
      this.loading = false;
      try {
        console.log(resp);
        es_habilitada = resp[0]['es_habilitado'];
        console.log(es_habilitada);
      } catch (error) {

      }

       if(this.practicaDistribucionElements !=null){

        this.practicaDistribucionElements.forEach(element => {
        //  console.log(element['practica_distribucion_total']);
          this.obra_social_practica_nombre = element['obra_social_practica_nombre'];
          this.practica_distribucion_total =  element['practica_distribucion_total'];

          if(this.obra_social_practica_nombre== 'HONORARIOS'){
            console.log('PRACTICA TOTAL HONORARIOS '+this.practica_distribucion_total);

            // obtengo los honorarios
          //  console.log(this.practica_distribucion_total);
            this.categoria_obra_social =this.categoria_obra_social  +this.calcularCategoria(  this.practica_distribucion_total ,0);
        //    this.categoria_obra_social =this.calcularCategoria(  this.practica_distribucion_total ,0);
          //  this.categoria_obra_social =  this.categoria_obra_social +this.calcularCategoria(  this.practica_distribucion_total ,0);
            console.log(this.total_honorario_obra_social );
            this.total_honorario_obra_social = this.calcularCategoria(  this.practica_distribucion_total ,0);
            console.log('categoria obra socia : '+this.categoria_obra_social );
            console.log('horonario obra socia : '+this.total_honorario_obra_social );

          console.log('TOTAL HONORARIO OBRA SOCIAL '+this.total_honorario_obra_social);
            this.categoria_coseguro =  this.categoria_coseguro +this.calcularCategoria( 0,this.cargarCoseguroRegistro( this.practica_distribucion_total ));
            this.total_honorario_coseguro = this.calcularCategoria( 0,this.cargarCoseguroRegistro( this.practica_distribucion_total ));
            console.log('categoria coseguro : '+this.categoria_coseguro );
            console.log('horonario coseguro : '+this.total_honorario_coseguro );
            console.log('suma de categoria obra social: coseguro'+this.categoria_coseguro +' obra social'+ this.categoria_obra_social);
            this.total_categoria = this.categoria_obra_social +  this.categoria_coseguro ;
          // CALCULO EL TOTAL A MOSTRAR
          this.total_obra_social_coseguro = this.total_obra_social + this.total_coseguro;
          this.sumarTotales(this.total_obra_social,this.total_coseguro,this.total_categoria);
          //this.valTotalFinal = this.total_obra_social+ this.total_coseguro+ this.total_categoria;

          console.log('SUMA DE CATEGORIA OBRA SOCIAL: coseguro: '+this.categoria_coseguro +' obra social: '+ this.categoria_obra_social +' total: '+this.total_categoria);

            console.log( this.practica_distribucion_total );
          }

        });
        this.total_obra_social_coseguro = this.total_obra_social + this.total_coseguro;
      //  this.valTotalFinal = this.total_obra_social+ this.total_coseguro+ this.total_categoria; //agregados
        this.sumarTotales(this.total_obra_social,this.total_coseguro,this.total_categoria);

    }else{
      let pmo_nivel_ = Number(this.tmp_operacionCobroPractica.pmo_nivel);
      console.log('pmo_nivel '+pmo_nivel_);
      if((pmo_nivel_ !== 2)&&(pmo_nivel_ !== 4)){
        console.log('pmo_nivel '+pmo_nivel_);
         this.throwAlert('warning','Error de distribución',  'La practica no tiene distribución asignada','500');
      }

    }



     if(resp[0]){this.coseguro_id  = resp[0].id;}

       this.tmp_operacionCobroPractica.categorizacion = this.categoria_coseguro;
       console.log(this.categoria_coseguro);
       console.log(this.popItemCoseguro);
       console.log(resp);
       console.log("COSEGURO");

       if(es_habilitada ==='S'){ // OJO SI NO FUNCIONA ALGO ESTO FUE AGREGADO EL 22-07-2019 PARA QUE LOS COSEGUROS QUE NO ESTEN HABILITADOS NO LOS CARGUE
        this.veinteporciento= this.cargarCoseguroRegistro(Number(this.tmp_operacionCobroPractica.valor_facturado)); // EVALUAR SU ELIMINACION YA ESTA CALCULADO EN LA BASE DE DATOS
        if((this.popItemCoseguro.id == '99')){
         this.tmp_operacionCobroPractica.forma_pago = 'EFECTIVO';
         console.log('item coseguro');
         //  SUMO LOS VALORES SI ES COSEGURO PARTICULAR PARA QUE LOS COLOQUE COMO
        // this.total_efectivo = this.total_efectivo+ Number(this.veinteporciento)+this.total_honorario_coseguro;
       }


        if(this.popItemCoseguro.id == '99'){
          this.tmp_operacionCobroPractica.forma_pago = 'EFECTIVO';
        }

       this.operacionCobroPractica = new OperacionCobroPractica(this.tmp_operacionCobroPractica.id,this.coseguro_id,this.popItemCoseguro.nombre+' - '+this.tmp_operacionCobroPractica.pmo_descripcion,
       this.tmp_operacionCobroPractica.obra_social_nombre,
       this.popItemCoseguro.id,this.veinteporciento, this.veinteporciento,this.tmp_operacionCobroPractica.operacion_cobro_id,this.tmp_operacionCobroPractica.observacion,
       this.tmp_operacionCobroPractica.pmo_id, this.tmp_operacionCobroPractica.pmo_nivel,this.categoria_coseguro,this.tmp_operacionCobroPractica.cantidad,this.popItemCoseguro.es_coseguro,this.popItemCoseguro.tiene_distribucion
       ,this.total_honorario_obra_social,this.total_honorario_coseguro,this.tmp_operacionCobroPractica.forma_pago,this.usuario_id,'P',this.tmp_operacionCobroPractica.usuario_cobro_nombre, 'NO', '-','','NO','A','0','');
       console.log(this.operacionCobroPracticas);

       this.operacionCobroPracticas.push(this.operacionCobroPractica);
        console.log('REGISTROS DE PRACTICA');
        console.log(this.operacionCobroPracticas);
       /** PRUEBA DE GUARDADO DE DATOS */
       console.log(this.operacionCobroPracticas);
       console.log(this.total_honorario_obra_social);
       this.operacionCobroPracticas[this.operacionCobroPracticas.length-2].total_honorario_coseguro =this.operacionCobroPracticas[this.operacionCobroPracticas.length-1].total_honorario_coseguro;
       this.operacionCobroPracticas[this.operacionCobroPracticas.length-2].total_honorario_obra_social = this.operacionCobroPracticas[this.operacionCobroPracticas.length-1].total_honorario_obra_social;
       this.total_honorario_coseguro = 0;
       this.total_honorario_obra_social=0;
     //  console.log(  this.operacionCobroPracticas[this.operacionCobroPracticas.length-1].total_honorario_coseguro);
      // console.log( this.operacionCobroPracticas[this.operacionCobroPracticas.length-2].total_honorario_coseguro);

       console.log(this.operacionCobroPracticas);
       this.total_coseguro =  this.total_coseguro + this.veinteporciento;
       this.tmp_operacionCobroPractica.categorizacion = this.categoria_coseguro;
       this.total_obra_social_coseguro = this.total_obra_social + this.total_coseguro;
     // this.valTotalFinal = this.total_obra_social+ this.total_coseguro+ this.total_categoria;
       this.sumarTotales(this.total_obra_social,this.total_coseguro,this.total_categoria);
        }
      this.resultSave = true;
    console.log()
      },
      error => { // error path
          console.log(error.message);
          console.log(error.status);
          this.throwAlert('error','Error: '+error.status,  'Error al cargar los registros',error.status);
          this.resultSave = false;
        });
  } catch (error) {
      this.throwAlert('error','Error al cargar los registros',error,error.status);
  }
  await  this.total_honorario_obra_social ;
  return this.resultSave;

}

// !!!!!!!!!!!!!! OJO !!!!!!!!!! --> this.formMedico.value.usuario_id DEBE SER CAMBIADO POR EL USUARIO QUE REALIZA LA OPERACION
RealizarCobro(){
  //this.operacionCobroPracticas[0].categorizacion = this.categoria_obra_social+this.categoria_coseguro; ----> no debe usarse asigna a la practica 0 la categorizacion
 // console.log(this.operacionCobroPracticas[0].categorizacion);
 let userData = JSON.parse(localStorage.getItem('userData'));
  this._fechaHoy = formatDate(this.fechaHoy, 'yyyy-MM-dd HH:mm', 'en');
  if(this.formDatosObraSocial.value.bono_afiliado !=''){
    console.log(this._fechaHoy);

    if(this.observacion === ''){ this.observacion = '-'}
    console.log('bono '+this.formDatosObraSocial.value.bono_afiliado);
    this.operacionCobro = new OperacionCobro('0',this.formObraSocial.value.id, this.formPaciente.value.id,this.valTotalFinal,this.total_obra_social, this.total_coseguro,this.total_categoria,
    this.valTotalFinal,this.formMedico.value.usuario_id,userData["id"],this._fechaHoy,'COBRADO',this.operacionCobroMedico, this.operacionCobroPracticas,this.observacion,this.formDatosObraSocial.value.bono_afiliado,'NO',this.operacioncobrodistribucion);
  this.es = calendarioIdioma;
  this.loading = true;
  console.log(JSON.stringify(this.operacionCobro));
      try {

          this.miServico.postOperacionCobro(this.operacionCobro)
          .subscribe(resp => {
            console.log(JSON.stringify(resp));
              console.log(resp);
              let myStr:string = this.padLeft(resp.id, '0', 8);
              this.operacioncobro_id = resp.id;
              this.loading = false;
                swal(
                  'Guardado!',
                  'La operación Nº '+myStr+' se a guardado con exito. Con un total de $'+resp.total_operacion_cobro,
                  'success'
                )
                if(this.popItemAgenda){
                 this.actualizarTurno();
                }
          },
          error => { // error path
            console.log(error);
              console.log(error.message);
              console.log(error.status);
              this.throwAlert('error','error','Error: '+error.status+'  Error al cargar los registros',error.message);
           });
      } catch (error) {
        this.throwAlert('error','error','Error: '+error.status+'  Error al cargar los registros',error.message);
      }

  }else{
    this.throwAlert('warning','Error: Practica sin numero de bono',  'Practica sin numero de bono','404');
  }

}



actualizarTurno(){

      try {
        console.log(this.operacioncobro_id);
        console.log(this.popItemAgendaInicio);
          this.agendaService.updateAgendaOperacionCobro(this.popItemAgendaInicio,this.operacioncobro_id )
          .subscribe(resp => {
            console.log(JSON.stringify(resp));
              console.log(resp);
              this.loading = false;

                this.router.navigateByUrl('recepcion/agenda').then(e => {
                  if (e) {
                    console.log('Navigation is successful!');
                  } else {
                    console.log('Navigation has failed!');
                  }
                });
          },
          error => { // error path
            console.log(error);
              console.log(error.message);
              console.log(error.status);
              this.throwAlert('error','error','Error: '+error.status+'  Error al cargar los registros',error.message);
           });
      } catch (error) {
        this.throwAlert('error','error','Error: '+error.status+'  Error al cargar los registros',error.message);
      }
}






removePractica(event){
  //obtengo el elemento a borrar y lo paso con event
      console.log(event);
      this.operacionCobroPracticas = [];
      this.operacioncobrodistribucion = [];
      this.operacionCobroPractica = null;
      this.tmp_operacionCobroPractica = null;
      this.total_obra_social = 0;
      this.total_obra_social_coseguro = 0;
      this.total_categoria = 0;

      this.total_coseguro = 0;
      this.total_efectivo = 0;
      this.categoria_obra_social = 0;
      this.categoria_coseguro = 0;
      this.total_honorario_coseguro = 0;
      this.total_honorario_obra_social = 0;
      this.valTotalFinal = 0;
      this.sumarTotales(this.total_obra_social,this.total_coseguro,this.total_categoria);


}




cargarCoseguroRegistro(valorObrasocial:number){
    var _veinteporciento:number = valorObrasocial;
    var _ochentaporciento:number = 0;
    _ochentaporciento = _veinteporciento *20;
    _veinteporciento = _ochentaporciento / 80;
    return _veinteporciento;
  }

calcularCategoria(os:number, co:number){
  //VALIDO SI ES NIVEL 3 PARA CALCULAR LA CATEGORIZACION
  this.valvalor = 0;
 if(this.tmp_operacionCobroPractica.pmo_nivel == '3'){
  os = Number(os);
  co = Number(co);
  console.log('os '+os+' coseguro'+co);
  if(this.medico_antiguedad<=9){

    this.valvalor = (os+co);
    //this.total_categoria = os +  os ;

    console.log('categoria menor a 9 años');
    this.tmp_operacionCobroPractica.categorizacion = this.valvalor;
    this.valvalor = 0;
  }
  if((this.medico_antiguedad>=10)&&(this.medico_antiguedad<=19)){
    this.valvalor = (os+co) * 30;
    this.valvalor = this.valvalor / 100;
    //this.total_categoria = this.tota this.valvalor ;
    this.tmp_operacionCobroPractica.categorizacion = this.valvalor;
    console.log('categoria entre 10 y 19 años: '+ this.valvalor);
  }
  if(this.medico_antiguedad>=20){
    this.valvalor = (os+co) * 45;
    this.valvalor = this.valvalor / 100;
   // this.total_categoria = this.valvalor ;
    console.log('categoria mayor a 20 años: '+ this.valvalor);
   // console.log(this.valvalor);
    this.tmp_operacionCobroPractica.categorizacion = this.valvalor;
  }
}else{

 this.valvalor = 0;
}
 // console.log(this.valvalor);
  return this.valvalor;
}



confirmarOperacion(){


  swal({
    title: 'Va a generar una operacion de cobro',
    text: 'Desea proseguir',
    type: 'warning',
    showCancelButton: true,
    confirmButtonColor: '#3085d6',
    cancelButtonColor: '#d33',
    confirmButtonText: 'Si, guardar!'
  }).then((result) => {
    if (result.value) {
      this.RealizarCobro();

    }



  })
}


sumarTotales(obra_social:number,coseguro:number,categoria:number){

  this.valTotalFinal = obra_social+coseguro+categoria+0;

}

observacionChange(event){
  this.observacion = event;
}


padLeft(text:string, padChar:string, size:number): string {
  return (String(padChar).repeat(size) + text).substr( (size * -1), size) ;
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


