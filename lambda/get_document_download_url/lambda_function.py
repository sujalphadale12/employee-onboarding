import json
import boto3

dynamodb = boto3.resource("dynamodb")
s3 = boto3.client("s3")

TABLE_NAME = "EmployeeDocuments"
BUCKET_NAME = "employee-onboarding-documents-sujal"

table = dynamodb.Table(TABLE_NAME)

def lambda_handler(event, context):

    try:
        employee_id = event["pathParameters"]["employee_id"]
        document_type = event["pathParameters"]["document_type"].lower()

        response = table.scan()

        items = response.get("Items", [])

        document = None

        for item in items:

            if item.get("EmployeeID") != employee_id:
                continue

            if item.get("DocumentType", "").lower() == document_type:
                document = item
                break

        if document is None:
            return {
                "statusCode": 404,
                "headers": {
                    "Access-Control-Allow-Origin": "*"
                },
                "body": json.dumps({
                    "message": "Document not found"
                })
            }

        object_key = document["ObjectKey"]

        download_url = s3.generate_presigned_url(
            ClientMethod="get_object",
            Params={
                "Bucket": BUCKET_NAME,
                "Key": object_key
            },
            ExpiresIn=300
        )

        return {
            "statusCode": 200,
            "headers": {
                "Access-Control-Allow-Origin": "*"
            },
            "body": json.dumps({
                "downloadUrl": download_url
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
