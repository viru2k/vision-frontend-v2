export class HistoriaClinica {
    dni:string;
    paciente_id:string;
    
    matricula_id:string;
    MEDICO:string;
    MEDICONOM:string;
    id:string;
    FECHA:string;
    LEJOS_OD_E:string;
    LEJOS_OD_C:string;
    LEJOS_OD_2:string;
    LEJOS_OD_P:string;
    LEJOS_OD_B:string;
    LEJOS_OI_E:string;
    LEJOS_OI_C:string;
    LEJOS_OI_2:string;
    LEJOS_OI_P:string;
    LEJOS_OI_B:string;
    CERCA_OD_E:string;
    CERCA_OD_C:string;
    CERCA_OD_2:string;
    CERCA_OD_P:string;
    CERCA_OD_B:string;
    CERCA_OI_E:string;
    CERCA_OI_C:string;
    CERCA_OI_2:string;
    CERCA_OI_P:string;
    CERCA_OI_B:string;
    OBS_LENTES:string;
    MC:string;
    AEA:string;
    APP:string;
    AF:string;
    AV_LEJOS_O:string;
    AV_LEJOS_2:string;
    AV_LEJOS_3:string;
    AV_LEJOS_4:string;
    AV_LEJOS_5:string;
    AV_LEJOS_6:string;
    AV_LEJOS_7:string;
    AV_LEJOS_8:string;
    RFL_OD_ESF:string;
    RFL_OD_CIL:string;
    RFL_OD_EJE:string;
    RFL_AV_OD:string;
    RFL_OI_ESF:string;
    RFL_OI_CIL:string;
    RFL_OI_EJE:string;
    RFL_AV_OI:string;
    PIO_OD:string;
    PIO_OI:string;
    BIO:string;
    COMENTARIO:string;
    FO:string;
    CVC:string;
    OBSERVACIO:string;
    SINTOMAS:string;
    RFC_OD_ESF:string;
    RFC_OD_CIL:string;
    RFC_OD_EJE:string;
    RFC_AV_OD:string;
    RFC_OI_ESF:string;
    RFC_OI_CIL:string;
    RFC_OI_EJE:string;
    RFC_AV_OI:string;
    medico_id:string;
    nombreyapellido:string;
    usuario_id:string;
    PACIENTE:string;    
    plan:string;
    numero_afiliado:string;
    edad:string;
    obra_social_nombre:string;
    TRATAMIENT:string;
    paciente_nombre:string;
    DIAGNOSTIC:string;
    REFRACCION_OD:string;
    REFRACCION_OI:string;
    CICLOPEGIA_OD:string;
    CICLOPEGIA_OI:string;    
    BIO_OD:string;
    BIO_OI:string;
    SINTOMAS_SIGNOS:string;
    FONDO_OD:string;
    FONDO_OI:string;
    DIAGNOSTICO_OD:string;
    DIAGNOSTICO_OI:string;
    TRATAMIENTO_MEDICO:string;
    TRATAMIENTO_QUIRURGICO:string;
    domicilio:string;
    paciente_obra_social_id:string;
    barra_afiliado:string;    
    historia_clinica:HistoriaClinica[];
    estudio_id:string;
    estudio_nombre:string;
    ESTUDIOSES:string;

    constructor( 
        paciente_id:string,
        matricula_id:string,
        MEDICO:string,
        MEDICONOM:string,
        id:string,
        FECHA:string,
        LEJOS_OD_E:string,
        LEJOS_OD_C:string,
        LEJOS_OD_2:string,
        LEJOS_OD_P:string,
        LEJOS_OD_B:string,
        LEJOS_OI_E:string,
        LEJOS_OI_C:string,
        LEJOS_OI_2:string,
        LEJOS_OI_P:string,
        LEJOS_OI_B:string,
        CERCA_OD_E:string,
        CERCA_OD_C:string,
        CERCA_OD_2:string,
        CERCA_OD_P:string,
        CERCA_OD_B:string,
        CERCA_OI_E:string,
        CERCA_OI_C:string,
        CERCA_OI_2:string,
        CERCA_OI_P:string,
        CERCA_OI_B:string,
        OBS_LENTES:string,
        MC:string,
        AEA:string,
        APP:string,
        AF:string,
        AV_LEJOS_O:string,
        AV_LEJOS_2:string,
        AV_LEJOS_3:string,
        AV_LEJOS_4:string,
        AV_LEJOS_5:string,
        AV_LEJOS_6:string,
        AV_LEJOS_7:string,
        AV_LEJOS_8:string,
        RFL_OD_ESF:string,
        RFL_OD_CIL:string,
        RFL_OD_EJE:string,
        RFL_AV_OD:string,
        RFL_OI_ESF:string,
        RFL_OI_CIL:string,
        RFL_OI_EJE:string,
        RFL_AV_OI:string,
        PIO_OD:string,
        PIO_OI:string,
        BIO:string,
        COMENTARIO:string,
        FO:string,
        CVC:string,
        OBSERVACIO:string,
        SINTOMAS:string,
        RFC_OD_ESF:string,
        RFC_OD_CIL:string,
        RFC_OD_EJE:string,
        RFC_AV_OD:string,
        RFC_OI_ESF:string,
        RFC_OI_CIL:string,
        RFC_OI_EJE:string,
        RFC_AV_OI:string,
        medico_id:string,
        nombreyapellido:string,
        usuario_id:string,
        PACIENTE:string,
        plan:string,
        numero_afiliado:string,
        edad:string,
        obra_social_nombre:string,
        TRATAMIENT:string,
        paciente_nombre:string,
        DIAGNOSTIC:string,
        dni:string,
        BIO_OD:string,
        BIO_OI:string,
        REFRACCION_OD:string,
        REFRACCION_OI:string,
        CICLOPEGIA_OD:string,
        CICLOPEGIA_OI:string, 
        SINTOMAS_SIGNOS:string,
        FONDO_OD:string,
        FONDO_OI:string,
        DIAGNOSTICO_OD:string,
        DIAGNOSTICO_OI:string,
        TRATAMIENTO_MEDICO:string,
        TRATAMIENTO_QUIRURGICO:string,
        domicilio:string,
        paciente_obra_social_id:string,
        barra_afiliado:string,
        historia_clinica:HistoriaClinica[],
        estudio_id:string,
        estudio_nombre:string,
        ESTUDIOSES:string
        ) {
       
            this.paciente_id= paciente_id;
            this.matricula_id= matricula_id;
            this.MEDICO= MEDICO;
            this.MEDICONOM= MEDICONOM;
            this.id= id;
            this.FECHA= FECHA ;
            this.LEJOS_OD_E= LEJOS_OD_E;
            this.LEJOS_OD_C= LEJOS_OD_C;
            this.LEJOS_OD_2= LEJOS_OD_2;
            this.LEJOS_OD_P= LEJOS_OD_P;
            this.LEJOS_OD_B= LEJOS_OD_B;
            this.LEJOS_OI_E= LEJOS_OI_E;
            this.LEJOS_OI_C= LEJOS_OI_C;
            this.LEJOS_OI_2= LEJOS_OI_2;
            this.LEJOS_OI_P= LEJOS_OI_P;
            this.LEJOS_OI_B= LEJOS_OI_B;
            this.CERCA_OD_E= CERCA_OD_E;
            this.CERCA_OD_C= CERCA_OD_C;
            this.CERCA_OD_2= CERCA_OD_2;
            this.CERCA_OD_P= CERCA_OD_P;
            this.CERCA_OD_B= CERCA_OD_B;
            this.CERCA_OI_E= CERCA_OI_E;
            this.CERCA_OI_C= CERCA_OI_C;
            this.CERCA_OI_2= CERCA_OI_2;
            this.CERCA_OI_P= CERCA_OI_P;
            this.CERCA_OI_B= CERCA_OI_B;
            this.OBS_LENTES= OBS_LENTES;
            this.MC= MC;
            this.AEA=AEA;
            this.APP= APP;
            this.AF= AF;
            this.AV_LEJOS_O= AV_LEJOS_O;
            this.AV_LEJOS_2= AV_LEJOS_2;
            this.AV_LEJOS_3= AV_LEJOS_3;
            this.AV_LEJOS_4= AV_LEJOS_4;
            this.AV_LEJOS_5= AV_LEJOS_5;
            this.AV_LEJOS_6= AV_LEJOS_6;
            this.AV_LEJOS_7= AV_LEJOS_7;
            this.AV_LEJOS_8= AV_LEJOS_8;
            this.RFL_OD_ESF= RFL_OD_ESF;
            this.RFL_OD_CIL= RFL_OD_CIL;
            this.RFL_OD_EJE= RFL_OD_EJE;
            this.RFL_AV_OD= RFL_AV_OD;
            this.RFL_OI_ESF= RFL_OI_ESF;
            this.RFL_OI_CIL= RFL_OI_CIL;
            this.RFL_OI_EJE= RFL_OI_EJE;
            this.RFL_AV_OI= RFL_AV_OI;
            this.PIO_OD= PIO_OD;
            this.PIO_OI = PIO_OI;
            this.BIO = BIO;
            this.COMENTARIO= COMENTARIO;
            this.FO= FO;
            this.CVC= CVC;
            this.OBSERVACIO= OBSERVACIO;
            this.SINTOMAS= SINTOMAS;
            this.RFC_OD_ESF = RFC_OD_ESF;
            this.RFC_OD_CIL = RFC_OD_CIL;
            this.RFC_OD_EJE = RFC_OD_EJE;
            this.RFC_AV_OD = RFC_AV_OD ;
            this.RFC_OI_ESF = RFC_OI_ESF;
            this.RFC_OI_CIL = RFC_OI_CIL;
            this.RFC_OI_EJE = RFC_OI_EJE;
            this.RFC_AV_OI = RFC_AV_OI ;
            this.medico_id =medico_id;
            this.nombreyapellido =nombreyapellido;
            this.usuario_id =usuario_id;
            this.PACIENTE = PACIENTE;
            this.plan = plan;
            this.numero_afiliado = numero_afiliado;
            this.edad = edad;
            this.obra_social_nombre =obra_social_nombre;
            this.TRATAMIENT = TRATAMIENT;
            this.paciente_nombre = paciente_nombre;
            this.DIAGNOSTIC = DIAGNOSTIC;
            this.dni = dni;
            this.REFRACCION_OD = REFRACCION_OD;
            this.REFRACCION_OI = REFRACCION_OI;
            this.CICLOPEGIA_OD = CICLOPEGIA_OD;
            this.CICLOPEGIA_OI = CICLOPEGIA_OI;
            this.BIO_OD = BIO_OD;
            this.BIO_OI = BIO_OI;
            this.SINTOMAS_SIGNOS = 
            this.FONDO_OD = FONDO_OD;
            this.FONDO_OI = FONDO_OI;
            this.DIAGNOSTICO_OD = DIAGNOSTICO_OD;
            this.DIAGNOSTICO_OI = DIAGNOSTICO_OI;
            this.TRATAMIENTO_MEDICO = TRATAMIENTO_MEDICO;
            this.TRATAMIENTO_QUIRURGICO =TRATAMIENTO_QUIRURGICO;
            this.domicilio = domicilio;
            this.paciente_obra_social_id = paciente_obra_social_id;
            this.barra_afiliado = barra_afiliado;
            this.historia_clinica = historia_clinica;
            this.estudio_id = estudio_id;
            this.estudio_nombre = estudio_nombre;
            this.ESTUDIOSES = ESTUDIOSES;
   }
}