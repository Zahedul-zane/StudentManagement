// Student "class" (ES6-like)
class Student {
    constructor(name, id, department, email, cgpa) {
        this.name = name;
        this.id = id;
        this.department = department;
        this.email = email;
        this.cgpa = cgpa;
    }
}

// Global variables
let studentList = []; // In-memory list like ObservableList
let selectedRow = null; // Track selected row index

// DOM elements
const nameField = document.getElementById('nameField');
const idField = document.getElementById('idField');
const deptField = document.getElementById('deptField');
const emailField = document.getElementById('emailField');
const cgpaField = document.getElementById('cgpaField');
const searchField = document.getElementById('searchField');
const studentTableBody = document.getElementById('studentTableBody');

// Initialize: Set up table and event listeners
function initialize() {
    renderTable(); // Initial empty table

    // Row click listener: Populate form and select row
    studentTableBody.addEventListener('click', (e) => {
        if (e.target.closest('tr')) {
            const row = e.target.closest('tr');
            const index = Array.from(studentTableBody.children).indexOf(row);
            selectRow(index);
        }
    });
}

// Render table from studentList
function renderTable() {
    studentTableBody.innerHTML = '';
    studentList.forEach((student, index) => {
        const row = document.createElement('tr');
        row.innerHTML = `
            <td>${student.name}</td>
            <td>${student.id}</td>
            <td>${student.department}</td>
            <td>${student.email}</td>
            <td>${student.cgpa}</td>
        `;
        if (index === selectedRow) {
            row.classList.add('selected');
        }
        studentTableBody.appendChild(row);
    });
}

// Select row: Highlight and populate form
function selectRow(index) {
    // Deselect previous
    if (selectedRow !== null) {
        const prevRow = studentTableBody.children[selectedRow];
        if (prevRow) prevRow.classList.remove('selected');
    }
    
    selectedRow = index;
    const row = studentTableBody.children[index];
    if (row) {
        row.classList.add('selected');
        row.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
    }

    // Populate form if valid selection
    if (index >= 0 && index < studentList.length) {
        const student = studentList[index];
        nameField.value = student.name;
        idField.value = student.id;
        deptField.value = student.department;
        emailField.value = student.email;
        cgpaField.value = student.cgpa;
    }
}

// Clear form fields
function clearFields() {
    nameField.value = '';
    idField.value = '';
    deptField.value = '';
    emailField.value = '';
    cgpaField.value = '';
    selectedRow = null; // Deselect
    renderTable(); // Refresh to remove selection
}

// Check if fields are empty
function fieldsEmpty() {
    return !nameField.value.trim() || !idField.value.trim() || !deptField.value.trim() ||
           !emailField.value.trim() || !cgpaField.value.trim();
}

// Show alert (simple browser alert)
function showAlert(title, message) {
    alert(`${title}: ${message}`);
}

// Add Student
function addStudent() {
    if (fieldsEmpty()) {
        showAlert('Input Error', 'All fields must be filled!');
        return;
    }
    const student = new Student(
        nameField.value.trim(),
        idField.value.trim(),
        deptField.value.trim(),
        emailField.value.trim(),
        cgpaField.value.trim()
    );
    studentList.push(student);
    renderTable();
    clearFields();
}

// Update Student
function updateStudent() {
    if (selectedRow === null) {
        showAlert('Update Error', 'No student selected to update.');
        return;
    }
    if (fieldsEmpty()) {
        showAlert('Input Error', 'All fields must be filled!');
        return;
    }
    const updated = new Student(
        nameField.value.trim(),
        idField.value.trim(),
        deptField.value.trim(),
        emailField.value.trim(),
        cgpaField.value.trim()
    );
    studentList[selectedRow] = updated;
    renderTable();
    clearFields();
}

// Delete Student
function deleteStudent() {
    if (selectedRow === null) {
        showAlert('Delete Error', 'No student selected to delete.');
        return;
    }
    studentList.splice(selectedRow, 1);
    renderTable();
    clearFields();
}

// Search Student
function searchStudent() {
    const searchId = searchField.value.trim();
    if (!searchId) {
        showAlert('Search Error', 'Please enter a student ID to search.');
        return;
    }

    const foundIndex = studentList.findIndex(student => 
        student.id.toLowerCase() === searchId.toLowerCase()
    );

    if (foundIndex !== -1) {
        selectRow(foundIndex);
    } else {
        showAlert('Not Found', `No student found with ID: ${searchId}`);
    }
}

// Initialize on page load
document.addEventListener('DOMContentLoaded', initialize);
