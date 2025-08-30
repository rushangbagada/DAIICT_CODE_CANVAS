# Green Hydrogen Homepage

A modern, professional homepage for Green Hydrogen with interactive 3D models, animations, and responsive design.

## Features

✅ **Full-screen Hero Section** - Futuristic green energy theme with call-to-action
✅ **Interactive 3D Models** - Hydrogen molecules and fuel cells using Three.js
✅ **Smooth Animations** - GSAP-powered scroll-based and hover animations  
✅ **Animated Counters** - Key metrics with counting animations
✅ **Modern Design** - Green & white color scheme with soft gradients
✅ **Fully Responsive** - Works on desktop, tablet, and mobile
✅ **Particle Effects** - Subtle motion around 3D models
✅ **Clean Typography** - Professional eco-futuristic vibe

## Sections

1. **Hero Section** - Full-screen with animated hydrogen molecule
2. **About Green Hydrogen** - Clean energy revolution explanation
3. **Advantages & Applications** - 6 key use cases with cards
4. **Key Metrics** - Animated counters showing market data
5. **Contact Section** - Contact form and information
6. **Footer** - Links and company information

## Technologies Used

- **React 18** - Modern React with hooks
- **Three.js** - 3D graphics and animations
- **GSAP** - Professional animations and scroll triggers
- **CSS3** - Modern styling with gradients and effects
- **Responsive Design** - Mobile-first approach

## Installation & Setup

### Required Dependencies

Make sure these packages are installed in your package.json:

```json
{
  "dependencies": {
    "react": "^18.2.0",
    "react-dom": "^18.2.0",
    "three": "^0.158.0",
    "gsap": "^3.12.2"
  }
}
```

### Install Dependencies

```bash
npm install three gsap
```

### Running the Application

The Green Hydrogen homepage has been integrated into your existing React Router setup.

1. **Start the development server:**
   ```bash
   npm run dev
   ```

2. **Visit the Green Hydrogen page:**
   ```
   http://localhost:3000/green-hydrogen
   ```

## File Structure

```
frontend/
├── GreenHydrogenHomepage.jsx    # Main React component
├── GreenHydrogenHomepage.css    # Complete styling
├── src/main.jsx                 # Updated with new route
└── GREEN_HYDROGEN_README.md     # This file
```

## 3D Models

The page includes two interactive 3D models:

1. **Hydrogen Molecule (H₂)** - Located in hero section
   - Rotating hydrogen atoms with bond
   - Particle effects around molecule
   - Green glowing materials

2. **Fuel Cell** - Located in metrics section
   - Detailed fuel cell structure
   - Energy flow particles
   - Interactive rotation

## Animations

- **Hero animations** - Title, subtitle, and CTA buttons fade in
- **Scroll animations** - Section titles and cards animate on scroll
- **Hover effects** - Cards lift and glow on hover
- **Counter animations** - Numbers count up when visible
- **Floating elements** - Subtle floating motion for 3D models

## Customization

### Colors
Modify CSS variables in `GreenHydrogenHomepage.css`:
```css
:root {
  --primary-green: #00ff88;
  --secondary-green: #00cc66;
  --dark-green: #00aa55;
}
```

### 3D Models
- Models are placeholder implementations
- Can be replaced with actual .gltf/.fbx models
- Particle systems can be customized

### Content
- All text content is in the JSX component
- Metrics numbers can be updated
- Contact information is placeholder

## Browser Support

- ✅ Chrome 80+
- ✅ Firefox 75+  
- ✅ Safari 13+
- ✅ Edge 80+

## Performance

- 3D models are optimized for performance
- Animations use requestAnimationFrame
- Responsive images and efficient CSS
- Lazy loading for scroll animations

## Deployment

The component works with any React deployment:

1. **Build for production:**
   ```bash
   npm run build
   ```

2. **Deploy the build folder** to your hosting platform

## Screenshots

The homepage includes:
- Modern hero section with 3D hydrogen molecule
- Clean about section with process diagram
- Grid of advantage cards with icons
- Animated metrics with large numbers
- Interactive fuel cell showcase
- Professional contact form
- Dark footer with links

## Support

For any issues or customization requests, check:
- Three.js documentation: https://threejs.org/docs/
- GSAP documentation: https://greensock.com/docs/
- React documentation: https://react.dev/

---

**Ready to power the future with green hydrogen! 🌱⚡**
