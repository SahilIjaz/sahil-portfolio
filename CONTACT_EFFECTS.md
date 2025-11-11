# Contact Form Visual Effects

Beautiful dark and light mode effects have been added to your contact form section!

## Visual Effects Added

### 1. **Animated Background Orbs**
Three large gradient orbs that continuously animate in the background:
- **Blue orb** (top-left): Rotates and scales with a 25-second cycle
- **Purple orb** (bottom-right): Counter-rotates and scales with a 20-second cycle
- **Central gradient orb**: Floats up and down with pulsing opacity (8-second cycle)

### 2. **Form Card Enhancements**
- **Glassmorphism effect**: Semi-transparent backdrop with blur
- **Gradient border glow**: Subtle border with gradient colors
- **Hover animation**: Slight scale effect when hovering
- **Shadow depth**: Enhanced shadow for depth

### 3. **Corner Light Effects**
Animated glowing lights in the corners of the form:
- **Top-right corner**: Blue gradient light that pulses (3-second cycle)
- **Bottom-left corner**: Purple gradient light that pulses (4-second cycle)
- Creates a soft ambient glow around the form

## Dark vs Light Mode Behavior

### Light Mode
- **Background orbs**: More vibrant with 20% opacity
- **Form card**: White with 80% opacity + backdrop blur
- **Corner lights**: 30% opacity gradient glows
- **Overall feel**: Bright, airy, and energetic

### Dark Mode
- **Background orbs**: Subtle with 10% opacity
- **Form card**: Dark gray with 80% opacity + backdrop blur
- **Corner lights**: 20% opacity gradient glows
- **Overall feel**: Sophisticated, calm, and modern

## Technical Details

All effects use:
- **Framer Motion** for smooth animations
- **Tailwind CSS** utility classes for styling
- **CSS blur filters** for the soft glow effects
- **Gradient backgrounds** matching your portfolio's color scheme
- **Responsive design** - works on all screen sizes

## Animation Performance

All animations use:
- CSS transforms (scale, rotate, translate) - GPU accelerated
- Opacity transitions - efficient rendering
- Infinite loops with `ease-in-out` timing
- No performance impact on form functionality

## Color Scheme

Effects use your portfolio's gradient colors:
- Blue (#3B82F6)
- Purple (#9333EA)
- Pink (#EC4899)
- Cyan (#06B6D4)

## Accessibility

- Effects are purely decorative and don't interfere with form usage
- All form fields remain fully accessible
- No motion for users who prefer reduced motion (can be enhanced if needed)
- High contrast maintained for readability

## How to Test

1. Run `npm run dev`
2. Navigate to the Contact section
3. Toggle between dark/light mode using the sun/moon icon
4. Observe the different effect intensities
5. Try hovering over the form
6. Watch the ambient animations

---

**The contact section now has beautiful, smooth animations that adapt to both dark and light themes!** ✨
