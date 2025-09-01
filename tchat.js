

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

if ("Notification" in window && Notification.permission !== "granted") {
  Notification.requestPermission();
}


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

// ----------------- PRÉSENCE EN LIGNE -----------------
import { set, onDisconnect, onValue } 
  from "https://www.gstatic.com/firebasejs/10.12.5/firebase-database.js";

// Référence "presence" dans Firebase
const presenceRef = dbRef(db, "presence/" + currentUserName);

// Marquer l’utilisateur actuel en ligne
set(presenceRef, { online: true, lastSeen: Date.now() });
// Retirer quand il ferme la page
onDisconnect(presenceRef).set({ online: false, lastSeen: Date.now() });

// Déterminer l’autre utilisateur
const otherUser = currentUserName === "Hillal" ? "Amel" : "Hillal";
const otherPresenceRef = dbRef(db, "presence/" + otherUser);

// Petit rond vert sur la photo si l’autre est en ligne
const onlineCircle = document.createElement("div");
onlineCircle.style.width = "12px";
onlineCircle.style.height = "12px";
onlineCircle.style.backgroundColor = "limegreen";
onlineCircle.style.border = "2px solid white";
onlineCircle.style.borderRadius = "50%";
onlineCircle.style.position = "absolute";
onlineCircle.style.bottom = "2px";
onlineCircle.style.right = "2px";
onlineCircle.style.display = "none";

if (photo && photo.parentNode) {
  photo.parentNode.style.position = "relative";
  photo.parentNode.appendChild(onlineCircle);
}

// Surveille la présence de l’autre
onValue(otherPresenceRef, (snap) => {
  const data = snap.val();
  if (data && data.online) {
    onlineCircle.style.display = "block";
  } else {
    onlineCircle.style.display = "none";
  }
});


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
})
  /*

// 🔔 Fonction pour déclencher une notification navigateur
function showNotification(title, body) {
  if (Notification.permission === "granted") {
    new Notification(title, { body });
  } else if (Notification.permission !== "denied") {
    Notification.requestPermission().then(permission => {
      if (permission === "granted") {
        new Notification(title, { body });
      }
    });
  }
}

onChildAdded(messagesRef, (snap) => {
  const msg = snap.val();
  if (!msg) return;

  try {
    const element = document.createElement('div');
    element.classList.add('message-item');
    const dateText = msg.date || formatDateNow();

    // TEXT
    if (msg.type === "text" || !msg.type) {
      if (msg.user === currentUserName) {
        // ✅ Ton message
        element.innerHTML = `
          <div class="bloc1">
            <div class="date">${escapeHtml(dateText)}</div>
            <div class="hillal">
              <div class="droite">${escapeHtml(msg.text)}</div>
              <img class="ph" src="${escapeHtml(avatar[msg.user] || picture[0])}">
            </div>
          </div>
        `;
        audioh();
      } else {
        // ✅ Message reçu
        element.innerHTML = `
          <div class="bloc2">
            <div class="date">${escapeHtml(dateText)}</div>
            <div class="amel">
              <img class="ph" src="${escapeHtml(avatar[msg.user] || picture[1])}">
              <div class="gauche">${escapeHtml(msg.text)}</div>
            </div>
          </div>
        `;
        audioa();
        showNotification("📩 Nouveau message", msg.text); // 🔔 notif
      }
      incrementCounterFor(msg.user);
    }

    // IMAGE
    else if (msg.type === "image") {
      if (msg.user === currentUserName) {
        element.innerHTML = `
          <div class="bloc1">
            <div class="date">${escapeHtml(dateText)}</div>
            <div class="hillal">
              <div class="droite"><img class="phshared" src="${escapeHtml(msg.url)}" /></div>
              <img class="ph" src="${escapeHtml(avatar[msg.user] || picture[0])}">
            </div>
          </div>
        `;
        audioh();
      } else {
        element.innerHTML = `
          <div class="bloc2">
            <div class="date">${escapeHtml(dateText)}</div>
            <div class="amel">
              <img class="ph" src="${escapeHtml(avatar[msg.user] || picture[1])}">
              <div class="gauche"><img class="phshared" src="${escapeHtml(msg.url)}" /></div>
            </div>
          </div>
        `;
        audioa();
        showNotification("📸 Nouvelle image", "Tu as reçu une photo."); // 🔔 notif
      }
      incrementCounterFor(msg.user);
    }

    // AUDIO
    else if (msg.type === "audio") {
      if (msg.user === currentUserName) {
        element.innerHTML = `
          <div class="bloc1">
            <div class="date">${escapeHtml(dateText)}</div>
            <div class="hillal">
              <div class="droite"><audio controls src="${escapeHtml(msg.url)}"></audio></div>
              <img class="ph" src="${escapeHtml(avatar[msg.user] || picture[0])}">
            </div>
          </div>
        `;
        audioh();
      } else {
        element.innerHTML = `
          <div class="bloc2">
            <div class="date">${escapeHtml(dateText)}</div>
            <div class="amel">
              <img class="ph" src="${escapeHtml(avatar[msg.user] || picture[1])}">
              <div class="gauche"><audio controls src="${escapeHtml(msg.url)}"></audio></div>
            </div>
          </div>
        `;
        audioa();
        showNotification("🎤 Nouveau vocal", "Tu as reçu un message audio."); // 🔔 notif
      }
      incrementCounterFor(msg.user);
    }

    // VIDEO
    else if (msg.type === "video") {
      if (msg.user === currentUserName) {
        element.innerHTML = `
          <div class="bloc1">
            <div class="date">${escapeHtml(dateText)}</div>
            <div class="hillal">
              <div class="droite"><video controls width="320" src="${escapeHtml(msg.url)}"></video></div>
              <img class="ph" src="${escapeHtml(avatar[msg.user] || picture[0])}">
            </div>
          </div>
        `;
        audioh();
      } else {
        element.innerHTML = `
          <div class="bloc2">
            <div class="date">${escapeHtml(dateText)}</div>
            <div class="amel">
              <img class="ph" src="${escapeHtml(avatar[msg.user] || picture[1])}">
              <div class="gauche"><video controls width="320" src="${escapeHtml(msg.url)}"></video></div>
            </div>
          </div>
        `;
        audioa();
        showNotification("🎬 Nouvelle vidéo", "Tu as reçu une vidéo."); // 🔔 notif
      }
      incrementCounterFor(msg.user);
    }

    // mention-heart
    else if (msg.type === "mention-heart") {
      if (msg.user === currentUserName) {
        element.innerHTML = `
          <div class="bloc1">
            <div class="date">${escapeHtml(dateText)}</div>
            <div class="hillal">
              <i class="fa fa-heart"></i>
              <img class="ph" src="${escapeHtml(avatar[msg.user] || picture[0])}">
            </div>
          </div>
        `;
        generercoeur();
      } else {
        element.innerHTML = `
          <div class="bloc2">
            <div class="date">${escapeHtml(dateText)}</div>
            <div class="amel">
              <img class="ph" src="${escapeHtml(avatar[msg.user] || picture[1])}">
              <i class="fa fa-heart"></i>
            </div>
          </div>
        `;
        generercoeur();
        showNotification("❤️ Réaction", "Tu as reçu un cœur."); // 🔔 notif
      }
      incrementCounterFor(msg.user);
    }

    // AUTRE TYPE
    else {
      element.innerHTML = `<pre>${escapeHtml(JSON.stringify(msg, null, 2))}</pre>`;
    }

    // Suppression locale au double-clic
    element.addEventListener("dblclick", () => {
      if (confirm("Voulez-vous supprimer ce message localement ?")) element.remove();
    });

    // ✅ Ajouter le message dans le tchat
    content.appendChild(element);
    content.scrollTop = content.scrollHeight;

  } catch (err) {
    console.error("Render message error:", err);
  }
});

*/


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
// ----------------- INDICATEUR "EN TRAIN D'ÉCRIRE" -----------------

