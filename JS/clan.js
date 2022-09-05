/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//Librerias necesarias para el login
import { initializeApp } from "https://www.gstatic.com/firebasejs/9.9.3/firebase-app.js";
import { getAuth, signInWithEmailAndPassword, onAuthStateChanged } from 'https://www.gstatic.com/firebasejs/9.9.3/firebase-auth.js';
import { getDatabase, ref, child, get } from "https://www.gstatic.com/firebasejs/9.9.3/firebase-database.js"

// Fragmento de codigo necesario para que funcione FIREBASE
const firebaseConfig = initializeApp ({
    apiKey: "AIzaSyCaosvNUZkNh-qjaE3lL5umPX-DehxRouk",
    authDomain: "proyecto-gamificacion-a0d70.firebaseapp.com",
    databaseURL: "https://proyecto-gamificacion-a0d70-default-rtdb.firebaseio.com",
    projectId: "proyecto-gamificacion-a0d70",
    storageBucket: "proyecto-gamificacion-a0d70.appspot.com",
    messagingSenderId: "566822889262",
    appId: "1:566822889262:web:1aa9d5e58dafac2974bcbf"
});

const auth = getAuth(firebaseConfig);

/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

const menuNav = document.getElementById('menuNAV');

const botonMenu = document.getElementById('btnMenu');

let usuario;

onAuthStateChanged(auth, (user) => {
    if (user) {
        const uid = user.uid;
        menuNav.innerHTML="";
        menuNav.innerHTML+=`<div class="text-sm sm:flex-grow pr-32"><a class="block mt-4 sm:inline-block sm:mt-0 text-white mr-4" href="personal.html">Reporte Personal</a></div>`;
        menuNav.innerHTML+=`<div class="text-sm sm:flex-grow pr-32"><a class="block mt-4 sm:inline-block sm:mt-0 text-white mr-4" href="clan.html">Reporte Clan</a></div>`
        menuNav.innerHTML+=`<div class="text-sm sm:flex-grow pr-32"><a class="block mt-4 sm:inline-block sm:mt-0 text-white mr-4" href="mundial.html">Reporte Mundial</a></div>`
        menuNav.innerHTML+=`<div class="text-sm sm:flex-grow pr-32"><p class="block mt-4 sm:inline-block sm:mt-0 text-white mr-4">Buscar Jugador:</p><input type="text" id="inpBuscar">   <button id="btnBuscar" class="bg-[url('/IMG/lupa.png')] bg-cover w-4 h-4"></button></div>`
        menuNav.innerHTML+=`<div class="text-sm sm:flex-grow"><button class="block mt-4 sm:inline-block sm:mt-0 text-white mr-4" id="cerrarSesion"> Cerrar Sesion</button></div>`;
      
        usuario = (user.email).split("@");    

        let cerrarSesion = document.getElementById("cerrarSesion");

        cerrarSesion.addEventListener('click', () => {
            auth.signOut();
            window.location.assign("index.html");
        });        

        let btnBuscar = document.getElementById("btnBuscar");

        btnBuscar.addEventListener('click',()=>{
            let inpBuscar = document.getElementById("inpBuscar").value;
            document.cookie = inpBuscar;
            window.location.assign("buscar.html");
        });

        cargarDatosRealTime();

    } else {
        window.location.assign("index.html");
    }
    
});

botonMenu.addEventListener('click', () => {
    menuNav.classList.toggle('hidden');
});


function cargarDatosRealTime(){
    //recuperando datos de realtime
    const dbRef = ref(getDatabase());
    get(child(dbRef, `/Usuarios/${usuario[0]}`)).then((snapshot) => {
    if (snapshot.exists()) {      
        cargarDatosClan(snapshot.val());     
    } else {
        console.log("No data available");
    }
    }).catch((error) => {
        console.error(error);
    });
}

function cargarDatosClan(userShot){
    //recuperando datos de realtime
    const dbRefClan = ref(getDatabase());
    get(child(dbRefClan, `/Clanes/${userShot.Clan}`)).then((snapshot) => {
    if (snapshot.exists()) {       
        let clan = (userShot.Clan).split(":");
        if(clan[1]==usuario[0]) {
            cargarReportesADM(userShot, snapshot.val());
             document.getElementById('contGeneral').classList.toggle('hidden');
        }
        else  cargarReportes(userShot, snapshot.val());
    } else {
        console.log("No data available");
        alert("No cuenta con ningun clan, volviendo al menú de inicio...");
        window.location.assign("index.html");
    }
    }).catch((error) => {
        console.error(error);
    });
}

