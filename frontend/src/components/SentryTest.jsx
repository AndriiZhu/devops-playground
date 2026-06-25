import React, { useState } from 'react';
import * as Sentry from '@sentry/react';

const SentryTest = () => {
  const [frontendResult, setFrontendResult] = useState(null);
  const [backendResult, setBackendResult] = useState(null);

  const handleFrontendError = () => {
    setFrontendResult(null);
    try {
      throw new Error('Frontend Test Error: Sentry is working!');
    } catch (error) {
      Sentry.captureException(error);
      setFrontendResult({ type: 'reported', message: 'Frontend error was sent to Sentry.' });
    }
  };

  const handleBackendError = async () => {
    setBackendResult(null);
    try {
      const response = await fetch(`${import.meta.env.VITE_API_URL}/debug-sentry`);
      const data = await response.json().catch(() => ({}));
      if (response.ok) {
        setBackendResult({ type: 'success', message: data.message || 'Backend responded OK.', status: response.status });
      } else {
        setBackendResult({ type: 'error', message: data.detail || `Backend returned ${response.status}`, status: response.status });
      }
    } catch (error) {
      setBackendResult({ type: 'error', message: error.message || 'Failed to reach backend.' });
    }
  };

  return (
    <section className="glass-card">
      <h2 className="card-title">
        <span className="card-title-icon">🛡️</span> Sentry Debug Console
      </h2>

      <div className="sentry-layout">
        {/* Action 1: Break Frontend */}
        <div className="sentry-action-card">
          <button
            onClick={handleFrontendError}
            className="btn btn-danger"
            aria-describedby="break-frontend-desc"
          >
            Break Frontend
          </button>
          
          <div className="element-desc danger-desc" id="break-frontend-desc">
            <span className="desc-bullet">⚠️</span>
            <span>
              <strong>Break Frontend:</strong> Simulates a client-side JavaScript error and manually sends it to Sentry for monitoring verification.
            </span>
          </div>

          <div className="sentry-status-area">
            {frontendResult && (
              <div className={`status-box ${frontendResult.type}`} role="status">
                <span>🔔</span>
                <span>{frontendResult.message}</span>
              </div>
            )}
          </div>
        </div>

        {/* Action 2: Break Backend */}
        <div className="sentry-action-card">
          <button
            onClick={handleBackendError}
            className="btn btn-warning"
            aria-describedby="break-backend-desc"
          >
            Break Backend
          </button>
          
          <div className="element-desc warning-desc" id="break-backend-desc">
            <span className="desc-bullet">⚡</span>
            <span>
              <strong>Break Backend:</strong> Triggers a backend error endpoint to test and verify server-side Sentry error logging.
            </span>
          </div>

          <div className="sentry-status-area">
            {backendResult && (
              <div className={`status-box ${backendResult.type}`} role="status">
                <span>
                  {backendResult.type === 'success' ? '✅' : '❌'}
                </span>
                <span>
                  {backendResult.status != null && <strong>[{backendResult.status}] </strong>}
                  {backendResult.message}
                </span>
              </div>
            )}
          </div>
        </div>
      </div>
    </section>
  );
};

export default SentryTest;

