# UI/UX Design Guidelines

## Design Philosophy

**Minimalist, High-End, Functional**

The design should prioritize clarity, efficiency, and aesthetics. Every element serves a purpose. No unnecessary decoration or clutter. Premium feel through careful attention to typography, spacing, and micro-interactions.

### Core Principles

1. **Clarity First**: Information hierarchy should be immediately apparent
2. **Breathing Room**: Generous whitespace, never cramped
3. **Consistency**: Predictable patterns throughout the interface
4. **Speed**: Fast interactions, minimal loading states
5. **Accessibility**: WCAG 2.1 AA compliant, keyboard navigation

---

## Design System

### Color Palette

#### Neutrals (Base)
- **Background**: `#FAFAFA` (light) / `#0A0A0A` (dark)
- **Surface**: `#FFFFFF` (light) / `#1A1A1A` (dark)
- **Surface Elevated**: `#FFFFFF` with shadow (light) / `#252525` (dark)
- **Border**: `#E5E5E5` (light) / `#2A2A2A` (dark)
- **Border Subtle**: `#F0F0F0` (light) / `#1F1F1F` (dark)

#### Text
- **Primary**: `#0A0A0A` (light) / `#FAFAFA` (dark)
- **Secondary**: `#737373` (light) / `#A3A3A3` (dark)
- **Tertiary**: `#A3A3A3` (light) / `#737373` (dark)
- **Disabled**: `#D4D4D4` (light) / `#404040` (dark)

#### Accent Colors (Semantic)
- **Primary/Brand**: `#2563EB` (blue)
  - Hover: `#1D4ED8`
  - Light: `#DBEAFE`
- **Success**: `#10B981` (green)
  - Light: `#D1FAE5`
- **Warning**: `#F59E0B` (amber)
  - Light: `#FEF3C7`
- **Error**: `#EF4444` (red)
  - Light: `#FEE2E2`
- **Info**: `#6366F1` (indigo)
  - Light: `#E0E7FF`

#### Status Colors
- **To Do**: `#737373` (gray)
- **In Progress**: `#3B82F6` (blue)
- **In Review**: `#F59E0B` (amber)
- **Done**: `#10B981` (green)
- **Blocked**: `#EF4444` (red)

#### Priority Colors
- **Low**: `#64748B` (slate)
- **Medium**: `#F59E0B` (amber)
- **High**: `#F97316` (orange)
- **Urgent**: `#DC2626` (red)

---

### Typography

#### Font Families
**Primary**: Inter, -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif
**Monospace**: "SF Mono", Consolas, "Courier New", monospace

#### Type Scale
```css
/* Headings */
h1: 32px / 2rem (font-weight: 600, line-height: 1.2)
h2: 24px / 1.5rem (font-weight: 600, line-height: 1.3)
h3: 20px / 1.25rem (font-weight: 600, line-height: 1.4)
h4: 16px / 1rem (font-weight: 600, line-height: 1.5)

/* Body */
body-lg: 16px / 1rem (font-weight: 400, line-height: 1.6)
body: 14px / 0.875rem (font-weight: 400, line-height: 1.6)
body-sm: 13px / 0.8125rem (font-weight: 400, line-height: 1.5)
body-xs: 12px / 0.75rem (font-weight: 400, line-height: 1.4)

/* UI Elements */
button: 14px / 0.875rem (font-weight: 500)
label: 13px / 0.8125rem (font-weight: 500)
caption: 12px / 0.75rem (font-weight: 400)
```

#### Font Weights
- Regular: 400
- Medium: 500
- Semibold: 600
- Bold: 700 (use sparingly)

---

### Spacing System

**8px Base Grid**

```
0.5: 4px
1: 8px
1.5: 12px
2: 16px
2.5: 20px
3: 24px
4: 32px
5: 40px
6: 48px
8: 64px
10: 80px
12: 96px
16: 128px
```

#### Component Spacing
- **Cards**: Padding 20px (2.5)
- **Buttons**: Padding 8px 16px (1, 2)
- **Inputs**: Padding 8px 12px (1, 1.5)
- **Sections**: Margin bottom 32px (4)
- **List Items**: Padding 12px (1.5)

---

### Layout

#### Container Widths
- **Max Width**: 1440px
- **Content Width**: 1200px
- **Sidebar**: 240px (fixed) or 280px (expanded)
- **Main Content**: Dynamic, min 600px

#### Breakpoints
```css
sm: 640px   /* Mobile landscape */
md: 768px   /* Tablet */
lg: 1024px  /* Desktop */
xl: 1280px  /* Large desktop */
2xl: 1536px /* Extra large */
```

