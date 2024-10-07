import React, { useState, useEffect, useCallback, useRef } from 'react';
import { useToast } from '../contexts/ToastContext';

const useStoredSettings = (initialSettings) => {
	const [storedSettings, setStoredSettings] = useState(initialSettings);

	useEffect(() => {
		const loadSettings = () => {
			const storedSettings = localStorage.getItem('appSettings');
			if (storedSettings) {
				console.log('Loaded stored settings:', JSON.parse(storedSettings));
				setStoredSettings(JSON.parse(storedSettings));
			} else {
				console.log('No stored settings, using initial settings:', initialSettings);
				setStoredSettings(initialSettings);
			}
		};

		loadSettings();
	}, [initialSettings]);

	return storedSettings;
};

const SettingsWindow = React.memo(({ onSave, initialSettings, isLoading }) => {
	const storedSettings = useStoredSettings(initialSettings);
	const [settings, setSettings] = useState(storedSettings);
	const { showToast } = useToast();

	useEffect(() => {
		setSettings(storedSettings);
	}, [storedSettings]);

	const handleToggle = useCallback((setting) => {
		setSettings(prevSettings => {
			const newSettings = {
				...prevSettings,
				[setting]: !prevSettings[setting]
			};
			console.log(`Checkbox toggled: ${setting} is now ${newSettings[setting]}`);
			return newSettings;
		});
	}, []);

	const handleSave = useCallback(() => {
		console.log('Save button clicked');
		if (JSON.stringify(settings) === JSON.stringify(storedSettings)) {
			console.log('No changes detected, skipping save');
			showToast('No changes have been made', 'warning');
			return;
		}

		console.log('Saving settings:', settings);
		localStorage.setItem('appSettings', JSON.stringify(settings));
		onSave(settings);
		showToast('Settings saved successfully!', 'info');
		console.log('Success toast shown: Settings saved successfully!');
	}, [settings, storedSettings, onSave, showToast]);

	console.log('SettingsWindow rendering, current settings:', settings);

	return (
		<div className="window" style={{ width: '250px' }}>
			<div className="title-bar">
				<div className="title-bar-text">Settings</div>
				<div className="title-bar-controls">
					<button aria-label="Minimize"></button>
					<button aria-label="Maximize"></button>
					<button aria-label="Close"></button>
				</div>
			</div>
			<div className="window-body">
				<div className="settings-container">
					<fieldset>
						<legend>App Settings</legend>
						<div className="field-row">
							<input
								id="saveWindowPositions"
								type="checkbox"
								checked={settings.saveWindowPositions}
								onChange={() => handleToggle('saveWindowPositions')}
							/>
							<label htmlFor="saveWindowPositions">Save Window Positions</label>
						</div>
						<div className="field-row">
							<input
								id="enableTimer"
								type="checkbox"
								checked={settings.enableTimer}
								onChange={() => handleToggle('enableTimer')}
							/>
							<label htmlFor="enableTimer">Enable Timer</label>
						</div>
					</fieldset>
					<div className="field-row" style={{ justifyContent: 'flex-end' }}>
						<button onClick={handleSave} disabled={isLoading}>Save Settings</button>
					</div>
				</div>
			</div>
		</div>
	);
}, (prevProps, nextProps) => {
	return JSON.stringify(prevProps.initialSettings) === JSON.stringify(nextProps.initialSettings) &&
		prevProps.isLoading === nextProps.isLoading;
});

export default SettingsWindow;