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




























