import React, { useState, useEffect } from 'react';
import { createRoot } from 'react-dom/client';
import "./styles.css";

// Base URL for the Express API
const API_URL = 'http://localhost:3001/api/locations';

// --- UTILITY ---
const formatDateTime = (isoString) => {
    if (!isoString) return 'TBD';
    const date = new Date(isoString);
    // Format: MM/DD/YYYY at HH:MM AM/PM
    return date.toLocaleDateString() + ' at ' + date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
};

// Function to safely format text for the placeholder URL's text parameter
const formatPlaceholderText = (text) => {
    // 1. URL encode the string to handle special characters (&, ?, /)
    // 2. Then, replace standard URL-encoded spaces (%20) with '+' signs, 
    //    which placeholder services often prefer for the visible text part.
    // Ensure text is not null before using replace
    if (!text) return 'Placeholder';
    return encodeURIComponent(text).replace(/%20/g, '+');
};

// --- COMPONENTS ---

/**
 * HomeView component displays the grid of all locations.
 * @param {object} props - Contains state setters for navigation.
 */
const HomeView = ({ setLocationId, setPage }) => {
    const [locations, setLocations] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchLocations = async () => {
            try {
                const response = await fetch(API_URL);
                if (!response.ok) {
                    throw new Error(`HTTP error! status: ${response.status}`);
                }
                const data = await response.json();
                setLocations(data);
            } catch (err) {
                console.error("Failed to fetch locations:", err);
                setError('Failed to load locations. Please ensure the backend is running on port 3001.');
            } finally {
                setLoading(false);
            }
        };

        fetchLocations();
    }, []);

    const handleCardClick = (id) => {
        // Ensure ID is passed as a string when setting state for detail view
        setLocationId(id.toString());
        setPage('detail');
    };

    if (loading) {
        return <div className="loading">Loading locations...</div>;
    }

    if (error) {
        return <div className="error">{error}</div>;
    }

    return (
        <div className="home-container">
            {/* The main header uses .home-container header selector in styles.css */}
            <header>
                <h1 className="main-heading">Aura Nexus Colony Sector Directory</h1>
                <p>Explore the hubs and facilities that keep the colony operational.</p>
            </header>
            
            {/* The main content grid uses #main-content selector in styles.css */}
            <div id="main-content">
                {locations.length > 0 ? (
                    locations.map(location => (
                        <div
                            key={location.id}
                            className="location-card" 
                            onClick={() => handleCardClick(location.id)}
                            role="button"
                            tabIndex="0"
                        >
                            {/* NOTE: You likely need a location.image_url property here for the image to show */}
                            {/* <img src={location.image_url || 'placeholder.jpg'} alt={location.name} /> */}
                            
                            <div className="card-content">
                                <h2>{location.name}</h2>
                                {/* CRITICAL FIX: Use .toString() on location.id to allow .substring() */}
                                <span className="sector-tag">
                                    Sector {location.id.toString().substring(0, 4).toUpperCase()}
                                </span> 
                                <p>{location.description}</p>
                                <span className="card-link">View Details &rarr;</span>
                            </div>
                        </div>
                    ))
                ) : (
                    <div className="no-data">No locations found. Check your database setup.</div>
                )}
            </div>
        </div>
    );
};

/**
 * LocationDetailView component displays details for a single location and its events.
 * @param {object} props - Contains the locationId and state setters for navigation.
 */
