
/*********************** IMPORTANT *************************
  Ce fichier est écrit en module ES. Assure-toi de l'inclure
  via: <script type="module" src="script.js"></script>
***********************************************************/

/*********************** FIREBASE *************************/
import { initializeApp } from "https://www.gstatic.com/firebasejs/10.12.5/firebase-app.js";
import {
  getDatabase,
  ref as dbRef,
  push,
  onChildAdded
} from "https://www.gstatic.com/firebasejs/10.12.5/firebase-database.js";
import {
  getStorage,
  ref as storageRef,
  uploadBytes,
  getDownloadURL
} from "https://www.gstatic.com/firebasejs/10.12.5/firebase-storage.js";

const firebaseConfig = {
  apiKey: "AIzaSyCN_2ykJnRrf0VamKG1dT2fcJ-oFQzqfWU",
  authDomain: "hillaltchat.firebaseapp.com",
  databaseURL: "https://hillaltchat-default-rtdb.europe-west1.firebasedatabase.app",
  projectId: "hillaltchat",
  storageBucket: "hillaltchat.firebasestorage.app",
  messagingSenderId: "674583669453",
  appId: "1:674583669453:web:f2343dee4a4f41901ed784"
};

const appFirebase = initializeApp(firebaseConfig);
const db = getDatabase(appFirebase);
const storage = getStorage(appFirebase);
const messagesRef = dbRef(db, "messages");
/*********************** FIREBASE *************************/

/*********************** CONFIG UTILISATEUR *****************/
// Par défaut : Hillal. Si ta fiancée utilise le même fichier,
// change la valeur currentUserName à "Amel".
let currentUserName = "Hillal"; // <-- change manuellement si nécessaire
const avatar = {
  "Hillal": "hil.jpg",
  "Amel": "hana.jpeg"
};
const senderAudio = {
  "Hillal": "oaudio1.mp3",
  "Amel": "oaudio2.mp3"
};
/*********************** CONFIG UTILISATEUR *****************/

/*********************** SÉLECTION ELEMENTS DOM *************/
var app = document.querySelector('.app');
var content = document.querySelector('.content');
var photo = document.querySelector('.photo');
var nom = document.querySelector('.nom');
var theme = document.querySelector('.theme');
var clear = document.querySelector('.clear');
var textarea = document.querySelector("#textarea");
var envoyer = document.getElementById("envoyer"); // bouton envoyer
var filInput = document.getElementById('fil'); // input file (images)
var audioFileInput = document.getElementById('filaudio'); // optional audio file input
var videoFileInput = document.getElementById('filvideo'); // optional video file input

if (textarea) textarea.focus();
var mdpInput = document.querySelector("#mdp");
if (mdpInput) mdpInput.focus();

var entraiecrire = document.getElementById('entrainecrire');
var th = document.querySelectorAll('.th');
var compteur = document.getElementById('n');
var green = document.getElementById('green');
var coeur= document.querySelector('.coeur');
var cameravideo = document.querySelector(".video");
var quitter = document.querySelector(".quitter");
var quitteraudio = document.querySelector(".quitteraudio");
var divcoeur = document.querySelector(".divcoeur");
var containeraudio=document.querySelector('.containeraudio');
var areacoeur=document.querySelector('.areacoeur');
/*********************** SÉLECTION ELEMENTS DOM *************/

/*********************** VARIABLES *************************/
var texte = "";
var bip = ["oaudio1.mp3", "oaudio2.mp3"];
var picture = ["hil.jpg", "hana.jpeg"];
var user = ["Hillal", "Amel"];
var photcoeur = ["images.jpeg"];

var compteurhillal=0;
var compteuramel=0;
/*********************** VARIABLES *************************/

/*********************** UTIL - DATE ************************/
function formatDateNow(){
  const d = new Date();
  return d.toLocaleString("fr-FR", { weekday: "short", hour: "2-digit", minute: "2-digit" });
}
/*********************** UTIL - DATE ************************/

/*********************** ENVOI TEXTE VERS FIREBASE **********/
if(envoyer){
  envoyer.addEventListener("click", (e) => {
    e.preventDefault();
    const message = (textarea && textarea.value) ? textarea.value.trim() : "";
    if(message !== ""){
      push(messagesRef, {
        user: currentUserName,
        type: "text",
        text: message,
        date: new Date().toLocaleString()
      }).catch(err => console.error("Push text error:", err));
      if(textarea) textarea.value = "";
    }
  });
  // Envoi au "Enter"
  if(textarea){
    textarea.addEventListener("keydown", (ev) => {
      if(ev.key === "Enter" && !ev.shiftKey){
        ev.preventDefault();
        envoyer.click();
      }
    });
  }
}

