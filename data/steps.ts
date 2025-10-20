import type { Step } from '../types';

export const steps: Step[] = [
  {
    id: 0,
    title: 'Setup & Prerequisites',
    description: 'Gathering the tools and accounts needed to build OmicsInsight.',
    longDescription: 'Welcome to the OmicsInsight Builder! Before we write any code or build any workflows, we need to set up our foundational tools and services. This step ensures you have everything required to follow along smoothly. We will install local development software and sign up for the essential cloud services that will power our application.',
    examples: [
       {
        type: 'text',
        title: 'Required Software & Accounts',
        content: `
1. n8n Cloud Account: The fastest way to start. Go to n8n.io and sign up for a free starter plan.
2. Docker Desktop: The engine for running our application components locally. Download from docker.com.
3. A Code Editor: We recommend VS Code (code.visualstudio.com), but any editor will do.
4. AWS Account: For S3 file storage in production. Sign up at aws.amazon.com.
5. PostgreSQL Database: We'll use a local one for development, but for production, a service like Supabase, Neon, or AWS RDS is recommended.
6. Stripe Account: To handle payments and subscriptions. Sign up at stripe.com.`
      },
    ],
    checklist: [
      { text: 'Sign up for an n8n cloud account.' },
      { text: 'Install Docker and Docker Compose on your machine.' },
      { text: 'Install Visual Studio Code or your preferred code editor.' },
      { text: 'Create a free AWS account for S3 access.' },
      { text: 'Create a free Stripe developer account.' },
    ],
  },
  {
    id: 1,
    title: 'Local Environment with Docker',
    description: 'Use Docker Compose to run n8n, Postgres, and MinIO locally.',
    longDescription: 'To ensure our development environment is consistent and easy to manage, we will use Docker Compose. This tool allows us to define and run all our services (n8n for workflows, PostgreSQL for the database, and MinIO as a local S3-alternative) with a single command. This perfectly mimics a real production setup.',
    examples: [
      {
        type: 'code',
        title: 'Project Structure',
        language: 'bash',
        content: `
omics-insight/
├── docker-compose.yml
├── .env
├── runner/
│   └── ... (FastAPI code)
└── worker/
    └── ... (R script and Dockerfile)`
      },
      {
        type: 'code',
        title: 'docker-compose.yml for Local Development',
        language: 'yaml',
        content: `
version: '3.8'

services:
  n8n:
    image: n8nio/n8n
    restart: always
    ports:
      - "5678:5678"
    environment:
      - N8N_HOST=localhost
      - DB_TYPE=postgresdb
      - DB_POSTGRESDB_HOST=postgres
      - DB_POSTGRESDB_USER=\${POSTGRES_USER}
      - DB_POSTGRESDB_PASSWORD=\${POSTGRES_PASSWORD}
      - DB_POSTGRESDB_DATABASE=\${POSTGRES_DB}
      - DB_POSTGRESDB_PORT=5432
    volumes:
      - n8n_data:/home/node/.n8n

  postgres:
    image: postgres:13
    restart: always
    environment:
      - POSTGRES_USER=\${POSTGRES_USER}
      - POSTGRES_PASSWORD=\${POSTGRES_PASSWORD}
      - POSTGRES_DB=\${POSTGRES_DB}
    volumes:
      - pg_data:/var/lib/postgresql/data

volumes:
  n8n_data:
  pg_data:`
      },
      {
        type: 'code',
        title: '.env (Environment Variables)',
        language: 'bash',
        content: `
# For PostgreSQL
POSTGRES_USER=n8n
POSTGRES_PASSWORD=mysecretpassword
POSTGRES_DB=omics_insight
`
      },
    ],
    checklist: [
      { text: 'Create a new project folder named `omics-insight`.' },
      { text: 'Inside, create a file named `docker-compose.yml` and paste the code.' },
      { text: 'Create a file named `.env` and add the Postgres credentials.' },
      { text: 'Open your terminal in the project folder and run `docker-compose up`.' },
      { text: 'Access your local n8n instance by opening `http://localhost:5678` in your browser.' },
    ],
  },
  {
    id: 2,
    title: 'Create the R Worker Image',
    description: 'Build the Docker container that will run our DESeq2 analysis.',
    longDescription: 'The core scientific analysis will be performed by an R script packaged inside a Docker container. This makes our analysis environment portable and reproducible. We will create a simple R script that takes file paths as inputs, and then write a `Dockerfile` to build an image containing R, all necessary packages, and our script.',
    examples: [
        {
            type: 'code',
            title: 'worker/run_deseq2.R',
            language: 'r',
            content: `
# A simplified script for demonstration.
# In a real scenario, this would load DESeq2, read files,
# run the analysis, and save plots/CSVs to an output directory.

# Read command line arguments
args <- commandArgs(trailingOnly=TRUE)
cat("Received args:", args, "\n")

# Simulate work
cat("Starting DESeq2 analysis...\n")
Sys.sleep(15) # Simulate a 15-second analysis
cat("Analysis complete.\n")

# Create a dummy output file
write.csv(data.frame(result=c(1,2,3)), file = "results.csv")
cat("Results saved.\n")`
        },
        {
            type: 'code',
            title: 'worker/Dockerfile',
            language: 'bash',
            content: `
FROM rocker/r-ver:4.2.0

# Install DESeq2 and its dependencies
RUN R -e "install.packages('BiocManager', repos = 'http://cran.us.r-project.org')"
RUN R -e "BiocManager::install('DESeq2')"

# Copy our script into the container
WORKDIR /app
COPY run_deseq2.R .

# Set the entrypoint
ENTRYPOINT ["Rscript", "/app/run_deseq2.R"]`
        },
    ],
    checklist: [
        { text: 'Inside your project, create a new folder named `worker`.' },
        { text: 'Create the `run_deseq2.R` file inside the `worker` folder.' },
        { text: 'Create the `Dockerfile` inside the `worker` folder.' },
        { text: 'Build the image by running `docker build -t omics-worker:latest ./worker` in your terminal.' },
        { text: 'Test the worker by running `docker run --rm omics-worker:latest --input test.csv`.' }
    ]
  },
   {
    id: 3,
    title: 'Build the n8n Upload Workflow',
    description: 'Create the first n8n workflow to handle incoming analysis requests.',
    longDescription: 'This workflow is the public entry point to our service. It will be triggered by a webhook call from our future frontend. Its job is to securely receive file information, create a new job entry in our PostgreSQL database, and then trigger the next workflow to start the analysis.',
    examples: [
      {
        type: 'text',
        title: 'Workflow Steps & Node Configuration',
        content: `
1.  **Start Node:** This is always present.
2.  **Webhook Node:**
    -   Authentication: Header Auth
    -   HTTP Method: POST
    -   Copy the "Test URL". We'll use this to send sample data.
3.  **Postgres Node:**
    -   Create new Postgres credentials to connect to your local Docker database (Host: postgres, User/Pass/DB from .env).
    -   Operation: Execute Query
    -   Query: INSERT INTO jobs (user_id, status) VALUES ('{{$json.body.userId}}', 'PENDING') RETURNING id;
4.  **Set Node:**
    -   Name: job_id, Value: {{$node["Postgres"].json["id"]}}
    -   This extracts the new job ID from the Postgres node's output.
5.  **Execute Workflow Node:**
    -   This node will trigger our *next* workflow, passing the job_id along. (We'll build that workflow in the next step).`
      },
    ],
    checklist: [
      { text: 'In your n8n UI, create a new blank workflow named "Upload Handler".' },
      { text: 'Add and configure the Webhook node.' },
      { text: 'Set up your Postgres credentials in n8n.' },
      { text: 'Add and configure the Postgres node with the INSERT query.' },
      { text: 'Add a Set node to capture the returned job ID.' },
      { text: 'Save the workflow.' },
    ],
  },
  {
    id: 4,
    title: 'Build the n8n Analysis Workflow',
    description: 'Create the workflow that runs the Docker container.',
    longDescription: 'This internal workflow is triggered by the "Upload Handler". Its sole responsibility is to take a job ID, prepare the necessary command, and execute our R worker Docker container. For this, we\'ll use the "Execute Command" node which can run shell commands on the machine where n8n is running.',
    examples: [
      {
        type: 'text',
        title: 'Workflow Steps & Node Configuration',
        language: 'json',
        content: `
1.  **Start Node:** Change trigger to "Triggered by another workflow".
2.  **Postgres Node (Update Status):**
    -   Query: UPDATE jobs SET status = 'RUNNING' WHERE id = {{$json.query.job_id}};
3.  **Execute Command Node:**
    -   Command: docker run --rm --name job-{{$json.query.job_id}} omics-worker:latest --input {{$json.query.inputFile}}
4.  **IF Node:**
    -   Checks the exit code of the command node. {{$node["Execute Command"].json["exitCode"]}}
    -   If 0, the job succeeded. If not 0, it failed.
5.  **Postgres Node (Success):**
    -   Query: UPDATE jobs SET status = 'COMPLETED' WHERE id = {{$json.query.job_id}};
6.  **Postgres Node (Failure):**
    -   Query: UPDATE jobs SET status = 'FAILED' WHERE id = {{$json.query.job_id}};`
      },
    ],
    checklist: [
      { text: 'Create a new workflow named "Start Analysis".' },
      { text: 'Change its Start node to be triggered by another workflow.' },
      { text: 'Add a Postgres node to update the job status to RUNNING.' },
      { text: 'Add the Execute Command node to run `docker run` command.' },
      { text: 'Add an IF node and subsequent Postgres nodes to handle success and failure.' },
      { text: 'Go back to the "Upload Handler" workflow and link it to this one using the Execute Workflow node.' },
    ],
  },
  {
    id: 5,
    title: 'Build Notification Workflow',
    description: 'Notifying users when their analysis is complete.',
    longDescription: 'Keeping users informed is crucial. We will create a simple workflow that is triggered after the analysis finishes (either successfully or not) and sends an email to the user with the status of their job.',
    examples: [
        {
        type: 'text',
        title: 'Workflow Steps & Node Configuration',
        content: `
1.  **Start Node:** Triggered by another workflow.
2.  **Postgres Node (Get Job Info):**
    -   Query: SELECT u.email, j.status FROM jobs j JOIN users u ON j.user_id = u.id WHERE j.id = {{$json.query.job_id}};
3.  **IF Node:**
    -   Checks the status from the Postgres node: {{$node["Postgres"].json["status"]}}
4.  **Send Email Node (Success):**
    -   Configure with your email credentials (e.g., SMTP or Gmail).
    -   To: {{$node["Postgres"].json["email"]}}
    -   Subject: Your OmicsInsight Analysis is Complete!
5.  **Send Email Node (Failure):**
    -   To: {{$node["Postgres"].json["email"]}}
    -   Subject: Your OmicsInsight Analysis Failed`
      },
    ],
    checklist: [
      { text: 'Create a new workflow named "Notify User".' },
      { text: 'Add a Postgres node to fetch the user email and job status.' },
      { text: 'Add an IF node to branch based on job status.' },
      { text: 'Add and configure two Send Email nodes for success and failure cases.' },
      { text: 'Update the "Start Analysis" workflow to execute this notification workflow on both success and failure paths.' },
    ],
  },
  {
    id: 6,
    title: 'Integrate Stripe for Billing',
    description: 'Monetize your service by handling subscription events from Stripe.',
    longDescription: 'To turn this project into a business, we need to handle payments. We will create a workflow with a Stripe Trigger node. This node provides a unique URL that we will give to Stripe, which will call it whenever a subscription event happens (e.g., a user pays, cancels, etc.). Our workflow will then update the user\'s plan in our database.',
    examples: [
      {
        type: 'code',
        title: 'Stripe Webhook Workflow (Logic)',
        language: 'json',
        content: `
// 1. Stripe Trigger Node: Listens for events. Copy its Webhook URL.
//    - In Stripe Dashboard > Developers > Webhooks, add an endpoint using this URL.
//    - Listen for events like 'invoice.paid' and 'customer.subscription.deleted'.
// 2. Switch Node:
//    - Routes the workflow based on the event type: '{{$json.body.type}}'
// 3. Postgres Node (on 'invoice.paid' path):
//    - Query: UPDATE users SET plan = 'pro' WHERE stripe_customer_id = '{{$json.body.data.object.customer}}';
// 4. Postgres Node (on 'customer.subscription.deleted' path):
//    - Query: UPDATE users SET plan = 'free' WHERE stripe_customer_id = '{{$json.body.data.object.customer}}';`
      },
    ],
    checklist: [
      { text: 'In n8n, create a workflow named "Stripe Handler".' },
      { text: 'Add a Stripe Trigger node and copy its webhook URL.' },
      { text: 'In your Stripe dashboard, create a new webhook endpoint.' },
      { text: 'Add a Switch node to handle different event types.' },
      { text: 'Add Postgres nodes to update user subscription status in your database.' },
    ],
  },
  {
    id: 7,
    title: 'Deployment to Production',
    description: 'Taking your n8n-powered service from local to live.',
    longDescription: 'Running on your local machine is great for development, but now it\'s time to go live. Deployment involves setting up your services on a cloud server. The principles are the same as our local Docker setup, but we will use production-grade managed services for reliability and scalability.',
    examples: [
      {
        type: 'text',
        title: 'Production Checklist',
        content: `- Cloud Server: Rent a Virtual Private Server (VPS) from a provider like DigitalOcean or AWS (EC2).
- Managed Database: Use a service like AWS RDS or Supabase for your PostgreSQL database. This handles backups and scaling for you.
- Managed Storage: Use a real AWS S3 bucket instead of local MinIO.
- Container Registry: Push your \`omics-worker\` Docker image to a registry like Docker Hub or AWS ECR.
- Reverse Proxy: Use Nginx or Caddy to manage incoming traffic and provide SSL certificates (HTTPS).
- Environment Variables: Securely provide all your production credentials (database URLs, API keys) to your n8n instance.`
      },
    ],
    checklist: [
      { text: 'Choose a cloud provider and provision a server.' },
      { text: 'Set up a managed PostgreSQL database and get its connection URL.' },
      { text: 'Create a production S3 bucket in AWS.' },
      { text: 'Push your \`omics-worker\` Docker image to a container registry.' },
      { text: 'Install n8n on your server (using Docker is recommended).' },
      { text: 'Configure all production credentials and environment variables in n8n.' },
      { text: 'Set up a domain name and configure a reverse proxy with HTTPS.' },
    ],
  },
   {
    id: 8,
    title: 'Admin & Maintenance',
    description: 'Creating workflows to keep your service healthy and clean.',
    longDescription: 'A running service needs looking after. We can use n8n to automate our own administrative tasks. We will build a simple workflow that runs on a schedule (using the Cron node) to perform cleanup tasks, such as deleting old data from free-tier users to save on storage costs.',
    examples: [
      {
        type: 'code',
        title: 'Admin Cleanup Workflow (Nodes)',
        language: 'json',
        content: `
// 1. Cron Node:
//    - Mode: Every Day, Hour: 3 (Runs at 3 AM)
// 2. Postgres Node:
//    - Query: SELECT * FROM jobs WHERE status = 'COMPLETED' AND plan = 'free' AND created_at < NOW() - INTERVAL '30 days';
// 3. SplitInBatches Node:
//    - Process each old job one by one.
// 4. S3 Node (Delete):
//    - Configure with your S3 credentials.
//    - Operation: Delete
//    - Bucket Name: your-omics-data-bucket
//    - Key: {{$json.s3_output_path}}
// 5. Postgres Node (Delete Record):
//    - Query: DELETE FROM jobs WHERE id = {{$json.id}};`
      },
    ],
    checklist: [
      { text: 'Create a new workflow named "Daily Cleanup".' },
      { text: 'Add a Cron node and set it to run daily.' },
      { text: 'Add a Postgres node to find old jobs belonging to free users.' },
      { text: 'Add an S3 node to delete the associated result files.' },
      { text: 'Add a final Postgres node to delete the job record from the database.' },
    ],
  },
  {
    id: 9,
    title: 'Launch & Export Summary',
    description: 'Final checks and exporting your complete project plan.',
    longDescription: 'Congratulations! You have designed and planned a fully automated, n8n-orchestrated SaaS platform. This final step is about running through a pre-launch checklist and celebrating your work. You can also export your progress from this builder as a JSON file to document your entire plan and all the steps you\'ve completed.',
    examples: [
      {
        type: 'text',
        title: 'Final Pre-Launch Checklist',
        content: '- [ ] Have you tested the entire user flow, from upload to email notification, in production?\n- [ ] Is your Stripe webhook configured with the production URL from your live n8n instance?\n- [ ] Have you set up basic logging and monitoring for your server and n8n?\n- [ ] Have you backed up your n8n workflows and credentials?',
      }
    ],
    checklist: [
      { text: 'Complete the pre-launch checklist.' },
      { text: 'Prepare your launch announcement and marketing materials.' },
      { text: 'Monitor n8n execution logs for any errors after going live.' },
      { text: 'Export your project summary from this builder.' },
      { text: 'Celebrate building a robust, automated platform!' },
    ],
  },
];
