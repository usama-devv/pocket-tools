import { BrowserRouter, Routes, Route } from "react-router-dom";
import { useEffect, Suspense, lazy } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Analytics } from '@vercel/analytics/react';

import "./App.css";

/* Layout */
import Header from "./landing-page-components/header/Header";
import Footer from "./landing-page-components/footer/Footer";
import ScrollToTop from "./components/ScrollToTop.jsx";
import ErrorBoundary from "./components/ErrorBoundary.jsx";
import ShareModal from "./components/modal/ShareModal.jsx";

/* Context */
import ApiContextProvider from "./contexts/api-context-provider.jsx";

/* Redux */
import { setFavourites } from "./redux/slices/favouritesSlice.js";

// Global error handling
window.addEventListener('error', function (event) {
  console.error('Global error caught:', event.error);
  console.error('Error stack:', event.error.stack);
});





/* Home */
const Home = lazy(() => import("./CommonRoute/Home"));

/* Static Pages */
const About = lazy(() => import("./pages/about/About.jsx"));
const Contact = lazy(() => import("./pages/contact/Contact"));
const PrivacyAndPolicy = lazy(() =>
  import("./pages/privacy-and-policy/PrivacyAndPolicy")
);
const TermsOfUse = lazy(() => import("./pages/terms-of-use/TermofUse"));
const SignIn = lazy(() => import("./pages/SignIn"));
const Profile = lazy(() => import("./pages/profile/Profile"));
const ToolRequest = lazy(() => import("./pages/tool-request/ToolRequest"));
const Orders = lazy(() => import("./pages/orders/Orders"));

/* Category Pages */
const TextToolsPage = lazy(() =>
  import("./nav-pages/categories/text-tools/TextTools")
);
const ImageToolPage = lazy(() =>
  import("./nav-pages/categories/image-tools/ImageTool")
);
const CssToolPage = lazy(() =>
  import("./nav-pages/categories/css-tools/CssTool")
);
const CodingToolsPage = lazy(() =>
  import("./nav-pages/categories/coding-tools/CodingTools")
);
const ColorToolsPage = lazy(() =>
  import("./nav-pages/categories/color-tools/ColorTools")
);
const SocialMediaToolPage = lazy(() =>
  import("./nav-pages/categories/social-media-tools/SocialMediaTool")
);
const MiscellaneousToolPage = lazy(() =>
  import("./nav-pages/categories/miscellaneous-tools/MiscellaneousTool")
);

/* Product Finder */
const Layout = lazy(() => import("./product-finder-pages/Layout.jsx"));
const ProductFinderPage = lazy(() =>
  import("./product-finder-pages/ProductFinder.jsx")
);
const DetailsPage = lazy(() =>
  import("./product-finder-pages/Detail.jsx")
);

/* Text Tools */
const CaseConverter = lazy(() => import("./pages/text-tools/CaseConverter.jsx"));
const LoremIpsumGenerator = lazy(() =>
  import("./pages/text-tools/LoremIpsumGenerator.jsx")
);
const LetterCounter = lazy(() =>
  import("./pages/text-tools/LetterCounter.jsx")
);
const TextToHandwritingConverter = lazy(() =>
  import("./pages/text-tools/TextToHandwritingConverter.jsx")
);
const BionicReadingConverter = lazy(() =>
  import("./pages/text-tools/BionicReadingConverter.jsx")
);
const MultipleWhitespaceRemover = lazy(() =>
  import("./pages/text-tools/MultipleWhitespaceRemover.jsx")
);
const GoogleFontsPairFinder = lazy(() =>
  import("./pages/text-tools/GoogleFontsPairFinder.jsx")
);

