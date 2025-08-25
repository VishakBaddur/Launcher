from typing import Dict, List, Optional, Any
from dataclasses import dataclass
from datetime import datetime
import difflib
import logging

@dataclass
class CompanyInfo:
    name: str
    founded_year: int
    funding_amount: Optional[str]  # e.g., "$100M Series B"
    description: str
    website: str
    news_url: Optional[str]
    market_size: Optional[str]
    key_metrics: Optional[Dict[str, str]]  # e.g., {"Revenue": "$50M", "Users": "1M+"}

@dataclass
class BusinessMapping:
    category: str
    description: str
    example_companies: List[CompanyInfo]
    market_trends: List[str]
    common_challenges: List[str]
    success_factors: List[str]
    market_data: Optional[Dict[str, List[Dict[str, Any]]]] = None
    business_plan_template: Optional[Dict[str, Any]] = None
    reference_plans: Optional[List[Dict[str, Any]]] = None
    business_model_canvas: Optional[Dict[str, Any]] = None

# Mapping of business ideas to real companies and insights
BUSINESS_MAPPINGS: Dict[str, BusinessMapping] = {
    "shoe_resale": BusinessMapping(
        category="E-commerce & Resale",
        description="Online marketplace for buying and selling sneakers and streetwear",
        example_companies=[
            CompanyInfo(
                name="StockX",
                founded_year=2016,
                funding_amount="$690M Series E",
                description="Leading marketplace for authentic sneakers, streetwear, trading cards, and collectibles",
                website="https://stockx.com",
                news_url="https://www.cnbc.com/2023/09/14/stockx-valuation.html",
                market_size="$10B+",
                key_metrics={
                    "GMV": "$2B+",
                    "Users": "44M+",
                    "Countries": "200+"
                }
            ),
            CompanyInfo(
                name="GOAT",
                founded_year=2015,
                funding_amount="$195M Series F",
                description="Global platform for authentic sneakers and apparel",
                website="https://goat.com",
                news_url="https://www.businesswire.com/news/home/20230117005289/en/",
                market_size="$10B+",
                key_metrics={
                    "Users": "30M+",
                    "Countries": "170+"
                }
            )
        ],
        market_trends=[
            "Growing demand for limited edition sneakers",
            "Increasing focus on authentication and trust",
            "Expansion into new categories like trading cards and collectibles"
        ],
        common_challenges=[
            "Ensuring product authenticity",
            "Managing inventory and logistics",
            "Competing with established marketplaces",
            "Building trust with buyers and sellers"
        ],
        success_factors=[
            "Strong authentication process",
            "User-friendly mobile app",
            "Global shipping network",
            "Community building and engagement"
        ],
        market_data={
            "monthly_growth": [
                {"month": "Jan 2023", "value": 100},
                {"month": "Feb 2023", "value": 115},
                {"month": "Mar 2023", "value": 130},
                {"month": "Apr 2023", "value": 145},
                {"month": "May 2023", "value": 160},
                {"month": "Jun 2023", "value": 175},
                {"month": "Jul 2023", "value": 190},
                {"month": "Aug 2023", "value": 205},
                {"month": "Sep 2023", "value": 220},
                {"month": "Oct 2023", "value": 235},
                {"month": "Nov 2023", "value": 250},
                {"month": "Dec 2023", "value": 265}
            ],
            "market_share": [
                {"company": "StockX", "value": 45},
                {"company": "GOAT", "value": 35},
                {"company": "Others", "value": 20}
            ],
            "user_demographics": [
                {"age": "18-24", "value": 45},
                {"age": "25-34", "value": 35},
                {"age": "35-44", "value": 15},
                {"age": "45+", "value": 5}
            ],
            "category_distribution": [
                {"category": "Sneakers", "value": 60},
                {"category": "Streetwear", "value": 25},
                {"category": "Trading Cards", "value": 10},
                {"category": "Collectibles", "value": 5}
            ]
        },
        business_plan_template={
            "executive_summary": "A digital marketplace for authentic sneakers and streetwear, leveraging technology for trust and global reach.",
            "company_description": "ShoeResaleX is an online platform connecting sneaker enthusiasts and collectors, providing authentication and logistics services.",
            "market_analysis": {
                "market_size": "$10B+ global sneaker resale market",
                "growth_chart": "monthly_growth",
                "market_share_chart": "market_share",
                "user_demographics_chart": "user_demographics",
                "trends": [
                    "Limited edition drops drive demand",
                    "Millennial and Gen Z buyers dominate"
                ],
                "competitors": ["StockX", "GOAT", "eBay"]
            },
            "organization_team": "Founders with backgrounds in e-commerce, logistics, and sneaker culture. Team includes authentication experts and tech developers.",
            "product_service": "Marketplace for buying/selling sneakers, authentication, logistics, and community features.",
            "marketing_sales": "Influencer partnerships, social media campaigns, and exclusive drops.",
            "financials": {
                "revenue_model": "Transaction fees, premium seller services, and advertising.",
                "projections_chart": "monthly_growth"
            },
            "funding_request": "Seeking $2M seed funding for tech development and marketing.",
            "appendix": "Detailed competitor analysis, user testimonials, and press coverage."
        },
        business_model_canvas={
            "value_proposition": "Authentic, hard-to-find sneakers and streetwear with guaranteed authenticity.",
            "customer_segments": ["Sneaker enthusiasts", "Collectors", "Streetwear fans"],
            "channels": ["Online marketplace", "Mobile app", "Social media"],
            "customer_relationships": ["Community engagement", "Loyalty programs", "Customer support"],
            "revenue_streams": ["Transaction fees", "Premium seller services", "Advertising"],
            "key_resources": ["Authentication technology", "Logistics network", "Brand partnerships"],
            "key_activities": ["Marketplace operations", "Authentication", "Marketing"],
            "key_partners": ["Sneaker brands", "Logistics providers", "Payment processors"],
            "cost_structure": ["Logistics", "Technology development", "Marketing", "Customer support"]
        },
        reference_plans=[
            {
                "company": "StockX",
                "summary": "StockX's business plan focused on authentication, global reach, and community building. Their financials highlight rapid GMV growth and international expansion.",
                "key_sections": [
                    "Authentication as a core value proposition",
                    "Global shipping and logistics",
                    "Community engagement via app and events"
                ]
            },
            {
                "company": "GOAT",
                "summary": "GOAT emphasized mobile-first experience, partnerships with brands, and a robust authentication process.",
                "key_sections": [
                    "Mobile app as primary channel",
                    "Brand partnerships for exclusive drops",
                    "Focus on trust and safety"
                ]
            }
        ]
    ),
    
    "food_delivery": BusinessMapping(
        category="Food & Delivery",
        description="On-demand food delivery service",
        example_companies=[
            CompanyInfo(
                name="Swiggy",
                founded_year=2014,
                funding_amount="$3.6B Total Funding",
                description="India's leading food delivery platform",
                website="https://swiggy.com",
                news_url="https://www.business-standard.com/article/companies/",
                market_size="$1.2B+",
                key_metrics={
                    "Daily Orders": "1.5M+",
                    "Restaurants": "200K+",
                    "Cities": "500+"
                }
            ),
            CompanyInfo(
                name="Zomato",
                founded_year=2008,
                funding_amount="IPO (2021)",
                description="Food delivery and restaurant discovery platform",
                website="https://zomato.com",
                news_url="https://www.livemint.com/companies/",
                market_size="$1.2B+",
                key_metrics={
                    "Monthly Users": "50M+",
                    "Restaurants": "300K+",
                    "Countries": "24"
                }
            )
        ],
        market_trends=[
            "Rapid growth in quick commerce (15-min delivery)",
            "Focus on cloud kitchens and dark stores",
            "Expansion into grocery and retail delivery",
            "Rising demand for healthy and premium food options"
        ],
        common_challenges=[
            "High operational costs and thin margins",
            "Driver retention and satisfaction",
            "Restaurant partnerships and commission rates",
            "Regulatory compliance and food safety"
        ],
        success_factors=[
            "Efficient delivery network optimization",
            "Strong restaurant relationships",
            "User-friendly mobile app experience",
            "Data-driven operations and personalization"
        ],
        market_data={
            "monthly_growth": [
                {"month": "Jan 2023", "value": 100},
                {"month": "Feb 2023", "value": 115},
                {"month": "Mar 2023", "value": 130},
                {"month": "Apr 2023", "value": 145},
                {"month": "May 2023", "value": 160},
                {"month": "Jun 2023", "value": 175},
                {"month": "Jul 2023", "value": 190},
                {"month": "Aug 2023", "value": 205},
                {"month": "Sep 2023", "value": 220},
                {"month": "Oct 2023", "value": 235},
                {"month": "Nov 2023", "value": 250},
                {"month": "Dec 2023", "value": 265}
            ],
            "market_share": [
                {"company": "Swiggy", "value": 45},
                {"company": "Zomato", "value": 35},
                {"company": "Others", "value": 20}
            ],
            "user_demographics": [
                {"age": "18-24", "value": 25},
                {"age": "25-34", "value": 40},
                {"age": "35-44", "value": 20},
                {"age": "45+", "value": 15}
            ],
            "order_distribution": [
                {"type": "Lunch", "value": 40},
                {"type": "Dinner", "value": 35},
                {"type": "Breakfast", "value": 15},
                {"type": "Snacks", "value": 10}
            ]
        },
        business_plan_template={
            "executive_summary": "A leading on-demand food delivery platform connecting customers with a wide range of restaurants, offering fast, reliable, and convenient meal delivery through a user-friendly mobile app.",
            "company_description": "FoodFast is a technology-driven food delivery service operating in major urban centers. The company partners with local restaurants to offer customers a diverse menu, real-time order tracking, and multiple payment options. Our mission is to make great food accessible anytime, anywhere.",
            "market_analysis": {
                "market_size": "$150B+ global food delivery market",
                "growth_rate": "12.2% CAGR (2021-2026)",
                "trends": [
                    "Rapid growth in quick commerce (15-min delivery)",
                    "Expansion into grocery and retail delivery",
                    "Rising demand for healthy and premium food options"
                ],
                "competitors": ["Swiggy", "Zomato", "Uber Eats", "DoorDash"],
                "user_demographics_chart": "user_demographics",
                "market_share_chart": "market_share",
                "monthly_growth_chart": "monthly_growth"
            },
            "organization_team": "Founded by experienced entrepreneurs in logistics and technology. The team includes operations managers, software engineers, marketing specialists, and a customer support division.",
            "product_service": "Mobile and web app for food ordering, real-time tracking, multiple payment options, loyalty programs, and customer support. Partnerships with 200K+ restaurants.",
            "marketing_sales": "Digital marketing, influencer partnerships, referral programs, and exclusive restaurant deals. Focus on app store optimization and social media engagement.",
            "financials": {
                "revenue_model": "Commission from restaurant partners, delivery fees, and premium subscription (FoodFast Plus).",
                "projections_chart": "monthly_growth",
                "key_metrics": ["GMV growth", "Active users", "Order frequency", "Customer retention"]
            },
            "funding_request": "Seeking $10M Series A to expand to new cities, enhance technology, and scale marketing efforts.",
            "appendix": "Detailed competitor analysis, user testimonials, press coverage, and regulatory compliance documents."
        },
        business_model_canvas={
            "value_proposition": "Fast, reliable food delivery from a wide range of restaurants.",
            "customer_segments": ["Urban professionals", "Families", "Students"],
            "channels": ["Mobile app", "Website", "Social media"],
            "customer_relationships": ["Customer support", "Loyalty programs", "Personalized offers"],
            "revenue_streams": ["Delivery fees", "Restaurant commissions", "Subscription services"],
            "key_resources": ["Delivery fleet", "Technology platform", "Restaurant partnerships"],
            "key_activities": ["Order management", "Logistics", "Customer service"],
            "key_partners": ["Restaurants", "Delivery personnel", "Payment processors"],
            "cost_structure": ["Driver payments", "Technology development", "Marketing", "Customer support"]
        }
    ),
    
    "subscription_box": BusinessMapping(
        category="E-commerce & Subscription",
        description="Curated subscription box service",
        example_companies=[
            CompanyInfo(
                name="Stitch Fix",
                founded_year=2011,
                funding_amount="IPO (2017)",
                description="Personalized clothing subscription service",
                website="https://stitchfix.com",
                news_url="https://www.businesswire.com/news/home/20231205005289/en/",
                market_size="$15B+",
                key_metrics={
                    "Revenue": "$1.6B",
                    "Active Clients": "3.8M+"
                }
            ),
            CompanyInfo(
                name="BarkBox",
                founded_year=2011,
                funding_amount="$60M Series C",
                description="Monthly subscription box for dogs",
                website="https://barkbox.com",
                news_url="https://www.cnbc.com/2023/12/14/barkbox-earnings.html",
                market_size="$5B+",
                key_metrics={
                    "Subscribers": "2.2M+",
                    "Products": "1000+"
                }
            )
        ],
        market_trends=[
            "Personalization and customization",
            "Focus on niche markets",
            "Integration of AI for better curation",
            "Sustainable and eco-friendly packaging"
        ],
        common_challenges=[
            "Customer retention",
            "Inventory management",
            "Shipping costs",
            "Finding unique products"
        ],
        success_factors=[
            "Strong curation process",
            "Personalization technology",
            "Community building",
            "Quality control"
        ],
        market_data={
            "monthly_growth": [
                {"month": "Jan 2023", "value": 100},
                {"month": "Feb 2023", "value": 110},
                {"month": "Mar 2023", "value": 120},
                {"month": "Apr 2023", "value": 130},
                {"month": "May 2023", "value": 140},
                {"month": "Jun 2023", "value": 150},
                {"month": "Jul 2023", "value": 160},
                {"month": "Aug 2023", "value": 170},
                {"month": "Sep 2023", "value": 180},
                {"month": "Oct 2023", "value": 190},
                {"month": "Nov 2023", "value": 200},
                {"month": "Dec 2023", "value": 210}
            ],
            "market_share": [
                {"company": "Stitch Fix", "value": 30},
                {"company": "BarkBox", "value": 20},
                {"company": "Others", "value": 50}
            ],
            "user_demographics": [
                {"age": "18-24", "value": 20},
                {"age": "25-34", "value": 35},
                {"age": "35-44", "value": 25},
                {"age": "45+", "value": 20}
            ],
            "category_distribution": [
                {"category": "Fashion", "value": 35},
                {"category": "Beauty", "value": 25},
                {"category": "Food & Snacks", "value": 20},
                {"category": "Pets", "value": 15},
                {"category": "Others", "value": 5}
            ]
        }
    ),
    # --- NEW IDEAS START ---
    "used_furniture_marketplace": BusinessMapping(
        category="E-Commerce & Resale",
        description="Buy and sell used furniture with delivery logistics",
        example_companies=[
            CompanyInfo(
                name="Kaiyo",
                founded_year=2015,
                funding_amount="$36M Series B",
                description="Marketplace for pre-owned furniture with pickup and delivery",
                website="https://kaiyo.com",
                news_url="https://techcrunch.com/2022/06/15/kaiyo-raises-36m/",
                market_size="$16B+ (US)",
                key_metrics={"Users": "500K+", "Cities": "10+"}
            ),
            CompanyInfo(
                name="AptDeco",
                founded_year=2014,
                funding_amount="$8M Series A",
                description="Peer-to-peer used furniture marketplace with logistics",
                website="https://aptdeco.com",
                news_url="https://www.forbes.com/sites/amyfeldman/2021/04/13/aptdeco-raises-8-million/",
                market_size="$16B+ (US)",
                key_metrics={"Users": "200K+", "Cities": "5+"}
            )
        ],
        market_trends=[
            "Sustainability driving secondhand furniture sales",
            "Urbanization and small-space living",
            "Growth of online logistics-enabled resale"
        ],
        common_challenges=[
            "Logistics and delivery costs",
            "Quality control and trust",
            "Competition from classifieds and new furniture"
        ],
        success_factors=[
            "Efficient logistics network",
            "Quality assurance",
            "User-friendly platform"
        ],
        market_data={
            "market_size_by_year": [
                {"year": 2020, "value": 12},
                {"year": 2021, "value": 14},
                {"year": 2022, "value": 16}
            ],
            "market_share": [
                {"company": "Kaiyo", "value": 30},
                {"company": "AptDeco", "value": 20},
                {"company": "Others", "value": 50}
            ],
            "monthly_growth": [
                {"month": "Jan 2023", "value": 100},
                {"month": "Feb 2023", "value": 110},
                {"month": "Mar 2023", "value": 120},
                {"month": "Apr 2023", "value": 130}
            ]
        },
        business_plan_template={
            "executive_summary": "A trusted online marketplace for buying and selling quality used furniture, offering logistics, delivery, and a seamless digital experience for urban dwellers.",
            "company_description": "FurniLoop is a platform that connects sellers and buyers of pre-owned furniture, providing quality assurance, secure payments, and convenient delivery. Our mission is to make sustainable living easy and affordable.",
            "market_analysis": {
                "market_size": "$16B+ US used furniture market",
                "growth_rate": "8.5% CAGR (2021-2026)",
                "trends": [
                    "Sustainability driving secondhand sales",
                    "Urbanization and small-space living",
                    "Growth of online logistics-enabled resale"
                ],
                "competitors": ["Kaiyo", "AptDeco", "Craigslist", "Facebook Marketplace"],
                "market_share_chart": "market_share",
                "monthly_growth_chart": "monthly_growth"
            },
            "organization_team": "Led by founders with backgrounds in logistics and e-commerce. Team includes operations, customer service, and technology specialists.",
            "product_service": "Online platform for listing, buying, and selling used furniture. Includes quality checks, secure payments, and delivery logistics.",
            "marketing_sales": "Digital ads, partnerships with moving companies, referral incentives, and sustainability-focused campaigns.",
            "financials": {
                "revenue_model": "Commission on sales, delivery fees, and premium listings.",
                "projections_chart": "monthly_growth",
                "key_metrics": ["GMV", "Active users", "Repeat buyers", "Average order value"]
            },
            "funding_request": "Seeking $2M seed funding for technology, marketing, and logistics expansion.",
            "appendix": "Sample contracts, logistics partner details, and customer testimonials."
        }
    ),
    "luxury_goods_resale": BusinessMapping(
        category="E-Commerce & Resale",
        description="Resale of authenticated luxury fashion/accessories",
        example_companies=[
            CompanyInfo(
                name="The RealReal",
                founded_year=2011,
                funding_amount="$357M IPO",
                description="Luxury consignment marketplace for authenticated goods",
                website="https://therealreal.com",
                news_url="https://www.reuters.com/business/retail-consumer/realreal-shares-rise-ipo-2019-06-28/",
                market_size="$50B+ (global)",
                key_metrics={"Revenue": "$467M", "Active Buyers": "800K+"}
            ),
            CompanyInfo(
                name="Rebag",
                founded_year=2014,
                funding_amount="$52M Series E",
                description="Luxury resale for handbags and accessories",
                website="https://rebag.com",
                news_url="https://techcrunch.com/2021/02/10/rebag-raises-33-million/",
                market_size="$50B+ (global)",
                key_metrics={"Stores": "10+", "SKUs": "30K+"}
            )
        ],
        market_trends=[
            "Growth in luxury resale due to sustainability",
            "Authentication technology adoption",
            "Millennial and Gen Z demand"
        ],
        common_challenges=[
            "Counterfeit risk",
            "Authentication costs",
            "Inventory management"
        ],
        success_factors=[
            "Strong authentication process",
            "Brand partnerships",
            "Premium customer experience"
        ],
        market_data={
            "market_size_by_year": [
                {"year": 2020, "value": 35},
                {"year": 2021, "value": 42},
                {"year": 2022, "value": 50}
            ],
            "market_share": [
                {"company": "The RealReal", "value": 40},
                {"company": "Rebag", "value": 15},
                {"company": "Others", "value": 45}
            ],
            "feature_comparison": [
                {"feature": "Authentication", "The RealReal": 5, "Rebag": 4, "Others": 3},
                {"feature": "Store Presence", "The RealReal": 4, "Rebag": 3, "Others": 2},
                {"feature": "Mobile App", "The RealReal": 5, "Rebag": 5, "Others": 3}
            ]
        },
        business_plan_template={
            "executive_summary": "A premium resale platform for authenticated luxury goods, providing trust, convenience, and access to high-end fashion and accessories.",
            "company_description": "LuxLoop is a digital marketplace for buying and selling pre-owned luxury items. We offer authentication, secure payments, and white-glove logistics to ensure a seamless experience for buyers and sellers.",
            "market_analysis": {
                "market_size": "$50B+ global luxury resale market",
                "growth_rate": "15.8% CAGR (2021-2026)",
                "trends": [
                    "Growth in luxury resale due to sustainability",
                    "Authentication technology adoption",
                    "Millennial and Gen Z demand"
                ],
                "competitors": ["The RealReal", "Rebag", "Vestiaire Collective", "Fashionphile"],
                "market_share_chart": "market_share",
                "feature_comparison_chart": "feature_comparison"
            },
            "organization_team": "Team includes luxury retail veterans, authentication experts, and technology leads.",
            "product_service": "Marketplace for authenticated luxury goods, with in-house authentication, secure shipping, and premium customer support.",
            "marketing_sales": "Influencer partnerships, social media campaigns, and collaborations with luxury brands.",
            "financials": {
                "revenue_model": "Commission on sales, authentication fees, and premium seller services.",
                "projections_chart": "market_size_by_year",
                "key_metrics": ["GMV", "Authentication rate", "Repeat buyers"]
            },
            "funding_request": "Seeking $5M Series A for technology, marketing, and global expansion.",
            "appendix": "Authentication process details, brand partnership agreements, and press coverage."
        }
    ),
    "niche_ecommerce": BusinessMapping(
        category="E-Commerce & Resale",
        description="Vertical-specific e-commerce platforms",
        example_companies=[
            CompanyInfo(
                name="Chewy",
                founded_year=2011,
                funding_amount="$451M IPO",
                description="Pet supplies e-commerce giant",
                website="https://chewy.com",
                news_url="https://www.cnbc.com/2019/06/14/chewy-ipo.html",
                market_size="$100B+ (US pet)",
                key_metrics={"Revenue": "$10B+", "Active Customers": "20M+"}
            ),
            CompanyInfo(
                name="Beautylish",
                founded_year=2010,
                funding_amount="$18M Series B",
                description="Curated beauty e-commerce",
                website="https://beautylish.com",
                news_url="https://www.glossy.co/beauty/beautylishs-growth/",
                market_size="$60B+ (US beauty)",
                key_metrics={"Brands": "100+", "SKUs": "10K+"}
            )
        ],
        market_trends=[
            "Rise of vertical marketplaces",
            "Personalization and curation",
            "Community-driven commerce"
        ],
        common_challenges=[
            "Customer acquisition costs",
            "Inventory management",
            "Scaling logistics"
        ],
        success_factors=[
            "Deep category expertise",
            "Community engagement",
            "Efficient fulfillment"
        ],
        market_data={
            "market_size_by_year": [
                {"year": 2020, "value": 120},
                {"year": 2021, "value": 140},
                {"year": 2022, "value": 160}
            ],
            "market_share": [
                {"company": "Chewy", "value": 30},
                {"company": "Beautylish", "value": 10},
                {"company": "Others", "value": 60}
            ],
            "category_distribution": [
                {"category": "Pet", "value": 60},
                {"category": "Beauty", "value": 40}
            ]
        }
    ),
    # --- NEW IDEAS CONTINUED ---
    "home_cleaning_services": BusinessMapping(
        category="Consumer Services",
        description="On-demand home cleaning and maintenance services",
        example_companies=[
            CompanyInfo(
                name="Urban Company",
                founded_year=2014,
                funding_amount="$445M Series F",
                description="India's largest home services platform (formerly UrbanClap)",
                website="https://urbancompany.com",
                news_url="https://techcrunch.com/2021/04/26/urban-company-raises-255-million/",
                market_size="$10B+ (India)",
                key_metrics={"Service Pros": "50K+", "Cities": "50+"}
            ),
            CompanyInfo(
                name="Handy",
                founded_year=2012,
                funding_amount="$110M Series D",
                description="US-based platform for home cleaning and repairs",
                website="https://handy.com",
                news_url="https://www.forbes.com/sites/amyfeldman/2018/10/19/angies-list-parent-buys-handy/",
                market_size="$10B+ (US)",
                key_metrics={"Bookings": "1M+", "Cities": "20+"}
            )
        ],
        market_trends=[
            "Growth in gig economy for home services",
            "Increased demand for hygiene post-pandemic",
            "App-based booking and payments"
        ],
        common_challenges=[
            "Quality control",
            "Worker retention",
            "Customer trust"
        ],
        success_factors=[
            "Verified professionals",
            "Transparent pricing",
            "Customer support"
        ],
        market_data={
            "market_size_by_year": [
                {"year": 2020, "value": 8},
                {"year": 2021, "value": 9},
                {"year": 2022, "value": 10}
            ],
            "market_share": [
                {"company": "Urban Company", "value": 35},
                {"company": "Handy", "value": 20},
                {"company": "Others", "value": 45}
            ],
            "service_distribution": [
                {"service": "Cleaning", "value": 60},
                {"service": "Repairs", "value": 25},
                {"service": "Beauty", "value": 15}
            ]
        },
        business_plan_template={
            "executive_summary": "A tech-enabled platform for on-demand home cleaning and maintenance, connecting customers with vetted professionals for reliable, high-quality service.",
            "company_description": "CleanNest is a home services platform offering cleaning, repairs, and beauty services through a user-friendly app. We focus on quality, transparency, and customer satisfaction.",
            "market_analysis": {
                "market_size": "$10B+ home services market (India/US)",
                "growth_rate": "6.2% CAGR (2021-2026)",
                "trends": [
                    "Growth in gig economy",
                    "Increased demand for hygiene post-pandemic",
                    "App-based booking and payments"
                ],
                "competitors": ["Urban Company", "Handy", "TaskRabbit"],
                "market_share_chart": "market_share",
                "service_distribution_chart": "service_distribution"
            },
            "organization_team": "Management with experience in consumer services, operations, and technology. Includes field operations, customer support, and product development.",
            "product_service": "App for booking cleaning, repairs, and beauty services. Features verified professionals, transparent pricing, and customer reviews.",
            "marketing_sales": "Local digital ads, partnerships with apartment complexes, referral programs, and seasonal promotions.",
            "financials": {
                "revenue_model": "Commission from service pros, service fees, and premium subscriptions.",
                "projections_chart": "market_size_by_year",
                "key_metrics": ["Bookings", "Active service pros", "Customer retention"]
            },
            "funding_request": "Seeking $1.5M seed funding for technology, marketing, and city expansion.",
            "appendix": "Service pro onboarding process, customer testimonials, and regulatory compliance documents."
        }
    ),
    "fitness_app": BusinessMapping(
        category="Consumer Services",
        description="Fitness tracking and personalized workout apps",
        example_companies=[
            CompanyInfo(
                name="MyFitnessPal",
                founded_year=2005,
                funding_amount="$18M Series A",
                description="Calorie counting and fitness tracking app",
                website="https://myfitnesspal.com",
                news_url="https://www.businessinsider.com/under-armour-buys-myfitnesspal-2015-2",
                market_size="$13B+ (global)",
                key_metrics={"Users": "200M+"}
            ),
            CompanyInfo(
                name="Centr",
                founded_year=2019,
                funding_amount="$200M Acquisition",
                description="Personalized fitness and wellness app by Chris Hemsworth",
                website="https://centr.com",
                news_url="https://www.prnewswire.com/news-releases/highpost-acquires-centr-301771857.html",
                market_size="$13B+ (global)",
                key_metrics={"Users": "1M+"}
            )
        ],
        market_trends=[
            "Growth in digital fitness post-pandemic",
            "Integration with wearables",
            "Personalized AI coaching"
        ],
        common_challenges=[
            "User retention",
            "Monetization",
            "Competition from free apps"
        ],
        success_factors=[
            "Engaging content",
            "Community features",
            "Data-driven personalization"
        ],
        market_data={
            "market_size_by_year": [
                {"year": 2020, "value": 10},
                {"year": 2021, "value": 12},
                {"year": 2022, "value": 13}
            ],
            "market_share": [
                {"company": "MyFitnessPal", "value": 30},
                {"company": "Centr", "value": 10},
                {"company": "Others", "value": 60}
            ],
            "feature_comparison": [
                {"feature": "Tracking", "MyFitnessPal": 5, "Centr": 4, "Others": 3},
                {"feature": "Personalization", "MyFitnessPal": 4, "Centr": 5, "Others": 3},
                {"feature": "Community", "MyFitnessPal": 5, "Centr": 4, "Others": 3}
            ]
        },
        business_plan_template={
            "executive_summary": "A personalized fitness and wellness app offering tracking, coaching, and community features to help users achieve their health goals.",
            "company_description": "FitTrack is a mobile app that provides personalized workout plans, nutrition tracking, and integration with wearables. Our mission is to make fitness accessible and motivating for everyone.",
            "market_analysis": {
                "market_size": "$13B+ global fitness app market",
                "growth_rate": "21.6% CAGR (2021-2026)",
                "trends": [
                    "Growth in digital fitness post-pandemic",
                    "Integration with wearables",
                    "Personalized AI coaching"
                ],
                "competitors": ["MyFitnessPal", "Centr", "Nike Training Club"],
                "market_share_chart": "market_share",
                "feature_comparison_chart": "feature_comparison"
            },
            "organization_team": "Founded by fitness experts and app developers. Team includes trainers, nutritionists, and software engineers.",
            "product_service": "Mobile app with workout plans, nutrition tracking, wearable integration, and social challenges.",
            "marketing_sales": "Influencer marketing, partnerships with gyms, app store optimization, and social media campaigns.",
            "financials": {
                "revenue_model": "Freemium model with in-app purchases and premium subscriptions.",
                "projections_chart": "market_size_by_year",
                "key_metrics": ["Active users", "Subscription rate", "Workout completion"]
            },
            "funding_request": "Seeking $3M Series A for product development, marketing, and international expansion.",
            "appendix": "Trainer bios, user testimonials, and app feature roadmap."
        }
    ),
    "personal_finance_tools": BusinessMapping(
        category="Consumer Services",
        description="Budgeting and financial planning apps",
        example_companies=[
            CompanyInfo(
                name="Mint",
                founded_year=2006,
                funding_amount="$31M Series C (acquired by Intuit)",
                description="Personal finance and budgeting app",
                website="https://mint.intuit.com",
                news_url="https://techcrunch.com/2009/09/14/intuit-buys-mint/",
                market_size="$1.5B+ (US)",
                key_metrics={"Users": "25M+"}
            ),
            CompanyInfo(
                name="YNAB",
                founded_year=2004,
                funding_amount="Bootstrapped",
                description="You Need A Budget: zero-based budgeting app",
                website="https://ynab.com",
                news_url="https://www.businessinsider.com/ynab-budgeting-app-2021-2",
                market_size="$1.5B+ (US)",
                key_metrics={"Users": "1M+"}
            )
        ],
        market_trends=[
            "Rise of fintech and open banking",
            "Subscription-based models",
            "Mobile-first financial management"
        ],
        common_challenges=[
            "User trust and data security",
            "Integration with banks",
            "User engagement"
        ],
        success_factors=[
            "Bank integrations",
            "User education",
            "Mobile UX"
        ],
        market_data={
            "market_size_by_year": [
                {"year": 2020, "value": 1.1},
                {"year": 2021, "value": 1.3},
                {"year": 2022, "value": 1.5}
            ],
            "market_share": [
                {"company": "Mint", "value": 60},
                {"company": "YNAB", "value": 10},
                {"company": "Others", "value": 30}
            ],
            "feature_comparison": [
                {"feature": "Budgeting", "Mint": 5, "YNAB": 5, "Others": 3},
                {"feature": "Bank Sync", "Mint": 5, "YNAB": 4, "Others": 2},
                {"feature": "Mobile App", "Mint": 5, "YNAB": 4, "Others": 3}
            ]
        }
    ),
    # --- RETAIL IDEAS ---
    "clothing_brand": BusinessMapping(
        category="Retail & Fashion",
        description="Direct-to-consumer or omnichannel clothing brand",
        example_companies=[
            CompanyInfo(
                name="Allbirds",
                founded_year=2015,
                funding_amount="$202M IPO",
                description="Sustainable footwear and apparel brand",
                website="https://allbirds.com",
                news_url="https://www.cnbc.com/2021/11/03/allbirds-ipo.html",
                market_size="$1.5B+ (US DTC)",
                key_metrics={"Revenue": "$297M", "Stores": "35+"}
            ),
            CompanyInfo(
                name="Everlane",
                founded_year=2010,
                funding_amount="$1.1M Seed",
                description="Ethical and transparent fashion brand",
                website="https://everlane.com",
                news_url="https://www.glossy.co/fashion/everlane-growth/",
                market_size="$1.5B+ (US DTC)",
                key_metrics={"Revenue": "$100M+", "Stores": "10+"}
            )
        ],
        market_trends=[
            "Sustainability and ethical sourcing",
            "Omnichannel retail",
            "Personalization and DTC growth"
        ],
        common_challenges=[
            "Inventory management",
            "Brand differentiation",
            "Customer acquisition costs"
        ],
        success_factors=[
            "Strong brand identity",
            "Sustainable supply chain",
            "Digital marketing"
        ],
        market_data={
            "market_size_by_year": [
                {"year": 2020, "value": 1.2},
                {"year": 2021, "value": 1.4},
                {"year": 2022, "value": 1.5}
            ],
            "market_share": [
                {"company": "Allbirds", "value": 20},
                {"company": "Everlane", "value": 10},
                {"company": "Others", "value": 70}
            ],
            "category_distribution": [
                {"category": "Footwear", "value": 60},
                {"category": "Apparel", "value": 40}
            ]
        },
        business_plan_template={
            "executive_summary": "A direct-to-consumer clothing brand focused on sustainability, transparency, and modern design, selling through online and retail channels.",
            "company_description": "EcoWear is a fashion brand offering ethically sourced apparel and footwear. We prioritize sustainable materials, fair labor, and transparent pricing.",
            "market_analysis": {
                "market_size": "$1.5B+ US DTC apparel market",
                "growth_rate": "7.5% CAGR (2021-2026)",
                "trends": [
                    "Sustainability and ethical sourcing",
                    "Omnichannel retail",
                    "Personalization and DTC growth"
                ],
                "competitors": ["Allbirds", "Everlane", "Patagonia"],
                "market_share_chart": "market_share",
                "category_distribution_chart": "category_distribution"
            },
            "organization_team": "Led by founders with backgrounds in fashion, supply chain, and digital marketing. Includes design, production, and retail operations.",
            "product_service": "Sustainable apparel and footwear, transparent supply chain, and online/offline retail experience.",
            "marketing_sales": "Content marketing, influencer partnerships, pop-up events, and loyalty programs.",
            "financials": {
                "revenue_model": "Direct sales (online and retail), wholesale partnerships, and branded collaborations.",
                "projections_chart": "market_size_by_year",
                "key_metrics": ["Revenue", "Repeat purchase rate", "Store openings"]
            },
            "funding_request": "Seeking $4M Series A for inventory, marketing, and retail expansion.",
            "appendix": "Sustainability certifications, supply chain partners, and press features."
        }
    ),
    "luggage_brand": BusinessMapping(
        category="Retail & Travel",
        description="Modern luggage and travel accessories brand",
        example_companies=[
            CompanyInfo(
                name="Away",
                founded_year=2015,
                funding_amount="$156M Series D",
                description="Direct-to-consumer luggage brand",
                website="https://awaytravel.com",
                news_url="https://www.forbes.com/sites/amyfeldman/2019/05/29/away-raises-100-million/",
                market_size="$35B+ (global)",
                key_metrics={"Revenue": "$150M+", "Stores": "13+"}
            ),
            CompanyInfo(
                name="Samsonite",
                founded_year=1910,
                funding_amount="Public",
                description="World's largest luggage company",
                website="https://samsonite.com",
                news_url="https://www.reuters.com/business/retail-consumer/samsonite-profit-2023-03-15/",
                market_size="$35B+ (global)",
                key_metrics={"Revenue": "$2.5B", "Stores": "1000+"}
            )
        ],
        market_trends=[
            "Smart luggage features",
            "Sustainable materials",
            "DTC and e-commerce growth"
        ],
        common_challenges=[
            "Supply chain disruptions",
            "Brand loyalty",
            "Travel demand volatility"
        ],
        success_factors=[
            "Durable product design",
            "Brand partnerships",
            "Omnichannel presence"
        ],
        market_data={
            "market_size_by_year": [
                {"year": 2020, "value": 28},
                {"year": 2021, "value": 32},
                {"year": 2022, "value": 35}
            ],
            "market_share": [
                {"company": "Away", "value": 5},
                {"company": "Samsonite", "value": 30},
                {"company": "Others", "value": 65}
            ],
            "category_distribution": [
                {"category": "Carry-on", "value": 50},
                {"category": "Checked", "value": 30},
                {"category": "Accessories", "value": 20}
            ]
        },
        business_plan_template={
            "executive_summary": "A modern luggage and travel accessories brand offering durable, stylish, and tech-enabled products for the next generation of travelers.",
            "company_description": "JetSet is a direct-to-consumer luggage brand focused on quality, innovation, and customer experience. Our products feature smart technology, sustainable materials, and sleek design.",
            "market_analysis": {
                "market_size": "$35B+ global luggage market",
                "growth_rate": "5.2% CAGR (2021-2026)",
                "trends": [
                    "Smart luggage features",
                    "Sustainable materials",
                    "DTC and e-commerce growth"
                ],
                "competitors": ["Away", "Samsonite", "Tumi"],
                "market_share_chart": "market_share",
                "category_distribution_chart": "category_distribution"
            },
            "organization_team": "Team includes product designers, supply chain managers, and e-commerce specialists.",
            "product_service": "Carry-on and checked luggage, travel accessories, and smart features (tracking, charging).",
            "marketing_sales": "Digital ads, travel influencer partnerships, airport pop-ups, and referral programs.",
            "financials": {
                "revenue_model": "Direct sales, wholesale, and branded collaborations.",
                "projections_chart": "market_size_by_year",
                "key_metrics": ["Revenue", "Units sold", "Customer satisfaction"]
            },
            "funding_request": "Seeking $5M Series A for product development, marketing, and global expansion.",
            "appendix": "Product patents, customer reviews, and retail partner agreements."
        }
    ),
    "accessories_brand": BusinessMapping(
        category="Retail & Accessories",
        description="Fashion accessories brand (bags, jewelry, eyewear, etc.)",
        example_companies=[
            CompanyInfo(
                name="Warby Parker",
                founded_year=2010,
                funding_amount="$535M IPO",
                description="DTC eyewear brand",
                website="https://warbyparker.com",
                news_url="https://www.cnbc.com/2021/09/29/warby-parker-ipo.html",
                market_size="$5B+ (US eyewear)",
                key_metrics={"Revenue": "$540M", "Stores": "200+"}
            ),
            CompanyInfo(
                name="Mejuri",
                founded_year=2013,
                funding_amount="$120M Series D",
                description="Fine jewelry DTC brand",
                website="https://mejuri.com",
                news_url="https://techcrunch.com/2022/12/13/mejuri-raises-100-million/",
                market_size="$5B+ (US jewelry)",
                key_metrics={"Revenue": "$100M+", "Stores": "20+"}
            )
        ],
        market_trends=[
            "DTC and e-commerce growth",
            "Personalization and customization",
            "Sustainable and ethical sourcing"
        ],
        common_challenges=[
            "Counterfeit risk",
            "Brand differentiation",
            "Customer loyalty"
        ],
        success_factors=[
            "Strong brand story",
            "Omnichannel retail",
            "Quality and design"
        ],
        market_data={
            "market_size_by_year": [
                {"year": 2020, "value": 4},
                {"year": 2021, "value": 4.5},
                {"year": 2022, "value": 5}
            ],
            "market_share": [
                {"company": "Warby Parker", "value": 20},
                {"company": "Mejuri", "value": 10},
                {"company": "Others", "value": 70}
            ],
            "category_distribution": [
                {"category": "Eyewear", "value": 50},
                {"category": "Jewelry", "value": 30},
                {"category": "Bags", "value": 20}
            ]
        },
        business_plan_template={
            "executive_summary": "A fashion accessories brand delivering high-quality, stylish eyewear, jewelry, and bags through a direct-to-consumer model.",
            "company_description": "Accentuate is a DTC brand offering eyewear, jewelry, and bags with a focus on design, quality, and customer experience. We combine online convenience with retail presence.",
            "market_analysis": {
                "market_size": "$5B+ US accessories market",
                "growth_rate": "6.8% CAGR (2021-2026)",
                "trends": [
                    "DTC and e-commerce growth",
                    "Personalization and customization",
                    "Sustainable and ethical sourcing"
                ],
                "competitors": ["Warby Parker", "Mejuri", "Ray-Ban"],
                "market_share_chart": "market_share",
                "category_distribution_chart": "category_distribution"
            },
            "organization_team": "Founded by designers and retail experts. Team includes product development, marketing, and customer service.",
            "product_service": "Eyewear, jewelry, and bags with a focus on quality, design, and customer experience.",
            "marketing_sales": "Social media marketing, influencer collaborations, retail pop-ups, and loyalty programs.",
            "financials": {
                "revenue_model": "Direct sales, retail partnerships, and limited edition drops.",
                "projections_chart": "market_size_by_year",
                "key_metrics": ["Revenue", "Units sold", "Repeat customers"]
            },
            "funding_request": "Seeking $2M seed funding for product development, marketing, and retail expansion.",
            "appendix": "Design awards, customer testimonials, and retail partner list."
        }
    )
}

