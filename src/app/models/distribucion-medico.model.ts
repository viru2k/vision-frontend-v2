export class DistribucionMedico {

    obra_social_nombre:string;

    medico_opera:string;
    medico_opera_porcentaje:string;
    medico_opera_valor:string;

    medico_ayuda:string;
    medico_ayuda_porcentaje:string;
    medico_ayuda_valor:string;

    medico_ayuda2:string;
    medico_ayuda_porcentaje2:string;
    medico_ayuda_valor2:string;

    medico_clinica:string;
    medico_clinica_porcentaje:string;
    medico_clinica_valor:string;

    valor_distribuido:string;
    total:string;
    fecha_cobro:string;
    operacion_cobro:string;
    paciente_apellido:string;
    dni:string;


    constructor(
        obra_social_nombre:string,

        medico_opera:string,
        medico_opera_porcentaje:string,
        medico_opera_valor:string,
    
        medico_ayuda:string,
        medico_ayuda_porcentaje:string,
        medico_ayuda_valor:string,
    
        medico_ayuda2:string,
        medico_ayuda_porcentaje2:string,
        medico_ayuda_valor2:string,
    
        medico_clinica:string,
        medico_clinica_porcentaje:string,
        medico_clinica_valor:string,
    
        valor_distribuido:string,
        total:string,
        fecha_cobro:string,
        operacion_cobro:string,
        paciente_apellido:string,
        dni:string){
       
this.obra_social_nombre = obra_social_nombre;
this.medico_opera = medico_opera;
this.medico_opera_porcentaje = medico_opera_porcentaje;
this.medico_opera_valor = medico_opera_valor;
this.medico_ayuda = medico_ayuda;
this.medico_ayuda_porcentaje = medico_ayuda_porcentaje;
this.medico_ayuda_valor = medico_ayuda_valor;
this.medico_ayuda2 = medico_ayuda2;
this.medico_ayuda_porcentaje2 = medico_ayuda_porcentaje2;
this.medico_ayuda_valor2 = medico_ayuda_valor2;
this.medico_clinica = medico_clinica;
this.medico_clinica_porcentaje = medico_clinica_porcentaje;
this.medico_clinica_valor = medico_clinica_valor;
this.valor_distribuido = valor_distribuido;
this.total = total;
this.fecha_cobro = fecha_cobro;
this.operacion_cobro = operacion_cobro;
this.paciente_apellido = paciente_apellido;
this.dni = dni;
    }
}