/* Image Tools */
const ImageCropper = lazy(() => import("./pages/image-tools/ImageCropper.jsx"));
const ImageFilters = lazy(() => import("./pages/image-tools/ImageFilters.jsx"));
const ImageResizer = lazy(() => import("./pages/image-tools/ImageResizer.jsx"));
const ImageAverageColorFinder = lazy(() =>
  import("./pages/image-tools/ImageAverageColorFinder.jsx")
);
const ImageColorExtractor = lazy(() =>
  import("./pages/image-tools/ImageColorExtractor.jsx")
);
const ImageColorPicker = lazy(() =>
  import("./pages/image-tools/ImageColorPicker.jsx")
);
const SvgBlobGenerator = lazy(() =>
  import("./pages/image-tools/SvgBlobGenerator.jsx")
);
const SvgPatternGenerator = lazy(() =>
  import("./pages/image-tools/SvgPatternGenerator.jsx")
);
const PhotoCensor = lazy(() =>
  import("./pages/image-tools/PhotoCensor.jsx")
);
const SvgToPngConverter = lazy(() =>
  import("./pages/image-tools/SvgToPngConverter.jsx")
);
const SvgStrokeToFillConverter = lazy(() =>
  import("./pages/image-tools/SvgStrokeToFillConverter.jsx")
);
const ImageToBase64Converter = lazy(() =>
  import("./pages/image-tools/ImageToBase64Converter.jsx")
);
const ImageCaptionGenerator = lazy(() =>
  import("./pages/image-tools/ImageCaptionGenerator.jsx")
);
const ScannedPdfConverter = lazy(() =>
  import("./pages/image-tools/ScannedPdfConverter.jsx")
);

/* CSS Tools */
const CSSLoaderGenerator = lazy(() =>
  import("./pages/css-tools/CSSLoaderGenerator.jsx")
);
const CSSCheckboxGenerator = lazy(() =>
  import("./pages/css-tools/CSSCheckboxGenerator.jsx")
);
const CSSSwitchGenerator = lazy(() =>
  import("./pages/css-tools/CSSSwitchGenerator.jsx")
);
const CSSClipPathGenerator = lazy(() =>
  import("./pages/css-tools/CSSClipPathGenerator.jsx")
);
const CSSBackgroundPatternGenerator = lazy(() =>
  import("./pages/css-tools/CSSBackgroundPatternGenerator.jsx")
);
const CSSCubicBezierGenerator = lazy(() =>
  import("./pages/css-tools/CSSCubicBezierGenerator.jsx")
);
const CSSGlassmorphismGenerator = lazy(() =>
  import("./pages/css-tools/CSSGlassmorphismGenerator.jsx")
);
const CSSTextGlitchEffectGenerator = lazy(() =>
  import("./pages/css-tools/CSSTextGlitchEffectGenerator.jsx")
);
const CSSGradientGenerator = lazy(() =>
  import("./pages/css-tools/CSSGradientGenerator.jsx")
);
const CSSTriangleGenerator = lazy(() =>
  import("./pages/css-tools/CSSTriangleGenerator.jsx")
);
const CSSBoxShadowGenerator = lazy(() =>
  import("./pages/css-tools/CSSBoxShadowGenerator.jsx")
);
const CSSBorderRadiusGenerator = lazy(() =>
  import("./pages/css-tools/CSSBorderRadiusGenerator.jsx")
);

