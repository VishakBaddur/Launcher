import React, { useState } from 'react';
import {
  Box,
  Button,
  Card,
  Container,
  Grid,
  TextField,
  Typography,
  CircularProgress,
  Alert,
  Link,
  Chip,
  Divider,
  List,
  ListItem,
  ListItemText,
  ListItemIcon,
  Paper,
  Tabs,
  Tab,
} from '@mui/material';
import {
  TrendingUp,
  Business,
  Assessment,
  Lightbulb,
  Warning,
  CheckCircle,
  Info,
  Link as LinkIcon,
  PieChart,
  BarChart,
  Timeline,
} from '@mui/icons-material';
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  PieChart as RechartsPieChart,
  Pie,
  Cell,
  BarChart as RechartsBarChart,
  Bar,
  Legend,
} from 'recharts';

const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042'];

const renderMarketGrowthChart = (data) => {
  if (!data || data.length === 0) return null;

  return (
    <Box sx={{ height: 300, mt: 2 }}>
      <ResponsiveContainer width="100%" height="100%">
        <LineChart data={data}>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="month" />
          <YAxis />
          <Tooltip />
          <Legend />
          <Line
            type="monotone"
            dataKey="value"
            stroke="#8884d8"
            name="Market Growth Index"
          />
        </LineChart>
      </ResponsiveContainer>
    </Box>
  );
};

const renderMarketShareChart = (data) => {
  if (!data || data.length === 0) return null;

  return (
    <Box sx={{ height: 300, mt: 2 }}>
      <ResponsiveContainer width="100%" height="100%">
        <RechartsPieChart>
          <Pie
            data={data}
            cx="50%"
            cy="50%"
            labelLine={false}
            label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
            outerRadius={80}
            fill="#8884d8"
            dataKey="value"
          >
            {data.map((entry, index) => (
              <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
            ))}
          </Pie>
          <Tooltip />
          <Legend />
        </RechartsPieChart>
      </ResponsiveContainer>
    </Box>
  );
};

const renderDemographicsChart = (data) => {
  if (!data || data.length === 0) return null;

  return (
    <Box sx={{ height: 300, mt: 2 }}>
      <ResponsiveContainer width="100%" height="100%">
        <RechartsBarChart data={data}>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="age" />
          <YAxis />
          <Tooltip />
          <Legend />
          <Bar dataKey="value" name="Percentage" fill="#8884d8" />
        </RechartsBarChart>
      </ResponsiveContainer>
    </Box>
  );
};

const renderCategoryDistributionChart = (data) => {
  if (!data || data.length === 0) return null;

  return (
    <Box sx={{ height: 300, mt: 2 }}>
      <ResponsiveContainer width="100%" height="100%">
        <RechartsPieChart>
          <Pie
            data={data}
            cx="50%"
            cy="50%"
            labelLine={false}
            label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
            outerRadius={80}
            fill="#8884d8"
            dataKey="value"
          >
            {data.map((entry, index) => (
              <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
            ))}
          </Pie>
          <Tooltip />
          <Legend />
        </RechartsPieChart>
      </ResponsiveContainer>
    </Box>
  );
};

const renderOrderDistributionChart = (data) => {
  if (!data || data.length === 0) return null;

  return (
    <Box sx={{ height: 300, mt: 2 }}>
      <ResponsiveContainer width="100%" height="100%">
        <RechartsBarChart data={data}>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="type" />
          <YAxis />
          <Tooltip />
          <Legend />
          <Bar dataKey="value" name="Percentage" fill="#8884d8" />
        </RechartsBarChart>
      </ResponsiveContainer>
    </Box>
  );
};

