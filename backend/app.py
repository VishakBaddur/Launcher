from flask import Flask, request, jsonify
import logging
import sys
from scraper import BusinessScraper
from analyzer import BusinessAnalyzer
from werkzeug.security import generate_password_hash, check_password_hash
import jwt
import datetime
from functools import wraps
from pytrends.request import TrendReq
import requests
import re
import os
from flask_sqlalchemy import SQLAlchemy
from sqlalchemy.exc import IntegrityError

# Add dotenv support for environment variables
try:
    from dotenv import load_dotenv
    load_dotenv()
except ImportError:
    pass

# Setup detailed logging
logging.basicConfig(
    level=logging.DEBUG,
    format='%(asctime)s - %(name)s - %(levelname)s - %(message)s',
    handlers=[
        logging.StreamHandler(sys.stdout)
    ]
)
logger = logging.getLogger(__name__)

try:
    app = Flask(__name__)
    app.config['SECRET_KEY'] = os.environ.get('SECRET_KEY', 'your-secret-key')
    database_url = os.environ.get('DATABASE_URL', 'sqlite:///app.db')
    if database_url.startswith('postgres://'):
        database_url = database_url.replace('postgres://', 'postgresql://', 1)
    app.config['SQLALCHEMY_DATABASE_URI'] = database_url
    app.config['SQLALCHEMY_ENGINE_OPTIONS'] = {'connect_args': {'sslmode': 'require'} if 'neon.tech' in database_url else {}}
    app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = False

    db = SQLAlchemy(app)

    class User(db.Model):
        id = db.Column(db.Integer, primary_key=True)
        email = db.Column(db.String(120), unique=True, nullable=False)
        password = db.Column(db.String(256), nullable=False)
        name = db.Column(db.String(120), nullable=False)
        created_at = db.Column(db.DateTime, default=datetime.datetime.utcnow)

    def create_db():
        with app.app_context():
            db.create_all()

    create_db()

    logger.info("Flask app initialized")

    # Initialize components
    scraper = BusinessScraper()
    analyzer = BusinessAnalyzer()
    logger.info("Components initialized")

    def token_required(f):
        @wraps(f)
        def decorated(*args, **kwargs):
            token = request.headers.get('Authorization')
            if not token:
                return jsonify({'error': 'Token is missing'}), 401
            try:
                token = token.split(' ')[1]  # Remove 'Bearer ' prefix
                data = jwt.decode(token, app.config['SECRET_KEY'], algorithms=['HS256'])
                user = User.query.filter_by(email=data['email']).first()
                if not user:
                    return jsonify({'error': 'User not found'}), 401
            except Exception as e:
                return jsonify({'error': 'Invalid token'}), 401
            return f(user, *args, **kwargs)
        return decorated

    def add_cors_headers(response):
        response.headers['Access-Control-Allow-Origin'] = os.environ.get('ALLOWED_ORIGIN', 'https://launcher-frontend.onrender.com')
        response.headers['Access-Control-Allow-Methods'] = 'GET, POST, OPTIONS'
        response.headers['Access-Control-Allow-Headers'] = 'Content-Type, Authorization'
        response.headers['Access-Control-Allow-Credentials'] = 'true'
        return response

    @app.before_request
    def handle_preflight():
        logger.debug(f"Received {request.method} request to {request.path}")
        if request.method == "OPTIONS":
            response = app.make_default_options_response()
            response.headers['Access-Control-Allow-Origin'] = os.environ.get('ALLOWED_ORIGIN', 'https://launcher-frontend.onrender.com')
            response.headers['Access-Control-Allow-Methods'] = 'GET, POST, OPTIONS'
            response.headers['Access-Control-Allow-Headers'] = 'Content-Type, Authorization'
            response.headers['Access-Control-Allow-Credentials'] = 'true'
            return response

    @app.after_request
    def after_request(response):
        return add_cors_headers(response)

    @app.route('/api/register', methods=['POST', 'OPTIONS'])
    def register():
        logger.debug("Received register request")
        if request.method == 'OPTIONS':
            return '', 200
        try:
            data = request.get_json()
            if not data:
                return jsonify({'error': 'No data provided'}), 400
            required_fields = ['email', 'password', 'name']
            missing_fields = [field for field in required_fields if field not in data]
            if missing_fields:
                return jsonify({'error': f'Missing required fields: {", ".join(missing_fields)}'}), 400
            email = data['email']
            password = data['password']
            name = data['name']
            # Validate email format
            if not re.match(r"[^@]+@[^@]+\.[^@]+", email):
                return jsonify({'error': 'Invalid email format'}), 400
            if User.query.filter_by(email=email).first():
                return jsonify({'error': 'Email already registered'}), 400
            hashed_password = generate_password_hash(password)
            user = User(email=email, password=hashed_password, name=name)
            db.session.add(user)
            db.session.commit()
            token = jwt.encode({
                'email': email,
                'exp': datetime.datetime.utcnow() + datetime.timedelta(hours=24)
            }, app.config['SECRET_KEY'])
            return jsonify({
                'token': token,
                'user': {
                    'email': email,
                    'name': name
                }
            }), 201
        except IntegrityError:
            db.session.rollback()
            return jsonify({'error': 'Email already registered'}), 400
        except Exception as e:
            logger.error(f"Error during registration: {str(e)}", exc_info=True)
            return jsonify({'error': 'An unexpected error occurred during registration'}), 500

    @app.route('/api/login', methods=['POST', 'OPTIONS'])
    def login():
        logger.debug("Received login request")
        if request.method == 'OPTIONS':
            return '', 200
        try:
            data = request.get_json()
            if not data or 'email' not in data or 'password' not in data:
                return jsonify({'error': 'Missing required fields'}), 400
            email = data['email']
            password = data['password']
            user = User.query.filter_by(email=email).first()
            if not user or not check_password_hash(user.password, password):
                return jsonify({'error': 'Invalid credentials'}), 401
            token = jwt.encode({
                'email': email,
                'exp': datetime.datetime.utcnow() + datetime.timedelta(hours=24)
            }, app.config['SECRET_KEY'])
            return jsonify({
                'token': token,
                'user': {
                    'email': email,
                    'name': user.name
                }
            })
        except Exception as e:
            logger.error(f"Error during login: {str(e)}", exc_info=True)
            return jsonify({'error': str(e)}), 500

    @app.route('/api/validate-idea', methods=['POST', 'OPTIONS'])
    @token_required
    def validate_idea(current_user):
        logger.debug("Received validate-idea request")
        if request.method == 'OPTIONS':
            return '', 200
        try:
            data = request.get_json()
            if not data or 'idea' not in data:
                return jsonify({'error': 'No idea provided'}), 400
            idea = data['idea']
            if not idea.strip():
                return jsonify({'error': 'Empty idea provided'}), 400
            # Primary: Run 4-step Zephyr LLM pipeline
            from llm_service import generate_insights
            context = {
                'business_idea': idea,
                'target_market': data.get('targetMarket', ''),
                'location': data.get('location', ''),
                'budget': data.get('budget', ''),
                'business_model': data.get('businessModel', '')
            }
            llm_result = generate_insights(context)
            if llm_result and llm_result.get('category') != 'Unknown':
                report = {
                    'summary': llm_result.get('description', ''),
                    'market_trends': llm_result.get('market_trends', []),
                    'challenges': llm_result.get('common_challenges', []),
                    'success_factors': llm_result.get('success_factors', []),
                    'example_companies': llm_result.get('example_companies', []),
                    'swot': llm_result.get('swot', {}),
                    'competitive_advantage': llm_result.get('competitive_advantage', ''),
                    'positioning_statement': llm_result.get('positioning_statement', ''),
                    'recommendations': llm_result.get('recommendations', []),
                    'investor_hook': llm_result.get('investor_hook', ''),
                    'competitors': [],
                    'news': [],
                    'similarStartups': [],
                    'pipeline_steps_completed': llm_result.get('pipeline_steps_completed', 0)
                }
                return jsonify(report)
            # Fallback: hardcoded business mappings
            from business_mappings import get_business_mapping
            mapping = get_business_mapping(idea)
            if mapping:
                return jsonify({
                    'summary': mapping.description or '',
                    'market_trends': mapping.market_trends or [],
                    'challenges': mapping.common_challenges or [],
                    'success_factors': mapping.success_factors or [],
                    'example_companies': [c.__dict__ for c in mapping.example_companies],
                    'charts': mapping.market_data or {},
                    'competitors': [], 'news': [], 'similarStartups': []
                })
            # Last resort: scraper
            business_data = scraper.gather_business_data(
                idea,
                target_market=data.get('targetMarket', ''),
                location=data.get('location', ''),
                budget=data.get('budget', ''),
                business_model=data.get('businessModel', '')
            )
            report = analyzer.generate_validation_report(idea, business_data)
            if isinstance(report, dict):
                for key in ['competitors', 'news', 'similarStartups']:
                    if key not in report or report[key] is None:
                        report[key] = []
            return jsonify(report)
        except Exception as e:
            logger.error(f"Error validating idea: {str(e)}", exc_info=True)
            return jsonify({'error': str(e)}), 500

    @app.route('/api/generate-plan', methods=['POST', 'OPTIONS'])
    @token_required
    def generate_plan(current_user):
        logger.debug("Received generate-plan request")
        if request.method == 'OPTIONS':
            return '', 200
        try:
            data = request.get_json()
            if not data or 'idea' not in data:
                return jsonify({'error': 'No idea provided'}), 400
            idea = data['idea']
            if not idea.strip():
                return jsonify({'error': 'Empty idea provided'}), 400
            # Primary: Run 4-step Zephyr LLM pipeline
            from llm_service import generate_insights
            llm_result = generate_insights({'business_idea': idea})
            if llm_result and llm_result.get('category') != 'Unknown':
                plan = {
                    'executive_summary': llm_result.get('investor_hook', ''),
                    'company_description': llm_result.get('description', ''),
                    'market_analysis': {
                        'market_size': llm_result.get('market_size', ''),
                        'growth_rate': llm_result.get('key_trends', [''])[0] if llm_result.get('key_trends') else '',
                        'target_market': llm_result.get('target_customers', ''),
                    },
                    'summary': llm_result.get('description', ''),
                    'market_trends': llm_result.get('market_trends', []),
                    'challenges': llm_result.get('common_challenges', []),
                    'success_factors': llm_result.get('success_factors', []),
                    'recommendations': llm_result.get('recommendations', []),
                    'competitive_advantage': llm_result.get('competitive_advantage', ''),
                    'swot': llm_result.get('swot', {}),
                    'pipeline_steps_completed': llm_result.get('pipeline_steps_completed', 0)
                }
                return jsonify(plan)
            # Fallback: hardcoded business mappings
            from business_mappings import get_business_mapping
            mapping = get_business_mapping(idea)
            if mapping and mapping.business_plan_template:
                plan = dict(mapping.business_plan_template)
                plan['summary'] = mapping.description or ''
                plan['market_trends'] = mapping.market_trends or []
                plan['challenges'] = mapping.common_challenges or []
                plan['success_factors'] = mapping.success_factors or []
                plan['example_companies'] = [c.__dict__ for c in mapping.example_companies]
                return jsonify(plan)
            # Last resort: scraper
            business_data = scraper.gather_business_data(idea)
            plan = analyzer.generate_business_plan(idea, business_data)
            return jsonify(plan)
        except Exception as e:
            logger.error(f"Error generating business plan: {str(e)}", exc_info=True)
            return jsonify({'error': str(e)}), 500

    @app.route('/api/generate-business-model', methods=['POST', 'OPTIONS'])
    @token_required
    def generate_business_model(current_user):
        logger.debug("Received generate-business-model request")
        if request.method == 'OPTIONS':
            return '', 200
        try:
            data = request.get_json()
            if not data or 'idea' not in data:
                return jsonify({'error': 'No idea provided'}), 400
            idea = data['idea']
            if not idea.strip():
                return jsonify({'error': 'Empty idea provided'}), 400
            # Primary: Run 4-step Zephyr LLM pipeline
            from llm_service import generate_insights
            llm_result = generate_insights({'business_idea': idea})
            if llm_result and llm_result.get('category') != 'Unknown':
                model = {
                    'summary': llm_result.get('description', ''),
                    'value_proposition': llm_result.get('description', ''),
                    'customer_segments': llm_result.get('target_customers', ''),
                    'channels': llm_result.get('recommendations', []),
                    'revenue_streams': 'SaaS subscription + enterprise licensing',
                    'key_resources': llm_result.get('success_factors', []),
                    'key_activities': llm_result.get('recommendations', []),
                    'key_partnerships': [],
                    'cost_structure': [],
                    'market_trends': llm_result.get('market_trends', []),
                    'challenges': llm_result.get('common_challenges', []),
                    'success_factors': llm_result.get('success_factors', []),
                    'competitive_advantage': llm_result.get('competitive_advantage', ''),
                    'moat': llm_result.get('moat', ''),
                    'swot': llm_result.get('swot', {}),
                    'example_companies': llm_result.get('example_companies', []),
                    'pipeline_steps_completed': llm_result.get('pipeline_steps_completed', 0)
                }
                return jsonify(model)
            # Fallback: hardcoded business mappings
            from business_mappings import get_business_mapping
            mapping = get_business_mapping(idea)
            if mapping and mapping.business_model_canvas:
                model = dict(mapping.business_model_canvas)
                model['example_companies'] = [c.__dict__ for c in mapping.example_companies]
                model['summary'] = mapping.description or ''
                model['market_trends'] = mapping.market_trends or []
                model['challenges'] = mapping.common_challenges or []
                model['success_factors'] = mapping.success_factors or []
                return jsonify(model)
            # Last resort: scraper
            business_data = scraper.gather_business_data(idea)
            model = analyzer.generate_business_plan(idea, business_data)
            return jsonify(model)
        except Exception as e:
            logger.error(f"Error generating business model: {str(e)}", exc_info=True)
            return jsonify({'error': str(e)}), 500

    @app.route('/api/generate-pitch', methods=['POST', 'OPTIONS'])
    @token_required
    def generate_pitch(current_user):
        logger.debug("Received generate-pitch request")
        if request.method == 'OPTIONS':
            return '', 200
        try:
            data = request.get_json()
            if not data or 'idea' not in data:
                return jsonify({'error': 'No idea provided'}), 400
            idea = data['idea']
            if not idea.strip():
                return jsonify({'error': 'Empty idea provided'}), 400
            # Primary: Run 4-step Zephyr LLM pipeline
            from llm_service import generate_insights
            llm_result = generate_insights({'business_idea': idea})
            if llm_result and llm_result.get('category') != 'Unknown':
                business_data = {
                    'summary': llm_result.get('description', ''),
                    'unique_value_proposition': llm_result.get('description', ''),
                    'business_model': llm_result.get('category', ''),
                    'market_size': llm_result.get('market_size', ''),
                    'market_trends': llm_result.get('market_trends', []),
                    'target_customers': llm_result.get('target_customers', ''),
                    'competitors': [c.get('name', '') if isinstance(c, dict) else c for c in llm_result.get('example_companies', [])],
                    'strengths': llm_result.get('success_factors', []),
                    'key_metrics': llm_result.get('key_trends', []),
                    'revenue_model': 'SaaS subscription + enterprise licensing',
                    'funding_requirements': '$750,000 Seed Round',
                    'team_structure': 'Lean founding team with deep domain expertise',
                    'key_roles': ['CEO / Product', 'CTO / Engineering', 'Head of Growth'],
                    'weaknesses': llm_result.get('swot', {}).get('weaknesses', []),
                    'opportunities': llm_result.get('swot', {}).get('opportunities', []),
                    'threats': llm_result.get('common_challenges', []),
                    'market_gap': llm_result.get('positioning_statement', ''),
                }
            else:
                # Fallback: hardcoded business mappings
                from business_mappings import get_business_mapping
                mapping = get_business_mapping(idea)
                if mapping:
                    business_data = {
                        'summary': mapping.description or '',
                        'unique_value_proposition': getattr(mapping, 'unique_value_proposition', None),
                        'market_trends': mapping.market_trends or [],
                        'target_customers': getattr(mapping, 'target_customers', None),
                        'competitors': [c.__dict__ for c in mapping.example_companies],
                        'strengths': mapping.success_factors or [],
                    }
                else:
                    business_data = scraper.gather_business_data(idea)
            pitch = analyzer.generate_pitch_deck(idea, business_data)
            return jsonify(pitch)
        except Exception as e:
            logger.error(f"Error generating pitch deck: {str(e)}", exc_info=True)
            return jsonify({'error': str(e)}), 500

    @app.route('/api/rag-stats', methods=['GET'])
    def rag_stats():
        try:
            from rag_service import get_rag_service
            stats = get_rag_service().get_stats()
            return jsonify(stats)
        except Exception as e:
            return jsonify({"error": str(e), "total_analyses": 0}), 200

    @app.route('/api/health', methods=['GET'])
    def health_check():
        logger.debug("Received health check request")
        return jsonify({'status': 'healthy'})

    @app.route('/api/analyze-market', methods=['POST', 'OPTIONS'])
    def analyze_market():
        if request.method == 'OPTIONS':
            return '', 200
        try:
            data = request.get_json()
            business_name = data.get('businessName', '')
            industry = data.get('industry', '')
            target_market = data.get('targetMarket', '')
            competitors = data.get('competitors', '')
            unique_value = data.get('uniqueValue', '')

            # Google Trends
            trends_data = {}
            try:
                pytrends = TrendReq()
                pytrends.build_payload([industry], cat=0, timeframe='now 7-d', geo='', gprop='')
                trends = pytrends.interest_over_time()
                if not trends.empty:
                    trends_data = trends[industry].to_dict()
            except Exception as e:
                trends_data = {'error': 'Google Trends unavailable'}

            # Wikipedia/DBpedia for competitors
            wiki_competitors = []
            try:
                search_term = competitors if competitors else industry
                wiki_url = f'https://en.wikipedia.org/w/api.php?action=query&list=search&srsearch={search_term}&format=json'
                resp = requests.get(wiki_url)
                if resp.ok:
                    results = resp.json()['query']['search']
                    wiki_competitors = [r['title'] for r in results[:5]]
            except Exception as e:
                wiki_competitors = ['Could not fetch competitor info']

            # US Census for demographics (example: population by state)
            census_data = {}
            try:
                # Example: get US population by state
                census_url = 'https://api.census.gov/data/2020/pep/population?get=NAME,POP&for=state:*'
                resp = requests.get(census_url)
                if resp.ok:
                    rows = resp.json()
                    census_data = {row[0]: row[1] for row in rows[1:6]}  # Top 5 states
            except Exception as e:
                census_data = {'error': 'Census data unavailable'}
        
            return jsonify({
                'market_size': f"See Google Trends data for '{industry}' (last 7 days)",
                'market_trends': trends_data,
                'target_audience': f"See US Census data for population by state (top 5): {census_data}",
                'competitive_analysis': f"Top Wikipedia/DBpedia results for '{competitors or industry}': {wiki_competitors}",
                'market_opportunities': f"Unique value: {unique_value}"
            })
        except Exception as e:
            return jsonify({'error': str(e)}), 500

    if __name__ == '__main__':
        logger.info("Starting Flask server...")
        try:
            app.run(debug=True, port=5001, host='0.0.0.0')
        except Exception as e:
            logger.error(f"Failed to start Flask server: {str(e)}", exc_info=True)
            sys.exit(1)

except Exception as e:
    logger.error(f"Failed to initialize Flask app: {str(e)}", exc_info=True)
    sys.exit(1)
