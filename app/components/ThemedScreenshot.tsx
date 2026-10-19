const THEMES = ['dark', 'light'] as const;

interface ThemedScreenshotProps {
  // Folder holding dark/ and light/ subfolders of <file>-<480|960>.<avif|webp>
  basePath: string;
  file: string;
  alt: string;
  sizes: string;
}

// Renders both theme variants and hides one with CSS, so the right set is
// chosen before hydration. Lazy images that are display:none are never
// fetched (eager ones would be, so this is always lazy; lazy images already
// in view still load right away).
export default function ThemedScreenshot({
  basePath,
  file,
  alt,
  sizes,
}: ThemedScreenshotProps) {
  const src = (theme: string, width: number, ext: string) =>
    `${basePath}/${theme}/${file}-${width}.${ext}`;

  return THEMES.map((theme) => (
    <picture
      key={theme}
      className={theme === 'dark' ? 'hidden dark:block' : 'dark:hidden'}
    >
      <source
        type="image/avif"
        srcSet={`${src(theme, 480, 'avif')} 480w, ${src(theme, 960, 'avif')} 960w`}
        sizes={sizes}
      />
      <img
        src={src(theme, 960, 'webp')}
        srcSet={`${src(theme, 480, 'webp')} 480w, ${src(theme, 960, 'webp')} 960w`}
        sizes={sizes}
        alt={alt}
        width={1320}
        height={2868}
        loading="lazy"
        decoding="async"
        className="h-auto w-full"
      />
    </picture>
  ));
}
