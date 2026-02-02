import React, { useState } from 'react';

const MIN_PROMPT_LENGTH = 10;
const MAX_PROMPT_LENGTH = 2000;

const InputForm = ({ onGenerate, loading }) => {
    const [prompt, setPrompt] = useState('');
    const [validationError, setValidationError] = useState('');

    const validatePrompt = (value) => {
        if (!value.trim()) {
            return 'Please enter a description for your website';
        }
        if (value.trim().length < MIN_PROMPT_LENGTH) {
            return `Please provide at least ${MIN_PROMPT_LENGTH} characters`;
        }
        if (value.length > MAX_PROMPT_LENGTH) {
            return `Description must be less than ${MAX_PROMPT_LENGTH} characters`;
        }
        return '';
    };

    const handleChange = (e) => {
        const value = e.target.value;
        setPrompt(value);
        if (validationError) {
            setValidationError(validatePrompt(value));
        }
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        const error = validatePrompt(prompt);
        if (error) {
            setValidationError(error);
            return;
        }
        setValidationError('');
        onGenerate(prompt.trim());
    };

    const charCount = prompt.length;
    const isNearLimit = charCount > MAX_PROMPT_LENGTH * 0.9;

    return (
        <div style={styles.container}>
            <form onSubmit={handleSubmit} style={styles.form}>
                <div style={styles.textareaWrapper}>
                    <textarea
                        value={prompt}
                        onChange={handleChange}
                        placeholder="Describe your dream website... (e.g., 'A modern portfolio for a photographer with a dark theme, image gallery, about section, and contact form')"
                        style={{
                            ...styles.textarea,
                            borderColor: validationError ? '#ef4444' : '#cbd5e1'
                        }}
                        disabled={loading}
                        maxLength={MAX_PROMPT_LENGTH}
                    />
                    <div style={{
                        ...styles.charCount,
                        color: isNearLimit ? '#ef4444' : '#94a3b8'
                    }}>
                        {charCount}/{MAX_PROMPT_LENGTH}
                    </div>
                </div>

                {validationError && (
                    <div style={styles.errorText}>{validationError}</div>
                )}

                <button
                    type="submit"
                    disabled={loading}
                    style={loading ? styles.buttonDisabled : styles.button}
                >
                    {loading ? (
                        <span style={styles.buttonContent}>
                            <span style={styles.spinner}></span>
                            Generating...
                        </span>
                    ) : (
                        'Generate Website'
                    )}
                </button>
            </form>
        </div>
    );
};

const styles = {
    container: {
        marginBottom: '2rem',
    },
    form: {
        display: 'flex',
        flexDirection: 'column',
        gap: '0.75rem',
    },
    textareaWrapper: {
        position: 'relative',
    },
    textarea: {
        width: '100%',
        minHeight: '120px',
        padding: '1rem',
        paddingBottom: '2rem',
        borderRadius: '8px',
        border: '2px solid #cbd5e1',
        fontSize: '1rem',
        fontFamily: 'inherit',
        resize: 'vertical',
        transition: 'border-color 0.2s, box-shadow 0.2s',
        outline: 'none',
    },
    charCount: {
        position: 'absolute',
        bottom: '0.5rem',
        right: '0.75rem',
        fontSize: '0.75rem',
    },
    errorText: {
        color: '#ef4444',
        fontSize: '0.875rem',
        marginTop: '-0.25rem',
    },
    button: {
        alignSelf: 'flex-start',
        padding: '0.875rem 2rem',
        backgroundColor: '#2563eb',
        color: 'white',
        border: 'none',
        borderRadius: '8px',
        fontSize: '1rem',
        fontWeight: '600',
        cursor: 'pointer',
        transition: 'all 0.2s',
        boxShadow: '0 2px 4px rgba(37, 99, 235, 0.3)',
    },
    buttonDisabled: {
        alignSelf: 'flex-start',
        padding: '0.875rem 2rem',
        backgroundColor: '#94a3b8',
        color: 'white',
        border: 'none',
        borderRadius: '8px',
        fontSize: '1rem',
        fontWeight: '600',
        cursor: 'not-allowed',
    },
    buttonContent: {
        display: 'flex',
        alignItems: 'center',
        gap: '0.5rem',
    },
    spinner: {
        width: '16px',
        height: '16px',
        border: '2px solid rgba(255,255,255,0.3)',
        borderTopColor: 'white',
        borderRadius: '50%',
        animation: 'spin 0.8s linear infinite',
    }
};

export default InputForm;
