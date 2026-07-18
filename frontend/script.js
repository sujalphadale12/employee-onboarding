const apiURL =
"https://ziadx9y2x0.execute-api.ap-south-1.amazonaws.com/prod/employee";

const form = document.getElementById("employeeForm");

const message = document.getElementById("message");

form.addEventListener("submit", async function(event){

    event.preventDefault();

    const employee = {

        name:
        document.getElementById("name").value,

        email:
        document.getElementById("email").value,

        department:
        document.getElementById("department").value,

        role:
        document.getElementById("role").value,

        joining_date:
        document.getElementById("joining_date").value

    };

    message.style.color="black";

    message.innerHTML="Registering Employee...";

    try{

        const response = await fetch(apiURL,{

            method:"POST",

            headers:{

                "Content-Type":"application/json"

            },

            body:JSON.stringify(employee)

        });

        const result = await response.json();

        if(response.ok){

            message.style.color="green";

            message.innerHTML=`
            Employee Registered Successfully
            <br><br>
            Employee ID:
            <br>
            ${result.employee_id}
            `;

            form.reset();

        }

        else{

            message.style.color="red";

            message.innerHTML=result.error;

        }

    }

    catch(error){

        message.style.color="red";

        message.innerHTML="Unable to connect API.";

    }

});
