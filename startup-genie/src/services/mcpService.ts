import type { ValidationResult, BusinessModel, PitchDeck } from '../types';

// MCP Server integration service - 100% real data, no hardcoded fallbacks
export class MCPService {
  private baseUrl: string;

  constructor() {
    this.baseUrl = process.env.NODE_ENV === 'production' 
      ? 'https://your-mcp-server.com' 
      : 'http://localhost:3001';
  }

  async validateIdea(ideaDescription: string): Promise<ValidationResult> {
    try {
      const response = await fetch(`${this.baseUrl}/api/validate_idea`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ idea_description: ideaDescription }),
      });

      if (!response.ok) {
        throw new Error(`MCP Server Error: ${response.status} ${response.statusText}`);
      }

      return await response.json();
    } catch (error) {
      console.error('Failed to validate idea:', error);
      throw new Error('Unable to validate idea. Please ensure the MCP server is running and try again.');
    }
  }

  async generateBusinessModel(companyInfo: any): Promise<BusinessModel> {
    try {
      const response = await fetch(`${this.baseUrl}/api/generate_business_model`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ company_info: companyInfo }),
      });

      if (!response.ok) {
        throw new Error(`MCP Server Error: ${response.status} ${response.statusText}`);
      }

      return await response.json();
    } catch (error) {
      console.error('Failed to generate business model:', error);
      throw new Error('Unable to generate business model. Please ensure the MCP server is running and try again.');
    }
  }

  async createPitchDeck(startupInfo: any): Promise<PitchDeck> {
    try {
      const response = await fetch(`${this.baseUrl}/api/create_pitch_deck`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ startup_info: startupInfo }),
      });

      if (!response.ok) {
        throw new Error(`MCP Server Error: ${response.status} ${response.statusText}`);
      }

      return await response.json();
    } catch (error) {
      console.error('Failed to create pitch deck:', error);
      throw new Error('Unable to create pitch deck. Please ensure the MCP server is running and try again.');
    }
  }
}

// Export singleton instance
export const mcpService = new MCPService(); 