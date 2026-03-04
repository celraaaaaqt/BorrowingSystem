let equipment = JSON.parse(localStorage.getItem("equipment")) || [];
let history = JSON.parse(localStorage.getItem("history")) || [];
let editIndex = -1;

const sidebar=document.getElementById("sidebar");
const eqName=document.getElementById("eqName");
const eqCategory=document.getElementById("eqCategory");
const eqDesc=document.getElementById("eqDesc");
const eqQty=document.getElementById("eqQty");
const equipmentTable=document.getElementById("equipmentTable");
const borrowEquipment=document.getElementById("borrowEquipment");
const historyTable=document.getElementById("historyTable");
const previewArea=document.getElementById("previewArea");
const studentNumber=document.getElementById("studentNumber");
const borrowerName=document.getElementById("borrowerName");
const borrowQty=document.getElementById("borrowQty");
const dueDate=document.getElementById("dueDate");
const todayCount=document.getElementById("todayCount");
const overdueCount=document.getElementById("overdueCount");
const addBtn=document.getElementById("addBtn");

/* Sidebar */
function toggleMenu(){sidebar.classList.toggle("active");}
function scrollToSection(id){
document.getElementById(id).scrollIntoView({behavior:"smooth"});
if(window.innerWidth<=768){toggleMenu();}
}

/* Save */
function saveData(){
localStorage.setItem("equipment",JSON.stringify(equipment));
localStorage.setItem("history",JSON.stringify(history));
renderEquipment();
renderHistory();
updateDashboard();
}

/* add or update  */
function addEquipment(){

if(!eqName.value || !eqCategory.value || !eqDesc.value || !eqQty.value){
alert("Complete all fields");
return;
}

let quantity = parseInt(eqQty.value);

//validation for quantity
if(quantity <= 0){
alert("Quantity must be greater than 0. Negative numbers are not allowed.");
eqQty.value="";
return;
}

if(confirm(editIndex===-1?"Add this equipment?":"Update this equipment?")){

if(editIndex===-1){
equipment.push({
name:eqName.value,
category:eqCategory.value,
desc:eqDesc.value,
qty:quantity
});
}else{
equipment[editIndex]={
name:eqName.value,
category:eqCategory.value,
desc:eqDesc.value,
qty:quantity
};
editIndex=-1;
addBtn.innerHTML='<i class="fa-solid fa-plus"></i> Add Equipment';
}

eqName.value="";
eqCategory.value="";
eqDesc.value="";
eqQty.value="";
saveData();
}
}

function editEquipment(i){
eqName.value=equipment[i].name;
eqCategory.value=equipment[i].category;
eqDesc.value=equipment[i].desc;
eqQty.value=equipment[i].qty;
editIndex=i;
addBtn.innerHTML='<i class="fa-solid fa-pen"></i> Update Equipment';
document.getElementById("equipment").scrollIntoView({behavior:"smooth"});
}

function deleteEquipment(i){
if(confirm("Delete this equipment?")){
equipment.splice(i,1);
saveData();
}
}

function renderEquipment(){
equipmentTable.innerHTML="";
borrowEquipment.innerHTML="";
equipment.forEach((e,i)=>{
equipmentTable.innerHTML+=`
<tr>
<td>${e.name}</td>
<td>${e.category}</td>
<td>${e.desc}</td>
<td>${e.qty}</td>
<td>
<button class="warning" onclick="editEquipment(${i})"><i class="fa-solid fa-pen"></i></button>
<button class="danger" onclick="deleteEquipment(${i})"><i class="fa-solid fa-trash"></i></button>
</td>
</tr>`;
borrowEquipment.innerHTML+=`<option value="${i}">${e.name} (${e.qty})</option>`;
});
}

/* for search and sorting  */
function searchEquipment(){
let search=document.getElementById("eqSearch").value.toLowerCase();
equipmentTable.innerHTML="";
equipment.forEach((e,i)=>{
if(e.name.toLowerCase().includes(search)||e.category.toLowerCase().includes(search)){
equipmentTable.innerHTML+=`
<tr>
<td>${e.name}</td>
<td>${e.category}</td>
<td>${e.desc}</td>
<td>${e.qty}</td>
<td>
<button class="warning" onclick="editEquipment(${i})"><i class="fa-solid fa-pen"></i></button>
<button class="danger" onclick="deleteEquipment(${i})"><i class="fa-solid fa-trash"></i></button>
</td>
</tr>`;
}
});
}

function sortEquipmentList(){
let val=document.getElementById("sortEquipment").value;
if(val==="name"){equipment.sort((a,b)=>a.name.localeCompare(b.name));}
if(val==="qty"){equipment.sort((a,b)=>a.qty-b.qty);}
renderEquipment();
}

