

## Problem

When navigating between pages (e.g. clicking "Quero guardar" or "Anunciar espaço"), React Router does not automatically scroll to the top. The browser preserves the previous scroll position, so the new page appears scrolled down.

## Solution

Add a `ScrollToTop` component that listens to `location.pathname` changes and calls `window.scrollTo(0, 0)` on every navigation. Place it inside `<BrowserRouter>` in `App.tsx`.

### Changes

**1. Create `src/components/ScrollToTop.tsx`**
- Simple component using `useEffect` + `useLocation` to scroll to top on pathname change.

**2. Update `src/App.tsx`**
- Import and render `<ScrollToTop />` right after `<BrowserRouter>`.

This is a standard React Router pattern — two small changes, fixes all page transitions globally.