#### Grid System
- **Dashboard**: Sidebar (fixed) + Main content (fluid)
- **Cards**: CSS Grid with auto-fit, minmax(280px, 1fr)
- **Forms**: Single column on mobile, two-column on desktop

---

## Component Library

### Buttons

#### Variants
- **Primary**: Filled with brand color, white text
- **Secondary**: Outlined, brand color border and text
- **Ghost**: No border, hover background
- **Danger**: Red background for destructive actions

#### Sizes
- **xs**: 28px height, 12px font
- **sm**: 32px height, 13px font
- **md**: 36px height, 14px font (default)
- **lg**: 40px height, 16px font

#### States
- Default
- Hover (slight darkening or background)
- Active (pressed state)
- Disabled (50% opacity, no pointer)
- Loading (spinner + disabled)

```css
/* Primary Button */
background: #2563EB
color: white
padding: 8px 16px
border-radius: 6px
font-weight: 500
transition: all 150ms

hover: background: #1D4ED8

/* Icon Button */
40x40px square
border-radius: 6px
hover: background: #F5F5F5
```

---

### Input Fields

#### Text Input
```css
height: 40px
padding: 8px 12px
border: 1px solid #E5E5E5
border-radius: 6px
font-size: 14px

focus:
  border: 1px solid #2563EB
  outline: 2px solid #DBEAFE (offset by 1px)

error:
  border: 1px solid #EF4444
```

#### Select Dropdown
- Custom styled (not native)
- Chevron icon on right
- Dropdown menu with shadow
- Search for long lists

#### Textarea
- Resizable vertically
- Min height: 80px
- Same styling as text input

---

### Cards

**Task Card (Kanban)**
```
┌─────────────────────────────┐
│ UI-1234                     │ ← Task ID (gray, small)
│ Design homepage header      │ ← Title (bold)
│                             │
│ [Icon] 2 Days               │ ← Time estimate
│ [Avatar] John Doe           │ ← Assignee
│ [Design] [High-priority]    │ ← Tags
└─────────────────────────────┘

Dimensions: 280px wide, dynamic height
Padding: 16px
Border: 1px solid #E5E5E5
Border-radius: 8px
Shadow: subtle on hover
Cursor: pointer
```

**Project Card**
```
┌─────────────────────────────┐
│ [Client Logo/Avatar]        │
│ Project Name                │ ← Title (bold)
│ Client Name                 │ ← Subtitle (gray)
│                             │
│ Progress: [======>    ] 60% │ ← Progress bar
│ 12 tasks • 5 days left      │ ← Meta info
│ [Active]                    │ ← Status badge
└─────────────────────────────┘
```

---

### Navigation

#### Top Navigation
```
Height: 64px
Border bottom: 1px solid #E5E5E5
Padding: 0 24px

Layout:
[Logo] [Search Bar] [Spacer] [Notifications] [User Menu]
```

#### Sidebar Navigation
```
Width: 240px
Background: #FAFAFA or #FFFFFF
Border right: 1px solid #E5E5E5

Sections:
- Workspace switcher (if multiple)
- Main nav items (with icons)
- Projects list (collapsible)
- Bottom: Settings, Help, User
```

**Nav Item**
```css
height: 40px
padding: 8px 12px
border-radius: 6px
font-size: 14px
icon: 20px

active:
  background: #F5F5F5
  font-weight: 500

hover:
  background: #FAFAFA
```

---

### Modals & Drawers

#### Modal (Center)
- **Overlay**: Black with 40% opacity
- **Container**: Max width 600px, white background, rounded corners
- **Header**: Title + close button
- **Body**: Scrollable if needed
- **Footer**: Actions (Cancel + Primary)

#### Drawer (Side)
- **Width**: 400px (sm) to 600px (lg)
- **Slide in from right**
- **Full height**
- **Shadow**: Large shadow for depth

---

### Tables & Lists

#### Table
```css
/* Header */
background: #FAFAFA
border-bottom: 2px solid #E5E5E5
font-weight: 600
padding: 12px

/* Row */
border-bottom: 1px solid #F0F0F0
padding: 12px
hover: background: #FAFAFA

/* Cell */
padding: 12px 16px
font-size: 14px
```

#### List Item
- Padding: 12px 16px
- Hover: Background change
- Active: Left border accent
- Avatar + text layout

---

### Badges & Tags

#### Badge
```css
display: inline-flex
padding: 4px 8px
border-radius: 4px
font-size: 12px
font-weight: 500

/* Status Badge */
Status-specific colors (see status colors)
```

