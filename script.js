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
    console.log('App initialized - Ready for Excel import/export.');
});

// Handle row click
function handleRowClick(e) {
    if (e.target.closest('tr')) {
        const row = e.target.closest('tr');
        const index = Array.from(studentTableBody.children).indexOf(row);
        selectRow(index);
    }
}

// Render table (displays all data from studentList)
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
        row.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
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

// Clear form and deselect
function clearFields() {
    nameField.value = idField.value = deptField.value = emailField.value = cgpaField.value = '';
    selectedRow = null;
    renderTable();
}

// Check if fields are empty
function fieldsEmpty() {
    return !nameField.value.trim() || !idField.value.trim() || !deptField.value.trim() ||
           !emailField.value.trim() || !cgpaField.value.trim();
}

// Show alert
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
    if (fieldsEmpty()) return showAlert('Input Error', 'Fill all fields!');
    const student = new Student(
        nameField.value.trim(),
        idField.value.trim(),
        deptField.value.trim(),
        emailField.value.trim(),
        cgpaField.value.trim()
    );
    studentList.push(student);
    renderTable(); // Show in table
    clearFields();
    showAlert('Success', `Added student. Total: ${studentList.length}. Export to Excel to save.`);
}

// Update Student
function updateStudent() {
    if (selectedRow === null) return showAlert('Update Error', 'Select a row to update.');
    if (fieldsEmpty()) return showAlert('Input Error', 'Fill all fields!');
    const updated = new Student(
        nameField.value.trim(),
        idField.value.trim(),
        deptField.value.trim(),
        emailField.value.trim(),
        cgpaField.value.trim()
    );
    studentList[selectedRow] = updated;
    renderTable(); // Show updated in table
    clearFields();
    showAlert('Success', 'Student updated. Export to Excel.');
}

// Delete Student
function deleteStudent() {
    if (selectedRow === null) return showAlert('Delete Error', 'Select a row to delete.');
    const deletedName = studentList[selectedRow].name;
    studentList.splice(selectedRow, 1);
    renderTable(); // Show updated table
    clearFields();
    showAlert('Success', `Deleted ${deletedName}. Total: ${studentList.length}. Export to Excel.`);
}

// Search Student
function searchStudent() {
    const searchId = searchField.value.trim();
    if (!searchId) return showAlert('Search Error', 'Enter an ID to search.');
    const foundIndex = studentList.findIndex(s => s.id.toLowerCase() === searchId.toLowerCase());
    if (foundIndex !== -1) {
        selectRow(foundIndex);
        showAlert('Found', 'Student selected in table.');
    } else {
        showAlert('Not Found', `No student with ID: ${searchId}`);
    }
}

// Export to Excel (.xlsx)
function exportToExcel() {
    if (studentList.length === 0) return showAlert('Export Error', 'No data to export. Add students first.');
    
    const headers = [['Name', 'ID', 'Department', 'Email', 'CGPA']];
    const rows = studentList.map(student => [
        student.name,
        student.id,
        student.department,
        student.email,
        student.cgpa
    ]);
    const data = [...headers, ...rows];
    
    const wb = XLSX.utils.book_new();
    const ws = XLSX.utils.aoa_to_sheet(data);
    XLSX.utils.book_append_sheet(wb, ws, 'Students');
    
    XLSX.writeFile(wb, 'students.xlsx');
    showAlert('Success', 'Exported to students.xlsx! Open in Excel to view/edit.');
}

// Import from Excel (.xlsx) - Fully parses, loads to studentList, displays in table
function importFromExcel(event) {
    const file = event.target.files[0
