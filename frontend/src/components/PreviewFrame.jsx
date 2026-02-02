import React, { useEffect, useRef, useState } from 'react';

const PreviewFrame = ({ code }) => {
    const iframeRef = useRef(null);
    const [viewMode, setViewMode] = useState('desktop');

    useEffect(() => {
        if (code && iframeRef.current) {
            const doc = iframeRef.current.contentDocument;
            doc.open();
            doc.write(`
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <style>${code.css || ''}</style>
</head>
<body>
    ${code.html || ''}
    <script>
        try {
            ${code.js || ''}
        } catch (e) {
            console.error('Script error:', e);
        }
    </script>
</body>
</html>
            `);
            doc.close();
        }
    }, [code]);

    if (!code) return null;

    const getIframeWidth = () => {
        switch (viewMode) {
            case 'mobile': return '375px';
            case 'tablet': return '768px';
            default: return '100%';
        }
    };

    return (
        <div style={styles.container}>
            <div style={styles.header}>
                <h3 style={styles.title}>Preview</h3>
                <div style={styles.viewModes}>
                    <button
                        onClick={() => setViewMode('mobile')}
                        style={viewMode === 'mobile' ? styles.activeMode : styles.modeButton}
                        title="Mobile view"
                    >
                        📱
                    </button>
                    <button
                        onClick={() => setViewMode('tablet')}
                        style={viewMode === 'tablet' ? styles.activeMode : styles.modeButton}
                        title="Tablet view"
                    >
                        📱
                    </button>
                    <button
                        onClick={() => setViewMode('desktop')}
                        style={viewMode === 'desktop' ? styles.activeMode : styles.modeButton}
                        title="Desktop view"
                    >
                        🖥️
                    </button>
                </div>
            </div>
            <div style={styles.iframeWrapper}>
                <iframe
                    ref={iframeRef}
                    title="Generated Website Preview"
                    style={{
                        ...styles.iframe,
                        width: getIframeWidth(),
                        margin: viewMode !== 'desktop' ? '0 auto' : '0',
                        display: 'block',
                    }}
                    sandbox="allow-scripts allow-same-origin"
                />
            </div>
        </div>
    );
};

const styles = {
    container: {
        border: '1px solid #e2e8f0',
        borderRadius: '12px',
        overflow: 'hidden',
        backgroundColor: 'white',
        boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)',
    },
    header: {
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        padding: '0.75rem 1rem',
        backgroundColor: '#f8fafc',
        borderBottom: '1px solid #e2e8f0',
    },
    title: {
        margin: 0,
        fontSize: '1rem',
        fontWeight: '600',
        color: '#334155',
    },
    viewModes: {
        display: 'flex',
        gap: '0.25rem',
    },
    modeButton: {
        padding: '0.375rem 0.5rem',
        background: 'none',
        border: '1px solid transparent',
        borderRadius: '4px',
        cursor: 'pointer',
        fontSize: '1rem',
        opacity: 0.6,
        transition: 'all 0.2s',
    },
    activeMode: {
        padding: '0.375rem 0.5rem',
        background: '#e2e8f0',
        border: '1px solid #cbd5e1',
        borderRadius: '4px',
        cursor: 'pointer',
        fontSize: '1rem',
        opacity: 1,
    },
    iframeWrapper: {
        backgroundColor: '#f1f5f9',
        padding: '1rem',
        minHeight: '600px',
    },
    iframe: {
        height: '600px',
        border: 'none',
        backgroundColor: 'white',
        boxShadow: '0 0 10px rgba(0,0,0,0.1)',
        borderRadius: '4px',
    }
};

export default PreviewFrame;