/*********************** ENVOI FICHIER (IMAGE/AUDIO/VIDEO) **/
async function uploadAndSendFile(file, type){
  if(!file) return;
  try{
    const path = `${type}s/${Date.now()}_${file.name}`;
    const sref = storageRef(storage, path);
    const snapshot = await uploadBytes(sref, file);
    const url = await getDownloadURL(snapshot.ref);
    // push metadata to database
    await push(messagesRef, {
      user: currentUserName,
      type: type,
      url: url,
      name: file.name,
      size: file.size,
      date: new Date().toLocaleString()
    });
  }catch(err){
    console.error("Upload error:", err);
  }
}

// File inputs listeners (if input elements exist on the page)
if(filInput){
  filInput.addEventListener("change", (e) => {
    const f = e.target.files && e.target.files[0];
    if(f) uploadAndSendFile(f, "image");
    // reset to allow same file re-upload if needed
    e.target.value = "";
  });
}
if(audioFileInput){
  audioFileInput.addEventListener("change", (e) => {
    const f = e.target.files && e.target.files[0];
    if(f) uploadAndSendFile(f, "audio");
    e.target.value = "";
  });
}
if(videoFileInput){
  videoFileInput.addEventListener("change", (e) => {
    const f = e.target.files && e.target.files[0];
    if(f) uploadAndSendFile(f, "video");
    e.target.value = "";
  });
}
/*********************** ENVOI FICHIER ************************/

/*********************** RÉCEPTION MESSAGES EN TEMPS RÉEL *****/
function incrementCounterFor(userName){
  if(userName === "Hillal"){
    compteurhillal++;
    if(compteur) { compteur.textContent = compteurhillal; compteur.classList.add("nhillal"); }
  } else if(userName === "Amel"){
    compteuramel++;
    if(compteur) { compteur.textContent = compteuramel; compteur.classList.add("namel"); }
  }
}

onChildAdded(messagesRef, (data) => {
  const msg = data.val();
  if(!msg) return;
  try{
    const element = document.createElement("div");
    element.classList.add("message-item");

    // Common date (if provided) or generate
    const dateText = msg.date || formatDateNow();

    // Render by type
    if(msg.type === "text" || !msg.type){
      // text message
      if(msg.user === currentUserName){
        element.innerHTML = `
          <div class="bloc1">
            <div class="date">${dateText}</div>
            <div class="hillal">
              <div class="droite">${escapeHtml(msg.text)}</div>
              <img class="ph" src="${avatar[msg.user] || picture[0]}">
            </div>
          </div>`;
      } else {
        element.innerHTML = `
          <div class="bloc2">
            <div class="date">${dateText}</div>
            <div class="amel">
              <img class="ph" src="${avatar[msg.user] || picture[1]}">
              <div class="gauche">${escapeHtml(msg.text)}</div>
            </div>
          </div>`;
      }
      incrementCounterFor(msg.user);
    } else if(msg.type === "image"){
      if(msg.user === currentUserName){
        element.innerHTML = `
          <div class="bloc1">
            <div class="date">${dateText}</div>
            <div class="hillal">
              <div class="droite"><img class="shared-image" src="${msg.url}" alt="${escapeHtml(msg.name)}" /></div>
              <img class="ph" src="${avatar[msg.user] || picture[0]}">
            </div>
          </div>`;
      } else {
        element.innerHTML = `
          <div class="bloc2">
            <div class="date">${dateText}</div>
            <div class="amel">
              <img class="ph" src="${avatar[msg.user] || picture[1]}">
              <div class="gauche"><img class="shared-image" src="${msg.url}" alt="${escapeHtml(msg.name)}" /></div>
            </div>
          </div>`;
      }
      incrementCounterFor(msg.user);
    } else if(msg.type === "audio"){
      if(msg.user === currentUserName){
        element.innerHTML = `
          <div class="bloc1">
            <div class="date">${dateText}</div>
            <div class="hillal">
              <div class="droite"><audio controls src="${msg.url}"></audio></div>
              <img class="ph" src="${avatar[msg.user] || picture[0]}">
            </div>
          </div>`;
      } else {
        element.innerHTML = `
          <div class="bloc2">
            <div class="date">${dateText}</div>
            <div class="amel">
              <img class="ph" src="${avatar[msg.user] || picture[1]}">
              <div class="gauche"><audio controls src="${msg.url}"></audio></div>
            </div>
          </div>`;
      }
      incrementCounterFor(msg.user);
    } else if(msg.type === "video"){
      if(msg.user === currentUserName){
        element.innerHTML = `
          <div class="bloc1">
            <div class="date">${dateText}</div>
            <div class="hillal">
              <div class="droite"><video controls width="320" src="${msg.url}"></video></div>
              <img class="ph" src="${avatar[msg.user] || picture[0]}">
            </div>
          </div>`;
      } else {
        element.innerHTML = `
          <div class="bloc2">
            <div class="date">${dateText}</div>
            <div class="amel">
              <img class="ph" src="${avatar[msg.user] || picture[1]}">
              <div class="gauche"><video controls width="320" src="${msg.url}"></video></div>
            </div>
          </div>`;
      }
      incrementCounterFor(msg.user);
    } else {
      // fallback: show raw json
      element.innerHTML = `<pre>${escapeHtml(JSON.stringify(msg, null, 2))}</pre>`;
    }

    // double click to delete single message (local only)
    element.addEventListener("dblclick", () => {
      const cleartexte = confirm("Voulez-vous supprimer ce message localement ?");
      if(cleartexte === true){
        element.remove();
      }
    });

    content.appendChild(element);
    // auto-scroll
    content.scrollTop = content.scrollHeight;
  } catch(err){
    console.error("Render message error:", err);
  }
});
/*********************** RÉCEPTION MESSAGES *****************/

