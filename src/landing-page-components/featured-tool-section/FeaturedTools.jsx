import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";

// Import all available images from detail-page-images
import imageResizer from "../../images/detail-page-images/imageResizer.svg";
import imageCropper from "../../images/detail-page-images/imageCropper.svg";
import imageFilters from "../../images/detail-page-images/imageFilters.svg";
import imageAverageColorFinder from "../../images/detail-page-images/imageAverageColorFinder.svg";
import imageColorExtractor from "../../images/detail-page-images/imageColorExtractor.svg";
import imageColorPicker from "../../images/detail-page-images/imageColorPicker.svg";
import svgBlobGenerator from "../../images/detail-page-images/svgBlobGenerator.svg";
import svgPatternGenerator from "../../images/detail-page-images/svgPatternGenerator.svg";
import photoCensor from "../../images/detail-page-images/photoCensor.svg";
import svgToPngConverter from "../../images/detail-page-images/svgToPngConverter.svg";
import svgStrokeToFillConverter from "../../images/detail-page-images/svgStrokeToFillConverter.svg";
import imageToBase64Converter from "../../images/detail-page-images/imageToBase64Converter.svg";
import imageCaptionGenerator from "../../images/detail-page-images/imageCaptionGenerator.svg";
import scannedPdfConverter from "../../images/detail-page-images/scannedPdfConverter.svg";
import caseconverter from "../../images/detail-page-images/caseConverter.svg";
import loremIpsumGenerator from "../../images/detail-page-images/loremIpsumGenerator.svg";
import letterCounter from "../../images/detail-page-images/letterCounter.svg";
import textToHandwritingConverter from "../../images/detail-page-images/textToHandwritingConverter.svg";
import bionicReadingConverter from "../../images/detail-page-images/bionicReadingConverter.svg";
import multipleWhitespaceRemover from "../../images/detail-page-images/multipleWhitespaceRemover.svg";
import googleFontsPairFinder from "../../images/detail-page-images/googleFontsPairFinder.svg";
import cssLoaderGenerator from "../../images/detail-page-images/cssLoaderGenerator.svg";
import cssCheckboxGenerator from "../../images/detail-page-images/cssCheckboxGenerator.svg";
import cssSwitchGenerator from "../../images/detail-page-images/cssSwitchGenerator.svg";
import cssClipPathGenerator from "../../images/detail-page-images/cssClipPathGenerator.svg";
import cssBackgroundPatternGenerator from "../../images/detail-page-images/cssBackgroundPatternGenerator.svg";
import cssCubicBezierGenerator from "../../images/detail-page-images/cssCubicBezierGenerator.svg";
import cssGlassmorphismGenerator from "../../images/detail-page-images/cssGlassmorphismGenerator.svg";
import cssTextGlitchEffectGenerator from "../../images/detail-page-images/cssTextGlitchEffectGenerator.svg";
import cssGradientGenerator from "../../images/detail-page-images/cssGradientGenerator.svg";
import cssTriangleGenerator from "../../images/detail-page-images/cssTriangleGenerator.svg";
import cssBoxShadowGenerator from "../../images/detail-page-images/cssBoxShadowGenerator.svg";
import cssBorderRadiusGenerator from "../../images/detail-page-images/cssBorderRadiusGenerator.svg";
import codeToImageConverter from "../../images/detail-page-images/codeToImageConverter.svg";
import urlSlugGenerator from "../../images/detail-page-images/urlSlugGenerator.svg";
import reactNativeShadowGenerator from "../../images/detail-page-images/reactNativeShadowGenerator.svg";
import base64EncoderDecoder from "../../images/detail-page-images/base64EncoderDecoder.svg";
import htmlEncoderDecoder from "../../images/detail-page-images/htmlEncoderDecoder.svg";
import urlEncoderDecoder from "../../images/detail-page-images/urlEncoderDecoder.svg";
import aiColorPaletteGenerator from "../../images/detail-page-images/aiColorPaletteGenerator.svg";
import barcodeGenerator from "../../images/detail-page-images/barcodeGenerator.svg";
import colorMixer from "../../images/detail-page-images/colorMixer.svg";
import colorShadesGenerator from "../../images/detail-page-images/colorShadesGenerator.svg";
import cssFormatter from "../../images/detail-page-images/cssFormatter.svg";
import fakeIbanGenerator from "../../images/detail-page-images/fakeIbanGenerator.svg";
import hexToRgbaConverter from "../../images/detail-page-images/hexToRgbaConverter.svg";
import htmlFormatter from "../../images/detail-page-images/htmlFormatter.svg";
import htmlMinifier from "../../images/detail-page-images/htmlMinifier.svg";
import instagramFilters from "../../images/detail-page-images/instagramFilters.svg";
import instagramPhotoDownloader from "../../images/detail-page-images/instagramPhotoDownloader.svg";
import instagramPostGenerator from "../../images/detail-page-images/instagramPostGenerator.svg";
import javascriptFormatter from "../../images/detail-page-images/javascriptFormatter.svg";
import javascriptMinifier from "../../images/detail-page-images/javascriptMinifier.svg";
import jsonTreeViewer from "../../images/detail-page-images/jsonTreeViewer.svg";
import jwtEncoderDecoder from "../../images/detail-page-images/jwtEncoderDecoder.svg";
import listRandomizer from "../../images/detail-page-images/listRandomizer.svg";
import md5EncryptDecrypt from "../../images/detail-page-images/md5EncryptDecrypt.svg";
import openGraphMetaGenerator from "../../images/detail-page-images/openGraphMetaGenerator.svg";
import qrCodeGenerator from "../../images/detail-page-images/qrCodeGenerator.svg";
import rgbaToHexConverter from "../../images/detail-page-images/rgbaToHexConverter.svg";
import sha1EncryptDecrypt from "../../images/detail-page-images/sha1EncryptDecrypt.svg";
import sha224EncryptDecrypt from "../../images/detail-page-images/sha224EncryptDecrypt.svg";
import sha256EncryptDecrypt from "../../images/detail-page-images/sha256EncryptDecrypt.svg";
import sha384EncryptDecrypt from "../../images/detail-page-images/sha384EncryptDecrypt.svg";
import sha512EncryptDecrypt from "../../images/detail-page-images/sha512EncryptDecrypt.svg";
import strongRandomPasswordGenerator from "../../images/detail-page-images/strongRandomPasswordGenerator.svg";
import tweetGenerator from "../../images/detail-page-images/tweetGenerator.svg";
import tweetToImageConverter from "../../images/detail-page-images/tweetToImageConverter.svg";
import twitterAdRevenueGenerator from "../../images/detail-page-images/twitterAdRevenueGenerator.svg";
import vimeoThumbnailGrabber from "../../images/detail-page-images/vimeoThumbnailGrabber.svg";
import youtubeThumbnailGrabber from "../../images/detail-page-images/youtubeThumbnailGrabber.svg";