function cargarReportes(userShot, clanShot){

    //Nivel-1

    const cnvNivel1 = document.getElementById('cnvNivel1').getContext('2d');
    const mychartcnvNivel1 = new Chart(cnvNivel1, {
        type: 'bar',
        data: {
            labels: ['PuntajeFinal','PuntajeHTML','Intentos'],
            datasets: [{
                label: 'Nivel-1', 
                data: [ clanShot.Integrantes[`>${usuario[0]}>`].Tareas[`Tarea1`].Puntaje,
                        clanShot.Integrantes[`>${usuario[0]}>`].Tareas[`Tarea1`].PuntajeHTML,
                        clanShot.Integrantes[`>${usuario[0]}>`].Tareas[`Tarea1`].Intentos],
                backgroundColor: [
                    'rgba(0, 255, 0, 0.2)',
                    'rgba(255, 0, 0, 0.2)',
                    'rgba(0 ,0 ,0 ,0.2)'
                ],
                borderColor: [
                    'rgba(0, 255, 0, 1)',
                    'rgba(255, 0, 0, 1)',
                    'rgba(0 ,0 ,0 , 0.1)'
                ],
                borderWidth: 1
            }]
        },
        options: {
            scales: {
                y: {
                    beginAtZero: true
                }
            }
        }
    });

    //Nivel-2

    const cnvNivel2 = document.getElementById('cnvNivel2').getContext('2d');
    const mychartcnvNivel2 = new Chart(cnvNivel2, {
        type: 'bar',
        data: {
            labels: ['PuntajeFinal','PuntajeHTML','Intentos'],
            datasets: [{
                label: 'Nivel-2', 
                data: [ clanShot.Integrantes[`>${usuario[0]}>`].Tareas[`Tarea2`].Puntaje,
                        clanShot.Integrantes[`>${usuario[0]}>`].Tareas[`Tarea2`].PuntajeHTML,
                        clanShot.Integrantes[`>${usuario[0]}>`].Tareas[`Tarea2`].Intentos],
                backgroundColor: [
                    'rgba(0, 255, 0, 0.2)',
                    'rgba(255, 0, 0, 0.2)',
                    'rgba(0, 0, 0, 0.2)'
                ],
                borderColor: [
                    'rgba(0, 255, 0, 1)',
                    'rgba(255, 0, 0, 1)',
                    'rgba(0, 0, 0, 1)'
                ],
                borderWidth: 1
            }]
        },
        options: {
            scales: {
                y: {
                    beginAtZero: true
                }
            }
        }
    });

    //Nivel-3

    const cnvNivel3 = document.getElementById('cnvNivel3').getContext('2d');
    const mychartcnvNivel3 = new Chart(cnvNivel3, {
        type: 'bar',
        data: {
            labels: ['PuntajeFinal','PuntajeHTML', 'PuntajeCSS', 'Intentos'],
            datasets: [{
                label: 'Nivel-3', 
                data: [ clanShot.Integrantes[`>${usuario[0]}>`].Tareas[`Tarea3`].Puntaje,
                        clanShot.Integrantes[`>${usuario[0]}>`].Tareas[`Tarea3`].PuntajeHTML,                        
                        clanShot.Integrantes[`>${usuario[0]}>`].Tareas[`Tarea3`].PuntajeCSS,
                        clanShot.Integrantes[`>${usuario[0]}>`].Tareas[`Tarea3`].Intentos],
                backgroundColor: [
                    'rgba(0, 255, 0, 0.2)',
                    'rgba(255, 0, 0, 0.2)',
                    'rgba(0, 255, 0, 0.2)',
                    'rgba(0, 0, 0, 0.2)'
                ],
                borderColor: [
                    'rgba(0, 255, 0, 1)',
                    'rgba(255, 0, 0, 1)',
                    'rgba(0, 255, 0, 1)',
                    'rgba(0, 0, 0, 1)'
                ],
                borderWidth: 1
            }]
        },
        options: {
            scales: {
                y: {
                    beginAtZero: true
                }
            }
        }
    });

    //Nivel-4

    const cnvNivel4 = document.getElementById('cnvNivel4').getContext('2d');
    const mychartcnvNivel4 = new Chart(cnvNivel4, {
        type: 'bar',
        data: {
            labels: ['PuntajeFinal','PuntajeHTML', 'PuntajeCSS', 'PuntajeJS', 'Intentos'],
            datasets: [{
                label: 'Nivel-4', 
                data: [ clanShot.Integrantes[`>${usuario[0]}>`].Tareas[`Tarea4`].Puntaje,
                        clanShot.Integrantes[`>${usuario[0]}>`].Tareas[`Tarea4`].PuntajeHTML,                        
                        clanShot.Integrantes[`>${usuario[0]}>`].Tareas[`Tarea4`].PuntajeCSS,                       
                        clanShot.Integrantes[`>${usuario[0]}>`].Tareas[`Tarea4`].PuntajeJS,
                        clanShot.Integrantes[`>${usuario[0]}>`].Tareas[`Tarea4`].Intentos],
                backgroundColor: [
                    'rgba(0, 255, 0, 0.2)',
                    'rgba(255, 0, 0, 0.2)',
                    'rgba(0, 255, 0, 0.2)',
                    'rgba(255, 255, 0, 0.2)',
                    'rgba(0, 0, 0, 0.2)'
                ],
                borderColor: [
                    'rgba(0, 255, 0, 1)',
                    'rgba(255, 0, 0, 1)',
                    'rgba(0, 255, 0, 1)',
                    'rgba(255, 255, 0, 1)',
                    'rgba(0, 0, 0, 1)'
                ],
                borderWidth: 1
            }]
        },
        options: {
            scales: {
                y: {
                    beginAtZero: true
                }
            }
        }
    });


    //generando estadisticas

    let ponderacionHTML = 0;
    let contadorHTML = 0;
    let ponderacionCSS  = 0;
    let contadorCSS = 0;

   if(clanShot.Integrantes[`>${usuario[0]}>`].Tareas[`Tarea1`].Puntaje>0){
        contadorHTML++;
        ponderacionHTML+= clanShot.Integrantes[`>${usuario[0]}>`].Tareas[`Tarea1`].PuntajeHTML;
    }

   if(clanShot.Integrantes[`>${usuario[0]}>`].Tareas[`Tarea2`].Puntaje>0){
        contadorHTML++;
        ponderacionHTML+= clanShot.Integrantes[`>${usuario[0]}>`].Tareas[`Tarea2`].PuntajeHTML;
    }

    if(clanShot.Integrantes[`>${usuario[0]}>`].Tareas[`Tarea3`].Puntaje>0){
        contadorHTML++;
        contadorCSS++;
        ponderacionHTML+= clanShot.Integrantes[`>${usuario[0]}>`].Tareas[`Tarea3`].PuntajeHTML;
        ponderacionCSS+= clanShot.Integrantes[`>${usuario[0]}>`].Tareas[`Tarea3`].PuntajeCSS;
    }

    if(clanShot.Integrantes[`>${usuario[0]}>`].Tareas[`Tarea4`].Puntaje>0){
        contadorHTML++;
        contadorCSS++;
        ponderacionHTML+= clanShot.Integrantes[`>${usuario[0]}>`].Tareas[`Tarea3`].PuntajeHTML;
        ponderacionCSS+= clanShot.Integrantes[`>${usuario[0]}>`].Tareas[`Tarea3`].PuntajeCSS;
    }


    if(contadorHTML==0) ponderacionHTML = 0;
    else ponderacionHTML = ponderacionHTML / contadorHTML;

    
    if(contadorCSS==0) ponderacionCSS = 0;
    else ponderacionCSS = ponderacionCSS / contadorCSS;

    const cnvEst = document.getElementById('cnvEst').getContext('2d');
    const mychartcnvEst = new Chart(cnvEst, {
        type: 'polarArea',
        data: {
            labels: ['HTML', 'CSS', 'JS'],
            datasets: [{
                label: 'My First Dataset',
                data: [ponderacionHTML, ponderacionCSS, clanShot.Integrantes[`>${usuario[0]}>`].Tareas[`Tarea4`].PuntajeJS],
                backgroundColor: [
                  'rgb(255, 0, 0)',
                  'rgb(0, 0, 255)',
                  'rgb(255, 255, 0)'
                ]
              }]
        },
        options: {
            scales: {
                y: {
                    beginAtZero: true
                }
            }
        }
    });

    //generando la tabla
    const tblGeneral = document.getElementById('tblGeneral');
    for(let i=1; i < 5; i++){
        tblGeneral.innerHTML+=`<tr><td>Nivel ${i}</td>`
        + `<td>${clanShot.Integrantes[`>${usuario[0]}>`].Tareas[`Tarea${i}`].Puntaje}</td>` 
        + `<td>${clanShot.Integrantes[`>${usuario[0]}>`].Tareas[`Tarea${i}`].Intentos}</td>`
        + `<td>${clanShot.Integrantes[`>${usuario[0]}>`].Tareas[`Tarea${i}`].Tiempo}</td>`
        + `<td>${clanShot.Integrantes[`>${usuario[0]}>`].Tareas[`Tarea${i}`].FechaObtencion}</td></tr>`; 
    }

    //generando niveles superados
    const cnvNivel = document.getElementById('cnvNivel').getContext('2d');
    const mychartcnvNivel = new Chart(cnvNivel, {
        type: 'doughnut',
        data: {
            labels: ['Jugados', 'Por Jugar'],
            datasets: [{
                label: 'My First Dataset',
                data: [contadorHTML, (4-contadorHTML)],
                backgroundColor: [
                  'rgb(0, 255, 0)',
                  'rgb(255, 0, 0)',
                ]
              }]
        },
        options: {
            scales: {
                y: {
                    beginAtZero: true
                }
            }
        }
    });

    //colocando recompensas
    const contRecomp = document.getElementById('contRecomp')
    for(let i=27; i <= 30; i++){
        if(userShot.Recompensas[`Recompensa${i}`]!=null){
            contRecomp.innerHTML+=`<div class="col-span-1  bg-[url('/IMG/R${i}.png')] bg-cover w-44 h-44 "></div>`;          
        }else{
            contRecomp.innerHTML+=`<div class="col-span-1  bg-[url('/IMG/R0.png')] bg-cover w-44 h-44 "></div>`;
        }
    }

    cargarReportesADM(userShot, clanShot);
}

