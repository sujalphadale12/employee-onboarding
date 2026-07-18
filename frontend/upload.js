const uploadApi = "https://ziadx9y2x0.execute-api.ap-south-1.amazonaws.com/prod/upload";
const saveDocumentApi = "https://ziadx9y2x0.execute-api.ap-south-1.amazonaws.com/prod/save-document";

const uploadForm = document.getElementById("uploadForm");
const message = document.getElementById("message");

uploadForm.addEventListener("submit", async (event) => {

    event.preventDefault();

    const employeeId = document.getElementById("employee_id").value;
    const file = document.getElementById("document").files[0];

    if (!file) {
        message.style.color = "red";
        message.innerHTML = "Please select a PDF file.";
        return;
    }

    try {

        message.style.color = "black";
        message.innerHTML = "Generating upload URL...";

        const response = await fetch(uploadApi, {

            method: "POST",

            headers: {
                "Content-Type": "application/json"
            },

            body: JSON.stringify({
                employee_id: employeeId,
                file_name: file.name,
                content_type: file.type
            })

        });

        const result = await response.json();

        if (!response.ok) {
            throw new Error(result.error);
        }

        message.innerHTML = "Uploading document to S3...";

        const uploadResponse = await fetch(result.upload_url, {

            method: "PUT",

            headers: {
                "Content-Type": file.type
            },

            body: file

        });

        if (!uploadResponse.ok) {
            throw new Error("S3 upload failed.");
        }

        message.innerHTML = "Saving document details...";

        const saveResponse = await fetch(saveDocumentApi, {

            method: "POST",

            headers: {
                "Content-Type": "application/json"
            },

            body: JSON.stringify({
                employee_id: employeeId,
                document_name: file.name,
                object_key: result.object_key
            })

        });

        const saveResult = await saveResponse.json();

        if (!saveResponse.ok) {
            throw new Error(saveResult.error);
        }

        message.style.color = "green";
        message.innerHTML = "✅ Document uploaded successfully.";

        uploadForm.reset();

    }

    catch (error) {

        message.style.color = "red";
        message.innerHTML = error.message;

    }

});
