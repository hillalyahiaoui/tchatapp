
// ======================== tchat.js (ton code original + Firebase intégré) ========================
// Inclure dans le HTML : <script type="module" src="./tchat.js"></script>

// ----------------- IMPORT FIREBASE -----------------
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

// ----------------- CONFIG FIREBASE -----------------
const firebaseConfig = {
  apiKey: "AIzaSyCN_2ykJnRrf0VamKG1dT2fcJ-oFQzqfWU",
  authDomain: "hillaltchat.firebaseapp.com",
  databaseURL: "https://hillaltchat-default-rtdb.europe-west1.firebasedatabase.app",
  projectId: "hillaltchat",
  storageBucket: "hillaltchat.firebasestorage.app",
  messagingSenderId: "674583669453",
  appId: "1:674583669453:web:f2343dee4a4f41901ed784"
};

// initialise Firebase
const appFirebase = initializeApp(firebaseConfig);
const db = getDatabase(appFirebase);
const storage = getStorage(appFirebase);
const messagesRef = dbRef(db, "messages");

// ----------------- CONFIG UTILISATEUR -----------------
// Par défaut : Hillal. Si ta fiancée utilise le même fichier, change currentUserName à "Amel".
let currentUserName = "Hillal"; // tu peux changer dynamiquement avec window.setUser("Amel")
const avatar = { "Hillal": "hil.jpg", "Amel": "hana.jpeg" };
const bip = ["oaudio1.mp3", "oaudio2.mp3"];
const picture = ["hil.jpg", "hana.jpeg"];

// ----------------- SÉLECTION ELEMENTS DOM (ton HTML inchangé) -----------------
var app = document.querySelector('.app');
var content = document.querySelector('.content');
var photo = document.querySelector('.photo');
var nom = document.querySelector('.nom');
var theme = document.querySelector('.theme');
var clear = document.querySelector('.clear');
var textarea = document.querySelector("#textarea");
var envoyer = document.getElementById("envoyer");
var filInput = document.getElementById('fil'); // input file image
document.querySelector("#textarea")?.focus();
var mdpInput = document.querySelector("#mdp");

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

// ----------------- VARIABLES -----------------
var texte = "";
var photcoeur = ["images.jpeg"];
var compteurhillal=0;
var compteuramel=0;

// ----------------- UTIL - DATE -----------------
function formatDateNow(){
  const d = new Date();
  return d.toLocaleString("fr-FR", { weekday: "short", hour: "2-digit", minute: "2-digit" });
}

// ----------------- UTIL - ESCAPE HTML -----------------
function escapeHtml(unsafe){
  if(unsafe === null || unsafe === undefined) return "";
  return String(unsafe)
    .replaceAll("&", "&amp;")
    .replaceAll("<","&lt;")
    .replaceAll(">","&gt;")
    .replaceAll('"',"&quot;")
    .replaceAll("'","&#039;");
}

// ----------------- AUDIO HELPERS -----------------
function audioh(){ new Audio(bip[0]).play().catch(()=>{}); }
function audioa(){ new Audio(bip[1]).play().catch(()=>{}); }

// ----------------- SET/GET USER -----------------
function setUser(name){
  currentUserName = name;
  if(nom) nom.textContent = currentUserName;
  if(photo) photo.src = avatar[currentUserName] || picture[0];
}
window.setUser = setUser;

// initial UI user
if(nom) nom.textContent = currentUserName;
if(photo) photo.src = avatar[currentUserName] || picture[0];

// ----------------- ENVOI MESSAGE (PUSH DB) -----------------
if(envoyer){
  envoyer.addEventListener("click", (e)=>{
    e.preventDefault();
    const message = (textarea && textarea.value) ? textarea.value.trim() : "";
    if(message === "") return;
    // push into firebase only — onChildAdded affichera le message
    push(messagesRef, {
      user: currentUserName,
      type: "text",
      text: message,
      date: new Date().toLocaleString()
    }).catch(err => console.error("Push error:", err));
    // clear textarea and UI hints
    if(textarea) { textarea.value = ""; textarea.focus(); }
    if(entraiecrire){ entraiecrire.textContent = ""; entraiecrire.classList.remove('entrainecrire'); }
    if(divcoeur) divcoeur.style.display = "none";
  });

  // send on Enter (no shift)
  textarea?.addEventListener("keydown", (ev) => {
    if(ev.key === "Enter" && !ev.shiftKey){
      ev.preventDefault();
      envoyer.click();
    }
  });
}

