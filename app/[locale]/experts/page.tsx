'use client';

import React, { useState, useMemo } from 'react';
import { useParams } from 'next/navigation';
import type { Locale } from '@/i18n.config';
import { getTranslation } from '@/lib/translations';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import expertsData from '@/data/experts.json';
import { Phone, Mail, MapPin, Award, Search, Trophy } from 'lucide-react';

interface Expert {
  id: number;
  name: string;
  qualification: string;
  specialty: string;
  experience: number;
  state: string;
  district: string;
  phone: string;
  email: string;
  serviceArea: string[];
  languages: string[];
}

export default function AgriExpertsPage() {
  const params = useParams();
  const locale = (params?.locale as Locale) || 'en';
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedState, setSelectedState] = useState('');
  const [selectedSpecialty, setSelectedSpecialty] = useState('');

  const t = getTranslation(locale);

  const experts: Expert[] = expertsData.experts;

  const states = useMemo(() => 
    Array.from(new Set(experts.map((e) => e.state))).sort(), 
    [experts]
  );

  const specialties = useMemo(() => 
    Array.from(new Set(experts.map((e) => e.specialty))).sort(), 
    [experts]
  );

  const filteredExperts = useMemo(() => {
    return experts.filter((expert) => {
      const matchesSearch =
        expert.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        expert.specialty.toLowerCase().includes(searchTerm.toLowerCase()) ||
        expert.qualification.toLowerCase().includes(searchTerm.toLowerCase());

      const matchesState = !selectedState || expert.state === selectedState;
      const matchesSpecialty = !selectedSpecialty || expert.specialty === selectedSpecialty;

      return matchesSearch && matchesState && matchesSpecialty;
    });
  }, [searchTerm, selectedState, selectedSpecialty, experts]);

  return (
    <div className="min-h-screen bg-background">
      {/* Hero Section */}
      <div className="relative bg-gradient-to-r from-green-500 to-emerald-600 px-4 py-12 sm:px-6 lg:px-8 text-white">
        <div className="mx-auto max-w-4xl">
          <h1 className="text-balance text-3xl font-bold sm:text-4xl">Agricultural Experts Directory</h1>
          <p className="mt-2 text-lg opacity-90">
            Connect with government-approved agricultural experts across India
          </p>
        </div>
      </div>

      {/* Filters Section */}
      <div className="mx-auto max-w-6xl px-4 py-8 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4 mb-6">
          {/* Search */}
          <div>
            <label className="block text-sm font-medium mb-2">Search Expert</label>
            <div className="relative">
              <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Name, specialty..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>
          </div>

          {/* State Filter */}
          <div>
            <label className="block text-sm font-medium mb-2">State</label>
            <select
              value={selectedState}
              onChange={(e) => setSelectedState(e.target.value)}
              className="w-full rounded-md border border-input bg-background px-3 py-2"
            >
              <option value="">All States</option>
              {states.map((state) => (
                <option key={state} value={state}>
                  {state}
                </option>
              ))}
            </select>
          </div>

          {/* Specialty Filter */}
          <div>
            <label className="block text-sm font-medium mb-2">Specialty</label>
            <select
              value={selectedSpecialty}
              onChange={(e) => setSelectedSpecialty(e.target.value)}
              className="w-full rounded-md border border-input bg-background px-3 py-2"
            >
              <option value="">All Specialties</option>
              {specialties.map((specialty) => (
                <option key={specialty} value={specialty}>
                  {specialty}
                </option>
              ))}
            </select>
          </div>

          {/* Reset Filters */}
          <div className="flex items-end">
            <Button
              variant="outline"
              onClick={() => {
                setSearchTerm('');
                setSelectedState('');
                setSelectedSpecialty('');
              }}
              className="w-full"
            >
              Reset Filters
            </Button>
          </div>
        </div>

        {/* Results Count */}
        <div className="mb-6">
          <p className="text-sm text-muted-foreground">
            Found <span className="font-semibold text-foreground">{filteredExperts.length}</span> expert(s)
          </p>
        </div>

        {/* Experts Grid */}
        <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
          {filteredExperts.length === 0 ? (
            <div className="col-span-full text-center py-12">
              <p className="text-muted-foreground">No experts found matching your criteria.</p>
            </div>
          ) : (
            filteredExperts.map((expert) => (
              <Card
                key={expert.id}
                className="overflow-hidden hover:shadow-lg transition-shadow flex flex-col"
              >
                {/* Header */}
                <div className="bg-gradient-to-r from-green-500/10 to-emerald-500/10 p-6 border-b">
                  <h3 className="font-bold text-lg leading-tight mb-1">{expert.name}</h3>
                  <p className="text-sm text-muted-foreground flex items-center gap-1">
                    <Award className="h-4 w-4" />
                    {expert.qualification}
                  </p>
                </div>

                {/* Content */}
                <div className="p-6 flex-1 space-y-4">
                  {/* Specialty */}
                  <div>
                    <p className="text-sm font-semibold text-green-600 mb-1">Specialty</p>
                    <p className="text-sm">{expert.specialty}</p>
                  </div>

                  {/* Experience */}
                  <div>
                    <p className="text-sm font-semibold text-green-600 mb-1">Experience</p>
                    <p className="text-sm flex items-center gap-1">
                      <Trophy className="h-4 w-4" />
                      {expert.experience} years
                    </p>
                  </div>

                  {/* Location */}
                  <div>
                    <p className="text-sm font-semibold text-green-600 mb-1">Location</p>
                    <p className="text-sm flex items-center gap-1">
                      <MapPin className="h-4 w-4" />
                      {expert.district}, {expert.state}
                    </p>
                  </div>

                  {/* Languages */}
                  <div>
                    <p className="text-sm font-semibold text-green-600 mb-1">Languages</p>
                    <div className="flex flex-wrap gap-1">
                      {expert.languages.map((lang) => (
                        <span
                          key={lang}
                          className="px-2 py-1 bg-green-100 dark:bg-green-900 text-green-700 dark:text-green-300 text-xs rounded-full"
                        >
                          {lang}
                        </span>
                      ))}
                    </div>
                  </div>

                  {/* Service Areas */}
                  <div>
                    <p className="text-sm font-semibold text-green-600 mb-1">Serves</p>
                    <p className="text-sm">{expert.serviceArea.join(', ')}</p>
                  </div>
                </div>

                {/* Footer - Contact */}
                <div className="border-t p-4 space-y-2 bg-gray-50 dark:bg-gray-900">
                  <a href={`tel:${expert.phone}`}>
                    <Button size="sm" className="w-full bg-green-600 hover:bg-green-700">
                      <Phone className="h-4 w-4 mr-2" />
                      Call: {expert.phone}
                    </Button>
                  </a>
                  <a href={`mailto:${expert.email}`}>
                    <Button size="sm" variant="outline" className="w-full">
                      <Mail className="h-4 w-4 mr-2" />
                      Email
                    </Button>
                  </a>
                </div>
              </Card>
            ))
          )}
        </div>
      </div>
    </div>
  );
}
