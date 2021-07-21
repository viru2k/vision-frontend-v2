
import { Component, OnInit, PipeTransform, EventEmitter, Output } from '@angular/core';

import { PopupObrasocialComponent } from './../../mantenimiento/popup/popup-obrasocial/popup-obrasocial.component';
import { PopupMedicoGrupoMedicoComponent } from './../../mantenimiento/popup/popup-medico-grupo-medico/popup-medico-grupo-medico.component';
import { calendarioIdioma } from '../../../config/config';
import { ObraSocialService } from './../../../services/obra-social.service';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import swal from 'sweetalert2';


@Component({
  selector: 'app-liquidacion',
  templateUrl: './liquidacion.component.html',
  styleUrls: ['./liquidacion.component.css']
})
export class LiquidacionComponent implements OnInit {

  cols: any[];
  elementos:any[];
  newPopItem: boolean;
  es:any;
  checked;
  // LOADING
  loading: boolean;
  updateDataForm: FormGroup;
  _id:number = 0;
  columns: any[];
  rows: any[];
  valorLiquidacion: number;
  constructor() { }

  ngOnInit() {
    this.es = calendarioIdioma;
  }

}