/* Coding Tools */
const CodeToImageConverter = lazy(() =>
  import("./pages/coding-tools/CodeToImageConverter.jsx")
);
const URLSlugGenerator = lazy(() =>
  import("./pages/coding-tools/URLSlugGenerator.jsx")
);
const ReactNativeShadowGenerator = lazy(() =>
  import("./pages/coding-tools/ReactNativeShadowGenerator.jsx")
);
const Base64EncoderDecoder = lazy(() =>
  import("./pages/coding-tools/Base64EncoderDecoder.jsx")
);
const HTMLEncoderDecoder = lazy(() =>
  import("./pages/coding-tools/HTMLEncoderDecoder.jsx")
);
const URLEncoderDecoder = lazy(() =>
  import("./pages/coding-tools/URLEncoderDecoder.jsx")
);
const HTMLMinifier = lazy(() =>
  import("./pages/coding-tools/HTMLMinifier.jsx")
);
const CSSMinifier = lazy(() =>
  import("./pages/coding-tools/CSSMinifier.jsx")
);
const JavascriptMinifier = lazy(() =>
  import("./pages/coding-tools/JavascriptMinifier.jsx")
);
const HTMLFormatter = lazy(() =>
  import("./pages/coding-tools/HTMLFormatter.jsx")
);
const CSSFormatter = lazy(() =>
  import("./pages/coding-tools/CSSFormatter.jsx")
);
const JavascriptFormatter = lazy(() =>
  import("./pages/coding-tools/JavascriptFormatter.jsx")
);
const MD5EncryptDecrypt = lazy(() =>
  import("./pages/coding-tools/MD5EncryptDecrypt.jsx")
);
const SHA1EncryptDecrypt = lazy(() =>
  import("./pages/coding-tools/SHA1EncryptDecrypt.jsx")
);
const SHA224EncryptDecrypt = lazy(() =>
  import("./pages/coding-tools/SHA224EncryptDecrypt.jsx")
);
const SHA256EncryptDecrypt = lazy(() =>
  import("./pages/coding-tools/SHA256EncryptDecrypt.jsx")
);
const SHA384EncryptDecrypt = lazy(() =>
  import("./pages/coding-tools/SHA384EncryptDecrypt.jsx")
);
const SHA512EncryptDecrypt = lazy(() =>
  import("./pages/coding-tools/SHA512EncryptDecrypt.jsx")
);
const JWTEncoderDecoder = lazy(() =>
  import("./pages/coding-tools/JWTEncoderDecoder.jsx")
);
const JSONTreeViewer = lazy(() =>
  import("./pages/coding-tools/JSONTreeViewer.jsx")
);


/* Coding Tools */
const AIColorPaletteGenerator = lazy(() =>
  import("./pages/color-tools/AIColorPaletteGenerator.jsx")
);
const HexToRgbaConverter = lazy(() =>
  import("./pages/color-tools/HexToRgbaConverter.jsx")
);
const RgbaToHexConverter = lazy(() =>
  import("./pages/color-tools/RgbaToHexConverter.jsx")
);
const ColorShadesGenerator = lazy(() =>
  import("./pages/color-tools/ColorShadesGenerator.jsx")
);
const ColorMixer = lazy(() =>
  import("./pages/color-tools/ColorMixer.jsx")
);


/* Social Media Tools */
const InstagramFilters = lazy(() =>
  import("./pages/social-media-tools/InstagramFilters.jsx")
);
const InstagramPostGenerator = lazy(() =>
  import("./pages/social-media-tools/InstagramPostGenerator.jsx")
);
const InstagramPhotoDownloader = lazy(() =>
  import("./pages/social-media-tools/InstagramPhotoDownloader.jsx")
);
const TweetGenerator = lazy(() =>
  import("./pages/social-media-tools/TweetGenerator.jsx")
);
const TweetToImageConverter = lazy(() =>
  import("./pages/social-media-tools/TweetToImageConverter.jsx")
);
const TwitterAdRevenueGenerator = lazy(() =>
  import("./pages/social-media-tools/TwitterAdRevenueGenerator.jsx")
);
const YoutubeThumbnailGrabber = lazy(() =>
  import("./pages/social-media-tools/YoutubeThumbnailGrabber.jsx")
);
const VimeoThumbnailGrabber = lazy(() =>
  import("./pages/social-media-tools/VimeoThumbnailGrabber.jsx")
);
const OpenGraphMetaGenerator = lazy(() =>
  import("./pages/social-media-tools/OpenGraphMetaGenerator.jsx")
);


/* Miscellaneous Tools */
const StrongRandomPasswordGenerator = lazy(() =>
  import("./pages/miscellaneous-tools/StrongRandomPasswordGenerator.jsx")
);
const QrCodeGenerator = lazy(() =>
  import("./pages/miscellaneous-tools/QrCodeGenerator.jsx")
);
const FakeIbanGenerator = lazy(() =>
  import("./pages/miscellaneous-tools/FakeIBANGenerator.jsx")
);
const BarCodeGenerator = lazy(() =>
  import("./pages/miscellaneous-tools/BarCodeGenerator.jsx")
);
const ListRandomizer = lazy(() =>
  import("./pages/miscellaneous-tools/ListRandomizer.jsx")
);

/* Product Finder Pages */
const GetSubmit = lazy(() =>
  import("./product-finder-pages/GetSubmit.jsx")
);
const Submit = lazy(() =>
  import("./product-finder-pages/Submit.jsx")
);
const Checkout = lazy(() =>
  import("./product-finder-pages/Checkout.jsx")
);

