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
let studentList = []; // In-memory list (no persistent storage)
let selectedRow = null; // Track selected row index

// DOM elements (selected inside initialize())
let nameField, idField, deptField, emailField, cgpaField, searchField, studentTableBody;

// Initialize: Set up everything after DOM is ready
function initialize() {
    // Select DOM elements now (safe after DOMContentLoaded)
    nameField = document.getElementById('nameField');
    idField = document.getElementById('idField');
    deptField = document.getElementById('deptField');
    emailField = document.getElementById('emailField');
    cgpaField = document.getElementById('cgpaField');
    searchField = document.getElementById('searchField');
    studentTableBody = document.getElementById('studentTableBody');

    // Error check: Ensure all elements exist
    if (!nameField || !idField || !deptField || !emailField || !cgpaField || !searchField || !studentTableBody) {
        console.error('One or more DOM elements not found. Check HTML IDs.');
        alert('Error: Missing UI elements. Please refresh and check console.');
        return;
    }

    renderTable(); // Initial empty table

    // Row click listener: Populate form and select row
    studentTableBody.addEventListener('click', (e) => {
        if (e.target.closest('tr')) {
            const row = e.target.closest('tr');
            const index = Array.from(studentTableBody.children).indexOf(row);
            selectRow(index);
        }
    });

    console.log('App initialized - Data stored in-memory (export to TeraBox for persistence)');
}

// Render table from studentList
function renderTable() {
    if (!studentTableBody) return;
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
    if (!studentTableBody) return;

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
    if (index >= 0 && index < studentList.length && nameField && idField && deptField && emailField && cgpaField) {
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
    if (nameField && idField && deptField && emailField && cgpaField) {
        nameField.value = '';
        idField.value = '';
        deptField.value = '';
        emailField.value = '';
        cgpaField.value = '';
    }
    selectedRow = null;
    renderTable();
}

// Check if fields are empty
function fieldsEmpty() {
    return !nameField?.value?.trim() || !idField?.value?.trim() || !deptField?.value?.trim() ||
           !emailField?.value?.trim() || !cgpaField?.value?.trim();
}

// Show alert
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
    showAlert('Success', 'Student added! Export to save to TeraBox.');
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
    showAlert('Success', 'Student updated! Export to save to TeraBox.');
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
    showAlert('Success', 'Student deleted! Export to save changes to TeraBox.');
}

// Search Student
function searchStudent() {
    if (!searchField) return;
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
        showAlert('Found', 'Student selected!');
    } else {
        showAlert('Not Found', `No student found with ID: ${searchId}`);
    }
}

// NEW: Export Data to JSON (for upload to TeraBox)
function exportData() {
    if (studentList.length === 0) {
        showAlert('Export Error', 'No data to export. Add some students first.');
        return;
    }
    const dataToExport = studentList.map(student => ({
        name: student.name,
        id: student.id,
        department: student.department,
        email: student.email,
        cgpa: student.cgpa
    }));
    const jsonStr = JSON.stringify(dataToExport, null, 2);
    const blob = new Blob([jsonStr], { type: 'application/json' });
    const url
