let equipment = JSON.parse(localStorage.getItem("equipment")) || [];
let history = JSON.parse(localStorage.getItem("history")) || [];
let reports = JSON.parse(localStorage.getItem("reports")) || [];

let editIndex = -1;

const sidebar=document.getElementById("sidebar");
const eqName=document.getElementById("eqName");
const contactNumber=document.getElementById("contactNumber");
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
let today = new Date().toISOString().split("T")[0];
dueDate.min = today;
const todayCount=document.getElementById("todayCount");
const overdueCount=document.getElementById("overdueCount");
const totalEquipments=document.getElementById("totalEquipments");
const addBtn=document.getElementById("addBtn");
const main = document.getElementById("main");

/* Sidebar */
function toggleMenu(){

if(window.innerWidth <= 768){
    sidebar.classList.toggle("active"); // mobile
}else{
    sidebar.classList.toggle("collapsed"); // desktop
    main.classList.toggle("collapsed");
}

}

/* Show only one section */
function showSection(id){
let sections = document.querySelectorAll(".section");

sections.forEach(sec => sec.classList.remove("active"));
document.getElementById(id).classList.add("active");

/* Auto close sidebar on mobile */
if(window.innerWidth <= 768){
sidebar.classList.remove("active");
}
}

function saveData(){
localStorage.setItem("equipment",JSON.stringify(equipment));
localStorage.setItem("history",JSON.stringify(history));
localStorage.setItem("reports",JSON.stringify(reports));
renderEquipment();
renderHistory();
renderReports();
updateDashboard();
renderChart();
}

