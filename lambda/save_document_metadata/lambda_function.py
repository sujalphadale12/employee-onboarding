import json
import boto3
import os
from datetime import datetime

dynamodb = boto3.resource("dynamodb")

table = dynamodb.Table(os.environ["TABLE_NAME"])

def lambda_handler(event, context):

    body = json.loads(event["body"])

    employee_id = body["employee_id"]
    document_name = body["document_name"]
    object_key = body["object_key"]

    table.put_item(
        Item={
            "EmployeeID": employee_id,
            "DocumentName": document_name,
            "ObjectKey": object_key,
            "UploadTime": datetime.utcnow().isoformat(),
            "Status": "Pending"
        }
    )

    return {
        "statusCode": 200,
        "headers": {
            "Access-Control-Allow-Origin": "*",
            "Access-Control-Allow-Headers": "Content-Type",
            "Access-Control-Allow-Methods": "OPTIONS,POST"
        },
        "body": json.dumps({
            "message": "Document metadata saved successfully"
        })
    }
