import { FormGroup, FormControl, Validators } from '@angular/forms';
import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-popup-forma-pago',
  templateUrl: './popup-forma-pago.component.html',
  styleUrls: ['./popup-forma-pago.component.css']
})
export class PopUpFormaPagoComponent implements OnInit {
  tipoPago: any[];
  formPago: FormGroup;
  cols: any[];
  loading;

  constructor() { }

  ngOnInit() {

    this.formPago = new FormGroup({
      'monto': new FormControl("0"),
      'concepto': new FormControl(""),
      'forma_pago': new FormControl("Contado")
  });
    this.tipoPago = [
        {name: 'Contado', code: 'CO'},
        {name: 'Tarjeta', code: 'TA'},
        {name: 'Dolares', code: 'DL'},
        {name: 'Transferencia', code: 'TB'}
    ];
  

  this.cols = [
    { field: 'concepto', header: 'Concepto' },
    {field: 'monto', header: 'Monto' },
    { field: 'forma_pago', header: 'Forma de pago' },
 ];

}
}
