
function cargarDatos(session, sala, ap){

    session.cargar();

    if(session.registro>-1){
        
        addUsuario(sala,session);

    }

    iniciarWebSocket(session,sala, ap);

}

