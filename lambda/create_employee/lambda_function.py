import json
import boto3
import uuid
import os
from datetime import datetime

# Create DynamoDB resource
dynamodb = boto3.resource("dynamodb")

# Read table name from environment variable
TABLE_NAME = os.environ["TABLE_NAME"]
table = dynamodb.Table(TABLE_NAME)


def lambda_handler(event, context):

    try:
        # Handle both Lambda Test Event and API Gateway requests
        if "body" in event:
            body = json.loads(event["body"])
        else:
            body = event

        # Read employee details
        name = body["name"]
        email = body["email"]
        department = body["department"]
        role = body["role"]
        joining_date = body["joining_date"]

        # Generate unique Employee ID
        employee_id = str(uuid.uuid4())

        # Store data in DynamoDB
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

        # Return success response
        return {
            "statusCode": 200,
            "headers": {
                "Content-Type": "application/json",
                "Access-Control-Allow-Origin": "*",
                "Access-Control-Allow-Headers": "Content-Type",
                "Access-Control-Allow-Methods": "OPTIONS,POST"
            },
            "body": json.dumps({
                "message": "Employee Created Successfully",
                "employee_id": employee_id
            })
        }

    except KeyError as e:
        return {
            "statusCode": 400,
            "headers": {
                "Content-Type": "application/json",
                "Access-Control-Allow-Origin": "*",
                "Access-Control-Allow-Headers": "Content-Type",
                "Access-Control-Allow-Methods": "OPTIONS,POST"
            },
            "body": json.dumps({
                "error": f"Missing required field: {str(e)}"
            })
        }

    except Exception as e:
        return {
            "statusCode": 500,
            "headers": {
                "Content-Type": "application/json",
                "Access-Control-Allow-Origin": "*",
                "Access-Control-Allow-Headers": "Content-Type",
                "Access-Control-Allow-Methods": "OPTIONS,POST"
            },
            "body": json.dumps({
                "error": str(e)
            })
        }
