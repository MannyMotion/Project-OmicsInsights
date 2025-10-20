import type { Step } from '../types';

export const steps: Step[] = [
  {
    id: 0,
    title: 'Intro & Idea Validation',
    description: 'Validating the core problem and solution for OmicsInsight.',
    longDescription: 'Before building our n8n workflows, we must validate that the problem is real and the solution is desired. For OmicsInsight, this means confirming that researchers struggle with omics data analysis and would value an automated, cloud-native platform orchestrated by a powerful workflow engine like n8n.',
    examples: [
      {
        type: 'text',
        title: 'User Persona: Dr. Anya Sharma',
        content: 'Role: Postdoctoral Researcher in a molecular biology lab.\nPain Points: "Running analysis pipelines is manual, error-prone, and requires constant monitoring. I need a system that can take my raw data, run the analysis automatically, and notify me when it\'s done."',
      },
      {
        type: 'text',
        title: 'Value Proposition (n8n-powered)',
        content: 'OmicsInsight is a cloud-based platform that uses n8n to automate the analysis, visualization, and collaboration of transcriptomic data, empowering biologists and accelerating research from months to days.',
      },
    ],
    checklist: [
      { text: 'Define the core problem OmicsInsight solves.' },
      { text: 'Identify target user personas for an automated platform.' },
      { text: 'Conduct user interviews focused on workflow automation needs.' },
      { text: 'Create a landing page to gauge interest in an n8n-powered solution.' },
      { text: 'Formulate a clear, one-sentence value proposition.' },
    ],
  },
  {
    id: 1,
    title: 'Research & Planning',
    description: 'Analyzing competitors and defining the MVP feature set.',
    longDescription: 'With a validated idea, we now plan the Minimum Viable Product (MVP). We will analyze the market and define a core set of features that can be built and orchestrated effectively using n8n workflows, focusing on automation and reliability as key differentiators.',
    examples: [
      {
        type: 'text',
        title: 'Competitive Analysis (Automation Focus)',
        content: '- Galaxy: Powerful but requires manual step-by-step execution.\n- Basepair: User-friendly but a "black box" with limited workflow customization.\n- In-house Scripts: No robust orchestration, error handling, or status monitoring.',
      },
      {
        type: 'code',
        title: 'MVP Feature Map (for n8n)',
        language: 'json',
        content: `
{
  "must_have": [
    "n8n Webhook for data upload",
    "S3 storage for raw data",
    "PostgreSQL for job tracking",
    "n8n workflow to trigger Dockerized R analysis",
    "Email notification on completion"
  ],
  "should_have": [
    "Job status polling workflow",
    "Stripe integration for billing",
    "Slack notifications for errors"
  ],
  "wont_have": [
    "Interactive UI for workflow building",
    "On-premise n8n deployment"
  ]
}`
      },
    ],
    checklist: [
      { text: 'List 3-5 competitors and analyze their automation capabilities.' },
      { text: 'Define your MVP feature set based on what can be orchestrated by n8n.' },
      { text: 'Outline the core n8n workflows needed (e.g., Upload, Analyze, Notify).' },
      { text: 'Draft a tiered pricing model based on usage/analysis minutes.' },
      { text: 'Create a high-level project roadmap for the next 6 months.' },
    ],
  },
  {
    id: 2,
    title: 'n8n Technical Architecture',
    description: 'Designing the blueprint for your n8n-orchestrated application.',
    longDescription: 'Here, we design the high-level architecture with n8n at its core. n8n will act as the "brain" of our operation, receiving requests, triggering jobs in containerized workers, storing data, updating our database, and handling notifications. This creates a robust, scalable, and observable system.',
    examples: [
        {
            type: 'image',
            title: 'n8n-Centric Architecture Diagram',
            content: 'https://picsum.photos/seed/n8n-arch/600/350'
        },
        {
            type: 'text',
            title: 'Tech Stack Choices',
            content: '- Orchestration: n8n (self-hosted via Docker) to manage all workflows.\n- Analysis Workers: Docker containers running R scripts (e.g., DESeq2).\n- Job Runner: A simple FastAPI microservice that n8n calls to start Docker containers.\n- Database: PostgreSQL to store user, job, and billing metadata.\n- Storage: AWS S3 for raw data, intermediate files, and final results.\n- Frontend: A simple React UI to interact with the n8n webhook endpoint.'
        },
    ],
    checklist: [
        { text: 'Design the primary n8n workflows (Upload, Analysis, Monitoring).' },
        { text: 'Define the API contract between n8n and the R worker job runner.' },
        { text: 'Choose a database and file storage solution (Postgres & S3).' },
        { text: 'Design the database schema for users, jobs, and results.' },
        { text: 'Plan your authentication strategy for n8n webhooks (API keys).' }
    ]
  },
   {
    id: 3,
    title: 'Development Environment Setup',
    description: 'Preparing your local machine with Docker Compose.',
    longDescription: 'To ensure a consistent and reproducible development environment, we will use Docker Compose to run n8n, PostgreSQL, and a local S3 alternative (MinIO) with a single command. This mirrors the production setup and simplifies development.',
    examples: [
      {
        type: 'code',
        title: 'docker-compose.yml for Local Dev',
        language: 'bash',
        content: `
version: '3.8'

services:
  n8n:
    image: n8nio/n8n
    ports:
      - "5678:5678"
    environment:
      - N8N_HOST=localhost
      - DB_TYPE=postgresdb
      # ... other DB and credential env vars
    volumes:
      - n8n_data:/home/node/.n8n

  postgres:
    image: postgres:13
    ports:
      - "5432:5432"
    environment:
      - POSTGRES_USER=n8n
      # ... other PG env vars
    volumes:
      - pg_data:/var/lib/postgresql/data

  minio:
    image: minio/minio
    ports:
      - "9000:9000"
      - "9001:9001"
    # ... other MinIO config
volumes:
  n8n_data:
  pg_data:`
      },
    ],
    checklist: [
      { text: 'Install Docker and Docker Compose.' },
      { text: 'Create a docker-compose.yml file for n8n, Postgres, and MinIO.' },
      { text: 'Configure n8n environment variables to connect to the database.' },
      { text: 'Set up credentials in n8n for AWS (MinIO), Postgres, etc.' },
      { text: 'Run `docker-compose up` and confirm all services start correctly.' },
    ],
  },
  {
    id: 4,
    title: 'Core Workflow: Upload & Analysis',
    description: 'Building the foundational n8n workflows.',
    longDescription: 'This is the heart of the application. We will build the n8n workflows that handle file uploads, trigger the analysis in a Docker container, and monitor the job status. This workflow will be the primary entry point for users.',
    examples: [
      {
        type: 'code',
        title: 'n8n Upload Handler Workflow (Simplified)',
        language: 'json',
        content: `
// 1. Webhook Node: Receives file info from frontend.
// 2. S3 Node (Presigned URL): Generates a secure upload URL.
// 3. Respond to Webhook Node: Returns the URL to the frontend.
// 4. Postgres Node: Inserts a new job record with 'PENDING' status.
// 5. HTTP Request Node: Calls the 'Start Analysis' workflow.`
      },
       {
        type: 'code',
        title: 'FastAPI Job Runner Endpoint',
        language: 'python',
        content: `
from fastapi import FastAPI, BackgroundTasks
import docker

app = FastAPI()
client = docker.from_env()

def run_deseq2_container(s3_path: str, job_id: str):
    # Command to run the R script inside the container
    command = f"Rscript /app/run_deseq2.R --input {s3_path} --job {job_id}"
    client.containers.run("omics-worker:latest", command, detach=False)
    # Update job status in DB...

@app.post("/run-analysis")
async def run_analysis(job: dict, background_tasks: BackgroundTasks):
    s3_path = job.get("s3_path")
    job_id = job.get("job_id")
    background_tasks.add_task(run_deseq2_container, s3_path, job_id)
    return {"message": "Analysis started"}`
      },
    ],
    checklist: [
      { text: 'Build the "Upload Handler" n8n workflow.' },
      { text: 'Build the "Start Analysis" n8n workflow.' },
      { text: 'Create the Dockerfile and R script for the analysis worker.' },
      { text: 'Implement the FastAPI job runner microservice.' },
      { text: 'Test the end-to-end flow from webhook to container execution.' },
    ],
  },
  {
    id: 5,
    title: 'R Worker & Containerization',
    description: 'Creating the DESeq2 analysis worker.',
    longDescription: 'The actual scientific analysis happens inside a Docker container. We will create an R script that runs DESeq2, parameterize it to accept inputs via command-line arguments, and wrap it in a Dockerfile with all necessary dependencies.',
    examples: [
      {
        type: 'code',
        title: 'Dockerfile for R Worker',
        language: 'bash',
        content: `
FROM rocker/r-ver:4.2.0

RUN R -e "install.packages('BiocManager', repos = 'http://cran.us.r-project.org')"
RUN R -e "BiocManager::install('DESeq2')"
RUN R -e "install.packages('argparse')"

WORKDIR /app
COPY run_deseq2.R .

ENTRYPOINT ["Rscript", "/app/run_deseq2.R"]`
      },
      {
        type: 'code',
        title: 'R Script Snippet (argparse)',
        language: 'r',
        content: `
library("argparse")
parser <- ArgumentParser()

parser$add_argument("--counts", help="Path to counts CSV file.")
parser$add_argument("--metadata", help="Path to metadata CSV file.")
parser$add_argument("--out_prefix", help="Prefix for output files.")

args <- parser$parse_args()

# ... Your DESeq2 code here using args$counts, etc.
# ... Write results (plots, CSVs) to files.`
      },
    ],
    checklist: [
      { text: 'Write the R script to perform DESeq2 analysis.' },
      { text: 'Add argument parsing to the R script for inputs/outputs.' },
      { text: 'Create a Dockerfile to install R, BiocManager, and dependencies.' },
      { text: 'Build the Docker image and test it locally.' },
      { text: 'Push the Docker image to a container registry (e.g., Docker Hub, AWS ECR).' },
    ],
  },
  {
    id: 6,
    title: 'Workflow: Monitoring & Notifications',
    description: 'Ensuring reliability and keeping users informed.',
    longDescription: 'A long-running analysis needs monitoring. We will create a polling workflow in n8n that checks job status. Upon completion or failure, it will trigger another workflow to process results and notify the user via email or Slack.',
    examples: [
      {
        type: 'code',
        title: 'n8n Job Monitor Workflow (Logic)',
        language: 'json',
        content: `
// 1. Cron Node: Run every 5 minutes.
// 2. Postgres Node: SELECT * FROM jobs WHERE status = 'RUNNING'.
// 3. SplitInBatches Node: Process each running job.
// 4. HTTP Request Node: Poll the job runner for status.
// 5. IF Node: Check if status is 'COMPLETED' or 'FAILED'.
// 6. On 'COMPLETED': Trigger 'Results Post-Processing' workflow.
// 7. On 'FAILED': Trigger 'Error Notification' workflow.`
      },
      {
        type: 'code',
        title: 'n8n Notification Workflow (Nodes)',
        language: 'json',
        content: `
// 1. Webhook Node: Triggered by other workflows.
// 2. IF Node: Check if status is success or failure.
// 3. Email Node (Success): Send an email with a link to results.
// 4. Slack Node (Failure): Send an alert to the admin channel.`
      },
    ],
    checklist: [
      { text: 'Build the "Job Monitor" n8n workflow.' },
      { text: 'Build the "Results Post-Processing" workflow (e.g., zip files, generate PDF).' },
      { text: 'Build the "Notification" workflow for success and failure cases.' },
      { text: 'Configure Email and Slack credentials in n8n.' },
      { text: 'Test the monitoring and notification flows.' },
    ],
  },
  {
    id: 7,
    title: 'Deployment',
    description: 'Making your n8n-powered service live.',
    longDescription: 'Deployment involves setting up n8n and its supporting services (Postgres, job runner) in a production environment. We will use a cloud provider and focus on container-based deployments for consistency and scalability.',
    examples: [
      {
        type: 'text',
        title: 'Production Deployment Strategy',
        content: '- n8n: Deploy using Docker on a cloud VM (e.g., DigitalOcean Droplet, AWS EC2) or a managed container service.\n- R Worker: Use a service like AWS Fargate or Google Cloud Run to run analysis containers on-demand.\n- FastAPI Job Runner: Deploy as a container alongside n8n.\n- Database: Use a managed database service like Amazon RDS or Supabase Postgres.',
      },
      {
        type: 'text',
        title: 'Security Best Practices',
        content: '- Protect n8n webhook URLs with a secret token or HMAC validation.\n- Use n8n\'s built-in credential management; do not hardcode keys.\n- Use pre-signed S3 URLs for uploads to avoid data passing through the n8n instance.\n- Enforce SSL/HTTPS on all endpoints.'
      },
    ],
    checklist: [
      { text: 'Set up a production database (e.g., AWS RDS).' },
      { text: 'Choose a cloud provider and deployment method for n8n.' },
      { text: 'Deploy the FastAPI job runner service.' },
      { text: 'Configure production environment variables and credentials in n8n.' },
      { text: 'Set up a reverse proxy (e.g., Nginx) with HTTPS for all services.' },
    ],
  },
  {
    id: 8,
    title: 'Workflow: Billing & Admin',
    description: 'Integrating Stripe for payments and creating admin workflows.',
    longDescription: 'To monetize the service, we will create an n8n workflow that listens to Stripe webhooks to manage user subscriptions. We will also build administrative workflows for maintenance tasks like cleaning up old data and monitoring costs.',
    examples: [
      {
        type: 'code',
        title: 'n8n Stripe Webhook Handler (Nodes)',
        language: 'json',
        content: `
// 1. Stripe Webhook Node: Listens for events like 'invoice.paid'.
// 2. Switch Node: Route logic based on event type.
// 3. For 'invoice.paid':
//    - Postgres Node: UPDATE users SET plan = 'pro' WHERE stripe_customer_id = {{ $json.body.customer }}.
// 4. For 'customer.subscription.deleted':
//    - Postgres Node: UPDATE users SET plan = 'free' WHERE stripe_customer_id = {{ $json.body.customer }}.`
      },
      {
        type: 'code',
        title: 'Admin Cleanup Workflow (Nodes)',
        language: 'json',
        content: `
// 1. Cron Node: Run daily at midnight.
// 2. Postgres Node: SELECT user_id FROM users WHERE plan = 'free'.
// 3. S3 Node: List files older than 30 days for free-tier users.
// 4. S3 Node: Delete old files.`
      },
    ],
    checklist: [
      { text: 'Create a Stripe account and define your subscription products.' },
      { text: 'Build the "Stripe Webhook Handler" n8n workflow.' },
      { text: 'Add subscription/plan status to your `users` table in Postgres.' },
      { text: 'Build the "Admin Cleanup" workflow.' },
      { text: 'Create a cost-monitoring workflow that sends a daily summary to Slack.' },
    ],
  },
  {
    id: 9,
    title: 'Launch & Export Summary',
    description: 'Final checks and exporting your project plan.',
    longDescription: 'Congratulations! You have designed a fully automated SaaS orchestrated by n8n. This final step is about running through a pre-launch checklist and celebrating. You can also export your progress from this builder as a JSON file to document your entire plan.',
    examples: [
      {
        type: 'text',
        title: 'Pre-Launch Checklist',
        content: '- [ ] Set up logging and monitoring for n8n and all microservices.\n- [ ] Set up error monitoring (e.g., Sentry) via n8n\'s error workflow trigger.\n- [ ] Double-check all production credentials and environment variables.\n- [ ] Announce your launch on relevant platforms (e.g., Twitter, LinkedIn, scientific forums).',
      }
    ],
    checklist: [
      { text: 'Complete the pre-launch checklist.' },
      { text: 'Prepare your launch announcement and marketing materials.' },
      { text: 'Monitor n8n execution logs for errors after launch.' },
      { text: 'Export your project summary from this builder.' },
      { text: 'Celebrate building a robust, automated platform!' },
    ],
  },
];