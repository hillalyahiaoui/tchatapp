/*
// ======================== tchat.js (version finale corrigée) ========================
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
      date: formatDateNow()
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

    // Rendu selon type...
    // (inchangé sauf que msg.date est maintenant déjà formaté court)
    // ...
    // [code rendu messages inchangé de ta version précédente]
    // ...
    
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
    date: formatDateNow()
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
        date: formatDateNow()
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


*/

// ======================== tchat.js (version finale corrigée & complète) ========================
// Inclure dans le HTML : <script type="module" src="./tchat.js"></script>

// ----------------- IMPORT FIREBASE -----------------
import { initializeApp } from "https://www.gstatic.com/firebasejs/10.12.5/firebase-app.js";
import {
  getDatabase,
  ref as dbRef,
  push,
  onChildAdded,
  query,
  orderByChild
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
  try {
    const who = prompt("Es-tu Hillal ou Amel ? (écris exactement le prénom)");
    if (who === "Amel" || who === "Hillal") {
      currentUserName = who;
      localStorage.setItem("tchatUser", who);
    }
  } catch (e) {
    // prompt peut être bloqué ; on laisse Hillal par défaut
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
var coeur = document.querySelector('.coeur');
var cameravideo = document.querySelector(".video");
var quitter = document.querySelector(".quitter");
var quitteraudio = document.querySelector(".quitteraudio");
var divcoeur = document.querySelector(".divcoeur");
var containeraudio = document.querySelector('.containeraudio');
var areacoeur = document.querySelector('.areacoeur');

// fallback safe references
if (!content) content = document.createElement('div');

// ----------------- VARIABLES -----------------
var texte = "";
var photcoeur = ["images.jpeg"];
var compteurhillal = 0;
var compteuramel = 0;

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
function escapeHtml(unsafe) {
  if (unsafe === null || unsafe === undefined) return "";
  return String(unsafe)
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#039;");
}

// ----------------- AUDIO HELPERS -----------------
function audioh() { new Audio(bip[0]).play().catch(() => {}); }
function audioa() { new Audio(bip[1]).play().catch(() => {}); }

// ----------------- SET/GET USER -----------------
function setUser(name) {
  currentUserName = name;
  if (nom) nom.textContent = currentUserName;
  if (photo) photo.src = avatar[currentUserName] || picture[0];
}
window.setUser = setUser;

if (nom) nom.textContent = currentUserName;
if (photo) photo.src = avatar[currentUserName] || picture[0];

// ----------------- UPLOAD & SEND FILE TO STORAGE -----------------
async function uploadAndSendFile(file) {
  if (!file) return;
  let type = "file";
  if (file.type.startsWith("image/")) type = "image";
  else if (file.type.startsWith("audio/")) type = "audio";
  else if (file.type.startsWith("video/")) type = "video";

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
      date: formatDateNow()
    });
  } catch (err) {
    console.error("Upload error:", err);
    alert("Erreur lors de l'upload du fichier.");
  }
}

// ----------------- RENDER HELPERS -----------------
function incrementCounterFor(userName) {
  if (userName === "Hillal") {
    compteurhillal++;
    if (compteur) { compteur.textContent = compteurhillal; compteur.classList.add("nhillal"); }
  } else if (userName === "Amel") {
    compteuramel++;
    if (compteur) { compteur.textContent = compteuramel; compteur.classList.add("namel"); }
  }
}