/*********************** GÉNÉRATEUR DE COEURS *****************/
function generercoeur(){
  var heat = setInterval(() => {
    var math = Math.random()*15+15+"px";
    var coeurrouge = document.createElement('i');
    coeurrouge.classList.add("fa-heart","fa","nouveaucoeur");
    coeurrouge.style.fontSize=math;
    coeurrouge.style.left= Math.random()*window.innerWidth +"px";
    coeur.appendChild(coeurrouge);
    setTimeout(() => coeurrouge.remove(), 9000);
  }, 50);

  // aussi envoyer une mention "coeur" dans la DB
  push(messagesRef, {
    user: currentUserName,
    type: "mention-heart",
    date: new Date().toLocaleString()
  }).catch(e => {});
}
/*********************** GÉNÉRATEUR DE COEURS *****************/

/*********************** AUDIO D'ALERTE ************************/
function audioh(){ new Audio(bip[0]).play().catch(()=>{}); }
function audioa(){ new Audio(bip[1]).play().catch(()=>{}); }
/*********************** AUDIO D'ALERTE ************************/

/*********************** CAMÉRA *******************************/
function kamera(){
  var x = { audio: true, video:{ width:1000, height:700 } };
  navigator.mediaDevices.getUserMedia(x)
  .then(function (y){
    var video = document.createElement("video");
    video.classList.add('blocvideo');
    video.srcObject = y;
    var tracks = video.srcObject.getTracks();
    content.appendChild(video);
    video.onloadedmetadata = function(){ video.play(); }

    quitter.addEventListener("dblclick", ()=>{
      var cameraout = confirm("Voulez-vous désactiver la caméra!!");
      if(cameraout === true){
        setTimeout(() => {
          tracks.forEach(t => t.stop());
          video.remove();
        }, 500);
      }
    });
  })
  .catch(function(err){
    console.log("Camera error:", err.name, err.message);
  });
}
/*********************** CAMÉRA *******************************/

/*********************** MICROPHONE **************************/
function microphone(){
  var xx = { audio: true };
  navigator.mediaDevices.getUserMedia(xx)
  .then(function(yy){
    var audio = document.createElement("audio");
    audio.srcObject = yy;
    var tracks = audio.srcObject.getTracks();
    containeraudio.appendChild(audio);
    containeraudio.style.opacity = "1";
    audio.onloadedmetadata = function(){ audio.play(); }

    quitteraudio.addEventListener("dblclick", ()=>{
      var microout = confirm("Voulez-vous désactiver le micro!!");
      if(microout === true){
        setTimeout(() => {
          containeraudio.style.opacity="0";
          // reset any timers or displays if needed
          tracks.forEach(t => t.stop());
          audio.remove();
        }, 500);
      }
    });
  })
  .catch(function(err){
    console.log("Micro error:", err.name, err.message);
  });

  calcul(); // lancer le minuteur pendant l'audio
}
/*********************** MICROPHONE **************************/

