import React from 'react';
import Link from 'next/link';

export type ButtonVariant =
  | 'primary'
  | 'secondary'
  | 'on-dark-white'
  | 'on-dark-amber'
  | 'on-dark-glass'
  | 'call'
  | 'whatsapp';

interface ButtonBaseProps {
  variant?: ButtonVariant;
  children: React.ReactNode;
  className?: string;
  showArrow?: boolean;
}

type ButtonAsButton = ButtonBaseProps &
  Omit<React.ButtonHTMLAttributes<HTMLButtonElement>, keyof ButtonBaseProps> & {
    href?: undefined;
  };

type ButtonAsLink = ButtonBaseProps &
  Omit<React.AnchorHTMLAttributes<HTMLAnchorElement>, keyof ButtonBaseProps> & {
    href: string;
  };

export type ButtonProps = ButtonAsButton | ButtonAsLink;

/**
 * Button component conforming to Phase 2 specifications:
 * - primary: --plum fill, white text, pill, 48px, hover --plum-dark, trailing arrow moves 2px on hover
 * - secondary: transparent, 1.5px --blue border and text, hover --blue-tint
 * - on-dark-white: white fill, --plum text (hero primary)
 * - on-dark-amber: --amber fill, --ink text (CTA band Call)
 * - on-dark-glass: translucent white glass with white border (hero secondary)
 * - call: primary style + phone icon
 * - whatsapp: --whatsapp fill (#0B7A5A), white text + WhatsApp glyph
 */
export default function Button({
  variant = 'primary',
  children,
  className = '',
  showArrow = false,
  ...props
}: ButtonProps) {
  const getVariantStyles = (): React.CSSProperties => {
    switch (variant) {
      case 'primary':
      case 'call':
        return {
          backgroundColor: 'var(--plum)',
          color: 'var(--surface)',
          border: 'none',
        };
      case 'secondary':
        return {
          backgroundColor: 'transparent',
          color: 'var(--blue)',
          border: '1.5px solid var(--blue)',
        };
      case 'on-dark-white':
        return {
          backgroundColor: 'var(--surface)',
          color: 'var(--plum)',
          border: 'none',
        };
      case 'on-dark-amber':
        return {
          backgroundColor: 'var(--amber)',
          color: 'var(--ink)',
          border: 'none',
          fontWeight: 600,
        };
      case 'on-dark-glass':
        return {
          backgroundColor: 'rgba(255, 255, 255, 0.15)',
          color: 'var(--surface)',
          border: '1.5px solid rgba(255, 255, 255, 0.7)',
          backdropFilter: 'blur(4px)',
        };
      case 'whatsapp':
        return {
          backgroundColor: 'var(--whatsapp)',
          color: 'var(--surface)',
          border: 'none',
          fontWeight: 600,
        };
      default:
        return {};
    }
  };

  const baseClassName = `group inline-flex items-center justify-center gap-2 h-12 px-6 rounded-full font-medium text-base transition-colors duration-150 cursor-pointer text-decoration-none select-none disabled:opacity-50 disabled:cursor-not-allowed ${
    variant === 'primary' ? 'hover:bg-[var(--plum-dark)]' : ''
  } ${variant === 'secondary' ? 'hover:bg-[var(--blue-tint)]' : ''} ${className}`;

  const content = (
    <>
      {variant === 'call' && (
        <svg
          width="18"
          height="18"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="1.75"
          strokeLinecap="round"
          strokeLinejoin="round"
          aria-hidden="true"
          className="shrink-0"
        >
          <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z" />
        </svg>
      )}

      {variant === 'whatsapp' && (
        <svg
          width="18"
          height="18"
          viewBox="0 0 24 24"
          fill="currentColor"
          aria-hidden="true"
          className="shrink-0"
        >
          <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" />
        </svg>
      )}

      <span>{children}</span>

      {(showArrow || variant === 'primary') && (
        <svg
          width="16"
          height="16"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
          aria-hidden="true"
          className="shrink-0 transition-transform duration-150 group-hover:translate-x-0.5"
        >
          <polyline points="9 18 15 12 9 6" />
        </svg>
      )}
    </>
  );

  if ('href' in props && props.href) {
    const { href, ...linkProps } = props;
    const isInternal = href.startsWith('/') || href.startsWith('#');

    if (isInternal) {
      return (
        <Link
          href={href}
          className={baseClassName}
          style={getVariantStyles()}
          {...linkProps}
        >
          {content}
        </Link>
      );
    }

    return (
      <a
        href={href}
        className={baseClassName}
        style={getVariantStyles()}
        {...linkProps}
      >
        {content}
      </a>
    );
  }

  const buttonProps = props as React.ButtonHTMLAttributes<HTMLButtonElement>;
  return (
    <button
      className={baseClassName}
      style={getVariantStyles()}
      {...buttonProps}
    >
      {content}
    </button>
  );
}

