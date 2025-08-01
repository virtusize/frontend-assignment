import { ReactNode } from "react";
import { clsx } from "clsx";

type BackgroundImageProps = {
  src: string;
  alt?: string;
  className?: string;
  overlayClassName?: string;
  children?: ReactNode;
};

const BackgroundImage = ({
  src,
  alt = "",
  className,
  overlayClassName = "relative overflow-hidden",
  children,
}: BackgroundImageProps) => {
  return (
    <div className={overlayClassName}>
      <div
        className={clsx(
          "absolute inset-0 bg-cover bg-center blur-sm brightness-50",
          className
        )}
        style={{ backgroundImage: `url(${src})` }}
        role="img"
        aria-label={alt}
      />

      {children}
    </div>
  );
};

export default BackgroundImage;
