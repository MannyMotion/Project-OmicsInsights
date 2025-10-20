import type { Step } from '../types';

export const steps: Step[] = [
  {
    id: 0,
    title: 'Intro & Idea Validation',
    description: 'Validating the core problem and solution for OmicsInsight.',
    longDescription: 'Before writing a single line of code, it\'s crucial to validate that the problem you\'re solving is real and that your proposed solution is something users actually want. For OmicsInsight, this means confirming that biologists and researchers struggle with existing transcriptomic data analysis tools and would be willing to pay for a better alternative.',
    examples: [
      {
        type: 'text',
        title: 'User Persona: Dr. Anya Sharma',
        content: 'Role: Postdoctoral Researcher in a molecular biology lab.\nPain Points: "Current tools are command-line based, require bioinformatics expertise, are poorly documented, and make collaboration difficult. I spend more time debugging scripts than analyzing results."',
      },
      {
        type: 'text',
        title: 'Value Proposition',
        content: 'OmicsInsight is a cloud-based platform that empowers biologists to analyze, visualize, and collaborate on transcriptomic data through an intuitive, no-code interface, accelerating research from months to days.',
      },
    ],
    checklist: [
      { text: 'Define the core problem your SaaS solves.' },
      { text: 'Identify your target user persona(s).' },
      { text: 'Conduct at least 5 interviews with potential users.' },
      { text: 'Create a simple landing page to gauge interest.' },
      { text: 'Formulate a clear, one-sentence value proposition.' },
    ],
  },
  {
    id: 1,
    title: 'Research & Planning',
    description: 'Analyzing competitors and defining the core feature set.',
    longDescription: 'With a validated idea, the next step is to understand the market landscape. Analyze competitors to identify their strengths, weaknesses, and pricing. This will help you define a Minimum Viable Product (MVP) feature set that provides unique value and decide on a sustainable pricing strategy.',
    examples: [
      {
        type: 'text',
        title: 'Competitive Analysis (Simplified)',
        content: '- Galaxy: Open-source, powerful, but steep learning curve.\n- Basepair: Commercial, user-friendly, but expensive.\n- In-house Scripts: Highly customizable but not scalable or easily shareable.',
      },
      {
        // FIX: Changed type from 'json' to 'code' to align with the `Example` type definition. JSON is a type of code.
        type: 'code',
        title: 'MVP Feature Map',
        language: 'json',
        content: `
{
  "must_have": [
    "Secure user authentication",
    "Raw data upload (FASTQ files)",
    "Run DESeq2 analysis pipeline",
    "Generate volcano plot & heatmap",
    "Export results as CSV"
  ],
  "should_have": [
    "Project-based data organization",
    "Share projects with collaborators",
    "Interactive plots"
  ],
  "wont_have": [
    "Multi-omics integration",
    "Custom pipeline builder",
    "On-premise deployment"
  ]
}`
      },
    ],
    checklist: [
      { text: 'List 3-5 direct and indirect competitors.' },
      { text: 'Create a feature comparison matrix.' },
      { text: 'Define your MVP feature set using MoSCoW method.' },
      { text: 'Outline a tiered pricing model (e.g., Free, Pro, Enterprise).' },
      { text: 'Draft a high-level project roadmap for the next 6 months.' },
    ],
  },
  {
    id: 2,
    title: 'Technical Architecture',
    description: 'Designing the blueprint of your application.',
    longDescription: 'This is where you decide on the technologies and patterns that will form the foundation of OmicsInsight. A well-designed architecture ensures your application is scalable, maintainable, and secure. We will choose a modern tech stack that balances development speed with performance.',
    examples: [
        {
            type: 'image',
            title: 'High-Level Architecture Diagram',
            content: 'https://picsum.photos/seed/tech/600/350'
        },
        {
            type: 'text',
            title: 'Tech Stack Choices',
            content: '- Frontend: React (Next.js) for a fast, modern UI with server-side rendering.\n- Backend: FastAPI (Python) for its performance and because most bioinformatics tools are Python-based.\n- Database: PostgreSQL for reliable, structured data (users, projects, metadata).\n- Storage: AWS S3 for scalable storage of large omics data files.\n- Authentication: NextAuth.js for easy integration of social and credential-based logins.'
        },
    ],
    checklist: [
        { text: 'Choose and document your frontend framework.' },
        { text: 'Select a backend language and framework.' },
        { text: 'Decide on a primary database and a file storage solution.' },
        { text: 'Design the basic API endpoints (e.g., /users, /projects, /upload).' },
        { text: 'Plan your authentication and authorization strategy.' }
    ]
  },
   {
    id: 3,
    title: 'Development Environment Setup',
    description: 'Preparing your local machine for coding.',
    longDescription: 'Consistency is key. Setting up a standardized development environment for yourself and your future team ensures that code works reliably everywhere. This involves installing necessary tools, setting up version control, and creating the initial project structures.',
    examples: [
      {
        type: 'code',
        title: 'Frontend Setup (Next.js)',
        language: 'bash',
        content: `
# Install Next.js with TypeScript and Tailwind CSS
npx create-next-app@latest omics-insight-ui --ts --tailwind --eslint

# Navigate into the project directory
cd omics-insight-ui

# Run the development server
npm run dev`
      },
      {
        type: 'code',
        title: 'Backend Setup (FastAPI)',
        language: 'bash',
        content: `
# Create a project directory and a virtual environment
mkdir omics-insight-api && cd omics-insight-api
python -m venv venv
source venv/bin/activate

# Install FastAPI and an ASGI server
pip install fastapi "uvicorn[standard]"`
      },
    ],
    checklist: [
      { text: 'Install Node.js and a package manager (npm/yarn).' },
      { text: 'Install Python and a virtual environment tool.' },
      { text: 'Set up a Git repository on GitHub/GitLab.' },
      { text: 'Initialize the frontend and backend projects.' },
      { text: 'Install a code editor like VS Code with recommended extensions.' },
    ],
  },
  {
    id: 4,
    title: 'Core Feature Implementation',
    description: 'Building the foundational features of the MVP.',
    longDescription: 'Now it\'s time to bring the MVP to life. Focus on the "must-have" features identified in the planning stage. We will start with user authentication, data upload, and the primary analysis pipeline. This is the heart of the application.',
    examples: [
      {
        type: 'code',
        title: 'React Upload Component (Simplified)',
        language: 'javascript',
        content: `
import { useState } from 'react';

function DataUploader() {
  const [file, setFile] = useState(null);

  const handleFileChange = (e) => {
    setFile(e.target.files[0]);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const formData = new FormData();
    formData.append('file', file);
    // POST to your backend API endpoint
    await fetch('/api/upload', {
      method: 'POST',
      body: formData,
    });
  };

  return (
    <form onSubmit={handleSubmit}>
      <input type="file" onChange={handleFileChange} />
      <button type="submit">Upload</button>
    </form>
  );
}`
      },
       {
        type: 'code',
        title: 'FastAPI Upload Endpoint',
        language: 'python',
        content: `
from fastapi import FastAPI, File, UploadFile
import shutil

app = FastAPI()

@app.post("/uploadfile/")
async def create_upload_file(file: UploadFile = File(...)):
    # In a real app, you'd upload this to S3
    with open(f"temp_{file.filename}", "wb") as buffer:
        shutil.copyfileobj(file.file, buffer)
    
    # Trigger analysis pipeline here
    
    return {"filename": file.filename, "status": "upload successful"}`
      },
    ],
    checklist: [
      { text: 'Implement user registration and login.' },
      { text: 'Create a secure file upload endpoint.' },
      { text: 'Build the UI for creating projects and uploading data.' },
      { text: 'Integrate the core analysis script (e.g., a DESeq2 wrapper).' },
      { text: 'Store analysis results in the database.' },
    ],
  },
  {
    id: 5,
    title: 'Visualization & Collaboration',
    description: 'Making data understandable and shareable.',
    longDescription: 'Raw data is not useful. The real value of OmicsInsight comes from its ability to present complex results in an intuitive, interactive format. This step focuses on building dashboards with plots and tables, and adding features for collaboration.',
    examples: [
      {
        type: 'image',
        title: 'Mockup of an Interactive Dashboard',
        content: 'https://picsum.photos/seed/dash/600/350'
      },
      {
        type: 'code',
        title: 'React Chart Component (using Recharts)',
        language: 'javascript',
        content: `
import { ScatterChart, Scatter, XAxis, YAxis, CartesianGrid, Tooltip } from 'recharts';

const VolcanoPlot = ({ data }) => (
  <ScatterChart width={600} height={400}>
    <CartesianGrid />
    <XAxis type="number" dataKey="log2FoldChange" name="log2 Fold Change" />
    <YAxis type="number" dataKey="pvalue" name="p-value" />
    <Tooltip cursor={{ strokeDasharray: '3 3' }} />
    <Scatter name="Genes" data={data} fill="#8884d8" />
  </ScatterChart>
);`
      },
    ],
    checklist: [
      { text: 'Implement a results dashboard page.' },
      { text: 'Integrate a charting library (e.g., Recharts, D3).' },
      { text: 'Build interactive volcano plot and heatmap visualizations.' },
      { text: 'Develop a feature to share a project with another user (read-only).' },
      { text: 'Add a commenting system for collaboration on results.' },
    ],
  },
  {
    id: 6,
    title: 'Testing & Optimization',
    description: 'Ensuring the application is reliable and performant.',
    longDescription: 'Before launching, it\'s critical to ensure your application is bug-free, fast, and provides a good user experience. This involves writing automated tests, manually testing user flows, gathering feedback, and optimizing performance.',
    examples: [
      {
        type: 'code',
        title: 'Backend Unit Test (Pytest)',
        language: 'python',
        content: `
from fastapi.testclient import TestClient
from main import app

client = TestClient(app)

def test_read_main():
    response = client.get("/")
    assert response.status_code == 200
    assert response.json() == {"msg": "Hello World"}

def test_unauthorized_upload():
    # This test should fail without an auth token
    with open("testfile.txt", "wb") as f:
        f.write(b"some content")
    with open("testfile.txt", "rb") as f:
        response = client.post("/uploadfile/", files={"file": f})
    assert response.status_code == 401 # Assuming auth is implemented`
      },
    ],
    checklist: [
      { text: 'Write unit tests for critical backend logic.' },
      { text: 'Write integration tests for API endpoints.' },
      { text: 'Perform end-to-end manual testing of all user flows.' },
      { text: 'Gather feedback from a small group of beta testers.' },
      { text: 'Optimize database queries and frontend load times.' },
    ],
  },
  {
    id: 7,
    title: 'Deployment',
    description: 'Making your application live on the internet.',
    longDescription: 'Deployment is the process of taking your code from your local machine and putting it onto a production server. We will use modern cloud platforms that simplify this process with features like continuous integration and continuous deployment (CI/CD).',
    examples: [
      {
        type: 'text',
        title: 'Deployment Strategy',
        content: '- Frontend (Next.js): Deploy to Vercel. Connect your Git repository for automatic deployments on every push to the main branch.\n- Backend (FastAPI): Containerize with Docker and deploy to a service like AWS Elastic Beanstalk or DigitalOcean App Platform.\n- Database: Use a managed database service like Amazon RDS or Supabase Postgres.',
      },
      {
        type: 'code',
        title: 'Simple Dockerfile for FastAPI',
        language: 'bash',
        content: `
FROM python:3.9

WORKDIR /code

COPY ./requirements.txt /code/requirements.txt

RUN pip install --no-cache-dir --upgrade -r /code/requirements.txt

COPY ./app /code/app

CMD ["uvicorn", "app.main:app", "--host", "0.0.0.0", "--port", "80"]`
      },
    ],
    checklist: [
      { text: 'Set up a production database.' },
      { text: 'Containerize your backend application using Docker.' },
      { text: 'Choose a cloud provider (Vercel, AWS, etc.).' },
      { text: 'Configure environment variables for production.' },
      { text: 'Set up a CI/CD pipeline for automatic deployments.' },
    ],
  },
  {
    id: 8,
    title: 'Monetization & Growth',
    description: 'Integrating payments and planning for user acquisition.',
    longDescription: 'A SaaS business needs to make money. This step involves integrating a payment processor like Stripe to handle subscriptions. You also need a plan to attract your first users through marketing and community engagement.',
    examples: [
      {
        type: 'text',
        title: 'Pricing Tiers',
        content: '- Academic (Free): 1 project, 2GB storage, basic analysis.\n- Pro ($49/mo): 10 projects, 50GB storage, advanced visualizations, collaboration.\n- Lab ($199/mo): Unlimited projects, 500GB storage, user management, priority support.',
      },
      {
        type: 'code',
        title: 'Stripe Integration Snippet (Server-side)',
        language: 'python',
        content: `
import stripe

stripe.api_key = 'YOUR_SECRET_KEY'

@app.post('/create-checkout-session')
async def create_checkout_session(price_id: str):
    try:
        checkout_session = stripe.checkout.Session.create(
            line_items=[{'price': price_id, 'quantity': 1}],
            mode='subscription',
            success_url='https://omics.com/success',
            cancel_url='https://omics.com/cancel',
        )
        return {"url": checkout_session.url}
    except Exception as e:
        return {'error': str(e)}`
      },
    ],
    checklist: [
      { text: 'Create a Stripe or Paddle account.' },
      { text: 'Define your subscription plans and prices.' },
      { text: 'Integrate the payment gateway into your app.' },
      { text: 'Create a marketing landing page.' },
      { text: 'Draft an initial user acquisition strategy (e.g., content marketing, academic outreach).' },
    ],
  },
  {
    id: 9,
    title: 'Launch & Export Summary',
    description: 'Final checks and exporting your project plan.',
    longDescription: 'Congratulations! You have planned and built the foundation of your SaaS. This final step is about running through a pre-launch checklist and then celebrating your launch. You can also export all your progress from this builder as a JSON file to serve as a record of your project plan.',
    examples: [
      {
        type: 'text',
        title: 'Pre-Launch Checklist',
        content: '- [ ] Set up analytics (e.g., Google Analytics, Plausible).\n- [ ] Set up error monitoring (e.g., Sentry).\n- [ ] Double-check all production environment variables.\n- [ ] Announce your launch on relevant platforms (e.g., Twitter, LinkedIn, Product Hunt).',
      }
    ],
    checklist: [
      { text: 'Complete the pre-launch checklist.' },
      { text: 'Prepare your launch announcement.' },
      { text: 'Monitor the application for errors and feedback post-launch.' },
      { text: 'Export your project summary from this builder.' },
      { text: 'Celebrate your hard work!' },
    ],
  },
];