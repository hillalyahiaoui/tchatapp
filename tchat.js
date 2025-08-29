
// ======================== tchat.js (version finale) ========================
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
let currentUserName = localStorage.getItem("tchatUser") || "Hillal"; 

if (!localStorage.getItem("tchatUser")) {
  const who = prompt("Es-tu Hillal ou Amel ? (écris exactement le prénom)");
  if (who === "Amel" || who === "Hillal") {
    currentUserName = who;
    localStorage.setItem("tchatUser", who);
  }
}

setUser(currentUserName);

const avatar = { "Hillal": "hil.jpg", "Amel": "hana.jpeg" };
const bip = ["oaudio1.mp3", "oaudio2.mp3"];
const picture = ["hil.jpg", "hana.jpeg"];

// ----------------- SÉLECTION ELEMENTS DOM -----------------
var app = document.querySelector('.app');
var content = document.querySelector('.content');
var photo = document.querySelector('.photo');
var nom = document.querySelector('.nom');
var theme = document.querySelector('.theme');
var clear = document.querySelector('.clear');
var textarea = document.querySelector("#textarea");
var envoyer = document.getElementById("envoyer");
var filInput = document.getElementById('fil'); 
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
function formatDateNow() {
  const jours = ["Dim.", "Lun.", "Mar.", "Mer.", "Jeu.", "Ven.", "Sam."];
  const d = new Date();
  const jour = jours[d.getDay()];
  const heures = String(d.getHours()).padStart(2, '0');
  const minutes = String(d.getMinutes()).padStart(2, '0');
  return `${jour} ${heures}:${minutes}`;
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

if(nom) nom.textContent = currentUserName;
if(photo) photo.src = avatar[currentUserName] || picture[0];

// ----------------- INDICATEUR EN LIGNE -----------------

// Création dynamique du cercle vert
/*
var ggreen = document.createElement("div");
green.style.width = "15px";
green.style.height = "15px";
green.style.backgroundColor = "green";
green.style.borderRadius = "50%";
green.style.position = "absolute";
green.style.bottom = "2px";
green.style.right = "2px";
green.style.border = "2px solid white";
green.style.display = "none"; // caché par défaut
green.style.zIndex = "10";

// On insère le cercle dans le conteneur parent de la photo
if(photo && photo.parentNode){
  photo.parentNode.style.position = "relative"; // parent doit être relatif
  photo.parentNode.appendChild(ggreen);
}

// Référence à Firebase pour la présence
import { set, onDisconnect, onValue, ref as dbRef } from "https://www.gstatic.com/firebasejs/10.12.5/firebase-database.js";

function setUser(name){
  currentUserName = name;

  if(nom) nom.textContent = currentUserName;
  if(photo) photo.src = avatar[currentUserName] || picture[0];

  const onlineRef = dbRef(db, `online/${currentUserName}`);
  const otherUser = currentUserName === "Hillal" ? "Amel" : "Hillal";
  const otherOnlineRef = dbRef(db, `online/${otherUser}`);

  // Marquer cet utilisateur en ligne et retirer à la déconnexion
  set(onlineRef, true);
  onDisconnect(onlineRef).remove();

  // Surveille l'état de l'autre utilisateur
  onValue(otherOnlineRef, (snap) => {
    if(snap.exists()){
      ggreen.style.display = "block"; // l'autre est en ligne
    } else {
      ggreen.style.display = "none"; // l'autre est hors ligne
    }
  });
}

window.setUser = setUser;
setUser(currentUserName);

*/

// ----------------- UPLOAD & SEND FILE TO STORAGE -----------------
async function uploadAndSendFile(file){
  if(!file) return;
  let type = "file";
  if(file.type.startsWith("image/")) type = "image";
  else if(file.type.startsWith("audio/")) type = "audio";
  else if(file.type.startsWith("video/")) type = "video";

  const path = `${type}s/${Date.now()}_${file.name}`;
  const sref = storageRef(storage, path);

  try {
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
  } catch (err) {
    console.error("Upload error:", err);
  }
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

    element.addEventListener("dblclick", ()=>{ 
      if(confirm("Voulez-vous supprimer ce message localement ?")) element.remove();
    });

    content.appendChild(element);
    content.scrollTop = content.scrollHeight;
  }catch(err){
    console.error("Render message error:", err);
  }
});

// ----------------- GÉNÉRATEUR DE COEURS -----------------
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

  push(messagesRef, {
    user: currentUserName,
    type: "mention-heart",
    date: new Date().toLocaleString()
  }).catch(()=>{});
}