/*********************** LECTURE FICHIER (UI) *****************/
function lire(){
  // Lecture d'une image locale sélectionnée via input 'fil'
  if(!filInput) return;
  const file = filInput.files && filInput.files[0];
  if(!file) return;
  const reader = new FileReader();
  reader.onload = function(e){
    var imageinput = document.createElement('img');
    imageinput.src = e.target.result;
    imageinput.classList.add('image');
    content.appendChild(imageinput);

    imageinput.addEventListener("dblclick", ()=>{
      const li = document.createElement('div');
      li.classList.add('divli');
      li.innerHTML = `
        <li class="li"><i id="li1" class="fa fa-trash"></i><em>x</em></li>
        <li class="li"><i id="li2" class="fa fa-heart"></i></li>
      `;
      content.appendChild(li);
      li.addEventListener("click", (ev)=>{
        if(ev.target.id === "li1"){
          imageinput.remove();
          li.remove();
        }
        if(ev.target.id === "li2"){
          li.remove();
          generercoeur();
        }
      });
    });
  };
  reader.readAsDataURL(file);
}
/*********************** LECTURE FICHIER ************************/

/*********************** CLEAR ALL ***************************/
if(clear){
  clear.addEventListener("click", ()=>{
    const clearall = confirm("Voulez-vous supprimer tout!!");
    if(clearall === true){
      // Supprime le contenu local de la zone d'affichage (ne supprime pas la DB)
      while(content.firstChild){
        content.removeChild(content.firstChild);
      }
      compteurhillal=0;
      compteuramel=0;
      if(compteur) { compteur.textContent=""; compteur.classList.remove("nhillal","namel"); }
      if(textarea) textarea.focus();
    }
  });
}
/*********************** CLEAR ALL ***************************/

/*********************** THÈMES ******************************/
th.forEach((chacun)=>{
  chacun.addEventListener('click', (e)=>{
    app.classList.remove("noir", "gri", "pic1", "pic2");
    switch (e.target.id) {
      case "noir":
        app.classList.add('noir');
        break;
      case "gri":
        app.classList.add('gri');
        break;
      case "pic1":
        app.classList.add('pic1');
        break;
      case "pic2":
        app.classList.add('pic2');
        break;
      default:
        break;
    }
  });
});
/*********************** THÈMES ******************************/

/*********************** CALCUL (minuteur affichage) *********/
var calcul = ()=>{
  const italic = document.querySelector('.italic');
  if(italic){
    italic.style.fontSize="0.5rem";
    italic.style.marginRight="5px";
    italic.textContent = formatDateNow();
  }
  var cal=0; var second; var minute=0;
  var calinterval = setInterval(() => {
    cal++;
    if(cal<60) second = cal;
    else { cal = 0; second = cal; minute++; cal++; }
    if(second < 10) second = "0"+second;
    var affichage = minute + ":" + second;
    const p = document.querySelector("p");
    if(p) p.textContent = affichage;
    if(minute == 30){
      setTimeout(() => { clearInterval(calinterval); if(p) p.textContent = affichage; }, 2000);
    }
  }, 1000);
};
/*********************** CALCUL *******************************/

/*********************** UTIL - ESCAPE HTML *******************/
function escapeHtml(unsafe){
  if(!unsafe && unsafe !== "") return "";
  return String(unsafe)
    .replaceAll("&", "&amp;")
    .replaceAll("<","&lt;")
    .replaceAll(">","&gt;")
    .replaceAll('"',"&quot;")
    .replaceAll("'","&#039;");
}
/*********************** UTIL - ESCAPE HTML *******************/

/*********************** INIT SMALL FIXES *********************/
// Si le champ mdp existe, ouvrir l'app après mot de passe "0000"
if(mdpInput){
  mdpInput.addEventListener("input", (e)=>{
    if(e.target.value === "0000"){
      if(app) app.style.visibility = "visible";
      if(textarea) textarea.focus();
      mdpInput.style.display = "none";
    }
  });
}

// Mise à jour du nom/photo d'affichage selon currentUserName
if(nom) nom.textContent = currentUserName;
if(photo) photo.src = avatar[currentUserName] || picture[0];
/*********************** INIT *******************************/

/*********************** FONCTIONS D'AIDE *********************/
// Permet de changer l'utilisateur courant dynamiquement (si besoin)
function setUser(name){
  currentUserName = name;
  if(nom) nom.textContent = currentUserName;
  if(photo) photo.src = avatar[currentUserName] || picture[0];
}
// Exposer setUser globalement si tu veux l'appeler depuis la console HTML
window.setUser = setUser;
window.kamera = kamera;
window.microphone = microphone;
window.generercoeur = generercoeur;
window.lire = lire;
window.uploadAndSendFile = uploadAndSendFile;
/*********************** FONCTIONS D'AIDE *********************/
















