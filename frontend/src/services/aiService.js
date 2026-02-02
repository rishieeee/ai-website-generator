/**
 * AI Service using Puter.js
 * 
 * Provides free, keyless access to OpenAI-compatible models via Puter.js.
 * Uses gpt-5.1-codex-max for optimal code generation quality.
 * 
 * Reference: https://developer.puter.com/tutorials/free-unlimited-openai-api/
 */

const AI_MODEL = 'gpt-5.1-codex-max';

const SYSTEM_PROMPT = `You are a senior full-stack web developer with 15+ years of experience.
Your task is to generate a complete, responsive, and visually stunning website based on the user's requirements.

STRICT REQUIREMENTS:
1. Return ONLY a raw JSON object. No markdown, no explanations, no code fences.
2. The JSON object MUST have exactly these three keys: "html", "css", "js".
3. HTML: 
   - Use semantic HTML5 elements (header, main, section, footer, nav, article).
   - Include proper structure with appropriate headings.
   - Content should be meaningful and match the user's request.
4. CSS:
   - Write modern, responsive CSS using Flexbox and Grid.
   - Use a mobile-first approach with appropriate media queries.
   - Include smooth transitions and subtle animations.
   - Use a cohesive color palette with CSS variables.
   - Ensure good typography with proper font stacks.
   - Do NOT use external CSS frameworks.
5. JavaScript:
   - Write clean ES6+ JavaScript.
   - Use event delegation where appropriate.
   - Handle edge cases gracefully.
   - Add interactivity that enhances user experience.
6. The code must be production-ready, accessible, and self-contained.

OUTPUT FORMAT (STRICT JSON ONLY):
{"html": "<header>...</header><main>...</main><footer>...</footer>", "css": ":root { --primary: #xxx; } body { ... }", "js": "document.addEventListener('DOMContentLoaded', function() { ... });"}`;

const FALLBACK_CODE = {
    html: `<header class="hero">
    <nav class="navbar">
        <div class="logo">Your Website</div>
        <ul class="nav-links">
            <li><a href="#home">Home</a></li>
            <li><a href="#about">About</a></li>
            <li><a href="#contact">Contact</a></li>
        </ul>
    </nav>
    <div class="hero-content">
        <h1>Welcome to Your Website</h1>
        <p>We couldn't generate a custom website at this time. Please try again.</p>
        <a href="#contact" class="cta-button">Get Started</a>
    </div>
</header>
<main>
    <section id="about" class="section">
        <h2>About Us</h2>
        <p>This is a placeholder section. Try generating again with a more detailed prompt.</p>
    </section>
    <section id="contact" class="section">
        <h2>Contact</h2>
        <p>Get in touch with us for more information.</p>
    </section>
</main>
<footer>
    <p>&copy; 2024 Your Website. All rights reserved.</p>
</footer>`,
    css: `:root {
    --primary: #2563eb;
    --secondary: #1e40af;
    --background: #f8fafc;
    --text: #1e293b;
    --white: #ffffff;
}

* {
    margin: 0;
    padding: 0;
    box-sizing: border-box;
}

body {
    font-family: 'Segoe UI', system-ui, sans-serif;
    background-color: var(--background);
    color: var(--text);
    line-height: 1.6;
}

.hero {
    background: linear-gradient(135deg, var(--primary), var(--secondary));
    color: var(--white);
    min-height: 100vh;
    display: flex;
    flex-direction: column;
}

.navbar {
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 1rem 2rem;
}

.logo {
    font-size: 1.5rem;
    font-weight: bold;
}

.nav-links {
    display: flex;
    list-style: none;
    gap: 2rem;
}

.nav-links a {
    color: var(--white);
    text-decoration: none;
    transition: opacity 0.3s;
}

.nav-links a:hover {
    opacity: 0.8;
}

.hero-content {
    flex: 1;
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    text-align: center;
    padding: 2rem;
}

.hero-content h1 {
    font-size: 3rem;
    margin-bottom: 1rem;
}

.cta-button {
    display: inline-block;
    background: var(--white);
    color: var(--primary);
    padding: 1rem 2rem;
    border-radius: 8px;
    text-decoration: none;
    font-weight: 600;
    margin-top: 2rem;
    transition: transform 0.3s;
}

.cta-button:hover {
    transform: translateY(-2px);
}

.section {
    padding: 4rem 2rem;
    max-width: 1200px;
    margin: 0 auto;
    text-align: center;
}

.section h2 {
    font-size: 2rem;
    margin-bottom: 1rem;
    color: var(--primary);
}

footer {
    background: var(--text);
    color: var(--white);
    text-align: center;
    padding: 2rem;
}

@media (max-width: 768px) {
    .navbar {
        flex-direction: column;
        gap: 1rem;
    }
    
    .nav-links {
        gap: 1rem;
    }
    
    .hero-content h1 {
        font-size: 2rem;
    }
}`,
    js: `document.addEventListener('DOMContentLoaded', function() {
    const links = document.querySelectorAll('a[href^="#"]');
    links.forEach(link => {
        link.addEventListener('click', function(e) {
            e.preventDefault();
            const target = document.querySelector(this.getAttribute('href'));
            if (target) {
                target.scrollIntoView({ behavior: 'smooth' });
            }
        });
    });
});`
};

