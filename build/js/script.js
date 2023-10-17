
window.onload = function() {bvistas

    var width =window.innerWidth*0.83; 
    var height = window.innerHeight*0.80;

    var app = new Application( { id: 'umldiagram', width: width, height: height } );  
    
    
    var session;
    var sala=[];//sala

    
    var descargar = document.getElementById("descargar");
    var archivo = document.getElementById("archivo");
    var subir = document.getElementById("subir");

	if(archivo!=null){
    archivo.addEventListener("change", function(){myarchivo(app);});
	}
  
	if(subir!=null){
    subir.addEventListener("click", load);
	}
	
	if(descargar!=null){
    descargar.addEventListener("click",function(){downloadXML(app);} );
	}
    
       

    var modal = document.getElementById("myModal");
    var iniciar = document.getElementById("iniciar");
    var baceptar = document.getElementById("maceptar");
    var bcerrar = document.getElementById("mcerrar");
    var iuser = document.getElementById("muser");
    var ipassword = document.getElementById("mpassword");
    var irol= document.getElementById("mrol");

    var finalizar = document.getElementById("finalizar");

    
    bcerrar.addEventListener("click", cerrarModal);


    iniciar.onclick = display;
    
    baceptar.addEventListener("click",function(){iniciarSession(finalizar,sala,session,app)} );

    

    var canvas=document.getElementsByTagName("canvas")[1];
    canvas.addEventListener("mousemove",function(){onChange(app)});


    var database = document.getElementById("database");
    var bconfirmar = document.getElementById("confirmar");
    var bcancelar = document.getElementById("cancelar");
    var inombre = document.getElementById("mnombre");
    var itipo = document.getElementById("mtipo");

    if(bcancelar!=null){
        bcancelar.addEventListener("click", cerrar);
    }

    if(bconfirmar!=null){
        bconfirmar.addEventListener("click", confirmar);
    }
    
    
   
    function cerrar(){
        database.style.display = "none";
        inombre.value = "";
        itipo.value = "";
    }

    function confirmar(){

        database.style.display = "none";
        let nombre = inombre.value;
        let tipo = itipo.value;

        
        if(app._selected!=null){

            let s= app.getCurrentXMLString();

            let diagrama=new Diagrama();
            cargarDiagrama(diagrama,s);
            
           let contenido= generarDataBase(diagrama,nombre,tipo); 

           if(contenido!="")
           downloadSQL(contenido);

        }
        

    }

    var bdatabase = document.getElementById("bdatabase");
    var bvistas = document.getElementById("bvistas");

    if(bvistas!=null){
        bvistas.addEventListener("click", function(){
    
            vistas();
    
        });
    
        }

        function vistas(){   
            
            if(app._selected!=null){
    
                let s= app.getCurrentXMLString();
    
                let diagrama=new Diagrama();
                cargarDiagrama(diagrama,s);
                
                generarVistas(diagrama); 
    
               
    
            }
            
    
        }
	
	if(bdatabase!=null){
    bdatabase.addEventListener("click", function(){

        displayDataDase();

    });

	}

    function displayDataDase(){

        database.style.display = "block";
        inombre.value = "";
        itipo.value = "";

    }

    function display(){

        modal.style.display = "block";
        iuser.value = "";
        ipassword.value = "";

    }


    function iniciarSession(finalizar,sala,session,ap){

        modal.style.display = "none";
        let usuario = iuser.value;
        let password = ipassword.value;
        let rol = irol.value;

        session=new Session(usuario, password, rol);

        cargarDatos(session, sala, ap);

        finalizar.addEventListener("click", function(){cerrarWebSocket(session);} );
        

    }


    function cerrarModal(){

    modal.style.display = "none";
    iuser.value = "";
    ipassword.value = "";

    }


    window.onclick = function(event) {

    if (event.target == modal) {
        modal.style.display = "none";
    }
    
    } 

    
   
    function onChange(ap) {

        if(change){
            
            enviarMensaje(ap);
        
        }
        
        change=false;
        
    }

    var borrar = document.getElementById("borrar");

    if(borrar!=null){

        borrar.addEventListener("click",function(){borrarDiagrama(app)} );

        function borrarDiagrama(ap){

            ap._delDiagram();
            clear();
            change=false;

        }


    }

    

   

} 