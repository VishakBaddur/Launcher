# Startup Genie - AI-Powered Startup Assistant Platform

A comprehensive React TypeScript web application that helps entrepreneurs validate, plan, and pitch their startup ideas using AI-powered tools.

## 🚀 Features

### Core AI Tools
- **AI Idea Validator**: Get instant feedback on startup ideas with feasibility scoring, market analysis, and risk assessment
- **Business Model Generator**: Create comprehensive business model canvases with AI guidance
- **Investor Pitch Creator**: Generate professional 10-slide pitch decks with presenter notes

### Key Features
- **RAG Integration**: Uses Retrieval-Augmented Generation with startup database for realistic insights
- **Authentication System**: Simple email/password login with localStorage
- **Responsive Design**: Mobile-first design with beautiful UI/UX
- **Real-time AI Analysis**: Simulated AI responses with realistic delays
- **Professional UI**: Purple-to-blue gradient theme with modern components

## 🛠️ Tech Stack

- **Frontend**: React 18 + TypeScript + Vite
- **Styling**: Tailwind CSS
- **UI Components**: shadcn/ui + Radix UI
- **Icons**: Lucide React
- **Routing**: React Router DOM
- **State Management**: React Hooks
- **AI Simulation**: Custom RAG service with startup database

## 📦 Installation

1. Clone the repository:
```bash
git clone <repository-url>
cd startup-genie
```

2. Install dependencies:
```bash
npm install
```

3. Start the development server:
```bash
npm run dev
```

4. Open your browser and navigate to `http://localhost:5173`

## 🏗️ Project Structure

```
src/
├── components/
│   ├── layout/
│   │   ├── Navbar.tsx
│   │   └── Sidebar.tsx
│   └── ui/
│       ├── button.tsx
│       ├── card.tsx
│       ├── input.tsx
│       └── textarea.tsx
├── pages/
│   ├── Home.tsx
│   ├── Auth.tsx
│   ├── Dashboard.tsx
│   ├── NotFound.tsx
│   └── dashboard/
│       ├── IdeaValidator.tsx
│       ├── BusinessModel.tsx
│       └── PitchCreator.tsx
├── services/
│   └── ragService.ts
├── types/
│   └── index.ts
├── lib/
│   └── utils.ts
├── App.tsx
└── main.tsx
```

## 🎯 Usage

### 1. Landing Page
- Beautiful hero section with gradient background
- Feature showcase with 3 main AI tools
- Call-to-action buttons for free trial

### 2. Authentication
- Simple email/password registration and login
- Protected routes requiring authentication
- User data stored in localStorage

### 3. Dashboard
- Overview of user activity and statistics
- Quick start cards for each AI tool
- Recent activity and startup tips

### 4. AI Idea Validator
- Large textarea for idea description
- Real-time AI analysis with 2-3 second delay
- Comprehensive results including:
  - Feasibility score (1-10)
  - Key strengths and risks
  - Similar startups
  - Market analysis
  - Recommendations

### 5. Business Model Generator
- Multi-step form (5 steps)
- Dynamic form fields for arrays
- Complete business model canvas generation
- Professional formatting and layout

### 6. Pitch Creator
- Comprehensive form for pitch details
- 10-slide pitch deck generation
- Expandable slide content with presenter notes
- Copy/download functionality

## 🎨 Design System

### Colors
- **Primary Gradient**: Purple (#8B5CF6) to Blue (#3B82F6)
- **Background**: Light gray (#F9FAFB)
- **Cards**: White with subtle shadows
- **Text**: Dark gray hierarchy

### Components
- **Cards**: Borderless with shadow-lg
- **Buttons**: Gradient backgrounds with hover effects
- **Icons**: Lucide React with consistent sizing
- **Typography**: Clean hierarchy with proper font weights

## 🔧 Customization

### Adding New AI Tools
1. Create new page in `src/pages/dashboard/`
2. Add route in `src/App.tsx`
3. Add navigation item in `src/components/layout/Sidebar.tsx`
4. Implement RAG service method in `src/services/ragService.ts`

### Modifying RAG Database
Update the startup database in `src/services/ragService.ts`:
```typescript
const startupDatabase = [
  {
    name: "New Startup",
    description: "Description",
    industry: "Industry",
    funding: "$Amount",
    status: "Status",
    founded: "Year",
    founders: ["Founder1", "Founder2"],
    website: "website.com"
  }
];
```

## 🚀 Deployment

### Build for Production
```bash
npm run build
```

### Preview Production Build
```bash
npm run preview
```

## 📝 License

This project is licensed under the MIT License.

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests if applicable
5. Submit a pull request

## 📞 Support

For support and questions, please open an issue in the repository.

---

**Startup Genie** - Your AI-powered co-founder platform for building successful startups! 🚀
