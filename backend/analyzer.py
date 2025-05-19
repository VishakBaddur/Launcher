import re
from datetime import datetime
import logging

class BusinessAnalyzer:
    def __init__(self):
        logging.basicConfig(level=logging.INFO)
        self.logger = logging.getLogger(__name__)

    def extract_key_phrases(self, text):
        """Extract key phrases from text using basic pattern matching."""
        # Remove special characters and convert to lowercase
        text = re.sub(r'[^\w\s]', '', text.lower())
        # Split into words and remove common words
        words = text.split()
        common_words = {'the', 'a', 'an', 'and', 'or', 'but', 'in', 'on', 'at', 'to', 'for', 'of', 'with', 'by'}
        key_phrases = [word for word in words if word not in common_words and len(word) > 3]
        return list(set(key_phrases))

    def analyze_success_patterns(self, success_stories):
        """Analyze patterns in success stories."""
        patterns = {
            'challenges': [],
            'solutions': [],
            'strategies': []
        }
        
        for story in success_stories:
            text = f"{story['title']} {story['summary']}"
            # Look for challenge-related phrases
            if any(word in text.lower() for word in ['challenge', 'problem', 'issue', 'difficulty']):
                patterns['challenges'].append(story)
            # Look for solution-related phrases
            if any(word in text.lower() for word in ['solution', 'solve', 'overcome', 'success']):
                patterns['solutions'].append(story)
            # Look for strategy-related phrases
            if any(word in text.lower() for word in ['strategy', 'approach', 'method', 'plan']):
                patterns['strategies'].append(story)
        
        return patterns

    def format_market_analysis(self, data):
        """Format market analysis data into a dictionary."""
        return {
            'market_size': data.get('market_size', 'Not available'),
            'growth_potential': data.get('growth_potential', 'Not available'),
            'target_market': data.get('target_market', 'Not available'),
            'competition': data.get('competition', 'Not available')
        }

    def format_list_section(self, items, title):
        """Format a list of items into a dictionary with a title and items."""
        if not items:
            return {
                'title': title,
                'items': ['No data available']
            }
        return {
            'title': title,
            'items': items
        }

    def generate_validation_report(self, idea, business_data):
        """Generate a comprehensive validation report for the business idea."""
        try:
            # Ensure business_data is a dictionary
            if not isinstance(business_data, dict):
                business_data = {}

            # Extract market analysis data
            market_analysis = business_data.get('market_analysis', {})
            market_size = market_analysis.get('market_size', 'Market size data not available')
            growth_potential = market_analysis.get('growth_potential', 'Growth potential data not available')
            target_market = market_analysis.get('target_market', 'Target market data not available')
            competition = market_analysis.get('competition', 'Competition data not available')

            # Extract validation results
            validation_results = business_data.get('validation_results', {})
            challenges = validation_results.get('challenges', {}).get('items', ['No challenges identified'])
            success_patterns = validation_results.get('success_patterns', {}).get('items', ['No success patterns available'])

            # Extract recommendations
            recommendations_data = business_data.get('recommendations', {})
            recommendations = []
            if 'categories' in recommendations_data:
                for category in recommendations_data['categories'].values():
                    if isinstance(category, dict) and 'items' in category:
                        recommendations.extend(category['items'])

            # Extract best practices
            best_practices_data = business_data.get('best_practices', {})
            best_practices = []
            if 'categories' in best_practices_data:
                for category in best_practices_data['categories'].values():
                    if isinstance(category, dict) and 'items' in category:
                        best_practices.extend(category['items'])

            # Construct the report
            report = {
                'summary': business_data.get('summary', 'No summary available'),
                'market_analysis': {
                    'market_size': market_size,
                    'growth_potential': growth_potential,
                    'target_market': target_market,
                    'competition': competition
                },
                'validation_results': {
                    'success_patterns': self.format_list_section(
                        success_patterns,
                        "Success Patterns and Best Practices"
                    ),
                    'challenges': self.format_list_section(
                        challenges,
                        "Challenges and Considerations"
                    )
                },
                'recommendations': self.format_list_section(
                    recommendations or ['No specific recommendations available'],
                    "Recommendations"
                ),
                'best_practices': self.format_list_section(
                    best_practices or ['No specific best practices available'],
                    "Best Practices"
                )
            }

            # Add any additional data from business_data that might be useful
            if 'graph_data' in business_data:
                report['graph_data'] = business_data['graph_data']

            return report

        except Exception as e:
            self.logger.error(f"Error generating validation report: {str(e)}")
            # Return a basic report with error information
            return {
                'summary': 'Error generating full report',
                'market_analysis': {
                    'market_size': 'Market size data not available',
                    'growth_potential': 'Growth potential data not available',
                    'target_market': 'Target market data not available',
                    'competition': 'Competition data not available'
                },
                'validation_results': {
                    'success_patterns': self.format_list_section(
                        ['Unable to analyze success patterns'],
                        "Success Patterns and Best Practices"
                    ),
                    'challenges': self.format_list_section(
                        ['Unable to identify challenges'],
                        "Challenges and Considerations"
                    )
                },
                'recommendations': self.format_list_section(
                    ['Unable to generate recommendations'],
                    "Recommendations"
                ),
                'best_practices': self.format_list_section(
                    ['Unable to generate best practices'],
                    "Best Practices"
                ),
                'error': str(e)
            }

    def format_business_plan_section(self, data, title):
        """Format a business plan section into a string."""
        if isinstance(data, dict):
            sections = [f"{title}:"]
            for key, value in data.items():
                if isinstance(value, list):
                    sections.append(f"\n{key.replace('_', ' ').title()}:")
                    sections.extend(f"• {item}" for item in value)
                else:
                    sections.append(f"\n{key.replace('_', ' ').title()}: {value}")
            return "\n".join(sections)
        return f"{title}:\n{data}"

    def generate_business_plan(self, idea, business_data):
        """Generate a comprehensive business plan."""
        return {
            'executive_summary': business_data.get('summary', ''),
            'company_description': self.format_business_plan_section({
                'business_model': business_data.get('business_model'),
                'unique_value_proposition': business_data.get('unique_value_proposition'),
                'target_customers': business_data.get('target_customers'),
                'key_metrics': business_data.get('key_metrics', [])
            }, "Company Description"),
            'market_analysis': self.format_business_plan_section({
                'market_size': business_data.get('market_size'),
                'market_trends': business_data.get('market_trends', []),
                'competitor_analysis': business_data.get('competitor_analysis'),
                'swot_analysis': {
                    'strengths': business_data.get('strengths', []),
                    'weaknesses': business_data.get('weaknesses', []),
                    'opportunities': business_data.get('opportunities', []),
                    'threats': business_data.get('threats', [])
                }
            }, "Market Analysis"),
            'organization_plan': self.format_business_plan_section({
                'team_structure': business_data.get('team_structure'),
                'key_roles': business_data.get('key_roles', []),
                'operational_plan': business_data.get('operational_plan'),
                'technology_stack': business_data.get('technology_stack', [])
            }, "Organization Plan"),
            'marketing_plan': self.format_business_plan_section({
                'marketing_strategy': business_data.get('marketing_strategy'),
                'channels': business_data.get('marketing_channels', []),
                'pricing_strategy': business_data.get('pricing_strategy'),
                'promotion_plan': business_data.get('promotion_plan', [])
            }, "Marketing Plan"),
            'financial_plan': self.format_business_plan_section({
                'startup_costs': business_data.get('startup_costs'),
                'revenue_model': business_data.get('revenue_model'),
                'projected_financials': business_data.get('projected_financials'),
                'funding_requirements': business_data.get('funding_requirements')
            }, "Financial Plan")
        } 