import React, { useState, useEffect } from 'react';
import { fetchUserStats } from '../utils/api';

const SearchWindow = ({ onSearch, initialUsername, isLoading, currentUsername }) => {
    const [username, setUsername] = useState(initialUsername || '');
    const [error, setError] = useState('');

    useEffect(() => {
        if (initialUsername) {
            setUsername(initialUsername);
        }
    }, [initialUsername]);

    const handleSearch = async () => {
        // Clear any previous errors
        setError('');

        // Check if the username is empty
        if (!username.trim()) {
            setError('Please enter a username');
            return;
        }

        // Check if the username is too long
        if (username.length > 50) {
            setError('Username is too long!');
            return;
        }

        // Check if the searched username is the same as the current one
        if (currentUsername && username.trim().toLowerCase() === currentUsername.trim().toLowerCase()) {
            setError('This user is already loaded!');
            return;
        }

        try {
            await fetchUserStats(username);
            onSearch(username);
        } catch (error) {
            setError("User doesn't exist");
        }
    };

    return (
        <div className="window" style={{ width: '200px' }}>
            <div className="title-bar">
                <div className="title-bar-text">Search</div>
                <div className="title-bar-controls">
                    <button aria-label="Minimize"></button>
                    <button aria-label="Maximize"></button>
                    <button aria-label="Close"></button>
                </div>
            </div>
            <div className="window-body">
                <div className="search-container">
                    <div className="searchForm">
                        <input 
                            type="text" 
                            maxLength={50}
                            id="searchBox" 
                            value={username}
                            onChange={(e) => setUsername(e.target.value)}
                        />
                        <label htmlFor="searchBox">
                            Search users
                        </label>
                    </div>
                    <button onClick={handleSearch} disabled={isLoading}>Search</button>
                    {error && <p className="error-message">{error}</p>}
                </div>
            </div>
        </div>
    );
};

export default SearchWindow;