const LocationDetailView = ({ locationId, setPage }) => {
    const [location, setLocation] = useState(null);
    const [events, setEvents] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        if (!locationId) return;

        const fetchDetail = async () => {
            setLoading(true);
            setError(null);
            try {
                // Ensure locationId is treated as a string for the URL
                const url = `${API_URL}/${locationId}`;
                
                const response = await fetch(url);
                
                if (!response.ok) {
                    throw new Error(`HTTP error! status: ${response.status}`);
                }
                
                const data = await response.json();
                
                // Handling two possible API response formats
                const locationData = data.location || data;
                // Ensure events array is an array, defaulting to empty array if undefined/null
                const eventData = Array.isArray(data.events) ? data.events : [];
                
                setLocation(locationData);
                setEvents(eventData);

            } catch (err) {
                console.error("Failed to fetch location detail or parse response:", err);
                setError('Failed to load details. Check the console for API errors.');
                setLocation(null);
                setEvents([]);
            } finally {
                setLoading(false);
            }
        };

        fetchDetail();
    }, [locationId]);

    if (loading) {
        return <div className="loading-state">Loading location details...</div>;
    }

    if (error) {
        return <div className="error-state">{error}</div>;
    }

    if (!location) {
        return <div className="error-state">Location data not available. Check the server response.</div>;
    }
    
    // Function to map event type to CSS class for styling
    const getEventTypeClass = (type) => {
        // Ensure type is a string before calling toLowerCase()
        const normalizedType = type ? type.toLowerCase() : ''; 
        if (normalizedType.includes('wellness')) return 'event-type-wellness';
        if (normalizedType.includes('education')) return 'event-type-education';
        if (normalizedType.includes('social')) return 'event-type-social';
        if (normalizedType.includes('sport')) return 'event-type-sport';
        return 'event-type-meeting'; // Default
    };
    
    // Use the function to format text for the placeholder URL
    const placeholderText = formatPlaceholderText(location.name);


    return (
        <div className="detail-container">
            <button className="back-button" onClick={() => setPage('home')}>
                &larr; Back to Locations
            </button>

            <header className="detail-header">
                <h1>{location.name}</h1>
                {/* Ensure the ID passed to the Detail View is a string here too */}
                <p className="sector-code-large">
                    Sector {locationId.toString().substring(0, 4).toUpperCase()}
                </p>
            </header>
            
            <img 
                // Image source uses the reliably formatted placeholder text
                // Added a fallback for location.name in the alt tag for safety
                src={location.image_url || `https://placehold.co/1000x400/1a202c/ffffff?text=${placeholderText}`} 
                alt={location.name || "Location Image"} 
                className="location-image" 
            />

            <section className="location-info">
                <p className="location-description">{location.description}</p>
            </section>

            <section className="events-list">
                <h2>Upcoming Events</h2>
                {events.length > 0 ? (
                    events.map(event => (
                        <div 
                            key={event.id} 
                            // Ensure event_type is present before calling the class function
                            className={`event-card ${getEventTypeClass(event.event_type || 'General')}`}
                        >
                            <span className={`event-type-tag ${getEventTypeClass(event.event_type || 'General')}`}>
                                {event.event_type || 'General'}
                            </span>
                            <h3>{event.title || 'Untitled Event'}</h3>
                            <p className="event-details">
                                <span role="img" aria-label="clock">⏰</span> {formatDateTime(event.start_date)}
                            </p>
                            <p>{event.details || 'No additional details provided.'}</p>
                        </div>
                    ))
                ) : (
                    <div className="no-events">No upcoming events scheduled here yet.</div>
                )}
            </section>
        </div>
    );
};


/**
 * App component handles routing and overall application state.
 */
const App = () => {
    const [page, setPage] = useState('home'); // 'home' or 'detail'
    const [locationId, setLocationId] = useState(null); // ID of the location to show in detail view

    // Handle initial route check (optional, but good practice if loading deep link)
    useEffect(() => {
        // Simple check to ensure we start at 'home' if no location is specified
        if (!locationId && page !== 'home') {
             setPage('home');
        }
    }, [locationId, page]);

    return (
        <div className="app-container">
            {page === 'home' && (
                <HomeView setLocationId={setLocationId} setPage={setPage} />
            )}
            {page === 'detail' && locationId && (
                <LocationDetailView locationId={locationId} setPage={setPage} />
            )}
        </div>
    );
};

export default App;
