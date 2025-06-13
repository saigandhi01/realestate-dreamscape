
import React, { useEffect, useRef, useState } from 'react';
import mapboxgl from 'mapbox-gl';
import 'mapbox-gl/dist/mapbox-gl.css';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { MapPin } from 'lucide-react';
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

interface PropertyLocationMapProps {
  propertyName: string;
  propertyLocation: string;
}

const PropertyLocationMap = ({ propertyName, propertyLocation }: PropertyLocationMapProps) => {
  const mapContainer = useRef<HTMLDivElement>(null);
  const map = useRef<mapboxgl.Map | null>(null);
  const [mapboxToken, setMapboxToken] = useState('');
  const [showTokenInput, setShowTokenInput] = useState(true);

  // Mock coordinates for demo - in real app, these would come from geocoding
  const getCoordinatesFromLocation = (location: string) => {
    const locationMap: { [key: string]: [number, number] } = {
      'Milwaukee, WI': [-87.9065, 43.0389],
      'Richmond, VA': [-77.4360, 37.5407],
      'Birmingham, AL': [-86.8025, 33.5186],
      'Indianapolis, IN': [-86.1581, 39.7684],
      'Memphis, TN': [-90.0490, 35.1495],
      'Baltimore, MD': [-76.6122, 39.2904],
    };
    
    return locationMap[location] || [-74.006, 40.7128]; // Default to NYC
  };

  const initializeMap = () => {
    if (!mapContainer.current || !mapboxToken.trim()) return;

    try {
      mapboxgl.accessToken = mapboxToken;
      
      const coordinates = getCoordinatesFromLocation(propertyLocation);
      
      map.current = new mapboxgl.Map({
        container: mapContainer.current,
        style: 'mapbox://styles/mapbox/light-v11',
        center: coordinates,
        zoom: 14,
      });

      // Add marker for property location
      new mapboxgl.Marker({ color: '#3b82f6' })
        .setLngLat(coordinates)
        .setPopup(
          new mapboxgl.Popup({ offset: 25 })
            .setHTML(`<h3>${propertyName}</h3><p>${propertyLocation}</p>`)
        )
        .addTo(map.current);

      // Add navigation controls
      map.current.addControl(new mapboxgl.NavigationControl(), 'top-right');

      setShowTokenInput(false);
    } catch (error) {
      console.error('Error initializing map:', error);
    }
  };

  useEffect(() => {
    return () => {
      map.current?.remove();
    };
  }, []);

  const handleTokenSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    initializeMap();
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center">
          <MapPin className="mr-2 h-5 w-5" />
          Property Location
        </CardTitle>
      </CardHeader>
      <CardContent>
        {showTokenInput ? (
          <form onSubmit={handleTokenSubmit} className="space-y-4">
            <div>
              <Label htmlFor="mapbox-token">Mapbox Public Token</Label>
              <Input
                id="mapbox-token"
                type="text"
                placeholder="Enter your Mapbox public token"
                value={mapboxToken}
                onChange={(e) => setMapboxToken(e.target.value)}
                className="mt-1"
              />
              <p className="text-xs text-muted-foreground mt-1">
                Get your token from <a href="https://mapbox.com/" target="_blank" rel="noopener noreferrer" className="text-primary hover:underline">mapbox.com</a>
              </p>
            </div>
            <button
              type="submit"
              className="bg-primary text-primary-foreground px-4 py-2 rounded-md hover:bg-primary/90 transition-colors"
            >
              Load Map
            </button>
          </form>
        ) : (
          <div 
            ref={mapContainer} 
            className="w-full h-64 rounded-lg border"
          />
        )}
      </CardContent>
    </Card>
  );
};

export default PropertyLocationMap;
