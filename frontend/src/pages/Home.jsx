import React, { useState, useEffect } from 'react';
import InputForm from '../components/InputForm';
import PreviewFrame from '../components/PreviewFrame';
import { generateWebsite } from '../services/aiService';
import { saveProject, getProjects } from '../services/api';
import { downloadProject } from '../utils/zipper';

const Home = () => {
    const [currentProject, setCurrentProject] = useState(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const [history, setHistory] = useState([]);
    const [historyLoading, setHistoryLoading] = useState(true);
    const [statusMessage, setStatusMessage] = useState('');

    useEffect(() => {
        fetchHistory();
    }, []);

    const fetchHistory = async () => {
        setHistoryLoading(true);
        try {
            const projects = await getProjects();
            setHistory(projects);
        } catch (err) {
            console.error("Failed to load history", err);
        } finally {
            setHistoryLoading(false);
        }
    };

    const handleGenerate = async (prompt) => {
        setLoading(true);
        setError(null);
        setCurrentProject(null);
        setStatusMessage('Initializing AI...');

        try {
            // Step 1: Generate website using Puter.js AI (client-side)
            setStatusMessage('Generating website with AI...');
            const generatedCode = await generateWebsite(prompt);

            // Step 2: Save to backend database
            setStatusMessage('Saving project...');
            const savedProject = await saveProject(prompt, generatedCode);

            setCurrentProject(savedProject);
            setStatusMessage('');
            fetchHistory();
        } catch (err) {
            const message = err.response?.data?.detail || err.message || "Failed to generate website. Please try again.";
            setError(message);
            console.error(err);
            setStatusMessage('');
        } finally {
            setLoading(false);
        }
    };

    const handleExport = () => {
        if (currentProject) {
            downloadProject(currentProject.code, currentProject.prompt);
        }
    };

    const handleSelectProject = (project) => {
        setCurrentProject(project);
        setError(null);
        window.scrollTo({ top: 0, behavior: 'smooth' });
    };

    return (
        <div style={styles.page}>
            <div className="container" style={styles.container}>
                <header style={styles.header}>
                    <h1 style={styles.title}>
                        <span style={styles.titleIcon}>✨</span>
                        AI Website Generator
                    </h1>
                    <p style={styles.subtitle}>
                        Describe your vision in natural language, and watch as AI builds your website in seconds.
                    </p>
                    <p style={styles.poweredBy}>
                        Powered by Puter.js • Free & No API Key Required
                    </p>
                </header>

                <InputForm onGenerate={handleGenerate} loading={loading} />

                {error && (
                    <div style={styles.errorBox}>
                        <span style={styles.errorIcon}>⚠️</span>
                        {error}
                    </div>
                )}

                {loading && (
                    <div style={styles.loadingBox}>
                        <div style={styles.loadingSpinner}></div>
                        <p style={styles.loadingText}>{statusMessage || 'Processing...'}</p>
                        <p style={styles.loadingSubtext}>This may take 15-30 seconds</p>
                    </div>
                )}

                {currentProject && !loading && (
                    <div style={styles.resultSection}>
                        <div style={styles.resultHeader}>
                            <div>
                                <h2 style={styles.resultTitle}>Generated Website</h2>
                                <p style={styles.resultPrompt}>"{currentProject.prompt.slice(0, 80)}..."</p>
                            </div>
                            <button onClick={handleExport} style={styles.exportButton}>
                                <span>📥</span> Download ZIP
                            </button>
                        </div>
                        <PreviewFrame code={currentProject.code} />
                    </div>
                )}

                <section style={styles.historySection}>
                    <h3 style={styles.historyTitle}>Recent Projects</h3>
                    {historyLoading ? (
                        <p style={styles.historyLoading}>Loading projects...</p>
                    ) : history.length === 0 ? (
                        <p style={styles.emptyHistory}>No projects yet. Generate your first website above!</p>
                    ) : (
                        <div style={styles.historyGrid}>
                            {history.map(p => (
                                <div
                                    key={p.id}
                                    style={styles.historyCard}
                                    onClick={() => handleSelectProject(p)}
                                    onMouseEnter={(e) => e.currentTarget.style.transform = 'translateY(-2px)'}
                                    onMouseLeave={(e) => e.currentTarget.style.transform = 'translateY(0)'}
                                >
                                    <p style={styles.cardPrompt}>
                                        {p.prompt.length > 60 ? p.prompt.slice(0, 60) + '...' : p.prompt}
                                    </p>
                                    <p style={styles.cardDate}>
                                        {new Date(p.created_at).toLocaleDateString('en-US', {
                                            month: 'short',
                                            day: 'numeric',
                                            year: 'numeric'
                                        })}
                                    </p>
                                </div>
                            ))}
                        </div>
                    )}
                </section>
            </div>
        </div>
    );
};

const styles = {
    page: {
        minHeight: '100vh',
        background: 'linear-gradient(180deg, #f8fafc 0%, #f1f5f9 100%)',
    },
    container: {
        padding: '2rem 1rem 4rem',
    },
    header: {
        textAlign: 'center',
        marginBottom: '3rem',
    },
    title: {
        fontSize: '2.5rem',
        fontWeight: '700',
        color: '#0f172a',
        marginBottom: '0.75rem',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        gap: '0.5rem',
    },
    titleIcon: {
        fontSize: '2rem',
    },
    subtitle: {
        color: '#64748b',
        fontSize: '1.125rem',
        maxWidth: '600px',
        margin: '0 auto 0.5rem',
    },
    poweredBy: {
        color: '#94a3b8',
        fontSize: '0.875rem',
        fontStyle: 'italic',
    },
    errorBox: {
        display: 'flex',
        alignItems: 'center',
        gap: '0.75rem',
        padding: '1rem 1.25rem',
        backgroundColor: '#fef2f2',
        color: '#991b1b',
        borderRadius: '8px',
        marginBottom: '2rem',
        border: '1px solid #fecaca',
    },
    errorIcon: {
        fontSize: '1.25rem',
    },
    loadingBox: {
        textAlign: 'center',
        padding: '3rem',
        backgroundColor: 'white',
        borderRadius: '12px',
        boxShadow: '0 1px 3px rgba(0,0,0,0.1)',
        marginBottom: '2rem',
    },
    loadingSpinner: {
        width: '48px',
        height: '48px',
        border: '4px solid #e2e8f0',
        borderTopColor: '#2563eb',
        borderRadius: '50%',
        margin: '0 auto 1rem',
        animation: 'spin 1s linear infinite',
    },
    loadingText: {
        fontSize: '1.125rem',
        fontWeight: '600',
        color: '#1e293b',
        marginBottom: '0.25rem',
    },
    loadingSubtext: {
        fontSize: '0.875rem',
        color: '#64748b',
    },
    resultSection: {
        marginBottom: '3rem',
    },
    resultHeader: {
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'flex-start',
        marginBottom: '1rem',
        flexWrap: 'wrap',
        gap: '1rem',
    },
    resultTitle: {
        fontSize: '1.5rem',
        fontWeight: '600',
        color: '#0f172a',
        marginBottom: '0.25rem',
    },
    resultPrompt: {
        fontSize: '0.875rem',
        color: '#64748b',
        fontStyle: 'italic',
    },
    exportButton: {
        display: 'flex',
        alignItems: 'center',
        gap: '0.5rem',
        padding: '0.75rem 1.5rem',
        backgroundColor: '#10b981',
        color: 'white',
        border: 'none',
        borderRadius: '8px',
        fontWeight: '600',
        cursor: 'pointer',
        transition: 'all 0.2s',
        boxShadow: '0 2px 4px rgba(16, 185, 129, 0.3)',
    },
    historySection: {
        marginTop: '4rem',
        paddingTop: '2rem',
        borderTop: '1px solid #e2e8f0',
    },
    historyTitle: {
        fontSize: '1.25rem',
        fontWeight: '600',
        color: '#1e293b',
        marginBottom: '1.5rem',
    },
    historyLoading: {
        color: '#64748b',
        textAlign: 'center',
        padding: '2rem',
    },
    emptyHistory: {
        color: '#64748b',
        textAlign: 'center',
        padding: '2rem',
        backgroundColor: 'white',
        borderRadius: '8px',
        border: '1px dashed #e2e8f0',
    },
    historyGrid: {
        display: 'grid',
        gap: '1rem',
        gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))',
    },
    historyCard: {
        padding: '1.25rem',
        border: '1px solid #e2e8f0',
        borderRadius: '10px',
        cursor: 'pointer',
        backgroundColor: 'white',
        transition: 'all 0.2s',
        boxShadow: '0 1px 2px rgba(0,0,0,0.05)',
    },
    cardPrompt: {
        fontWeight: '500',
        marginBottom: '0.5rem',
        color: '#1e293b',
        lineHeight: '1.4',
    },
    cardDate: {
        fontSize: '0.8rem',
        color: '#94a3b8',
    }
};

export default Home;
