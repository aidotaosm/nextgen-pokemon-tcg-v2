'use client'
import { FunctionComponent, useEffect, useState } from "react";
import Image from "next/image";
import { IF } from "../UtilityComponents/IF";
import {
  DEFAULT_CARD_BACK_RATIO,
  VERCEL_PRIMARY_HOST,
} from "../../constants/constants";
import { Helper } from "../../utils/helper";

export const ImageComponent: FunctionComponent<any> = ({
  src,
  blurDataURL,
  width,
  height,
  className,
  alt,
  highQualitySrc,
  fallBackType,
  fallbackImage,
  shouldFill = false,
  //change here to turn on or off image optimization - true is off
  // lqImageUnOptimize = process.env.IS_VERCEL === "true" ||
  //   Helper.primaryHost === VERCEL_PRIMARY_HOST,
  lqImageUnOptimize = true,
  lqEagerLoading = "lazy",
  hqEagerLoading = "eager",
}) => {
  const [imageSource, setImageSource] = useState(src);
  const [highQualityImageSource, setHighQualityImageSource] =
    useState(highQualitySrc);
  const [highQualityImageLoaded, setHighQualityImageLoaded] = useState(false);
  const [lowQualityImageLoaded, setLowQualityImageLoaded] = useState(false);
  const [imageDimensions, setImageDimensions] = useState({ height, width });
  const [specialEventClass, setSpecialEventClass] = useState("");
  useEffect(() => {
    // this is required because of list view modal carousel hires image download
    setHighQualityImageSource(highQualitySrc);
    setHighQualityImageLoaded(false);
  }, [highQualitySrc]);
  // console.log(lqImageUnOptimize);
  return (
    <>
      <div className={highQualityImageLoaded ? "out-of-view" : ""}>
        <Image
          style={{ objectFit: "contain" }}
          unoptimized={lqImageUnOptimize}
          className={(className || "") + specialEventClass}
          src={imageSource}
          alt={alt || ""}
          width={imageDimensions.width}
          height={imageDimensions.height}
          loading={lqEagerLoading}
          //sizes
          fill={shouldFill}
          blurDataURL={blurDataURL}
          placeholder={fallBackType === "symbol" ? undefined : "blur"}
          onError={(e: any) => {
            if (fallBackType === "logo" || fallBackType === "symbol") {
              setImageSource(fallbackImage);
            } else {
              setImageSource("/images/Cardback.webp");
            }
          }}
          onLoad={(e) => {
            if (fallBackType === "logo" || fallBackType === "symbol") {
              // console.log(
              //   e.currentTarget.naturalHeight / e.currentTarget.naturalWidth,
              //   DEFAULT_CARD_BACK_RATIO,
              //   "lq"
              // );
              if (
                e.currentTarget.naturalHeight / e.currentTarget.naturalWidth ==
                DEFAULT_CARD_BACK_RATIO
              ) {
                // console.log("default logo gotten in low quality view");
                setImageSource(fallbackImage);
                if (fallBackType === "symbol") {
                  setSpecialEventClass(" rounded");
                }
              }
            }
            if (!shouldFill) {
              setImageDimensions({
                width: e.currentTarget.naturalWidth,
                height: e.currentTarget.naturalHeight,
              });
            }
            setLowQualityImageLoaded(true);
          }}
        />
      </div>
      <IF condition={highQualityImageSource && lowQualityImageLoaded}>
        <div className={highQualityImageLoaded ? "" : "out-of-view"}>
          <Image
            unoptimized={true}
            className={className || ""}
            src={highQualityImageSource}
            alt={alt || ""}
            width={imageDimensions.width}
            height={imageDimensions.height}
            loading={hqEagerLoading}
            blurDataURL={blurDataURL}
            placeholder="blur"
            onError={() => {
              //console.error("hires error occurred");
              if (lowQualityImageLoaded) {
                setHighQualityImageSource(imageSource);
              } else {
                setHighQualityImageSource("/images/Cardback.webp");
              }
            }}
            onLoad={(e) => {
              // console.log(
              //   e.currentTarget.naturalHeight / e.currentTarget.naturalWidth,
              //   DEFAULT_CARD_BACK_RATIO,
              //   "hq"
              // );
              if (
                e.currentTarget.naturalHeight / e.currentTarget.naturalWidth ==
                DEFAULT_CARD_BACK_RATIO
              ) {
                // console.log(
                //   "low quality image rendered in hires since high quality image cannot be loaded"
                //    );
                //setHighQualityImageSource(imageSource);
                return;
              }

              setImageDimensions({
                width: e.currentTarget.naturalWidth,
                height: e.currentTarget.naturalHeight,
              });
              setHighQualityImageLoaded(true);
            }}
          />
        </div>
      </IF>
    </>
  );
};
