import React from 'react';
import { Link } from 'react-router-dom';

const Home = () => {
  return (
    <div style={{
      minHeight: '100vh',
      backgroundColor: '#f5f5f5',
      padding: '2rem',
    }}>
      <div style={{
        maxWidth: '1200px',
        margin: '0 auto',
      }}>
        {/* Hero Section */}
        <div style={{
          textAlign: 'center',
          marginBottom: '4rem',
          padding: '4rem 2rem',
          background: 'linear-gradient(135deg, #1a237e 0%, #3949ab 100%)',
          borderRadius: '1rem',
          color: 'white',
        }}>
          <h1 style={{
            fontSize: '3rem',
            marginBottom: '1rem',
          }}>
            Turn Your Ideas Into Success
          </h1>
          <p style={{
            fontSize: '1.25rem',
            marginBottom: '2rem',
            opacity: 0.9,
          }}>
            Validate your startup idea and get a professional business plan in minutes
          </p>
        </div>

        {/* Features Section */}
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))',
          gap: '2rem',
          marginBottom: '4rem',
        }}>
          <Link to="/validate" style={{
            textDecoration: 'none',
            color: 'inherit',
          }}>
            <div style={{
              backgroundColor: 'white',
              padding: '2rem',
              borderRadius: '1rem',
              boxShadow: '0 4px 6px rgba(0,0,0,0.1)',
              transition: 'transform 0.3s ease',
              ':hover': {
                transform: 'translateY(-5px)',
              },
            }}>
              <h2 style={{
                fontSize: '1.5rem',
                color: '#1a237e',
                marginBottom: '1rem',
              }}>
                Idea Validator
              </h2>
              <p>
                Analyze market trends and validate your startup idea with real data
              </p>
            </div>
          </Link>

          <Link to="/generate" style={{
            textDecoration: 'none',
            color: 'inherit',
          }}>
            <div style={{
              backgroundColor: 'white',
              padding: '2rem',
              borderRadius: '1rem',
              boxShadow: '0 4px 6px rgba(0,0,0,0.1)',
              transition: 'transform 0.3s ease',
              ':hover': {
                transform: 'translateY(-5px)',
              },
            }}>
              <h2 style={{
                fontSize: '1.5rem',
                color: '#1a237e',
                marginBottom: '1rem',
              }}>
                Business Plan Generator
              </h2>
              <p>
                Get a comprehensive business plan tailored to your startup idea
              </p>
            </div>
          </Link>
        </div>

        {/* How It Works Section */}
        <div style={{
          backgroundColor: 'white',
          padding: '3rem 2rem',
          borderRadius: '1rem',
          boxShadow: '0 4px 6px rgba(0,0,0,0.1)',
        }}>
          <h2 style={{
            fontSize: '2rem',
            color: '#1a237e',
            marginBottom: '2rem',
            textAlign: 'center',
          }}>
            How It Works
          </h2>
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))',
            gap: '2rem',
          }}>
            {[
              {
                title: 'Enter Your Idea',
                description: 'Share your startup idea with our platform',
              },
              {
                title: 'Get Validation',
                description: 'Receive market trend analysis and validation scores',
              },
              {
                title: 'Generate Plan',
                description: 'Get a professional business plan for your startup',
              },
            ].map((step, index) => (
              <div key={index} style={{
                textAlign: 'center',
                padding: '1rem',
              }}>
                <div style={{
                  backgroundColor: '#e8eaf6',
                  color: '#1a237e',
                  width: '40px',
                  height: '40px',
                  borderRadius: '50%',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  margin: '0 auto 1rem',
                  fontSize: '1.25rem',
                  fontWeight: 'bold',
                }}>
                  {index + 1}
                </div>
                <h3 style={{
                  fontSize: '1.25rem',
                  color: '#1a237e',
                  marginBottom: '0.5rem',
                }}>
                  {step.title}
                </h3>
                <p style={{ color: '#4b5563' }}>
                  {step.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Home; 