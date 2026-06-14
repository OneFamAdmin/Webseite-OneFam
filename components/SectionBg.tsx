import Image from 'next/image';

type SectionBgProps = {
  /** drop in a real photo later; without it a clean dark placeholder renders */
  src?: string;
  alt?: string;
  /** overlay color/gradient on top of image or placeholder */
  overlay?: string;
  grayscale?: boolean;
  priority?: boolean;
  className?: string;
};

export default function SectionBg({
  src,
  alt = '',
  overlay = 'rgba(0,0,0,0.65)',
  grayscale = false,
  priority = false,
  className,
}: SectionBgProps) {
  return (
    <div className={`absolute inset-0 z-0 overflow-hidden bg-bg ${className ?? ''}`}>
      {src ? (
        <Image
          src={src}
          alt={alt}
          fill
          priority={priority}
          sizes="100vw"
          className={`object-cover ${grayscale ? 'grayscale' : ''}`}
        />
      ) : (
        // placeholder: solid base + subtle inset vignette (no orb, no gradient, no white)
        <div className="absolute inset-0 bg-bg shadow-[inset_0_0_200px_60px_rgba(0,0,0,0.6)]" />
      )}
      <div className="absolute inset-0" style={{ background: overlay }} />
    </div>
  );
}