function createMessageElementFromMsg(msg, key) {
  const element = document.createElement('div');
  element.classList.add('message-item');
  element.dataset.key = key || "";

  // header: avatar, name, date
  const header = document.createElement('div');
  header.className = 'mi-header';
  const img = document.createElement('img');
  img.className = 'mi-avatar';
  img.src = avatar[msg.user] || picture[0];
  img.alt = msg.user || 'user';
  img.onerror = () => { img.src = picture[0]; };

  const userSpan = document.createElement('span');
  userSpan.className = 'mi-user';
  userSpan.textContent = msg.user || 'Anonyme';

  const dateSpan = document.createElement('span');
  dateSpan.className = 'mi-date';
  dateSpan.textContent = msg.date || formatDateNow();

  header.appendChild(img);
  header.appendChild(userSpan);
  header.appendChild(dateSpan);
  element.appendChild(header);

  // body
  const body = document.createElement('div');
  body.className = 'mi-body';

  // handle text
  if (msg.type === 'text' && msg.text) {
    const p = document.createElement('p');
    p.className = 'mi-text';
    p.innerHTML = escapeHtml(msg.text).replace(/\n/g, "<br>");
    body.appendChild(p);
  }

  // image
  if ((msg.type === 'image' || msg.type === 'images') && (msg.url || msg.imageBase64)) {
    const wrapper = document.createElement('div');
    wrapper.className = 'mi-image-wrapper';
    const img2 = document.createElement('img');
    img2.className = 'mi-image';
    img2.src = msg.url || msg.imageBase64;
    img2.alt = msg.name || 'image';
    img2.style.maxWidth = '320px';
    img2.style.cursor = 'zoom-in';
    img2.addEventListener('click', () => {
      const w = window.open();
      if (w) w.document.write(`<img src="${img2.src}" style="max-width:100%;display:block;margin:auto;">`);
    });
    wrapper.appendChild(img2);
    body.appendChild(wrapper);
  }

  // audio
  if (msg.type === 'audio' && msg.url) {
    const aDiv = document.createElement('div');
    aDiv.className = 'mi-audio';
    const audioEl = document.createElement('audio');
    audioEl.controls = true;
    audioEl.src = msg.url;
    aDiv.appendChild(audioEl);
    body.appendChild(aDiv);
  }

  // video
  if (msg.type === 'video' && msg.url) {
    const vDiv = document.createElement('div');
    vDiv.className = 'mi-video';
    const videoEl = document.createElement('video');
    videoEl.controls = true;
    videoEl.src = msg.url;
    videoEl.style.maxWidth = '360px';
    vDiv.appendChild(videoEl);
    body.appendChild(vDiv);
  }

  // file (other)
  if (msg.type === 'file' && msg.url) {
    const fDiv = document.createElement('div');
    fDiv.className = 'mi-file';
    const link = document.createElement('a');
    link.href = msg.url;
    link.target = '_blank';
    link.rel = 'noopener noreferrer';
    link.textContent = msg.name ? `Télécharger : ${msg.name}` : 'Télécharger fichier';
    fDiv.appendChild(link);
    body.appendChild(fDiv);
  }

  // mention-heart or heart
  if (msg.type === 'mention-heart' || msg.type === 'heart') {
    const heartDiv = document.createElement('div');
    heartDiv.className = 'mi-heart';
    heartDiv.innerHTML = '<i class="fa fa-heart" aria-hidden="true"></i> ❤️';
    body.appendChild(heartDiv);
    // small visual effect
    try {
      const h = document.createElement('i');
      h.className = 'fa fa-heart nouveaucoeur';
      h.style.fontSize = Math.floor(Math.random()*18+12) + 'px';
      h.style.left = Math.random() * (window.innerWidth - 20) + 'px';
      coeur && coeur.appendChild(h);
      setTimeout(()=> h.remove(), 3500);
    } catch(e){}
  }

  element.appendChild(body);

  // footer actions (dblclick local remove)
  element.addEventListener("dblclick", () => {
    if (confirm("Voulez-vous supprimer ce message localement ?")) element.remove();
  });

  return element;
}

// ----------------- RÉCEPTION DES MESSAGES (ONCHILDADDED) -----------------
try {
  const messagesQuery = query(messagesRef, orderByChild('date')); // ordered by date string (short)
  onChildAdded(messagesQuery, (snap) => {
    const msg = snap.val();
    if (!msg) return;
    try {
      const el = createMessageElementFromMsg(msg, snap.key);
      content.appendChild(el);
      // increment counters and maybe play sound
      incrementCounterFor(msg.user);
      if (msg.user && msg.user !== currentUserName) audioh();
      content.scrollTop = content.scrollHeight;
    } catch (err) {
      console.error("Render message error:", err);
    }
  });
} catch (err) {
  console.error("Listener error:", err);
}

