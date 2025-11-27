# Cosmic Scale Visualization

An interactive 3D web visualization that explores the scales of objects throughout the universe, from subatomic particles to the cosmic horizon. Built with Three.js.

## Features

- **Interactive Scale Slider**: Smoothly zoom through 43 orders of magnitude
- **3D Visualization**: Real-time 3D rendering using Three.js
- **Educational Content**: Detailed descriptions of each cosmic object
- **Responsive Design**: Works on desktop and mobile devices
- **Offline Support**: Progressive Web App (PWA) with service worker caching
- **Dark Theme**: Space-inspired dark interface with cyan accents

## Objects Covered

The visualization includes objects across the following scales:

- **Subatomic**: Proton, Hydrogen Atom
- **Molecular**: DNA Strand, Bacteriophage
- **Everyday**: Beach Ball
- **Planetary**: Earth, Sun
- **Cosmic**: Solar System, Milky Way Galaxy, Observable Universe

## Getting Started

### Prerequisites

- Modern web browser with WebGL support (Chrome, Firefox, Safari, Edge)
- No server required for basic functionality

### Installation

1. Clone the repository:
   ```bash
   git clone <repository-url>
   cd cosmic-scale
   ```

2. Open `index.html` in your web browser or serve locally:
   ```bash
   python -m http.server 8000
   # or
   npx http-server
   ```

3. Navigate to `http://localhost:8000`

## Usage

- **Slider Control**: Drag the scale slider at the bottom to zoom through different objects
- **Mouse Interaction**: Use mouse to interact with the 3D scene
- **Touch Support**: On mobile, touch and drag the slider to explore

## Project Structure

```
cosmic-scale/
├── index.html              # Main HTML file
├── index.js                # Three.js scene and interactions
├── style.css               # Styling and layout
├── manifest.webmanifest    # PWA manifest for installable web app
├── sw.js                   # Service worker for offline support
├── favicon.png             # App icon
└── README.md               # This file
```

## Technologies Used

- **Three.js**: 3D graphics library for WebGL rendering
- **HTML5**: Markup structure
- **CSS3**: Styling with modern features (flexbox, backdrop-filter)
- **JavaScript (ES6+)**: Application logic and interactivity
- **Service Workers**: Offline support and PWA functionality
- **Web App Manifest**: Installation and metadata

## Features & Capabilities

### Interactive Scale System
The scale slider uses an exponential system where each step represents a power of 10 in meters:
- Minimum: 10^-16 meters (subatomic)
- Maximum: 10^27 meters (cosmic)

### Progressive Web App
Install as a native app on your device:
- Works offline after first visit
- Responsive layout for all screen sizes
- App icon and splash screen

### Performance Optimization
- Efficient Three.js rendering pipeline
- Fog effect for depth perception
- Adaptive pixel ratio for different displays

## Browser Compatibility

| Browser | Support |
|---------|---------|
| Chrome  | ✅ Full |
| Firefox | ✅ Full |
| Safari  | ✅ Full |
| Edge    | ✅ Full |
| IE 11   | ❌ Not supported |

## Development

### Code Structure

**index.js** contains:
- Scene configuration and Three.js setup
- Object data with names, scales, colors, and descriptions
- Camera and renderer initialization
- Interaction handlers (slider, resize, animations)
- Object rendering logic

**style.css** features:
- Dark space-themed design
- Responsive UI overlay
- Smooth animations and transitions
- Glass-morphism effect on UI elements

**sw.js** provides:
- Resource caching strategy
- Network fallback handling
- Cache cleanup on updates

## Future Enhancements

- [ ] Add more celestial objects
- [ ] Implement touch gestures for mobile
- [ ] Add sound effects and background music
- [ ] Save favorite views/scales
- [ ] Educational quiz mode
- [ ] Compare objects side-by-side
- [ ] Support for different visualization modes

## License

This project is open source and available under the MIT License.

## Contributing

Contributions are welcome! Please feel free to submit pull requests or open issues for bugs and feature requests.

## Credits

- **Three.js**: https://threejs.org/
- **Cosmic data**: NASA and scientific community resources

## Contact

For questions or suggestions, please open an issue on the repository.

---

**Explore the cosmos and understand the scales that define our universe!** 🌌