// ----------------- INDICATEUR "EN TRAIN D'ÉCRIRE" -----------------

const typingRef = dbRef(db, "typing/" + currentUserName);
const otherTypingRef = dbRef(db, "typing/" + otherUser);

// 🔹 Quand j'écris, je mets à jour Firebase
if (textarea) {
  textarea.addEventListener("input", () => {
    set(typingRef, {
      isTyping: textarea.value.trim().length > 0,
      ts: Date.now()
    });
  });
}

// 🔹 Affiche bulle "3 points" (style WhatsApp/Facebook)
function showTypingBubble(sender) {
  let bubble = document.getElementById("typing-" + sender);
  if (!bubble) {
    bubble = document.createElement("div");
    bubble.id = "typing-" + sender;
    bubble.className = "typing-bubble";
    bubble.innerHTML = `
      <img src="${sender === "Hillal" ? avatar.Hillal : avatar.Amel}" 
           style="width:28px;height:28px;border-radius:50%;margin-right:6px">
      <div class="typing-dots"><span></span><span></span><span></span></div>
    `;
    content.appendChild(bubble);
    content.scrollTop = content.scrollHeight;
  }

  clearTimeout(bubble.timeout);
  bubble.timeout = setTimeout(() => bubble.remove(), 3000);
}

// 🔹 Surveille l’autre utilisateur
onValue(otherTypingRef, (snap) => {
  const data = snap.val();
  if (data && data.isTyping) {
    showTypingBubble(otherUser);
  } else {
    const bubble = document.getElementById("typing-" + otherUser);
    if (bubble) bubble.remove();
  }
});

// 🔹 CSS animation des 3 points
const styleTyping = document.createElement("style");
styleTyping.textContent = `
.typing-bubble {
  display: flex;
  align-items: center;
  gap: 4px;
  margin: 6px;
}
.typing-dots {
  background: #e5e5ea;
  border-radius: 18px;
  padding: 6px 10px;
  display: flex;
  gap: 4px;
}
.typing-dots span {
  width: 6px;
  height: 6px;
  background: #555;
  border-radius: 50%;
  animation: blink 1.4s infinite;
}
.typing-dots span:nth-child(2) { animation-delay: 0.2s; }
.typing-dots span:nth-child(3) { animation-delay: 0.4s; }

@keyframes blink {
  0%, 80%, 100% { opacity: 0.2; transform: translateY(0); }
  40% { opacity: 1; transform: translateY(-3px); }
}`;
document.head.appendChild(styleTyping);


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

// --- Étape 2 : Activer la caméra et le micro ---
const localVideo = document.getElementById("localVideo");

async function startLocalStream() {
  try {
    const stream = await navigator.mediaDevices.getUserMedia({
      video: true,
      audio: true
    });
    localVideo.srcObject = stream;
    console.log("✅ Caméra et micro activés");
    return stream;
  } catch (err) {
    console.error("❌ Erreur accès caméra/micro :", err);
  }
}

// Au démarrage de la page
startLocalStream();



  
 



















































































































































