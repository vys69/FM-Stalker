import React, { useState, useEffect } from 'react';
import { fetchUserStats } from '../utils/api';
import { useToast } from '../contexts/ToastContext';

const SearchWindow = ({ onSearch, initialUsername, isLoading, currentUsername }) => {
    const [username, setUsername] = useState(initialUsername || '');
    const { showToast } = useToast();

    useEffect(() => {
        if (initialUsername) {
            setUsername(initialUsername);
        }
    }, [initialUsername]);

    const handleUsernameChange = (e) => {
        const newUsername = e.target.value;
        setUsername(newUsername);
    };

    const handleSearch = async () => {
        if (!username.trim()) {
            showToast('Please enter a username', 'warning');
            return;
        }

        // Check if the username is too long
        if (username.length > 50) {
            showToast('Username is too long!', 'error');
            return;
        }

        // Check if the searched username is the same as the current one
        if (currentUsername && username.trim().toLowerCase() === currentUsername.trim().toLowerCase()) {
            showToast('This user is already loaded!', 'warning');
            return;
        }

        console.log('Searching for username:', username.trim());  // Log the username being searched

        try {
            await fetchUserStats(username);
            onSearch(username);
        } catch (error) {
            showToast("User doesn't exist", 'error');
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
                            onChange={handleUsernameChange}  // Use the new handler
                        />
                        <label htmlFor="searchBox">
                            Search users
                        </label>
                    </div>
                    <button onClick={handleSearch} disabled={isLoading}>Search</button>
                </div>
            </div>
        </div>
    );
};

export default SearchWindow;