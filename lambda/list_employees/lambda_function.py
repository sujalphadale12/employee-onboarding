import json
import boto3
import os

# Initialize DynamoDB
dynamodb = boto3.resource("dynamodb")

# Read table name from environment variable
table = dynamodb.Table(os.environ["TABLE_NAME"])


def lambda_handler(event, context):

    try:

        # Read all employees from the table
        response = table.scan()

        employees = response.get("Items", [])

        return {
            "statusCode": 200,
            "headers": {
                "Access-Control-Allow-Origin": "*",
                "Content-Type": "application/json"
            },
            "body": json.dumps(employees)
        }

    except Exception as e:

        return {
            "statusCode": 500,
            "headers": {
                "Access-Control-Allow-Origin": "*"
            },
            "body": json.dumps({
                "error": str(e)
            })
        }