function cargarReportesADM(userShot, clanShot){
    
    const tblInte = document.getElementById('tblInte')
    //recuperando datos de realtime
    const dbRefClan = ref(getDatabase());
    get(child(dbRefClan, `/Usuarios`)).then((snapshot) => {
    if (snapshot.exists()) { 
        
        for(let i=0; i < Object.keys(clanShot.Integrantes).length ; i++){
            let nombreIntegrante = Object.keys(clanShot.Integrantes)[i].split('>');
            tblInte.innerHTML+=`<tr>`
            + `<td id="usuario${i}">${nombreIntegrante[1]}</td>` 
            + `<td>${clanShot.Integrantes[Object.keys(clanShot.Integrantes)[i]].PuntajeClan}</td>`
            + `<td>${snapshot.val()[nombreIntegrante[1]].PuntajeAventura}</td>`
            + `<td>${snapshot.val()[nombreIntegrante[1]].FechaPuntajeAventura}</td></tr>`;           
        }

        for(let i=0; i < Object.keys(clanShot.Integrantes).length ; i++){
            let usuario = document.getElementById(`usuario${i}`);
            usuario.addEventListener('click',()=>{
                cargarDatosRealTimeUser(usuario.innerHTML);            
            });   
        }        
    } 
    }).catch((error) => {
        console.error(error);
    });  
}


