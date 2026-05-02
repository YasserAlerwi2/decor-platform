# Design System Document: The Luminescent Atelier

## 1. Overview & Creative North Star

**Creative North Star: The Luminescent Atelier**
This design system is a rejection of the "generic corporate dark mode." It is an editorial-first framework designed to showcase high-end interior transformations through the lens of luxury and light. We treat the screen not as a flat surface, but as a three-dimensional space where light (vibrant neons) and shadow (deep midnight blues) define form.

By breaking the traditional rigid grid through intentional asymmetry and overlapping elements, we create a "Digital Atelier" experience. We prioritize high-resolution imagery, letting the textures of marble, wood, and fabric bleed into the UI. The layout should feel like a premium coffee table book—spacious, authoritative, and sophisticated.

---

## 2. Colors

The palette is anchored in a deep midnight foundation (`background: #060e20`), punctuated by high-energy electrical accents.

### The Color Strategy
- **Primary Lavender (`primary: #ba9eff`):** Used for primary actions and visionary highlights. It represents the "dream" phase of renovation.
- **Secondary Neon (`secondary: #6bff8f`):** Used for conversion-focused actions (like WhatsApp buttons) and "live" indicators. It represents growth and execution.
- **Surface Hierarchy:** Depth is created through the `surface-container` scale rather than lines. 

### Core Rules
- **The "No-Line" Rule:** 1px solid borders are strictly prohibited for sectioning. Boundaries must be defined solely through background color shifts. For example, a `surface-container-low` section should sit against a `surface` background to create a natural, soft-edge distinction.
- **Surface Hierarchy & Nesting:** Treat the UI as stacked sheets of tinted glass. An inner card should use `surface-container-highest` when placed on a `surface-container-low` background. This "tonal nesting" creates sophisticated depth without visual clutter.
- **The "Glass & Gradient" Rule:** Floating elements (like mobile navigation bars or sticky headers) must use Glassmorphism. Utilize `surface-bright` at 60% opacity with a `20px` backdrop-blur. 
- **Signature Textures:** Apply subtle radial gradients using `primary-dim` to `primary_container` for hero background glows. This mimics the "neon sign" effect seen in high-end architectural photography.

---

## 3. Typography

The typography scale is designed for an international audience, focusing on high-contrast hierarchy and the elegance of the Arabic script.

- **Display & Headline (Plus Jakarta Sans / Arabic Equivalent):** These are our "Statement Pieces." Use `display-lg` (3.5rem) for hero sections to create an editorial feel. In Arabic, ensure the weight is sufficient to carry the "neon" glow effect without losing legibility.
- **Body & Labels (Inter):** These are our "Functional Hardware." `body-lg` (1rem) provides a readable, modern foundation for service descriptions. 

**Typography as Identity:**
By using a massive contrast between `display-lg` and `body-sm`, we create an "Editorial Rhythm." Headlines should feel like architectural features—bold, tall, and commanding.

---

## 4. Elevation & Depth

We move away from the "drop shadow" defaults of the early web, opting instead for **Tonal Layering** and **Luminescent Ambient Light**.

- **The Layering Principle:** Depth is achieved by "stacking" surface tiers.
    - *Level 0:* `surface` (The foundation)
    - *Level 1:* `surface-container-low` (Content sections)
    - *Level 2:* `surface-container-highest` (Interactive cards)
- **Luminescent Shadows:** When a "floating" effect is required, shadows should not be black. Use a tinted version of `primary` or `secondary` at 5-10% opacity with a large blur radius (30px+) to create a "glow" rather than a shadow.
- **The "Ghost Border" Fallback:** If a container requires a boundary (e.g., an input field), use the `outline-variant` token at **15% opacity**. A 100% opaque border is considered "low-end" in this system.
- **Glassmorphism:** For mobile bottom-sheets and menus, use semi-transparent surface colors. This allows the vibrant imagery of luxury interiors to bleed through the UI, maintaining a sense of place.

---

## 5. Components

### Buttons
- **Primary:** Pill-shaped (`rounded-full`). Background uses a gradient of `primary` to `primary-dim`. Text is `on-primary-fixed` (Black) for maximum punch.
- **Secondary (WhatsApp/Contact):** Uses `secondary` (Neon Green). This is reserved for direct conversion.
- **Tertiary/Ghost:** No background. Uses `outline-variant` at 20% for the "Ghost Border" and `on-surface` for text.

### Cards & Image Containers
- **The "Frameless" Approach:** Forbid divider lines. Use `rounded-xl` (0.75rem) for all imagery.
- **Overlays:** Text should overlap imagery using a `surface-container-lowest` gradient fade at the bottom of the image to ensure the white `on-surface` text remains legible against varied photo backgrounds.

### Inputs & Forms
- **Fields:** Use `surface-container-highest` as the base. No bottom line. Use a `2px` `primary` indicator only on the "Active" state.
- **Error States:** Use `error` (`#ff6e84`) for text, but keep the container `surface-container-highest` to prevent the UI from looking "broken."

### Custom Component: The "Service Carousel"
For decoration services, use asymmetrical card sizing. The "Active" card should be slightly larger with a `primary` ambient glow, while inactive cards use `surface-container-low` to recede into the background.

---

## 6. Do's and Don'ts

### Do
- **DO** use white space aggressively. A luxury brand "breathes."
- **DO** use the `secondary` neon green exclusively for "Action" and "Contact" to create a pavlovian response in the user.
- **DO** lean into the dark theme. Ensure `on-surface` (light blue-grey) is used for body text to reduce eye strain against the `#060e20` background.
- **DO** use high-quality, wide-angle photography that matches the "Luminescent" vibe (interior shots with intentional lighting).

### Don't
- **DON'T** use pure `#000000` black unless it is for `surface-container-lowest` in specific high-contrast sections. 
- **DON'T** use 1px solid dividers. Use vertical spacing (`2rem` or more) to separate content blocks.
- **DON'T** apply the neon colors to body text. Neons are for "Light Sources" (Icons, Buttons, Headlines); text must remain legible and stable.
- **DON'T** use sharp corners. Every element should feel "finished" and "polished," adhering to the `rounded-md` to `rounded-xl` scale.