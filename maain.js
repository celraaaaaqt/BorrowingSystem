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
const allowedCategories = ["SPORTS", "ICT EQUIPMENTS", "CLEANING TOOLS", "UTILITIES", "SOUND SYSTEM"];
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

Swal.fire({
  title: editIndex === -1 ? 'Add Equipment?' : 'Update Equipment?',
  text: editIndex === -1 ?
    'Do you want to add this equipment?' :
    'Do you want to update this equipment?',
  icon: 'question',
  showCancelButton: true,
  confirmButtonText: 'Yes',
  cancelButtonText: 'Cancel'
}).then((result) => {
  if (result.isConfirmed) {
    
    if (editIndex === -1) {
      equipment.push({
        name: eqName.value,
        category: eqCategory.value,
        desc: eqDesc.value,
        qty: quantity
      });
    } else {
      equipment[editIndex] = {
        name: eqName.value,
        category: eqCategory.value,
        desc: eqDesc.value,
        qty: quantity
      };
      editIndex = -1;
      addBtn.innerHTML = '<i class="fa-solid fa-plus"></i> Add Equipment';
    }
    
    eqName.value = "";
    eqCategory.value = "";
    eqDesc.value = "";
    eqQty.value = "";
    
    saveData();
    sortEquipmentList();
    Swal.fire({
      icon: 'success',
      title: editIndex === -1 ? 'Added!' : 'Updated!',
      text: editIndex === -1 ?
        'Equipment has been added successfully.' :
        'Equipment has been updated successfully.'
    });
    
  }
});

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

