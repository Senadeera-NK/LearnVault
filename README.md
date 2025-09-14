# LearnVault

Web application for intelligent textbook storage, paragraph-based Q&amp;A generation, and interactive learning dashboards using AI/ML.


1.Requirement Analysis

🔹 1. Frontend
Goal: Clean UI without manually writing CSS, responsive layout, charts for analytics.

UI Components & Layout==> Chakra UI or Material-UI (MUI) ==> Prebuilt components, responsive, easy theming, modern look
Charts & Analytics ==> Recharts or Chart.js (via react-chartjs-2) ==> Easily integrates into React, supports bar, line, pie, and custom charts
React Framework ==> Next.js ==> SEO-friendly, easy routing, server-side rendering if needed, supports API rout

🔹 2. Backend
Goal: Handle AI/ML inference, file storage, user data, and dashboard analytics.

Web Framework ==> FastAPI ==> Lightweight, async support, easy to connect to ML models, automatic docs
Database ==> Supabase (Free Tier) or SQLite ==> User auth + structured data (usage stats, storage metadata). Supabase free tier includes auth + database
File Storage ==> Supabase Storage / Local storage for MVP ==> Store PDFs and generated Q&A content
AI/ML Models ==> Hugging Face Transformers (T5, BERT, GPT-Neo) ==> Open-source models for Q&A generation
OCR (optional for scanned books) ==> Tesseract OCR ==> Free, works with PDFs/images

🔹 3. AI/ML Integration

QA Generation: Hugging Face T5 or GPT-Neo for paragraph-based Q&A.

Text Embeddings (optional): SentenceTransformers for semantic search or matching questions.

OCR for PDFs: Tesseract → convert scanned PDFs into text for AI processing.


🔹 4. Hosting / Deployment (Free Options)

Frontend + Backend = Vercel (Next.js frontend, optional backend API routes)
Python Backend API = Render Free Tier or Railway Free Tier
Database + Storage = Supabase Free Tier
AI/ML Models = Run locally or use Hugging Face free inference API
Optional Rapid MVP	Streamlit Cloud (no backend setup required)


2.System Design

3.Implementation

4.Testing

5.Deployment

6.Maintenance

