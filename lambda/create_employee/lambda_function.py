import json
import boto3
import uuid
import os
from datetime import datetime

# Create DynamoDB resource
dynamodb = boto3.resource("dynamodb")

# Read table name from environment variable
table = dynamodb.Table(os.environ["TABLE_NAME"])


def lambda_handler(event, context):

    # Read data from API request
    name = event["name"]
    email = event["email"]
    department = event["department"]
    role = event["role"]
    joining_date = event["joining_date"]

    # Generate unique employee ID
    employee_id = str(uuid.uuid4())

    # Save employee in DynamoDB
    table.put_item(
        Item={
            "employee_id": employee_id,
            "name": name,
            "email": email,
            "department": department,
            "role": role,
            "joining_date": joining_date,
            "status": "Pending",
            "workflow_stage": "Employee Created",
            "created_at": datetime.utcnow().isoformat()
        }
    )

    return {
        "statusCode": 200,
        "body": json.dumps({
            "message": "Employee Created Successfully",
            "employee_id": employee_id
        })
    }
