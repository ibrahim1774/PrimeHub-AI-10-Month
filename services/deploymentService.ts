import { GeneratedSiteData } from '../types';
import { renderToStaticMarkup } from 'react-dom/server';
import SiteRenderer from '../components/SiteRenderer';
import React from 'react';

export const deploySite = async (data: GeneratedSiteData, projectName: string) => {
    try {
        // 1. Render the site to HTML string
        // We wrap it in a basic HTML shell since SiteRenderer might just be the body content
        const bodyHtml = renderToStaticMarkup(React.createElement(SiteRenderer, { data, isEditMode: false }));

        const fullHtml = `<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>${data.hero.headline.line1} - ${data.contact.companyName}</title>
    <script src="https://cdn.tailwindcss.com"></script>
    <style>
      @font-face {
        font-family: 'Avenir Light';
        src: local('Avenir-Light'), local('Avenir Light'), local('HelveticaNeue-Light'), local('Helvetica Neue Light'), sans-serif;
        font-weight: 300;
      }
      
      body {
        font-family: "Avenir Light", "Avenir", "Helvetica Neue", Helvetica, Arial, sans-serif;
        background-color: #05070A;
        color: white;
        margin: 0;
        font-weight: 300;
      }
      
      h1, h2, h3, h4, h5, h6, button, input, textarea, div, span, p, a {
        font-family: "Avenir Light", "Avenir", "Helvetica Neue", Helvetica, Arial, sans-serif !important;
      }

      .tracking-tighter {
        letter-spacing: -0.05em;
      }
      
      .selection\:bg-blue-100 *::selection {
        background-color: #dbeafe;
        color: #1e40af;
      }
      
      /* ContentEditable Clean Focus */
      [contenteditable="true"]:focus {
        outline: none;
      }
      
      /* Custom Scrollbar */
      .custom-scrollbar::-webkit-scrollbar {
        width: 8px;
      }
      .custom-scrollbar::-webkit-scrollbar-track {
        background: transparent;
      }
      .custom-scrollbar::-webkit-scrollbar-thumb {
        background: #e2e8f0;
        border-radius: 10px;
        border: 2px solid white;
      }
      .custom-scrollbar::-webkit-scrollbar-thumb:hover {
        background: #cbd5e1;
      }
      
      @media (max-width: 640px) {
        body {
          font-size: 14px;
        }
      }
    </style>
</head>
<body>
    ${bodyHtml}
</body>
</html>`;

        // 2. Prepare files payload
        // Note: In a real scenario, you might want to extract images from 'data' and send them as separate files 
        // if they are base64, but the API handles base64 in HTML too (rewriter might need to be smart).
        // Actually, the API expects 'files' map.
        // If images are Base64 in the HTML, the API's rewriter needs to handle them?
        // Our current rewriter handles 'src="file.png"'. It doesn't extract Base64 from src.
        // BUT, the 'data' object has base64 strings (from Gemini).
        // So we should extract them into the 'files' map to keep HTML clean.

        const files: Record<string, string> = {
            'index.html': fullHtml
        };

        // Helper to extract base64 images and replace in HTML
        // For now, we'll send the HTML with Base64 and let the backend handle it?
        // The backend API writes files to disk. If HTML has base64, it's fine, but large.
        // The 'AssetUploader' uploads files from disk. It doesn't parse HTML to find Base64.
        // So we SHOULD extract them here if we want them hosted on GCS.

        // Let's do a simple pass to extract images from the data object
        // This is specific to the data structure
        let imageCounter = 0;
        const processImage = (imgData: string | undefined) => {
            if (!imgData || !imgData.startsWith('data:')) return imgData;
            const filename = `assets/image-${Date.now()}-${imageCounter++}.png`;
            files[filename] = imgData; // Add to files payload
            return filename; // Return relative path for HTML
        };

        // Clone data to modify it for rendering (replace base64 with paths)
        const deployData = JSON.parse(JSON.stringify(data));

        if (deployData.hero?.heroImage) deployData.hero.heroImage = processImage(deployData.hero.heroImage);
        if (deployData.aboutUs?.image) deployData.aboutUs.image = processImage(deployData.aboutUs.image);
        if (deployData.repairBenefits?.image) deployData.repairBenefits.image = processImage(deployData.repairBenefits.image);
        if (deployData.industryValue?.valueImage) deployData.industryValue.valueImage = processImage(deployData.industryValue.valueImage);

        // Re-render with paths
        const cleanBodyHtml = renderToStaticMarkup(React.createElement(SiteRenderer, { data: deployData, isEditMode: false }));
        files['index.html'] = `<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>${data.hero.headline.line1} - ${data.contact.companyName}</title>
    <script src="https://cdn.tailwindcss.com"></script>
    <style>
      @font-face {
        font-family: 'Avenir Light';
        src: local('Avenir-Light'), local('Avenir Light'), local('HelveticaNeue-Light'), local('Helvetica Neue Light'), sans-serif;
        font-weight: 300;
      }
      
      body {
        font-family: "Avenir Light", "Avenir", "Helvetica Neue", Helvetica, Arial, sans-serif;
        background-color: #05070A;
        color: white;
        margin: 0;
        font-weight: 300;
      }
      
      h1, h2, h3, h4, h5, h6, button, input, textarea, div, span, p, a {
        font-family: "Avenir Light", "Avenir", "Helvetica Neue", Helvetica, Arial, sans-serif !important;
      }

      .tracking-tighter {
        letter-spacing: -0.05em;
      }
      
      .selection\:bg-blue-100 *::selection {
        background-color: #dbeafe;
        color: #1e40af;
      }
      
      /* ContentEditable Clean Focus */
      [contenteditable="true"]:focus {
        outline: none;
      }
      
      /* Custom Scrollbar */
      .custom-scrollbar::-webkit-scrollbar {
        width: 8px;
      }
      .custom-scrollbar::-webkit-scrollbar-track {
        background: transparent;
      }
      .custom-scrollbar::-webkit-scrollbar-thumb {
        background: #e2e8f0;
        border-radius: 10px;
        border: 2px solid white;
      }
      .custom-scrollbar::-webkit-scrollbar-thumb:hover {
        background: #cbd5e1;
      }
      
      @media (max-width: 640px) {
        body {
          font-size: 14px;
        }
      }
    </style>
</head>
<body>
    ${cleanBodyHtml}
</body>
</html>`;

        // 3. Send to API
        const response = await fetch('/api/deploy', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                projectName,
                files
            })
        });

        if (!response.ok) {
            const err = await response.json();
            throw new Error(err.error || 'Deployment failed');
        }

        return await response.json();
    } catch (error) {
        console.error('Deploy Service Error:', error);
        throw error;
    }
};
