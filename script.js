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

// Global variables (in-memory only)
let studentList = [];
let selectedRow = null;

// DOM elements
let nameField, idField, deptField, emailField, cgpaField, searchField, studentTableBody;

// Initialize on DOM load
document.addEventListener('DOMContentLoaded', function() {
    nameField = document.getElementById('nameField');
    idField = document.getElementById('idField');
    deptField = document.getElementById('deptField');
    emailField = document.getElementById('emailField');
    cgpaField = document.getElementById('cgpaField');
    searchField = document.getElementById('searchField');
    studentTableBody = document.getElementById('studentTableBody');

    if (!nameField || !idField || !deptField || !emailField || !cgpaField || !searchField || !studentTableBody) {
        alert('Error: UI elements missing. Check HTML.');
        return;
    }

    renderTable();
    studentTableBody.addEventListener('click', handleRowClick);
    console.log('Initialized - Data ONLY in Excel file (in-memory during session)');
});

// Handle row click
function handleRowClick(e) {
    if (e.target.closest('tr')) {
        const row = e.target.closest('tr');
        const index = Array.from(studentTableBody.children).indexOf(row);
        selectRow(index);
    }
}

// Render table (shows all data from studentList)
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
    renderTable(); // Update table immediately
    clearFields();
    showAlert('Success', `${studentList.length} students. Export to Excel to save.`);
}

// Update Student
function updateStudent() {
    if (selectedRow === null) return showAlert('Error', 'Select a row to update.');
    if (fieldsEmpty()) return showAlert('Error', 'Fill all fields!');
    const updated = new Student(nameField.value.trim(), idField.value.trim(), deptField.value.trim(), emailField.value.trim(), cgpaField.value.trim());
    studentList[selectedRow] = updated;
    renderTable(); // Update table immediately
    clearFields();
    showAlert('Success', 'Updated! Export to Excel.');
}

// Delete Student
function deleteStudent() {
    if (selectedRow === null) return showAlert('Error', 'Select a row to delete.');
    studentList.splice(selectedRow, 1);
    renderTable(); // Update table immediately
    clearFields();
    showAlert('Success', 'Deleted! Export to Excel.');
}

// Search Student
function searchStudent() {
    const searchId = searchField.value.trim();
    if (!searchId) return showAlert('Error', 'Enter ID to search.');
    const foundIndex = studentList.findIndex(s => s.id.toLowerCase() === searchId.toLowerCase());
    if (foundIndex !== -1) {
        selectRow(foundIndex);
        showAlert('Found', 'Student selected!');
    } else {
        showAlert('Not Found', `No student with ID: ${searchId}`);
    }
}

// Export to Excel (.xlsx)
function exportToExcel() {
    if (studentList.length === 0) return showAlert('Error', 'No data to export. Add students first.');
    
    // Prepare data for Excel (headers + rows)
    const headers = [['Name', 'ID', 'Department', 'Email', 'CGPA']];
    const rows = studentList.map(student => [
        student.name,
        student.id,
        student.department,
        student.email,
        student.cgpa
    ]);
    const data = [...headers, ...rows];
    
    // Create workbook and worksheet
    const wb = XLSX.utils.book_new();
    const ws = XLSX.utils.aoa_to_sheet(data);
    XLSX.utils.book_append_sheet(wb, ws, 'Students');
    
    // Download file
    XLSX.writeFile(wb, 'students.xlsx');
    showAlert('Success', 'Exported to students.xlsx!');
}

// Import from Excel (.xlsx) - Parses data, updates studentList, and shows in table
function importFromExcel(event) {
    const file = event.target.files[0];
    if (!file) return;
    
    const reader = new FileReader();
    reader.onload = function(e) {
        try {
            const data = new Uint8Array(e.target.result);
            const wb = XLSX.read(data, { type: 'array' });
            const wsName = wb.SheetNames[0]; // First sheet
            const ws = wb.Sheets[wsName];
            const jsonData = XLSX.utils.sheet_to_json(ws, { header: 1 }); // Array of arrays (rows)
            
            if (jsonData.length < 2) { // No