// Create image mapping object
const imageMap = {
  // Image Tools
  "imageresizer.svg": imageResizer,
  "imagecropper.svg": imageCropper,
  "imagefilters.svg": imageFilters,
  "imageaveragefinder.svg": imageAverageColorFinder,
  "imagecolorextractor.svg": imageColorExtractor,
  "imagecolorpicker.svg": imageColorPicker,
  "svgblobgenerator.svg": svgBlobGenerator,
  "svgpatterngenerator.svg": svgPatternGenerator,
  "photocensor.svg": photoCensor,
  "svgtopngconverter.svg": svgToPngConverter,
  "svgstroketofillconverter.svg": svgStrokeToFillConverter,
  "imagetobase64converter.svg": imageToBase64Converter,
  "imagecaptiongenerator.svg": imageCaptionGenerator,
  "scannedpdfconverter.svg": scannedPdfConverter,

  // Text Tools
  "caseconverter.svg": caseconverter,
  "loremgenerator.svg": loremIpsumGenerator,
  "lettercounter.svg": letterCounter,
  "texttohandwriting.svg": textToHandwritingConverter,
  "bionicconverter.svg": bionicReadingConverter,
  "whitespaceemover.svg": multipleWhitespaceRemover,
  "googlefonts.svg": googleFontsPairFinder,

  // CSS Tools
  "cssloadergenerator.svg": cssLoaderGenerator,
  "csscheckboxgenerator.svg": cssCheckboxGenerator,
  "cssswitchgenerator.svg": cssSwitchGenerator,
  "cssclippathgenerator.svg": cssClipPathGenerator,
  "cssbackgroundpatterngenerator.svg": cssBackgroundPatternGenerator,
  "csscubicbeziergenerator.svg": cssCubicBezierGenerator,
  "cssglassmorphismgenerator.svg": cssGlassmorphismGenerator,
  "csstextglitcheffectgenerator.svg": cssTextGlitchEffectGenerator,
  "cssgradientgenerator.svg": cssGradientGenerator,
  "csstrianglegenerator.svg": cssTriangleGenerator,
  "cssboxshadowgenerator.svg": cssBoxShadowGenerator,
  "cssborderradiusgenerator.svg": cssBorderRadiusGenerator,
  "cssformatter.svg": cssFormatter,
  "cssminifier.svg": cssFormatter,

  // Coding Tools
  "codetoimageconverter.svg": codeToImageConverter,
  "urlsluggenerator.svg": urlSlugGenerator,
  "reactnativeshadowgenerator.svg": reactNativeShadowGenerator,
  "base64encoderdecoder.svg": base64EncoderDecoder,
  "htmlencoderdecoder.svg": htmlEncoderDecoder,
  "urlencoderdecoder.svg": urlEncoderDecoder,
  "htmlminifier.svg": htmlMinifier,
  "htmlformatter.svg": htmlFormatter,
  "javascriptformatter.svg": javascriptFormatter,
  "javascriptminifier.svg": javascriptMinifier,
  "md5encryptdecrypt.svg": md5EncryptDecrypt,
  "sha1encryptdecrypt.svg": sha1EncryptDecrypt,
  "sha224encryptdecrypt.svg": sha224EncryptDecrypt,
  "sha256encryptdecrypt.svg": sha256EncryptDecrypt,
  "sha384encryptdecrypt.svg": sha384EncryptDecrypt,
  "sha512encryptdecrypt.svg": sha512EncryptDecrypt,
  "jwtencoderdecoder.svg": jwtEncoderDecoder,
  "jsontreeviewer.svg": jsonTreeViewer,

  // Color Tools
  "aicolorpalettegenerator.svg": aiColorPaletteGenerator,
  "hextorgbaconverter.svg": hexToRgbaConverter,
  "rgbatohexconverter.svg": rgbaToHexConverter,
  "colorshadesgenerator.svg": colorShadesGenerator,
  "colormixer.svg": colorMixer,

  // Social Media Tools
  "instagramfilters.svg": instagramFilters,
  "instagrampostgenerator.svg": instagramPostGenerator,
  "instagramphotodownloader.svg": instagramPhotoDownloader,
  "tweetgenerator.svg": tweetGenerator,
  "tweettoimageconverter.svg": tweetToImageConverter,
  "twitteradrevenue.svg": twitterAdRevenueGenerator,
  "youtubethumbnail.svg": youtubeThumbnailGrabber,
  "vimeothumbnail.svg": vimeoThumbnailGrabber,
  "opengraphmeta.svg": openGraphMetaGenerator,

  // Miscellaneous Tools
  "strongrandompasswordgenerator.svg": strongRandomPasswordGenerator,
  "listrandomizer.svg": listRandomizer,
  "qrcodegenerator.svg": qrCodeGenerator,
  "barcodegenerator.svg": barcodeGenerator,
  "fakeibangenerator.svg": fakeIbanGenerator,
};