// ----------------- GÉNÉRATEUR DE COEURS -----------------
function generercoeur() {
  var heat = setInterval(() => {
    var math = Math.random()*15+15+"px";
    var coeurrouge = document.createElement('i');
    coeurrouge.classList.add("fa-heart","fa","nouveaucoeur");
    coeurrouge.style.fontSize = math;
    coeurrouge.style.left = Math.random()*window.innerWidth +"px";
    coeur && coeur.appendChild(coeurrouge);
    setTimeout(() => coeurrouge.remove(), 9000);
  }, 50);

  push(messagesRef, {
    user: currentUserName,
    type: "mention-heart",
    date: formatDateNow()
  }).catch(()=>{});
}
window.generercoeur = generercoeur;

// ----------------- BOUTON UNIQUE ENVOYER -----------------
let pendingFile = null;

if (filInput) {
  filInput.addEventListener("change", (e) => {
    const file = e.target.files && e.target.files[0];
    if (file) {
      pendingFile = file;
      if (file.type.startsWith("image/")) {
        const reader = new FileReader();
        reader.onload = function(ev) {
          const preview = document.createElement("img");
          preview.src = ev.target.result;
          preview.classList.add("phshared");
          preview.style.opacity = "0.7";
          preview.style.maxWidth = "220px";
          content.appendChild(preview);
          content.scrollTop = content.scrollHeight;
          setTimeout(()=> preview.remove(), 8000); // preview temporary
        };
        reader.readAsDataURL(file);
      } else {
        // for other types show filename
        const info = document.createElement('div');
        info.textContent = `Fichier prêt : ${file.name}`;
        info.className = 'file-ready';
        content.appendChild(info);
        content.scrollTop = content.scrollHeight;
        setTimeout(()=> info.remove(), 8000);
      }
    }
    // clear input to allow same file selection again
    filInput.value = "";
  });
}

if (envoyer) {
  envoyer.addEventListener("click", async (e) => {
    e.preventDefault();
    const messageText = textarea?.value?.trim() || "";

    // send pending file first
    if (pendingFile) {
      await uploadAndSendFile(pendingFile);
      pendingFile = null;
    }

    // send text
    if (messageText !== "") {
      await push(messagesRef, {
        user: currentUserName,
        type: "text",
        text: messageText,
        date: formatDateNow()
      });
    }

    if (textarea) { textarea.value = ""; textarea.focus(); }
    if (entraiecrire) { entraiecrire.textContent = ""; entraiecrire.classList.remove('entrainecrire'); }
    if (divcoeur) divcoeur.style.display = "none";
  });

  textarea?.addEventListener("keydown", (ev) => {
    if (ev.key === "Enter" && !ev.shiftKey) {
      ev.preventDefault();
      envoyer.click();
    }
  });
}

// ----------------- CLEAR ALL -----------------
if (clear) {
  clear.addEventListener("click", () => {
    if (confirm("Voulez-vous supprimer tout!!")) {
      while (content.firstChild) content.removeChild(content.firstChild);
      compteurhillal = 0; compteuramel = 0;
      if (compteur) { compteur.textContent = ""; compteur.classList.remove("nhillal", "namel"); }
      if (textarea) textarea.focus();
    }
  });
}

// ----------------- THEMES -----------------
try {
  th.forEach((chacun) => {
    chacun.addEventListener('click', (e) => {
      app.classList.remove("noir", "gri", "pic1", "pic2");
      const id = e.target.id || e.target.dataset.id;
      switch (id) {
        case "noir": app.classList.add('noir'); break;
        case "gri": app.classList.add('gri'); break;
        case "pic1": app.classList.add('pic1'); break;
        case "pic2": app.classList.add('pic2'); break;
        default: break;
      }
    });
  });
} catch (e) { /* ignore if elements missing */ }

// ----------------- INIT MOT DE PASSE -----------------
if (mdpInput) {
  mdpInput.addEventListener("input", (e) => {
    if (e.target.value === "5202") {
      if (app) app.style.visibility = "visible";
      if (textarea) textarea.focus();
      mdpInput.style.display = "none";
    }
  });
}

