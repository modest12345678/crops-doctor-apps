# Design Guidelines: College Photo Memory App

## Design Approach
**Reference-Based Approach** drawing from Instagram's visual appeal, Google Photos' organization patterns, and Pinterest's masonry layouts. The design prioritizes visual content while maintaining clean functionality for college students.

## Core Design Principles
1. **Content-First**: Photos are heroes, UI elements support but don't compete
2. **Vibrant & Clean**: Energetic college aesthetic with professional polish
3. **AI Transparency**: Make AI features visible and delightful, not hidden
4. **Quick Actions**: Students move fast - optimize for speed and efficiency

## Typography
- **Primary Font**: Inter (Google Fonts) - modern, readable, professional
- **Accent Font**: Outfit (Google Fonts) - for headings and feature highlights
- **Hierarchy**:
  - Page titles: text-3xl md:text-4xl font-bold
  - Section headers: text-xl md:text-2xl font-semibold
  - Body text: text-base leading-relaxed
  - Captions/metadata: text-sm text-gray-600
  - AI-generated content: text-base italic font-medium (distinguishes AI text)

## Layout System
**Spacing**: Use Tailwind units of 2, 4, 6, and 8 for consistency (p-4, gap-6, m-8, etc.)

**Grid Structures**:
- Photo galleries: Masonry grid (2 cols mobile, 3-4 cols tablet, 4-5 cols desktop)
- Album cards: grid-cols-1 md:grid-cols-2 lg:grid-cols-3 with gap-6
- Timeline view: Single column with date markers, max-w-4xl centered
- Collage creator: Flexible grid with drag-drop zones

**Containers**: 
- Main content: max-w-7xl mx-auto px-4
- Focused views (upload, editing): max-w-5xl mx-auto

## Component Library

### Navigation
- Sticky top navbar with blur backdrop (backdrop-blur-lg bg-white/80)
- Logo + AI badge indicator (shows when AI is processing)
- Search bar (prominent, min-w-64)
- Icons: Upload, Albums, Timeline, Settings (Heroicons)
- Mobile: Bottom tab bar (Upload, Search, Albums, Profile)

### Photo Cards
- Rounded corners (rounded-lg)
- Hover lift effect (subtle shadow increase)
- AI tags overlay (bottom, translucent dark gradient with white text)
- Quick actions on hover: Edit, Delete, Add to Album (icon buttons)
- Aspect ratio: Maintain original or use aspect-square for grid uniformity

### Upload Zone
- Large dropzone: min-h-64 with dashed border (border-2 border-dashed)
- Drag active state: border-blue-500 bg-blue-50
- Center icon (cloud upload) + primary text + supported formats below
- Progress indicators for batch uploads (linear progress bars)

### Smart Albums
- Card-based layout with thumbnail previews (4-photo grid preview)
- AI-generated album titles with sparkle icon indicator
- Metadata: Photo count, date range, auto-generated description
- Theme-based icons (party hat, graduation cap, sports, etc.)

### Memory Boards / Collages
- Template selector: Horizontal scroll of preview cards
- Canvas area: White background with drop shadows for photos
- Customization panel (sidebar): Layouts, backgrounds, text overlays
- AI caption suggestions in italics with "Suggested by AI" badge

### Timeline View
- Vertical timeline with date markers (circles connected by lines)
- Photos cluster by detected events with AI-generated event titles
- Expandable sections (click date to expand/collapse photos)
- Smooth scroll with snap points at dates

### Search & Filters
- Search bar with AI-powered suggestions dropdown
- Filter chips: Date range, location, people, activities, events (removable)
- Visual search results: Masonry grid with relevance score indicators
- "Search by description" feature prominent (e.g., "beach sunset with friends")

### AI Feature Indicators
- Subtle sparkle/star icons next to AI-generated content
- Processing states: Pulsing gradient borders during AI analysis
- Confidence badges: "High confidence" tags for accurate AI detections
- Inline suggestions: Soft background highlights (bg-blue-50 rounded-md p-2)

## Images
**Hero Section**: Full-width hero showcasing app in action
- Image: College students viewing photo collages on laptop/mobile devices
- Placement: Top of homepage, h-[500px] md:h-[600px]
- Overlay: Gradient from bottom (dark to transparent) with headline + CTA
- CTA buttons: Blurred background (backdrop-blur-md bg-white/30)

**Feature Demonstrations**: 
- Screenshots of AI tagging in action
- Before/after collage examples
- Timeline view examples
Placement: Within feature sections as visual proof

**Empty States**:
- Illustrations for "No photos yet" (friendly, encouraging upload)
- "No albums" state with create album prompt

## Special Interactions
- Photo preview modal: Full-screen overlay with navigation arrows, minimal animations
- Batch selection: Checkbox overlays appear on hover, select mode toggle
- Drag-and-drop: Visual feedback with ghost images and drop zone highlights
- Infinite scroll: For photo galleries with loading spinners

## Mobile Considerations
- Touch-friendly targets (min-h-12 for buttons)
- Swipe gestures: Swipe photo cards for quick actions
- Bottom sheet modals instead of sidebar panels
- Grid adapts to 2 columns maximum on mobile
- Sticky upload FAB (floating action button) bottom-right

## Accessibility
- Alt text auto-generated by AI for all photos (editable)
- Keyboard navigation for all interactions
- Focus states clearly visible (ring-2 ring-blue-500)
- ARIA labels for icon-only buttons
- High contrast mode support for UI elements (not photos)