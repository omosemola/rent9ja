// ============================================================================
// PropertyImage: network image with the bundled house photo as fallback
// (Flutter: Image.network with errorBuilder → Image.asset)
// ============================================================================

import { Image } from 'expo-image';
import { useState } from 'react';
import type { StyleProp, ViewStyle } from 'react-native';
import type { ImageStyle } from 'expo-image';

// eslint-disable-next-line @typescript-eslint/no-require-imports
const FALLBACK = require('../../assets/images/onboarding_house.jpg');

export interface PropertyImageProps {
  uri?: string | null;
  style?: StyleProp<ImageStyle | ViewStyle>;
}

export function PropertyImage({ uri, style }: PropertyImageProps) {
  const [failed, setFailed] = useState(false);
  const source = uri && !failed ? { uri } : FALLBACK;

  return (
    <Image
      source={source}
      style={style as StyleProp<ImageStyle>}
      contentFit="cover"
      transition={200}
      onError={() => setFailed(true)}
    />
  );
}

export const FALLBACK_IMAGE = FALLBACK;