def normalize_idea(idea: str) -> str:
    # Lowercase, remove common suffixes, replace spaces/dashes with underscores, and strip
    idea = idea.lower()
    for suffix in [" app", " service", " platform", " marketplace", " brand"]:
        if idea.endswith(suffix):
            idea = idea[: -len(suffix)]
    idea = (
        idea.replace('-', ' ')
            .replace('_', ' ')
            .replace('&', 'and')
            .replace('  ', ' ')
            .strip()
            .replace(' ', '_')
    )
    return idea

def get_business_mapping(business_idea: str) -> Optional[BusinessMapping]:
    """
    Get the business mapping for a given business idea.
    Returns None if no mapping exists.
    Now robust to case, spaces, underscores, dashes, and fuzzy matches.
    """
    normalized_idea = normalize_idea(business_idea)
    # Try exact match first
    if normalized_idea in BUSINESS_MAPPINGS:
        return BUSINESS_MAPPINGS[normalized_idea]
    # Try partial match
    for key in BUSINESS_MAPPINGS.keys():
        if normalized_idea in normalize_idea(key) or normalize_idea(key) in normalized_idea:
            return BUSINESS_MAPPINGS[key]
    # Try fuzzy match (difflib)
    close_matches = difflib.get_close_matches(normalized_idea, BUSINESS_MAPPINGS.keys(), n=1, cutoff=0.7)
    if close_matches:
        return BUSINESS_MAPPINGS[close_matches[0]]
    # Try synonym mapping (common suffixes/variants)
    synonyms = [
        normalized_idea.replace('app', ''),
        normalized_idea.replace('platform', ''),
        normalized_idea.replace('service', ''),
        normalized_idea.replace('marketplace', ''),
        normalized_idea.replace('brand', ''),
    ]
    for syn in synonyms:
        syn = syn.strip('_')
        if syn in BUSINESS_MAPPINGS:
            return BUSINESS_MAPPINGS[syn]
    # Log unmatched idea
    logging.warning(f"No mapping found for business idea: '{business_idea}' (normalized: '{normalized_idea}')")
    # Optionally, return the closest match by similarity
    if BUSINESS_MAPPINGS:
        best_key = max(BUSINESS_MAPPINGS.keys(), key=lambda k: difflib.SequenceMatcher(None, normalized_idea, k).ratio())
        if difflib.SequenceMatcher(None, normalized_idea, best_key).ratio() > 0.5:
            return BUSINESS_MAPPINGS[best_key]
    return None

def get_similar_business_ideas(business_idea: str) -> List[str]:
    """
    Get a list of similar business ideas from our mappings.
    """
    normalized_idea = business_idea.lower().strip()
    similar_ideas = []
    
    for key in BUSINESS_MAPPINGS.keys():
        if key != normalized_idea and (
            key in normalized_idea or 
            normalized_idea in key or
            any(word in key for word in normalized_idea.split())
        ):
            similar_ideas.append(key)
    
    return similar_ideas[:3]  # Return top 3 similar ideas 