import React, { useState, useEffect } from 'react';
import './App.css';
import Launcher from './components/Launcher';
import DownloadProgress from './components/DownloadProgress';
import NewsPanel from './components/NewsPanel';

function App() {
  const [gamePath, setGamePath] = useState(localStorage.getItem('gamePath') || '');
  const [isUpdating, setIsUpdating] = useState(false);
  const [updateProgress, setUpdateProgress] = useState(0);
  const [news, setNews] = useState([]);

  useEffect(() => {
    // Verificar actualizaciones al iniciar
    if (window.electron) {
      window.electron.checkUpdates();
      window.electron.onUpdateAvailable(() => {
        setIsUpdating(true);
      });
      window.electron.onDownloadProgress((data) => {
        setUpdateProgress(Math.round((data.transferred / data.total) * 100));
      });
    }

    // Cargar noticias
    fetchNews();
  }, []);

  const fetchNews = async () => {
    try {
      const response = await fetch('https://warders.lineage2valakas.com/api/news');
      const data = await response.json();
      setNews(data);
    } catch (error) {
      console.error('Error fetching news:', error);
    }
  };

  const handleGamePathChange = (path) => {
    setGamePath(path);
    localStorage.setItem('gamePath', path);
  };

  return (
    <div className="app-container">
      <div className="main-content">
        <Launcher 
          gamePath={gamePath} 
          onPathChange={handleGamePathChange}
          isUpdating={isUpdating}
        />
        {isUpdating && <DownloadProgress progress={updateProgress} />}
      </div>
      <NewsPanel news={news} />
    </div>
  );
}

export default App;
