'use client';

import React, { useState, useRef } from 'react';
import { useParams } from 'next/navigation';
import type { Locale } from '@/i18n.config';
import { getTranslation } from '@/lib/translations';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Upload, Loader, AlertCircle, CheckCircle, Leaf, Droplets } from 'lucide-react';

interface DiseaseAnalysis {
  disease: string;
  confidence: number;
  description: string;
  symptoms: string[];
  treatment: string[];
  prevention: string[];
}

export default function PlantDiseasePage() {
  const params = useParams();
  const locale = (params?.locale as Locale) || 'en';
  const [image, setImage] = useState<string | null>(null);
  const [analysis, setAnalysis] = useState<DiseaseAnalysis | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const fileInputRef = useRef<HTMLInputElement>(null);

  const t = getTranslation(locale);

  const handleImageUpload = async (file: File) => {
    if (!file.type.startsWith('image/')) {
      setError('Please upload an image file');
      return;
    }

    const reader = new FileReader();
    reader.onload = async (e) => {
      const base64 = e.target?.result as string;
      setImage(base64);
      setError('');
      setAnalysis(null);
      
      await analyzeImage(base64);
    };
    reader.readAsDataURL(file);
  };

  const analyzeImage = async (imageBase64: string) => {
    setIsLoading(true);
    setError('');

    try {
      const response = await fetch('/api/plant-disease', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          imageBase64,
          language: locale,
        }),
      });

      if (!response.ok) throw new Error('Analysis failed');

      const data = await response.json();
      setAnalysis(data);
    } catch (err) {
      console.error('[v0] Analysis error:', err);
      setError('Failed to analyze image. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    e.currentTarget.classList.add('border-primary', 'bg-primary/5');
  };

  const handleDragLeave = (e: React.DragEvent) => {
    e.currentTarget.classList.remove('border-primary', 'bg-primary/5');
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.currentTarget.classList.remove('border-primary', 'bg-primary/5');
    const file = e.dataTransfer.files[0];
    if (file) handleImageUpload(file);
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Hero Section */}
      <div className="border-b border-border bg-gradient-to-r from-green-500/10 to-emerald-600/10 px-4 py-8 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-7xl">
          <h1 className="text-3xl font-bold text-foreground">Plant Disease Detection</h1>
          <p className="mt-2 text-muted-foreground">Upload a photo of a plant leaf to diagnose diseases and get treatment recommendations</p>
        </div>
      </div>

      <div className="mx-auto max-w-4xl px-4 py-8 sm:px-6 lg:px-8">
        {/* Upload Section */}
        <Card className="mb-8 p-6">
          <div
            onDragOver={handleDragOver}
            onDragLeave={handleDragLeave}
            onDrop={handleDrop}
            className="border-2 border-dashed border-border rounded-lg p-8 text-center cursor-pointer transition-colors hover:border-primary"
            onClick={() => fileInputRef.current?.click()}
          >
            <input
              ref={fileInputRef}
              type="file"
              accept="image/*"
              onChange={(e) => e.target.files?.[0] && handleImageUpload(e.target.files[0])}
              className="hidden"
            />
            
            <div className="flex flex-col items-center gap-4">
              <div className="rounded-full bg-primary/10 p-4">
                <Upload className="h-6 w-6 text-primary" />
              </div>
              <div>
                <p className="text-lg font-semibold text-foreground">Drag and drop your plant leaf image</p>
                <p className="text-sm text-muted-foreground mt-1">or click to browse</p>
              </div>
              <Button variant="outline">Choose Image</Button>
            </div>
          </div>
        </Card>

        {/* Image Preview and Analysis */}
        {image && (
          <div className="grid gap-8 md:grid-cols-2">
            {/* Image Preview */}
            <Card className="p-6">
              <h3 className="font-semibold mb-4">Uploaded Image</h3>
              <img src={image} alt="Plant leaf" className="w-full rounded-lg border border-border" />
            </Card>

            {/* Analysis Results */}
            <div className="space-y-6">
              {isLoading ? (
                <Card className="p-8 flex items-center justify-center gap-3">
                  <Loader className="h-5 w-5 animate-spin text-primary" />
                  <span className="text-foreground">Analyzing image...</span>
                </Card>
              ) : error ? (
                <Card className="p-6 border-red-200 bg-red-50 dark:bg-red-950">
                  <div className="flex items-start gap-3">
                    <AlertCircle className="h-5 w-5 text-red-600 flex-shrink-0 mt-0.5" />
                    <p className="text-sm text-red-800 dark:text-red-200">{error}</p>
                  </div>
                </Card>
              ) : analysis ? (
                <>
                  {/* Disease Info */}
                  <Card className="p-6 border-green-200 bg-green-50 dark:bg-green-950">
                    <div className="flex items-start gap-3 mb-4">
                      <CheckCircle className="h-5 w-5 text-green-600 flex-shrink-0 mt-0.5" />
                      <div>
                        <h4 className="font-semibold text-green-900 dark:text-green-100">{analysis.disease}</h4>
                        <p className="text-sm text-green-800 dark:text-green-200 mt-1">{analysis.description}</p>
                        <div className="mt-3 bg-green-200 dark:bg-green-800 rounded px-3 py-1 inline-block">
                          <span className="text-xs font-semibold text-green-900 dark:text-green-100">
                            Confidence: {(analysis.confidence * 100).toFixed(0)}%
                          </span>
                        </div>
                      </div>
                    </div>
                  </Card>

                  {/* Symptoms */}
                  <Card className="p-6">
                    <h4 className="font-semibold mb-3 flex items-center gap-2">
                      <AlertCircle className="h-4 w-4 text-orange-500" />
                      Symptoms
                    </h4>
                    <ul className="space-y-2">
                      {analysis.symptoms.map((symptom, idx) => (
                        <li key={idx} className="flex items-start gap-2 text-sm">
                          <span className="text-orange-500 mt-1">•</span>
                          <span className="text-foreground">{symptom}</span>
                        </li>
                      ))}
                    </ul>
                  </Card>

                  {/* Treatment */}
                  <Card className="p-6">
                    <h4 className="font-semibold mb-3 flex items-center gap-2">
                      <Leaf className="h-4 w-4 text-green-600" />
                      Treatment
                    </h4>
                    <ul className="space-y-2">
                      {analysis.treatment.map((treatment, idx) => (
                        <li key={idx} className="flex items-start gap-2 text-sm">
                          <span className="text-green-600 mt-1">✓</span>
                          <span className="text-foreground">{treatment}</span>
                        </li>
                      ))}
                    </ul>
                  </Card>

                  {/* Prevention */}
                  <Card className="p-6">
                    <h4 className="font-semibold mb-3 flex items-center gap-2">
                      <Droplets className="h-4 w-4 text-blue-600" />
                      Prevention
                    </h4>
                    <ul className="space-y-2">
                      {analysis.prevention.map((prevention, idx) => (
                        <li key={idx} className="flex items-start gap-2 text-sm">
                          <span className="text-blue-600 mt-1">→</span>
                          <span className="text-foreground">{prevention}</span>
                        </li>
                      ))}
                    </ul>
                  </Card>

                  <Button onClick={() => fileInputRef.current?.click()} className="w-full">
                    Analyze Another Image
                  </Button>
                </>
              ) : null}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