/**
 * Validates the generated code structure
 * @param {Object} code - The parsed code object
 * @returns {Object} - Valid code or fallback
 */
function validateGeneratedCode(code) {
    const requiredKeys = ['html', 'css', 'js'];

    if (!code || typeof code !== 'object') {
        console.warn('AI response is not an object, using fallback');
        return FALLBACK_CODE;
    }

    for (const key of requiredKeys) {
        if (!(key in code)) {
            console.warn(`Missing key "${key}" in AI response, using fallback`);
            return FALLBACK_CODE;
        }
        if (typeof code[key] !== 'string') {
            console.warn(`Key "${key}" is not a string, using fallback`);
            return FALLBACK_CODE;
        }
    }

    // Ensure non-empty html and css
    if (!code.html.trim() || !code.css.trim()) {
        console.warn('Empty HTML or CSS in AI response, using fallback');
        return FALLBACK_CODE;
    }

    return code;
}

/**
 * Parses AI response to extract JSON
 * @param {string} response - Raw AI response
 * @returns {Object} - Parsed code object
 */
function parseAIResponse(response) {
    if (!response || typeof response !== 'string') {
        throw new Error('Empty or invalid AI response');
    }

    let content = response.trim();

    // Remove markdown code fences if present
    if (content.startsWith('```json')) {
        content = content.slice(7);
    } else if (content.startsWith('```')) {
        content = content.slice(3);
    }
    if (content.endsWith('```')) {
        content = content.slice(0, -3);
    }

    content = content.trim();

    // Try to parse as JSON
    try {
        return JSON.parse(content);
    } catch (e) {
        // Try to find JSON object in the response
        const jsonMatch = content.match(/\{[\s\S]*\}/);
        if (jsonMatch) {
            try {
                return JSON.parse(jsonMatch[0]);
            } catch (e2) {
                throw new Error('Failed to parse JSON from AI response');
            }
        }
        throw new Error('No valid JSON found in AI response');
    }
}

/**
 * Validates and sanitizes user prompt
 * @param {string} prompt - User input prompt
 * @returns {string} - Sanitized prompt
 */
function sanitizePrompt(prompt) {
    if (!prompt || typeof prompt !== 'string') {
        throw new Error('Prompt is required');
    }

    const trimmed = prompt.trim();

    if (trimmed.length < 10) {
        throw new Error('Prompt must be at least 10 characters');
    }

    if (trimmed.length > 2000) {
        throw new Error('Prompt must be less than 2000 characters');
    }

    return trimmed;
}

/**
 * Generates website code using Puter.js AI
 * @param {string} userPrompt - User's website description
 * @returns {Promise<Object>} - Generated code {html, css, js}
 */
export async function generateWebsite(userPrompt) {
    const prompt = sanitizePrompt(userPrompt);

    // Check if Puter.js is available
    if (typeof puter === 'undefined' || !puter.ai) {
        throw new Error('Puter.js is not loaded. Please refresh the page.');
    }

    try {
        console.log(`Generating website with ${AI_MODEL}...`);

        const response = await puter.ai.chat(
            [
                { role: 'system', content: SYSTEM_PROMPT },
                { role: 'user', content: prompt }
            ],
            { model: AI_MODEL }
        );

        // Handle response (can be string or object with message property)
        let content;
        if (typeof response === 'string') {
            content = response;
        } else if (response && response.message) {
            content = response.message.content || response.message;
        } else if (response && response.content) {
            content = response.content;
        } else {
            content = JSON.stringify(response);
        }

        const parsedCode = parseAIResponse(content);
        const validatedCode = validateGeneratedCode(parsedCode);

        console.log('Website generated successfully');
        return validatedCode;

    } catch (error) {
        console.error('AI generation error:', error);

        // Return fallback for recoverable errors
        if (error.message.includes('rate limit') ||
            error.message.includes('timeout') ||
            error.message.includes('network')) {
            console.warn('Using fallback due to service error');
            return FALLBACK_CODE;
        }

        throw error;
    }
}

export default {
    generateWebsite,
    AI_MODEL
};
