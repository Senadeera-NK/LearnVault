# LearnVault | Agentic Multi-Agent Q&A System

**LearnVault** is an AI-augmented educational platform that transforms static PDF documents into interactive, validated learning assessments. Unlike standard RAG applications, LearnVault utilizes a **Multi-Agent Orchestration** loop to ensure high-fidelity question generation and automated self-correction.

---

## 🏗 System Architecture
The system follows a **Planner-Reviewer pattern** to minimize LLM hallucinations and ensure pedagogical accuracy.

* **Planner Agent:** Parses PDF structure and determines the optimal extraction strategy.
* **Generator Agent:** Executes the content extraction and formats structured Q&A pairs.
* **Reviewer Agent:** Cross-references generated questions against the source text to validate factual accuracy and difficulty levels.
```
graph TD
    %% User Interaction
    User((User)) -->|Uploads PDF/Text| FastAPI[FastAPI Server]
    
    subgraph "Service: Ingestion"
        FastAPI -->|Check Duplicates| SupabaseDB[(Supabase PostgreSQL)]
        FastAPI -->|Temp Storage| SupabaseStorage[[Supabase Storage]]
        FastAPI -->|Trigger| Threading[threading.Thread]
    end

    subgraph "Service: Background Worker"
        Threading -->|download_file_from_url| OCR[OCR / pdfplumber]
        OCR -->|extract_text| Classifier[rule_based_check / classify_document]
        Classifier -->|Update status + category| SupabaseDB
    end

    %% User selection process
    User -->|Selects Doc + Category| FastAPI
    
    subgraph "Service: QA Generation"
        FastAPI -->|qa_selection| QAParser[QA Parser Service]
        QAParser -->|Prompt + Context| Gemini[Gemini 2.5 Flash API]
        Gemini -->|parse_qa_to_json| FinalQA[QA Validation Stage]
    end

    %% Agentic Refinement Loop
    subgraph "Agentic Flow (Self-Correction)"
        FinalQA -.->|Evaluation| Reviewer{Reviewer Agent}
        Reviewer -- "Fail (Provide Critique)" --> QAParser
        Reviewer -- "Pass" --> Store[save_qa_incremental]
    end

    Store --> SupabaseDB
    Store --> Frontend[Display Files/QA]
    Frontend --> User
    ```
## 🛠 Tech Stack
* **Frontend:** Next.js 15, Tailwind CSS, TypeScript.
* **Backend:** FastAPI (Python), Google Gemini 3 (Flash & Pro).
* **Database:** PostgreSQL (Supabase) for session state and document metadata.
* **Infrastructure:** Distributed API Key management for rate-limit resilience.

## 🚀 Key Engineering Features
* **Agentic Orchestration:** Implemented a multi-stage reasoning loop to handle complex technical documents.
* **State Management:** Real-time sync between the FastAPI backend and Next.js frontend for document processing status.
* **Scale-Ready Backend:** Designed to handle concurrent PDF processing requests using asynchronous Python workers.
* **Validation Logic:** Automated grading system that parses user responses against AI-generated ground truths.

---

## ⚙️ Local Development

### Backend Setup
1. Clone the repository and navigate to `/backend`.
2. Create a `.env` file with your `GEMINI_API_KEY` and Supabase credentials.
3. Install dependencies:
```bash
pip install -r requirements.txt
```
### Start the Uvicorn server:
```
Bash

python main.py
```
###Frontend Setup
Navigate to /frontend.

Install packages:
```
Bash

npm install
Run the development server:
```
```
Bash

npm run dev
```
### 📈 Future Roadmap
***Asynchronous Processing:*** Migrating long-running PDF tasks to Celery/Redis workers.

***Vector Embeddings:*** Implementing specialized vector search for larger textbook-scale documents.

***Advanced Analytics:*** Developing a dashboard for tracking learning progress over time.