function searchHistory() {
  
  let search = document.getElementById("historySearch").value.toLowerCase();
  historyTable.innerHTML = "";
  
  history.forEach((h, i) => {
    
    let name = (h.name || "").toLowerCase();
    let student = (h.student || "").toLowerCase();
    let contact = (h.contact || "").toLowerCase();
    
    if (
      name.includes(search) ||
      student.includes(search) ||
      contact.includes(search)
    ) {
      
      let overdue = (h.status === "Borrowed" && new Date(h.due) < new Date()) ?
        "overdue" : "";
      
      historyTable.innerHTML += `
<tr class="${overdue}">
<td>${h.student || ""}</td>
<td>${h.name || ""}</td>
<td>${h.contact || ""}</td>
<td>${h.equipment}</td>
<td>${h.qty}</td>
<td>${h.date}</td>
<td>${h.due}</td>
<td>${h.status}</td>
<td>
${h.status==="Borrowed"
? `<button class="success" onclick="markReturned(${i})">
<i class="fa-solid fa-rotate-left"></i>
</button>`:""}
</td>
</tr>`;
    }
  });
}

function sortHistoryList(){
let val=document.getElementById("sortHistory").value;
if(val==="name"){history.sort((a,b)=>a.name.localeCompare(b.name));}
if(val==="qty"){history.sort((a,b)=>a.qty-b.qty);}
if(val==="date"){history.sort((a,b)=>new Date(b.date)-new Date(a.date));}
renderHistory();
}

/* for previewing after mag-borrow */
function previewTransaction(){

if(!studentNumber.value||!borrowerName.value||!contactNumber.value||!dueDate.value||!borrowQty.value){
alert("Complete fields");
return;
}

let index = borrowEquipment.value;
let qty = parseInt(borrowQty.value);

//negative validation
if(qty <= 0){
alert("Borrow quantity must be greater than 0.");
borrowQty.value="";
return;
}

/* limitation for quantity */
if(qty > 3){
alert("Maximum of 3 items only.");
return;
}

/* validation for stocks */
if(qty > equipment[index].qty){
alert("Not enough stock available.");
return;
}

previewArea.innerHTML=`
<p><b>Student #:</b> ${studentNumber.value}</p>
<p><b>Name:</b> ${borrowerName.value}</p>
<p><b>Equipment:</b> ${equipment[index].name}</p>
<p><b>Qty:</b> ${qty}</p>
<p><b>Due:</b> ${dueDate.value}</p>
<button class="success" onclick="confirmBorrow(${index},${qty})">
<i class="fa-solid fa-check"></i> Confirm
</button>`;
}

function confirmBorrow(index,qty){

if(confirm("Confirm borrowing?")){

let today=new Date().toISOString().split("T")[0];

equipment[index].qty-=qty;

history.push({
student:studentNumber.value,
name:borrowerName.value,
contact:contactNumber.value,
equipment:equipment[index].name,
qty,
date:today,
due:dueDate.value,
status:"Borrowed"
});

studentNumber.value="";
borrowerName.value="";
contactNumber.value="";
borrowQty.value="";
previewArea.innerHTML="";
saveData();
}
}

function renderHistory(){
historyTable.innerHTML="";

history.forEach((h,i)=>{

let overdue=(h.status==="Borrowed"&&new Date(h.due)<new Date())
?"overdue":"";

historyTable.innerHTML+=`
<tr class="${overdue}">
<td>${h.student}</td>
<td>${h.name}</td>
<td>${h.contact}</td>
<td>${h.equipment}</td>
<td>${h.qty}</td>
<td>${h.date}</td>
<td>${h.due}</td>
<td>${h.status}</td>
<td>
${h.status==="Borrowed"
? `<button class="success" onclick="markReturned(${i})">
<i class="fa-solid fa-rotate-left"></i>
</button>`:""}
</td>
</tr>`;
});
}
function markReturned(i){
history[i].status="Returned";
saveData();
}

function updateDashboard(){
let today=new Date().toISOString().split("T")[0];
todayCount.innerText=history.filter(h=>h.date===today).length;
overdueCount.innerText=history.filter(h=>h.status==="Borrowed"&&new Date(h.due)<new Date()).length;
}

function logout() {
            window.location.href = 'login.html'; 
        }
            const logoutButton = document.getElementById('logout');
            if (logoutButton) {
                logoutButton.addEventListener('click', logout);
            }
renderEquipment();
renderHistory();
updateDashboard();

  
