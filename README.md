# AI-Powered Website Generator

A production-ready SaaS application that generates complete, responsive websites from natural language prompts using Puter.js AI, React, FastAPI, and MongoDB.

![License](https://img.shields.io/badge/license-MIT-blue.svg)
![Python](https://img.shields.io/badge/python-3.9+-green.svg)
![Node](https://img.shields.io/badge/node-18+-green.svg)
![Puter.js](https://img.shields.io/badge/AI-Puter.js-blueviolet.svg)

## ✨ Features

| Feature | Description |
|---------|-------------|
| **Natural Language Input** | Describe your website in plain English with validation and feedback |
| **AI-Powered Generation** | Puter.js with gpt-5.1-codex-max generates semantic HTML5, modern CSS, and ES6 JavaScript |
| **Live Preview** | Instantly preview generated websites in a secure sandboxed iframe |
| **Responsive Preview Modes** | Toggle between desktop, tablet, and mobile views |
| **Export to ZIP** | Download complete website package (index.html, styles.css, script.js) |
| **Project History** | All generated websites are persisted in MongoDB for later access |
| **Free & Keyless** | No API keys required - uses Puter.js free AI infrastructure |

---

## 🏗 Architecture

```
┌─────────────────────────────────────────────────────────────────────────────┐
│                              USER BROWSER                                    │
│  ┌─────────────────────────────────────────────────────────────────────────┐│
│  │                         React Frontend (Vite)                           ││
│  │  ┌──────────────┐  ┌────────────────┐  ┌─────────────────────────────┐ ││
│  │  │  InputForm   │  │  PreviewFrame  │  │       ProjectHistory        │ ││
│  │  │  (Prompt)    │  │  (iframe)      │  │       (List View)           │ ││
│  │  └──────┬───────┘  └───────▲────────┘  └─────────────▲───────────────┘ ││
│  │         │                  │                         │                  ││
│  │         ▼                  │                         │                  ││
│  │  ┌──────────────────────────────────────────────────────────────────┐  ││
│  │  │              Puter.js AI Service (Client-Side)                   │  ││
│  │  │    puter.ai.chat() → gpt-5.1-codex-max → JSON {html,css,js}      │  ││
│  │  └──────────────────────────────┬───────────────────────────────────┘  ││
│  │                                 │                                       ││
│  │  ┌──────────────────────────────▼───────────────────────────────────┐  ││
│  │  │                     Axios API Service                            │  ││
│  │  │            POST /api/projects (save generated code)              │  ││
│  │  └──────────────────────────────┬───────────────────────────────────┘  ││
│  └─────────────────────────────────┼───────────────────────────────────────┘│
└────────────────────────────────────┼────────────────────────────────────────┘
                                     │ HTTP/REST
                                     ▼
┌─────────────────────────────────────────────────────────────────────────────┐
│                          FastAPI Backend                                     │
│  ┌─────────────────────────────────────────────────────────────────────────┐│
│  │                         API Endpoints                                    ││
│  │  POST /api/projects (save)  │  GET /api/projects  │  DELETE /api/...    ││
│  └──────────────────────────────┬──────────────────────────────────────────┘│
│                                 │                                            │
│  ┌──────────────────────────────▼──────────────────────────────────────────┐│
│  │                       Database Service                                   ││
│  │                         MongoDB                                          ││
│  └──────────────────────────────────────────────────────────────────────────┘│
└─────────────────────────────────────────────────────────────────────────────┘
```

### Data Flow

1. **User Input**: User describes desired website in natural language
2. **Validation**: Frontend validates input (10-2000 characters)
3. **AI Generation**: Frontend calls Puter.js AI with gpt-5.1-codex-max model
4. **Response Parsing**: Frontend validates JSON response structure
5. **Persistence**: Generated code is saved to MongoDB via backend API
6. **Preview**: Frontend renders code in sandboxed iframe
7. **Export**: User can download as ZIP file

---

## 🛠 Tech Stack

### Frontend
| Technology | Purpose |
|------------|---------|
| React 18 | UI framework with hooks |
| Vite | Build tool and dev server |
| Puter.js | Free AI integration (gpt-5.1-codex-max) |
| Axios | HTTP client |
| JSZip | Client-side ZIP generation |

### Backend
| Technology | Purpose |
|------------|---------|
| FastAPI | Async Python web framework |
| Motor | Async MongoDB driver |
| Pydantic | Request/response validation |
| Uvicorn | ASGI server |

### Database
| Technology | Purpose |
|------------|---------|
| MongoDB | Document storage for projects |

---

## 🧠 AI Model & Prompt Strategy

### Model Selection: gpt-5.1-codex-max

We chose **gpt-5.1-codex-max** via Puter.js for the following reasons:

1. **Code Optimization**: Codex models are specifically trained for code generation, producing higher quality HTML/CSS/JS
2. **Free & Keyless**: No API keys, billing, or quotas required
3. **Browser-Native**: Runs entirely in the browser via Puter.js SDK
4. **JSON Support**: Reliable structured output for our {html, css, js} format
5. **Context Window**: Handles complex website requirements with detailed prompts

### Why Puter.js?

- **Zero Cost**: Free access to premium AI models without any API keys
- **No Backend Dependencies**: AI runs client-side, reducing server complexity
- **Simple Integration**: Single script tag, no npm packages required
- **Reliable Infrastructure**: Managed by Puter with automatic scaling

**Reference**: [Puter.js Free OpenAI API Tutorial](https://developer.puter.com/tutorials/free-unlimited-openai-api/)

### Prompt Engineering Strategy

The system prompt is designed with these principles:

```
┌─────────────────────────────────────────────────────────────┐
│                    SYSTEM PROMPT DESIGN                      │
├─────────────────────────────────────────────────────────────┤
│ 1. ROLE DEFINITION                                          │
│    "You are a senior full-stack web developer..."           │
│    → Establishes expertise context                          │
├─────────────────────────────────────────────────────────────┤
│ 2. STRICT OUTPUT FORMAT                                     │
│    "Return ONLY a raw JSON object with keys: html, css, js" │
│    → Eliminates markdown wrappers and explanations          │
├─────────────────────────────────────────────────────────────┤
│ 3. TECHNOLOGY CONSTRAINTS                                   │
│    "Do NOT use external CSS frameworks..."                  │
│    → Ensures self-contained, portable code                  │
├─────────────────────────────────────────────────────────────┤
│ 4. QUALITY REQUIREMENTS                                     │
│    "Use semantic HTML5, mobile-first CSS, ES6+ JS"          │
│    → Enforces modern best practices                         │
└─────────────────────────────────────────────────────────────┘
```

### Fallback Handling

If the AI response is malformed or missing required keys, the system:
1. Logs the error for debugging
2. Returns a pre-built fallback website template
3. User sees a functional (generic) website rather than an error

### Limitations

- **Browser Required**: AI generation requires a browser environment (Puter.js is client-side)
- **Rate Limits**: While free, Puter.js may have fair-use rate limits during high traffic
- **No Offline Mode**: Requires internet connection for AI generation

---

## 📡 API Documentation

### Base URL
```
http://localhost:8000
```

### Endpoints

#### Health Check
```http
GET /health
```
**Response:**
```json
{
  "status": "ok",
  "service": "ai-website-generator"
}
```

---

#### Save Project
```http
POST /api/projects
Content-Type: application/json

{
  "prompt": "A modern portfolio website for a photographer with dark theme",
  "code": {
    "html": "<header>...</header>",
    "css": "body { ... }",
    "js": "document.addEventListener..."
  }
}
```

**Response (201):**
```json
{
  "id": "65f123abc456def789012345",
  "prompt": "A modern portfolio...",
  "code": {
    "html": "<header>...</header>",
    "css": "body { ... }",
    "js": "document.addEventListener..."
  },
  "created_at": "2024-01-15T10:30:00.000Z"
}
```

---

#### List Projects
```http
GET /api/projects?limit=10
```

**Query Parameters:**
- `limit`: Optional, 1-50, default 10

**Response:**
```json
[
  {
    "id": "65f123abc...",
    "prompt": "...",
    "code": { "html": "...", "css": "...", "js": "..." },
    "created_at": "2024-01-15T10:30:00.000Z"
  }
]
```

---

#### Get Single Project
```http
GET /api/projects/{project_id}
```

**Response:** Same as single project object

---

#### Delete Project
```http
DELETE /api/projects/{project_id}
```

**Response:**
```json
{
  "message": "Project deleted successfully",
  "id": "65f123abc..."
}
```

---

## ⚙️ Environment Setup

### Prerequisites

- **Node.js**: v18.0.0 or higher
- **Python**: v3.9 or higher
- **MongoDB**: v6.0 or higher (local or Atlas)

> **Note**: No API keys required! AI generation is handled by Puter.js (free).

### Environment Variables

#### Backend (`backend/.env`)
```env
# MongoDB Configuration
MONGODB_URL=mongodb://localhost:27017
DATABASE_NAME=ai_website_generator
PORT=8000

# Note: No API keys required - AI uses Puter.js (free, keyless)
```

---

## 🚀 Running Locally

### 1. Clone the Repository
```bash
git clone https://github.com/your-username/ai-website-generator.git
cd ai-website-generator
```

### 2. Backend Setup
```bash
cd backend

# Create virtual environment
python -m venv venv

# Activate (Windows)
venv\Scripts\activate

# Activate (macOS/Linux)
source venv/bin/activate

# Install dependencies
pip install -r requirements.txt

# Configure environment
cp .env.example .env
# Edit .env with your MongoDB URL if needed

# Start server
uvicorn app.main:app --reload --port 8000
```

### 3. Frontend Setup
```bash
cd frontend

# Install dependencies
 

# Start dev server
 
```

### 4. Access the Application
- **Frontend**: http://localhost:5173
- **Backend API**: http://localhost:8000
- **API Docs**: http://localhost:8000/docs

---

## 🌐 Deployment

### Frontend → Vercel

1. Connect your GitHub repository to Vercel
2. Set build command: `npm run build`
3. Set output directory: `dist`
4. Add environment variable (if needed):
   ```
   VITE_API_URL=https://your-backend.onrender.com/api
   ```

### Backend → Render

1. Connect your GitHub repository to Render
2. Select "Web Service"
3. Set build command: `pip install -r requirements.txt`
4. Set start command: `uvicorn app.main:app --host 0.0.0.0 --port $PORT`
5. Add environment variables:
   ```
   MONGODB_URL=mongodb+srv://...
   DATABASE_NAME=ai_website_generator
   ```

### MongoDB Atlas (Production Database)

1. Create a free cluster at https://cloud.mongodb.com
2. Create database user with read/write permissions
3. Whitelist Render IP addresses (or use 0.0.0.0/0 for testing)
4. Copy connection string to `MONGODB_URL`

---

## 📁 Project Structure

```
ai-website-generator/
├── backend/
│   ├── app/
│   │   ├── __init__.py
│   │   ├── main.py              # FastAPI app, CORS, exception handlers
│   │   ├── api/
│   │   │   ├── __init__.py
│   │   │   └── endpoints.py     # REST API routes (save, list, get, delete)
│   │   ├── models/
│   │   │   ├── __init__.py
│   │   │   └── project.py       # MongoDB document model
│   │   ├── schemas/
│   │   │   ├── __init__.py
│   │   │   └── generation.py    # Pydantic request/response schemas
│   │   ├── services/
│   │   │   ├── __init__.py
│   │   │   └── db_service.py    # MongoDB connection
│   │   └── utils/
│   │       └── __init__.py
│   ├── requirements.txt
│   ├── Dockerfile
│   ├── .env.example
│   └── .gitignore
│
├── frontend/
│   ├── public/
│   ├── src/
│   │   ├── components/
│   │   │   ├── InputForm.jsx    # Prompt input with validation
│   │   │   └── PreviewFrame.jsx # Iframe preview with responsive modes
│   │   ├── pages/
│   │   │   └── Home.jsx         # Main application view
│   │   ├── services/
│   │   │   ├── aiService.js     # Puter.js AI integration
│   │   │   └── api.js           # Axios API client
│   │   ├── utils/
│   │   │   └── zipper.js        # ZIP export functionality
│   │   ├── App.jsx
│   │   ├── main.jsx
│   │   └── index.css
│   ├── index.html               # Includes Puter.js script
│   ├── package.json
│   └── vite.config.js
│
└── README.md
```

---

## 🔮 Future Improvements

- [ ] **User Authentication**: Auth0/Firebase integration
- [ ] **Multi-page Websites**: Generate complete multi-page sites
- [ ] **Template Library**: Pre-built templates as starting points
- [ ] **Code Editor**: In-browser editing of generated code
- [ ] **Version History**: Compare and restore previous versions
- [ ] **Custom Domains**: Deploy generated sites to subdomains
- [ ] **Component Library**: Reusable UI components
- [ ] **Collaboration**: Share and edit projects with team members

---

## 📄 License

MIT License - see [LICENSE](LICENSE) for details.

---

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request