const IdeaValidator = () => {
  const [formData, setFormData] = useState({
    business_idea: '',
    target_market: '',
    location: '',
    budget: '',
    business_model: '',
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [results, setResults] = useState(null);
  const [activeTab, setActiveTab] = useState(0);

  const handleInputChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      const response = await fetch('http://localhost:5000/validate', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });

      if (!response.ok) {
        throw new Error('Failed to validate idea');
      }

      const data = await response.json();
      setResults(data.data);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleTabChange = (event, newValue) => {
    setActiveTab(newValue);
  };

  const renderDataSourceBadge = (dataSource) => (
    <Chip
      icon={dataSource === 'real_companies' ? <CheckCircle /> : <Info />}
      label={dataSource === 'real_companies' ? 'Real Company Data' : 'AI-Generated Insights'}
      color={dataSource === 'real_companies' ? 'success' : 'info'}
      size="small"
      sx={{ mb: 2 }}
    />
  );

  const renderExampleCompanies = (companies) => (
    <List>
      {companies.map((company, index) => (
        <ListItem key={index}>
          <ListItemIcon>
            <Business />
          </ListItemIcon>
          <ListItemText
            primary={
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                <Typography variant="subtitle1">{company.name}</Typography>
                {company.website && (
                  <Link href={company.website} target="_blank" rel="noopener">
                    <LinkIcon fontSize="small" />
                  </Link>
                )}
              </Box>
            }
            secondary={
              <Box sx={{ mt: 1 }}>
                <Typography variant="body2" color="text.secondary">
                  {company.description}
                </Typography>
                {company.founded_year && (
                  <Typography variant="body2" color="text.secondary">
                    Founded: {company.founded_year}
                  </Typography>
                )}
                {company.funding_amount && (
                  <Typography variant="body2" color="text.secondary">
                    Funding: {company.funding_amount}
                  </Typography>
                )}
                {company.market_size && (
                  <Typography variant="body2" color="text.secondary">
                    Market Size: {company.market_size}
                  </Typography>
                )}
                {company.key_metrics && (
                  <Box sx={{ mt: 1 }}>
                    {Object.entries(company.key_metrics).map(([key, value]) => (
                      <Chip
                        key={key}
                        label={`${key}: ${value}`}
                        size="small"
                        sx={{ mr: 1, mb: 1 }}
                      />
                    ))}
                  </Box>
                )}
              </Box>
            }
          />
        </ListItem>
      ))}
    </List>
  );

  return (
    <Box sx={{ minHeight: '100vh', width: '100vw', bgcolor: '#f5f6fa', py: 4 }}>
      <Box sx={{ maxWidth: '1400px', mx: 'auto' }}>
        <Typography variant="h4" component="h1" gutterBottom>
          Business Idea Validator
        </Typography>

        <Card sx={{ p: 3, mb: 4 }}>
          <form onSubmit={handleSubmit}>
            <Grid container spacing={3}>
              <Grid item xs={12}>
                <TextField
                  fullWidth
                  label="Business Idea"
                  name="business_idea"
                  value={formData.business_idea}
                  onChange={handleInputChange}
                  required
                  placeholder="e.g., Online marketplace for handmade crafts"
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField
                  fullWidth
                  label="Target Market"
                  name="target_market"
                  value={formData.target_market}
                  onChange={handleInputChange}
                  required
                  placeholder="e.g., Young professionals, 25-35"
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField
                  fullWidth
                  label="Location"
                  name="location"
                  value={formData.location}
                  onChange={handleInputChange}
                  required
                  placeholder="e.g., San Francisco, CA"
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField
                  fullWidth
                  label="Budget"
                  name="budget"
                  value={formData.budget}
                  onChange={handleInputChange}
                  required
                  placeholder="e.g., $50,000"
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField
                  fullWidth
                  label="Business Model"
                  name="business_model"
                  value={formData.business_model}
                  onChange={handleInputChange}
                  required
                  placeholder="e.g., Marketplace, Subscription"
                />
              </Grid>
              <Grid item xs={12}>
                <Button
                  type="submit"
                  variant="contained"
                  color="primary"
                  disabled={loading}
                  startIcon={loading ? <CircularProgress size={20} /> : null}
                >
                  {loading ? 'Validating...' : 'Validate Idea'}
                </Button>
              </Grid>
            </Grid>
          </form>
        </Card>

        {error && (
          <Alert severity="error" sx={{ mb: 4 }}>
            {error}
          </Alert>
        )}

        {results && (
          <>
            <Box sx={{ mb: 4 }}>
              {renderDataSourceBadge(results.data_source)}
            </Box>

            <Tabs
              value={activeTab}
              onChange={handleTabChange}
              sx={{ mb: 4 }}
              variant="scrollable"
              scrollButtons="auto"
            >
              <Tab icon={<Business />} label="Overview" />
              <Tab icon={<Timeline />} label="Market Analysis" />
              <Tab icon={<Assessment />} label="Competition" />
              <Tab icon={<Lightbulb />} label="Recommendations" />
            </Tabs>

            {activeTab === 0 && (
              <Grid container spacing={4} alignItems="stretch">
                <Grid item xs={12} md={6}>
                  <Card sx={{ p: 3, height: '100%' }}>
                    <Typography variant="h6" gutterBottom>
                      <Business sx={{ mr: 1 }} />
                      Business Overview
                    </Typography>
                    <Typography variant="subtitle1" color="text.secondary" gutterBottom>
                      {results.category}
                    </Typography>
                    <Typography variant="body1" paragraph>
                      {results.description}
                    </Typography>
                  </Card>
                </Grid>

                <Grid item xs={12} md={6}>
                  <Card sx={{ p: 3, height: '100%' }}>
                    <Typography variant="h6" gutterBottom>
                      <TrendingUp sx={{ mr: 1 }} />
                      Market Trends
                    </Typography>
                    <List>
                      {results.market_trends.map((trend, index) => (
                        <ListItem key={index}>
                          <ListItemIcon>
                            <TrendingUp />
                          </ListItemIcon>
                          <ListItemText primary={trend} />
                        </ListItem>
                      ))}
                    </List>
                  </Card>
                </Grid>
              </Grid>
            )}

            {activeTab === 1 && (
              <Grid container spacing={4} alignItems="stretch">
                <Grid item xs={12}>
                  <Card sx={{ p: 3, height: '100%' }}>
                    <Typography variant="h6" gutterBottom>
                      <Timeline sx={{ mr: 1 }} />
                      Market Growth
                    </Typography>
                    {renderMarketGrowthChart(results.market_data?.monthly_growth || results.market_data?.market_size_by_year)}
                  </Card>
                </Grid>

                <Grid item xs={12} md={6}>
                  <Card sx={{ p: 3, height: '100%' }}>
                    <Typography variant="h6" gutterBottom>
                      <PieChart sx={{ mr: 1 }} />
                      Market Share
                    </Typography>
                    {renderMarketShareChart(results.market_data?.market_share)}
                  </Card>
                </Grid>

                <Grid item xs={12} md={6}>
                  <Card sx={{ p: 3, height: '100%' }}>
                    <Typography variant="h6" gutterBottom>
                      <BarChart sx={{ mr: 1 }} />
                      User Demographics
                    </Typography>
                    {renderDemographicsChart(results.market_data?.user_demographics)}
                  </Card>
                </Grid>

                {results.market_data?.category_distribution && (
                  <Grid item xs={12} md={6}>
                    <Card sx={{ p: 3, height: '100%' }}>
                      <Typography variant="h6" gutterBottom>
                        <PieChart sx={{ mr: 1 }} />
                        Category Distribution
                      </Typography>
                      {renderCategoryDistributionChart(results.market_data.category_distribution)}
                    </Card>
                  </Grid>
                )}

                {results.market_data?.order_distribution && (
                  <Grid item xs={12} md={6}>
                    <Card sx={{ p: 3, height: '100%' }}>
                      <Typography variant="h6" gutterBottom>
                        <BarChart sx={{ mr: 1 }} />
                        Order Distribution
                      </Typography>
                      {renderOrderDistributionChart(results.market_data.order_distribution)}
                    </Card>
                  </Grid>
                )}
              </Grid>
            )}

            {activeTab === 2 && (
              <Grid container spacing={4} alignItems="stretch">
                <Grid item xs={12}>
                  <Card sx={{ p: 3, height: '100%' }}>
                    <Typography variant="h6" gutterBottom>
                      <Business sx={{ mr: 1 }} />
                      Example Companies
                    </Typography>
                    {renderExampleCompanies(results.example_companies)}
                  </Card>
                </Grid>

                <Grid item xs={12} md={6}>
                  <Card sx={{ p: 3, height: '100%' }}>
                    <Typography variant="h6" gutterBottom>
                      <Warning sx={{ mr: 1 }} />
                      Common Challenges
                    </Typography>
                    <List>
                      {results.common_challenges.map((challenge, index) => (
                        <ListItem key={index}>
                          <ListItemIcon>
                            <Warning />
                          </ListItemIcon>
                          <ListItemText primary={challenge} />
                        </ListItem>
                      ))}
                    </List>
                  </Card>
                </Grid>

                <Grid item xs={12} md={6}>
                  <Card sx={{ p: 3, height: '100%' }}>
                    <Typography variant="h6" gutterBottom>
                      <CheckCircle sx={{ mr: 1 }} />
                      Success Factors
                    </Typography>
                    <List>
                      {results.success_factors.map((factor, index) => (
                        <ListItem key={index}>
                          <ListItemIcon>
                            <CheckCircle />
                          </ListItemIcon>
                          <ListItemText primary={factor} />
                        </ListItem>
                      ))}
                    </List>
                  </Card>
                </Grid>
              </Grid>
            )}

            {activeTab === 3 && (
              <Grid container spacing={4} alignItems="stretch">
                <Grid item xs={12}>
                  <Card sx={{ p: 3, height: '100%' }}>
                    <Typography variant="h6" gutterBottom>
                      <Lightbulb sx={{ mr: 1 }} />
                      Actionable Recommendations
                    </Typography>
                    <List>
                      {results.recommendations?.map((rec, index) => (
                        <ListItem key={index}>
                          <ListItemIcon>
                            <Lightbulb />
                          </ListItemIcon>
                          <ListItemText primary={rec} />
                        </ListItem>
                      ))}
                    </List>
                  </Card>
                </Grid>

                {results.news && results.news.length > 0 && (
                  <Grid item xs={12}>
                    <Card sx={{ p: 3, height: '100%' }}>
                      <Typography variant="h6" gutterBottom>
                        <Info sx={{ mr: 1 }} />
                        Recent News
                      </Typography>
                      <List>
                        {results.news.map((article, index) => (
                          <ListItem key={index}>
                            <ListItemIcon>
                              <Info />
                            </ListItemIcon>
                            <ListItemText
                              primary={
                                <Link href={article.link} target="_blank" rel="noopener">
                                  {article.title}
                                </Link>
                              }
                              secondary={article.description}
                            />
                          </ListItem>
                        ))}
                      </List>
                    </Card>
                  </Grid>
                )}
              </Grid>
            )}
          </>
        )}
      </Box>
    </Box>
  );
};

export default IdeaValidator; 