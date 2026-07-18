const API_BASE = "https://ziadx9y2x0.execute-api.ap-south-1.amazonaws.com/prod";

document.getElementById("searchBtn").addEventListener("click", async () => {

    const employeeId = document.getElementById("employeeId").value.trim();

    if (!employeeId) {
        alert("Please enter an Employee ID");
        return;
    }

    try {

        const response = await fetch(`${API_BASE}/employee/${employeeId}`);

        if (!response.ok) {
            throw new Error("Employee not found");
        }

        const employee = await response.json();

        document.getElementById("name").textContent = employee.name;
        document.getElementById("email").textContent = employee.email;
        document.getElementById("department").textContent = employee.department;
        document.getElementById("role").textContent = employee.role;
        document.getElementById("joiningDate").textContent = employee.joining_date;
        document.getElementById("status").textContent = employee.status;
        document.getElementById("workflowStage").textContent = employee.workflow_stage;

        document.getElementById("employeeCard").style.display = "block";

    } catch (error) {

        alert(error.message);
        document.getElementById("employeeCard").style.display = "none";
    }

});
