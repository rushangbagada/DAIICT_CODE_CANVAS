import React from 'react';
import NewsFeed from './newsfeed';
import './css/blog.css';

const Blog = () => {
  return (
    <div className="campus-sports-page">
      <header className="main-header">
        <div className="header-content">
          <h1 className="site-title">Campus Sports Hub</h1>
          <p className="site-subtitle">Your Gateway to Campus Athletic Excellence</p>
        </div>
        <div className="header-decoration"></div>
      </header>
      
      <main className="main-content">
        <NewsFeed />
      </main>
    </div>
  );
};

export default Blog;