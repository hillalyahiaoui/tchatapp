
// ====================
// Initialisation Firebase
// ====================
import { initializeApp } from "https://www.gstatic.com/firebasejs/10.12.2/firebase-app.js";
import { getDatabase, ref, push, onChildAdded } from "https://www.gstatic.com/firebasejs/10.12.2/firebase-database.js";

// Configuration Firebase (la tienne)
const firebaseConfig = {
  apiKey: "AIzaSyCN_2ykJnRrf0VamKG1dT2fcJ-oFQzqfWU",
  authDomain: "hillaltchat.firebaseapp.com",
  databaseURL: "https://hillaltchat-default-rtdb.europe-west1.firebasedatabase.app",
  projectId: "hillaltchat",
  storageBucket: "hillaltchat.firebasestorage.app",
  messagingSenderId: "674583669453",
  appId: "1:674583669453:web:f2343dee4a4f41901ed784"
};

// Initialiser Firebase
const app = initializeApp(firebaseConfig);
const db = getDatabase(app);

// Référence pour les messages
const messagesRef = ref(db, "messages");

// ====================
// Gestion du chat
// ====================

// Bouton envoyer
document.getElementById("envoyer").onclick = () => {
  const textarea = document.getElementById("textarea");
  const message = textarea.value.trim();
  if (message !== "") {
    // Envoi message vers Firebase
    push(messagesRef, {
      user: "Hillal", // ⚡ Ici tu peux mettre ton prénom
      text: message,
      time: Date.now()
    });
    textarea.value = "";
  }
};

// Réception des messages
onChildAdded(messagesRef, (snapshot) => {
  const data = snapshot.val();
  afficherMessage(data.user, data.text);
});

// ====================
// Fonction affichage
// ====================
function afficherMessage(user, msg) {
  const p = document.createElement("p");
  p.innerText = `${user}: ${msg}`;
  document.querySelector(".content").appendChild(p);
}


