const getImageIcon = (imageName) => {
  if (!imageName) return null;
  const normalizedName = imageName.toLowerCase();
  return imageMap[normalizedName] || null;
};

const FeaturedTools = () => {
  const [tools, setTools] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    fetch("/data.json")
      .then((response) => response.json())
      .then((data) => {
        const toolsWithIcons = data.map((tool) => ({
          title: tool.title,
          icon: getImageIcon(tool.image),
          imageName: tool.image,
          category: tool.category,
          slug: tool.slug,
        }));
        setTools(toolsWithIcons);
      })
      .catch((error) => {
        console.error("Error loading tools:", error);
      });
  }, []);

  const handleCardClick = (tool) => {
    navigate(`/tools/${tool.category}/${tool.slug}`);
  };

  const loopItems = tools;

  return (
    <section
      id="featured-tools"
      className="py-8 sm:py-10 md:py-12 px-4 sm:px-6 md:px-8 lg:px-10 bg-[#F3F4F6] overflow-hidden"
    >
      <h2 className="text-xl sm:text-2xl md:text-3xl lg:text-4xl font-bold text-center mb-6 sm:mb-8 md:mb-10 text-[#0B1220] font-['Space_Grotesk',sans-serif]">
        Featured Tools
      </h2>

      {/* Slider */}
      {["animate-slideLeft", "animate-slideRight"].map((animation, i) => (
        <div
          key={i}
          className="relative h-28 sm:h-32 md:h-36 lg:h-40 overflow-hidden mb-6 sm:mb-8
            before:absolute before:left-0 before:top-0 before:z-10 before:h-full before:w-12 sm:before:w-16 md:before:w-24
            before:bg-linear-to-r before:from-[#F3F4F6] before:to-transparent
            after:absolute after:right-0 after:top-0 after:z-10 after:h-full after:w-12 sm:after:w-16 md:after:w-24
            after:bg-linear-to-l after:from-[#F3F4F6] after:to-transparent"
        >
          <div className={`absolute h-full flex ${animation}`}>
            {loopItems.map((t, index) => (
              <div
                key={`${animation}-${t.title}-${index}`}
                onClick={() => handleCardClick(t)}
                className="
                  shrink-0 w-48 sm:w-56 md:w-64 lg:w-72
                  h-16 sm:h-20 md:h-24 lg:h-28
                  mx-1.5 sm:mx-2 md:mx-3
                  bg-[#FFFFFF] rounded-md
                  border border-[#E5E7EB]
                  shadow-[0_2px_10px_rgba(0,0,0,0.06)]
                  p-3 sm:p-4 md:p-5
                  flex items-center justify-start gap-2 sm:gap-3
                  hover:shadow-[0_10px_26px_rgba(0,0,0,0.10)]
                  hover:border-[rgba(59,130,246,0.45)]
                  hover:-translate-y-1
                  hover:cursor-pointer
                  transition-all duration-300
                "
              >
                {t.icon ? (
                  <img
                    src={t.icon}
                    alt={t.title}
                    className="shrink-0 w-10 h-10 sm:w-12 sm:h-12 md:w-14 md:h-14 object-contain"
                  />
                ) : (
                  <span className="shrink-0 text-3xl sm:text-4xl md:text-4xl">
                    🛠️
                  </span>
                )}

                <p className="gap-2 pl-2 text-sm sm:text-base md:text-lg font-medium text-[#0B1220] truncate">
                  {t.title}
                </p>
              </div>
            ))}
          </div>
        </div>
      ))}
    </section>
  );
};

export default FeaturedTools;