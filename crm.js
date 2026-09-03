// ===============================
// SMART CRM SYSTEM
// ===============================

let leads = JSON.parse(localStorage.getItem("crmLeads")) || [
{
id: 1,
name: "Rahul",
phone: "9876543210",
status: "New"
},
{
id: 2,
name: "Sky",
phone: "9123456789",
status: "Follow-up"
},
{
id: 3,
name: "virat",
phone: "9988776655",
status: "Closed"
}
];

// ===============================
// INITIAL LOAD
// ===============================

window.onload = () => {

renderLeads();
updateDashboard();
loadFollowUps();

};

// ===============================
// NAVIGATION
// ===============================

function showSection(section){

document.getElementById("dashboardSection").style.display = "none";
document.getElementById("leadsSection").style.display = "none";
document.getElementById("followupsSection").style.display = "none";
document.getElementById("reportsSection").style.display = "none";
document.getElementById("settingsSection").style.display = "none";

if(section === "dashboard"){
document.getElementById("dashboardSection").style.display = "block";
}

if(section === "leads"){
document.getElementById("leadsSection").style.display = "block";
}

if(section === "followups"){
document.getElementById("followupsSection").style.display = "block";
}

if(section === "reports"){
document.getElementById("reportsSection").style.display = "block";
}

if(section === "settings"){
document.getElementById("settingsSection").style.display = "block";
}

}

// ===============================
// ADD LEAD
// ===============================

function addLead(){

let name =
document.getElementById("leadName").value.trim();

let phone =
document.getElementById("leadPhone").value.trim();

let status =
document.getElementById("leadStatus").value;

if(name === "" || phone === ""){
alert("Please fill all fields");
return;
}

let lead = {

id: Date.now(),
name,
phone,
status

};

leads.push(lead);

saveLeads();

renderLeads();
updateDashboard();
loadFollowUps();

addTimeline(
`Lead Added : ${name}`
);

document.getElementById("leadName").value="";
document.getElementById("leadPhone").value="";

let modal =
bootstrap.Modal.getInstance(
document.getElementById("leadModal")
);

modal.hide();

}

// ===============================
// DISPLAY LEADS
// ===============================

function renderLeads(){

let table =
document.getElementById("leadTable");

table.innerHTML = "";

let search =
document.getElementById("searchLead")
? document.getElementById("searchLead").value.toLowerCase()
: "";

let filter =
document.getElementById("statusFilter")
? document.getElementById("statusFilter").value
: "";

let filteredLeads = leads.filter(lead => {

let matchSearch =
lead.name.toLowerCase().includes(search) ||
lead.phone.includes(search);

let matchFilter =
filter === "" || lead.status === filter;

return matchSearch && matchFilter;

});

filteredLeads.forEach(lead => {

table.innerHTML += `
<tr>

<td>${lead.name}</td>

<td>${lead.phone}</td>

<td>
<span class="badge ${
lead.status === "New"
? "bg-primary"
: lead.status === "Follow-up"
? "bg-warning"
: "bg-success"
}">
${lead.status}
</span>
</td>

<td>

<button
class="btn btn-sm btn-info"
onclick="editLead(${lead.id})">

<i class="fas fa-edit"></i>

</button>

<button
class="btn btn-sm btn-danger"
onclick="deleteLead(${lead.id})">

<i class="fas fa-trash"></i>

</button>

</td>

</tr>
`;

});

}

// ===============================
// EDIT LEAD
// ===============================

function editLead(id){

let lead =
leads.find(l => l.id === id);

let name =
prompt("Edit Name", lead.name);

if(name === null) return;

let phone =
prompt("Edit Phone", lead.phone);

if(phone === null) return;

let status =
prompt(
"Status (New / Follow-up / Closed)",
lead.status
);

if(status === null) return;

lead.name = name;
lead.phone = phone;
lead.status = status;

saveLeads();

renderLeads();
updateDashboard();
loadFollowUps();

addTimeline(
`Lead Updated : ${name}`
);

}

// ===============================
// DELETE LEAD
// ===============================

function deleteLead(id){

let confirmDelete =
confirm("Delete this lead?");

if(!confirmDelete) return;

let lead =
leads.find(l => l.id === id);

leads =
leads.filter(
item => item.id !== id
);

saveLeads();

renderLeads();
updateDashboard();
loadFollowUps();

addTimeline(
`Lead Deleted : ${lead.name}`
);

}

// ===============================
// DASHBOARD COUNTS
// ===============================

function updateDashboard(){

document.getElementById("totalLeads").innerText =
leads.length;

document.getElementById("newLeads").innerText =
leads.filter(
lead => lead.status === "New"
).length;

document.getElementById("followLeads").innerText =
leads.filter(
lead => lead.status === "Follow-up"
).length;

document.getElementById("closedLeads").innerText =
leads.filter(
lead => lead.status === "Closed"
).length;

}

// ===============================
// FOLLOW UPS
// ===============================

function loadFollowUps(){

let list =
document.getElementById("followupList");

list.innerHTML = "";

let followups =
leads.filter(
lead => lead.status === "Follow-up"
);

followups.forEach(lead => {

list.innerHTML += `
<li>
${lead.name}
(${lead.phone})
</li>
`;

});

}

// ===============================
// TIMELINE
// ===============================

function addTimeline(message){

let timeline =
document.getElementById("timeline");

let div =
document.createElement("div");

div.classList.add("timeline-item");

div.innerHTML = `
<p>${message}</p>
<small>${new Date().toLocaleString()}</small>
`;

timeline.prepend(div);

}

// ===============================
// SAVE DATA
// ===============================

function saveLeads(){

localStorage.setItem(
"crmLeads",
JSON.stringify(leads)
);

}

// ===============================
// SEARCH
// ===============================

document.addEventListener(
"keyup",
function(e){

if(e.target.id === "searchLead"){
renderLeads();
}

}
);

// ===============================
// FILTER
// ===============================

document.addEventListener(
"change",
function(e){

if(e.target.id === "statusFilter"){
renderLeads();
}

}
);

// ===============================
// DARK MODE
// ===============================

const themeBtn =
document.getElementById("themeBtn");

if(localStorage.getItem("darkMode") === "true"){

document.body.classList.add("dark-mode");

}

themeBtn.addEventListener("click", () => {

document.body.classList.toggle("dark-mode");

localStorage.setItem(
"darkMode",
document.body.classList.contains("dark-mode")
);

});

// ===============================
// EXPORT EXCEL
// ===============================

document.getElementById("excelBtn")
.addEventListener("click", () => {

let csv =
"Name,Phone,Status\n";

leads.forEach(lead => {

csv +=
`${lead.name},${lead.phone},${lead.status}\n`;

});

let blob =
new Blob(
[csv],
{type:"text/csv"}
);

let link =
document.createElement("a");

link.href =
URL.createObjectURL(blob);

link.download =
"crm_leads.csv";

link.click();

});

// ===============================
// EXPORT PDF
// ===============================

document.getElementById("pdfBtn")
.addEventListener("click", () => {

let report =
"SMART CRM REPORT\n\n";

leads.forEach(lead => {

report +=
`
Name : ${lead.name}
Phone : ${lead.phone}
Status : ${lead.status}

`;

});

let blob =
new Blob(
[report],
{type:"text/plain"}
);

let link =
document.createElement("a");

link.href =
URL.createObjectURL(blob);

link.download =
"crm_report.txt";

link.click();

});