import json
import boto3
import os

dynamodb = boto3.resource("dynamodb")

table = dynamodb.Table(os.environ["TABLE_NAME"])

def lambda_handler(event, context):

    try:

        employee_id = event["pathParameters"]["employee_id"]

        response = table.get_item(
            Key={
                "employee_id": employee_id
            }
        )

        if "Item" not in response:
            return {
                "statusCode": 404,
                "headers": {
                    "Access-Control-Allow-Origin": "*"
                },
                "body": json.dumps({
                    "error": "Employee not found"
                })
            }

        return {
            "statusCode": 200,
            "headers": {
                "Access-Control-Allow-Origin": "*",
                "Content-Type": "application/json"
            },
            "body": json.dumps(response["Item"])
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