function renderEquipment() {
  equipmentTable.innerHTML = "";
  

  borrowEquipment.innerHTML = `<option value="">Select Equipment</option>`;
  
  equipment.forEach((e, i) => {
    equipmentTable.innerHTML += `
      <tr>
        <td>${e.name}</td>
        <td>${e.category}</td>
        <td>${e.desc}</td>
        <td>${e.qty}</td>
        <td>
          <button class="warning" onclick="editEquipment(${i})"><i class="fa-solid fa-pen"></i></button>
          <button class="danger" onclick="deleteEquipment(${i})"><i class="fa-solid fa-trash"></i></button>
        </td>
      </tr>
    `;
    
    borrowEquipment.innerHTML += `<option value="${i}">${e.name} (${e.qty})</option>`;
  });
  
  // Disable qty dropdown initially
  borrowQty.disabled = true;
  borrowQty.innerHTML = '<option value="">Select Qty</option>';
  
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

function sortEquipmentList() {
  const val = document.getElementById("sortEquipment").value;
  
  equipment.sort((a, b) => {
  
    
    if (val === "name") {
      return a.name.localeCompare(b.name);
    }
    
    
    if (val === "qty") {
      return a.qty - b.qty;
    }
    
    
    let categoryCompare = a.category.localeCompare(b.category);
    if (categoryCompare !== 0) return categoryCompare;
    
    let nameCompare = a.name.localeCompare(b.name);
    if (nameCompare !== 0) return nameCompare;
    
    return 0;
  });
  
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

let currentBorrowed = getBorrowedCount(studentNumber.value, contactNumber.value);


//total items trying to borrow now
let newItemsCount = borrowItemsList.reduce((sum, item) => sum + item.qty, 0);

if (currentBorrowed >= 3) {
  Swal.fire({
    icon: 'warning',
    title: `This borrower already has ${currentBorrowed} items (max is 3).`,
    text: 'Cannot borrow more until items are returned.'
  });
  return;
}
let remaining = 3 - currentBorrowed;
if (currentBorrowed > 0 && currentBorrowed + newItemsCount > 3) {
  
  Swal.fire({
    icon: 'warning',
    title: `Limit exceeded`,
    text: currentBorrowed === 0 ?
  `You can only borrow up to 3 items.` :
  `Borrower already has ${currentBorrowed} item(s). You can only add ${remaining} more.`
  });
  return;
}

  //build preview HTML
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
      
      //Check if the student already borrowed this equipment and it's still Borrowed
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
    grouped[key].push(h);
  });
  
  Object.values(grouped).forEach(group => {
    // Determine overall status
    let allStatuses = group.map(h => {
      if (h.items) return h.items.map(i => i.status || "Borrowed");
      return [h.status || "Borrowed"];
    }).flat();
    
    let overallStatus;

if (allStatuses.includes("Reported")) {
  overallStatus = "Reported";
}
else if (allStatuses.every(s => s === "Returned")) {
  overallStatus = "Returned";
}
else {
  overallStatus = "Borrowed";
}
    
    let first = group[0];
    let overdue = (overallStatus === "Borrowed" && new Date(first.due) < new Date()) ? "overdue" : "";
    
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
        <td>${overallStatus}</td>
        <td>
          ${overallStatus === "Borrowed" ? `
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
      
      history.forEach(h => {
        if (h.student === student && h.date === date && h.contact === contact) {
          
          if (h.items && h.items.length > 0) {
            
            //updatesEACH ITEM status
            h.items.forEach(item => {
              item.status = "Returned";
              
              //restore stock
              let eq = equipment.find(e => e.name === item.name);
              if (eq) eq.qty += item.qty;
            });
            
          } else {
            // fallback old structure
            h.status = "Returned";
            
            let eq = equipment.find(e => e.name === h.equipment);
            if (eq) eq.qty += h.qty;
          }
          
          //update overall status
          h.status = "Returned";
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

let uniqueTransactions = [
  ...new Set(
    history
    .filter(h => h.date === today)
    .map(h => `${h.student}_${h.date}_${h.contact}`)
  )
];

todayCount.innerText = uniqueTransactions.length;

overdueCount.innerText = history.filter(h => {
  if (h.items) {
    return h.items.some(item =>
      (!item.status || item.status === "Borrowed") &&
      new Date(h.due) < new Date()
    );
  }
  return h.status === "Borrowed" && new Date(h.due) < new Date();
}).length;
totalEquipments.innerText = equipment.length;
}

function logout() {
  Swal.fire({
    title: 'Log out?',
    text: 'Are you sure you want to log out?',
    icon: 'warning',
    confirmButtonText: 'Yes, log out',
    showCancelButton: true,
    cancelButtonText: 'Cancel',
    reverseButtons: true
  }).then((result) => {
    if (result.isConfirmed) {
      
      //loading effect
      Swal.fire({
        title: 'Logging out...',
        text: 'Please wait',
        allowOutsideClick: false,
        didOpen: () => {
          Swal.showLoading();
        }
      });
      
      setTimeout(() => {
        window.location.href = 'login.html';
      }, 800); //smooth delay
      
    }
  });
}

document.getElementById("logout").onclick = logout;

function getChartData() {
  let borrowed = 0;
  let returned = 0;
  let reported = 0;
  
  history.forEach(h => {
    if (h.items && h.items.length > 0) {
      h.items.forEach(item => {
        if (!item.status || item.status === "Borrowed") borrowed += item.qty;
        else if (item.status === "Returned") returned += item.qty;
        else if (item.status === "Reported") reported += item.qty;
      });
    } else {
      //fallback (old data without item list)
      if (h.status === "Borrowed") borrowed += 1;
      else if (h.status === "Returned") returned += 1;
      else if (h.status === "Reported") reported += 1;
    }
  });
  
  return { borrowed, returned, reported };
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
  backgroundColor: '#ef4444',
  borderColor: 'red',
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
  //get all Borrowed history entries for this transaction
  let entries = history.filter(h =>
    h.student === student &&
    h.date === date &&
    h.contact === contact &&
    (h.status === "Borrowed" || (h.items && h.items.some(it => !it.status || it.status === "Borrowed")))
  );

  if (entries.length === 0) {
    Swal.fire({ icon: 'info', title: 'No items to report' });
    return;
  }

  //flatten all items for multi-item borrows
  let flatItems = [];
  entries.forEach(h => {
    if (h.items && h.items.length > 0) {
      h.items.forEach(item => {
        if (!item.status || item.status === "Borrowed") {
          flatItems.push({
            student: h.student,
            name: h.name,
            contact: h.contact,
            equipment: item.name,
            qty: item.qty,
            date: h.date,
            entry: h,
          });
        }
      });
    } else if (h.status === "Borrowed") {
      flatItems.push({
        student: h.student,
        name: h.name,
        contact: h.contact,
        equipment: h.equipment,
        qty: h.qty,
        date: h.date,
        entry: h,
      });
    }
  });

  // Build HTML for Swal
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
        result.push({ itemIndex: i, type, note });
      }
      return result;
    }
  }).then((res) => {
    if (!res.isConfirmed) return;

    let reported = res.value;

    reported.forEach(r => {
      let h = flatItems[r.itemIndex];
      let histEntry = h.entry;

      // Update the actual history entry/item
      if (histEntry.items && histEntry.items.length > 0) {
        histEntry.items.forEach(item => {
          if (item.name.trim().toLowerCase() === h.equipment.trim().toLowerCase()) {
            item.status = r.type ? "Reported" : "Returned";
          }
        });
      } else {
        histEntry.status = r.type ? "Reported" : "Returned";
      }
      
      //update overall status of transaction
if (histEntry.items) {
  let statuses = histEntry.items.map(i => i.status);
  
  if (statuses.every(s => s === "Returned")) {
  histEntry.status = "Returned";
} else {
  histEntry.status = "Reported";
}
}

      //push to reports
      reports.push({
        student: h.student,
        name: h.name,
        equipment: h.equipment,
        qty: h.qty,
        type: r.type || "Returned",
        note: r.note || "-",
        date: new Date().toISOString().split("T")[0],
        badgeClass: r.type ? "danger" : "success"
      });
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
    renderChart();    
  });
}

function renderReports() {
  let table = document.getElementById("reportTable");
  let html = ""; // build all rows first

  reports.forEach(r => {
    html += `
      <tr>
        <td>${r.student}</td>
        <td>${r.name}</td>
        <td>${r.equipment}</td>
        <td>${r.qty}</td>
        <td><span class="badge ${r.badgeClass}">${r.type}</span></td>
        <td>${r.note}</td>
        <td>${r.date}</td>
      </tr>
    `;
  });

  table.innerHTML = html; // assign once
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
  let index = Number(borrowEquipment.value);
  
  let qty = parseInt(borrowQty.value);
if (isNaN(qty) || qty < 1) {
  Swal.fire({ icon: 'warning', title: 'Please select a quantity.' });
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
      borrowItemsList.push({
  index: Number(index),
  qty: Number(qty)
});
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
      <div style="padding: 8px;
background: linear-gradient(to right, #1e3a8a, #2563eb);
color: #fff;
font - size: 14px;
border-radius: 10px;
box-shadow: 0-2px 10 px rgba(0, 0, 0, 0.3); border-top: 8px solid;
  border-top-color: #f59e0b; margin-bottom: 3px;"class="borrow-item">
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
  
  //build dropdown (FILTERED, not disabled)
  let equipmentOptions = equipment.map((eq, index) => {
    
    const isUsed = borrowItemsList.some(
      (bItem, idx) => idx !== i && Number(bItem.index) === index
    );
    
    const remainingQty = eq.qty - borrowItemsList
      .filter((bItem, idx) => idx !== i && Number(bItem.index) === index)
      .reduce((sum, bItem) => sum + Number(bItem.qty), 0);
    
    //hide invalid options (except current)
    if ((isUsed || remainingQty <= 0) && index !== Number(item.index)) return '';
    
    const selected = index === Number(item.index) ? 'selected' : '';
    
    return `<option value="${index}" ${selected}>
      ${eq.name} (Available: ${remainingQty})
    </option>`;
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
      const selectedIndex = Number(document.getElementById('swal-equipment').value);
      const newQty = Number(document.getElementById('swal-qty').value);
      
      //quantity validation
      if (!Number.isInteger(newQty) || newQty < 1 || newQty > 3) {
        Swal.showValidationMessage('Quantity must be between 1 and 3.');
        return false;
      }
      
      //duplicate check (STRICT)
      const isDuplicate = borrowItemsList.some(
        (bItem, idx) => idx !== i && Number(bItem.index) === selectedIndex
      );
      
      if (isDuplicate) {
        Swal.showValidationMessage('Cannot update: already in borrow list.');
        return false;
      }
      
      //stock check
      const remainingQty = equipment[selectedIndex].qty - borrowItemsList
        .filter((bItem, idx) => idx !== i && Number(bItem.index) === selectedIndex)
        .reduce((sum, bItem) => sum + Number(bItem.qty), 0);
      
      if (newQty > remainingQty) {
        Swal.showValidationMessage(`Not enough stock. Available: ${remainingQty}`);
        return false;
      }
      
      return { selectedIndex, newQty };
    }
    
  }).then((result) => {
    
    if (!result.isConfirmed) return;
    
    const selectedIndex = Number(result.value.selectedIndex);
    const newQty = Number(result.value.newQty);
    
    //SE (cannot be bypassed)
    const isDuplicate = borrowItemsList.some(
      (bItem, idx) => idx !== i && Number(bItem.index) === selectedIndex
    );
    
    if (isDuplicate) {
      Swal.fire(
        'Error',
        'Duplicate equipment detected. Update cancelled.',
        'error'
      );
      return;
    }
    
    //SAFE UPDATE (overwrite cleanly)
    borrowItemsList[i] = {
      index: selectedIndex,
      qty: newQty
    };
    
    renderBorrowItems();
    
    Swal.fire(
      'Updated!',
      `Now: ${equipment[selectedIndex].name} (Qty: ${newQty})`,
      'success'
    );
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
  if (!validateInputs()) return;
  
  let today = new Date().toISOString().split("T")[0];
  
  // Find today's transaction for this student
  let todayTransaction = history.find(h =>
    h.student === studentNumber.value &&
    h.date === today
  );
  
  // Count current borrowed items (only status === "Borrowed")
  let currentCount = 0;
  if (todayTransaction && todayTransaction.items) {
    currentCount = todayTransaction.items.reduce((sum, item) => {
      return sum + (item.status === "Borrowed" ? item.qty : 0);
    }, 0);
  }
  
  let newItemsCount = borrowItemsList.reduce((sum, i) => sum + i.qty, 0);
  
  if (currentCount + newItemsCount > 3) {
    Swal.fire({
      icon: "warning",
      title: "Borrow limit exceeded",
      text: `You already borrowed ${currentCount} item(s) today. You can only borrow ${3 - currentCount} more item(s). Come back tomorrow for new borrowings.`,
    });
    return;
  }
  
  // Process each item
  borrowItemsList.forEach(item => {
    let eq = equipment[item.index];
    
    if (item.qty > eq.qty) {
      Swal.fire({ icon: 'error', title: `Not enough stock for ${eq.name}` });
      return;
    }
    
    if (!todayTransaction) {
      // No transaction today, create a new one
      todayTransaction = {
        student: studentNumber.value,
        name: borrowerName.value,
        contact: contactNumber.value,
        items: [{ name: eq.name, qty: item.qty, status: "Borrowed" }],
        date: today,
        due: dueDate.value,
        status: "Borrowed"
      };
      history.push(todayTransaction);
    } else {
      // Transaction exists, add or update item
      let existingItem = todayTransaction.items.find(i => i.name === eq.name && i.status === "Borrowed");
      if (existingItem) {
        existingItem.qty += item.qty; // increase quantity of same product
      } else {
        todayTransaction.items.push({ name: eq.name, qty: item.qty, status: "Borrowed" });
      }
      todayTransaction.due = dueDate.value; // update due date
    }
    
    // Deduct stock
    eq.qty -= item.qty;
  });
  
  Swal.fire({ icon: 'success', title: 'Borrowed successfully!', timer: 2000, showConfirmButton: false });
  
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

function getBorrowedCount(student, contact) {
  let count = 0;
  
  history.forEach(h => {
    if (h.student === student && h.contact === contact) {
      
      if (h.items && h.items.length > 0) {
        //count ONLY items still Borrowed
        h.items.forEach(item => {
          if (!item.status || item.status === "Borrowed") {
            count += item.qty;
          }
        });
        
      } else {
        // fallback (old structure)
        if (h.status === "Borrowed") {
          count += h.qty || 0;
        }
      }
      
    }
  });
  
  return count;
}

function updateQtyDropdown() {
  const eqSelect = document.getElementById("borrowEquipment");
  const qtySelect = document.getElementById("borrowQty");
  const index = eqSelect.selectedIndex - 1; // first option is "Select Equipment"
  
  if (index < 0) {
    qtySelect.innerHTML = '<option value="">Select Qty</option>';
    qtySelect.disabled = true;
    return;
  }
  
  const stock = equipment[index].qty;
  
  if (stock === 0) {
    qtySelect.innerHTML = '<option value="">Out of stock</option>';
    qtySelect.disabled = true;
    return;
  }
  
  qtySelect.disabled = false;
  qtySelect.innerHTML = "";
  
  const maxQty = Math.min(3, stock);
  
  for (let i = 1; i <= maxQty; i++) {
    const option = document.createElement("option");
    option.value = i;
    option.textContent = i;
    qtySelect.appendChild(option);
  }
  
  if (stock < 3) {
    Swal.fire({
      icon: "warning",
      title: "Limited Stock",
      text: `Only ${stock} item(s) available for this equipment.`,
      toast: true,
      position: "top-end",
      timer: 2000,
      showConfirmButton: false
    });
  }
}

document.addEventListener("DOMContentLoaded", () => {
  renderEquipment();
  renderHistory();
  renderReports();
  updateDashboard();
  renderChart();
  
});
                  
                  