// ----------------- BOUTON UNIQUE ENVOYER -----------------
let pendingFile = null;

if(filInput){
  filInput.addEventListener("change", (e)=>{
    const file = e.target.files && e.target.files[0];
    if(file){
      pendingFile = file;
      if(file.type.startsWith("image/")){
        const reader = new FileReader();
        reader.onload = function(ev){
          const preview = document.createElement("img");
          preview.src = ev.target.result;
          preview.classList.add("phshared");
          preview.style.opacity = "0.7";
          content.appendChild(preview);
          content.scrollTop = content.scrollHeight;
        };
        reader.readAsDataURL(file);
      }
    }
    filInput.value = "";
  });
}

if(envoyer){
  envoyer.addEventListener("click", async (e)=>{
    e.preventDefault();
    const messageText = textarea?.value?.trim() || "";

    if(pendingFile){
      await uploadAndSendFile(pendingFile);
      pendingFile = null;
    }

    if(messageText !== ""){
      await push(messagesRef, {
        user: currentUserName,
        type: "text",
        text: messageText,
        date: new Date().toLocaleString()
      });
    }

    if(textarea){ textarea.value = ""; textarea.focus(); }
    if(entraiecrire){ entraiecrire.textContent = ""; entraiecrire.classList.remove('entrainecrire'); }
    if(divcoeur) divcoeur.style.display = "none";
  });

  textarea?.addEventListener("keydown", (ev) => {
    if(ev.key === "Enter" && !ev.shiftKey){
      ev.preventDefault();
      envoyer.click();
    }
  });
}

// ----------------- CLEAR ALL -----------------
if(clear){
  clear.addEventListener("click", ()=>{
    if(confirm("Voulez-vous supprimer tout!!")){
      while(content.firstChild) content.removeChild(content.firstChild);
      compteurhillal=0; compteuramel=0;
      if(compteur){ compteur.textContent=""; compteur.classList.remove("nhillal","namel"); }
      if(textarea) textarea.focus();
    }
  });
}

// ----------------- THEMES -----------------
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

// ----------------- INIT MOT DE PASSE -----------------
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
window.kamera = kamera;
window.microphone = microphone;


// ====== EMOJI PICKER (auto au focus + bouton) ======
(function setupEmojiPicker() {
  const ta = document.querySelector('#textarea');
  if (!ta) { console.warn('Emoji picker: #textarea introuvable'); return; }

  // on met le bouton près du textarea si possible
  const holder = document.querySelector('.areacoeur') || ta.parentNode;

  // Crée un petit bouton emoji (au cas où l’auto-ouverture ne se verrait pas)
  const emojiBtn = document.createElement('button');
  emojiBtn.type = 'button';
  emojiBtn.textContent = '😊';
  emojiBtn.style.marginLeft = '6px';
  emojiBtn.style.fontSize = '1.2rem';
  emojiBtn.style.cursor = 'pointer';
  emojiBtn.style.background = 'transparent';
  emojiBtn.style.border = 'none';
  holder.appendChild(emojiBtn);

  // Charge la librairie Emoji Button dynamiquement
  const s = document.createElement('script');
  s.src = 'https://cdn.jsdelivr.net/npm/@joeattardi/emoji-button@4.6.2/dist/index.min.js';
  s.defer = true;

  s.onload = () => {
    try {
      const picker = new EmojiButton({
        position: 'top-start',
        autoHide: false,
        zIndex: 99999
      });

      // Ouvrir au clic sur le bouton
      emojiBtn.addEventListener('click', () => {
        picker.togglePicker(emojiBtn);
      });

      // Ouvrir automatiquement quand tu cliques dans le textarea
      let opened = false;
      ta.addEventListener('focus', () => {
        if (!opened) picker.showPicker(emojiBtn);
      });

      picker.on('show', () => { opened = true; });
      picker.on('hide', () => { opened = false; });

      // Insérer l’emoji à la position du curseur
      picker.on('emoji', (selection) => {
        const emoji = selection.emoji || selection;
        const start = ta.selectionStart ?? ta.value.length;
        const end = ta.selectionEnd ?? ta.value.length;
        ta.value = ta.value.slice(0, start) + emoji + ta.value.slice(end);
        const pos = start + emoji.length;
        ta.setSelectionRange(pos, pos);
        ta.focus();
      });
    } catch (e) {
      console.error('Emoji picker init error:', e);
    }
  };

  s.onerror = () => console.error('Impossible de charger Emoji Button (CDN)');
  document.head.appendChild(s);
})();

    



























































