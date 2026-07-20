/**
 * Elevation / shadow design tokens — `docs/08-Design-System.md`'s Elevation & Shadows table.
 *
 * That table specifies shadows in web `box-shadow` syntax (`0 <offsetY>px <blurRadius>px
 * rgba(0,0,0,<opacity>)`). React Native has no `box-shadow`; per Section 8 of
 * `docs/engineering/Sprint-0-Engineering-Design.md`, this file centralizes the
 * `Platform.OS === 'android' ? {elevation} : {shadow...}` branch already used correctly in
 * `DoctorCard.tsx`, so every card-like component can import one token instead of re-implementing
 * the platform branch.
 *
 * `md`'s iOS params (offset y=4, radius=6, opacity=0.1) and Android `elevation: 4` are the exact
 * values `DoctorCard.tsx` already used prior to this migration — preserved as-is so adopting the
 * token changes zero pixels. `sm`/`lg`/`xl` follow the same offset/radius/opacity progression the
 * design doc's own table describes, with Android `elevation` values chosen per Material Design's
 * conventional low/medium/high elevation steps (2/4/8/16).
 */
import { Platform, type ViewStyle } from 'react-native';

import { BLACK } from './colors';

export type ShadowToken = ViewStyle;

function buildShadow(
  offsetY: number,
  radius: number,
  opacity: number,
  elevation: number,
): ShadowToken {
  return Platform.OS === 'android'
    ? { elevation }
    : {
        shadowColor: BLACK,
        shadowOffset: { width: 0, height: offsetY },
        shadowOpacity: opacity,
        shadowRadius: radius,
      };
}

// 0 1px 2px rgba(0,0,0,0.05) — subtle borders
export const SHADOW_SM: ShadowToken = buildShadow(1, 2, 0.05, 2);
// 0 4px 6px rgba(0,0,0,0.1) — cards, buttons (DoctorCard.tsx's existing values)
export const SHADOW_MD: ShadowToken = buildShadow(4, 6, 0.1, 4);
// 0 10px 15px rgba(0,0,0,0.1) — modals, bottom sheets
export const SHADOW_LG: ShadowToken = buildShadow(10, 15, 0.1, 8);
// 0 20px 25px rgba(0,0,0,0.15) — full-screen modals
export const SHADOW_XL: ShadowToken = buildShadow(20, 25, 0.15, 16);

export const ELEVATION = {
  sm: SHADOW_SM,
  md: SHADOW_MD,
  lg: SHADOW_LG,
  xl: SHADOW_XL,
} as const;

export type ElevationToken = typeof ELEVATION;
