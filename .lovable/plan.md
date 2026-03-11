

## Plan: Add GPS geolocation button to desktop hero search card

Currently the desktop `LocationAutocomplete` has `hideGps` set to `true`, which hides the "Usar minha localização" button. The fix is simply removing that prop so the GPS button appears inline next to the location input on desktop.

### Change

**`src/components/guardaai/Hero.tsx` (line ~110)**
- Remove `hideGps` prop from the desktop `LocationAutocomplete` component.

That's it — the `LocationAutocomplete` component already has the GPS button built in; it's just hidden on desktop via the `hideGps` prop.