// ----------------- KAMERA (capture photo) -----------------
let kameraStream = null;
async function kamera() {
  try {
    if (!navigator.mediaDevices || !navigator.mediaDevices.getUserMedia) {
      alert("Caméra non disponible sur ce navigateur.");
      return;
    }
    kameraStream = await navigator.mediaDevices.getUserMedia({ video: true });
    const videoEl = document.createElement('video');
    videoEl.autoplay = true;
    videoEl.srcObject = kameraStream;
    videoEl.style.maxWidth = '320px';
    content.appendChild(videoEl);

    // capture button
    const capBtn = document.createElement('button');
    capBtn.textContent = 'Prendre photo';
    content.appendChild(capBtn);

    capBtn.addEventListener('click', () => {
      const canvas = document.createElement('canvas');
      canvas.width = videoEl.videoWidth || 640;
      canvas.height = videoEl.videoHeight || 480;
      const ctx = canvas.getContext('2d');
      ctx.drawImage(videoEl, 0, 0, canvas.width, canvas.height);
      canvas.toBlob(async (blob) => {
        if (blob) {
          const file = new File([blob], `camera_${Date.now()}.png`, { type: 'image/png' });
          await uploadAndSendFile(file);
          // cleanup
          stopKamera();
        }
      }, 'image/png');
    });

    // stop button
    const stopBtn = document.createElement('button');
    stopBtn.textContent = 'Annuler';
    content.appendChild(stopBtn);
    stopBtn.addEventListener('click', stopKamera);
  } catch (err) {
    console.error("kamera error:", err);
    alert("Erreur accès caméra.");
  }
}
function stopKamera() {
  if (kameraStream) {
    kameraStream.getTracks().forEach(t => t.stop());
    kameraStream = null;
  }
  // remove temporary nodes (simple approach)
  const videos = content.querySelectorAll('video');
  videos.forEach(v => v.remove());
  const btns = content.querySelectorAll('button');
  // careful: do not remove main UI buttons if they exist; remove only ones added by kamera (heuristic)
  btns.forEach(b => {
    if (b.textContent === 'Prendre photo' || b.textContent === 'Annuler') b.remove();
  });
}
window.kamera = kamera;

// ----------------- MICROPHONE (enregistrement simple) -----------------
let micStream = null;
let mediaRecorder = null;
let recordedChunks = [];
async function microphone() {
  try {
    if (!navigator.mediaDevices || !navigator.mediaDevices.getUserMedia) {
      alert("Micro non disponible.");
      return;
    }
    micStream = await navigator.mediaDevices.getUserMedia({ audio: true });
    mediaRecorder = new MediaRecorder(micStream);
    recordedChunks = [];

    mediaRecorder.ondataavailable = (e) => {
      if (e.data.size > 0) recordedChunks.push(e.data);
    };

    mediaRecorder.onstop = async () => {
      const blob = new Blob(recordedChunks, { type: 'audio/webm' });
      const file = new File([blob], `voice_${Date.now()}.webm`, { type: 'audio/webm' });
      await uploadAndSendFile(file);
      // cleanup
      stopMicrophone();
    };

    mediaRecorder.start();
    alert('Enregistrement démarré. Appelle stopMicrophone() dans la console ou clique sur Annuler pour arrêter.');

    // create stop button in UI
    const stopBtn = document.createElement('button');
    stopBtn.textContent = 'Arrêter enregistrement';
    content.appendChild(stopBtn);
    stopBtn.addEventListener('click', () => {
      if (mediaRecorder && mediaRecorder.state !== 'inactive') mediaRecorder.stop();
      stopBtn.remove();
    });
  } catch (err) {
    console.error("microphone error:", err);
    alert("Erreur accès micro.");
  }
}
function stopMicrophone() {
  if (mediaRecorder && mediaRecorder.state !== 'inactive') {
    mediaRecorder.stop();
  }
  if (micStream) {
    micStream.getTracks().forEach(t => t.stop());
    micStream = null;
  }
  const stopBtns = content.querySelectorAll('button');
  stopBtns.forEach(b => { if (b.textContent === 'Arrêter enregistrement') b.remove(); });
}
window.microphone = microphone;

// ----------------- EXPOSER HELPERS GLOBAL -----------------
window.uploadAndSendFile = uploadAndSendFile;
window.setUser = setUser;
window.kamera = kamera;
window.microphone = microphone;

// ----------------- FIN -----------------
console.log("tchat.js chargé — utilisateur:", currentUserName);


























