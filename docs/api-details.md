# Employee Registration API

## API Name
EmployeeOnboardingAPI

## Endpoint
POST /employee

## Region
ap-south-1

## Response

200 OK

{
  "message": "Employee Created Successfully",
  "employee_id": "<uuid>"
}

## Flow

Postman / Frontend
        ↓
API Gateway
        ↓
CreateEmployee Lambda
        ↓
DynamoDB
