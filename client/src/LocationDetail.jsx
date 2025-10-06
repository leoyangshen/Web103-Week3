import React, { useState, useEffect } from 'react';

const API_BASE_URL = 'http://localhost:3001/api';

const LocationDetail = ({ locationId, navigate }) => {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchLocationDetails = async () => {
      try {
        // Fetch data from the detail endpoint: /api/locations/:id
        const response = await fetch(`${API_BASE_URL}/locations/${locationId}`);
        
        if (response.status === 404) {
          throw new Error("Location not found.");
        }
        if (!response.ok) {
          throw new Error(`API error! Status: ${response.status}`);
        }
        
        const fetchedData = await response.json();
        setData(fetchedData);
      } catch (e) {
        console.error("Failed to fetch location details:", e);
        setError(e.message || "An unknown error occurred while fetching details.");
      } finally {
        setLoading(false);
      }
    };
    fetchLocationDetails();
  }, [locationId]); // Rerun when locationId changes

  if (loading) {
    return <div className="text-center py-10 text-indigo-400">Retrieving Location Data and Events...</div>;
  }

  if (error) {
    return (
      <div className="text-center py-10">
        <p className="text-red-400 font-bold text-xl mb-4">Error: {error}</p>
        <button
          onClick={() => navigate('home')}
          className="px-6 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-500 transition"
        >
          Go Back
        </button>
      </div>
    );
  }
  
  const { location, events } = data;

  // Helper to format the start_date string
  const formatDate = (dateString) => {
    if (!dateString) return 'TBA';
    try {
        return new Date(dateString).toLocaleString('en-US', {
            year: 'numeric',
            month: 'short',
            day: 'numeric',
            hour: '2-digit',
            minute: '2-digit'
        });
    } catch {
        return dateString;
    }
  };

  return (
    <div className="space-y-10">
      {/* Location Details Header */}
      <section className="bg-gray-800 rounded-xl shadow-2xl p-6 md:p-10 flex flex-col md:flex-row gap-6">
        <div className="md:w-1/3">
          <img
            src={location.image_url}
            alt={location.name}
            className="w-full h-auto max-h-64 object-cover rounded-lg shadow-lg"
            onError={(e) => {
              e.target.onerror = null; 
              e.target.src = `https://placehold.co/400x300/6B7280/ffffff?text=${location.sector_code}`;
              e.target.style.objectFit = 'contain';
            }}
          />
        </div>
        <div className="md:w-2/3">
          <span className="text-sm font-bold text-teal-400 bg-teal-900 px-4 py-1 rounded-full uppercase">
            Sector {location.sector_code}
          </span>
          <h2 className="text-4xl font-extrabold mt-3 text-indigo-300">{location.name}</h2>
          <p className="text-gray-400 mt-4 leading-relaxed">{location.description}</p>
          
        </div>
      </section>

      {/* Events List */}
      <section>
        <h3 className="text-3xl font-bold mb-6 text-indigo-200 border-b border-indigo-700 pb-2">
          Scheduled Events ({events.length})
        </h3>
        
        {events.length === 0 ? (
          <p className="text-gray-500 italic p-6 bg-gray-800 rounded-lg">
            No active events are currently scheduled for this location.
          </p>
        ) : (
          <div className="space-y-4">
            {events.map((event) => (
              <div key={event.id} className="bg-gray-800 p-5 rounded-xl shadow-lg border-l-4 border-indigo-500 transition hover:bg-gray-700/50">
                <div className="flex justify-between items-start">
                  <div>
                    <h4 className="text-xl font-semibold text-white">{event.title}</h4>
                    <p className="text-sm text-indigo-400 mt-1">
                      {event.organizer} | Type: {event.event_type}
                    </p>
                  </div>
                  <div className="text-right">
                    <p className="text-sm font-medium bg-gray-600 px-3 py-1 rounded-full">
                      {formatDate(event.start_date)}
                    </p>
                  </div>
                </div>
                <p className="text-gray-400 mt-3">{event.details}</p>
              </div>
            ))}
          </div>
        )}
      </section>
    </div>
  );
};

export default LocationDetail;