function cargarDatosRealTimeUser(usuarioBuscar){
    //recuperando datos de realtime
    const dbRef = ref(getDatabase());
    get(child(dbRef, `/Usuarios/${usuarioBuscar}`)).then((snapshot) => {
    if (snapshot.exists()) {      
        cargarDatosClanUser(snapshot.val(),usuarioBuscar);     
    } else {
        console.log("No data available");
    }
    }).catch((error) => {
        console.error(error);
    });
}

function cargarDatosClanUser(userShot,usuarioBuscar){
    //recuperando datos de realtime
    const dbRefClan = ref(getDatabase());
    get(child(dbRefClan, `/Clanes/${userShot.Clan}`)).then((snapshot) => {
    if (snapshot.exists()) {       
         cargarReportesUser(userShot, snapshot.val(),usuarioBuscar);
    } else {
        console.log("No data available");
        alert("No cuenta con ningun clan, volviendo al menú de inicio...");
        window.location.assign("index.html");
    }
    }).catch((error) => {
        console.error(error);
    });
}


function cargarReportesUser(userShot, clanShot, usuarioBuscar){

    let sectionUser = document.getElementById('sectionUser');

    //creando nuevo contenido
    sectionUser.innerHTML=
    `<section class="lg:col-span-1 lg:row-span-1 col-span-4  shadow-lg">
            <canvas id="cnvNivel1user" ></canvas>
        </section> 
        <section class="lg:col-span-1 lg:row-span-1 col-span-4  shadow-lg">
            <canvas id="cnvNivel2user" ></canvas>
        </section> 
        <section class="lg:col-span-1 lg:row-span-1 col-span-4  shadow-lg">
            <canvas id="cnvNivel3user" ></canvas>
        </section> 
        <section class="lg:col-span-1 lg:row-span-1 col-span-4  shadow-lg">
            <canvas id="cnvNivel4user" ></canvas>
        </section>   
        <section class="lg:col-span-1 lg:row-span-3 row-span-1 col-span-4 shadow-lg">
            <canvas id="cnvEstuser" ></canvas>
        </section>      
        <section class="lg:col-span-2 lg:row-span-1 col-span-4 row-span-1 shadow-lg">
            <table class="table-auto mx-auto ">
                <thead>
                  <tr>
                    <th>Nivel</th>
                    <th>Puntaje Final</th>
                    <th>Intentos</th>
                    <th>Tiempo</th>
                    <th>Fecha Obtencion</th>
                  </tr>
                </thead>
                <tbody id="tblGeneraluser">
                  
                </tbody>
              </table>
        </section>               
        <section class="lg:col-span-1 lg:row-span-3 row-span-1 col-span-4 shadow-lg">
            <canvas id="cnvNiveluser" ></canvas>
        </section>   
        <section class="lg:col-span-2 lg:row-span-1 col-span-4 row-span-1 shadow-lg">
            <section class="grid lg:grid-cols-4 grid-cols-2 col-span-1 mx-auto lg:gap-x-2 gap-x-2" id="contRecompuser"> 

            </section>   
        </section> `

    //Nivel-1

    const cnvNivel1user = document.getElementById('cnvNivel1user').getContext('2d');
    const mychartcnvNivel1user = new Chart(cnvNivel1user, {
        type: 'bar',
        data: {
            labels: ['PuntajeFinal','PuntajeHTML','Intentos'],
            datasets: [{
                label: 'Nivel-1', 
                data: [ clanShot.Integrantes[`>${usuarioBuscar}>`].Tareas[`Tarea1`].Puntaje,
                        clanShot.Integrantes[`>${usuarioBuscar}>`].Tareas[`Tarea1`].PuntajeHTML,
                        clanShot.Integrantes[`>${usuarioBuscar}>`].Tareas[`Tarea1`].Intentos],
                backgroundColor: [
                    'rgba(0, 255, 0, 0.2)',
                    'rgba(255, 0, 0, 0.2)',
                    'rgba(0 ,0 ,0 ,0.2)'
                ],
                borderColor: [
                    'rgba(0, 255, 0, 1)',
                    'rgba(255, 0, 0, 1)',
                    'rgba(0 ,0 ,0 , 0.1)'
                ],
                borderWidth: 1
            }]
        },
        options: {
            scales: {
                y: {
                    beginAtZero: true
                }
            }
        }
    });

    //Nivel-2

    const cnvNivel2user = document.getElementById('cnvNivel2user').getContext('2d');
    const mychartcnvNivel2user = new Chart(cnvNivel2user, {
        type: 'bar',
        data: {
            labels: ['PuntajeFinal','PuntajeHTML','Intentos'],
            datasets: [{
                label: 'Nivel-2', 
                data: [ clanShot.Integrantes[`>${usuarioBuscar}>`].Tareas[`Tarea2`].Puntaje,
                        clanShot.Integrantes[`>${usuarioBuscar}>`].Tareas[`Tarea2`].PuntajeHTML,
                        clanShot.Integrantes[`>${usuarioBuscar}>`].Tareas[`Tarea2`].Intentos],
                backgroundColor: [
                    'rgba(0, 255, 0, 0.2)',
                    'rgba(255, 0, 0, 0.2)',
                    'rgba(0, 0, 0, 0.2)'
                ],
                borderColor: [
                    'rgba(0, 255, 0, 1)',
                    'rgba(255, 0, 0, 1)',
                    'rgba(0, 0, 0, 1)'
                ],
                borderWidth: 1
            }]
        },
        options: {
            scales: {
                y: {
                    beginAtZero: true
                }
            }
        }
    });

    //Nivel-3

    const cnvNivel3user = document.getElementById('cnvNivel3user').getContext('2d');
    const mychartcnvNivel3user = new Chart(cnvNivel3user, {
        type: 'bar',
        data: {
            labels: ['PuntajeFinal','PuntajeHTML', 'PuntajeCSS', 'Intentos'],
            datasets: [{
                label: 'Nivel-3', 
                data: [ clanShot.Integrantes[`>${usuarioBuscar}>`].Tareas[`Tarea3`].Puntaje,
                        clanShot.Integrantes[`>${usuarioBuscar}>`].Tareas[`Tarea3`].PuntajeHTML,                        
                        clanShot.Integrantes[`>${usuarioBuscar}>`].Tareas[`Tarea3`].PuntajeCSS,
                        clanShot.Integrantes[`>${usuarioBuscar}>`].Tareas[`Tarea3`].Intentos],
                backgroundColor: [
                    'rgba(0, 255, 0, 0.2)',
                    'rgba(255, 0, 0, 0.2)',
                    'rgba(0, 255, 0, 0.2)',
                    'rgba(0, 0, 0, 0.2)'
                ],
                borderColor: [
                    'rgba(0, 255, 0, 1)',
                    'rgba(255, 0, 0, 1)',
                    'rgba(0, 255, 0, 1)',
                    'rgba(0, 0, 0, 1)'
                ],
                borderWidth: 1
            }]
        },
        options: {
            scales: {
                y: {
                    beginAtZero: true
                }
            }
        }
    });

    //Nivel-4

    const cnvNivel4user = document.getElementById('cnvNivel4user').getContext('2d');
    const mychartcnvNivel4user = new Chart(cnvNivel4user, {
        type: 'bar',
        data: {
            labels: ['PuntajeFinal','PuntajeHTML', 'PuntajeCSS', 'PuntajeJS', 'Intentos'],
            datasets: [{
                label: 'Nivel-4', 
                data: [ clanShot.Integrantes[`>${usuarioBuscar}>`].Tareas[`Tarea4`].Puntaje,
                        clanShot.Integrantes[`>${usuarioBuscar}>`].Tareas[`Tarea4`].PuntajeHTML,                        
                        clanShot.Integrantes[`>${usuarioBuscar}>`].Tareas[`Tarea4`].PuntajeCSS,                       
                        clanShot.Integrantes[`>${usuarioBuscar}>`].Tareas[`Tarea4`].PuntajeJS,
                        clanShot.Integrantes[`>${usuarioBuscar}>`].Tareas[`Tarea4`].Intentos],
                backgroundColor: [
                    'rgba(0, 255, 0, 0.2)',
                    'rgba(255, 0, 0, 0.2)',
                    'rgba(0, 255, 0, 0.2)',
                    'rgba(255, 255, 0, 0.2)',
                    'rgba(0, 0, 0, 0.2)'
                ],
                borderColor: [
                    'rgba(0, 255, 0, 1)',
                    'rgba(255, 0, 0, 1)',
                    'rgba(0, 255, 0, 1)',
                    'rgba(255, 255, 0, 1)',
                    'rgba(0, 0, 0, 1)'
                ],
                borderWidth: 1
            }]
        },
        options: {
            scales: {
                y: {
                    beginAtZero: true
                }
            }
        }
    });


    //generando estadisticas

    let ponderacionHTML = 0;
    let contadorHTML = 0;
    let ponderacionCSS  = 0;
    let contadorCSS = 0;

   if(clanShot.Integrantes[`>${usuarioBuscar}>`].Tareas[`Tarea1`].Puntaje>0){
        contadorHTML++;
        ponderacionHTML+= clanShot.Integrantes[`>${usuarioBuscar}>`].Tareas[`Tarea1`].PuntajeHTML;
    }

   if(clanShot.Integrantes[`>${usuarioBuscar}>`].Tareas[`Tarea2`].Puntaje>0){
        contadorHTML++;
        ponderacionHTML+= clanShot.Integrantes[`>${usuarioBuscar}>`].Tareas[`Tarea2`].PuntajeHTML;
    }

    if(clanShot.Integrantes[`>${usuarioBuscar}>`].Tareas[`Tarea3`].Puntaje>0){
        contadorHTML++;
        contadorCSS++;
        ponderacionHTML+= clanShot.Integrantes[`>${usuarioBuscar}>`].Tareas[`Tarea3`].PuntajeHTML;
        ponderacionCSS+= clanShot.Integrantes[`>${usuarioBuscar}>`].Tareas[`Tarea3`].PuntajeCSS;
    }

    if(clanShot.Integrantes[`>${usuarioBuscar}>`].Tareas[`Tarea4`].Puntaje>0){
        contadorHTML++;
        contadorCSS++;
        ponderacionHTML+= clanShot.Integrantes[`>${usuarioBuscar}>`].Tareas[`Tarea3`].PuntajeHTML;
        ponderacionCSS+= clanShot.Integrantes[`>${usuarioBuscar}>`].Tareas[`Tarea3`].PuntajeCSS;
    }


    if(contadorHTML==0) ponderacionHTML = 0;
    else ponderacionHTML = ponderacionHTML / contadorHTML;

    
    if(contadorCSS==0) ponderacionCSS = 0;
    else ponderacionCSS = ponderacionCSS / contadorCSS;

    const cnvEstuser = document.getElementById('cnvEstuser').getContext('2d');
    const mychartcnvEstuser = new Chart(cnvEstuser, {
        type: 'polarArea',
        data: {
            labels: ['HTML', 'CSS', 'JS'],
            datasets: [{
                label: 'My First Dataset',
                data: [ponderacionHTML, ponderacionCSS, clanShot.Integrantes[`>${usuarioBuscar}>`].Tareas[`Tarea4`].PuntajeJS],
                backgroundColor: [
                  'rgb(255, 0, 0)',
                  'rgb(0, 0, 255)',
                  'rgb(255, 255, 0)'
                ]
              }]
        },
        options: {
            scales: {
                y: {
                    beginAtZero: true
                }
            }
        }
    });

    //generando la tabla
    const tblGeneral = document.getElementById('tblGeneraluser');
    for(let i=1; i < 5; i++){
        tblGeneral.innerHTML+=`<tr><td>Nivel ${i}</td>`
        + `<td>${clanShot.Integrantes[`>${usuarioBuscar}>`].Tareas[`Tarea${i}`].Puntaje}</td>` 
        + `<td>${clanShot.Integrantes[`>${usuarioBuscar}>`].Tareas[`Tarea${i}`].Intentos}</td>`
        + `<td>${clanShot.Integrantes[`>${usuarioBuscar}>`].Tareas[`Tarea${i}`].Tiempo}</td>`
        + `<td>${clanShot.Integrantes[`>${usuarioBuscar}>`].Tareas[`Tarea${i}`].FechaObtencion}</td></tr>`; 
    }

    //generando niveles superados
    const cnvNiveluser = document.getElementById('cnvNiveluser').getContext('2d');
    const mychartcnvNiveluser = new Chart(cnvNiveluser, {
        type: 'doughnut',
        data: {
            labels: ['Jugados', 'Por Jugar'],
            datasets: [{
                label: 'My First Dataset',
                data: [contadorHTML, (4-contadorHTML)],
                backgroundColor: [
                  'rgb(0, 255, 0)',
                  'rgb(255, 0, 0)',
                ]
              }]
        },
        options: {
            scales: {
                y: {
                    beginAtZero: true
                }
            }
        }
    });

    //colocando recompensas
    const contRecomp = document.getElementById('contRecompuser')
    for(let i=27; i <= 30; i++){
        if(userShot.Recompensas[`Recompensa${i}`]!=null){
            contRecomp.innerHTML+=`<div class="col-span-1  bg-[url('/IMG/R${i}.png')] bg-cover w-44 h-44 "></div>`;          
        }else{
            contRecomp.innerHTML+=`<div class="col-span-1  bg-[url('/IMG/R0.png')] bg-cover w-44 h-44 "></div>`;
        }
    }

}