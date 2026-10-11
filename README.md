# UI SPHERE — GDG ITER |

A modern, high-performance community web portal designed for **Google Developer Groups (GDG) ITER**, Siksha 'O' Anusandhan, Bhubaneswar.

---

## 🌟 Highlights & Architecture

- **Visual Design & Typography**:
  - **Headlines**: Clash Display 700 with optical letter spacing and tight line-height.
  - **Body**: Satoshi (500, 700, 900) for clean readability.
  - **Color Palette**: Curated Google Brand tokens (`--google-blue`, `--google-red`, `--google-yellow`, `--google-green`) blended into a light-mode slate backdrop (`#f8fafc`).
- **Motion & Interactions**:
  - **Mouse Parallax**: Dual radial gradient blobs with subtle physics response to cursor movement.
  - **Intersection Observer**: Staggered scroll reveals with cubic-bezier easing.
  - **Animated Metric Counters**: Live numbers counting smoothly to target values (`5.2K+`, `60+`, `100%`, `30+`).
  - **Timeline of Excellence**: Interactive vertical progress line tracking scroll position through milestones.
  - **Gallery**: Dynamic image hover zoom with gradient overlay slide-up and next/prev controls.
  - **Glassmorphism**: Backdrop blur cards with light borders and 3D hover-lift elevation.
- **Production-Ready Modals & Interactive Flows**:
  - **Session RSVP Modal**: Pre-fills selected event name ("React 19 Deep Dive", "AI/ML Lab Day", "Cloud Scaling Architecture") and collects student details.
  - **Core Team Recruitment Modal**: Full application form with track selector and portfolio link.
  - **Winter Hackathon Registration Modal**: High-contrast dark modal with team details.
  - **Chapter Join Modal**: Direct membership onboarding form.
  - **Core Team Directory**: Searchable overview of leads and executives.
  - **Toast Notifications**: Built-in feedback notifications on every form submission.
  - **Mobile Navigation Drawer**: Responsive slide-over menu with backdrop blur.

---

## 📁 Directory Structure

```
UI SPHERE/
├── index.html        # Main landing page with semantic HTML5 and SEO tags
├── css/
│   └── styles.css    # Custom animations, design tokens, glassmorphism, and modal styles
├── js/
│   └── main.js       # Parallax, scroll animations, counters, modals, and toasts
└── README.md         # Documentation
```

---

## 🚀 How to Run

Simply open `index.html` directly in any web browser, or launch using any static web server:

```bash
# Using Python
python3 -m http.server 3000

# Using Node / npx
npx serve .
```

Then visit [http://localhost:3000](http://localhost:3000).
