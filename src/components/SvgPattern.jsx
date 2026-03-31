import { useState, useEffect, useRef } from 'react';
import { Download, Maximize2, Shuffle, Copy, Check, ChevronDown, Settings, Palette, Grid, RotateCw, Move, Eye, Image } from 'lucide-react';
import toast from 'react-hot-toast';
import CustomSelect from '../components/CustomSelect';

const SvgPattern = () => {
    // Pattern types with their SVG implementations
    const patternTypes = [
        { id: 'circle', name: 'Circle' },
        { id: 'square', name: 'Square' },
        { id: 'triangle', name: 'Triangle' },
        { id: 'hexagon', name: 'Hexagon' },
        { id: 'star', name: 'Star' },
        { id: 'diamond', name: 'Diamond' },
        { id: 'plus', name: 'Plus' },
        { id: 'cross', name: 'Cross' },
        { id: 'dots', name: 'Dots' },
        { id: 'waves', name: 'Waves' },
        { id: 'zigzag', name: 'Zigzag' },
        { id: 'stripes', name: 'Stripes' },
        { id: 'checkerboard', name: 'Checkerboard' },
        { id: 'grid', name: 'Grid' },
        { id: 'hearts', name: 'Hearts' },
        { id: 'arrows', name: 'Arrows' },
        { id: 'chevron', name: 'Chevron' },
        { id: 'octagon', name: 'Octagon' },
        { id: 'pentagon', name: 'Pentagon' },
        { id: 'rings', name: 'Rings' },
        { id: 'flower', name: 'Flower' },
        { id: 'leaf', name: 'Leaf' },
        { id: 'moon', name: 'Moon' },
        { id: 'sun', name: 'Sun' },
        { id: 'cloud', name: 'Cloud' },
        { id: 'lightning', name: 'Lightning' },
        { id: 'snowflake', name: 'Snowflake' },
        { id: 'burst', name: 'Burst' },
        { id: 'spiral', name: 'Spiral' },
        { id: 'curve', name: 'Curve' },
        { id: 'wave2', name: 'Wave 2' },
        { id: 'ellipse', name: 'Ellipse' },
        { id: 'rectangle', name: 'Rectangle' },
        { id: 'roundedSquare', name: 'Rounded Square' },
        { id: 'pill', name: 'Pill' },
        { id: 'teardrop', name: 'Teardrop' },
        { id: 'droplet', name: 'Droplet' },
        { id: 'blob', name: 'Blob' },
        { id: 'organic', name: 'Organic' },
        { id: 'splatter', name: 'Splatter' },
        { id: 'confetti', name: 'Confetti' },
        { id: 'sparkle', name: 'Sparkle' },
        { id: 'asterisk', name: 'Asterisk' },
        { id: 'clover', name: 'Clover' },
        { id: 'infinity', name: 'Infinity' },
        { id: 'peace', name: 'Peace' },
        { id: 'yin-yang', name: 'Yin Yang' },
        { id: 'gear', name: 'Gear' },
        { id: 'polygon6', name: 'Polygon 6' },
        { id: 'polygon7', name: 'Polygon 7' },
        { id: 'polygon8', name: 'Polygon 8' },
        { id: 'mesh', name: 'Mesh' },
        { id: 'lattice', name: 'Lattice' },
        { id: 'weave', name: 'Weave' },
        { id: 'brick', name: 'Brick' }
    ];

    const exportTemplates = [
        { id: 'custom', name: 'Custom', width: 1200, height: 630 },
        { id: 'facebook-cover', name: 'Facebook Cover', width: 820, height: 312 },
        { id: 'facebook-post', name: 'Facebook Post', width: 1200, height: 630 },
        { id: 'twitter-header', name: 'Twitter Header', width: 1500, height: 500 },
        { id: 'twitter-post', name: 'Twitter Post', width: 1200, height: 675 },
        { id: 'instagram-post', name: 'Instagram Post', width: 1080, height: 1080 },
        { id: 'instagram-story', name: 'Instagram Story', width: 1080, height: 1920 },
        { id: 'linkedin-cover', name: 'LinkedIn Cover', width: 1584, height: 396 },
        { id: 'linkedin-post', name: 'LinkedIn Post', width: 1200, height: 627 },
        { id: 'youtube-thumbnail', name: 'YouTube Thumbnail', width: 1280, height: 720 },
        { id: 'youtube-banner', name: 'YouTube Banner', width: 2560, height: 1440 },
        { id: 'og-image', name: 'OG Image', width: 1200, height: 630 }
    ];

    // Options for CustomSelect
    const patternOptions = patternTypes.map(pattern => ({
        value: pattern.id,
        name: pattern.name
    }));

    const exportOptions = exportTemplates.map(template => ({
        value: template.id,
        name: template.name
    }));

    const [patternType, setPatternType] = useState('circle');
    const [patternColor, setPatternColor] = useState('#3B82F6');
    const [backgroundColor, setBackgroundColor] = useState('#F9FAFB');
    const [size, setSize] = useState(32);
    const [spacing, setSpacing] = useState(30);
    const [rotation, setRotation] = useState(0);
    const [skew, setSkew] = useState(0);
    const [opacity, setOpacity] = useState(1);
    const [exportTemplate, setExportTemplate] = useState('og-image');
    const [customWidth, setCustomWidth] = useState(1200);
    const [customHeight, setCustomHeight] = useState(630);
    const [fullScreen, setFullScreen] = useState(false);
    const [copied, setCopied] = useState(false);
    const [exportDropdownOpen, setExportDropdownOpen] = useState(false);
    const dropdownRef = useRef(null);

    const currentTemplate = exportTemplates.find(t => t.id === exportTemplate);
    const exportWidth = exportTemplate === 'custom' ? customWidth : currentTemplate?.width || 1200;
    const exportHeight = exportTemplate === 'custom' ? customHeight : currentTemplate?.height || 630;

    // Close dropdown when clicking outside
    useEffect(() => {
        const handleClickOutside = (event) => {
            if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
                setExportDropdownOpen(false);
            }
        };

        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);

    // Generate random color
    const getRandomColor = () => {
        return '#' + Math.floor(Math.random() * 16777215).toString(16).padStart(6, '0');
    };

    const shuffleColors = () => {
        setPatternColor(getRandomColor());
        setBackgroundColor(getRandomColor());
        toast.success('Colors shuffled!', {
            duration: 2000,
            icon: '🎨',
            style: {
                background: '#F9FAFB',
                color: '#0B1220',
                border: '1px solid #E5E7EB',
            },
        });
    };

    // Reset to default
    const resetSettings = () => {
        setPatternType('circle');
        setPatternColor('#3B82F6');
        setBackgroundColor('#F9FAFB');
        setSize(32);
        setSpacing(30);
        setRotation(0);
        setSkew(0);
        setOpacity(1);
        toast.success('Settings reset to default!', {
            duration: 2000,
            icon: '🔄',
            style: {
                background: '#F9FAFB',
                color: '#0B1220',
                border: '1px solid #E5E7EB',
            },
        });
    };

    // Generate pattern shape based on type
    const generateShape = (type, size) => {
        const half = size / 2;
        
        switch (type) {
            case 'circle':
                return `<circle cx="${half}" cy="${half}" r="${half * 0.8}" fill="${patternColor}"/>`;
            
            case 'square':
                return `<rect x="${size * 0.1}" y="${size * 0.1}" width="${size * 0.8}" height="${size * 0.8}" fill="${patternColor}"/>`;
            
            case 'triangle':
                return `<polygon points="${half},${size * 0.1} ${size * 0.9},${size * 0.9} ${size * 0.1},${size * 0.9}" fill="${patternColor}"/>`;
            
            case 'hexagon':
                return `<polygon points="${half},${size * 0.1} ${size * 0.85},${size * 0.3} ${size * 0.85},${size * 0.7} ${half},${size * 0.9} ${size * 0.15},${size * 0.7} ${size * 0.15},${size * 0.3}" fill="${patternColor}"/>`;
            
            case 'star':
                return `<polygon points="${half},${size * 0.1} ${size * 0.65},${size * 0.35} ${size * 0.9},${size * 0.4} ${size * 0.7},${size * 0.6} ${size * 0.75},${size * 0.9} ${half},${size * 0.75} ${size * 0.25},${size * 0.9} ${size * 0.3},${size * 0.6} ${size * 0.1},${size * 0.4} ${size * 0.35},${size * 0.35}" fill="${patternColor}"/>`;
            
            case 'diamond':
                return `<polygon points="${half},${size * 0.1} ${size * 0.9},${half} ${half},${size * 0.9} ${size * 0.1},${half}" fill="${patternColor}"/>`;
            
            case 'plus':
                return `<rect x="${size * 0.4}" y="${size * 0.1}" width="${size * 0.2}" height="${size * 0.8}" fill="${patternColor}"/>
                        <rect x="${size * 0.1}" y="${size * 0.4}" width="${size * 0.8}" height="${size * 0.2}" fill="${patternColor}"/>`;
            
            case 'cross':
                return `<rect x="${size * 0.4}" y="${size * 0.1}" width="${size * 0.2}" height="${size * 0.8}" fill="${patternColor}" transform="rotate(45 ${half} ${half})"/>
                        <rect x="${size * 0.4}" y="${size * 0.1}" width="${size * 0.2}" height="${size * 0.8}" fill="${patternColor}" transform="rotate(-45 ${half} ${half})"/>`;
            
            case 'dots':
                return `<circle cx="${half}" cy="${half}" r="${size * 0.15}" fill="${patternColor}"/>
                        <circle cx="${size * 0.3}" cy="${size * 0.3}" r="${size * 0.1}" fill="${patternColor}"/>
                        <circle cx="${size * 0.7}" cy="${size * 0.7}" r="${size * 0.1}" fill="${patternColor}"/>
                        <circle cx="${size * 0.3}" cy="${size * 0.7}" r="${size * 0.1}" fill="${patternColor}"/>
                        <circle cx="${size * 0.7}" cy="${size * 0.3}" r="${size * 0.1}" fill="${patternColor}"/>`;
            
            case 'waves':
                return `<path d="M${size * 0.1},${half} Q${size * 0.3},${size * 0.3} ${size * 0.5},${half} T${size * 0.9},${half}" stroke="${patternColor}" fill="none" stroke-width="${size * 0.1}" stroke-linecap="round"/>`;
            
            case 'zigzag':
                return `<path d="M${size * 0.1},${size * 0.8} L${size * 0.3},${size * 0.2} L${size * 0.5},${size * 0.8} L${size * 0.7},${size * 0.2} L${size * 0.9},${size * 0.8}" stroke="${patternColor}" fill="none" stroke-width="${size * 0.1}" stroke-linecap="round" stroke-linejoin="round"/>`;
            
            case 'stripes':
                return `<rect x="0" y="0" width="${size * 0.3}" height="${size}" fill="${patternColor}"/>
                        <rect x="${size * 0.35}" y="0" width="${size * 0.3}" height="${size}" fill="${patternColor}"/>
                        <rect x="${size * 0.7}" y="0" width="${size * 0.3}" height="${size}" fill="${patternColor}"/>`;
            
            case 'checkerboard':
                return `<rect x="0" y="0" width="${half}" height="${half}" fill="${patternColor}"/>
                        <rect x="${half}" y="${half}" width="${half}" height="${half}" fill="${patternColor}"/>`;
            
            case 'grid':
                return `<path d="M${size * 0.1},${half} L${size * 0.9},${half} M${half},${size * 0.1} L${half},${size * 0.9}" stroke="${patternColor}" stroke-width="${size * 0.1}" stroke-linecap="round"/>`;
            
            case 'hearts':
                return `<path d="M${half},${size * 0.3} C${half * 0.7},${size * 0.1} ${size * 0.2},${size * 0.2} ${size * 0.3},${size * 0.4} C${size * 0.4},${size * 0.6} ${half},${size * 0.8} ${half},${size * 0.8} C${half},${size * 0.8} ${size * 0.6},${size * 0.6} ${size * 0.7},${size * 0.4} C${size * 0.8},${size * 0.2} ${size * 0.3},${size * 0.1} ${half},${size * 0.3} Z" fill="${patternColor}"/>`;
            
            case 'arrows':
                return `<path d="M${half},${size * 0.1} L${size * 0.9},${half} L${size * 0.6},${half} L${size * 0.6},${size * 0.9} L${size * 0.4},${size * 0.9} L${size * 0.4},${half} L${size * 0.1},${half} Z" fill="${patternColor}"/>`;
            
            case 'chevron':
                return `<path d="M${size * 0.1},${size * 0.3} L${half},${size * 0.7} L${size * 0.9},${size * 0.3}" stroke="${patternColor}" fill="none" stroke-width="${size * 0.15}" stroke-linecap="round" stroke-linejoin="round"/>`;
            
            case 'octagon':
                return `<polygon points="${size * 0.3},${size * 0.1} ${size * 0.7},${size * 0.1} ${size * 0.9},${size * 0.3} ${size * 0.9},${size * 0.7} ${size * 0.7},${size * 0.9} ${size * 0.3},${size * 0.9} ${size * 0.1},${size * 0.7} ${size * 0.1},${size * 0.3}" fill="${patternColor}"/>`;
            
            case 'pentagon':
                return `<polygon points="${half},${size * 0.1} ${size * 0.85},${size * 0.35} ${size * 0.7},${size * 0.8} ${size * 0.3},${size * 0.8} ${size * 0.15},${size * 0.35}" fill="${patternColor}"/>`;
            
            case 'rings':
                return `<circle cx="${half}" cy="${half}" r="${size * 0.35}" stroke="${patternColor}" fill="none" stroke-width="${size * 0.1}"/>
                        <circle cx="${half}" cy="${half}" r="${size * 0.2}" stroke="${patternColor}" fill="none" stroke-width="${size * 0.1}"/>`;
            
            case 'flower':
                return `<circle cx="${half}" cy="${half}" r="${size * 0.2}" fill="${patternColor}"/>
                        <circle cx="${half}" cy="${size * 0.2}" r="${size * 0.15}" fill="${patternColor}"/>
                        <circle cx="${half}" cy="${size * 0.8}" r="${size * 0.15}" fill="${patternColor}"/>
                        <circle cx="${size * 0.2}" cy="${half}" r="${size * 0.15}" fill="${patternColor}"/>
                        <circle cx="${size * 0.8}" cy="${half}" r="${size * 0.15}" fill="${patternColor}"/>`;
            
            case 'leaf':
                return `<path d="M${half},${size * 0.1} Q${size * 0.8},${half} ${half},${size * 0.9} Q${size * 0.2},${half} ${half},${size * 0.1}" fill="${patternColor}"/>`;
            
            case 'moon':
                return `<path d="M${size * 0.7},${half} A${size * 0.3},${size * 0.3} 0 1,0 ${size * 0.4},${size * 0.3} A${size * 0.2},${size * 0.2} 0 0,1 ${size * 0.7},${half}" fill="${patternColor}"/>`;
            
            case 'sun':
                return `<circle cx="${half}" cy="${half}" r="${size * 0.25}" fill="${patternColor}"/>
                        <circle cx="${half}" cy="${size * 0.1}" r="${size * 0.08}" fill="${patternColor}"/>
                        <circle cx="${half}" cy="${size * 0.9}" r="${size * 0.08}" fill="${patternColor}"/>
                        <circle cx="${size * 0.1}" cy="${half}" r="${size * 0.08}" fill="${patternColor}"/>
                        <circle cx="${size * 0.9}" cy="${half}" r="${size * 0.08}" fill="${patternColor}"/>
                        <circle cx="${size * 0.2}" cy="${size * 0.2}" r="${size * 0.08}" fill="${patternColor}"/>
                        <circle cx="${size * 0.8}" cy="${size * 0.8}" r="${size * 0.08}" fill="${patternColor}"/>
                        <circle cx="${size * 0.2}" cy="${size * 0.8}" r="${size * 0.08}" fill="${patternColor}"/>
                        <circle cx="${size * 0.8}" cy="${size * 0.2}" r="${size * 0.08}" fill="${patternColor}"/>`;
            
            case 'cloud':
                return `<ellipse cx="${size * 0.3}" cy="${half}" rx="${size * 0.2}" ry="${size * 0.15}" fill="${patternColor}"/>
                        <ellipse cx="${size * 0.5}" cy="${half * 0.8}" rx="${size * 0.25}" ry="${size * 0.2}" fill="${patternColor}"/>
                        <ellipse cx="${size * 0.7}" cy="${half}" rx="${size * 0.2}" ry="${size * 0.15}" fill="${patternColor}"/>`;
            
            case 'lightning':
                return `<path d="M${size * 0.4},${size * 0.2} L${size * 0.6},${size * 0.2} L${size * 0.5},${size * 0.5} L${size * 0.7},${size * 0.5} L${size * 0.3},${size * 0.8} L${size * 0.5},${size * 0.5} L${size * 0.3},${size * 0.5} Z" fill="${patternColor}"/>`;
            
            case 'snowflake':
                return `<path d="M${half},${size * 0.1} L${half},${size * 0.9} M${size * 0.1},${half} L${size * 0.9},${half} M${size * 0.2},${size * 0.2} L${size * 0.8},${size * 0.8} M${size * 0.8},${size * 0.2} L${size * 0.2},${size * 0.8}" stroke="${patternColor}" stroke-width="${size * 0.08}" stroke-linecap="round"/>`;
            
            case 'burst':
                return `<path d="M${half},${size * 0.1} L${half},${size * 0.3} M${size * 0.1},${half} L${size * 0.3},${half} M${size * 0.2},${size * 0.2} L${size * 0.35},${size * 0.35} M${size * 0.8},${size * 0.2} L${size * 0.65},${size * 0.35} M${size * 0.9},${half} L${size * 0.7},${half} M${size * 0.8},${size * 0.8} L${size * 0.65},${size * 0.65} M${half},${size * 0.9} L${half},${size * 0.7} M${size * 0.2},${size * 0.8} L${size * 0.35},${size * 0.65}" stroke="${patternColor}" stroke-width="${size * 0.06}" stroke-linecap="round"/>`;
            
            case 'spiral':
                return `<path d="M${half},${half} Q${size * 0.6},${half} ${size * 0.6},${size * 0.4} Q${size * 0.6},${size * 0.3} ${half},${size * 0.3} Q${size * 0.4},${size * 0.3} ${size * 0.4},${size * 0.4} Q${size * 0.4},${size * 0.5} ${half},${size * 0.5}" stroke="${patternColor}" fill="none" stroke-width="${size * 0.08}" stroke-linecap="round"/>`;
            
            case 'curve':
                return `<path d="M${size * 0.1},${size * 0.8} Q${half},${size * 0.2} ${size * 0.9},${size * 0.8}" stroke="${patternColor}" fill="none" stroke-width="${size * 0.1}" stroke-linecap="round"/>`;
            
            case 'wave2':
                return `<path d="M${size * 0.1},${half} C${size * 0.3},${size * 0.2} ${size * 0.3},${size * 0.8} ${half},${half} S${size * 0.7},${size * 0.2} ${size * 0.9},${half}" stroke="${patternColor}" fill="none" stroke-width="${size * 0.08}" stroke-linecap="round"/>`;
            
            case 'ellipse':
                return `<ellipse cx="${half}" cy="${half}" rx="${size * 0.4}" ry="${size * 0.25}" fill="${patternColor}"/>`;
            
            case 'rectangle':
                return `<rect x="${size * 0.2}" y="${size * 0.3}" width="${size * 0.6}" height="${size * 0.4}" fill="${patternColor}"/>`;
            
            case 'roundedSquare':
                return `<rect x="${size * 0.1}" y="${size * 0.1}" width="${size * 0.8}" height="${size * 0.8}" rx="${size * 0.15}" fill="${patternColor}"/>`;
            
            case 'pill':
                return `<rect x="${size * 0.1}" y="${size * 0.3}" width="${size * 0.8}" height="${size * 0.4}" rx="${size * 0.2}" fill="${patternColor}"/>`;
            
            case 'teardrop':
                return `<path d="M${half},${size * 0.1} Q${size * 0.8},${half} ${half},${size * 0.9} Q${size * 0.2},${half} ${half},${size * 0.1}" fill="${patternColor}"/>`;
            
            case 'droplet':
                return `<path d="M${half},${size * 0.1} L${size * 0.7},${size * 0.4} Q${size * 0.8},${size * 0.6} ${half},${size * 0.8} Q${size * 0.2},${size * 0.6} ${size * 0.3},${size * 0.4} Z" fill="${patternColor}"/>`;
            
            case 'blob':
                return `<path d="M${half},${size * 0.1} Q${size * 0.8},${size * 0.2} ${size * 0.8},${half} Q${size * 0.8},${size * 0.8} ${half},${size * 0.8} Q${size * 0.2},${size * 0.8} ${size * 0.2},${half} Q${size * 0.2},${size * 0.2} ${half},${size * 0.1}" fill="${patternColor}"/>`;
            
            case 'organic':
                return `<path d="M${half},${size * 0.1} Q${size * 0.7},${size * 0.2} ${size * 0.75},${half} Q${size * 0.8},${size * 0.8} ${half},${size * 0.75} Q${size * 0.2},${size * 0.8} ${size * 0.25},${half} Q${size * 0.3},${size * 0.2} ${half},${size * 0.1}" fill="${patternColor}"/>`;
            
            case 'splatter':
                return `<circle cx="${half}" cy="${half}" r="${size * 0.2}" fill="${patternColor}"/>
                        <circle cx="${size * 0.7}" cy="${size * 0.3}" r="${size * 0.1}" fill="${patternColor}"/>
                        <circle cx="${size * 0.3}" cy="${size * 0.7}" r="${size * 0.12}" fill="${patternColor}"/>
                        <circle cx="${size * 0.2}" cy="${size * 0.2}" r="${size * 0.08}" fill="${patternColor}"/>
                        <circle cx="${size * 0.8}" cy="${size * 0.8}" r="${size * 0.08}" fill="${patternColor}"/>`;
            
            case 'confetti':
                return `<rect x="${size * 0.2}" y="${size * 0.1}" width="${size * 0.15}" height="${size * 0.3}" fill="${patternColor}" transform="rotate(20 ${size * 0.275} ${size * 0.25})"/>
                        <circle cx="${size * 0.7}" cy="${size * 0.6}" r="${size * 0.12}" fill="${patternColor}"/>
                        <polygon points="${size * 0.5},${size * 0.8} ${size * 0.55},${size * 0.9} ${size * 0.45},${size * 0.9}" fill="${patternColor}"/>
                        <circle cx="${size * 0.3}" cy="${size * 0.4}" r="${size * 0.06}" fill="${patternColor}"/>`;
            
            case 'sparkle':
                return `<path d="M${half},${size * 0.1} L${half * 1.2},${half * 0.8} L${size * 0.9},${half} L${half * 1.2},${half * 1.2} L${half},${size * 0.9} L${half * 0.8},${half * 1.2} L${size * 0.1},${half} L${half * 0.8},${half * 0.8} Z" fill="${patternColor}"/>`;
            
            case 'asterisk':
                return `<path d="M${half},${size * 0.1} L${half},${size * 0.9} M${size * 0.1},${half} L${size * 0.9},${half} M${size * 0.2},${size * 0.2} L${size * 0.8},${size * 0.8} M${size * 0.8},${size * 0.2} L${size * 0.2},${size * 0.8}" stroke="${patternColor}" stroke-width="${size * 0.1}" stroke-linecap="round"/>`;
            
            case 'clover':
                return `<circle cx="${half}" cy="${size * 0.25}" r="${size * 0.2}" fill="${patternColor}"/>
                        <circle cx="${half}" cy="${size * 0.75}" r="${size * 0.2}" fill="${patternColor}"/>
                        <circle cx="${size * 0.25}" cy="${half}" r="${size * 0.2}" fill="${patternColor}"/>
                        <circle cx="${size * 0.75}" cy="${half}" r="${size * 0.2}" fill="${patternColor}"/>`;
            
            case 'infinity':
                return `<path d="M${size * 0.2},${half} Q${size * 0.3},${size * 0.2} ${half},${half} Q${size * 0.7},${size * 0.8} ${size * 0.8},${half} Q${size * 0.7},${size * 0.2} ${half},${half} Q${size * 0.3},${size * 0.8} ${size * 0.2},${half}" stroke="${patternColor}" fill="none" stroke-width="${size * 0.1}"/>`;
            
            case 'peace':
                return `<circle cx="${half}" cy="${half}" r="${size * 0.35}" stroke="${patternColor}" fill="none" stroke-width="${size * 0.1}"/>
                        <path d="M${half},${size * 0.15} L${half},${size * 0.85} M${half},${half} L${size * 0.2},${size * 0.7} M${half},${half} L${size * 0.8},${size * 0.7}" stroke="${patternColor}" stroke-width="${size * 0.08}"/>`;
            
            case 'yin-yang':
                return `<circle cx="${half}" cy="${half}" r="${size * 0.4}" fill="${patternColor}"/>
                        <path d="M${half},${size * 0.1} A${size * 0.2},${size * 0.2} 0 0,1 ${half},${size * 0.5} A${size * 0.2},${size * 0.2} 0 0,0 ${half},${size * 0.9} A${size * 0.4},${size * 0.4} 0 0,1 ${half},${size * 0.1}" fill="${backgroundColor}"/>
                        <circle cx="${half}" cy="${size * 0.3}" r="${size * 0.06}" fill="${backgroundColor}"/>
                        <circle cx="${half}" cy="${size * 0.7}" r="${size * 0.06}" fill="${patternColor}"/>`;
            
            case 'gear':
                return `<circle cx="${half}" cy="${half}" r="${size * 0.25}" fill="${patternColor}"/>
                        <rect x="${size * 0.4}" y="0" width="${size * 0.2}" height="${size * 0.3}" fill="${patternColor}"/>
                        <rect x="${size * 0.4}" y="${size * 0.7}" width="${size * 0.2}" height="${size * 0.3}" fill="${patternColor}"/>
                        <rect x="0" y="${size * 0.4}" width="${size * 0.3}" height="${size * 0.2}" fill="${patternColor}"/>
                        <rect x="${size * 0.7}" y="${size * 0.4}" width="${size * 0.3}" height="${size * 0.2}" fill="${patternColor}"/>`;
            
            case 'polygon6':
                return `<polygon points="${half},${size * 0.1} ${size * 0.8},${size * 0.3} ${size * 0.8},${size * 0.7} ${half},${size * 0.9} ${size * 0.2},${size * 0.7} ${size * 0.2},${size * 0.3}" fill="${patternColor}"/>`;
            
            case 'polygon7':
                return `<polygon points="${half},${size * 0.1} ${size * 0.75},${size * 0.2} ${size * 0.9},${size * 0.4} ${size * 0.85},${size * 0.65} ${size * 0.6},${size * 0.85} ${size * 0.3},${size * 0.85} ${size * 0.15},${size * 0.65} ${size * 0.1},${size * 0.4} ${size * 0.25},${size * 0.2}" fill="${patternColor}"/>`;
            
            case 'polygon8':
                return `<polygon points="${half},${size * 0.1} ${size * 0.7},${size * 0.15} ${size * 0.85},${size * 0.3} ${size * 0.9},${half} ${size * 0.85},${size * 0.7} ${size * 0.7},${size * 0.85} ${half},${size * 0.9} ${size * 0.3},${size * 0.85} ${size * 0.15},${size * 0.7} ${size * 0.1},${half} ${size * 0.15},${size * 0.3} ${size * 0.3},${size * 0.15}" fill="${patternColor}"/>`;
            
            case 'mesh':
                return `<path d="M${size * 0.1},${size * 0.1} L${size * 0.9},${size * 0.9} M${size * 0.9},${size * 0.1} L${size * 0.1},${size * 0.9} M${half},${size * 0.1} L${half},${size * 0.9} M${size * 0.1},${half} L${size * 0.9},${half}" stroke="${patternColor}" stroke-width="${size * 0.06}"/>`;
            
            case 'lattice':
                return `<path d="M${size * 0.1},${size * 0.1} L${size * 0.9},${size * 0.1} L${size * 0.9},${size * 0.9} L${size * 0.1},${size * 0.9} Z M${size * 0.1},${half} L${size * 0.9},${half} M${half},${size * 0.1} L${half},${size * 0.9}" stroke="${patternColor}" fill="none" stroke-width="${size * 0.04}"/>`;
            
            case 'weave':
                return `<path d="M${size * 0.1},${size * 0.2} L${size * 0.9},${size * 0.8} M${size * 0.1},${size * 0.5} L${size * 0.9},${size * 0.5} M${size * 0.1},${size * 0.8} L${size * 0.9},${size * 0.2}" stroke="${patternColor}" stroke-width="${size * 0.06}"/>`;
            
            case 'brick':
                return `<rect x="0" y="0" width="${size}" height="${half}" stroke="${patternColor}" fill="none" stroke-width="${size * 0.04}"/>
                        <rect x="0" y="${half}" width="${half}" height="${half}" stroke="${patternColor}" fill="none" stroke-width="${size * 0.04}"/>
                        <rect x="${half}" y="${half}" width="${half}" height="${half}" stroke="${patternColor}" fill="none" stroke-width="${size * 0.04}"/>`;
            
            default:
                return `<circle cx="${half}" cy="${half}" r="${half * 0.8}" fill="${patternColor}"/>`;
        }
    };

    // Generate SVG code
    const generateSVG = (forExport = false) => {
        const patternSize = size + spacing;
        const width = forExport ? exportWidth : 680;
        const height = forExport ? exportHeight : 400;

        const shape = generateShape(patternType, size);

        return `<svg width="${width}" height="${height}" xmlns="http://www.w3.org/2000/svg">
  <defs>
    <pattern id="pattern" x="0" y="0" width="${patternSize}" height="${patternSize}" patternUnits="userSpaceOnUse" patternTransform="rotate(${rotation}) skewX(${skew})">
      <g opacity="${opacity}">
        ${shape}
      </g>
    </pattern>
  </defs>
  <rect width="100%" height="100%" fill="${backgroundColor}"/>
  <rect width="100%" height="100%" fill="url(#pattern)"/>
</svg>`;
    };

    // Copy SVG code to clipboard
    const copySVGCode = () => {
        const svgCode = generateSVG(true);
        navigator.clipboard.writeText(svgCode);
        setCopied(true);
        setExportDropdownOpen(false);
        toast.success('SVG code copied!', {
            duration: 2000,
            icon: '📋',
            style: {
                background: '#F9FAFB',
                color: '#0B1220',
                border: '1px solid #E5E7EB',
            },
        });
        setTimeout(() => setCopied(false), 2000);
    };

    // Download as SVG file
    const downloadSVG = () => {
        const svgCode = generateSVG(true);
        const blob = new Blob([svgCode], { type: 'image/svg+xml' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = 'pattern.svg';
        a.click();
        URL.revokeObjectURL(url);
        setExportDropdownOpen(false);
        toast.success('SVG downloaded!', {
            duration: 2000,
            icon: '📥',
            style: {
                background: '#F9FAFB',
                color: '#0B1220',
                border: '1px solid #E5E7EB',
            },
        });
    };

    // Download as PNG file
const downloadPNG = () => {
    try {
        const svgCode = generateSVG(true);
        const canvas = document.createElement('canvas');
        canvas.width = exportWidth;
        canvas.height = exportHeight;
        const ctx = canvas.getContext('2d');

        // Clear canvas with white background
        ctx.fillStyle = '#FFFFFF';
        ctx.fillRect(0, 0, canvas.width, canvas.height);

        // Create image element properly
        const img = new window.Image(); // Use window.Image instead of just Image
        
        // Important: Allow cross-origin and set SVG as trusted
        img.crossOrigin = 'anonymous';
        
        // Create SVG blob with proper namespace
        const svgBlob = new Blob([svgCode], { type: 'image/svg+xml;charset=utf-8' });
        const url = URL.createObjectURL(svgBlob);

        img.onload = () => {
            try {
                // Draw image on canvas
                ctx.drawImage(img, 0, 0, canvas.width, canvas.height);
                
                // Convert to PNG blob
                canvas.toBlob((blob) => {
                    if (blob) {
                        const pngUrl = URL.createObjectURL(blob);
                        const a = document.createElement('a');
                        a.href = pngUrl;
                        a.download = 'pattern.png';
                        document.body.appendChild(a);
                        a.click();
                        document.body.removeChild(a);
                        
                        // Cleanup URLs
                        setTimeout(() => {
                            URL.revokeObjectURL(pngUrl);
                            URL.revokeObjectURL(url);
                        }, 100);
                        
                        toast.success('PNG downloaded!', {
                            duration: 2000,
                            icon: '🖼️',
                            style: {
                                background: '#F9FAFB',
                                color: '#0B1220',
                                border: '1px solid #E5E7EB',
                            },
                        });
                    } else {
                        throw new Error('Failed to create PNG blob');
                    }
                }, 'image/png', 1);
            } catch (error) {
                console.error('PNG export error:', error);
                toast.error('Failed to download PNG', {
                    duration: 3000,
                    icon: '❌',
                    style: {
                        background: '#F9FAFB',
                        color: '#0B1220',
                        border: '1px solid #E5E7EB',
                    },
                });
            }
            setExportDropdownOpen(false);
        };

        img.onerror = (error) => {
            console.error('Image load error:', error);
            toast.error('Failed to load SVG for PNG export', {
                duration: 3000,
                icon: '❌',
                style: {
                    background: '#F9FAFB',
                    color: '#0B1220',
                    border: '1px solid #E5E7EB',
                },
            });
            URL.revokeObjectURL(url);
            setExportDropdownOpen(false);
        };

        img.src = url;
    } catch (error) {
        console.error('PNG download error:', error);
        toast.error('Failed to initialize PNG download', {
            duration: 3000,
            icon: '❌',
            style: {
                background: '#F9FAFB',
                color: '#0B1220',
                border: '1px solid #E5E7EB',
            },
        });
        setExportDropdownOpen(false);
    }
};

    return (
        <div className="min-h-screen bg-[#F9FAFB] p-4 md:p-8 font-manrope">
            <div className="max-w-5xl mx-auto">

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                    {/* Preview Area */}
                    <div className="lg:col-span-2 space-y-4">
                        <div className="bg-[#FFFFFF] rounded-2xl shadow-xl border border-[#E5E7EB] p-6">
                            <div className="flex items-center justify-between mb-4">
                                <h2 className="text-lg font-semibold text-[#111827] flex items-center gap-2">
                                    <Eye className="w-5 h-5 text-[#3B82F6]" />
                                    Preview
                                </h2>
                                <div className="flex items-center gap-2">
                                    <span className="text-xs text-[#6B7280] bg-[#F9FAFB] px-3 py-1 rounded-full border border-[#E5E7EB]">
                                        {exportWidth} x {exportHeight}
                                    </span>
                                </div>
                            </div>
                            <div
                                className="w-full rounded-xl overflow-hidden border-2 border-[#E5E7EB] bg-[#F9FAFB]"
                                style={{ height: '400px' }}
                                dangerouslySetInnerHTML={{ __html: generateSVG() }}
                            />

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
                                <button
                                    onClick={shuffleColors}
                                    className="flex items-center justify-center gap-2 px-6 py-3 bg-[#FFFFFF] border-2 border-[#3B82F6] text-[#3B82F6] rounded-xl hover:bg-[#F9FAFB] transition-all font-medium shadow-sm"
                                >
                                    <Shuffle size={18} />
                                    Shuffle Colors
                                </button>
                                <button
                                    onClick={() => setFullScreen(true)}
                                    className="flex items-center justify-center gap-2 px-6 py-3 bg-[#FFFFFF] border-2 border-[#E5E7EB] text-[#6B7280] rounded-xl hover:border-[#3B82F6] hover:text-[#3B82F6] transition-all font-medium shadow-sm"
                                >
                                    <Maximize2 size={18} />
                                    Full Screen
                                </button>
                            </div>

                            <div className="relative mt-4" ref={dropdownRef}>
                                <button
                                    onClick={() => setExportDropdownOpen(!exportDropdownOpen)}
                                    className="w-full flex items-center justify-center gap-2 px-6 py-4 bg-[#3B82F6] hover:bg-[#2776f5] text-[#FFFFFF] rounded-xl transition-all font-semibold shadow-lg shadow-[#3B82F6]/30"
                                >
                                    <Download size={18} />
                                    Export Pattern
                                    <ChevronDown size={16} className={`transition-transform duration-200 ${exportDropdownOpen ? 'rotate-180' : ''}`} />
                                </button>

                                {exportDropdownOpen && (
                                    <div className="absolute top-full mt-2 w-full bg-[#FFFFFF] border border-[#E5E7EB] rounded-xl shadow-2xl z-50 overflow-hidden animate-in fade-in slide-in-from-top-2">
                                        <button
                                            onClick={copySVGCode}
                                            className="w-full flex items-center gap-3 px-4 py-3.5 hover:bg-[#F9FAFB] transition-colors text-left border-b border-[#E5E7EB]"
                                        >
                                            {copied ? (
                                                <Check size={18} className="text-[#10B981]" />
                                            ) : (
                                                <Copy size={18} className="text-[#3B82F6]" />
                                            )}
                                            <span className="text-[#0B1220] font-medium">{copied ? 'Copied!' : 'Copy SVG Code'}</span>
                                        </button>
                                        <button
                                            onClick={downloadSVG}
                                            className="w-full flex items-center gap-3 px-4 py-3.5 hover:bg-[#F9FAFB] transition-colors text-left border-b border-[#E5E7EB]"
                                        >
                                            <Download size={18} className="text-[#3B82F6]" />
                                            <span className="text-[#0B1220] font-medium">Download SVG</span>
                                        </button>
                                        <button
                                            onClick={downloadPNG}
                                            className="w-full flex items-center gap-3 px-4 py-3.5 hover:bg-[#F9FAFB] transition-colors text-left"
                                        >
                                            <Download size={18} className="text-[#3B82F6]" />
                                            <span className="text-[#0B1220] font-medium">Download PNG</span>
                                        </button>
                                    </div>
                                )}
                            </div>
                        </div>

                        {/* Export Size Settings */}
                        <div className="bg-[#FFFFFF] rounded-2xl shadow-xl border border-[#E5E7EB] p-6">
                            <h3 className="text-lg font-semibold text-[#111827] mb-4 flex items-center gap-2">
                                <Image className="w-5 h-5 text-[#3B82F6]" />
                                Export Settings
                            </h3>

                            <div className="space-y-4">
                                <div>
                                    <label className="block text-sm font-medium text-[#6B7280] mb-2">Size Template</label>
                                    <CustomSelect
                                        label=""
                                        value={exportTemplate}
                                        onChange={(e) => setExportTemplate(e.target.value)}
                                        options={exportOptions}
                                        searchable={true}
                                        size="md"
                                    />
                                </div>

                                {exportTemplate === 'custom' ? (
                                    <div className="grid grid-cols-2 gap-4">
                                        <div>
                                            <label className="block text-sm font-medium text-[#6B7280] mb-2">Width (px)</label>
                                            <input
                                                type="number"
                                                value={customWidth}
                                                onChange={(e) => setCustomWidth(Number(e.target.value))}
                                                className="w-full px-4 py-2.5 border border-[#E5E7EB] rounded-lg focus:border-[#3B82F6] focus:ring-4 focus:ring-[#3B82F6]/10 outline-none transition-all text-[#0B1220]"
                                            />
                                        </div>
                                        <div>
                                            <label className="block text-sm font-medium text-[#6B7280] mb-2">Height (px)</label>
                                            <input
                                                type="number"
                                                value={customHeight}
                                                onChange={(e) => setCustomHeight(Number(e.target.value))}
                                                className="w-full px-4 py-2.5 border border-[#E5E7EB] rounded-lg focus:border-[#3B82F6] focus:ring-4 focus:ring-[#3B82F6]/10 outline-none transition-all text-[#0B1220]"
                                            />
                                        </div>
                                    </div>
                                ) : (
                                    <div className="grid grid-cols-2 gap-4">
                                        <div>
                                            <label className="block text-sm font-medium text-[#6B7280] mb-2">Width (px)</label>
                                            <div className="px-4 py-2.5 bg-[#F9FAFB] border border-[#E5E7EB] rounded-lg text-[#0B1220] font-mono">
                                                {exportWidth}
                                            </div>
                                        </div>
                                        <div>
                                            <label className="block text-sm font-medium text-[#6B7280] mb-2">Height (px)</label>
                                            <div className="px-4 py-2.5 bg-[#F9FAFB] border border-[#E5E7EB] rounded-lg text-[#0B1220] font-mono">
                                                {exportHeight}
                                            </div>
                                        </div>
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>

                    {/* Settings Panel */}
                    <div className="space-y-6">
                        {/* Pattern Type */}
                        <div className="bg-[#FFFFFF] rounded-2xl shadow-xl border border-[#E5E7EB] p-6">
                            <label className="block text-sm font-bold text-[#6B7280] uppercase tracking-wider mb-3">Pattern Type</label>
                            <CustomSelect
                                label=""
                                value={patternType}
                                onChange={(e) => setPatternType(e.target.value)}
                                options={patternOptions}
                                searchable={true}
                                size="lg"
                            />
                        </div>

                        {/* Colors */}
                        <div className="bg-[#FFFFFF] rounded-2xl shadow-xl border border-[#E5E7EB] p-6">
                            <h3 className="text-lg font-semibold text-[#111827] mb-4 flex items-center gap-2">
                                <Palette className="w-5 h-5 text-[#3B82F6]" />
                                Colors
                            </h3>
                            <div className="space-y-4">
                                <div>
                                    <label className="block text-sm font-medium text-[#6B7280] mb-2">Pattern Color</label>
                                    <div className="flex items-center gap-3">
                                        <input
                                            type="color"
                                            value={patternColor}
                                            onChange={(e) => setPatternColor(e.target.value)}
                                            className="w-12 h-12 rounded-lg cursor-pointer border-2 border-[#E5E7EB]"
                                        />
                                        <input
                                            type="text"
                                            value={patternColor}
                                            onChange={(e) => setPatternColor(e.target.value)}
                                            className="flex-1 px-4 py-2.5 border border-[#E5E7EB] rounded-lg focus:border-[#3B82F6] focus:ring-4 focus:ring-[#3B82F6]/10 outline-none transition-all font-mono text-sm uppercase text-[#0B1220]"
                                        />
                                    </div>
                                </div>

                                <div>
                                    <label className="block text-sm font-medium text-[#6B7280] mb-2">Background Color</label>
                                    <div className="flex items-center gap-3">
                                        <input
                                            type="color"
                                            value={backgroundColor}
                                            onChange={(e) => setBackgroundColor(e.target.value)}
                                            className="w-12 h-12 rounded-lg cursor-pointer border-2 border-[#E5E7EB]"
                                        />
                                        <input
                                            type="text"
                                            value={backgroundColor}
                                            onChange={(e) => setBackgroundColor(e.target.value)}
                                            className="flex-1 px-4 py-2.5 border border-[#E5E7EB] rounded-lg focus:border-[#3B82F6] focus:ring-4 focus:ring-[#3B82F6]/10 outline-none transition-all font-mono text-sm uppercase text-[#0B1220]"
                                        />
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Pattern Settings */}
                        <div className="bg-[#FFFFFF] rounded-2xl shadow-xl border border-[#E5E7EB] p-6">
                            <div className="flex items-center justify-between mb-4">
                                <h3 className="text-lg font-semibold text-[#111827] flex items-center gap-2">
                                    <Settings className="w-5 h-5 text-[#3B82F6]" />
                                    Pattern Settings
                                </h3>
                                <button
                                    onClick={resetSettings}
                                    className="text-sm text-[#6B7280] hover:text-[#3B82F6] flex items-center gap-1 px-3 py-1.5 rounded-lg hover:bg-[#F9FAFB] transition-all"
                                >
                                    <RotateCw size={14} />
                                    Reset
                                </button>
                            </div>

                            <div className="space-y-5">
                                <div>
                                    <div className="flex justify-between mb-2">
                                        <label className="text-sm font-medium text-[#6B7280]">Size</label>
                                        <span className="text-sm font-bold text-[#3B82F6] bg-[#F9FAFB] px-3 py-1 rounded-full border border-[#E5E7EB]">
                                            {size}px
                                        </span>
                                    </div>
                                    <input
                                        type="range"
                                        min="10"
                                        max="100"
                                        value={size}
                                        onChange={(e) => setSize(Number(e.target.value))}
                                        className="w-full h-2 bg-[#E5E7EB] rounded-lg appearance-none cursor-pointer accent-[#3B82F6]"
                                    />
                                </div>

                                <div>
                                    <div className="flex justify-between mb-2">
                                        <label className="text-sm font-medium text-[#6B7280]">Spacing</label>
                                        <span className="text-sm font-bold text-[#3B82F6] bg-[#F9FAFB] px-3 py-1 rounded-full border border-[#E5E7EB]">
                                            {spacing}px
                                        </span>
                                    </div>
                                    <input
                                        type="range"
                                        min="0"
                                        max="100"
                                        value={spacing}
                                        onChange={(e) => setSpacing(Number(e.target.value))}
                                        className="w-full h-2 bg-[#E5E7EB] rounded-lg appearance-none cursor-pointer accent-[#3B82F6]"
                                    />
                                </div>

                                <div>
                                    <div className="flex justify-between mb-2">
                                        <label className="text-sm font-medium text-[#6B7280]">Rotation</label>
                                        <span className="text-sm font-bold text-[#3B82F6] bg-[#F9FAFB] px-3 py-1 rounded-full border border-[#E5E7EB]">
                                            {rotation}°
                                        </span>
                                    </div>
                                    <input
                                        type="range"
                                        min="0"
                                        max="360"
                                        value={rotation}
                                        onChange={(e) => setRotation(Number(e.target.value))}
                                        className="w-full h-2 bg-[#E5E7EB] rounded-lg appearance-none cursor-pointer accent-[#3B82F6]"
                                    />
                                </div>

                                <div>
                                    <div className="flex justify-between mb-2">
                                        <label className="text-sm font-medium text-[#6B7280]">Skew</label>
                                        <span className="text-sm font-bold text-[#3B82F6] bg-[#F9FAFB] px-3 py-1 rounded-full border border-[#E5E7EB]">
                                            {skew}°
                                        </span>
                                    </div>
                                    <input
                                        type="range"
                                        min="-45"
                                        max="45"
                                        value={skew}
                                        onChange={(e) => setSkew(Number(e.target.value))}
                                        className="w-full h-2 bg-[#E5E7EB] rounded-lg appearance-none cursor-pointer accent-[#3B82F6]"
                                    />
                                </div>

                                <div>
                                    <div className="flex justify-between mb-2">
                                        <label className="text-sm font-medium text-[#6B7280]">Opacity</label>
                                        <span className="text-sm font-bold text-[#3B82F6] bg-[#F9FAFB] px-3 py-1 rounded-full border border-[#E5E7EB]">
                                            {Math.round(opacity * 100)}%
                                        </span>
                                    </div>
                                    <input
                                        type="range"
                                        min="0"
                                        max="1"
                                        step="0.01"
                                        value={opacity}
                                        onChange={(e) => setOpacity(Number(e.target.value))}
                                        className="w-full h-2 bg-[#E5E7EB] rounded-lg appearance-none cursor-pointer accent-[#3B82F6]"
                                    />
                                </div>
                            </div>
                        </div>

                        {/* Stats */}
                        <div className="bg-linear-to-r from-[#3B82F6]/10 to-transparent rounded-xl p-4 border border-[#E5E7EB]">
                            <div className="grid grid-cols-2 gap-4 text-center">
                                <div>
                                    <p className="text-xs text-[#6B7280]">Pattern Type</p>
                                    <p className="text-sm font-bold text-[#111827] mt-1">{patternTypes.find(p => p.id === patternType)?.name}</p>
                                </div>
                                <div>
                                    <p className="text-xs text-[#6B7280]">Total Shapes</p>
                                    <p className="text-sm font-bold text-[#111827] mt-1">{patternTypes.length}</p>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Full Screen Modal */}
            {fullScreen && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4 backdrop-blur-xl bg-black/40">
                    <button
                        onClick={() => setFullScreen(false)}
                        className="absolute top-18 right-4 text-[#FFFFFF] bg-[#111827]/50 hover:bg-[#111827]/70 rounded-full p-3 transition-all"
                    >
                        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                        </svg>
                    </button>
                    <div
                        className="max-w-[90vw] max-h-[90vh] rounded-2xl shadow-2xl border-4 border-[#FFFFFF] overflow-hidden"
                        dangerouslySetInnerHTML={{ __html: generateSVG() }}
                    />
                </div>
            )}
        </div>
    );
};

export default SvgPattern;