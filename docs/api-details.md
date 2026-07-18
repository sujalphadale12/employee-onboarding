# API Documentation

## Employee APIs

### Register Employee

POST /employee

Registers a new employee.

---

### Get Employee

GET /employee/{employee_id}

Returns employee details.

---

### List Employees

GET /employees

Returns all employees.

---

### Update Employee Status

PUT /employee/{employee_id}/status

Updates employee workflow status.

---

## Document APIs

### Generate Upload URL

POST /upload

Returns a pre-signed upload URL.

---

### Save Metadata

POST /save-document

Stores document metadata in DynamoDB.

---

### Download Document

GET /employee/{employee_id}/document/{document_type}

Returns a pre-signed download URL.
