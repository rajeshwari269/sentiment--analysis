import React, { useState, useEffect, useContext } from 'react';
import { ThemeContext } from '../context/ThemeContext';
import { Filter, Calendar, TrendingUp, TrendingDown, Minus, ExternalLink, Newspaper, Search, RefreshCw } from 'lucide-react';
import BackToTopButton from '../components/BackToTop';
import api from '../axios';
import toast, { Toaster } from 'react-hot-toast';

const NewsListingPage = () => {
  const { theme } = useContext(ThemeContext);
  const [news, setNews] = useState([]);
  const [filteredNews, setFilteredNews] = useState([]);
  const [selectedSentiment, setSelectedSentiment] = useState('Neutral');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');

  // AOS initialization with theme support
  useEffect(() => {
    import('aos').then(AOS => {
      AOS.init({
        duration: 600,
        once: false,
      });
      AOS.refreshHard();
    });
  }, [theme]);

  // Mock data - replace with actual API call
  const mockNews = [
    {
      id: 1,
      title: "Global Climate Summit Reaches Historic Agreement on Carbon Neutrality",
      description: "World leaders unite on comprehensive climate action plan with binding commitments for carbon reduction, marking a significant step forward in international environmental cooperation.",
      source: "Environmental News Network",
      publishedAt: "2024-09-26T10:30:00Z",
      sentiment: "Positive",
      confidence: 0.85,
      url: "https://example.com/climate-summit",
      category: "Environment"
    },
    {
      id: 2,
      title: "Stock Markets Show Mixed Results Amid Economic Uncertainty",
      description: "Trading volumes remain steady as investors await quarterly earnings reports from major corporations, with tech stocks showing resilience despite market volatility.",
      source: "Financial Times",
      publishedAt: "2024-09-26T09:15:00Z",
      sentiment: "Neutral",
      confidence: 0.72,
      url: "https://example.com/stock-markets",
      category: "Finance"
    },
    {
      id: 3,
      title: "Severe Weather System Causes Major Disruptions Across Coastal Regions",
      description: "Emergency services respond to unprecedented weather conditions affecting thousands of residents, with evacuation orders issued for vulnerable areas.",
      source: "Breaking News Today",
      publishedAt: "2024-09-26T08:45:00Z",
      sentiment: "Negative",
      confidence: 0.91,
      url: "https://example.com/weather-emergency",
      category: "Breaking News"
    },
    {
      id: 4,
      title: "Local School District Receives Record-Breaking Education Grant for STEM Programs",
      description: "$2 million federal grant will fund innovative STEM programs and technology upgrades across 15 schools, benefiting over 8,000 students.",
      source: "Education Weekly",
      publishedAt: "2024-09-26T07:20:00Z",
      sentiment: "Positive",
      confidence: 0.78,
      url: "https://example.com/education-grant",
      category: "Education"
    },
    {
      id: 5,
      title: "Major Tech Company Reports Quarterly Earnings Meeting Expectations",
      description: "Results align with analyst projections showing steady growth in cloud services and software licensing revenue, maintaining market stability.",
      source: "Tech Reporter",
      publishedAt: "2024-09-26T06:00:00Z",
      sentiment: "Neutral",
      confidence: 0.68,
      url: "https://example.com/tech-earnings",
      category: "Technology"
    },
    {
      id: 6,
      title: "Healthcare System Faces Critical Staffing Shortage Crisis",
      description: "Hospitals nationwide report alarming staffing gaps as demand for healthcare services continues to outpace available resources, raising concerns about patient care quality.",
      source: "Health News Daily",
      publishedAt: "2024-09-25T22:30:00Z",
      sentiment: "Negative",
      confidence: 0.83,
      url: "https://example.com/healthcare-crisis",
      category: "Healthcare"
    },
    {
      id: 7,
      title: "Breakthrough Medical Research Shows Promise for Cancer Treatment",
      description: "New immunotherapy approach demonstrates remarkable results in clinical trials, offering hope for patients with previously untreatable forms of cancer.",
      source: "Medical Journal Today",
      publishedAt: "2024-09-25T20:15:00Z",
      sentiment: "Positive",
      confidence: 0.89,
      url: "https://example.com/cancer-breakthrough",
      category: "Healthcare"
    },
    {
      id: 8,
      title: "Cryptocurrency Markets Experience Continued Volatility",
      description: "Digital currencies show mixed performance with regulatory uncertainty continuing to impact investor confidence and market stability.",
      source: "Crypto News Daily",
      publishedAt: "2024-09-25T18:30:00Z",
      sentiment: "Neutral",
      confidence: 0.65,
      url: "https://example.com/crypto-volatility",
      category: "Finance"
    }
  ];

  useEffect(() => {
    fetchNews();
  }, []);

  useEffect(() => {
    filterNews();
  }, [news, selectedSentiment, searchTerm]);

  const fetchNews = async () => {
    try {
      setLoading(true);
      // Replace this with actual API call to your Express server
      // const response = await api.get('/api/news/daily');
      // setNews(response.data);
      
      // Simulate API delay
      await new Promise(resolve => setTimeout(resolve, 1200));
      
      setNews(mockNews);
      setError(null);
      toast.success('Daily news loaded successfully!');
    } catch (err) {
      setError('Failed to fetch daily news. Please try again later.');
      toast.error('Failed to load news articles');
      console.error('Error fetching news:', err);
    } finally {
      setLoading(false);
    }
  };

  const filterNews = () => {
    let filtered = news.filter(article => article.sentiment === selectedSentiment);
    
    if (searchTerm) {
      filtered = filtered.filter(article =>
        article.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        article.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
        article.category.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }
    
    setFilteredNews(filtered);
  };

  const getSentimentIcon = (sentiment) => {
    switch (sentiment) {
      case 'Positive':
        return <TrendingUp className="w-4 h-4 text-green-500" />;
      case 'Negative':
        return <TrendingDown className="w-4 h-4 text-red-500" />;
      default:
        return <Minus className="w-4 h-4 text-gray-500" />;
    }
  };

  const getSentimentBadge = (sentiment, confidence) => {
    const baseClasses = "inline-flex items-center px-3 py-1 rounded-full text-xs font-medium gap-1.5 transition-all duration-200";
    let colorClasses = "";
    
    switch (sentiment) {
      case 'Positive':
        colorClasses = theme === 'dark' 
          ? "bg-green-900/60 text-green-300 border border-green-700/50" 
          : "bg-green-100 text-green-800 border border-green-200";
        break;
      case 'Negative':
        colorClasses = theme === 'dark'
          ? "bg-red-900/60 text-red-300 border border-red-700/50"
          : "bg-red-100 text-red-800 border border-red-200";
        break;
      default:
        colorClasses = theme === 'dark'
          ? "bg-gray-700/60 text-gray-300 border border-gray-600/50"
          : "bg-gray-100 text-gray-800 border border-gray-200";
    }

    return (
      <span className={`${baseClasses} ${colorClasses}`}>
        {getSentimentIcon(sentiment)}
        {sentiment} ({Math.round(confidence * 100)}%)
      </span>
    );
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const getSentimentCount = (sentiment) => {
    return news.filter(article => article.sentiment === sentiment).length;
  };

  const refreshNews = () => {
    fetchNews();
  };

  if (loading) {
    return (
      <div className={`min-h-screen flex items-center justify-center transition-colors duration-300 ${
        theme === 'dark'
          ? 'bg-gradient-to-br from-gray-900 via-slate-900 to-black'
          : 'bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50'
      }`}>
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className={`text-lg ${theme === 'dark' ? 'text-gray-300' : 'text-gray-600'}`}>
            Loading daily news...
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className={`min-h-screen transition-colors duration-300 ${
      theme === 'dark'
        ? 'bg-gradient-to-br from-gray-900 via-slate-900 to-black'
        : 'bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50'
    }`}>
      {/* Enhanced Background Pattern */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className={`absolute -top-40 -right-40 w-80 h-80 rounded-full opacity-20 blur-3xl ${
          theme === 'dark'
            ? 'bg-gradient-to-br from-blue-600 to-purple-600'
            : 'bg-gradient-to-br from-blue-200 to-purple-200'
        }`}></div>
        <div className={`absolute -bottom-40 -left-40 w-80 h-80 rounded-full opacity-20 blur-3xl ${
          theme === 'dark'
            ? 'bg-gradient-to-tr from-pink-600 to-yellow-600'
            : 'bg-gradient-to-tr from-pink-200 to-yellow-200'
        }`}></div>
      </div>

      {/* Header */}
      <div className={`relative z-10 backdrop-blur-sm border-b transition-colors duration-300 ${
        theme === 'dark'
          ? 'bg-gray-800/60 border-gray-700/50'
          : 'bg-white/60 border-white/30'
      }`}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div data-aos="fade-down" className="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-6">
            <div className="flex items-center gap-4">
              <div className="w-14 h-14 bg-gradient-to-br from-blue-500 to-purple-600 rounded-2xl flex items-center justify-center shadow-lg">
                <Newspaper className="w-7 h-7 text-white" />
              </div>
              <div>
                <h1 className="text-4xl font-bold bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500 bg-clip-text text-transparent">
                  Daily News Hub
                </h1>
                <p className={`text-lg mt-1 ${theme === 'dark' ? 'text-gray-300' : 'text-gray-600'}`}>
                  AI-powered sentiment analysis of today's headlines
                </p>
              </div>
            </div>
            
            <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4">
              <div className={`flex items-center gap-2 px-4 py-2 rounded-full ${
                theme === 'dark' ? 'bg-gray-700/60 text-gray-300' : 'bg-white/80 text-gray-600'
              }`}>
                <Calendar className="w-4 h-4" />
                <span className="text-sm font-medium">
                  {new Date().toLocaleDateString('en-US', { 
                    weekday: 'long', 
                    year: 'numeric', 
                    month: 'long', 
                    day: 'numeric' 
                  })}
                </span>
              </div>
              
              <button
                onClick={refreshNews}
                className="inline-flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-full hover:shadow-lg transition-all duration-200 transform hover:scale-105"
              >
                <RefreshCw className="w-4 h-4" />
                Refresh
              </button>
            </div>
          </div>
        </div>
      </div>

      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Search and Filter Section */}
        <div data-aos="fade-up" className={`backdrop-blur-xl rounded-3xl p-6 shadow-xl border mb-8 transition-colors duration-300 ${
          theme === 'dark'
            ? 'bg-gray-800/60 border-gray-700/50'
            : 'bg-white/60 border-white/30'
        }`}>
          {/* Search Bar */}
          <div className="mb-6">
            <div className="relative max-w-md">
              <Search className={`absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 ${
                theme === 'dark' ? 'text-gray-400' : 'text-gray-500'
              }`} />
              <input
                type="text"
                placeholder="Search news articles..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className={`w-full pl-10 pr-4 py-3 rounded-xl border transition-all duration-200 focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
                  theme === 'dark'
                    ? 'bg-gray-700/60 border-gray-600/50 text-gray-100 placeholder-gray-400'
                    : 'bg-white/80 border-gray-200 text-gray-900 placeholder-gray-500'
                }`}
              />
            </div>
          </div>

          {/* Sentiment Filters */}
          <div className="flex items-center gap-3 mb-4">
            <Filter className={`w-5 h-5 ${theme === 'dark' ? 'text-gray-300' : 'text-gray-600'}`} />
            <h2 className={`text-lg font-semibold ${theme === 'dark' ? 'text-gray-100' : 'text-gray-900'}`}>
              Filter by Sentiment
            </h2>
          </div>
          
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            {['Positive', 'Neutral', 'Negative'].map((sentiment) => (
              <button
                key={sentiment}
                onClick={() => setSelectedSentiment(sentiment)}
                className={`p-4 rounded-xl border transition-all duration-200 transform hover:scale-105 ${
                  selectedSentiment === sentiment
                    ? theme === 'dark'
                      ? 'border-blue-500 bg-blue-900/40 shadow-lg'
                      : 'border-blue-500 bg-blue-50 shadow-lg'
                    : theme === 'dark'
                      ? 'border-gray-600/50 bg-gray-700/40 hover:bg-gray-700/60'
                      : 'border-gray-200 bg-gray-50/80 hover:bg-gray-100/80'
                }`}
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    {getSentimentIcon(sentiment)}
                    <span className={`font-medium ${theme === 'dark' ? 'text-gray-100' : 'text-gray-900'}`}>
                      {sentiment}
                    </span>
                  </div>
                  <span className={`text-2xl font-bold ${theme === 'dark' ? 'text-gray-300' : 'text-gray-700'}`}>
                    {getSentimentCount(sentiment)}
                  </span>
                </div>
              </button>
            ))}
          </div>
        </div>

        {/* Error State */}
        {error && (
          <div data-aos="fade-up" className={`p-6 rounded-xl backdrop-blur-sm mb-8 ${
            theme === 'dark'
              ? 'bg-red-900/60 border border-red-700/50'
              : 'bg-red-100/80 border border-red-200'
          }`}>
            <div className="flex items-center">
              <div className="text-red-500 text-xl mr-3">⚠️</div>
              <div>
                <p className={`font-medium ${theme === 'dark' ? 'text-red-300' : 'text-red-800'}`}>
                  {error}
                </p>
                <button
                  onClick={fetchNews}
                  className={`mt-2 px-4 py-2 rounded-lg transition-colors ${
                    theme === 'dark'
                      ? 'bg-red-800 hover:bg-red-700 text-red-100'
                      : 'bg-red-600 hover:bg-red-700 text-white'
                  }`}
                >
                  Try Again
                </button>
              </div>
            </div>
          </div>
        )}

        {/* News Articles */}
        <div data-aos="fade-up" className="space-y-6">
          <div className="flex items-center justify-between">
            <h2 className={`text-2xl font-bold ${theme === 'dark' ? 'text-gray-100' : 'text-gray-900'}`}>
              {selectedSentiment} News {searchTerm && `matching "${searchTerm}"`} ({filteredNews.length})
            </h2>
          </div>

          {filteredNews.length === 0 ? (
            <div className={`backdrop-blur-xl rounded-3xl p-12 text-center shadow-xl border transition-colors duration-300 ${
              theme === 'dark'
                ? 'bg-gray-800/60 border-gray-700/50'
                : 'bg-white/60 border-white/30'
            }`}>
              <div className="text-6xl mb-4">📰</div>
              <h3 className={`text-xl font-medium mb-2 ${theme === 'dark' ? 'text-gray-100' : 'text-gray-900'}`}>
                No {selectedSentiment.toLowerCase()} news found
                {searchTerm && ` for "${searchTerm}"`}
              </h3>
              <p className={`${theme === 'dark' ? 'text-gray-400' : 'text-gray-600'}`}>
                {searchTerm 
                  ? 'Try adjusting your search terms or selecting a different sentiment filter.'
                  : 'Try selecting a different sentiment filter to see more articles.'
                }
              </p>
            </div>
          ) : (
            <div className="grid gap-6">
              {filteredNews.map((article, index) => (
                <div
                  key={article.id}
                  data-aos="fade-up"
                  data-aos-delay={index * 100}
                  className={`backdrop-blur-xl rounded-3xl shadow-xl border hover:shadow-2xl transition-all duration-300 transform hover:scale-[1.02] overflow-hidden ${
                    theme === 'dark'
                      ? 'bg-gray-800/60 border-gray-700/50 hover:bg-gray-800/80'
                      : 'bg-white/60 border-white/30 hover:bg-white/80'
                  }`}
                >
                  <div className="p-8">
                    <div className="flex flex-col lg:flex-row lg:items-start lg:justify-between gap-6">
                      <div className="flex-1">
                        <div className="flex flex-wrap items-center gap-3 mb-4">
                          {getSentimentBadge(article.sentiment, article.confidence)}
                          <span className={`text-xs uppercase tracking-wide font-medium px-2 py-1 rounded-full ${
                            theme === 'dark'
                              ? 'bg-gray-700/60 text-gray-300'
                              : 'bg-gray-100 text-gray-600'
                          }`}>
                            {article.category}
                          </span>
                        </div>
                        
                        <h3 className={`text-2xl font-bold mb-3 leading-tight hover:text-blue-600 transition-colors cursor-pointer ${
                          theme === 'dark' ? 'text-gray-100' : 'text-gray-900'
                        }`}>
                          {article.title}
                        </h3>
                        
                        <p className={`text-lg leading-relaxed mb-6 ${
                          theme === 'dark' ? 'text-gray-300' : 'text-gray-600'
                        }`}>
                          {article.description}
                        </p>
                        
                        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                          <div className={`flex items-center gap-4 text-sm ${
                            theme === 'dark' ? 'text-gray-400' : 'text-gray-500'
                          }`}>
                            <span className="font-medium">{article.source}</span>
                            <span>•</span>
                            <span>{formatDate(article.publishedAt)}</span>
                          </div>
                          
                          <button className="inline-flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-xl hover:shadow-lg transition-all duration-200 transform hover:scale-105">
                            Read Full Article
                            <ExternalLink className="w-4 h-4" />
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      <Toaster
        position="top-right"
        reverseOrder={false}
        toastOptions={{
          style: {
            background: theme === 'dark' ? '#374151' : '#ffffff',
            color: theme === 'dark' ? '#f9fafb' : '#111827',
          },
        }}
      />

      <BackToTopButton />
    </div>
  );
};

export default NewsListingPage;