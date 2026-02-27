'use client';

import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Phone, X, MapPin, Award } from 'lucide-react';
import expertsData from '@/data/experts.json';

interface StateExpertModalProps {
  isOpen: boolean;
  onClose: () => void;
}

interface StateExpert {
  state: string;
  experts: Array<{
    id: number;
    name: string;
    phone: string;
    specialty: string;
    experience: number;
  }>;
}

export default function StateExpertModal({ isOpen, onClose }: StateExpertModalProps) {
  const [selectedState, setSelectedState] = useState('');
  const [stateExperts, setStateExperts] = useState<StateExpert[]>([]);
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    // Group experts by state
    const groupedByState: Record<string, StateExpert['experts']> = {};
    
    expertsData.experts.forEach((expert) => {
      if (!groupedByState[expert.state]) {
        groupedByState[expert.state] = [];
      }
      groupedByState[expert.state].push({
        id: expert.id,
        name: expert.name,
        phone: expert.phone,
        specialty: expert.specialty,
        experience: expert.experience,
      });
    });

    const organized = Object.entries(groupedByState)
      .map(([state, experts]) => ({
        state,
        experts,
      }))
      .sort((a, b) => a.state.localeCompare(b.state));

    setStateExperts(organized);
  }, []);

  const filteredStates = stateExperts.filter(
    (stateData) =>
      stateData.state.toLowerCase().includes(searchTerm.toLowerCase()) ||
      stateData.experts.some((expert) =>
        expert.name.toLowerCase().includes(searchTerm.toLowerCase())
      )
  );

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
      <Card className="w-full max-w-2xl max-h-[90vh] overflow-hidden flex flex-col">
        {/* Header */}
        <div className="bg-gradient-to-r from-green-500 to-emerald-600 p-6 text-white flex items-center justify-between">
          <div>
            <h2 className="text-2xl font-bold">Call Agricultural Expert</h2>
            <p className="text-sm text-green-100 mt-1">Select your state to find local experts</p>
          </div>
          <button
            onClick={onClose}
            className="hover:bg-white/20 rounded-full p-2 transition-colors"
          >
            <X className="h-6 w-6" />
          </button>
        </div>

        {/* Search */}
        <div className="p-4 border-b">
          <Input
            placeholder="Search state or expert name..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full"
          />
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto p-4 space-y-4">
          {filteredStates.length === 0 ? (
            <div className="text-center py-8 text-muted-foreground">
              <p>No states or experts found matching your search.</p>
            </div>
          ) : (
            filteredStates.map((stateData) => (
              <div key={stateData.state} className="border rounded-lg overflow-hidden">
                <div className="bg-gray-50 dark:bg-gray-900 p-3 border-b">
                  <h3 className="font-semibold text-lg flex items-center gap-2">
                    <MapPin className="h-5 w-5 text-green-600" />
                    {stateData.state}
                  </h3>
                </div>
                <div className="p-3 space-y-2">
                  {stateData.experts.map((expert) => (
                    <div
                      key={expert.id}
                      className="flex items-start justify-between p-3 bg-gray-50 dark:bg-gray-900 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
                    >
                      <div className="flex-1">
                        <p className="font-semibold text-foreground">{expert.name}</p>
                        <p className="text-sm text-muted-foreground flex items-center gap-1 mt-1">
                          <Award className="h-4 w-4" />
                          {expert.specialty}
                        </p>
                        <p className="text-xs text-muted-foreground mt-1">
                          Experience: {expert.experience} years
                        </p>
                      </div>
                      <a href={`tel:${expert.phone}`}>
                        <Button
                          size="sm"
                          className="bg-green-600 hover:bg-green-700 whitespace-nowrap ml-3"
                        >
                          <Phone className="h-4 w-4 mr-1" />
                          Call
                        </Button>
                      </a>
                    </div>
                  ))}
                </div>
              </div>
            ))
          )}
        </div>

        {/* Footer */}
        <div className="border-t p-4 bg-gray-50 dark:bg-gray-900 flex justify-end gap-2">
          <Button variant="outline" onClick={onClose}>
            Close
          </Button>
        </div>
      </Card>
    </div>
  );
}
