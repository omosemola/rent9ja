---
name: RentNaija
colors:
  primary: "#0A6847"
  primaryLight: "#16A34A"
  primaryDark: "#064E3B"
  accent: "#D4A017"
  accentLight: "#FBBF24"
  white: "#FFFFFF"
  background: "#F8FAFC"
  surface: "#FFFFFF"
  textPrimary: "#0F172A"
  textSecondary: "#475569"
  error: "#DC2626"
---

# Design System: RentNaija
**Project ID:** RentNaija Mobile

## 1. Visual Theme & Atmosphere
RentNaija exudes a premium, trustworthy, and modern atmosphere tailored specifically for the Nigerian real estate market. The design philosophy centers on "Accessible Luxury"—using deep emerald greens and warm gold accents to evoke a sense of heritage, growth, and high-end living, while maintaining a clean, information-rich interface that is easy to navigate on mobile devices.

The UI is characterized by generous whitespace, soft rounded corners (16-20px), and subtle shadows that create depth without clutter. The use of the "Outfit" typeface provides a geometric yet friendly feel, ensuring excellent readability across various screen sizes.

## 2. Color Palette & Roles
### Primary Foundation
- **Deep Emerald (#0A6847)**: The primary brand color, representing Nigerian luxury, trust, and professional stability.
- **Emerald Surface (#ECFDF5)**: A very light tint used for backgrounds of active states or subtle highlights.
- **Slate Background (#F8FAFC)**: The main scaffold background, providing a cool, modern neutral base.

### Accent & Interactive
- **Warm Gold (#D4A017)**: Used for premium features, featured badges, and high-importance highlights.
- **Vibrant Green (#16A34A)**: Used for secondary actions and "success" indicators.

### Typography & Text Hierarchy
- **Deep Slate (#0F172A)**: Primary text for headings and high-contrast content.
- **Slate Gray (#475569)**: Secondary text for descriptions and labels.
- **Cool Gray (#94A3B8)**: Tertiary text for hints, placeholders, and subtle metadata.

### Functional States
- **Success Green (#16A34A)**: Confirmed actions and available properties.
- **Error Red (#DC2626)**: Alerts and validation errors.
- **Warning Gold (#F59E0B)**: Pending status or urgent notifications.

## 3. Typography Rules
### Hierarchy & Weights
- **Font Family**: Outfit (Google Fonts)
- **Headings**: Semi-Bold to Bold (w600-w700), used for titles and section headers.
- **Body**: Regular (w400) for standard reading, Medium (w500) for UI labels and sub-text.
- **Scale**:
  - H1/Display: 32px (Hero Titles)
  - H2/Headline: 20px (Section Headers)
  - Title: 15-16px (Card Titles)
  - Body: 14px (Standard Text)
  - Small/Label: 11-12px (Captions and badges)

### Spacing Principles
Typography uses relaxed line-heights for body text to improve readability, while display text is more compact. Letter-spacing is slightly tightened on large headings for a premium feel.

## 4. Component Stylings
### Buttons
- **Primary**: Solid Deep Emerald, 14px border radius, Semi-Bold text.
- **Outlined**: Hairline border in Deep Emerald, transparent background.
- **Interactive States**: Subtle scale transitions or color darkening on tap.

### Cards & Property Containers
- **Border Radius**: 16px (Standard List) to 20px (Featured).
- **Shadow**: Subtle bottom-heavy shadow (`BoxShadow(color: Colors.black.withOpacity(0.04), blurRadius: 15, offset: Offset(0, 4))`).
- **Layout**: Image top/left, followed by content with clear hierarchy (Price > Title > Location).

### Navigation
- **Bottom Nav**: Material 3 NavigationBar with indicator pill (`AppColors.primarySurface`).
- **Icons**: Outlined for inactive, Rounded/Filled for active.
- **Height**: 72px for ergonomic thumb reach.

### Inputs & Forms
- **Style**: Filled with `surfaceVariant` (Slate 100), no border by default, Emerald border on focus.
- **Radius**: 14px.
- **Padding**: Generous horizontal (20px) and vertical (18px) padding.

## 5. Layout Principles
### Grid & Structure
- **Margins**: Standard 20px side padding on all mobile screens.
- **Spacing**: 8px base grid (8, 16, 24, 32px increments).

### Whitespace Strategy
Generous vertical spacing between sections (24-32px) to prevent cognitive overload.

### Responsive Behavior & Touch
- **Touch Targets**: Minimum 48x48px for all interactive elements.
- **Scrolling**: Fluid vertical scrolling with horizontal sliders for categories and featured items.

## 6. Design System Notes for Stitch Generation
### Language to Use
"Premium Nigerian real estate", "Lekki luxury", "Trustworthy emerald", "Warm gold accents", "Clean geometric typography", "Spacious and airy".

### Component Prompts
- "A premium property card with a large image, emerald green price tag, and gold 'Featured' badge."
- "A modern search bar with rounded corners and a filter button in emerald green."
- "A sleek bottom navigation bar with emerald active state indicators."