import { onAuthStateChanged } from "firebase/auth";
import { auth } from "./firebase";
import { setUser, clearUser } from "./redux/slices/authSlice";
import ToolLayout from "./pages/ToolLayout.jsx";
import { LoadingSpinner } from "./components/LoadingSpinner.jsx";
import { Toaster } from "react-hot-toast";

function App() {
  const dispatch = useDispatch();

  useEffect(() => {
    const unsub = onAuthStateChanged(auth, (firebaseUser) => {
      if (firebaseUser) {
        const userData = {
          uid: firebaseUser.uid,
          email: firebaseUser.email,
          displayName: firebaseUser.displayName,
          photoURL: firebaseUser.photoURL,
        };
        dispatch(setUser(userData));
      } else {
        dispatch(clearUser());
      }
    });

    return () => unsub();
  }, [dispatch]);
  const favourites = useSelector((state) => state.favourites.items);

  useEffect(() => {
    const stored = JSON.parse(localStorage.getItem("favourites"));
    if (stored) dispatch(setFavourites(stored));
  }, [dispatch]);

  useEffect(() => {
    localStorage.setItem("favourites", JSON.stringify(favourites));
  }, [favourites]);

  return (
    <ErrorBoundary>
      <ApiContextProvider>
        <BrowserRouter>
          <Analytics />
          <Toaster />
          <ShareModal />
          <ScrollToTop />
          <Header />

          <main className="main-content">
            <Suspense fallback={<LoadingSpinner />}>
              <Routes>
                <Route path="/" element={<Home />} />
                <Route path="/categories" element={<Home />} />

                {/* categories */}
                <Route path="/categories/text-tools" element={<TextToolsPage />} />
                <Route path="/categories/image-tools" element={<ImageToolPage />} />
                <Route path="/categories/css-tools" element={<CssToolPage />} />
                <Route path="/categories/coding-tools" element={<CodingToolsPage />} />
                <Route path="/categories/color-tools" element={<ColorToolsPage />} />
                <Route
                  path="/categories/social-media-tools"
                  element={<SocialMediaToolPage />}
                />
                <Route
                  path="/categories/miscellaneous-tools"
                  element={<MiscellaneousToolPage />}
                />

                {/* Static */}
                <Route path="/about" element={<About />} />
                <Route path="/contact" element={<Contact />} />
                <Route path="/privacy-and-policy" element={<PrivacyAndPolicy />} />
                <Route path="/terms-of-use" element={<TermsOfUse />} />
                <Route path="/tool-request" element={<ToolRequest />} />
                <Route path="/orders" element={<Orders />} />
                <Route path="/signin" element={<SignIn />} />
                <Route path="/profile" element={<Profile />} />

                {/* Text Tools */}
                <Route path="/tools" element={<ToolLayout />}>

                  <Route path="text-tools/case-converter" element={<CaseConverter />} />
                  <Route path="text-tools/lorem-ipsum-generator" element={<LoremIpsumGenerator />} />
                  <Route path="text-tools/letter-counter" element={<LetterCounter />} />
                  <Route
                    path="text-tools/text-to-handwriting-converter"
                    element={<TextToHandwritingConverter />}
                  />
                  <Route
                    path="text-tools/bionic-reading-converter"
                    element={<BionicReadingConverter />}
                  />
                  <Route
                    path="text-tools/multiple-whitespace-remover"
                    element={<MultipleWhitespaceRemover />}
                  />
                  <Route
                    path="text-tools/google-fonts-pair-finder"
                    element={<GoogleFontsPairFinder />}
                  />

                  {/* Image Tools */}
                  <Route path="image-tools/image-cropper" element={<ImageCropper />} />
                  <Route path="image-tools/image-filters" element={<ImageFilters />} />
                  <Route path="image-tools/image-resizer" element={<ImageResizer />} />
                  <Route
                    path="image-tools/image-average-color-finder"
                    element={<ImageAverageColorFinder />}
                  />
                  <Route
                    path="image-tools/image-color-extractor"
                    element={<ImageColorExtractor />}
                  />
                  <Route
                    path="image-tools/image-color-picker"
                    element={<ImageColorPicker />}
                  />
                  <Route path="image-tools/svg-blob-generator" element={<SvgBlobGenerator />} />
                  <Route
                    path="image-tools/svg-pattern-generator"
                    element={<SvgPatternGenerator />}
                  />
                  <Route path="image-tools/photo-censor" element={<PhotoCensor />} />
                  <Route
                    path="image-tools/svg-to-png-converter"
                    element={<SvgToPngConverter />}
                  />
                  <Route
                    path="image-tools/svg-stroke-to-fill-converter"
                    element={<SvgStrokeToFillConverter />}
                  />
                  <Route
                    path="image-tools/image-to-base64-converter"
                    element={<ImageToBase64Converter />}
                  />
                  <Route
                    path="image-tools/image-caption-generator"
                    element={<ImageCaptionGenerator />}
                  />
                  <Route
                    path="image-tools/scanned-pdf-converter"
                    element={<ScannedPdfConverter />}
                  />

                  {/* CSS Tools */}
                  <Route
                    path="css-tools/css-loader-generator"
                    element={<CSSLoaderGenerator />}
                  />
                  <Route
                    path="css-tools/css-checkbox-generator"
                    element={<CSSCheckboxGenerator />}
                  />
                  <Route
                    path="css-tools/css-switch-generator"
                    element={<CSSSwitchGenerator />}
                  />
                  <Route
                    path="css-tools/css-clip-path-generator"
                    element={<CSSClipPathGenerator />}
                  />
                  <Route
                    path="css-tools/css-background-pattern-generator"
                    element={<CSSBackgroundPatternGenerator />}
                  />
                  <Route
                    path="css-tools/css-cubic-bezier-generator"
                    element={<CSSCubicBezierGenerator />}
                  />
                  <Route
                    path="css-tools/css-glassmorphism-generator"
                    element={<CSSGlassmorphismGenerator />}
                  />
                  <Route
                    path="css-tools/css-text-glitch-effect-generator"
                    element={<CSSTextGlitchEffectGenerator />}
                  />
                  <Route
                    path="css-tools/css-gradient-generator"
                    element={<CSSGradientGenerator />}
                  />
                  <Route
                    path="css-tools/css-triangle-generator"
                    element={<CSSTriangleGenerator />}
                  />
                  <Route
                    path="css-tools/css-box-shadow-generator"
                    element={<CSSBoxShadowGenerator />}
                  />
                  <Route
                    path="css-tools/css-border-radius-generator"
                    element={<CSSBorderRadiusGenerator />}
                  />

                  {/* Coding Tools */}
                  <Route
                    path="coding-tools/code-to-image-converter"
                    element={<CodeToImageConverter />}
                  />
                  <Route
                    path="coding-tools/url-slug-generator"
                    element={<URLSlugGenerator />}
                  />
                  <Route
                    path="coding-tools/react-native-shadow-generator"
                    element={<ReactNativeShadowGenerator />}
                  />
                  <Route
                    path="coding-tools/base64-encoder-decoder"
                    element={<Base64EncoderDecoder />}
                  />
                  <Route
                    path="coding-tools/html-encoder-decoder"
                    element={<HTMLEncoderDecoder />}
                  />
                  <Route
                    path="coding-tools/url-encoder-decoder"
                    element={<URLEncoderDecoder />}
                  />
                  <Route
                    path="coding-tools/html-minifier"
                    element={<HTMLMinifier />}
                  />
                  <Route
                    path="coding-tools/css-minifier"
                    element={<CSSMinifier />}
                  />
                  <Route
                    path="coding-tools/javascript-minifier"
                    element={<JavascriptMinifier />}
                  />
                  <Route
                    path="coding-tools/html-formatter"
                    element={<HTMLFormatter />}
                  />
                  <Route
                    path="coding-tools/css-formatter"
                    element={<CSSFormatter />}
                  />
                  <Route
                    path="coding-tools/javascript-formatter"
                    element={<JavascriptFormatter />}
                  />
                  <Route
                    path="coding-tools/md5-encrypt-decrypt"
                    element={<MD5EncryptDecrypt />}
                  />
                  <Route
                    path="coding-tools/sha1-encrypt-decrypt"
                    element={<SHA1EncryptDecrypt />}
                  />
                  <Route
                    path="coding-tools/sha224-encrypt-decrypt"
                    element={<SHA224EncryptDecrypt />}
                  />
                  <Route
                    path="coding-tools/sha256-encrypt-decrypt"
                    element={<SHA256EncryptDecrypt />}
                  />
                  <Route
                    path="coding-tools/sha384-encrypt-decrypt"
                    element={<SHA384EncryptDecrypt />}
                  />
                  <Route
                    path="coding-tools/sha512-encrypt-decrypt"
                    element={<SHA512EncryptDecrypt />}
                  />
                  <Route
                    path="coding-tools/jwt-encoder-decoder"
                    element={<JWTEncoderDecoder />}
                  />
                  <Route
                    path="coding-tools/json-tree-viewer"
                    element={<JSONTreeViewer />}
                  />

                  {/* Color Tools */}
                  <Route
                    path="color-tools/ai-color-palette-generator"
                    element={<AIColorPaletteGenerator />}
                  />
                  <Route
                    path="color-tools/hex-to-rgba-converter"
                    element={<HexToRgbaConverter />}
                  />
                  <Route
                    path="color-tools/rgba-to-hex-converter"
                    element={<RgbaToHexConverter />}
                  />
                  <Route
                    path="color-tools/color-shades-generator"
                    element={<ColorShadesGenerator />}
                  />
                  <Route
                    path="color-tools/color-mixer"
                    element={<ColorMixer />}
                  />

                  {/* Social Media Tools */}
                  <Route
                    path="social-media-tools/instagram-filters"
                    element={<InstagramFilters />}
                  />
                  <Route
                    path="social-media-tools/instagram-post-generator"
                    element={<InstagramPostGenerator />}
                  />
                  <Route
                    path="social-media-tools/instagram-photo-downloader"
                    element={<InstagramPhotoDownloader />}
                  />
                  <Route
                    path="social-media-tools/tweet-generator"
                    element={<TweetGenerator />}
                  />
                  <Route
                    path="social-media-tools/tweet-to-image-converter"
                    element={<TweetToImageConverter />}
                  />
                  <Route
                    path="social-media-tools/twitter-ad-revenue-generator"
                    element={<TwitterAdRevenueGenerator />}
                  />
                  <Route
                    path="social-media-tools/youtube-thumbnail-grabber"
                    element={<YoutubeThumbnailGrabber />}
                  />
                  <Route
                    path="social-media-tools/vimeo-thumbnail-grabber"
                    element={<VimeoThumbnailGrabber />}
                  />
                  <Route
                    path="social-media-tools/open-graph-meta-generator"
                    element={<OpenGraphMetaGenerator />}
                  />


                  {/* Miscellaneous */}
                  <Route
                    path="miscellaneous-tools/strong-random-password-generator"
                    element={<StrongRandomPasswordGenerator />}
                  />
                  <Route
                    path="miscellaneous-tools/qr-code-generator"
                    element={<QrCodeGenerator />}
                  />
                  <Route
                    path="miscellaneous-tools/fake-iban-generator"
                    element={<FakeIbanGenerator />}
                  />
                  <Route
                    path="miscellaneous-tools/barcode-generator"
                    element={<BarCodeGenerator />}
                  />
                  <Route
                    path="miscellaneous-tools/list-randomizer"
                    element={<ListRandomizer />}
                  />

                </Route>
                {/* Product Finder */}
                <Route path="/product-finder/*" element={<Layout />}>
                  <Route index element={<ProductFinderPage />} />
                  <Route path=":slug" element={<DetailsPage />} />

                </Route>
                <Route>
                  <Route path="/product-finder/getSubmit" element={<GetSubmit />} />
                  <Route path="/product-finder/submit" element={<Submit />} />
                  <Route path="/product-finder/checkout" element={<Checkout />} />
                </Route>
              </Routes>
            </Suspense>
          </main>

          <Footer />
        </BrowserRouter>
      </ApiContextProvider>
    </ErrorBoundary>
  );
}
export default App;
