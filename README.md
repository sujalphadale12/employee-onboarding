# Smart Employee Onboarding & Identity Service

A serverless Employee Onboarding application built on AWS that automates employee registration, document management, approval workflows, and secure document access using pre-signed URLs.

---

## Features

- Employee Registration
- Employee Management Dashboard
- Employee Details View
- Employee Approval/Rejection Workflow
- Secure Document Upload
- Secure Document Download
- Amazon S3 Pre-signed URLs
- DynamoDB Metadata Storage
- Serverless AWS Architecture

---

## AWS Services Used

- AWS Lambda
- Amazon API Gateway
- Amazon S3
- Amazon DynamoDB
- AWS IAM
- Amazon CloudWatch

---

## Technology Stack

Frontend
- HTML
- CSS
- JavaScript

Backend
- Python
- AWS Lambda

Cloud
- API Gateway
- Amazon S3
- DynamoDB
- IAM

---

## Architecture

User
↓

S3 Static Website

↓

API Gateway

↓

AWS Lambda

↓

Amazon DynamoDB

↓

Amazon S3

---

## API Endpoints

POST /employee

GET /employees

GET /employee/{employee_id}

PUT /employee/{employee_id}/status

POST /upload

POST /save-document

GET /employee/{employee_id}/document/{document_type}

---

## Folder Structure

frontend/

backend/

architecture/

screenshots/

README.md

requirements.txt

---

## Screenshots

- Employee Registration
- Employee Dashboard
- Employee Details
- Upload Documents
- Download Documents
- Approval Workflow

---

## Future Enhancements

- Amazon Cognito Authentication
- Email Notifications
- Search & Filtering
- Terraform Deployment
- CI/CD Pipeline

---

## Author

**Sujal Phadale**

AWS Cloud & DevOps Learner# Smart Employee Onboarding & Identity Service

## Project Overview

A serverless Employee Onboarding application built using AWS services.

## AWS Services Used

- AWS Lambda
- Amazon DynamoDB
- Amazon API Gateway
- Amazon Cognito
- Amazon S3
- AWS Step Functions
- Amazon SES
- Amazon CloudWatch
- IAM

## Project Progress

- [x] IAM Role
- [x] DynamoDB Table
- [x] S3 Buckets
- [x] CreateEmployee Lambda
- [ ] API Gateway
- [ ] Frontend
- [ ] Cognito
- [ ] Document Upload
- [ ] Step Functions
- [ ] SES
- [ ] Dashboard

## Architecture

Architecture diagram will be added here.
# employee-onboarding
