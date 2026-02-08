# Resume Analyzer Feature

## Overview
Real ATS-style resume analysis with PDF processing, deterministic scoring, and AI-powered recommendations.

## Architecture
- **Backend**: NestJS with SOLID principles
- **Frontend**: Next.js overlay component
- **PDF Processing**: pdftotext + pdf-parse fallback
- **Scoring**: Deterministic ATS algorithm (0-100)
- **AI Integration**: Structured JSON responses

## API Endpoint

### POST /resume-analyzer/analyze
**Request**: FormData with PDF file
- File must be PDF format
- Max size: 5MB

**Response**:
```json
{
  "success": true,
  "data": {
    "atsScore": 85,
    "summary": "Your resume demonstrates strong ATS compatibility...",
    "scoreBreakdown": {
      "formatting": 90,
      "keywords": 80,
      "structure": 85,
      "readability": 85
    },
    "strengths": ["Clear contact information", "Strong keyword optimization"],
    "improvements": {
      "structure": ["Add professional summary"],
      "content": ["Use more action verbs"],
      "keywords": ["Consider adding relevant keywords"]
    }
  }
}
```

## Scoring Algorithm

### Formatting (0-100)
- Deduct 10 points per issue:
  - Contains tabs
  - Too many consecutive empty lines
  - Table formatting detected

### Keywords (0-100)
- Matches 40+ technical keywords
- Score = (matched / total) * 200 (capped at 100)

### Structure (0-100)
- Required sections: Contact, Summary, Experience, Education, Skills
- Score = (present sections / total sections) * 100
- 20% deduction if missing contact info

### Readability (0-100)
- Word count: min(300 words / actual words * 100)
- Action verbs: min(10 verbs / actual verbs * 100)
- Final score = average of both

## Frontend Integration

### Usage
1. Click "Analyze My Resume" button
2. Upload PDF (drag & drop supported)
3. See real-time progress: Uploading → Analyzing
4. View comprehensive results with recommendations

### States
- **Upload State**: File selection and validation
- **Progress State**: "Uploading resume..." → "Analyzing your resume..."
- **Results State**: ATS score, breakdown, strengths, improvements

## Dependencies

### Backend
```bash
npm install pdf-parse multer @nestjs/platform-express @nestjs/config
```

### Optional
```bash
npm install poppler-utils  # For better PDF processing
```

### Frontend
No additional dependencies needed (uses existing UI components)

## File Structure
```
src/resume-analyzer/
├── dto/
│   └── analyze-resume.dto.ts
├── services/
│   ├── pdf-extractor.service.ts
│   ├── ats-scorer.service.ts
│   └── ai-analysis.service.ts
├── resume-analyzer.controller.ts
├── resume-analyzer.service.ts
└── resume-analyzer.module.ts
```

## AI Integration

The system is designed to easily swap AI providers. Currently uses deterministic analysis, but can be extended:

```typescript
// In ai-analysis.service.ts
async generateAnalysis(atsResult: AtsAnalysisResult): Promise<AiAnalysisResponse> {
  const prompt = this.buildPrompt(atsResult);
  
  // Replace with your AI provider
  // const response = await openai.chat.completions.create({...});
  
  return this.parseAIResponse(response);
}
```

## Features

### ✅ Real PDF Processing
- pdftotext for reliable extraction
- pdf-parse fallback
- PDF validation

### ✅ ATS-Style Analysis
- Single column formatting check
- Keyword relevance scoring
- Section structure validation
- Action verb analysis

### ✅ Deterministic Scoring
- No random or mock scores
- Transparent scoring algorithm
- Consistent results

### ✅ Modern UI
- Glassmorphic design
- Real-time progress states
- Responsive layout
- Detailed breakdown display

### ✅ SOLID Architecture
- Single Responsibility: Each service has one purpose
- Open/Closed: Easy to extend AI providers
- Liskov: Services can be swapped
- Interface Segregation: Focused interfaces
- Dependency Inversion: Depends on abstractions

## Testing

Start both servers:
```bash
# Backend (port 3001)
cd jobportal-api
npm run start:dev

# Frontend (port 3000)
cd next-jobportal
npm run dev
```

Test with a PDF resume to see full ATS analysis!