#### Tag
```css
display: inline-flex
padding: 4px 10px
border-radius: 12px (pill shape)
font-size: 12px
background: light color
text: darker shade
```

---

### Icons

**Library**: Lucide React

**Sizes**:
- xs: 16px
- sm: 18px
- md: 20px (default)
- lg: 24px
- xl: 32px

**Usage**:
- Always pair with text labels for primary actions
- Use tooltips for icon-only buttons
- Consistent stroke width: 2px

---

## Key Screens Layout

### Dashboard (Kanban Board)

```
┌─────────────────────────────────────────────────────────┐
│  [Logo]  [Search]                    [Notif] [User]     │ ← Top Nav
├──────────┬──────────────────────────────────────────────┤
│          │ [Board ▾] [List] [Timeline] [Calendar]       │ ← View Tabs
│          │ [Design ▾] [+Filter]                         │ ← Filters
│ [Home]   │                                              │
│ [Tasks]  │ ┌─────────┬─────────┬─────────┬─────────┐  │
│ [Proj]   │ │ To Do 3 │ Progress│ Review 3│ Done 12 │  │
│ [Client] │ │         │    2    │         │         │  │
│          │ │ [Card]  │ [Card]  │ [Card]  │ [Card]  │  │
│ [---]    │ │ [Card]  │ [Card]  │ [Card]  │ [Card]  │  │
│ Projects │ │ [Card]  │         │ [Card]  │ ...     │  │
│  • Proj1 │ │         │         │         │         │  │
│  • Proj2 │ │ [+Add]  │ [+Add]  │ [+Add]  │         │  │
│          │ └─────────┴─────────┴─────────┴─────────┘  │
│ [---]    │                                              │
│          │                                              │
│ Settings │                                              │
└──────────┴──────────────────────────────────────────────┘
```

### Task Detail Modal

```
┌─────────────────────────────────────────────┐
│ UI-1234: Design homepage          [✕]       │ ← Header
├─────────────────────────────────┬───────────┤
│                                 │ Status ▾  │
│ [Rich Text Editor]              │ [Prog] ▾  │
│ - Description                   │           │
│ - Checklists                    │ Assignee  │
│ - Attachments                   │ [Avatar]  │
│                                 │           │
│ ─────────────────────────       │ Due Date  │
│                                 │ Nov 15    │
│ Comments (3)                    │           │
│ [Avatar] John: Looking good!    │ Time      │
│ [Avatar] You: Thanks!           │ Est: 2h   │
│                                 │ Track: 1h │
│ [Add comment...]                │           │
│                                 │ Tags      │
│                                 │ [Design]  │
│                                 │ [UI/UX]   │
└─────────────────────────────────┴───────────┘
```

---

## Micro-interactions

### Hover Effects
- **Cards**: Slight elevation (shadow increase)
- **Buttons**: Background darkening or lightening
- **Links**: Underline fade in
- **Icons**: Scale slightly (1.05x)

### Transitions
- **Default**: 150ms ease-in-out
- **Modal/Drawer**: 200ms ease
- **Page transitions**: 300ms

### Loading States
- **Button**: Spinner replaces text, button disabled
- **Card**: Skeleton with shimmer animation
- **Page**: Centered spinner or skeleton layout

### Drag & Drop
- **Grab**: Cursor changes to grab hand
- **Dragging**: Card has higher elevation, slight rotation
- **Drop zone**: Highlight column with border or background change
- **Feedback**: Smooth animations, haptic feedback on mobile

---

## Accessibility

### Keyboard Navigation
- Tab order follows visual hierarchy
- Focus indicators clearly visible (2px outline)
- All actions accessible via keyboard
- Escape closes modals/dropdowns
- Enter submits forms

### Screen Readers
- Semantic HTML (header, nav, main, aside)
- ARIA labels where needed
- Image alt text
- Form labels properly associated

### Color Contrast
- Text: Minimum 4.5:1 ratio
- Large text: Minimum 3:1 ratio
- Interactive elements: Minimum 3:1

---

## Dark Mode

- All colors have dark mode equivalents
- Toggle in user settings
- Persist preference
- Smooth transition (300ms) between modes
- Test all components in both modes

---

## Responsive Design

### Mobile (< 768px)
- Sidebar collapses to hamburger menu
- Kanban columns scroll horizontally
- Task cards full width
- Single column forms
- Bottom navigation for key actions

### Tablet (768px - 1024px)
- Sidebar collapsible
- 2-column Kanban
- Optimized card sizes

### Desktop (> 1024px)
- Full sidebar
- Multi-column Kanban (3-4 columns visible)
- Hover states active
- Keyboard shortcuts available
