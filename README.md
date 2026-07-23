# Preoperative Medication Review Front End

This folder contains a self-contained, accessible front end for the Microsoft Copilot Studio medication review assistant.

## Files

- `index.html` — semantic patient-facing page and embedded assistant
- `styles.css` — responsive, high-contrast, color-vision-friendly styling
- `script.js` — display preferences, loading state, offline status, expand mode, and keyboard behavior

## Run locally

Open `index.html` directly in a browser, or serve this folder with any static web server.

For example:

```powershell
python -m http.server 8080 --directory preop_medication_rev_front_end
```

Then visit `http://localhost:8080`.

## Publish to GitHub Pages

1. Create a GitHub repository and push this folder to the repository.
2. In GitHub, open the repository settings and enable GitHub Pages.
3. Choose the `GitHub Actions` deployment source.
4. Push to the `main` branch to trigger deployment.
5. After the workflow finishes, your site will be available at:
   `https://<your-github-username>.github.io/<your-repository-name>/`

## Accessibility

The wrapper includes semantic landmarks, a skip link, large interaction targets, visible focus states, scalable text, high-contrast mode, reduced-motion support, non-color status cues, and responsive layouts. The embedded Copilot Studio interface is cross-origin and controls its own internal accessibility and styling.
