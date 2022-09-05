/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//Librerias necesarias para el login
import { initializeApp } from "https://www.gstatic.com/firebasejs/9.9.3/firebase-app.js";
import { getAuth, signInWithEmailAndPassword, onAuthStateChanged } from 'https://www.gstatic.com/firebasejs/9.9.3/firebase-auth.js';


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


const botonMenu = document.getElementById('btnMenu');

const menuNav = document.getElementById('menuNAV');

const closeModal = document.getElementById('closeModal');

const modalLogin = document.getElementById('modalLogin');

const btnLogin = document.getElementById('btnLogin');

const esPrimeracarga = true;

onAuthStateChanged(auth, (user) => {
    if (user) {
        const uid = user.uid;
        menuNav.innerHTML="";
        menuNav.innerHTML+=`<div class="text-sm sm:flex-grow pr-32"><a class="block mt-4 sm:inline-block sm:mt-0 text-white mr-4" href="personal.html">Reporte Personal</a></div>`;
        menuNav.innerHTML+=`<div class="text-sm sm:flex-grow pr-32"><a class="block mt-4 sm:inline-block sm:mt-0 text-white mr-4" href="clan.html">Reporte Clan</a></div>`
        menuNav.innerHTML+=`<div class="text-sm sm:flex-grow pr-32"><a class="block mt-4 sm:inline-block sm:mt-0 text-white mr-4" href="mundial.html">Reporte Mundial</a></div>`
        menuNav.innerHTML+=`<div class="text-sm sm:flex-grow pr-32"><p class="block mt-4 sm:inline-block sm:mt-0 text-white mr-4">Buscar Jugador:</p><input type="text" id="inpBuscar">   <button id="btnBuscar" class="bg-[url('/IMG/lupa.png')] bg-cover w-4 h-4"></button></div>`
        menuNav.innerHTML+=`<div class="text-sm sm:flex-grow"><button class="block mt-4 sm:inline-block sm:mt-0 text-white mr-4" id="cerrarSesion"> Cerrar Sesion</button></div>`;
      
        let cerrarSesion = document.getElementById("cerrarSesion");

        cerrarSesion.addEventListener('click', () => {
            auth.signOut();
            window.location.reload();
        }); 

        let btnBuscar = document.getElementById("btnBuscar");

        btnBuscar.addEventListener('click',()=>{
            let inpBuscar = document.getElementById("inpBuscar").value;
            document.cookie = inpBuscar;
            window.location.assign("buscar.html");
        });

    } else {
        menuNav.innerHTML="";
        menuNav.innerHTML+=`<div class="text-sm sm:flex-grow" id="menuLogin"><button class="block mt-4 sm:inline-block sm:mt-0 text-white mr-4" id="abrirModal"> INICIAR SESION </button></div>`
        let abrirModal = document.getElementById('abrirModal');
        abrirModal.addEventListener('click', () => {
            modalLogin.classList.toggle('hidden');
        });
    }
    
});

botonMenu.addEventListener('click', () => {
    menuNav.classList.toggle('hidden');
});

closeModal.addEventListener('click', () => {
    modalLogin.classList.toggle('hidden');
});

btnLogin.addEventListener('click', () => {
    let email = document.getElementById("email").value;
    let password = document.getElementById("password").value;
    signInWithEmailAndPassword(auth, email, password)
    .then((userCredential) => {
        const user = userCredential.user;
        modalLogin.classList.toggle('hidden');
    })
    .catch((error) => {
        const errorCode = error.code;
        const errorMessage = error.message;
    });
});






