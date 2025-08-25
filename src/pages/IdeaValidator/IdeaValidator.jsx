import React, { useState, useRef, useEffect } from 'react';
import axios from 'axios';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  ArcElement,
  Title,
  Tooltip,
  Legend,
} from 'chart.js';
import { Line, Bar, Doughnut } from 'react-chartjs-2';

// Register ChartJS components
ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  ArcElement,
  Title,
  Tooltip,
  Legend
);

const IdeaValidator = () => {
  const [idea, setIdea] = useState('');
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState(null);
  const [error, setError] = useState(null);

  // Add refs for charts
  const lineChartRef = useRef(null);
  const barChartRef = useRef(null);
  const doughnutChartRef = useRef(null);

  // Cleanup charts on unmount
  useEffect(() => {
    return () => {
      if (lineChartRef.current) {
        lineChartRef.current.destroy();
      }
      if (barChartRef.current) {
        barChartRef.current.destroy();
      }
      if (doughnutChartRef.current) {
        doughnutChartRef.current.destroy();
      }
    };
  }, []);

  const validateIdea = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    setResult(null);

    try {
      const response = await axios.post('/api/validate-idea', 
        { idea },
        {
          headers: {
            'Content-Type': 'application/json'
          }
        }
      );
      
      const transformedResult = {
        validation: {
          potential: response.data.score,
          trend: response.data.trend,
          regions: response.data.regions,
          recommendations: response.data.recommendations
        },
        detailed_analysis: response.data.detailed_analysis
      };
      
      setResult(transformedResult);
    } catch (err) {
      console.error('Error details:', err);
      setError('Failed to validate idea');
    } finally {
      setLoading(false);
    }
  };

  const renderTrendChart = () => {
    if (!result?.validation?.trend) return null;

    const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun'];
    
    const data = {
      labels: months,
      datasets: [
        {
          label: 'Market Interest Over Time',
          data: result.validation.trend,
          borderColor: '#1a237e',
          backgroundColor: 'rgba(26, 35, 126, 0.1)',
          fill: true,
        },
      ],
    };

    const options = {
      responsive: true,
      plugins: {
        legend: {
          position: 'top',
        },
        title: {
          display: true,
          text: 'Market Interest Trends (Last 6 Months)',
          font: {
            size: 16,
            weight: 'bold'
          }
        },
        tooltip: {
          callbacks: {
            label: (context) => `Interest Level: ${context.raw}%`
          }
        }
      },
      scales: {
        y: {
          beginAtZero: true,
          max: 100,
          title: {
            display: true,
            text: 'Interest Level (%)'
          }
        },
        x: {
          title: {
            display: true,
            text: 'Month'
          }
        }
      }
    };

    return (
      <div style={{ padding: '1rem' }}>
        <Line data={data} options={options} />
        <div style={{ marginTop: '1rem', fontSize: '0.9rem', color: '#666' }}>
          This chart shows the market interest trend over the past 6 months, 
          based on search trends and market data.
        </div>
      </div>
    );
  };

  const renderRegionalChart = () => {
    if (!result?.validation?.regions) return null;

    const data = {
      labels: Object.keys(result.validation.regions),
      datasets: [
        {
          label: 'Regional Market Interest',
          data: Object.values(result.validation.regions),
          backgroundColor: 'rgba(26, 35, 126, 0.8)',
        },
      ],
    };

    const options = {
      responsive: true,
      plugins: {
        legend: {
          position: 'top',
        },
        title: {
          display: true,
          text: 'Regional Market Distribution',
          font: {
            size: 16,
            weight: 'bold'
          }
        },
        tooltip: {
          callbacks: {
            label: (context) => `Interest Level: ${context.raw}%`
          }
        }
      },
      scales: {
        y: {
          beginAtZero: true,
          max: 100,
          title: {
            display: true,
            text: 'Interest Level (%)'
          }
        },
        x: {
          title: {
            display: true,
            text: 'Region'
          }
        }
      }
    };

    return (
      <div style={{ padding: '1rem' }}>
        <Bar data={data} options={options} />
        <div style={{ marginTop: '1rem', fontSize: '0.9rem', color: '#666' }}>
          This chart shows the relative market interest across different regions,
          helping identify the most promising markets.
        </div>
      </div>
    );
  };

  const renderScoreCard = () => {
    if (!result?.validation?.score) return null;

    const score = result.validation.score;
    const data = {
      labels: ['Score', 'Remaining'],
      datasets: [{
        data: [score, 100 - score],
        backgroundColor: ['#1a237e', '#e0e0e0'],
      }]
    };

    return (
      <div className="score-card">
        <h3>Validation Score</h3>
        <div className="score-visualization">
          <Doughnut 
            data={data}
            options={{
              cutout: '70%',
              plugins: {
                legend: { display: false }
              }
            }}
          />
          <div className="score-value">{score}%</div>
        </div>
      </div>
    );
  };

  const renderIndustryAnalysis = () => {
    if (!result?.validation?.industry) return null;

    return (
      <div className="industry-analysis">
        <h3>Industry Analysis</h3>
        <div className="industry-card">
          <div className="industry-main">
            <h4>Industry: {result.validation.industry.category}</h4>
            <p>Confidence: {result.validation.industry.confidence}%</p>
          </div>
          <div className="aspect-analysis">
            <h4>Key Aspects</h4>
            {Object.entries(result.validation.aspects).map(([aspect, score]) => (
              <div key={aspect} className="aspect-item">
                <span className="aspect-label">{aspect}</span>
                <div className="aspect-bar-container">
                  <div 
                    className="aspect-bar" 
                    style={{ width: `${score}%` }}
                  ></div>
                  <span className="aspect-score">{score}%</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    );
  };

  const renderMarketSentiment = () => {
    if (!result?.detailed_analysis?.market_sentiment) return null;

    const sentiment = result.detailed_analysis.market_sentiment;
    return (
      <div className="market-sentiment">
        <h3>Market Sentiment</h3>
        <div className="sentiment-summary">
          <div className={`sentiment-indicator ${sentiment.summary.sentiment}`}>
            Overall: {sentiment.summary.sentiment}
          </div>
          <p>Based on {sentiment.summary.total} recent articles</p>
        </div>
        <div className="sentiment-articles">
          {sentiment.articles.map((article, index) => (
            <div key={index} className={`article-card ${article.sentiment}`}>
              <h4>{article.title}</h4>
              <p>{article.description}</p>
              <div className="article-meta">
                <span className="sentiment-tag">{article.sentiment}</span>
                <a href={article.url} target="_blank" rel="noopener noreferrer">Read more</a>
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  };

  const renderRecommendations = () => {
    if (!result?.validation?.recommendations) return null;

    return (
      <div className="recommendations-section">
        <h3>Strategic Recommendations</h3>
        <div className="recommendations-grid">
          {result.validation.recommendations.map((rec, index) => (
            <div key={index} className="recommendation-card">
              <div className="recommendation-number">{index + 1}</div>
              <p>{rec}</p>
            </div>
          ))}
        </div>
      </div>
    );
  };

  return (
    <div style={{
      maxWidth: '1200px',
      margin: '2.5rem auto',
      padding: '1rem',
    }}>
      <div style={{
        backgroundColor: '#f8fafc',
        padding: '2rem',
        borderRadius: '1rem',
        marginBottom: '2rem',
      }}>
        <h1 style={{
          fontSize: '2.5rem',
          fontWeight: 'bold',
          color: '#1a237e',
          marginBottom: '1.5rem',
          textAlign: 'center',
        }}>
          Validate Your Startup Idea
        </h1>
        
        <form onSubmit={validateIdea} style={{
          maxWidth: '800px',
          margin: '0 auto',
        }}>
          <div style={{ marginBottom: '1.5rem' }}>
            <label style={{
              display: 'block',
              marginBottom: '0.5rem',
              fontWeight: '500',
              color: '#1a237e',
            }}>
              Describe your startup idea
            </label>
            <textarea
              value={idea}
              onChange={(e) => setIdea(e.target.value)}
              style={{
                width: '100%',
                padding: '1rem',
                borderRadius: '0.5rem',
                border: '2px solid #e2e8f0',
                fontSize: '1rem',
                transition: 'border-color 0.3s ease',
                ':focus': {
                  borderColor: '#1a237e',
                  outline: 'none',
                },
              }}
              rows="4"
              placeholder="Enter your business idea..."
              required
            />
          </div>
          <button
            type="submit"
            disabled={loading}
            style={{
              backgroundColor: loading ? '#94a3b8' : '#1a237e',
              color: 'white',
              padding: '1rem 2rem',
              borderRadius: '0.5rem',
              border: 'none',
              fontSize: '1rem',
              fontWeight: '500',
              cursor: loading ? 'not-allowed' : 'pointer',
              transition: 'background-color 0.3s ease',
              width: '100%',
              ':hover': {
                backgroundColor: loading ? '#94a3b8' : '#0d1b5e',
              },
            }}
          >
            {loading ? 'Analyzing...' : 'Validate Idea'}
          </button>
        </form>
      </div>

      {error && (
        <div style={{
          backgroundColor: '#fee2e2',
          border: '1px solid #ef4444',
          color: '#b91c1c',
          padding: '1rem',
          borderRadius: '0.5rem',
          marginBottom: '1.5rem',
        }}>
          {error}
        </div>
      )}

      {result && (
        <div style={{
          backgroundColor: 'white',
          padding: '2rem',
          borderRadius: '1rem',
          boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)',
        }}>
          <div style={{ marginBottom: '2rem' }}>
            <h2 style={{
              fontSize: '1.8rem',
              fontWeight: 'bold',
              color: '#1a237e',
              marginBottom: '1rem',
            }}>
              Validation Results
            </h2>
            
            <div style={{
              display: 'grid',
              gap: '1rem',
            }}>
              {renderScoreCard()}
              {renderIndustryAnalysis()}
            </div>
          </div>

          <div style={{ marginBottom: '2rem' }}>
            <h3 style={{
              fontSize: '1.5rem',
              fontWeight: 'bold',
              color: '#1a237e',
              marginBottom: '1rem',
            }}>
              Market Trends
            </h3>
            {renderTrendChart()}
          </div>

          <div style={{ marginBottom: '2rem' }}>
            <h3 style={{
              fontSize: '1.5rem',
              fontWeight: 'bold',
              color: '#1a237e',
              marginBottom: '1rem',
            }}>
              Regional Analysis
            </h3>
            {renderRegionalChart()}
          </div>

          <div style={{ marginBottom: '2rem' }}>
            <h3 style={{
              fontSize: '1.5rem',
              fontWeight: 'bold',
              color: '#1a237e',
              marginBottom: '1rem',
            }}>
              Market Sentiment
            </h3>
            {renderMarketSentiment()}
          </div>

          <div>
            <h3 style={{
              fontSize: '1.5rem',
              fontWeight: 'bold',
              color: '#1a237e',
              marginBottom: '1rem',
            }}>
              Recommendations
            </h3>
            <div style={{
              display: 'grid',
              gap: '1rem',
            }}>
              {renderRecommendations()}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default IdeaValidator; 