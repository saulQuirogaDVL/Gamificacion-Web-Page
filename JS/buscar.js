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
    get(child(dbRef, `/Usuarios/${document.cookie}`)).then((snapshot) => {
    if (snapshot.exists()) {       
        cargarReportes(snapshot.val());
    } else {
        console.log("No data available");
        alert("El usuario no existe, volviendo a la pagina principal");
        window.location.assign("index.html");
    }
    }).catch((error) => {
        console.error(error);
    });
}


function cargarReportes(userShot){
    console.log(userShot);

    //generando el data HTML
    let dataHTML = new Array(14);
    let dataHTML_INT = new Array(14);
    for(let i=0; i< 15; i++){
        dataHTML[i] =  userShot.Niveles[`Nivel${(i+1)}`].Puntaje;    
        dataHTML_INT[i] =  userShot.Niveles[`Nivel${(i+1)}`].Intentos;   
    }

     //generando el data CSS
     let dataCSS = new Array(6);
     let dataCSS_INT = new Array(6);
     for(let i= 0; i < 7; i++){
        dataCSS[i] =  userShot.Niveles[`Nivel${(i+15)}`].Puntaje;  
        dataCSS_INT[i] =  userShot.Niveles[`Nivel${(i+15)}`].Intentos;    
     }

     //generando el data JS
     let dataJS = new Array(6);
     let dataJS_INT = new Array(6);
     for(let i= 0; i < 7; i++){
        dataJS[i] =  userShot.Niveles[`Nivel${(i+20)}`].Puntaje; 
        dataJS_INT[i] =  userShot.Niveles[`Nivel${(i+20)}`].Intentos;   
     }

    const cnvGeneral = document.getElementById('cnvGeneral').getContext('2d');
    const mychartcnvGeneral = new Chart(cnvGeneral, {
        type: 'bar',
        data: {
            labels: ['Nivel-1', 'Nivel-2', 'Nivel-3', 'Nivel-4', 'Nivel-5', 'Nivel-6', 'Nivel-7',
                     'Nivel-8', 'Nivel-9', 'Nivel-10', 'Nivel-11', 'Nivel-12','Nivel-13', 'Nivel-14'],
            datasets: [{
                label: 'Niveles HTML', 
                data: dataHTML,
                backgroundColor: [
                    'rgba(255, 0, 0, 0.2)'
                ],
                borderColor: [
                    'rgba(255, 0, 0, 1)'
                ],
                borderWidth: 1
            },{
                label: 'Niveles CSS', 
                data: dataCSS,
                backgroundColor: [
                    'rgba(0, 0, 255, 0.2)'
                ],
                borderColor: [
                    'rgba(0, 0, 255, 1)'
                ],
                borderWidth: 1
            },{
                label: 'Niveles JS', 
                data: dataJS,
                backgroundColor: [
                    'rgba(255, 255, 0, 0.2)'
                ],
                borderColor: [
                    'rgba(255, 255, 0, 1)'
                ],
                borderWidth: 1
            }, {
                type: 'line',
                label: 'Intentos',
                data: dataHTML_INT, dataCSS_INT, dataJS_INT,
                fill: false,
                borderColor: 'rgb(54, 162, 235)'
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

    //generando el data CSS-HTML
    let dataCSS_HTML = new Array(6);
    for(let i= 0; i < 7; i++){
        dataCSS_HTML[i] =  userShot.Niveles[`Nivel${(i+15)}`].PuntajeHTML;   
    }

    //generando el data css-css
    let dataCSS_CSS = new Array(6);
    for(let i= 0; i < 7; i++){
        dataCSS_CSS[i] =  userShot.Niveles[`Nivel${(i+15)}`].PuntajeCSS;   
    }

    const cnvCSS = document.getElementById('cnvCSS').getContext('2d');
    const mychartcnvCSS = new Chart(cnvCSS, {
        type: 'bar',
        data: {
            labels: ['Nivel-1', 'Nivel-2', 'Nivel-3', 'Nivel-4', 'Nivel-5', 'Nivel-6'],
            datasets: [{
                label: 'Puntaje HTML', 
                data: dataCSS_HTML,
                backgroundColor: [
                    'rgba(255, 0, 0, 0.2)'
                ],
                borderColor: [
                    'rgba(255, 0, 0, 1)'
                ],
                borderWidth: 1
            },{
                label: 'Puntaje CSS', 
                data: dataCSS_CSS,
                backgroundColor: [
                    'rgba(0, 0, 255, 0.2)'
                ],
                borderColor: [
                    'rgba(0, 0, 255, 1)'
                ],
                borderWidth: 1
            }, {
                type: 'line',
                label: 'Intentos',
                data: dataCSS_INT,
                fill: false,
                borderColor: 'rgb(54, 162, 235)'
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


    //generando el data JS-HTML
    let dataJS_HTML = new Array(6);
    for(let i= 0; i < 7; i++){
        dataJS_HTML[i] =  userShot.Niveles[`Nivel${(i+20)}`].PuntajeHTML;   
    }

    //generando el data JS-CSS
    let dataJS_CSS = new Array(6);
    for(let i= 0; i < 7; i++){
        dataJS_CSS[i] =  userShot.Niveles[`Nivel${(i+20)}`].PuntajeCSS;   
    }

    //generando el data JS-JS
    let dataJS_JS = new Array(6);
    for(let i= 0; i < 7; i++){
        dataJS_JS[i] =  userShot.Niveles[`Nivel${(i+20)}`].PuntajeJS;   
    }

    const cnvJS = document.getElementById('cnvJS').getContext('2d');
    const mychartcnvJS = new Chart(cnvJS, {
        type: 'bar',
        data: {
            labels: ['Nivel-1', 'Nivel-2', 'Nivel-3', 'Nivel-4', 'Nivel-5', 'Nivel-6'],
            datasets: [{
                label: 'Puntaje HTML', 
                data: dataJS_HTML,
                backgroundColor: [
                    'rgba(255, 0, 0, 0.2)'
                ],
                borderColor: [
                    'rgba(255, 0, 0, 1)'
                ],
                borderWidth: 1
            },{
                label: 'Puntaje CSS', 
                data: dataJS_CSS,
                backgroundColor: [
                    'rgba(0, 0, 255, 0.2)'
                ],
                borderColor: [
                    'rgba(0, 0, 255, 1)'
                ],
                borderWidth: 1
            } ,{
                label: 'Puntaje JS', 
                data: dataJS_JS,
                backgroundColor: [
                    'rgba(255, 255,0, 0.2)'
                ],
                borderColor: [
                    'rgba(255, 255, 0, 1)'
                ],
                borderWidth: 1
            } , {
                type: 'line',
                label: 'Intentos',
                data: dataJS_INT,
                fill: false,
                borderColor: 'rgb(54, 162, 235)'
              } ]
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
    for(let i=1; i < 27; i++){
        tblGeneral.innerHTML+=`<tr><td>Nivel ${i}</td>`
        + `<td>${userShot.Niveles[`Nivel${i}`].Puntaje}</td>` 
        + `<td>${userShot.Niveles[`Nivel${i}`].Intentos}</td>`
        + `<td>${userShot.Niveles[`Nivel${i}`].Tiempo}</td>`
        + `<td>${userShot.Niveles[`Nivel${i}`].FechaObtencion}</td></tr>`; 
    }

    //generando estadisticas

    let ponderacionHTML = 0;
    let contadorHTML = 0;
    let ponderacionCSS  = 0;
    let contadorCSS = 0;
    let ponderacionJS   = 0;
    let contadorJS = 0;    

    for(let i=1; i < 15; i++){
        if(userShot.Niveles[`Nivel${i}`].Puntaje>0){
            ponderacionHTML+=userShot.Niveles[`Nivel${i}`].PuntajeHTML;
            contadorHTML++;
        } 
    }

    for(let i=15; i < 21; i++){
        if(userShot.Niveles[`Nivel${i}`].Puntaje>0){
            ponderacionHTML+=userShot.Niveles[`Nivel${i}`].PuntajeHTML;
            contadorHTML++;
            ponderacionCSS+=userShot.Niveles[`Nivel${i}`].PuntajeCSS;
            contadorCSS++;
        } 
    }

    for(let i=20; i < 27; i++){
        if(userShot.Niveles[`Nivel${i}`].Puntaje>0){
            ponderacionHTML+=userShot.Niveles[`Nivel${i}`].PuntajeHTML;
            contadorHTML++;
            ponderacionCSS+=userShot.Niveles[`Nivel${i}`].PuntajeCSS;
            contadorCSS++;
            ponderacionJS+=userShot.Niveles[`Nivel${i}`].PuntajeJS;
            contadorJS++;
        } 
    }

    if(contadorHTML==0) ponderacionHTML = 0;
    else ponderacionHTML = ponderacionHTML / contadorHTML;

    
    if(contadorCSS==0) ponderacionCSS = 0;
    else ponderacionCSS = ponderacionCSS / contadorCSS;

    
    if(contadorJS==0) ponderacionJS = 0;
    else ponderacionJS = ponderacionJS / contadorJS;


    const cnvEst = document.getElementById('cnvEst').getContext('2d');
    const mychartcnvEst = new Chart(cnvEst, {
        type: 'polarArea',
        data: {
            labels: ['HTML', 'CSS', 'JS'],
            datasets: [{
                label: 'My First Dataset',
                data: [ponderacionHTML, ponderacionCSS, ponderacionJS],
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

    //generando niveles superados
    const cnvNivel = document.getElementById('cnvNivel').getContext('2d');
    const mychartcnvNivel = new Chart(cnvNivel, {
        type: 'doughnut',
        data: {
            labels: ['Jugados', 'Por Jugar'],
            datasets: [{
                label: 'My First Dataset',
                data: [contadorHTML, (26-contadorHTML)],
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
    for(let i=1; i <= 30; i++){
        if(userShot.Recompensas[`Recompensa${i}`]!=null){
            contRecomp.innerHTML+=`<div class="col-span-1  bg-[url('/IMG/R${i}.png')] bg-cover w-44 h-44 "></div>`;          
        }else{
            contRecomp.innerHTML+=`<div class="col-span-1  bg-[url('/IMG/R0.png')] bg-cover w-44 h-44 "></div>`;
        }
    }
    
}



