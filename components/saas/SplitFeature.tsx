import Image, { StaticImageData } from "next/image";

type Props = {
  image: StaticImageData | string;
  alt: string;
  heading: string;
  highlight: string;
  body: string;
  points: string[];
  reverse?: boolean;
  rotateOnScroll?: boolean;
};

export default function SplitFeature({
  image,
  alt,
  heading,
  highlight,
  body,
  points,
  reverse = false,
  rotateOnScroll = false,
}: Props) {
  return (
    <section>
      <div className="mx-auto grid w-full max-w-[1200px] grid-cols-1 items-center gap-8 px-4 sm:gap-10 sm:px-6 md:grid-cols-2 md:gap-12 lg:gap-24 lg:px-8">
        <div className={`reveal min-w-0 ${reverse ? "md:order-2" : ""}`}>
          <Image
            src={image}
            alt={alt}
            width={620}
            height={560}
            sizes="(min-width: 768px) 50vw, 100vw"
            className="parallax mx-auto h-auto w-full max-w-[520px] md:mx-0 md:w-[90%] md:max-w-none"
            data-rot={rotateOnScroll ? "1" : undefined}
          />
        </div>

        <div className="reveal min-w-0">
          <h2 className="text-balance text-[clamp(1.75rem,5.5vw,3.9rem)] leading-[1.1]">
            {heading} <span className="text-saas-mut">{highlight}</span>
          </h2>
          <p className="mt-4 text-base sm:text-lg md:text-[1.2rem]">{body}</p>
          <ul className="check-list mt-5 text-base sm:text-[1.05rem] md:text-[1.1rem]">
            {points.map((pt) => (
              <li key={pt}>{pt}</li>
            ))}
          </ul>
        </div>
      </div>
    </section>
  );
}