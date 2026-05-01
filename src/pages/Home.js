import React from "react";
import { Link } from "react-router-dom";
import { Shield, Zap, TrendingUp, Users} from "lucide-react";
import "./Home.css";

function Home() {
  return (
    <div className="home-wrapper">
      {/* Hero Section */}
      <section className="hero-section">
        <div className="container">
          <div className="hero-content">
            <h1 className="hero-title">
              Streamline <span className="text-gradient">Student Grievance</span> Redressal
            </h1>
            <p className="hero-subtitle">
              A comprehensive platform for educational institutes to manage, track, and resolve complaints efficiently. Enhancing transparency and institutional trust.
            </p>
            <div className="hero-actions">
              <Link to="/register" className="btn btn-primary btn-lg">Get Started</Link>
              <Link to="/login" className="btn btn-outline btn-lg">Member Login</Link>
            </div>
          </div>
          <div className="hero-stats">
            <div className="stat-card">
              <span className="stat-number">99%</span>
              <span className="stat-label">Resolution Rate</span>
            </div>
            <div className="stat-card">
              <span className="stat-number">24/7</span>
              <span className="stat-label">Support</span>
            </div>
            <div className="stat-card">
              <span className="stat-number">1k+</span>
              <span className="stat-label">Active Users</span>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="features-section">
        <div className="container">
          <div className="section-header">
            <h2 className="section-title">Why Choose EduResolve?</h2>
            <p className="section-description">Built specifically for modern educational ecosystems.</p>
          </div>
          <div className="features-grid">
            <div className="feature-card">
              <div className="feature-icon-wrapper">
                <Zap className="feature-icon" />
              </div>
              <h3>Swift Submission</h3>
              <p>Submit grievances in seconds with our intuitive interface. Categorize and prioritize with ease.</p>
            </div>
            <div className="feature-card">
              <div className="feature-icon-wrapper">
                <TrendingUp className="feature-icon" />
              </div>
              <h3>Real-time Tracking</h3>
              <p>Monitor the status of your complaint at every stage. Receive instant updates on progress.</p>
            </div>
            <div className="feature-card">
              <div className="feature-icon-wrapper">
                <Shield className="feature-icon" />
              </div>
              <h3>Secure & Private</h3>
              <p>Advanced encryption ensures your identity and data remain confidential throughout the process.</p>
            </div>
            <div className="feature-card">
              <div className="feature-icon-wrapper">
                <Users className="feature-icon" />
              </div>
              <h3>Collaborative</h3>
              <p>Direct communication between students, staff, and administration for faster resolution.</p>
            </div>
          </div>
        </div>
      </section>

      {/* How it Works */}
      <section className="how-it-works">
        <div className="container">
          <h2 className="section-title text-center">How It Works</h2>
          <div className="steps-container">
            <div className="step-item">
              <div className="step-number">1</div>
              <h4>Register</h4>
              <p>Create your institutional account.</p>
            </div>
            <div className="step-item">
              <div className="step-number">2</div>
              <h4>Submit</h4>
              <p>File your complaint with details.</p>
            </div>
            <div className="step-item">
              <div className="step-number">3</div>
              <h4>Track</h4>
              <p>Monitor resolution status.</p>
            </div>
            <div className="step-item">
              <div className="step-number">4</div>
              <h4>Resolve</h4>
              <p>Get your issues addressed.</p>
            </div>
          </div>
        </div>
      </section>

      {/* Footer CTA */}
      <footer className="footer-cta">
        <div className="container">
          <h2>Ready to improve your institution?</h2>
          <p>Join hundreds of institutes already using EduResolve.</p>
          <Link to="/register" className="btn btn-primary btn-lg">Join Now</Link>
        </div>
      </footer>
    </div>
  );
}

export default Home;
