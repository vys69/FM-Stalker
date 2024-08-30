import React, { useState } from 'react';

const Settings = ({ username, onUsernameChange }) => {
  const [inputUsername, setInputUsername] = useState(username);

  const handleSubmit = (e) => {
    e.preventDefault();
    onUsernameChange(inputUsername);
  };

  return (
    <div>
      <form onSubmit={handleSubmit}>
        <label htmlFor="username">Last.fm Username:</label>
        <input
          type="text"
          id="username"
          value={inputUsername}
          onChange={(e) => setInputUsername(e.target.value)}
        />
        <button type="submit">Update Username</button>
      </form>
    </div>
  );
};

export default Settings;
