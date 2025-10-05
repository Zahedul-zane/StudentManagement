// Student class
class Student {
    constructor(name, id, department, email, cgpa) {
        this.name = name;
        this.id = id;
        this.department = department;
        this.email = email;
        this.cgpa = cgpa;
    }
}

// Global variables (in-memory only - no storage)
let studentList = [];
let selectedRow = null;

// DOM elements
let nameField, idField, deptField, emailField, cgpaField, searchField, studentTableBody, teraLinkInput;

// Initialize
function initialize() {
    nameField = document.getElementById('nameField');
    idField = document.getElementById('idField');
    deptField = document.getElementById('deptField');
    emailField = document.getElementById('emailField');
    cgpaField = document.getElementById('cgpaField');
    searchField = document.getElementById('searchField');
    studentTableBody = document.getElementById('studentTableBody');
    teraLinkInput = document.getElementById('teraLinkInput');

    if (!nameField || !idField || !deptField || !emailField || !cgpaField || !searchField || !studentTableBody || !teraLinkInput) {
        alert('Error: UI elements missing. Check HTML.');
        return;
    }

    renderTable();
    studentTableBody.addEventListener('click', handleRowClick);
    console.log('Initialized - Data ONLY in TeraBox folder (in-memory during session)');
}

// Handle row click
function handleRowClick(e) {
    if (e.target.closest('tr')) {
        const row = e.target.closest('tr');
        const index = Array.from(studentTableBody.children).indexOf(row);
        selectRow(index);
    }
}

// Render table
function renderTable() {
    studentTableBody.innerHTML = '';
    studentList.forEach((student, index) => {
        const row = document.createElement('tr');
        row.innerHTML = `
            <td>${escapeHtml(student.name)}</td>
            <td>${escapeHtml(student.id)}</td>
            <td>${escapeHtml(student.department)}</td>
            <td>${escapeHtml(student.email)}</td>
            <td>${escapeHtml(student.cgpa)}</td>
        `;
        if (index === selectedRow) row.classList.add('selected');
        studentTableBody.appendChild(row);
    });
}

// Select row and populate form
function selectRow(index) {
    if (selectedRow !== null) {
        const prevRow = studentTableBody.children[selectedRow];
        if (prevRow) prevRow.classList.remove('selected');
    }
    selectedRow = index;
    const row = studentTableBody.children[index];
    if (row) {
        row.classList.add('selected');
        row.scrollIntoView({ behavior: 'smooth' });
    }
    if (index >= 0 && index < studentList.length) {
        const student = studentList[index];
        nameField.value = student.name;
        idField.value = student.id;
        deptField.value = student.department;
        emailField.value = student.email;
        cgpaField.value = student.cgpa;
    }
}

// Clear form
function clearFields() {
    nameField.value = idField.value = deptField.value = emailField.value = cgpaField.value = '';
    selectedRow = null;
    renderTable();
}

// Check empty fields
function fieldsEmpty() {
    return !nameField.value.trim() || !idField.value.trim() || !deptField.value.trim() ||
           !emailField.value.trim() || !cgpaField.value.trim();
}

// Alert helper
function showAlert(title, message) {
    alert(`${title}\n${message}`);
}

// Escape HTML for security
function escapeHtml(text) {
    const div = document.createElement('div');
    div.textContent = text;
    return div.innerHTML;
}

// Add Student
function addStudent() {
    if (fieldsEmpty()) return showAlert('Error', 'Fill all fields!');
    const student = new Student(nameField.value.trim(), idField.value.trim(), deptField.value.trim(), emailField.value.trim(), cgpaField.value.trim());
    studentList.push(student);
    renderTable();
    clearFields();
    showAlert('Success', `${studentList.length} students. Export to TeraBox folder to save.`);
}

// Update Student
function updateStudent() {
    if (selectedRow === null) return showAlert('Error', 'Select a row to update.');
    if (fieldsEmpty()) return showAlert('Error', 'Fill all fields!');
    const updated = new Student(nameField.value.trim(), idField.value.trim(), deptField.value.trim(), emailField.value.trim(), cgpaField.value.trim());
    studentList[selectedRow] = updated;
    renderTable();
    clearFields();
    showAlert('Success', 'Updated! Export to TeraBox folder.');
}

// Delete Student
function deleteStudent() {
    if (selectedRow === null) return showAlert('Error', 'Select a row to delete.');
    studentList.splice(selectedRow, 1);
    renderTable();
    clearFields();
    showAlert('Success', 'Deleted! Export to TeraBox folder.');
}

// Search Student
function searchStudent()
