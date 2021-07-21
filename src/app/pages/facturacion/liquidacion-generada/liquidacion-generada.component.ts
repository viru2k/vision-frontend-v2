import { Component, OnInit, PipeTransform, EventEmitter, Output } from '@angular/core';

import { FormGroup, FormControl, Validators } from '@angular/forms';
import swal from 'sweetalert2';

@Component({
  selector: 'app-liquidacion-generada',
  templateUrl: './liquidacion-generada.component.html',
  styleUrls: ['./liquidacion-generada.component.css']
})
export class LiquidacionGeneradaComponent implements OnInit {

  constructor() { }

  ngOnInit() {
  }

}
