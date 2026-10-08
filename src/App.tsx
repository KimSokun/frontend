import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { MainLayout } from './components/layout/MainLayout';

// Pages
import { Home } from './pages/Home';

// Image Tools
import { ImageTools } from './pages/image/ImageTools';
import { RemoveBackground } from './pages/image/RemoveBackground';
import { RemoveLogoBg } from './pages/image/RemoveLogoBg';
import { ImageConverter } from './pages/image/ImageConverter';
import { ImageCompressor } from './pages/image/ImageCompressor';

// PDF & Document Tools
import { PdfTools } from './pages/pdf/PdfTools';
import { PdfMerge } from './pages/pdf/PdfMerge';
import { PdfToWord } from './pages/pdf/PdfToWord';
import { WordToPdf } from './pages/doc/WordToPdf';
import { PdfToImage } from './pages/pdf/PdfToImage';
import { PdfSplit } from './pages/pdf/PdfSplit';
import { PdfCompress } from './pages/pdf/PdfCompress';
import { PdfToText } from './pages/pdf/PdfToText';
import { JpgToPdf } from './pages/pdf/JpgToPdf';

// Video Tools
import { VideoTools } from './pages/video/VideoTools';
import { VideoToMp3 } from './pages/video/VideoToMp3';
import { VideoToGif } from './pages/video/VideoToGif';

// Text Tools
import { TextTools } from './pages/text/TextTools';
import { WordCounter } from './pages/text/WordCounter';
import { CaseConverter } from './pages/text/CaseConverter';
import { Base64Converter } from './pages/text/Base64Converter';

// Generators
import { GeneratorTools } from './pages/generators/GeneratorTools';
import { PasswordGenerator } from './pages/generators/PasswordGenerator';
import { UUIDGenerator } from './pages/generators/UUIDGenerator';
import { QRGenerator } from './pages/generators/QRGenerator';

// Fake Address Generator (Hot)
import { FakeAddressGenerator } from './pages/testdata/FakeAddressGenerator';

// Developer Tools
import { DeveloperTools } from './pages/developer/DeveloperTools';
import { HashGenerator } from './pages/developer/HashGenerator';
import { JsonFormatter } from './pages/developer/JsonFormatter';
import { TimestampConverter } from './pages/developer/TimestampConverter';

// Admin & Static
import { AdminDashboard } from './pages/admin/AdminDashboard';
import { AboutPage, PrivacyPage, TermsPage, DisclaimerPage, ContactPage } from './pages/static/StaticPages';

export function App() {
  return (
    <BrowserRouter>
      <Routes>
        {/* 🔒 1. Independent Dedicated Admin Portal (Protected by 2FA + Captcha Challenge) */}
        <Route path="/kadmin" element={<AdminDashboard />} />
        <Route path="/admin" element={<Navigate to="/kadmin" replace />} />

        {/* 🌐 2. Public Facing Application Layout */}
        <Route path="/" element={<MainLayout />}>
          <Route index element={<Home />} />
          
          {/* Image Category & Tools */}
          <Route path="tools/image" element={<ImageTools />} />
          <Route path="tools/image/remove-background" element={<RemoveBackground />} />
          <Route path="tools/image/remove-logo-bg" element={<RemoveLogoBg />} />
          <Route path="tools/image/converter" element={<ImageConverter />} />
          <Route path="tools/image/to-ico" element={<ImageConverter />} />
          <Route path="tools/image/to-svg" element={<ImageConverter />} />
          <Route path="tools/image/compressor" element={<ImageCompressor />} />
          <Route path="tools/image/to-pdf" element={<JpgToPdf />} />

          {/* PDF & Word Tools */}
          <Route path="tools/pdf" element={<PdfTools />} />
          <Route path="tools/pdf/pdf-to-word" element={<PdfToWord />} />
          <Route path="tools/pdf/word-to-pdf" element={<WordToPdf />} />
          <Route path="tools/pdf/merge" element={<PdfMerge />} />
          <Route path="tools/pdf/split" element={<PdfSplit />} />
          <Route path="tools/pdf/compress" element={<PdfCompress />} />
          <Route path="tools/pdf/pdf-to-jpg" element={<PdfToImage defaultFormat="jpg" toolId="pdf-to-jpg" />} />
          <Route path="tools/pdf/pdf-to-png" element={<PdfToImage defaultFormat="png" toolId="pdf-to-png" />} />
          <Route path="tools/pdf/pdf-to-webp" element={<PdfToImage defaultFormat="webp" toolId="pdf-to-webp" />} />
          <Route path="tools/pdf/pdf-to-text" element={<PdfToText />} />
          <Route path="tools/pdf/jpg-to-pdf" element={<JpgToPdf />} />

          {/* Video Category & Tools */}
          <Route path="tools/video" element={<VideoTools />} />
          <Route path="tools/video/to-mp3" element={<VideoToMp3 />} />
          <Route path="tools/video/to-gif" element={<VideoToGif />} />
          <Route path="tools/video/extract-frames" element={<VideoToGif />} />
          <Route path="tools/video/converter" element={<Navigate to="/tools/video/to-mp3" replace />} />
          <Route path="tools/video/compressor" element={<Navigate to="/tools/video/to-mp3" replace />} />

          {/* Text Category & Tools */}
          <Route path="tools/text" element={<TextTools />} />
          <Route path="tools/text/word-counter" element={<WordCounter />} />
          <Route path="tools/text/case-converter" element={<CaseConverter />} />
          <Route path="tools/text/base64" element={<Base64Converter />} />

          {/* Generators */}
          <Route path="tools/generators" element={<GeneratorTools />} />
          <Route path="tools/generator/password" element={<PasswordGenerator />} />
          <Route path="tools/generator/uuid" element={<UUIDGenerator />} />
          <Route path="tools/generator/qr-code" element={<QRGenerator />} />
          <Route path="tools/generator/qr" element={<QRGenerator />} />
          <Route path="tools/generator/qrcode" element={<QRGenerator />} />
          <Route path="tools/qr-code" element={<QRGenerator />} />
          <Route path="tools/qr" element={<QRGenerator />} />

          {/* Fake Address Generator (Hot) */}
          <Route path="tools/testdata" element={<FakeAddressGenerator />} />
          <Route path="tools/test-data/address" element={<FakeAddressGenerator />} />
          <Route path="tools/fake-address" element={<FakeAddressGenerator />} />

          {/* Developer Tools */}
          <Route path="tools/developer" element={<DeveloperTools />} />
          <Route path="tools/dev/hash" element={<HashGenerator />} />
          <Route path="tools/hash" element={<HashGenerator />} />
          <Route path="tools/developer/hash" element={<HashGenerator />} />
          <Route path="tools/developer/json-formatter" element={<JsonFormatter />} />
          <Route path="tools/developer/timestamp" element={<TimestampConverter />} />

          {/* Static Legal & Support */}
          <Route path="about" element={<AboutPage />} />
          <Route path="privacy" element={<PrivacyPage />} />
          <Route path="terms" element={<TermsPage />} />
          <Route path="disclaimer" element={<DisclaimerPage />} />
          <Route path="contact" element={<ContactPage />} />

          {/* Fallback */}
          <Route path="*" element={<Navigate to="/" replace />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}

export default App;
