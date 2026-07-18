const API_BASE_URL = "https://ziadx9y2x0.execute-api.ap-south-1.amazonaws.com/prod";

const tableBody = document.getElementById("employeeTableBody");
const searchInput = document.getElementById("searchInput");

const modal = document.getElementById("employeeModal");
const closeModal = document.getElementById("closeModal");
const employeeDetails = document.getElementById("employeeDetails");

let employees = [];

window.onload = function () {
    loadEmployees();
};

// =============================
// Load Employees
// =============================
async function loadEmployees() {
    tableBody.innerHTML = `
        <tr>
            <td colspan="6" style="text-align:center;">
                Loading Employees...
            </td>
        </tr>
    `;
    try {
        const response = await fetch(`${API_BASE_URL}/employees`);

        if (!response.ok) {
            throw new Error("Unable to fetch employees.");
        }

        employees = await response.json();

        if (!Array.isArray(employees)) {
            employees = [];
        }

        updateDashboard(employees);
        renderTable(employees);

    } catch (error) {
        console.error(error);
        tableBody.innerHTML = `
            <tr>
                <td colspan="6" style="text-align:center;color:red;">
                    Failed to load employees.
                </td>
            </tr>
        `;
    }
}

// =============================
// Dashboard Metrics Calculation
// =============================
function updateDashboard(data) {
    document.getElementById("totalEmployees").textContent = data.length;

    const pending = data.filter(e => (e.status || "").toLowerCase() === "pending").length;
    const approved = data.filter(e => (e.status || "").toLowerCase() === "approved").length;
    const rejected = data.filter(e => (e.status || "").toLowerCase() === "rejected").length;

    document.getElementById("pendingEmployees").textContent = pending;
    document.getElementById("approvedEmployees").textContent = approved;
    document.getElementById("rejectedEmployees").textContent = rejected;
}

// =============================
// Render Table Data
// =============================
function renderTable(data) {
    tableBody.innerHTML = "";

    if (data.length === 0) {
        tableBody.innerHTML = `
            <tr>
                <td colspan="6" style="text-align:center;">
                    No Employees Found
                </td>
            </tr>
        `;
        return;
    }

    data.forEach(employee => {
        tableBody.innerHTML += `
            <tr>
                <td>${employee.name || "-"}</td>
                <td>${employee.email || "-"}</td>
                <td>${employee.department || "-"}</td>
                <td>${employee.role || "-"}</td>
                <td>${employee.status || "-"}</td>
                <td>
                    <button onclick="viewEmployee('${employee.employee_id}')">
                        View
                    </button>
                </td>
            </tr>
        `;
    });
}

// =============================
// Search & Filter Input Event
// =============================
searchInput.addEventListener("input", function () {
    const keyword = this.value.toLowerCase();

    const filtered = employees.filter(emp => {
        return (
            (emp.name || "").toLowerCase().includes(keyword) ||
            (emp.email || "").toLowerCase().includes(keyword)
        );
    });

    renderTable(filtered);
});

// =============================
// View Employee Modal
// =============================
async function viewEmployee(employeeId) {
    employeeDetails.innerHTML = "<p>Loading...</p>";
    modal.style.display = "block";

    try {
        const response = await fetch(`${API_BASE_URL}/employee/${employeeId}`);

        if (!response.ok) {
            throw new Error("Unable to fetch employee details.");
        }

        let employee = await response.json();

        // Standardize variations out of AWS Lambda integration proxies
        if (employee.body) {
            employee = JSON.parse(employee.body);
        }
        if (employee.Item) {
            employee = employee.Item;
        }

        employeeDetails.innerHTML = `
        <div class="employee-profile">
            <h2>${employee.name || "Employee Profile"}</h2>

            <table class="details-table">
                <tr>
                    <td><strong>Employee ID</strong></td>
                    <td>${employee.employee_id || "-"}</td>
                </tr>
                <tr>
                    <td><strong>Email</strong></td>
                    <td>${employee.email || "-"}</td>
                </tr>
                <tr>
                    <td><strong>Department</strong></td>
                    <td>${employee.department || "-"}</td>
                </tr>
                <tr>
                    <td><strong>Role</strong></td>
                    <td>${employee.role || "-"}</td>
                </tr>
                <tr>
                    <td><strong>Status</strong></td>
                    <td>
                        <span class="status ${(employee.status || "").toLowerCase()}">
                            ${employee.status || "-"}
                        </span>
                    </td>
                </tr>
                <tr>
                    <td><strong>Workflow Stage</strong></td>
                    <td>${employee.workflow_stage || "-"}</td>
                </tr>
                <tr>
                    <td><strong>Joining Date</strong></td>
                    <td>${employee.joining_date || "-"}</td>
                </tr>
                <tr>
                    <td><strong>Created At</strong></td>
                    <td>${employee.created_at || "-"}</td>
                </tr>
            </table>

            <hr>

            <h3>Upload Documents</h3>
            <div class="upload-section">
                <p>
                    <label><strong>Identity Document</strong></label><br>
                    <input type="file" id="identityFile">
                </p>
                <p>
                    <label><strong>PAN Card</strong></label><br>
                    <input type="file" id="panFile">
                </p>
                <p>
                    <label><strong>Resume</strong></label><br>
                    <input type="file" id="resumeFile">
                </p>
                <p>
                    <label><strong>Offer Letter</strong></label><br>
                    <input type="file" id="offerLetterFile">
                </p>
                <button class="upload-submit-btn" style="margin-top:15px;" onclick="uploadAllDocuments('${employee.employee_id}')">
                    Upload Documents
                </button>
            </div>

            <hr>

            <h3>Uploaded Documents</h3>
            <table class="details-table">
                <tr>
                    <th>Document</th>
                    <th>Action</th>
                </tr>
                <tr>
                    <td>Identity Document</td>
                    <td>
                        <button onclick="downloadDocument('identity', '${employee.employee_id}')">
                            Download
                        </button>
                    </td>
                </tr>
                <tr>
                    <td>PAN Card</td>
                    <td>
                        <button onclick="downloadDocument('pan', '${employee.employee_id}')">
                            Download
                        </button>
                    </td>
                </tr>
                <tr>
                    <td>Resume</td>
                    <td>
                        <button onclick="downloadDocument('resume', '${employee.employee_id}')">
                            Download
                        </button>
                    </td>
                </tr>
                <tr>
                    <td>Offer Letter</td>
                    <td>
                        <button onclick="downloadDocument('offer_letter', '${employee.employee_id}')">
                            Download
                        </button>
                    </td>
                </tr>
            </table>

            <div class="action-buttons" style="margin-top: 25px;">
                <button class="approve-btn" onclick="updateEmployeeStatus('${employee.employee_id}','Approved')">
                    Approve
                </button>
                <button class="reject-btn" onclick="updateEmployeeStatus('${employee.employee_id}','Rejected')">
                    Reject
                </button>
            </div>
        </div>
        `;

    } catch (error) {
        console.error(error);
        employeeDetails.innerHTML = `
            <p style="color:red;">
                Failed to load employee details.
            </p>
        `;
    }
}

