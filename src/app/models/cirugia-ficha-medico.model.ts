export class CirugiaFichaMedico {

    id:string;
    medico_opera_id:string;
    medico_deriva_id:string; 
    medico_ayuda_id:string; 
    medico_factura_id:string; 
    medico_anestesista_id:string; 
    medico_opera_nombre:string;
    medico_deriva_nombre:string; 
    medico_ayuda_nombre:string; 
    medico_factura_nombre:string; 
    medico_anestesista_nombre:string; 
    constructor( 
        id:string,
        medico_opera_id:string,
        medico_deriva_id:string, 
        medico_ayuda_id:string, 
        medico_factura_id:string, 
        medico_anestesista_id:string,
        medico_opera_nombre:string,
        medico_deriva_nombre:string, 
        medico_ayuda_nombre:string, 
        medico_factura_nombre:string, 
        medico_anestesista_nombre:string ) {
       
            this.id = id;
            this.medico_opera_id = medico_opera_id;
            this.medico_deriva_id = medico_deriva_id;
            this.medico_ayuda_id = medico_ayuda_id;
            this.medico_factura_id = medico_factura_id;
            this.medico_anestesista_id = medico_anestesista_id;
            this.medico_opera_nombre = medico_opera_nombre;
            this.medico_deriva_nombre = medico_deriva_nombre;
            this.medico_ayuda_nombre = medico_ayuda_nombre;
            this.medico_factura_nombre = medico_factura_nombre;
            this.medico_anestesista_nombre = medico_anestesista_nombre;
       
   }
}