//add or update
function addEquipment(){

let name = eqName.value.trim();
let quantity = parseInt(eqQty.value);

//required fielsd
if(!name || !eqCategory.value || !eqDesc.value || !eqQty.value){
  Swal.fire({
  toast: true,
  position: 'top-end',
  icon: 'warning',
  title: 'Please complete all fields.',
  showConfirmButton: false,
  timer: 2500,
  timerProgressBar: true
});
  return;
}
if(name.length < 3){
  Swal.fire({
  toast: true,
  position: 'top-end',
  icon: 'warning',
  title: 'Name should be at least 3 characters and above only.',
  showConfirmButton: false,
  timer: 2500,
  timerProgressBar: true
});
  return;
}

const equipmentNameRegex = /^[A-Za-z0-9ñÑ\s.\-']+$/;

if(!equipmentNameRegex.test(name)){
  Swal.fire({
  toast: true,
  position: 'top-end',
  icon: 'warning',
  title: 'Invalid equipment name.',
  showConfirmButton: false,
  timer: 2500,
  timerProgressBar: true
});
  return;
}

// Duplicate check
let exists = equipment.some((e, i) =>
  e.name.toLowerCase() === name.toLowerCase() && i !== editIndex
);

if(exists){
  Swal.fire({
  toast: true,
  position: 'top-end',
  icon: 'warning',
  title: 'Equipment name already exist.',
  showConfirmButton: false,
  timer: 2500,
  timerProgressBar: true
});
  return;
}

// Quantity validation
if(isNaN(quantity)){
  alert("Quantity must be a number.");
  return;
}

if(quantity <= 0){
  alert("Quantity must be greater than 0.");
  return;
}

if(quantity > 100){
  Swal.fire({
  toast: true,
  position: 'top-end',
  icon: 'warning',
  title: 'Quantity too large, please enter less than 100 only.',
  showConfirmButton: false,
  timer: 2500,
  timerProgressBar: true
});
  return;
}

// Category validation
const allowedCategories = ["SPORTS", "ICT EQUIPMENTS"];
if(!allowedCategories.includes(eqCategory.value)){
  alert("Invalid category.");
  return;
}

// Condition validation
const allowedConditions = ["GOOD", "BAD"];
if(!allowedConditions.includes(eqDesc.value)){
  alert("Invalid condition.");
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
Swal.fire({
  title: 'Are you sure?',
  text: 'This equipment will be deleted',
  icon: 'warning',
  showCancelButton: true,
  confirmButtonText: 'Yes, confirm'
}).then((result) => {
  if (result.isConfirmed) {
    Swal.fire({
  icon: 'success',
  title: 'Success!',
  text: 'Equipment deleted successfully!',
  timer: 2500,
  showConfirmButton: false
});
equipment.splice(i,1);

saveData();
}
});
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

// for search and sorting
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
${h.status==="Borrowed" ? `
<button class="success" onclick="markReturned(${i})">
<i class="fa-solid fa-rotate-left"></i>
</button>

<button class="danger" onclick="reportItemGroup('${first.student}', '${first.date}', '${first.contact}')">
  <i class="fa-solid fa-triangle-exclamation"></i>
</button>
` : ""}
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
  if(!studentNumber.value || !borrowerName.value || !contactNumber.value || !dueDate.value){
    Swal.fire({ icon:'warning', title:'Please complete all fields.' });
    return;
  }

  if(!validateInputs()) return;

  if(borrowItemsList.length === 0){
    Swal.fire({ icon:'warning', title:'Add at least one equipment.' });
    return;
  }

  let today = new Date();
  let selectedDate = new Date(dueDate.value);
  today.setHours(0,0,0,0);
  selectedDate.setHours(0,0,0,0);

  let maxDate = new Date();
  maxDate.setDate(today.getDate() + 7);
  if(selectedDate > maxDate){
    Swal.fire({ icon:'warning', title:'Maximum borrowing is 7 days only.' });
    return;
  }

  // Build preview HTML
  let itemsHtml = borrowItemsList.map(item => {
    let eq = equipment[item.index];
    return `<p>${eq.name} (Qty: ${item.qty})</p>`;
  }).join("");

  Swal.fire({
    title: 'Confirm Borrowing',
    html: `
      <div style="text-align:left; font-size:14px">
        <p><b>Student #:</b> ${studentNumber.value}</p>
        <p><b>Name:</b> ${borrowerName.value}</p>
        <p><b>Contact Number:</b> ${contactNumber.value}</p>
        <hr>
        ${itemsHtml}
        <p><b>Due Date:</b> ${dueDate.value}</p>
      </div>
    `,
    icon: 'info',
    showCancelButton: true,
    confirmButtonText: 'Confirm Borrow',
    cancelButtonText: 'Cancel',
    confirmButtonColor: '#22c55e',
    cancelButtonColor: '#ef4444'
  }).then(result => {
    if(result.isConfirmed){
      confirmBorrowMultiple();
    }
  });
}
function confirmBorrow(index, qty) {
  if (!validateInputs()) return;
  
  Swal.fire({
    title: 'Are you sure?',
    text: 'This will borrow the equipment.',
    icon: 'warning',
    showCancelButton: true,
    confirmButtonText: 'Yes, confirm'
  }).then((result) => {
    if (result.isConfirmed) {
      
      let today = new Date().toISOString().split("T")[0];
      
      // Prevent past due date
      if (dueDate.value < today) {
        Swal.fire({
          toast: true,
          position: 'top-end',
          icon: 'warning',
          title: 'Due date cannot be in the past',
          showConfirmButton: false,
          timer: 2000,
          timerProgressBar: true
        });
        return;
      }
      
      // Check if the student already borrowed this equipment and it's still Borrowed
      let existing = history.find(
        h =>
        h.student === studentNumber.value &&
        h.equipment === equipment[index].name &&
        h.status === "Borrowed"
      );
      
      if (existing) {
        // Merge quantity and update due date
        if (existing.qty + qty > equipment[index].qty) {
          Swal.fire({
            icon: 'success',
            position: 'top-end',
            icon: 'error',
            title: 'Not enough stock to add more',
            showConfirmButton: false,
            timer: 2000,
            timerProgressBar: true
          });
          return;
        }
        
        existing.qty += qty;
        existing.due = dueDate.value; // update due date
        
        Swal.fire({
          toast: true,
          position: 'top-end',
          icon: 'success',
          title: 'Borrow updated successfully!',
          showConfirmButton: false,
          timer: 2000,
          timerProgressBar: true
        });
        
      } else {
        // Add new borrow entry
        history.push({
  student: studentNumber.value,
  name: borrowerName.value,
  contact: contactNumber.value,
  items: borrowItemsList.map(item => ({
    name: equipment[item.index].name,
    qty: item.qty
  })),
  date: today,
  due: dueDate.value,
  status: "Borrowed"
});
        
        Swal.fire({
          icon: 'success',
          title: 'Success!',
          text: 'Equipment borrowed successfully!',
          timer: 2500,
          showConfirmButton: false
        });
      }
      
      // Deduct from stock
      equipment[index].qty -= qty;
      
      // Clear form
      studentNumber.value = "";
      borrowerName.value = "";
      contactNumber.value = "";
      borrowQty.value = "";
      previewArea.innerHTML = "";
      borrowEquipment.selectedIndex = 0;
      
      saveData();
    }
  });
}
function renderHistory() {
  historyTable.innerHTML = "";
  
  // Group history by student + date + contact
  let grouped = {};
  
  history.forEach(h => {
    let key = `${h.student}_${h.date}_${h.contact}`; // unique transaction
    if (!grouped[key]) grouped[key] = [];
    grouped[key].push(h); // push each item
  });
  
  Object.values(grouped).forEach(group => {
    let first = group[0];
    let overdue = (first.status === "Borrowed" && new Date(first.due) < new Date()) ? "overdue" : "";
    
    // equipment list
    let equipmentList = first.items ?
      first.items.map(i => `${i.name} (x${i.qty})`).join(", ") :
      group.map(g => `${g.equipment} (x${g.qty})`).join(", ");
    
    // total quantity
    let totalQty = first.items ?
      first.items.reduce((sum, item) => sum + item.qty, 0) :
      group.reduce((sum, g) => sum + g.qty, 0);
    
    historyTable.innerHTML += `
      <tr class="${overdue}">
        <td>${first.student}</td>
        <td>${first.name}</td>
        <td>${first.contact}</td>
        <td>${equipmentList}</td>
        <td>${totalQty}</td>
        <td>${first.date}</td>
        <td>${first.due}</td>
        <td>${first.status}</td>
        <td>
          ${first.status === "Borrowed" ? `
          <button class="success" onclick="markReturnedGroup('${first.student}', '${first.date}', '${first.contact}')">
            <i class="fa-solid fa-rotate-left"></i>
          </button>
          <button class="danger" onclick="reportItemGroup('${first.student}', '${first.date}', '${first.contact}')">
            <i class="fa-solid fa-triangle-exclamation"></i>
          </button>` : ""}
        </td>
      </tr>
    `;
  });
}
function markReturnedGroup(student, date, contact) {
  Swal.fire({
    title: 'Are you sure?',
    text: 'This will mark all items in this transaction as returned',
    icon: 'warning',
    showCancelButton: true,
    confirmButtonText: 'Yes, confirm'
  }).then((result) => {
    if (result.isConfirmed) {
      // Find all history entries for this transaction
      history.forEach(h => {
        if (h.student === student && h.date === date && h.contact === contact) {
          h.status = "Returned";
          
          // Restore stock for each item if using multi-item
          if (h.items) {
            h.items.forEach(item => {
              let eq = equipment.find(e => e.name === item.name);
              if (eq) eq.qty += item.qty;
            });
          } else {
            // Single-item borrow
            let eq = equipment.find(e => e.name === h.equipment);
            if (eq) eq.qty += h.qty;
          }
        }
      });
      
      Swal.fire({
        icon: 'success',
        title: 'Success!',
        text: 'Marked as returned successfully!',
        timer: 2500,
        showConfirmButton: false
      });
      
      saveData();
      renderHistory();
    }
  });
}
function updateDashboard(){
let today=new Date().toISOString().split("T")[0];

todayCount.innerText=history.filter(h=>h.date===today).length;

overdueCount.innerText=history.filter(h=>h.status==="Borrowed"&&new Date(h.due)<new Date()).length;

totalEquipments.innerText = equipment.length;
}

function logout() {
    let confirmLogout = confirm("Are you sure you want to log out?");
    
    if (confirmLogout) {
        window.location.href = 'login.html';
    }
}

document.getElementById("logout").onclick = logout;

function getChartData(){
  let borrowed = 0;
  let returned = 0;
  let reported = 0;
  
  history.forEach(h => {
    if(h.status === "Borrowed")
    borrowed++;
    if(h.status === "Returned")
    returned++;
    if(h.status === "Reported")
    reported++;
  });
  
  return { borrowed, returned, reported};
  }

let chart;

function renderChart(){
  const ctx = document.getElementById("borrowChart");
  
  const data = getChartData();
  
  if (chart){
    chart.destroy();
  }
  
chart = new Chart(ctx, {
  type: "bar",
  data: {
    labels: ['Borrowed', 'Returned', 'Reported'],
    datasets: [
  {
    label: 'Borrowed',
    data: [data.borrowed, 0, 0], // 0 for "Returned" bar
    backgroundColor: '#3b82f6',
    borderColor: '#1e40af',
    borderWidth: 2
  },
  {
    label: 'Returned',
    data: [0, data.returned, 0], // 0 for "Borrowed" bar
    backgroundColor: '#22c55e',
    borderColor: '#166534',
    borderWidth: 2
  },
  {
  label: 'Reported',
  data: [0, 0, data.reported], // 0 for "Borrowed" bar
  backgroundColor: 'red',
  borderColor: '#166534',
  borderWidth: 2
}
]
  },
  options: {
    responsive: true,
    scales: {
      y: {
        ticks: {
          color: 'white'
        }
      },
      x: {
        ticks: {
          color: 'white'
        }
      }
    },
    plugins: {
      legend: {
        labels: {
          color: 'white'
        }
      },
      tooltip: {
        titleColor: 'white',
        bodyColor: 'white'
      }
    }
  }
});
}

function validateInputs(){
  
  let valid = true;
  
  document.querySelectorAll("input").forEach(input => {
    input.classList.remove("input-error");
  });
  
  document.querySelectorAll(".error-text").forEach(e=>e.innerText = "");
  
  const contactRegex = /^\d{11}$/;
  
  if(!contactRegex.test(contactNumber.value)){
    contactNumber.classList.add("input-error");
    
    document.getElementById("contactError").innerText = " *Must be 11 digits";
    valid = false;
    
  }
  
  const nameRegex = /^[A-Za-zñÑ\s.\-']+$/;
  
  if(!nameRegex.test(borrowerName.value)){
    borrowerName.classList.add("input-error");
    
    document.getElementById("borrowerNameError").innerText = " *Invalid name format.";
    valid = false;
  }
  
  const studentNumRegex = /^\d{8}-(N|C)$/;
  
  if(!studentNumRegex.test(studentNumber.value)){
    studentNumber.classList.add("input-error");
    
    document.getElementById("studentError").innerText = " *Student number must be 8 digits followed by -N or -C";
    valid = false;
  }
  return valid;
}

function clearBorrowFields(){
  
  Swal.fire({
  title: 'Are you sure?',
  text: 'This will clear all the input fields.',
  icon: 'warning',
  showCancelButton: true,
  confirmButtonText: 'Yes, confirm'
}).then((result) => {
  if (result.isConfirmed) {
    
    studentNumber.value ="";
    borrowerName.value ="";
    contactNumber.value ="";
    dueDate.value = "";
    borrowQty.value = "";
    borrowEquipment.selectedIndex = 0;
    
    previewArea.innerHTML = "";
    
    document.querySelectorAll("input, select").forEach(el => {
      el.classList.remove("input-error");
    });
    
    document.querySelectorAll(".error-text").forEach (e => {
    e.innerText = "";
    });
  }
  });
}

function reportItemGroup(student, date, contact) {
  // Get all history entries for this transaction
  let entries = history.filter(h =>
    h.student === student &&
    h.date === date &&
    h.contact === contact &&
    h.status === "Borrowed"
  );
  
  if (entries.length === 0) {
    Swal.fire({ icon: 'info', title: 'No items to report' });
    return;
  }
  
  // Flatten all items uniquely
  let flatItems = [];
  let seen = new Set();
  
  entries.forEach(h => {
    if (h.items && h.items.length > 0) {
      h.items.forEach(item => {
        let key = `${item.name}_${item.qty}`;
        if (!seen.has(key)) {
          flatItems.push({
            student: h.student,
            name: h.name,
            contact: h.contact,
            equipment: item.name,
            qty: item.qty,
            date: h.date,
            entry: h
          });
          seen.add(key);
        }
      });
    } else {
      let key = `${h.equipment}_${h.qty}`;
      if (!seen.has(key)) {
        flatItems.push(h);
        seen.add(key);
      }
    }
  });
  
  // Build HTML for each item
  let html = '<div style="text-align:left">';
  flatItems.forEach((h, i) => {
    html += `
      <p><b>${h.equipment} (Qty: ${h.qty})</b></p>
      <label>Issue Type</label>
      <select id="reportType${i}" class="swal2-input">
        <option value="">No issue</option>
        <option value="Damaged">Damaged</option>
        <option value="Lost">Lost</option>
        <option value="Destroyed">Destroyed</option>
      </select>
      <label>Remarks</label>
      <textarea id="reportNote${i}" class="swal2-textarea" placeholder="Describe what happened..."></textarea>
      <hr>
    `;
  });
  html += '</div>';
  
  Swal.fire({
    title: 'Report Issues',
    html: html,
    confirmButtonText: 'Submit Report',
    showCancelButton: true,
    confirmButtonColor: '#ef4444',
    preConfirm: () => {
      let result = [];
      for (let i = 0; i < flatItems.length; i++) {
        let type = document.getElementById(`reportType${i}`).value;
        let note = document.getElementById(`reportNote${i}`).value;
        if (type) {
          result.push({ itemIndex: i, type, note });
        }
      }
      return result;
    }
  }).then((res) => {
    if (res.isConfirmed) {
      let reported = res.value;
      if (reported.length === 0) {
        Swal.fire({ icon: 'info', title: 'No items selected for reporting' });
        return;
      }
      
      reported.forEach(r => {
        let h = flatItems[r.itemIndex];
        
        reports.push({
          student: h.student,
          name: h.name,
          equipment: h.equipment,
          qty: h.qty,
          type: r.type,
          note: r.note,
          date: new Date().toISOString().split("T")[0]
        });
        
        // mark as reported in history
        let histIndex = history.findIndex(x =>
          x.student === h.student &&
          x.date === h.date &&
          ((x.equipment === h.equipment) || (x.items && x.items.some(it => it.name === h.equipment))) &&
          x.contact === h.contact &&
          x.status === "Borrowed"
        );
        if (histIndex !== -1) {
          history[histIndex].status = "Reported";
        }
      });
      
      Swal.fire({
        icon: 'success',
        title: 'Report submitted!',
        timer: 2000,
        showConfirmButton: false
      });
      
      saveData();
      renderHistory();
      renderReports();
    }
  });
}function renderReports(){
let table = document.getElementById("reportTable");
if(!table) return;

reports.forEach(r=>{
table.innerHTML += `
<tr>
<td>${r.student}</td>
<td>${r.name}</td>
<td>${r.equipment}</td>
<td>${r.qty}</td>
<td><span class="badge danger">${r.type}</span></td>
<td>${r.note || "-"}</td>
<td>${r.date}</td>
</tr>`;
});
}
function searchReports(){
let search = document.getElementById("reportSearch").value.toLowerCase();
let table = document.getElementById("reportTable");
table.innerHTML = "";

reports.forEach(r=>{
if(
r.name.toLowerCase().includes(search) ||
r.equipment.toLowerCase().includes(search)
){
table.innerHTML += `
<tr>
<td>${r.student}</td>
<td>${r.name}</td>
<td>${r.equipment}</td>
<td>${r.qty}</td>
<td>${r.type}</td>
<td>${r.note || "-"}</td>
<td>${r.date}</td>
</tr>`;
}
});
}

let borrowItemsList = []; // stores { index, qty }

function addBorrowItem() {
  let index = borrowEquipment.value;
  let qty = parseInt(borrowQty.value);
  
  if (index === "" || isNaN(qty) || qty <= 0) {
    Swal.fire({ icon: 'warning', title: 'Select equipment and enter valid quantity.' });
    return;
  }
  
  // check if already added
  if (borrowItemsList.some(item => item.index == index)) {
    Swal.fire({ icon: 'warning', title: 'This equipment is already added.' });
    return;
  }
  
  if (borrowItemsList.length >= 3) {
    Swal.fire({ icon: 'warning', title: 'You can only borrow up to 3 equipments at once.' });
    return;
  }
  
  if (qty > 3) {
    Swal.fire({ icon: 'warning', title: 'You can only borrow up to 3 quantity per equipment.' });
    return;
  }
  
  // check stock
  if (qty > equipment[index].qty) {
    Swal.fire({ icon: 'warning', title: 'Not enough stock available.' });
    return;
  }
  
  //confirmation before adding
  Swal.fire({
    title: 'Confirm Borrow',
    html: `Add <b>${equipment[index].name}</b> with a quantity of <b>${qty}</b> to your borrow list?`,
    icon: 'question',
    showCancelButton: true,
    confirmButtonText: 'Yes, add',
    cancelButtonText: 'Cancel',
    confirmButtonColor: '#22c55e',
    cancelButtonColor: '#ef4444'
  }).then((result) => {
    if (result.isConfirmed) {
      // add to borrow list
      borrowItemsList.push({ index, qty });
      renderBorrowItems();
      
      Swal.fire({
        icon: 'success',
        title: 'Added!',
        text: `${equipment[index].name} (Qty: ${qty}) has been added to your borrow list.`,
        timer: 2000,
        showConfirmButton: false,
        toast: true,
        position: 'top-end'
      });
    }
  });
}

function renderBorrowItems() {
  let container = document.getElementById("borrowItems");
  container.innerHTML = "";

  borrowItemsList.forEach((item, i) => {
    let eq = equipment[item.index];
    container.innerHTML += `
      <div class="borrow-item">
        <span>${eq.name} (Qty: ${item.qty})</span>
        
        <button style="background-color: blue; margin-right:5px;" type="button" onclick="editBorrowItem(${i})">Edit</button>
        
        <button style="background-color: red;" type="button" onclick="removeBorrowItem(${i})">Remove</button>
      </div>
    `;
  });

  // hide single select if items added
  borrowQty.value = "";
}

function editBorrowItem(i) {
  let item = borrowItemsList[i];
  
  let equipmentOptions = equipment.map((eq, index) => {
    // Calculate remaining stock after other borrowItems (excluding this row)
    const remainingQty = eq.qty - borrowItemsList
      .filter((bItem, idx) => idx !== i && bItem.index === index)
      .reduce((sum, bItem) => sum + bItem.qty, 0);
    
    // Disable if already in borrowItemsList (excluding this row) OR no remaining stock
    const disabled = (borrowItemsList.some((bItem, idx) => idx !== i && bItem.index === index) || remainingQty <= 0) ?
      'disabled' : '';
    
    const selected = index === item.index ? 'selected' : '';
    return `<option value="${index}" ${selected} ${disabled}>${eq.name} (Available: ${remainingQty})</option>`;
  }).join('');
  
  Swal.fire({
    title: 'Edit Borrowed Item',
    html: `
      <label for="swal-equipment">Equipment:</label>
      <select id="swal-equipment" class="swal2-select" style="width: 100%; margin-bottom: 10px;">
        ${equipmentOptions}
      </select>
      <label for="swal-qty">Quantity (1-3):</label>
      <input id="swal-qty" type="number" min="1" max="3" value="${item.qty}" class="swal2-input">
    `,
    showCancelButton: true,
    confirmButtonText: 'Update',
    cancelButtonText: 'Cancel',
    preConfirm: () => {
      const selectedIndex = parseInt(document.getElementById('swal-equipment').value);
      const newQty = parseInt(document.getElementById('swal-qty').value);
      
      // Quantity validation: 1 to 3
      if (isNaN(newQty) || newQty < 1 || newQty > 3) {
        Swal.showValidationMessage('Quantity must be between 1 and 3.');
        return false;
      }
      
      // Check if the selected equipment is already in borrow list (excluding this row)
      if (borrowItemsList.some((bItem, idx) => idx !== i && bItem.index === selectedIndex)) {
        Swal.showValidationMessage('Cannot update, this equipment is already in the borrow list.');
        return false;
      }
      
      // Check stock availability
      const remainingQty = equipment[selectedIndex].qty - borrowItemsList
        .filter((bItem, idx) => idx !== i && bItem.index === selectedIndex)
        .reduce((sum, bItem) => sum + bItem.qty, 0);
      
      if (newQty > remainingQty) {
        Swal.showValidationMessage(`Not enough stock. Available: ${remainingQty}`);
        return false;
      }
      
      return { selectedIndex, newQty };
    }
  }).then((result) => {
    if (result.isConfirmed) {
      item.index = result.value.selectedIndex;
      item.qty = result.value.newQty;
      renderBorrowItems();
      
      Swal.fire(
        'Updated!',
        `Borrowed item updated to ${equipment[item.index].name} (Qty: ${item.qty})`,
        'success'
      );
    }
  });
}
function removeBorrowItem(i) {
  // Show SweetAlert confirmation
  Swal.fire({
    title: 'Are you sure?',
    text: "This will remove the item from your borrow list!",
    icon: 'warning',
    showCancelButton: true,
    confirmButtonColor: '#d33',
    cancelButtonColor: '#3085d6',
    confirmButtonText: 'Yes, remove it!',
    cancelButtonText: 'Cancel'
  }).then((result) => {
    if (result.isConfirmed) {
      // Remove the item only if confirmed
      borrowItemsList.splice(i, 1);
      renderBorrowItems();
      
      // Show success message
      Swal.fire(
        'Removed!',
        'The item has been removed.',
        'success'
      );
      
      // Show borrow button if list is empty
      if (borrowItemsList.length === 0) {
        document.getElementById("borrowEquipment").style.display = "inline-block";
      }
    }
  });
}

function confirmBorrowMultiple() {
  if(!validateInputs()) return;

  let today = new Date().toISOString().split("T")[0];

  borrowItemsList.forEach(item => {
    let eq = equipment[item.index];

    // check existing borrow for same equipment
    let existing = history.find(h =>
      h.student === studentNumber.value &&
      h.equipment === eq.name &&
      h.status === "Borrowed"
    );

    if(existing){
      if(existing.qty + item.qty > eq.qty){
        Swal.fire({ icon:'error', title:`Not enough stock for ${eq.name}` });
        return;
      }
      existing.qty += item.qty;
      existing.due = dueDate.value;
    } else {
      history.push({
  student: studentNumber.value,
  name: borrowerName.value,
  contact: contactNumber.value,
  items: borrowItemsList.map(item => ({
    name: equipment[item.index].name,
    qty: item.qty
  })),
  date: today,
  due: dueDate.value,
  status: "Borrowed"
});
    }

    // Deduct from stock
    eq.qty -= item.qty;
  });

  Swal.fire({ icon:'success', title:'Borrowed successfully!', timer:2000, showConfirmButton:false });

  // Clear form
  borrowItemsList = [];
  renderBorrowItems();
  studentNumber.value = "";
  borrowerName.value = "";
  contactNumber.value = "";
  dueDate.value = "";
  borrowEquipment.selectedIndex = 0;

  saveData();
}




document.addEventListener("DOMContentLoaded", () => {
  renderEquipment();
  renderHistory();
  renderReports();
  updateDashboard();
  renderChart();
});
     
