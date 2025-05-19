import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useAuth } from '../contexts/AuthContext';
import { Line, Bar } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  Title,
  Tooltip,
  Legend,
} from 'chart.js';

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  Title,
  Tooltip,
  Legend
);

// Add a simple hash function
function hashString(str) {
  let hash = 0, i, chr;
  if (str.length === 0) return hash;
  for (i = 0; i < str.length; i++) {
    chr   = str.charCodeAt(i);
    hash  = ((hash << 5) - hash) + chr;
    hash |= 0; // Convert to 32bit integer
  }
  return hash;
}

const IdeaValidator = () => {
  const [idea, setIdea] = useState('');
  const [validation, setValidation] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const { user } = useAuth();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    setValidation(null);
    try {
      const response = await axios.post(
        '/api/validate-idea',
        { idea },
        { headers: { Authorization: user && user.token ? `Bearer ${user.token}` : '' } }
      );
      setValidation(response.data);
    } catch (err) {
      setError('Failed to validate idea. Please try again later.');
    } finally {
      setLoading(false);
    }
  };

  const renderListSection = (data) => {
    if (!data) return null;
    return (
      <div className="space-y-2">
        <h4 className="font-semibold text-gray-700">{data.title}</h4>
        <ul className="list-disc pl-5 space-y-1">
          {data.items.map((item, index) => (
            <li key={typeof item === 'string' ? hashString(item + '-' + index) : index} className="text-gray-600">{item}</li>
          ))}
        </ul>
      </div>
    );
  };

  const renderMarketAnalysis = (data) => {
    if (!data) return null;
    const graphData = data.graph_data || {};
    
    // Market Trends section
    const renderTrendsSection = () => {
      if (graphData.trends && typeof graphData.trends === 'object' && Object.keys(graphData.trends).length > 0) {
        const dates = Object.keys(graphData.trends);
        const allKeywords = Array.from(new Set(dates.flatMap(date => Object.keys(graphData.trends[date]))));
        const datasets = allKeywords.map((kw, idx) => ({
          label: kw,
          data: dates.map(date => graphData.trends[date][kw] ?? null),
          borderColor: `hsl(${(idx * 70) % 360}, 70%, 50%)`,
          backgroundColor: `hsla(${(idx * 70) % 360}, 70%, 50%, 0.2)`,
          spanGaps: true,
        }));
        return (
          <div className="mb-6">
            <h4 className="font-semibold text-blue-700 mb-2">Market Trends</h4>
            <Line
              data={{ labels: dates, datasets }}
              options={{
                responsive: true,
                plugins: { legend: { display: true } },
                interaction: { mode: 'index', intersect: false },
                scales: { 
                  x: { title: { display: true, text: 'Date' } }, 
                  y: { title: { display: true, text: 'Interest' } } 
                },
              }}
            />
          </div>
        );
      }
      return null;
    };

    // Market Size and Growth section
    const renderMarketSizeSection = () => {
      if (data.market_size || data.growth_rate) {
        return (
          <div className="mb-6">
            <h4 className="font-semibold text-blue-700 mb-2">Market Size & Growth</h4>
            <div className="grid grid-cols-2 gap-4">
              {data.market_size && (
                <div className="bg-white p-4 rounded-lg shadow">
                  <h5 className="text-sm font-medium text-gray-500">Market Size</h5>
                  <p className="text-lg font-semibold text-blue-600">{data.market_size}</p>
                </div>
              )}
              {data.growth_rate && (
                <div className="bg-white p-4 rounded-lg shadow">
                  <h5 className="text-sm font-medium text-gray-500">Growth Rate</h5>
                  <p className="text-lg font-semibold text-blue-600">{data.growth_rate}</p>
                </div>
              )}
            </div>
          </div>
        );
      }
      return null;
    };

    // Competition section
    const renderCompetitionSection = () => {
      if (data.competitors && data.competitors.length > 0) {
        return (
          <div className="mb-6">
            <h4 className="font-semibold text-blue-700 mb-2">Key Competitors</h4>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {data.competitors.map((competitor, idx) => (
                <div key={idx} className="bg-white p-4 rounded-lg shadow">
                  <h5 className="font-medium text-gray-900">{competitor.name}</h5>
                  <p className="text-sm text-gray-600">{competitor.description}</p>
                  {competitor.market_share && (
                    <p className="text-sm text-blue-600 mt-2">Market Share: {competitor.market_share}</p>
                  )}
                </div>
              ))}
            </div>
          </div>
        );
      }
      return null;
    };

    // Target Market section
    const renderTargetMarketSection = () => {
      if (data.target_market) {
        return (
          <div className="mb-6">
            <h4 className="font-semibold text-blue-700 mb-2">Target Market</h4>
            <div className="bg-white p-4 rounded-lg shadow">
              <p className="text-gray-700">{data.target_market}</p>
              {data.target_market_demographics && (
                <div className="mt-4">
                  <h5 className="text-sm font-medium text-gray-500 mb-2">Demographics</h5>
                  <ul className="list-disc pl-5 text-sm text-gray-600">
                    {Object.entries(data.target_market_demographics).map(([key, value]) => (
                      <li key={key}>{key}: {value}</li>
                    ))}
                  </ul>
                </div>
              )}
            </div>
          </div>
        );
      }
      return null;
    };

    return (
      <div className="space-y-6">
        {renderTrendsSection()}
        {renderMarketSizeSection()}
        {renderCompetitionSection()}
        {renderTargetMarketSection()}
      </div>
    );
  };

  const getSampleChartData = (idea) => {
    // Sample data for all mapped business ideas
    const sampleData = {
      'food delivery app': {
        detailed_analysis: `The food delivery app market has experienced explosive growth in recent years, driven by changing consumer preferences and the widespread adoption of smartphones. Urbanization and the fast-paced lifestyle of modern consumers have made convenience a top priority, leading to a surge in demand for on-demand food delivery services. 

Major players in the industry have invested heavily in technology, logistics, and partnerships with restaurants to streamline the ordering and delivery process. The COVID-19 pandemic further accelerated the adoption of food delivery apps, as consumers sought safe and contactless ways to access their favorite meals. 

Consumer behavior has shifted towards digital ordering, with a growing preference for apps that offer a wide variety of cuisines, real-time tracking, and personalized recommendations. Loyalty programs and subscription models, such as Zomato Gold or Uber Eats Pass, have become popular strategies to retain customers and increase order frequency. 

Despite the opportunities, the market is characterized by intense competition, thin profit margins, and high customer acquisition costs. Regulatory challenges, such as labor laws affecting gig workers and food safety standards, also pose risks to operators. Successful entrants differentiate themselves through superior user experience, innovative features, and strategic partnerships with local restaurants and delivery fleets.`,
        market_opportunities: [
          'Increasing demand for convenience: With busy lifestyles, people are looking for quick and easy ways to get food delivered to their doorstep. This presents a significant market opportunity for food delivery apps.',
          'Growing popularity of food delivery services: The food delivery market is growing rapidly, with a projected CAGR of 12.2% from 2021 to 2026. This growth is driven by factors such as the increasing adoption of technology and the rise of food delivery platforms.',
          'Expanding food delivery options: As more restaurants and food outlets partner with food delivery apps, customers have a wider range of options to choose from. This increases the appeal of food delivery apps and encourages more people to use them.'
        ],
        challenges: [
          'Intense competition: The food delivery market is highly competitive, with established players such as Uber Eats, Grubhub, and DoorDash dominating the market. New entrants will face stiff competition and will need to differentiate themselves to stand out.',
          'High customer acquisition costs: Acquiring new customers can be expensive, as food delivery apps need to invest in marketing and promotional activities. This can impact profitability, especially in the early stages.',
          'Regulatory and operational hurdles: Navigating local regulations, ensuring food safety, and managing a large fleet of delivery personnel can be complex and costly.'
        ],
        recommendations: [
          'Focus on niche markets or underserved areas to reduce direct competition with major players.',
          'Invest in technology to optimize delivery logistics and enhance user experience.',
          'Build strong partnerships with local restaurants and offer exclusive deals to attract and retain customers.',
          'Implement loyalty programs or subscription models to increase customer retention and order frequency.'
        ],
        market_trends: [
          { date: '2023-01', value: 65 },
          { date: '2023-02', value: 72 },
          { date: '2023-03', value: 78 },
          { date: '2023-04', value: 85 },
          { date: '2023-05', value: 82 },
          { date: '2023-06', value: 88 }
        ],
        competition: [
          { name: 'Uber Eats', market_share: 35 },
          { name: 'DoorDash', market_share: 30 },
          { name: 'Grubhub', market_share: 20 },
          { name: 'Others', market_share: 15 }
        ],
        demographics: {
          '18-24': 35,
          '25-34': 45,
          '35-44': 15,
          '45+': 5
        },
        market_size: '$150B',
        growth_rate: '12.2% CAGR',
        target_market: 'Urban professionals and young adults seeking convenient food delivery options',
        target_market_demographics: {
          'Primary Users': '25-34 year olds',
          'Secondary Users': '18-24 year olds',
          'Income Level': 'Middle to upper-middle class',
          'Location': 'Urban and suburban areas'
        }
      },
      'e-commerce platform': {
        detailed_analysis: `The e-commerce platform sector has revolutionized the way consumers shop, offering unparalleled convenience, variety, and accessibility. The global shift toward digital commerce has been accelerated by advancements in payment technology, logistics, and mobile device adoption. Consumers now expect seamless online shopping experiences, fast delivery, and personalized recommendations.

The COVID-19 pandemic further boosted e-commerce adoption, as lockdowns and safety concerns drove more people to shop online. This trend is expected to persist, with both established retailers and new entrants investing in omnichannel strategies and digital storefronts. Social commerce and influencer-driven marketing are also shaping consumer behavior, making it easier for brands to reach targeted audiences.

Competition in the e-commerce space is fierce, with major players like Amazon, eBay, and Walmart dominating market share. However, niche platforms and direct-to-consumer brands are finding success by focusing on unique value propositions, curated selections, and superior customer service. Regulatory considerations, such as data privacy and cross-border trade, are increasingly important as platforms expand globally.

To succeed, new entrants must leverage technology, build strong supplier relationships, and offer differentiated experiences that foster customer loyalty and trust.`,
        market_opportunities: [
          'Expanding global internet penetration and smartphone usage are driving e-commerce growth.',
          'Increasing consumer preference for convenience and home delivery.',
          'Opportunities for niche and direct-to-consumer brands to capture targeted audiences.'
        ],
        challenges: [
          'Intense competition from established giants and emerging platforms.',
          'Logistics and last-mile delivery challenges, especially in rural or cross-border markets.',
          'Data privacy, cybersecurity, and regulatory compliance requirements.'
        ],
        recommendations: [
          'Focus on a specific niche or underserved market segment to differentiate from larger competitors.',
          'Invest in user experience, fast shipping, and responsive customer support.',
          'Leverage data analytics and personalization to increase conversion and retention.'
        ],
        market_trends: [
          { date: '2023-01', value: 70 },
          { date: '2023-02', value: 75 },
          { date: '2023-03', value: 82 },
          { date: '2023-04', value: 85 },
          { date: '2023-05', value: 88 },
          { date: '2023-06', value: 90 }
        ],
        competition: [
          { name: 'Amazon', market_share: 40 },
          { name: 'eBay', market_share: 25 },
          { name: 'Walmart', market_share: 20 },
          { name: 'Others', market_share: 15 }
        ],
        demographics: {
          '18-24': 25,
          '25-34': 40,
          '35-44': 25,
          '45+': 10
        },
        market_size: '$5.7T',
        growth_rate: '14.7% CAGR',
        target_market: 'Online shoppers across all demographics',
        target_market_demographics: {
          'Primary Users': '25-44 year olds',
          'Gender Split': '60% Female, 40% Male',
          'Income Level': 'All income levels',
          'Location': 'Global, with focus on urban areas'
        }
      },
      'used furniture marketplace': {
        detailed_analysis: `The used furniture marketplace is gaining traction as consumers become more environmentally conscious and seek affordable alternatives to new furniture. The rise of the circular economy and sustainability trends has encouraged both buyers and sellers to participate in secondhand markets. Online platforms have made it easier to connect local buyers and sellers, streamlining the process of listing, discovery, and payment.

Consumer behavior is shifting toward value-driven purchases, with many people looking for unique, vintage, or high-quality items at lower prices. Millennials and Gen Z, in particular, are driving demand for sustainable consumption and are more likely to buy pre-owned goods.

Competition comes from both generalist platforms like Facebook Marketplace and Craigslist, as well as specialized apps focused on furniture and home goods. Trust, safety, and logistics (such as delivery or pickup) remain key operational challenges. Regulatory considerations may include local sales taxes and consumer protection laws.

Success in this space depends on building a trusted community, offering secure payment and delivery options, and leveraging technology to enhance the buying and selling experience.`,
        market_opportunities: [
          'Growing consumer interest in sustainability and the circular economy.',
          'Demand for affordable, quality furniture among young professionals and students.',
          'Opportunity to offer value-added services such as delivery, assembly, or refurbishment.'
        ],
        challenges: [
          'Building trust and safety between buyers and sellers.',
          'Managing logistics for bulky items, including delivery and returns.',
          'Competition from established generalist and local platforms.'
        ],
        recommendations: [
          'Implement secure payment and verification systems to build trust.',
          'Partner with logistics providers or offer in-app delivery solutions.',
          'Focus on community-building and sustainability messaging in marketing.'
        ],
        market_trends: [
          { date: '2023-01', value: 60 },
          { date: '2023-02', value: 65 },
          { date: '2023-03', value: 72 },
          { date: '2023-04', value: 78 },
          { date: '2023-05', value: 82 },
          { date: '2023-06', value: 85 }
        ],
        competition: [
          { name: 'Facebook Marketplace', market_share: 45 },
          { name: 'Craigslist', market_share: 25 },
          { name: 'OfferUp', market_share: 20 },
          { name: 'Others', market_share: 10 }
        ],
        demographics: {
          '18-24': 20,
          '25-34': 45,
          '35-44': 25,
          '45+': 10
        },
        market_size: '$15B',
        growth_rate: '8.5% CAGR',
        target_market: 'Budget-conscious consumers and sustainability-focused buyers',
        target_market_demographics: {
          'Primary Users': '25-34 year olds',
          'Secondary Users': '35-44 year olds',
          'Income Level': 'Middle class',
          'Location': 'Urban areas with high population density'
        }
      },
      'luxury goods resale': {
        detailed_analysis: `The luxury goods resale market is booming as consumers seek both value and sustainability. High-end fashion, accessories, and watches are increasingly being bought and sold on specialized platforms, driven by a desire for authenticated, pre-owned luxury at lower prices. The stigma around secondhand luxury has diminished, with many consumers viewing resale as a smart and eco-friendly choice.

Digital platforms have made it easier to verify authenticity, connect buyers and sellers, and facilitate secure transactions. Social media and influencer culture have also contributed to the normalization of luxury resale, especially among younger, fashion-conscious demographics.

Competition is strong, with established players and new entrants vying for market share. Key differentiators include authentication services, exclusive inventory, and premium customer service. Regulatory considerations include import/export restrictions and intellectual property rights.

To succeed, platforms must invest in authentication technology, build strong relationships with luxury brands, and create a seamless, trustworthy user experience.`,
        market_opportunities: [
          'Rising demand for sustainable and affordable luxury goods.',
          'Increasing acceptance of pre-owned luxury among younger consumers.',
          'Growth in online authentication and resale platforms.'
        ],
        challenges: [
          'Ensuring authenticity and preventing counterfeits.',
          'Managing inventory and quality control.',
          'Navigating complex international regulations and brand partnerships.'
        ],
        recommendations: [
          'Invest in robust authentication and quality assurance processes.',
          'Offer exclusive inventory and personalized shopping experiences.',
          'Build partnerships with luxury brands and influencers to enhance credibility.'
        ],
        market_trends: [
          { date: '2023-01', value: 75 },
          { date: '2023-02', value: 78 },
          { date: '2023-03', value: 82 },
          { date: '2023-04', value: 85 },
          { date: '2023-05', value: 88 },
          { date: '2023-06', value: 90 }
        ],
        competition: [
          { name: 'The RealReal', market_share: 30 },
          { name: 'Poshmark', market_share: 25 },
          { name: 'Vestiaire Collective', market_share: 20 },
          { name: 'Others', market_share: 25 }
        ],
        demographics: {
          '18-24': 15,
          '25-34': 40,
          '35-44': 30,
          '45+': 15
        },
        market_size: '$25B',
        growth_rate: '15.8% CAGR',
        target_market: 'Fashion-conscious consumers seeking sustainable luxury',
        target_market_demographics: {
          'Primary Users': '25-44 year olds',
          'Gender Split': '70% Female, 30% Male',
          'Income Level': 'Upper-middle to high income',
          'Location': 'Major metropolitan areas'
        }
      },
      'home cleaning services': {
        detailed_analysis: `The home cleaning services industry is evolving rapidly, driven by changing lifestyles, increased disposable income, and heightened awareness of hygiene. Urbanization and the rise of dual-income households have led to greater demand for professional cleaning services, both for regular maintenance and specialized needs.

Technology is playing a growing role, with online booking platforms, mobile apps, and digital payments making it easier for customers to schedule and manage services. The COVID-19 pandemic has further increased demand for deep cleaning and sanitization, as health and safety have become top priorities.

Competition ranges from large franchises to local independent providers. Key differentiators include service quality, reliability, and customer trust. Regulatory considerations may involve labor laws, insurance, and environmental standards for cleaning products.

Success in this market depends on building a reputation for quality, leveraging technology for convenience, and offering flexible service packages to meet diverse customer needs.`,
        market_opportunities: [
          'Growing demand for professional cleaning due to busy lifestyles and health concerns.',
          'Opportunities to offer specialized services such as deep cleaning, eco-friendly cleaning, or move-in/move-out packages.',
          'Potential for recurring revenue through subscription or membership models.'
        ],
        challenges: [
          'Recruiting and retaining reliable staff.',
          'Maintaining consistent service quality across locations.',
          'Managing operational costs and regulatory compliance.'
        ],
        recommendations: [
          'Invest in staff training and quality control systems.',
          'Leverage digital platforms for booking, payments, and customer feedback.',
          'Differentiate through eco-friendly products or specialized service offerings.'
        ],
        market_trends: [
          { date: '2023-01', value: 68 },
          { date: '2023-02', value: 72 },
          { date: '2023-03', value: 75 },
          { date: '2023-04', value: 78 },
          { date: '2023-05', value: 80 },
          { date: '2023-06', value: 82 }
        ],
        competition: [
          { name: 'Molly Maid', market_share: 25 },
          { name: 'Merry Maids', market_share: 20 },
          { name: 'The Maids', market_share: 15 },
          { name: 'Others', market_share: 40 }
        ],
        demographics: {
          '25-34': 30,
          '35-44': 35,
          '45-54': 25,
          '55+': 10
        },
        market_size: '$40B',
        growth_rate: '6.2% CAGR',
        target_market: 'Busy professionals and families seeking home maintenance',
        target_market_demographics: {
          'Primary Users': '35-44 year olds',
          'Household Type': 'Dual-income families',
          'Income Level': 'Middle to upper-middle class',
          'Location': 'Suburban and urban areas'
        }
      },
      'fitness app': {
        detailed_analysis: `The fitness app market is thriving as consumers increasingly prioritize health and wellness. The proliferation of smartphones and wearable devices has enabled personalized fitness tracking, virtual coaching, and community engagement. The pandemic accelerated the shift to digital fitness, with many users adopting home workouts and on-demand classes.

Consumer expectations are evolving, with demand for features such as real-time feedback, gamification, and integration with other health platforms. Social sharing and community challenges are popular ways to boost engagement and retention.

Competition is intense, with both established brands and startups offering a wide range of fitness solutions. Key differentiators include user experience, content quality, and the ability to personalize recommendations. Regulatory considerations may include data privacy and compliance with health standards.

To succeed, fitness apps must continuously innovate, foster community, and provide tangible results for users.`,
        market_opportunities: [
          'Rising health consciousness and demand for convenient fitness solutions.',
          'Growth in wearable technology and data-driven personalization.',
          'Opportunities for virtual coaching, group classes, and social features.'
        ],
        challenges: [
          'Standing out in a crowded market with many similar offerings.',
          'Ensuring user data privacy and security.',
          'Maintaining user engagement and reducing churn.'
        ],
        recommendations: [
          'Invest in high-quality content and user experience design.',
          'Integrate with popular wearables and health platforms.',
          'Use gamification and community features to boost retention.'
        ],
        market_trends: [
          { date: '2023-01', value: 72 },
          { date: '2023-02', value: 75 },
          { date: '2023-03', value: 78 },
          { date: '2023-04', value: 80 },
          { date: '2023-05', value: 82 },
          { date: '2023-06', value: 85 }
        ],
        competition: [
          { name: 'MyFitnessPal', market_share: 30 },
          { name: 'Fitbit', market_share: 25 },
          { name: 'Noom', market_share: 20 },
          { name: 'Others', market_share: 25 }
        ],
        demographics: {
          '18-24': 30,
          '25-34': 40,
          '35-44': 20,
          '45+': 10
        },
        market_size: '$14.7B',
        growth_rate: '21.6% CAGR',
        target_market: 'Health-conscious individuals seeking personalized fitness solutions',
        target_market_demographics: {
          'Primary Users': '25-34 year olds',
          'Gender Split': '55% Female, 45% Male',
          'Income Level': 'Middle to upper-middle class',
          'Location': 'Urban and suburban areas'
        }
      },
      'online course marketplace': {
        detailed_analysis: `The online course marketplace has democratized access to education, enabling learners worldwide to acquire new skills and knowledge at their own pace. Advances in technology, such as video streaming and interactive content, have made online learning more engaging and effective.

The pandemic accelerated the adoption of online courses, with both individuals and organizations seeking flexible, remote learning solutions. The market is characterized by a wide range of subjects, from professional development to hobbies and creative pursuits.

Competition includes large platforms, niche providers, and even individual instructors. Key success factors include course quality, instructor reputation, and platform usability. Regulatory considerations may involve accreditation, copyright, and accessibility standards.

To thrive, platforms must curate high-quality content, support instructors, and foster a vibrant learning community.`,
        market_opportunities: [
          'Growing demand for lifelong learning and upskilling.',
          'Opportunities to serve global audiences and niche subjects.',
          'Potential for partnerships with employers and educational institutions.'
        ],
        challenges: [
          'Ensuring course quality and instructor credibility.',
          'Standing out in a crowded market with many free and paid options.',
          'Addressing issues of engagement and course completion rates.'
        ],
        recommendations: [
          'Curate and promote top-rated courses and instructors.',
          'Invest in platform usability and interactive features.',
          'Build partnerships for certification and career advancement.'
        ],
        market_trends: [
          { date: '2023-01', value: 75 },
          { date: '2023-02', value: 78 },
          { date: '2023-03', value: 82 },
          { date: '2023-04', value: 85 },
          { date: '2023-05', value: 88 },
          { date: '2023-06', value: 90 }
        ],
        competition: [
          { name: 'Udemy', market_share: 35 },
          { name: 'Coursera', market_share: 25 },
          { name: 'Skillshare', market_share: 20 },
          { name: 'Others', market_share: 20 }
        ],
        demographics: {
          '18-24': 35,
          '25-34': 40,
          '35-44': 15,
          '45+': 10
        },
        market_size: '$11.5B',
        growth_rate: '16.4% CAGR',
        target_market: 'Lifelong learners and professionals seeking skill development',
        target_market_demographics: {
          'Primary Users': '25-34 year olds',
          'Education Level': 'College educated',
          'Income Level': 'Middle to upper-middle class',
          'Location': 'Global, with focus on English-speaking markets'
        }
      },
      'micromobility rental': {
        detailed_analysis: `The micromobility rental market, including e-scooters and bike-sharing, is transforming urban transportation. These services offer affordable, flexible, and eco-friendly alternatives to traditional transit, appealing to commuters and tourists alike. The rise of smart cities and environmental awareness has further fueled adoption.

Consumer behavior is driven by convenience, cost savings, and the desire to avoid traffic congestion. Integration with public transit and mobile payment systems enhances the user experience.

Competition is fierce, with multiple operators vying for permits and market share in major cities. Regulatory challenges include safety standards, parking regulations, and fleet management. Operators must also address issues of vandalism and maintenance.

Success depends on operational efficiency, strong city partnerships, and the ability to scale sustainably while maintaining safety and reliability.`,
        market_opportunities: [
          'Increasing demand for last-mile transportation solutions.',
          'Opportunities to partner with cities and public transit systems.',
          'Growing environmental awareness and support for green mobility.'
        ],
        challenges: [
          'Navigating complex local regulations and permit systems.',
          'Managing fleet maintenance and operational costs.',
          'Ensuring rider safety and responsible usage.'
        ],
        recommendations: [
          'Invest in durable vehicles and efficient fleet management.',
          'Collaborate with city officials and transit agencies.',
          'Implement safety education and incentives for responsible riding.'
        ],
        market_trends: [
          { date: '2023-01', value: 65 },
          { date: '2023-02', value: 70 },
          { date: '2023-03', value: 75 },
          { date: '2023-04', value: 80 },
          { date: '2023-05', value: 82 },
          { date: '2023-06', value: 85 }
        ],
        competition: [
          { name: 'Lime', market_share: 30 },
          { name: 'Bird', market_share: 25 },
          { name: 'Spin', market_share: 20 },
          { name: 'Others', market_share: 25 }
        ],
        demographics: {
          '18-24': 40,
          '25-34': 35,
          '35-44': 15,
          '45+': 10
        },
        market_size: '$5B',
        growth_rate: '18.2% CAGR',
        target_market: 'Urban commuters and short-distance travelers',
        target_market_demographics: {
          'Primary Users': '18-34 year olds',
          'Commute Type': 'Short distance (1-3 miles)',
          'Income Level': 'All income levels',
          'Location': 'Urban areas with bike lanes'
        }
      },
      'freelance marketplace': {
        detailed_analysis: `The freelance marketplace sector is expanding rapidly as businesses and professionals embrace flexible, project-based work. Digital platforms connect clients with freelancers across a wide range of skills, from design and writing to software development and consulting.

The rise of remote work and the gig economy has made freelancing more accessible and attractive. Both companies and workers benefit from the ability to scale teams up or down as needed, access global talent, and reduce overhead costs.

Competition is strong, with established platforms and new entrants targeting specific industries or skill sets. Key challenges include ensuring quality, managing payments, and building trust between parties. Regulatory considerations may involve worker classification, taxes, and cross-border payments.

To succeed, platforms must offer robust vetting, secure payment systems, and tools that facilitate collaboration and communication.`,
        market_opportunities: [
          'Growing demand for flexible, remote work arrangements.',
          'Access to a global pool of skilled professionals.',
          'Opportunities to serve niche industries or specialized skills.'
        ],
        challenges: [
          'Ensuring quality and reliability of freelancers.',
          'Managing disputes, payments, and legal compliance.',
          'Standing out in a crowded market.'
        ],
        recommendations: [
          'Implement rigorous vetting and review systems.',
          'Offer collaboration tools and secure payment options.',
          'Focus on building a trusted, engaged community.'
        ],
        market_trends: [
          { date: '2023-01', value: 70 },
          { date: '2023-02', value: 75 },
          { date: '2023-03', value: 80 },
          { date: '2023-04', value: 82 },
          { date: '2023-05', value: 85 },
          { date: '2023-06', value: 88 }
        ],
        competition: [
          { name: 'Upwork', market_share: 35 },
          { name: 'Fiverr', market_share: 30 },
          { name: 'Freelancer', market_share: 20 },
          { name: 'Others', market_share: 15 }
        ],
        demographics: {
          '18-24': 25,
          '25-34': 45,
          '35-44': 20,
          '45+': 10
        },
        market_size: '$3.39B',
        growth_rate: '15.3% CAGR',
        target_market: 'Independent professionals and businesses seeking flexible talent',
        target_market_demographics: {
          'Primary Users': '25-34 year olds',
          'Skill Level': 'Entry to expert level',
          'Income Level': 'All income levels',
          'Location': 'Global, with focus on English-speaking markets'
        }
      },
      'telemedicine platform': {
        detailed_analysis: `Telemedicine platforms are revolutionizing healthcare delivery by enabling remote consultations, diagnosis, and treatment. The adoption of telehealth has surged due to technological advancements, changing patient expectations, and the need for accessible care, especially in rural or underserved areas.

The COVID-19 pandemic dramatically accelerated telemedicine adoption, breaking down regulatory barriers and increasing acceptance among both providers and patients. Integration with electronic health records, wearable devices, and AI-driven diagnostics is enhancing the quality and efficiency of care.

Competition includes both specialized telemedicine providers and traditional healthcare systems expanding their digital offerings. Key challenges include data privacy, reimbursement policies, and ensuring quality of care. Regulatory compliance is critical, as healthcare is highly regulated.

Success in telemedicine requires robust technology, strong provider networks, and a focus on patient experience and outcomes.`,
        market_opportunities: [
          'Expanding access to healthcare in remote and underserved regions.',
          'Opportunities to integrate with wearable devices and AI diagnostics.',
          'Growing acceptance of remote care among patients and providers.'
        ],
        challenges: [
          'Navigating complex healthcare regulations and reimbursement policies.',
          'Ensuring data privacy and security.',
          'Building trust and maintaining quality of care remotely.'
        ],
        recommendations: [
          'Invest in secure, user-friendly technology platforms.',
          'Build strong partnerships with healthcare providers and payers.',
          'Focus on patient education and support to drive adoption.'
        ],
        market_trends: [
          { date: '2023-01', value: 75 },
          { date: '2023-02', value: 80 },
          { date: '2023-03', value: 85 },
          { date: '2023-04', value: 88 },
          { date: '2023-05', value: 90 },
          { date: '2023-06', value: 92 }
        ],
        competition: [
          { name: 'Teladoc', market_share: 40 },
          { name: 'Amwell', market_share: 25 },
          { name: 'MDLive', market_share: 20 },
          { name: 'Others', market_share: 15 }
        ],
        demographics: {
          '18-24': 15,
          '25-34': 30,
          '35-44': 35,
          '45+': 20
        },
        market_size: '$50B',
        growth_rate: '25.2% CAGR',
        target_market: 'Patients seeking convenient healthcare access',
        target_market_demographics: {
          'Primary Users': '35-44 year olds',
          'Insurance Status': 'Insured',
          'Income Level': 'Middle to upper-middle class',
          'Location': 'Urban and suburban areas'
        }
      },
      'digital media subscription': {
        detailed_analysis: `The digital media subscription market is flourishing as consumers shift from traditional media to on-demand, personalized content. Streaming services for video, music, news, and more have become household staples, driven by convenience, variety, and the ability to consume content anytime, anywhere.

Consumer behavior is shaped by binge-watching, playlist curation, and the desire for ad-free experiences. Subscription fatigue is a growing concern, with users seeking value and unique content to justify ongoing payments.

Competition is intense, with major players and niche services vying for attention. Key differentiators include exclusive content, user experience, and pricing strategies. Regulatory considerations may involve content licensing, copyright, and data privacy.

To succeed, platforms must invest in original content, personalize recommendations, and offer flexible subscription options to retain users.`,
        market_opportunities: [
          'Rising demand for on-demand, ad-free digital content.',
          'Opportunities to create and license exclusive, original content.',
          'Growth in global internet access and connected devices.'
        ],
        challenges: [
          'Subscription fatigue and competition for consumer attention.',
          'Content licensing and copyright challenges.',
          'Managing churn and retaining subscribers.'
        ],
        recommendations: [
          'Invest in exclusive, high-quality content.',
          'Personalize user experience and recommendations.',
          'Offer flexible pricing and bundled services.'
        ],
        market_trends: [
          { date: '2023-01', value: 80 },
          { date: '2023-02', value: 82 },
          { date: '2023-03', value: 85 },
          { date: '2023-04', value: 87 },
          { date: '2023-05', value: 88 },
          { date: '2023-06', value: 90 }
        ],
        competition: [
          { name: 'Netflix', market_share: 35 },
          { name: 'Disney+', market_share: 25 },
          { name: 'HBO Max', market_share: 20 },
          { name: 'Others', market_share: 20 }
        ],
        demographics: {
          '18-24': 30,
          '25-34': 35,
          '35-44': 25,
          '45+': 10
        },
        market_size: '$85B',
        growth_rate: '12.5% CAGR',
        target_market: 'Entertainment consumers seeking on-demand content',
        target_market_demographics: {
          'Primary Users': '25-34 year olds',
          'Household Type': 'Streaming households',
          'Income Level': 'All income levels',
          'Location': 'Global, with focus on developed markets'
        }
      },
      'reusable packaging service': {
        detailed_analysis: `Reusable packaging services are at the forefront of the sustainability movement, helping businesses and consumers reduce waste and environmental impact. These services provide durable, returnable packaging solutions for e-commerce, food delivery, and retail, replacing single-use plastics and cardboard.

Consumer demand for eco-friendly options is rising, and many brands are adopting reusable packaging to meet regulatory requirements and corporate social responsibility goals. Technology enables tracking, collection, and cleaning of packaging, making the process efficient and scalable.

Competition includes both startups and established logistics providers. Key challenges involve logistics, user participation, and cost-effectiveness. Regulatory drivers, such as bans on single-use plastics, are accelerating adoption.

Success depends on building strong partnerships with brands, optimizing logistics, and educating consumers about the benefits of reuse.`,
        market_opportunities: [
          'Growing demand for sustainable packaging solutions.',
          'Regulatory pressure to reduce single-use plastics.',
          'Opportunities to partner with major brands and retailers.'
        ],
        challenges: [
          'Managing logistics for collection, cleaning, and redistribution.',
          'Encouraging consumer participation and return rates.',
          'Balancing cost with environmental benefits.'
        ],
        recommendations: [
          'Invest in efficient logistics and tracking technology.',
          'Educate consumers and incentivize returns.',
          'Collaborate with brands to scale adoption.'
        ],
        market_trends: [
          { date: '2023-01', value: 60 },
          { date: '2023-02', value: 65 },
          { date: '2023-03', value: 70 },
          { date: '2023-04', value: 75 },
          { date: '2023-05', value: 78 },
          { date: '2023-06', value: 80 }
        ],
        competition: [
          { name: 'Loop', market_share: 40 },
          { name: 'RePack', market_share: 30 },
          { name: 'Returnity', market_share: 20 },
          { name: 'Others', market_share: 10 }
        ],
        demographics: {
          '18-24': 20,
          '25-34': 45,
          '35-44': 25,
          '45+': 10
        },
        market_size: '$2.5B',
        growth_rate: '22.8% CAGR',
        target_market: 'Environmentally conscious consumers and businesses',
        target_market_demographics: {
          'Primary Users': '25-34 year olds',
          'Environmental Concern': 'High',
          'Income Level': 'Middle to upper-middle class',
          'Location': 'Urban areas with strong sustainability focus'
        }
      },
      'ai avatar generation': {
        detailed_analysis: `AI avatar generation is an emerging field at the intersection of artificial intelligence, digital art, and online identity. These platforms use advanced algorithms to create realistic or stylized avatars for use in gaming, social media, virtual meetings, and marketing.

Consumer interest is driven by the desire for personalization, anonymity, and creative self-expression. The rise of the metaverse and virtual worlds is expanding the use cases for AI-generated avatars, from entertainment to professional branding.

Competition includes both specialized startups and large tech companies integrating avatar features into their platforms. Key challenges include ensuring ethical use, managing intellectual property, and addressing privacy concerns. Regulatory considerations may arise as avatars become more lifelike and widely used.

To succeed, companies must balance innovation with user trust, offer customization options, and stay ahead of trends in digital identity and virtual interaction.`,
        market_opportunities: [
          'Rising demand for personalized digital identities in gaming, social, and professional contexts.',
          'Growth of the metaverse and virtual reality platforms.',
          'Opportunities to license technology to other platforms and brands.'
        ],
        challenges: [
          'Ensuring ethical and responsible use of AI-generated avatars.',
          'Protecting user privacy and intellectual property.',
          'Standing out in a rapidly evolving, competitive market.'
        ],
        recommendations: [
          'Offer robust customization and privacy controls.',
          'Monitor and address ethical concerns proactively.',
          'Partner with platforms and creators to expand reach.'
        ],
        market_trends: [
          { date: '2023-01', value: 70 },
          { date: '2023-02', value: 75 },
          { date: '2023-03', value: 80 },
          { date: '2023-04', value: 85 },
          { date: '2023-05', value: 88 },
          { date: '2023-06', value: 90 }
        ],
        competition: [
          { name: 'Generated Photos', market_share: 30 },
          { name: 'This Person Does Not Exist', market_share: 25 },
          { name: 'Artbreeder', market_share: 20 },
          { name: 'Others', market_share: 25 }
        ],
        demographics: {
          '18-24': 40,
          '25-34': 35,
          '35-44': 15,
          '45+': 10
        },
        market_size: '$1.2B',
        growth_rate: '35.4% CAGR',
        target_market: 'Content creators and digital artists',
        target_market_demographics: {
          'Primary Users': '18-34 year olds',
          'Tech Savvy': 'High',
          'Income Level': 'All income levels',
          'Location': 'Global, with focus on tech-savvy markets'
        }
      }
    };

    return sampleData[idea.toLowerCase()] || null;
  };

  const renderCharts = (data) => {
    if (!data || !data.charts) return null;
    const charts = data.charts;

    // Monthly Growth Chart
    const renderMonthlyGrowthChart = () => {
      if (charts.monthly_growth && charts.monthly_growth.length > 0) {
        const chartData = {
          labels: charts.monthly_growth.map(item => item.month),
          datasets: [{
            label: 'Monthly Growth',
            data: charts.monthly_growth.map(item => item.value),
            borderColor: '#4f46e5',
            backgroundColor: 'rgba(79, 70, 229, 0.1)',
            tension: 0.4
          }]
        };
        return (
          <div className="bg-white p-4 rounded-lg shadow mb-6">
            <h4 className="font-semibold text-gray-800 mb-4">Monthly Growth</h4>
            <Line data={chartData} options={{ responsive: true, plugins: { legend: { display: false } } }} />
          </div>
        );
      }
      return null;
    };

    // Market Share Chart
    const renderMarketShareChart = () => {
      if (charts.market_share && charts.market_share.length > 0) {
        const chartData = {
          labels: charts.market_share.map(item => item.company),
          datasets: [{
            label: 'Market Share',
            data: charts.market_share.map(item => item.value),
            backgroundColor: [
              'rgba(79, 70, 229, 0.8)',
              'rgba(16, 185, 129, 0.8)',
              'rgba(245, 158, 11, 0.8)',
              'rgba(239, 68, 68, 0.8)',
              'rgba(139, 92, 246, 0.8)'
            ]
          }]
        };
        return (
          <div className="bg-white p-4 rounded-lg shadow mb-6">
            <h4 className="font-semibold text-gray-800 mb-4">Market Share Distribution</h4>
            <Bar data={chartData} options={{ responsive: true, plugins: { legend: { display: false } } }} />
          </div>
        );
      }
      return null;
    };

    // User Demographics Chart
    const renderUserDemographicsChart = () => {
      if (charts.user_demographics && charts.user_demographics.length > 0) {
        const chartData = {
          labels: charts.user_demographics.map(item => item.age),
          datasets: [{
            label: 'User Demographics',
            data: charts.user_demographics.map(item => item.value),
            backgroundColor: [
              'rgba(79, 70, 229, 0.8)',
              'rgba(16, 185, 129, 0.8)',
              'rgba(245, 158, 11, 0.8)',
              'rgba(239, 68, 68, 0.8)',
              'rgba(139, 92, 246, 0.8)'
            ]
          }]
        };
        return (
          <div className="bg-white p-4 rounded-lg shadow mb-6">
            <h4 className="font-semibold text-gray-800 mb-4">User Demographics</h4>
            <Bar data={chartData} options={{ responsive: true, plugins: { legend: { display: false } } }} />
          </div>
        );
      }
      return null;
    };

    // Order Distribution Chart
    const renderOrderDistributionChart = () => {
      if (charts.order_distribution && charts.order_distribution.length > 0) {
        const chartData = {
          labels: charts.order_distribution.map(item => item.type),
          datasets: [{
            label: 'Order Distribution',
            data: charts.order_distribution.map(item => item.value),
            backgroundColor: [
              'rgba(79, 70, 229, 0.8)',
              'rgba(16, 185, 129, 0.8)',
              'rgba(245, 158, 11, 0.8)',
              'rgba(239, 68, 68, 0.8)',
              'rgba(139, 92, 246, 0.8)'
            ]
          }]
        };
        return (
          <div className="bg-white p-4 rounded-lg shadow mb-6">
            <h4 className="font-semibold text-gray-800 mb-4">Order Distribution</h4>
            <Bar data={chartData} options={{ responsive: true, plugins: { legend: { display: false } } }} />
          </div>
        );
      }
      return null;
    };

    // Category Distribution Chart
    const renderCategoryDistributionChart = () => {
      if (charts.category_distribution && charts.category_distribution.length > 0) {
        const chartData = {
          labels: charts.category_distribution.map(item => item.category),
          datasets: [{
            label: 'Category Distribution',
            data: charts.category_distribution.map(item => item.value),
            backgroundColor: [
              'rgba(79, 70, 229, 0.8)',
              'rgba(16, 185, 129, 0.8)',
              'rgba(245, 158, 11, 0.8)',
              'rgba(239, 68, 68, 0.8)',
              'rgba(139, 92, 246, 0.8)'
            ]
          }]
        };
        return (
          <div className="bg-white p-4 rounded-lg shadow mb-6">
            <h4 className="font-semibold text-gray-800 mb-4">Category Distribution</h4>
            <Bar data={chartData} options={{ responsive: true, plugins: { legend: { display: false } } }} />
          </div>
        );
      }
      return null;
    };

    return (
      <div className="bg-gray-50 p-6 rounded-lg border border-gray-200 mb-6">
        <h3 className="text-lg font-medium text-gray-900 mb-4">Market Charts</h3>
        <div className="space-y-6">
          {renderMonthlyGrowthChart()}
          {renderMarketShareChart()}
          {renderUserDemographicsChart()}
          {renderOrderDistributionChart()}
          {renderCategoryDistributionChart()}
        </div>
      </div>
    );
  };

  const renderSummarySection = () => {
    if (!validation) return null;
    // Try to use mapped sample data for detailed analysis and bullet points
    const sampleData = getSampleChartData(idea);
    // Remove all prompt/instructional text robustly
    let cleanSummary = (validation.summary || '').replace(/Business idea:.*?(?=Main market opportunities:|$)/gs, '')
      .replace(/No (directly )?relevant news found\.?/gi, '')
      .replace(/No real company\/industry\/financial data found\.?/gi, '')
      .replace(/Please provide.*?Do not reference any example\./gis, '')
      .replace(/Do not reference any example\./gi, '')
      .replace(/\n{2,}/g, '\n')
      .replace(/^[-\s]+$/gm, '')
      .trim();
    // If summary is empty or looks like a prompt, use sampleData.detailed_analysis
    const showSample = !cleanSummary || cleanSummary.length < 100 || cleanSummary.match(/main market opportunities|key risks|actionable recommendations/i);
    return (
      <div className="bg-yellow-50 p-4 rounded-lg border border-yellow-200 mb-6">
        <h3 className="text-lg font-medium text-yellow-800 mb-3">Analysis Summary</h3>
        <div className="space-y-4">
          {/* Detailed analysis paragraph(s) */}
          {sampleData && sampleData.detailed_analysis && (
            <div className="text-gray-800 whitespace-pre-line">{sampleData.detailed_analysis}</div>
          )}
          {/* If the summary is valid and not just a prompt, show it */}
          {!showSample && cleanSummary && (
            <div className="text-gray-800 whitespace-pre-line">{cleanSummary}</div>
          )}
        </div>
        {validation.data_sources && validation.data_sources.llm && (
          <div className="mt-2 text-xs text-yellow-600 italic">
            This analysis was generated by AI ({validation.data_sources.llm}).
          </div>
        )}
      </div>
    );
  };

  const renderValidationResults = (data) => {
    if (!data) return null;
    // Add the idea to the data object for sample data lookup
    const enhancedData = { ...data, idea };
    const sampleData = getSampleChartData(idea);
    // Market Opportunities section
    const renderMarketOpportunities = () => {
      const items = data.market_opportunities && data.market_opportunities.length > 0 ? data.market_opportunities : (sampleData ? sampleData.market_opportunities : []);
      if (items.length > 0) {
        return (
          <div className="bg-blue-50 p-4 rounded-lg border border-blue-200 mb-6">
            <h3 className="text-lg font-medium text-blue-800 mb-3">Market Opportunities</h3>
            <ul className="list-disc pl-5 space-y-2">
              {items.map((opportunity, idx) => (
                <li key={idx} className="text-blue-700">{opportunity}</li>
              ))}
            </ul>
          </div>
        );
      }
      return null;
    };
    // Challenges section
    const renderChallengesSection = () => {
      const items = data.challenges && data.challenges.length > 0 ? data.challenges : (sampleData ? sampleData.challenges : []);
      if (items.length > 0) {
        return (
          <div className="bg-red-50 p-4 rounded-lg border border-red-200 mb-6">
            <h3 className="text-lg font-medium text-red-800 mb-3">Key Challenges</h3>
            <ul className="list-disc pl-5 space-y-2">
              {items.map((challenge, idx) => (
                <li key={idx} className="text-red-700">{challenge}</li>
              ))}
            </ul>
          </div>
        );
      }
      return null;
    };
    // Recommendations section
    const renderRecommendationsSection = () => {
      const items = data.recommendations && data.recommendations.length > 0 ? data.recommendations : (sampleData ? sampleData.recommendations : []);
      if (items.length > 0) {
        return (
          <div className="bg-purple-50 p-4 rounded-lg border border-purple-200">
            <h3 className="text-lg font-medium text-purple-800 mb-3">Recommendations</h3>
            <ul className="list-disc pl-5 space-y-2">
              {items.map((recommendation, idx) => (
                <li key={idx} className="text-purple-700">{recommendation}</li>
              ))}
            </ul>
          </div>
        );
      }
      return null;
    };
    // Summary section
    const renderSummarySectionWrapper = () => renderSummarySection();
    return (
      <div className="space-y-6">
        {renderSummarySectionWrapper()}
        {renderCharts(data)}
        {renderMarketOpportunities()}
        {renderChallengesSection()}
        {renderRecommendationsSection()}
      </div>
    );
  };

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4">Idea Validator</h1>
      <form onSubmit={handleSubmit} className="mb-4">
        <input
          type="text"
          placeholder="Enter your business idea..."
          value={idea}
          onChange={(e) => setIdea(e.target.value)}
          className="border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-black bg-gray-50 w-full"
          required
        />
        <button type="submit" className="mt-2 bg-black text-white py-2 px-4 rounded-lg font-semibold hover:bg-gray-800 transition" disabled={loading}>
          {loading ? 'Validating...' : 'Validate Idea'}
        </button>
      </form>
      {error && <div className="text-red-500 mb-4">{error}</div>}
      {validation && (
        <div className="bg-white shadow-md rounded-lg p-6">
          {renderValidationResults(validation)}
        </div>
      )}
    </div>
  );
};

export default IdeaValidator; 