// =============================
// Document Upload Processing
// =============================
async function uploadAllDocuments(employeeId) {
    const files = [
        { type: "identity", input: document.getElementById("identityFile") },
        { type: "pan", input: document.getElementById("panFile") },
        { type: "resume", input: document.getElementById("resumeFile") },
        { type: "offer_letter", input: document.getElementById("offerLetterFile") }
    ];

    let filesSelected = 0;
    let itemsProcessed = 0;

    for (const doc of files) {
        if (!doc.input || !doc.input.files.length) continue;

        filesSelected++;
        const file = doc.input.files[0];

        try {
            // Step 1: Generate S3 upload URL
            const uploadResponse = await fetch(`${API_BASE_URL}/upload`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    employee_id: employeeId,
                    document_type: doc.type,
                    file_name: file.name,
                    content_type: file.type
                })
            });

            if (!uploadResponse.ok) throw new Error(`Failed getting upload target link for ${doc.type}`);
            
            const uploadData = await uploadResponse.json();

            // Safely verify if response payload is inside a proxy body wrapper string
            const result = uploadData.body
                ? JSON.parse(uploadData.body)
                : uploadData;

            // Step 2: Stream raw binary payload to Amazon S3 via camelCase uploadUrl
            const s3Response = await fetch(result.uploadUrl, {
                method: "PUT",
                headers: { "Content-Type": file.type },
                body: file
            });

            if (!s3Response.ok) throw new Error(`Failed to stream binary object via presigned upload for ${doc.type}`);

            // Step 3: Commit transactional file storage state metadata entries to DynamoDB using camelCase objectKey
            const metadataResponse = await fetch(`${API_BASE_URL}/save-document`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    employee_id: employeeId,
                    document_type: doc.type,
                    object_key: result.objectKey,
                    file_name: file.name
                })
            });

            if (!metadataResponse.ok) throw new Error(`Failed to commit database metadata changes for ${doc.type}`);
            
            itemsProcessed++;

        } catch (err) {
            console.error(`Asset processing pipeline execution failure target: ${doc.type}`, err);
            alert(`Execution pipeline stopped: failed to upload ${doc.type}`);
            return;
        }
    }

    if (filesSelected === 0) {
        alert("Please select at least one document asset choice first.");
        return;
    }

    if (itemsProcessed === filesSelected) {
        alert("All selected assets successfully committed to record systems.");
        viewEmployee(employeeId); // Refresh modal view interface state clear of cache issues
    }
}

// =============================
// Update Onboarding Workflow Status
// =============================
async function updateEmployeeStatus(employeeId, status) {
    try {
        const response = await fetch(
            `${API_BASE_URL}/employee/${employeeId}/status`,
            {
                method: "PUT",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ status: status })
            }
        );

        if (!response.ok) {
            throw new Error("Unable to complete status changes.");
        }

        alert(`Employee status updated to "${status}" successfully.`);
        modal.style.display = "none";
        loadEmployees();

    } catch (error) {
        console.error(error);
        alert("Failed to update employee status.");
    }
}

// =============================
// Download Document
// =============================
async function downloadDocument(docType, employeeId) {
    try {
        const response = await fetch(`${API_BASE_URL}/employee/${employeeId}/document/${docType}`);
        
        if (!response.ok) {
            throw new Error("Target requested resource payload download path endpoint invalid.");
        }
        
        const data = await response.json();
        
        // Parse securely in case download link properties exist within JSON responses
        const result = data.body ? JSON.parse(data.body) : data;
        const downloadUrl = result.downloadUrl || result.download_url || result.url;
        
        if (downloadUrl) {
            window.open(downloadUrl, '_blank');
        } else {
            alert("Download link not found for this document configuration.");
        }
    } catch (error) {
        console.error("Error downloading file:", error);
        alert("Failed to download requested document.");
    }
}

// =============================
// Modal Window Configuration Interaction Events
// =============================
closeModal.onclick = function () {
    modal.style.display = "none";
};

window.onclick = function (event) {
    if (event.target === modal) {
        modal.style.display = "none";
    }
};
