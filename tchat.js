
var app = document.querySelector('.app');
var content = document.querySelector('.content');
var photo = document.querySelector('.photo');
var nom = document.querySelector('.nom');
var theme = document.querySelector('.theme');
var clear = document.querySelector('.clear');
var textarea = document.querySelector("#textarea");
document.querySelector("#textarea").focus()
document.querySelector("#mdp").focus();
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

var texte="";
var bip = ["audio1.mp3", "audio2.mp3"];
var picture = ["hil.jpg", "hana.jpeg"];
var user = ["Hillal", "Amel"];
var photcoeur = ["images.jpeg"]

var compteurhillal=0;
var compteuramel=0;
document.getElementById('mdp').addEventListener("input", (e)=>{
    if(e.target.value ==="9524amell") {
        app.style.visibility="visible";
    document.querySelector("#textarea").focus()
    document.getElementById('mdp').style.display="none";
    }
})

/*********************date*************************** */
var date = new Date();
var date1 = date.toLocaleDateString("fr-Fr", {
    weekday:"short",
    hour:"numeric",
    minute:"numeric"
})
/*********************date*************************** */

/************************Audio*********************** */
function audioh(){
    var audio3 = new Audio();
    audio3.src =bip[0] ;
    audio3.play();
}
function audioa(){
    var audio4 = new Audio();
    audio4.src =bip[1];
    audio4.play();
}
/************************Audio*********************** */

/*************************input*********************** */

textarea.addEventListener('input', (e)=>{
    texte = e.target.value;

    if(texte[0]!==""){
        areacoeur.classList.add("classe");
        document.querySelector("#fil").style.visibility="hidden"
    }
       
    

    if(texte[0]==" "){
        entraiecrire.textContent=  "  ";
        entraiecrire.classList.remove('entrainecrire');  
    }
   if(!texte==" ") divcoeur.style.display="block"
   else divcoeur.style.display="none"
    if(texte[0]=="."){
        
        photo.src =  picture[0];
        nom.textContent=user[0];
        nom.classList.add('nomhillal');
        entraiecrire.textContent= user[0] + " entrain d'écrire";
        entraiecrire.classList.add('entrainecrire');
    }else{
        entraiecrire.textContent= user[1] + " entrain d'écrire";
        entraiecrire.classList.add('entrainecrire');
        }
envoyer.addEventListener("click", ()=>{

    areacoeur.classList.remove("classe");
        
    document.querySelector("#fil").style.visibility="visible"

        entraiecrire.textContent=  "";
        entraiecrire.classList.remove('entrainecrire');
        textarea.value.trim()
        document.querySelector("#textarea").focus();
        textarea.value = "";
        nom.classList.remove("nomhillal", "nomamel");
compteur.classList.remove("nhillal", "namel");
green.style.display="block";



    
if(texte[0] === "."){
    audioh();
    photo.src =  picture[0];
    nom.textContent=user[0];
    nom.classList.add('nomhillal');

    function aller0(){

        compteurhillal++;
        compteur.textContent= compteurhillal;
    }
    compteur.classList.add('nhillal');
    
}

else{ 
    audioa();
    photo.src =  picture[1];
    nom.textContent=user[1];
    nom.classList.add('nomamel'); 
    function aller1(){

        compteuramel++;
    compteur.textContent= compteuramel;
    
}
compteur.classList.add('namel')
}


var element = document.createElement('div');
content.appendChild(element);

if(texte == " ") { 

    texte.classList.remove("droite")
    texte.classList.remove("gauche")
}
 if(localStorage.getItem("ww")!=null){
    
if(texte[0] === "."){

     element.innerHTML=`
     <div class="bloc1">
     <div class="date">${date1}</div>
 <div class="hillal">
 <div class="droite">${ localStorage.getItem(ww)}</div>
 <img class="ph" src = ${picture[0]}>
 
 </div>
 </div>
 `
}else{
    element.innerHTML=`
    <div class="bloc2">
    <div class="date">${date1}</div>
    <div class="amel">
    <img class="ph" src = ${picture[0]}>
    <div class="gauche">${localStorage.getItem(ww)}</div>
    
    </div>
    </div>
    `   
}
 }
    localStorage.setItem("ww", texte);
    
texte=" ";

/*************************delet texte**************** */
element.addEventListener("dblclick", ()=>{

    var cleartexte = confirm("Voulez-vous supprimer ce message!!");
    if(cleartexte==true) element.remove()=" ";
})
/*************************delet texte**************** */
/*************************delet all**************** */
clear.addEventListener("click", ()=>{
 
    var clearall = confirm("Voulez-vous supprimer tout!!");
    if(clearall==true) {
        content.remove();
        compteurhillal=0;
        compteuramel=0;
        compteur.textContent=" ";
        document.querySelector("#textarea").focus();
        localStorage.clear();
    
        
        
    }
})
aller0()
aller1()

/*************************delet all**************** */
}) 
})
/*************************input*********************** */

