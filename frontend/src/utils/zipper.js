import JSZip from 'jszip';

export const downloadProject = async (code, prompt) => {
    const zip = new JSZip();

    const safeTitle = prompt
        .slice(0, 50)
        .replace(/[^a-zA-Z0-9\s]/g, '')
        .trim() || 'Generated Website';

    const htmlContent = `<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <meta name="description" content="${safeTitle}">
    <title>${safeTitle}</title>
    <link rel="stylesheet" href="styles.css">
</head>
<body>
${code.html}
    <script src="script.js"></script>
</body>
</html>`;

    zip.file("index.html", htmlContent);
    zip.file("styles.css", code.css);
    zip.file("script.js", code.js);

    const content = await zip.generateAsync({ type: "blob" });

    const url = window.URL.createObjectURL(content);
    const a = document.createElement("a");
    a.href = url;
    a.download = "website-project.zip";
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    window.URL.revokeObjectURL(url);
};