// ----------------- UPLOAD & SEND FILE TO STORAGE -----------------
async function uploadAndSendFile(file){
  if(!file) return;
  try{
    // detect type
    let type = "file";
    if(file.type.startsWith("image/")) type = "image";
    else if(file.type.startsWith("audio/")) type = "audio";
    else if(file.type.startsWith("video/")) type = "video";
    const path = `${type}s/${Date.now()}_${file.name}`;
    const sref = storageRef(storage, path);
    const snapshot = await uploadBytes(sref, file);
    const url = await getDownloadURL(snapshot.ref);
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

// hook file input (existing in your HTML)
if(filInput){
  filInput.addEventListener("change", (e)=>{
    const f = e.target.files && e.target.files[0];
    if(f){
      // upload then DB
      uploadAndSendFile(f);
    }
    e.target.value = "";
  });
}

// ----------------- RENDER MESSAGE RECEIVED FROM DB -----------------
function incrementCounterFor(userName){
  if(userName === "Hillal"){
    compteurhillal++;
    if(compteur){ compteur.textContent = compteurhillal; compteur.classList.add("nhillal"); }
  } else if(userName === "Amel"){
    compteuramel++;
    if(compteur){ compteur.textContent = compteuramel; compteur.classList.add("namel"); }
  }
}

onChildAdded(messagesRef, (snap) => {
  const msg = snap.val();
  if(!msg) return;
  try{
    const element = document.createElement('div');
    element.classList.add('message-item');

    const dateText = msg.date || formatDateNow();

    // TEXT
    if(msg.type === "text" || !msg.type){
      if(msg.user === currentUserName){
        element.innerHTML=`
          <div class="bloc1">
            <div class="date">${escapeHtml(dateText)}</div>
            <div class="hillal">
              <div class="droite">${ escapeHtml(msg.text) }</div>
              <img class="ph" src="${escapeHtml(avatar[msg.user]||picture[0])}">
            </div>
          </div>
        `;
        audioh();
      } else {
        element.innerHTML=`
          <div class="bloc2">
            <div class="date">${escapeHtml(dateText)}</div>
            <div class="amel">
              <img class="ph" src="${escapeHtml(avatar[msg.user]||picture[1])}">
              <div class="gauche">${ escapeHtml(msg.text) }</div>
            </div>
          </div>
        `;
        audioa();
      }
      incrementCounterFor(msg.user);
    }
    // IMAGE
    else if(msg.type === "image"){
      if(msg.user === currentUserName){
        element.innerHTML=`
          <div class="bloc1">
            <div class="date">${escapeHtml(dateText)}</div>
            <div class="hillal">
              <div class="droite"><img class="phshared" src="${escapeHtml(msg.url)}" /></div>
              <img class="ph" src="${escapeHtml(avatar[msg.user]||picture[0])}">
            </div>
          </div>
        `;
        audioh();
      } else {
        element.innerHTML=`
          <div class="bloc2">
            <div class="date">${escapeHtml(dateText)}</div>
            <div class="amel">
              <img class="ph" src="${escapeHtml(avatar[msg.user]||picture[1])}">
              <div class="gauche"><img class="phshared" src="${escapeHtml(msg.url)}" /></div>
            </div>
          </div>
        `;
        audioa();
      }
      incrementCounterFor(msg.user);
    }
    // AUDIO
    else if(msg.type === "audio"){
      if(msg.user === currentUserName){
        element.innerHTML=`
          <div class="bloc1">
            <div class="date">${escapeHtml(dateText)}</div>
            <div class="hillal">
              <div class="droite"><audio controls src="${escapeHtml(msg.url)}"></audio></div>
              <img class="ph" src="${escapeHtml(avatar[msg.user]||picture[0])}">
            </div>
          </div>
        `;
        audioh();
      } else {
        element.innerHTML=`
          <div class="bloc2">
            <div class="date">${escapeHtml(dateText)}</div>
            <div class="amel">
              <img class="ph" src="${escapeHtml(avatar[msg.user]||picture[1])}">
              <div class="gauche"><audio controls src="${escapeHtml(msg.url)}"></audio></div>
            </div>
          </div>
        `;
        audioa();
      }
      incrementCounterFor(msg.user);
    }
    // VIDEO
    else if(msg.type === "video"){
      if(msg.user === currentUserName){
        element.innerHTML=`
          <div class="bloc1">
            <div class="date">${escapeHtml(dateText)}</div>
            <div class="hillal">
              <div class="droite"><video controls width="320" src="${escapeHtml(msg.url)}"></video></div>
              <img class="ph" src="${escapeHtml(avatar[msg.user]||picture[0])}">
            </div>
          </div>
        `;
        audioh();
      } else {
        element.innerHTML=`
          <div class="bloc2">
            <div class="date">${escapeHtml(dateText)}</div>
            <div class="amel">
              <img class="ph" src="${escapeHtml(avatar[msg.user]||picture[1])}">
              <div class="gauche"><video controls width="320" src="${escapeHtml(msg.url)}"></video></div>
            </div>
          </div>
        `;
        audioa();
      }
      incrementCounterFor(msg.user);
    }
    // mention-heart
    else if(msg.type === "mention-heart"){
      if(msg.user === currentUserName){
        element.innerHTML=`
          <div class="bloc1">
            <div class="date">${escapeHtml(dateText)}</div>
            <div class="hillal">
              <i class="fa fa-heart"></i>
              <img class="ph" src="${escapeHtml(avatar[msg.user]||picture[0])}">
            </div>
          </div>
        `;
        generercoeur();
      } else {
        element.innerHTML=`
          <div class="bloc2">
            <div class="date">${escapeHtml(dateText)}</div>
            <div class="amel">
              <img class="ph" src="${escapeHtml(avatar[msg.user]||picture[1])}">
              <i class="fa fa-heart"></i>
            </div>
          </div>
        `;
        generercoeur();
      }
      incrementCounterFor(msg.user);
    }
    else {
      element.innerHTML = `<pre>${escapeHtml(JSON.stringify(msg, null, 2))}</pre>`;
    }

    // double-click remove (local)
    element.addEventListener("dblclick", ()=>{
      var cleartexte = confirm("Voulez-vous supprimer ce message localement ?");
      if(cleartexte===true) element.remove();
    });

    content.appendChild(element);
    content.scrollTop = content.scrollHeight;
  }catch(err){
    console.error("Render message error:", err);
  }
});

// ----------------- GÉNÉRATEUR DE COEURS (existant) -----------------
function generercoeur(){
  var heat = setInterval(() => {
    var math = Math.random()*15+15+"px";
    var coeurrouge = document.createElement('i');
    coeurrouge.classList.add("fa-heart","fa","nouveaucoeur");
    coeurrouge.style.fontSize = math;
    coeurrouge.style.left = Math.random()*window.innerWidth +"px";
    coeur.appendChild(coeurrouge);
    setTimeout(() => coeurrouge.remove(), 9000);
  }, 50);

  // envoyer mention coeur dans DB pour que l'autre voie l'effet
  push(messagesRef, {
    user: currentUserName,
    type: "mention-heart",
    date: new Date().toLocaleString()
  }).catch(()=>{});
}

// ----------------- TIMMER / CALCUL (existant) -----------------
var calcul = ()=>{
  const italic = document.querySelector('.italic');
  if(italic){
    italic.style.fontSize="0.5rem";
    italic.style.marginRight="5px"
    italic.textContent = formatDateNow();
  }
  var cal=0; var second; var minute=0;
  var calinterval = setInterval(() => {
    cal++;
    if(cal<60) second = cal;
    else { cal = 0; second = cal; minute++; cal++; }
    if(second < 10) second = "0"+ second;
    var affichage = minute + ":" + second;
    const p = document.querySelector("p");
    if(p) p.textContent = affichage;
    if(minute==30){
      setTimeout(() => { clearInterval(calinterval); if(p) p.textContent = affichage; }, 2000);
    }
  }, 1000);
};

// ----------------- CAMERA (existant) -----------------
function kamera(){
  var x = {audio: true, video:{width:1000, height:700}};
  navigator.mediaDevices.getUserMedia(x)
  .then(function (y){
    var video= document.createElement("video");
    video.classList.add('blocvideo');
    video.srcObject = y;
    var z = video.srcObject.getTracks();
    content.appendChild(video);
    video.onloadedmetadata = function () { video.play(); }

    quitter.addEventListener("dblclick", ()=>{
      var cameraout = confirm("Voulez-vous désactiver la caméra!!");
      if(cameraout==true) {
        setTimeout(() => {
          z.forEach(a=>a.stop());
          video.remove();
        }, 500);
      }
    });
  })
  .catch(function(err){
    console.log(err.name+":"+err.message);
  });
}
window.kamera = kamera;

// ----------------- MICROPHONE (existant) -----------------
function microphone(){
  var xx = {audio: true};
  navigator.mediaDevices.getUserMedia(xx)
  .then(function(yy){
    var audio= document.createElement("audio");
    audio.srcObject=yy;
    var zz = audio.srcObject.getTracks()
    containeraudio.appendChild(audio);
    containeraudio.style.opacity="1"
    audio.onloadedmetadata = function(e){ audio.play() }

    quitteraudio.addEventListener("dblclick", ()=>{
      var microout = confirm("Voulez-vous désactiver le micro!!");
      if(microout==true) {
        setTimeout(() => {
          containeraudio.style.opacity="0"
          zz.forEach(a=>a.stop());
          audio.remove();
        }, 500);
      }
    });
  })
  .catch(function(err){
    console.log(err.name+":"+err.message);
  });

  calcul(); // lancer le minuteur pendant l'audio
}
window.microphone = microphone;

// ----------------- LIRE (existant) - modifié pour uploader -----------------
function lire(){
  if(!filInput) return;
  const file = filInput.files && filInput.files[0];
  if(!file) return;
  // upload and send to Firebase Storage + DB
  uploadAndSendFile(file);
  // optional: keep the old local preview logic commented out or remove
}
window.lire = lire;

// ----------------- CLEAR ALL (existant) -----------------
if(clear){
  clear.addEventListener("click", ()=>{
    const clearall = confirm("Voulez-vous supprimer tout!!");
    if(clearall==true) {
      while(content.firstChild) content.removeChild(content.firstChild);
      compteurhillal=0; compteuramel=0;
      if(compteur){ compteur.textContent=""; compteur.classList.remove("nhillal","namel"); }
      if(textarea) textarea.focus();
    }
  });
}

// ----------------- THEMES (existant) -----------------
th.forEach((chacun)=>{
  chacun.addEventListener('click', (e)=>{
    app.classList.remove("noir", "gri", "pic1", "pic2");
    switch (e.target.id) {
      case "noir": app.classList.add('noir'); break;
      case "gri": app.classList.add('gri'); break;
      case "pic1": app.classList.add('pic1'); break;
      case "pic2": app.classList.add('pic2'); break;
      default: break;
    }
  });
});

// ----------------- INIT (mot de passe "0000") -----------------
if(mdpInput){
  mdpInput.addEventListener("input", (e)=>{
    if(e.target.value === "5202"){
      if(app) app.style.visibility = "visible";
      if(textarea) textarea.focus();
      mdpInput.style.display = "none";
    }
  });
}

// expose helpers
window.generercoeur = generercoeur;
window.uploadAndSendFile = uploadAndSendFile;
window.setUser = setUser;

// =========================================================================================
// Fin du fichier
// =========================================================================================





















