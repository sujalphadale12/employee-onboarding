import json
import boto3

dynamodb = boto3.resource("dynamodb")
table = dynamodb.Table("Employees")

def lambda_handler(event, context):
    try:
        employee_id = event["pathParameters"]["employee_id"]

        body = json.loads(event["body"])
        status = body["status"]

        workflow_stage = (
            "Approved"
            if status.lower() == "approved"
            else "Rejected"
        )

        table.update_item(
            Key={
                "employee_id": employee_id
            },
            UpdateExpression="""
                SET #s = :s,
                    workflow_stage = :w
            """,
            ExpressionAttributeNames={
                "#s": "status"
            },
            ExpressionAttributeValues={
                ":s": status,
                ":w": workflow_stage
            }
        )

        return {
            "statusCode": 200,
            "headers": {
                "Access-Control-Allow-Origin": "*",
                "Access-Control-Allow-Headers": "*",
                "Access-Control-Allow-Methods": "*"
            },
            "body": json.dumps({
                "message": "Employee updated successfully"
            })
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
