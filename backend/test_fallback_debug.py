"""Test what the fallback produces with the user's actual form data."""
import os, sys, re
sys.path.insert(0, os.path.dirname(__file__))
os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'resumely.settings')
import django
django.setup()

from api.services.nvidia_service import nvidia_ai

# Reconstruct the exact prompt the frontend would build (professional template)
prompt = """
You are an expert ATS (Applicant Tracking System) optimized resume creator.
Create a professional resume that scores at least 80% on ATS systems using the Professional format.

Job Title: Senior Full-Stack Software Engineer
Job Description: About the Role:
We are looking for a Senior Full-Stack Engineer to scale our core web platforms and build automated internal tooling. You will own features end-to-end, optimize data pipelines, and design responsive user interfaces.

Requirements:

4+ years of professional experience building web applications using Python (Django/FastAPI) and modern JavaScript frameworks (React, TypeScript).

Strong experience with relational databases (PostgreSQL) and caching layers (Redis).

Hands-on experience building or consuming real-time communication tools (WebSockets, WebRTC) is a major plus.

Experience implementing automated background workflows and working with third-party API integrations.

Solid understanding of cloud deployments (Docker, AWS) and CI/CD pipelines.

Candidate Information:
Experience: Software Engineer | NexaTech Solutions (Jan 2024 — Present)

Architected and deployed a real-time collaborative dashboard using React, TypeScript, and WebSockets, reducing application latency by 35%.

Developed robust backend REST APIs and asynchronous task processing pipelines using Django, Celery, and PostgreSQL.

Designed and automated internal B2B data workflows and lead qualification pipelines, cutting manual execution time by 60 hours per month.

Containerized microservices using Docker and managed automated deployments via GitHub Actions.

Junior Full-Stack Developer | CloudWeave Apps (Mar 2022 — Dec 2023)

Built and maintained responsive user interfaces using React and Material UI, improving mobile user retention by 20%.

Integrated third-party payment gateways (Stripe) and authentication logic across multiple client applications.

Optimized slow-running SQL queries in PostgreSQL databases, leading to a 15% speedup in server response times.

Skills: Languages: Python, JavaScript, TypeScript, SQL, HTML5, CSS3
Frameworks & Libraries: React.js, Django, Node.js, Next.js, Material UI, Chakra UI
Databases & Tools: PostgreSQL, Redis, Docker, Git, GitHub Actions, WebSockets, WebRTC
Methodologies: Agile/Scrum, CI/CD, Test-Driven Development (TDD)

Education: Bachelor of Science in Computer Science
University of Yaound\u00e9 I (2018 \u2014 2021)

Key Coursework: Data Structures & Algorithms, Database Management Systems, Software Engineering Principles, Distributed Systems.



Please create a resume with this structure:
1. CONTACT INFORMATION
2. PROFESSIONAL SUMMARY
3. WORK EXPERIENCE
4. SKILLS
5. EDUCATION

Guidelines:
- Use clear section headings in uppercase
- No columns, tables, or complex formatting
- Include relevant keywords from the job description
- Highlight achievements with metrics when possible
- Use reverse chronological order for work experience
- Keep formatting simple and ATS-friendly

Return ONLY the resume content without any additional explanations.

CRITICAL: You MUST use the following EXACT candidate information for the Contact Information section. Do not use placeholders like John Doe:
Name: Alex Vance
Email: alex.vance.dev@email.com
Phone: +237 677 889 900
LinkedIn: https://linkedin.com/in/alexvancedev
GitHub: https://github.com/alexvancedev
Citizenship: Cameroonian"""

result = nvidia_ai._generate_fallback_resume(prompt)

print("=" * 80)
print("FALLBACK OUTPUT:")
print("=" * 80)
print(result)
print("=" * 80)

# Debug regex matches
print("\n\n=== REGEX DEBUGGING ===")

m = re.search(r"Name:\s*(.+)", prompt, re.IGNORECASE)
print(f"Name match: '{m.group(1).strip() if m else 'NONE'}'")

m = re.search(r"Email:\s*(.+)", prompt, re.IGNORECASE)
print(f"Email match: '{m.group(1).strip() if m else 'NONE'}'")

m = re.search(r"Experience[:\n]+([\s\S]*?)(?=\n\s*(?:Skills|Education|Template|CRITICAL)|$)", prompt, re.IGNORECASE)
if m:
    print(f"Experience match length: {len(m.group(1).strip())} chars")
    print(f"Experience FIRST 300 chars:\n{m.group(1).strip()[:300]}")
    print(f"Experience LAST 200 chars:\n{m.group(1).strip()[-200:]}")
else:
    print("Experience match: NONE")

m = re.search(r"Skills[:\n]+([\s\S]*?)(?=\n\s*(?:Education|Template|CRITICAL)|$)", prompt, re.IGNORECASE)
if m:
    print(f"\nSkills match: '{m.group(1).strip()[:300]}'")
else:
    print("Skills match: NONE")

m = re.search(r"Education[:\n]+([\s\S]*?)(?=\n\s*(?:Template|CRITICAL)|$)", prompt, re.IGNORECASE)
if m:
    print(f"\nEducation match: '{m.group(1).strip()[:300]}'")
else:
    print("Education match: NONE")
