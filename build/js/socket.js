
var ws;
var conexion=false;


function iniciarWebSocket(session,sala,ap){
	
	/* ws=new WebSocket("wss://socketsbay.com/wss/v2/"+session.usuario+"/bfcde323b40befb3bae6e156c309890a/");	 */
	ws=new WebSocket("wss://socketsbay.com/wss/v2/"+session.usuario+"/6372dc7d928e86840b8e350eaa045fcc/");

	ws.onopen=function(){onOpen(ws,session);} 

	ws.onmessage=function(evt){onMessage(ws,session,sala,ap,evt);} 

    ws.onclose=onClose;
}

function clear(){

	if(conexion){
			
		ws.send( JSON.stringify({"borrar":true}) );
		
	}

}


function cerrarWebSocket(session){

	if(conexion){
		ws.send(JSON.stringify({"cerrar":session.registro}));/////invitado?
		ws.close();
	}

}


function enviarMensaje(ap){
    
    if(conexion){
			
      ws.send( JSON.stringify({"Contenido":ap.getCurrentXMLString()}) );
      
    }
    
}

function onOpen(ws,session){

	conexion=true;
	alert("conectado");//ok

	if(session.registro<0){
		
		ws.send(JSON.stringify({"ID":session.registro,"passwd":session.password}));/////invitado	

	}

}

function onMessage(ws,session,sala,ap,evt){

	var objeto= JSON.parse(evt.data);

		if(conexion)
		{
			if(objeto.Contenido){//ambos

				if(session.registro>=0){

					if(ap){
						ap._delDiagram();
						ap.setXMLString(objeto.Contenido);
					
					}
					

				}  

            }else if(objeto.ID){
				
				
				if(objeto.ID<0){
					
					if (session.isAnfitrion()){//anfitrion
						

						if(objeto.passwd===session.password){
							
							let reg=sala.length;
							addUsuario2(sala,reg);
							
						  ws.send(JSON.stringify({"reg":reg}));//confirmacion

					    }else{

							ws.send(JSON.stringify({"exit":true}));/////no confirmado

						}

					} 

					

				}
                
            }else if(objeto.reg){//invitado

				if(session.registro<0){

					session.registro=objeto.reg;

				}

				
			
			}else if(objeto.cerrar){

				const index = sala.indexOf(objeto.cerrar);
				if (index > -1) { 
					
					sala.splice(index, 1); 

				}

			}else if(objeto.exit){
				ws.close();
			}else if(objeto.borrar){
				ap._delDiagram();
			}

			
		}

}

function onClose(){

	conexion=false;
	alert("conexion cerrada");

        
}

