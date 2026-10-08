import { ToolItem, ToolCategory } from '../types';

export const TOOL_CATEGORIES = [
  { id: 'image', name: 'Image Tools', icon: 'Image', route: '/tools/image', description: 'Convert, compress, and remove backgrounds from images with logo smoothing.' },
  { id: 'pdf', name: 'PDF & Word Tools', icon: 'FileText', route: '/tools/pdf', description: 'Convert PDF to Word, Word to PDF, merge, split, compress, and convert to JPG/PNG/WEBP.' },
  { id: 'video', name: 'Video Tools', icon: 'Video', route: '/tools/video', description: 'Convert videos, extract audio to MP3, create GIFs, and compress files.' },
  { id: 'generators', name: 'Generators', icon: 'Zap', route: '/tools/generators', description: 'Secure password, UUID, and QR code generators.' },
  { id: 'testdata', name: 'Fake Address Generator', icon: 'MapPin', route: '/tools/testdata', description: 'Generate mock addresses and full profiles across 14+ countries with 1-click copy.' },
  { id: 'developer', name: 'Hash Generator', icon: 'ShieldAlert', route: '/tools/developer', description: 'Generate MD5, SHA-1, SHA-256, and SHA-512 cryptographic checksums.' },
] as const;

export const TOOLS_REGISTRY: ToolItem[] = [
  // ================= IMAGE TOOLS =================
  {
    id: 'remove-background',
    name: 'Remove Background',
    category: 'image',
    categoryName: 'Image Tools',
    description: 'Remove background from any image automatically in seconds with AI accuracy.',
    iconName: 'Sparkles',
    route: '/tools/image/remove-background',
    endpoint: '/api/image/remove-background',
    isPopular: true,
    rating: 4.9,
    votesCount: 245,
    acceptedFormats: ['.jpg', '.jpeg', '.png', '.webp'],
    maxSizeMb: 25,
    tags: ['ai', 'transparent', 'cutout', 'png']
  },
  {
    id: 'remove-logo-bg',
    name: 'Remove Logo BG (Smooth)',
    category: 'image',
    categoryName: 'Image Tools',
    description: 'Smoothly cut out logos, graphics, and signatures with anti-aliased clean edges.',
    iconName: 'Wand2',
    route: '/tools/image/remove-logo-bg',
    endpoint: '/api/image/remove-logo-bg',
    isPopular: true,
    rating: 4.9,
    votesCount: 310,
    acceptedFormats: ['.jpg', '.jpeg', '.png', '.webp', '.bmp'],
    maxSizeMb: 25,
    tags: ['logo', 'smooth', 'vector', 'transparent', 'alpha']
  },
  {
    id: 'image-converter',
    name: 'Multi-Way Image Converter',
    category: 'image',
    categoryName: 'Image Tools',
    description: 'Convert between JPG, PNG, WEBP, ICO (Icon), SVG, and BMP formats in a full circle.',
    iconName: 'RefreshCw',
    route: '/tools/image/converter',
    endpoint: '/api/image/convert',
    isPopular: true,
    rating: 4.8,
    votesCount: 189,
    acceptedFormats: ['.jpg', '.jpeg', '.png', '.webp', '.bmp', '.ico', '.svg'],
    maxSizeMb: 50,
    tags: ['convert', 'format', 'webp', 'jpg', 'png', 'ico', 'svg']
  },
  {
    id: 'image-to-ico',
    name: 'Image to ICO (Favicon)',
    category: 'image',
    categoryName: 'Image Tools',
    description: 'Generate multi-resolution .ico icon files (16x16 up to 256x256) for websites and apps.',
    iconName: 'Smile',
    route: '/tools/image/to-ico',
    endpoint: '/api/image/to-ico',
    isPopular: true,
    rating: 4.9,
    votesCount: 210,
    acceptedFormats: ['.jpg', '.jpeg', '.png', '.webp', '.bmp'],
    maxSizeMb: 25,
    tags: ['ico', 'favicon', 'icon', 'app']
  },
  {
    id: 'image-to-svg',
    name: 'Image to SVG Vector',
    category: 'image',
    categoryName: 'Image Tools',
    description: 'Convert raster JPG and PNG images into scalable SVG vector graphics.',
    iconName: 'Code',
    route: '/tools/image/to-svg',
    endpoint: '/api/image/to-svg',
    isPopular: false,
    rating: 4.7,
    votesCount: 142,
    acceptedFormats: ['.jpg', '.jpeg', '.png', '.webp', '.bmp'],
    maxSizeMb: 25,
    tags: ['svg', 'vector', 'xml', 'scale']
  },
  {
    id: 'image-compressor',
    name: 'Image Compressor',
    category: 'image',
    categoryName: 'Image Tools',
    description: 'Reduce image file size up to 90% without visible quality loss.',
    iconName: 'Minimize2',
    route: '/tools/image/compressor',
    endpoint: '/api/image/compress',
    isPopular: true,
    rating: 4.9,
    votesCount: 312,
    acceptedFormats: ['.jpg', '.jpeg', '.png', '.webp'],
    maxSizeMb: 50,
    tags: ['compress', 'optimize', 'shrink', 'tiny']
  },

  // ================= PDF & WORD TOOLS =================
  {
    id: 'pdf-to-word',
    name: 'PDF to Word (DOCX)',
    category: 'pdf',
    categoryName: 'PDF & Word Tools',
    description: 'Convert PDF documents into editable Microsoft Word (.docx) format with layout preserved.',
    iconName: 'FileEdit',
    route: '/tools/pdf/pdf-to-word',
    endpoint: '/api/pdf/pdf-to-word',
    isPopular: true,
    rating: 4.9,
    votesCount: 430,
    acceptedFormats: ['.pdf'],
    maxSizeMb: 50,
    tags: ['pdf', 'word', 'docx', 'edit', 'convert']
  },
  {
    id: 'word-to-pdf',
    name: 'Word to PDF (DOCX to PDF)',
    category: 'pdf',
    categoryName: 'PDF & Word Tools',
    description: 'Convert Microsoft Word (.docx, .doc) documents into standard printable PDF files.',
    iconName: 'FileType',
    route: '/tools/pdf/word-to-pdf',
    endpoint: '/api/doc/word-to-pdf',
    isPopular: true,
    rating: 4.9,
    votesCount: 390,
    acceptedFormats: ['.docx', '.doc'],
    maxSizeMb: 50,
    tags: ['word', 'pdf', 'docx', 'document', 'convert']
  },
  {
    id: 'merge-pdf',
    name: 'Merge PDF',
    category: 'pdf',
    categoryName: 'PDF & Word Tools',
    description: 'Combine multiple PDF documents into a single organized file in seconds.',
    iconName: 'Layers',
    route: '/tools/pdf/merge',
    endpoint: '/api/pdf/merge',
    isPopular: true,
    rating: 4.9,
    votesCount: 289,
    acceptedFormats: ['.pdf'],
    maxSizeMb: 100,
    tags: ['pdf', 'merge', 'combine', 'join']
  },
  {
    id: 'split-pdf',
    name: 'Split PDF',
    category: 'pdf',
    categoryName: 'PDF & Word Tools',
    description: 'Extract specific pages or page ranges from large PDF documents.',
    iconName: 'Scissors',
    route: '/tools/pdf/split',
    endpoint: '/api/pdf/split',
    isPopular: false,
    rating: 4.7,
    votesCount: 165,
    acceptedFormats: ['.pdf'],
    maxSizeMb: 100,
    tags: ['pdf', 'split', 'extract', 'pages']
  },
  {
    id: 'compress-pdf',
    name: 'Compress PDF',
    category: 'pdf',
    categoryName: 'PDF & Word Tools',
    description: 'Reduce PDF file size for easy emailing and fast uploads while keeping high clarity.',
    iconName: 'FileArchive',
    route: '/tools/pdf/compress',
    endpoint: '/api/pdf/compress',
    isPopular: true,
    rating: 4.8,
    votesCount: 220,
    acceptedFormats: ['.pdf'],
    maxSizeMb: 100,
    tags: ['pdf', 'compress', 'optimize', 'shrink']
  },
  {
    id: 'pdf-to-jpg',
    name: 'PDF to JPG',
    category: 'pdf',
    categoryName: 'PDF & Word Tools',
    description: 'Convert PDF document pages into high-resolution JPG images.',
    iconName: 'FileImage',
    route: '/tools/pdf/pdf-to-jpg',
    endpoint: '/api/pdf/pdf-to-jpg',
    isPopular: true,
    rating: 4.8,
    votesCount: 175,
    acceptedFormats: ['.pdf'],
    maxSizeMb: 50,
    tags: ['pdf', 'jpg', 'image', 'pages']
  },
  {
    id: 'pdf-to-png',
    name: 'PDF to PNG',
    category: 'pdf',
    categoryName: 'PDF & Word Tools',
    description: 'Convert PDF pages into lossless, transparent-supported PNG images.',
    iconName: 'FileImage',
    route: '/tools/pdf/pdf-to-png',
    endpoint: '/api/pdf/pdf-to-png',
    isPopular: false,
    rating: 4.8,
    votesCount: 140,
    acceptedFormats: ['.pdf'],
    maxSizeMb: 50,
    tags: ['pdf', 'png', 'lossless', 'image']
  },
  {
    id: 'pdf-to-webp',
    name: 'PDF to WEBP',
    category: 'pdf',
    categoryName: 'PDF & Word Tools',
    description: 'Convert PDF pages into compact, web-optimized WEBP images.',
    iconName: 'FileImage',
    route: '/tools/pdf/pdf-to-webp',
    endpoint: '/api/pdf/pdf-to-webp',
    isPopular: false,
    rating: 4.7,
    votesCount: 95,
    acceptedFormats: ['.pdf'],
    maxSizeMb: 50,
    tags: ['pdf', 'webp', 'web', 'image']
  },
  {
    id: 'pdf-to-text',
    name: 'PDF to Text Extractor',
    category: 'pdf',
    categoryName: 'PDF & Word Tools',
    description: 'Extract raw text, transcripts, and content from any PDF document with layout parsing.',
    iconName: 'FileText',
    route: '/tools/pdf/pdf-to-text',
    endpoint: '/api/pdf/pdf-to-text',
    isPopular: false,
    rating: 4.8,
    votesCount: 110,
    acceptedFormats: ['.pdf'],
    maxSizeMb: 50,
    tags: ['pdf', 'text', 'extract', 'ocr']
  },
  {
    id: 'image-to-pdf',
    name: 'Image to PDF',
    category: 'pdf',
    categoryName: 'PDF & Word Tools',
    description: 'Convert single or multiple JPG, PNG, and WEBP images into a clean PDF document.',
    iconName: 'FileCheck',
    route: '/tools/pdf/jpg-to-pdf',
    endpoint: '/api/pdf/jpg-to-pdf',
    isPopular: true,
    rating: 4.9,
    votesCount: 340,
    acceptedFormats: ['.jpg', '.jpeg', '.png', '.webp'],
    maxSizeMb: 50,
    tags: ['image', 'pdf', 'jpg-to-pdf', 'document']
  },

  // ================= VIDEO TOOLS =================
  {
    id: 'video-to-mp3',
    name: 'Video to MP3',
    category: 'video',
    categoryName: 'Video Tools',
    description: 'Extract high-quality audio track from any video file in crystal clear MP3 format.',
    iconName: 'Music',
    route: '/tools/video/to-mp3',
    endpoint: '/api/video/to-mp3',
    isPopular: true,
    rating: 4.9,
    votesCount: 450,
    acceptedFormats: ['.mp4', '.mkv', '.mov', '.avi', '.webm'],
    maxSizeMb: 10,
    tags: ['audio', 'mp3', 'extract', 'music']
  },
  {
    id: 'video-to-gif',
    name: 'Video to GIF',
    category: 'video',
    categoryName: 'Video Tools',
    description: 'Turn any video clip into an animated GIF with custom FPS and resolution settings.',
    iconName: 'Film',
    route: '/tools/video/to-gif',
    endpoint: '/api/video/to-gif',
    isPopular: false,
    rating: 4.7,
    votesCount: 115,
    acceptedFormats: ['.mp4', '.mkv', '.mov', '.avi', '.webm'],
    maxSizeMb: 5,
    tags: ['video', 'gif', 'animation', 'clip']
  },

  // ================= GENERATORS =================
  {
    id: 'password-generator',
    name: 'Password Generator',
    category: 'generators',
    categoryName: 'Generators',
    description: 'Generate ultra-secure, cryptographically strong random passwords.',
    iconName: 'Lock',
    route: '/tools/generator/password',
    endpoint: '/api/generator/password',
    isPopular: true,
    rating: 4.9,
    votesCount: 520,
    tags: ['security', 'password', 'random', 'crypto']
  },
  {
    id: 'uuid-generator',
    name: 'UUID Generator',
    category: 'generators',
    categoryName: 'Generators',
    description: 'Generate bulk UUID v4 and v1 identifiers instantly with 1-click copy.',
    iconName: 'Hash',
    route: '/tools/generator/uuid',
    endpoint: '/api/generator/uuid',
    isPopular: false,
    rating: 4.8,
    votesCount: 230,
    tags: ['uuid', 'guid', 'v4', 'id']
  },
  {
    id: 'qr-code-generator',
    name: 'QR Code Generator',
    category: 'generators',
    categoryName: 'Generators',
    description: 'Generate customizable, high-resolution QR codes for links, text, and WiFi with instant PNG download.',
    iconName: 'QrCode',
    route: '/tools/generator/qr-code',
    endpoint: '/api/generator/qr',
    isPopular: true,
    rating: 4.9,
    votesCount: 380,
    tags: ['qr', 'barcode', 'generator', 'scan']
  },

  // ================= FAKE ADDRESS GENERATOR (HOT) =================
  {
    id: 'fake-address-generator',
    name: 'Fake Address Generator (🔥 Hot)',
    category: 'testdata',
    categoryName: 'Fake Address Generator',
    description: 'Generate realistic mock addresses and comprehensive profiles across 14+ global regions with 1-click copy on every field.',
    iconName: 'MapPin',
    route: '/tools/testdata',
    endpoint: '/api/test-data/address',
    isPopular: true,
    rating: 4.95,
    votesCount: 890,
    tags: ['address', 'profile', 'fake', 'mock', 'generator', 'hot']
  },

  // ================= HASH GENERATOR =================
  {
    id: 'hash-generator',
    name: 'Hash Generator',
    category: 'developer',
    categoryName: 'Hash Generator',
    description: 'Generate MD5, SHA-1, SHA-256, and SHA-512 cryptographic checksums instantly with 1-click copy.',
    iconName: 'ShieldAlert',
    route: '/tools/developer',
    endpoint: '/api/dev/hash',
    isPopular: true,
    rating: 4.9,
    votesCount: 410,
    tags: ['hash', 'md5', 'sha256', 'sha512', 'checksum']
  }
];

export const getToolById = (id: string): ToolItem | undefined => {
  return TOOLS_REGISTRY.find(t => t.id === id);
};

export const getToolsByCategory = (category: ToolCategory): ToolItem[] => {
  return TOOLS_REGISTRY.filter(t => t.category === category);
};

export const getPopularTools = (limit?: number): ToolItem[] => {
  const list = TOOLS_REGISTRY.filter(t => t.isPopular);
  return limit ? list.slice(0, limit) : list;
};

export const searchTools = (query: string): ToolItem[] => {
  const q = query.toLowerCase().trim();
  if (!q) return [];
  return TOOLS_REGISTRY.filter(t => 
    t.name.toLowerCase().includes(q) || 
    t.description.toLowerCase().includes(q) || 
    t.tags.some(tag => tag.toLowerCase().includes(q))
  );
};
