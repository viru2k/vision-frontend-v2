export class ChatRenglon {

    constructor(
     public sesion_id: string,
     public usuario_id: string,
     public mensaje: string,
     public es_adjunto: string,
     public archivo: string,
     public tipo_mensaje: string
    ) {}

}