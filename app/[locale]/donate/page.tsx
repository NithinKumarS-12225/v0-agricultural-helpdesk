'use client';

import React, { useState } from 'react';
import { useParams } from 'next/navigation';
import type { Locale } from '@/i18n.config';
import { getTranslation } from '@/lib/translations';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Copy, Check, Share2, Calendar, Tag, ArrowRight, Heart, Wallet, QrCode } from 'lucide-react';

interface Article {
  id: string;
  title: string;
  description: string;
  category: string;
  date: string;
  image: string;
  content: string;
  author: string;
}

export default function DonatePage() {
  const params = useParams();
  const locale = (params?.locale as Locale) || 'en';
  const t = getTranslation(locale);
  const [copiedField, setCopiedField] = useState<string | null>(null);
  const [selectedArticle, setSelectedArticle] = useState<Article | null>(null);

  const bankingDetails = {
    accountHolderName: 'Kisan Agricultural Helpdesk Trust',
    bankName: 'State Bank of India',
    accountNumber: '11223344556677',
    ifscCode: 'SBIN0001234',
    branch: 'Bangalore Main Branch',
    upiId: 'kisanhelpdesk@sbi',
  };

  const articles: Article[] = [
    {
      id: 'art001',
      title: 'Organic Farming: A Sustainable Path to Higher Yields',
      description: 'Learn how organic farming practices can improve soil health while increasing crop productivity in Indian agriculture.',
      category: 'Organic Farming',
      date: '2026-02-20',
      author: 'Dr. Ramesh Kumar',
      image: 'https://images.unsplash.com/photo-1574943320219-553eb213f72d?w=600&h=400&fit=crop',
      content: `Organic farming has emerged as a sustainable alternative to conventional agriculture in India. This comprehensive guide covers:

1. Soil Health Management
- Building soil organic matter through composting
- Natural nitrogen fixation techniques
- Beneficial microorganism cultivation

2. Pest Management
- Integrated Pest Management (IPM) techniques
- Natural pest repellents
- Companion planting strategies

3. Crop Rotation
- Benefits of crop rotation for soil nutrients
- Recommended crop sequences for different regions
- Legume integration for natural fertilization

4. Cost-Benefit Analysis
- Initial investment requirements
- Long-term sustainability benefits
- Market premium for organic produce

Studies show that organic farms can achieve 20-30% higher net income over 5 years despite lower initial yields.`,
    },
    {
      id: 'art002',
      title: 'Water Conservation Techniques for Drip Irrigation',
      description: 'Maximize water efficiency and reduce agricultural water consumption using modern drip irrigation systems.',
      category: 'Irrigation',
      date: '2026-02-18',
      author: 'Eng. Priya Sharma',
      image: 'https://images.unsplash.com/photo-1530836369250-ef72a3f5cda8?w=600&h=400&fit=crop',
      content: `Water scarcity is a critical challenge in Indian agriculture. Drip irrigation offers an efficient solution:

1. Installation Basics
- System components and setup
- Cost estimation for different farm sizes
- Maintenance requirements

2. Water Savings
- Up to 60% water savings compared to flood irrigation
- Uniform nutrient distribution
- Reduced evaporation losses

3. Crop-Specific Applications
- Vegetables: 30-40 liters/day per plant
- Sugarcane: 50-60 mm per week
- Citrus: 600-800 mm per season

4. Government Subsidies
- PMKSY-AIBP assistance (up to 80%)
- State-specific schemes
- Application procedure and timeline

Implementation costs range from ₹40,000-80,000 per acre with subsidies available.`,
    },
    {
      id: 'art003',
      title: 'Precision Agriculture: Using IoT for Smart Farming',
      description: 'Explore how IoT sensors and data analytics are revolutionizing Indian agriculture.',
      category: 'Technology',
      date: '2026-02-15',
      author: 'Anil Verma',
      image: 'https://images.unsplash.com/photo-1574518611986-6f27a2fda8d8?w=600&h=400&fit=crop',
      content: `Precision agriculture combines technology with farming to optimize yields and reduce costs:

1. IoT Sensors
- Soil moisture sensors
- Weather monitoring stations
- Pest detection systems
- Real-time data collection

2. Data Analysis
- Crop health monitoring
- Predictive pest management
- Yield forecasting
- Resource optimization

3. Implementation
- Setup and installation costs
- Training requirements
- Integration with existing systems
- ROI timelines

4. Case Studies
- Success stories from Punjab
- Results from Karnataka coffee farms
- Technology adoption in Gujarat

Many farmers report 20-25% yield increase and 15-20% cost reduction.`,
    },
    {
      id: 'art004',
      title: 'Climate-Resilient Crop Varieties for Indian Farmers',
      description: 'Discover new crop varieties that can withstand climate variations and extreme weather conditions.',
      category: 'Crop Selection',
      date: '2026-02-12',
      author: 'Dr. Anjali Singh',
      image: 'https://images.unsplash.com/photo-1492684223066-81342ee5ff30?w=600&h=400&fit=crop',
      content: `Climate change demands adaptation. Here are resilient varieties for different crops:

1. Rice Varieties
- Drought-resistant: CR Dhan, Sahbhagi
- Flood-resistant: Swarna Sub1
- Stress-tolerant: MTU7029

2. Wheat Varieties
- Heat-resistant: HD2967, DBW90
- Disease-resistant: HD3086
- Yields up to 60-70 quintals/hectare

3. Pulses
- Chickpea: Ujala, Jaki314
- Moong: SML668, Pusa Basmati
- Pigeonpea: ICPL8596

4. Sourcing and Support
- Seeds from ICAR institutes
- Subsidy available in many states
- Training programs and demonstrations

Government certified seeds ensure quality and authenticity.`,
    },
    {
      id: 'art005',
      title: 'Government Schemes: PM-KISAN and Beyond',
      description: 'Complete guide to major agricultural subsidies and loan schemes available for Indian farmers.',
      category: 'Government Schemes',
      date: '2026-02-10',
      author: 'Financial Advisor Rajesh',
      image: 'https://images.unsplash.com/photo-1554224311-beee415c201f?w=600&h=400&fit=crop',
      content: `Multiple government schemes support Indian farmers:

1. PM-KISAN
- ₹6000 annual support in 3 installments
- Eligibility: Small and marginal farmers
- Registration online or at gram panchayat
- Direct bank transfer

2. PMFBY (Crop Insurance)
- Premium: 2% (kharif), 1.5% (rabi)
- Coverage: 75% of estimated yield
- Claim settlement within 2 months

3. KCC (Kisan Credit Card)
- Credit limit up to ₹1 lakh
- Interest: 7% with government subsidy
- Processing time: 7-10 days

4. PMMY (Pradhan Mantri Mudra Yojana)
- Unsecured loans up to ₹10 lakh
- 0% collateral requirement
- 5-year repayment period

5. RRB Schemes
- Agriculture loans at subsidized rates
- Special focus on small farmers
- Processing through nearest bank

Application process and timeline details for each scheme.`,
    },
    {
      id: 'art006',
      title: 'Integrated Crop Management for Maximum Productivity',
      description: 'Holistic approach to farm management combining pest control, nutrition, and water management.',
      category: 'Crop Management',
      date: '2026-02-08',
      author: 'Prof. Vikram Patel',
      image: 'https://images.unsplash.com/photo-1559027615-cd4628902d4a?w=600&h=400&fit=crop',
      content: `Integrated Crop Management (ICM) maximizes productivity:

1. Soil Health
- Soil testing before planting
- Nutrient management based on analysis
- Organic matter incorporation
- Microbial inoculants

2. Pest & Disease Management
- Scouting and monitoring
- Biological control agents
- Chemical use only when necessary
- Quarantine procedures

3. Nutrition Management
- Precision fertilizer application
- Balanced NPK ratios
- Micronutrient supplementation
- Foliar sprays

4. Water Management
- Irrigation scheduling
- Mulching practices
- Drainage management
- Rainwater harvesting

5. Harvesting & Storage
- Optimal harvest timing
- Post-harvest handling
- Storage conditions
- Quality maintenance

Implementation increases yields by 25-40% and reduces costs by 20-30%.`,
    },
  ];

  const copyToClipboard = (text: string, field: string) => {
    navigator.clipboard.writeText(text);
    setCopiedField(field);
    setTimeout(() => setCopiedField(null), 2000);
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-green-50 to-white dark:from-green-950 dark:to-gray-900">
      {/* Header */}
      <div className="bg-gradient-to-r from-green-600 to-emerald-600 text-white py-12 px-4">
        <div className="max-w-7xl mx-auto text-center">
          <div className="flex items-center justify-center gap-3 mb-4">
            <Heart className="h-8 w-8" />
            <h1 className="text-4xl font-bold">{t.donate.title}</h1>
          </div>
          <p className="text-lg opacity-90">{t.donate.subtitle}</p>
        </div>
      </div>

      {/* Support Message */}
      <div className="max-w-7xl mx-auto px-4 py-8">
        <div className="bg-blue-50 dark:bg-blue-900/30 border border-blue-200 dark:border-blue-800 rounded-lg p-6 mb-12">
          <p className="text-center text-blue-900 dark:text-blue-100 text-lg">
            {t.donate.supportMessage}
          </p>
        </div>

        {/* Banking Details Section */}
        <section className="mb-16">
          <h2 className="text-3xl font-bold mb-2 flex items-center gap-3">
            <Wallet className="h-8 w-8 text-green-600" />
            {t.donate.bankingSection}
          </h2>
          <p className="text-gray-600 dark:text-gray-400 mb-8">
            Support our mission to provide agricultural knowledge to farmers across India. Your contribution directly helps reach more farmers.
          </p>

          <div className="grid md:grid-cols-2 gap-8">
            {/* Bank Details Card */}
            <Card className="p-8 border-2 border-green-200 dark:border-green-800">
              <h3 className="text-xl font-bold mb-6 text-green-700 dark:text-green-400">Bank Transfer Details</h3>
              <div className="space-y-6">
                <div>
                  <label className="text-sm font-semibold text-gray-600 dark:text-gray-400">{t.donate.accountHolderName}</label>
                  <div className="flex items-center justify-between mt-2 p-3 bg-gray-100 dark:bg-gray-800 rounded">
                    <span className="font-mono">{bankingDetails.accountHolderName}</span>
                    <button
                      onClick={() => copyToClipboard(bankingDetails.accountHolderName, 'name')}
                      className="p-1 hover:bg-gray-200 dark:hover:bg-gray-700 rounded"
                    >
                      {copiedField === 'name' ? (
                        <Check className="h-4 w-4 text-green-600" />
                      ) : (
                        <Copy className="h-4 w-4" />
                      )}
                    </button>
                  </div>
                </div>

                <div>
                  <label className="text-sm font-semibold text-gray-600 dark:text-gray-400">{t.donate.bankName}</label>
                  <div className="flex items-center justify-between mt-2 p-3 bg-gray-100 dark:bg-gray-800 rounded">
                    <span className="font-mono">{bankingDetails.bankName}</span>
                    <button
                      onClick={() => copyToClipboard(bankingDetails.bankName, 'bank')}
                      className="p-1 hover:bg-gray-200 dark:hover:bg-gray-700 rounded"
                    >
                      {copiedField === 'bank' ? (
                        <Check className="h-4 w-4 text-green-600" />
                      ) : (
                        <Copy className="h-4 w-4" />
                      )}
                    </button>
                  </div>
                </div>

                <div>
                  <label className="text-sm font-semibold text-gray-600 dark:text-gray-400">{t.donate.accountNumber}</label>
                  <div className="flex items-center justify-between mt-2 p-3 bg-gray-100 dark:bg-gray-800 rounded">
                    <span className="font-mono">{bankingDetails.accountNumber}</span>
                    <button
                      onClick={() => copyToClipboard(bankingDetails.accountNumber, 'account')}
                      className="p-1 hover:bg-gray-200 dark:hover:bg-gray-700 rounded"
                    >
                      {copiedField === 'account' ? (
                        <Check className="h-4 w-4 text-green-600" />
                      ) : (
                        <Copy className="h-4 w-4" />
                      )}
                    </button>
                  </div>
                </div>

                <div>
                  <label className="text-sm font-semibold text-gray-600 dark:text-gray-400">{t.donate.ifscCode}</label>
                  <div className="flex items-center justify-between mt-2 p-3 bg-gray-100 dark:bg-gray-800 rounded">
                    <span className="font-mono">{bankingDetails.ifscCode}</span>
                    <button
                      onClick={() => copyToClipboard(bankingDetails.ifscCode, 'ifsc')}
                      className="p-1 hover:bg-gray-200 dark:hover:bg-gray-700 rounded"
                    >
                      {copiedField === 'ifsc' ? (
                        <Check className="h-4 w-4 text-green-600" />
                      ) : (
                        <Copy className="h-4 w-4" />
                      )}
                    </button>
                  </div>
                </div>

                <div>
                  <label className="text-sm font-semibold text-gray-600 dark:text-gray-400">{t.donate.branch}</label>
                  <div className="mt-2 p-3 bg-gray-100 dark:bg-gray-800 rounded">
                    <span className="font-mono">{bankingDetails.branch}</span>
                  </div>
                </div>
              </div>
            </Card>

            {/* UPI and QR Code Card */}
            <Card className="p-8 border-2 border-blue-200 dark:border-blue-800 flex flex-col items-center justify-center">
              <QrCode className="h-16 w-16 text-blue-600 mb-4" />
              <h3 className="text-xl font-bold mb-4 text-blue-700 dark:text-blue-400">Quick Payment</h3>
              <div className="w-full mb-6">
                <div className="bg-gray-100 dark:bg-gray-800 p-4 rounded-lg mb-4">
                  <p className="text-center text-sm text-gray-600 dark:text-gray-400 mb-2">UPI ID:</p>
                  <p className="text-center font-mono font-bold">{bankingDetails.upiId}</p>
                </div>
              </div>
              <div className="w-full bg-gradient-to-br from-purple-100 to-blue-100 dark:from-purple-900/30 dark:to-blue-900/30 p-6 rounded-lg text-center">
                <p className="text-sm text-gray-600 dark:text-gray-400 mb-3">Scan QR Code or use UPI ID above</p>
                <div className="bg-white dark:bg-gray-800 p-4 rounded inline-block">
                  <div className="w-40 h-40 bg-gradient-to-br from-purple-200 to-blue-200 rounded flex items-center justify-center">
                    <span className="text-gray-500 text-center text-sm">QR Code Placeholder</span>
                  </div>
                </div>
              </div>
            </Card>
          </div>
        </section>

        {/* Articles Section */}
        <section>
          <h2 className="text-3xl font-bold mb-2">
            {t.donate.articlesSection}
          </h2>
          <p className="text-gray-600 dark:text-gray-400 mb-8">
            Stay updated with latest agricultural practices, government schemes, and farming innovations.
          </p>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {articles.map((article) => (
              <Card
                key={article.id}
                className="overflow-hidden hover:shadow-lg transition-shadow cursor-pointer"
                onClick={() => setSelectedArticle(article)}
              >
                <div className="h-48 bg-gradient-to-br from-green-200 to-emerald-200 overflow-hidden">
                  <img
                    src={article.image}
                    alt={article.title}
                    className="w-full h-full object-cover hover:scale-105 transition-transform"
                  />
                </div>
                <div className="p-5">
                  <div className="flex items-center gap-2 mb-3">
                    <Tag className="h-4 w-4 text-green-600" />
                    <span className="text-xs font-semibold text-green-600 dark:text-green-400">
                      {article.category}
                    </span>
                  </div>
                  <h3 className="font-bold text-lg mb-2 line-clamp-2">{article.title}</h3>
                  <p className="text-sm text-gray-600 dark:text-gray-400 mb-4 line-clamp-2">
                    {article.description}
                  </p>
                  <div className="flex items-center justify-between text-xs text-gray-500 dark:text-gray-500">
                    <span className="flex items-center gap-1">
                      <Calendar className="h-3 w-3" />
                      {new Date(article.date).toLocaleDateString()}
                    </span>
                    <span>{article.author}</span>
                  </div>
                  <Button variant="ghost" size="sm" className="w-full mt-4 text-green-600 hover:text-green-700">
                    {t.donate.readMore}
                    <ArrowRight className="h-3 w-3 ml-2" />
                  </Button>
                </div>
              </Card>
            ))}
          </div>
        </section>
      </div>

      {/* Article Modal */}
      {selectedArticle && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4 overflow-y-auto">
          <Card className="max-w-3xl w-full my-8">
            <div className="h-96 bg-gradient-to-br from-green-200 to-emerald-200">
              <img
                src={selectedArticle.image}
                alt={selectedArticle.title}
                className="w-full h-full object-cover"
              />
            </div>
            <div className="p-8">
              <div className="flex items-center justify-between mb-4">
                <span className="inline-block px-3 py-1 bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-400 rounded-full text-sm font-semibold">
                  {selectedArticle.category}
                </span>
                <span className="text-sm text-gray-500 flex items-center gap-2">
                  <Calendar className="h-4 w-4" />
                  {new Date(selectedArticle.date).toLocaleDateString()}
                </span>
              </div>
              <h2 className="text-3xl font-bold mb-2">{selectedArticle.title}</h2>
              <p className="text-gray-600 dark:text-gray-400 mb-6">By {selectedArticle.author}</p>
              <div className="prose dark:prose-invert max-w-none mb-6 whitespace-pre-wrap text-gray-700 dark:text-gray-300">
                {selectedArticle.content}
              </div>
              <div className="flex gap-3">
                <Button variant="outline" size="sm" className="flex items-center gap-2">
                  <Share2 className="h-4 w-4" />
                  {t.donate.shareArticle}
                </Button>
                <Button
                  onClick={() => setSelectedArticle(null)}
                  className="ml-auto"
                >
                  Close
                </Button>
              </div>
            </div>
          </Card>
        </div>
      )}
    </div>
  );
}