/*************************théme*********************** */
th.forEach((chacun)=>{

     chacun.addEventListener('click', (e)=>{
         app.classList.remove("noir", "gri", "pic1", "pic2")
        switch (e.target.id) {
            case "noir":
        app.classList.add('noir')
                break;
                case "gri":
                    remove(goutte)
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
    })
 })
 /*************************théme*********************** */
 
/*************************generercoeur**************** */

function generercoeur(){

    var heat = setInterval(() => {
    var math = Math.random()*15+15+"px";
     var coeurrouge = document.createElement('i');
     coeurrouge.classList.add("fa-heart");
     coeurrouge.classList.add("fa");
     coeurrouge.classList.add("nouveaucoeur");
     coeurrouge.style.fontSize=math;
     coeurrouge.style.left= Math.random()*window.innerWidth +"px"; 

     coeur.appendChild(coeurrouge)

     setTimeout(() => {
         coeurrouge.remove()  
     }, 9000);
     setTimeout(() => {
         clearInterval(heat)   
     }, 3000);
    }, 50);
    
    /*******************************mention coeur********* */
    var element = document.createElement('div');
    content.appendChild(element);
    if(texte[0]=="."){
        
        element.innerHTML=`
        <div class="bloc1">
        <div class="date">${date1}</div>
        <div class="hillal">
        <i class="fa fa-heart"></i> 
<img class="ph" src = ${picture[0]}>

</div>
</div>
`
}else{
   element.innerHTML=`
   <div class="bloc2">
   <div class="date">${date1}</div>
   <div class="amel">
   <img class="ph" src = ${picture[1]}>
   <i class="fa fa-heart"></i>
   
   </div>
</div>
`}
/*************************delet texte**************** */
element.addEventListener("dblclick", ()=>{

    var cleartexte = confirm("Voulez-vous supprimer ce message!!");
    if(cleartexte==true) element.remove();
})
/*************************delet texte**************** */

}
/*******************************mention coeur********* */

/*************************generercoeur**************** */

var calcul=()=>{
    
    document.querySelector('.italic').style.fontSize="0.5rem";
    document.querySelector('.italic').style.marginRight="5px"
    document.querySelector('.italic').textContent=date1;
    var cal=0;
    var  second;
    var minute=0;

    var calinterval = setInterval(() => {
        cal++;
       if(cal<60) {
        second=cal;
        
       }else{
           cal=0;
           second=cal;
           minute++;
           cal++;
        }
      // if(minute<10) minute="0"+minute;
       if( second<10)  second="0"+ second;
       var affichage =  minute +":"+ second;
       document.querySelector("p").textContent=affichage;
       if(minute==30){
           
           setTimeout(() => {
            
               clearInterval(calinterval)
              
            
            document.querySelector("p").textContent=affichage
        }, 2000);
    }
    
}, 1000);
}
    /*********************************caméra********************   */
    function kamera(){
    
        var x = {audio: true,
    video:{width:1000, height:700}};
    
    navigator.mediaDevices.getUserMedia(x)
    .then(function (y){
      var video= document.createElement("video");
      video.classList.add('blocvideo')
      video.srcObject=y;
      var z = video.srcObject.getTracks()
      content.appendChild(video);
      video.onloadedmetadata=
      function (e){
        video.play()
    }
        
    quitter.addEventListener("dblclick", ()=>{
        var cameraout = confirm("Voulez-vous désactiver la caméra!!");
        if(cameraout==true) {
        setTimeout(() => {
            
            z[0].stop();
            z.forEach(a=>a.stop())
            video.remove();
        }, 5000);
    }
    
})
})
.catch(function(err){
    console.log(err.name+":"+err.message);
    
})

}

/*********************************caméra******************** */
/*******************audio*************************** */
function microphone(){
    
    var xx = {audio: true};
    
    navigator.mediaDevices.getUserMedia(xx)
    .then(function(yy){
        var audio= document.createElement("audio");
        
        audio.srcObject=yy;
        var zz = audio.srcObject.getTracks()
     containeraudio.appendChild(audio);
       
    
     containeraudio.style.opacity="1"
     audio.onloadedmetadata=
        function(e){
            audio.play()
        }
        quitteraudio.addEventListener("dblclick", ()=>{
            
            
            var microout = confirm("Voulez-vous désactiver le micro!!");
            if(microout==true) {
                setTimeout(() => {
                    
                    containeraudio.style.opacity="0"
                    cal=0;
                    second=cal;
                    minute=0
                    affichage=" "
                    document.querySelector("p").textContent=affichage
                    
                zz[0].stop();
                zz.forEach(a=>a.stop())
                audio.remove();
            }, 5000);
        }
      
    })
    
        })
        .catch(function(err){
            console.log(err.name+":"+err.message);
            
        })
        calcul()
    }
  
    /************************quitter *************************/

    /*************************lire un fichier**************** */

    function lire(){
  /*  var filinpute = document.getElementById('fil').files;
        var imageinput = document.createElement('img');
        imageinput.classList.add('image');
        content.appendChild(imageinput)
    if(filinpute.length>0){
        var lir = new FileReader();
        lir.onload= function (e){
            imageinput.setAttribute('src', e.target.result)
        }
        lir.readAsDataURL(filinpute[0])*/

        var filinpute = document.getElementById('fil').files[0]
        var lir = new FileReader()
        lir.onload= function (){
            localStirage.setItem('rc', lir.result)
        }
            if(filinpute){
               lir.readAsDataURL(filinpute) 
            }
        let pip= localStorage.getItem("rc")
        var imageinput = document.createElement('img')
        imageinput.src=pip
        imageinput.classList.add('image')
        content.appendChild(imageinput)
        
        
    /*************************delet fichier****************  */
    imageinput.addEventListener("dblclick", ()=>{ 

        var li = document.createElement('div')
        li.classList.add('divli')
        li.innerHTML = `
        <li class = "li" ><i id="li1" class="fa fa-trash"></i><em>x</em></li>
        <li class = "li"  ><i id="li2" class="fa fa-heart"></i></li>
        `
        content.appendChild(li)
        li.addEventListener("click", (e)=>{
            if(e.target.id=="li1") {
                imageinput.remove();
                li.remove();
            }
            if(e.target.id=="li2") {
                
                li.remove();
                generercoeur()
            }
            
        })
    })
    }}





    
