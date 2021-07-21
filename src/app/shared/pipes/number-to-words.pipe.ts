import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'numberToWords'
})
export class NumberToWordsPipe implements PipeTransform {

  a = [
    '',
    'uno ',
    'dos ',
    'tres ',
    'cuatro ',
    'cinco ',
    'seis ',
    'siete ',
    'ocho ',
    'nueve ',
    'diez ',
    'once ',
    'doce ',
    'trece ',
    'catorce ',
    'quince ',
    'deieciseis ',
    'diecisiete ',
    'dieciocho ',
    'diecinueve '];

  b = [
    '',
    '',
    'veinti',
    'treinta y ',
    'cuarenta y ',
    'cincuenta y ',
    'sesenta y ',
    'setenta y ',
    'ochenta y ',
    'noventa y '];

  transform(value: any, args?: any): any {
    console.log(value);
    if (value) {
      let num: any = Number(value);
      if (num) {
        if ((num = num.toString()).length > 9)  { return 'We are not the Iron Bank, you can lower down the stakes :)'; }
        const n = ('000000000' + num).substr(-9).match(/^(\d{2})(\d{2})(\d{2})(\d{1})(\d{2})$/);
        if (!n) {return ''; }
        let str = '';
        str += (Number(n[1]) !== 0) ? (this.a[Number(n[1])] || this.b[n[1][0]] + ' ' + this.a[n[1][1]]) + 'millon ' : '';
        str += (Number(n[2]) !== 0) ? (this.a[Number(n[2])] || this.b[n[2][0]] + ' ' + this.a[n[2][1]]) + 'cien mil ' : '';
        str += (Number(n[3]) !== 0) ? (this.a[Number(n[3])] || this.b[n[3][0]] + ' ' + this.a[n[3][1]]) + 'mil ' : '';
        str += (Number(n[4]) !== 0) ? (this.a[Number(n[4])] || this.b[n[4][0]] + ' ' + this.a[n[4][1]]) + 'cien ' : '';
        str += (Number(n[5]) !== 0) ? ((str !== '') ? 'y ' : '') +
        (this.a[Number(n[5])] || this.b[n[5][0]] + ' ' +
        this.a[n[5][1]]) + 'pesos' : '';
        return str;
      } else {
        return '';
      }
    } else {
      return '';
    }
  }
}