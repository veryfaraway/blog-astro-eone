export type WatermarkStyle = 'nakgwan' | 'wax';
export type WatermarkOption = boolean | WatermarkStyle;
export type WatermarkPosition = 'south_east' | 'south_west' | 'north_east' | 'north_west';

const DEFAULT_CLOUD_NAME = 'doal3ofyr';

const WATERMARK_PRESETS: Record<
  WatermarkStyle,
  { overlayId: string; relativeWidth: number; opacity: number }
> = {
  nakgwan: {
    overlayId: 'brand:watermark-nakgwan',
    relativeWidth: 0.052,
    opacity: 80,
  },
  wax: {
    overlayId: 'brand:watermark-wax',
    relativeWidth: 0.068,
    opacity: 88,
  },
};

const TX_TOKEN_RE =
  /^(?:\$[a-zA-Z][a-zA-Z0-9]*_|(?:a|ar|b|bo|c|co|cs|d|dl|dn|dpr|du|e|eo|f|fl|fn|fps|g|h|if|ki|l|o|p|pg|q|r|so|sp|t|u|vc|w|x|y|z)_)/;

export function resolveWatermarkStyle(
  option: WatermarkOption | undefined,
  fallback: WatermarkStyle | false = 'nakgwan'
): WatermarkStyle | false {
  if (option === undefined) return fallback;
  if (option === false) return false;
  if (option === true) return 'nakgwan';
  return option;
}

export function buildWatermarkChain(
  style: WatermarkStyle,
  position: WatermarkPosition = 'south_east'
): string {
  const preset = WATERMARK_PRESETS[style];
  return `l_${preset.overlayId}/c_scale,fl_relative,w_${preset.relativeWidth}/o_${preset.opacity}/fl_layer_apply,g_${position},x_0.022,y_0.03`;
}

export function buildCloudinaryImageUrl(
  publicId: string,
  options: {
    cloudName?: string;
    width: number;
    watermark?: WatermarkStyle | false;
    position?: WatermarkPosition;
    format?: 'auto' | 'jpg';
  }
): string {
  const cloud =
    options.cloudName || import.meta.env.PUBLIC_CLOUDINARY_CLOUD_NAME || DEFAULT_CLOUD_NAME;
  const parts = [`c_scale,w_${options.width}`];
  if (options.watermark) {
    parts.push(buildWatermarkChain(options.watermark, options.position ?? 'south_east'));
  }
  parts.push(`f_${options.format ?? 'auto'}`, 'q_auto');
  const cleanPublicId = publicId.replace(/^\/+/, '');
  return `https://res.cloudinary.com/${cloud}/image/upload/${parts.join('/')}/${cleanPublicId}`;
}

export function buildCloudinaryLqipUrl(publicId: string, cloudName?: string): string {
  const cloud = cloudName || import.meta.env.PUBLIC_CLOUDINARY_CLOUD_NAME || DEFAULT_CLOUD_NAME;
  const cleanPublicId = publicId.replace(/^\/+/, '');
  return `https://res.cloudinary.com/${cloud}/image/upload/c_scale,w_50/e_blur:1000/f_auto/q_1/${cleanPublicId}`;
}

function isTxSegment(segment: string): boolean {
  if (!segment || /^v\d+$/.test(segment)) return false;
  return segment.split(',').every((token) => TX_TOKEN_RE.test(token));
}

/**
 * 포스트 frontmatter의 Cloudinary thumbnail URL에 워터마크 레이어를 동적 주입합니다.
 * 외부 이미지(Unsplash 등)나 이미 워터마크가 포함된 URL은 원본 그대로 반환합니다.
 */
export function withCloudinaryUrlWatermark(
  url: string | undefined,
  options?: {
    watermark?: WatermarkOption;
    position?: WatermarkPosition;
    format?: 'auto' | 'jpg';
  }
): string | undefined {
  if (!url) return url;

  const style = resolveWatermarkStyle(options?.watermark, 'nakgwan');
  if (!style) return url;

  const cloud = import.meta.env.PUBLIC_CLOUDINARY_CLOUD_NAME || DEFAULT_CLOUD_NAME;
  const prefix = `https://res.cloudinary.com/${cloud}/image/upload/`;
  if (!url.startsWith(prefix) || url.includes('/l_brand:watermark-')) {
    return url;
  }

  const segments = url.slice(prefix.length).split('/');
  let splitIdx = 0;
  while (splitIdx < segments.length - 1 && isTxSegment(segments[splitIdx])) {
    splitIdx += 1;
  }

  const existingTx = segments.slice(0, splitIdx);
  const assetTail = segments.slice(splitIdx).join('/');
  if (!assetTail) return url;

  // f_* / q_*는 워터마크 합성 뒤에 위치해야 하므로 분리하고, 기존 리사이즈/크롭 컴포넌트는 보존
  const preservedComponents: string[] = [];
  for (const comp of existingTx) {
    const tokens = comp
      .split(',')
      .filter((t) => !t.startsWith('f_') && !t.startsWith('q_'));
    if (tokens.length === 0) continue;
    const hasCrop = tokens.some((t) => t.startsWith('c_'));
    const hasDim = tokens.some((t) => t.startsWith('w_') || t.startsWith('h_'));
    if (hasDim && !hasCrop) {
      tokens.unshift('c_scale');
    }
    preservedComponents.push(tokens.join(','));
  }

  if (preservedComponents.length === 0) {
    preservedComponents.push('c_scale,w_1200');
  }

  const format = options?.format ?? 'auto';
  const finalChain = [
    ...preservedComponents,
    buildWatermarkChain(style, options?.position ?? 'south_east'),
    `f_${format}`,
    'q_auto',
    assetTail,
  ].join('/');

  return `${prefix}${finalChain}`;
}
