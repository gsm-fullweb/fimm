"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.Camera = Camera;
const react_1 = __importStar(require("react"));
const react_webcam_1 = __importDefault(require("react-webcam"));
const button_1 = require("@/components/ui/button");
const card_1 = require("@/components/ui/card");
const input_1 = require("@/components/ui/input");
const label_1 = require("@/components/ui/label");
const lucide_react_1 = require("lucide-react");
const utils_1 = require("@/lib/utils");
const use_toast_1 = require("@/hooks/use-toast");
const react_router_dom_1 = require("react-router-dom");
const supabase_1 = require("@/lib/supabase");
const CAPTURE_OPTIONS = {
    width: 1280,
    height: 720,
    facingMode: "user"
};
const WEBHOOK_URL = 'https://n8n-n8n.n1n956.easypanel.host/webhook-test/Fimm-Hidrometro';
function Camera() {
    const webcamRef = (0, react_1.useRef)(null);
    const [imgSrc, setImgSrc] = (0, react_1.useState)(null);
    const [isUploading, setIsUploading] = (0, react_1.useState)(false);
    const [error, setError] = (0, react_1.useState)(null);
    const [title, setTitle] = (0, react_1.useState)('');
    const [location, setLocation] = (0, react_1.useState)('');
    const { toast } = (0, use_toast_1.useToast)();
    const navigate = (0, react_router_dom_1.useNavigate)();
    const capture = (0, react_1.useCallback)(() => {
        const imageSrc = webcamRef.current?.getScreenshot();
        if (imageSrc) {
            setImgSrc(imageSrc);
            setError(null);
        }
    }, [webcamRef]);
    const retake = () => {
        setImgSrc(null);
        setError(null);
        setTitle('');
        setLocation('');
    };
    const uploadImage = async () => {
        if (!imgSrc)
            return;
        if (!title.trim()) {
            toast({
                title: "Error",
                description: "Please enter an image title",
                variant: "destructive",
            });
            return;
        }
        if (!location.trim()) {
            toast({
                title: "Error",
                description: "Please enter the image location",
                variant: "destructive",
            });
            return;
        }
        try {
            setIsUploading(true);
            setError(null);
            // Convert base64 to blob
            const response = await fetch(imgSrc);
            const blob = await response.blob();
            // Compress image before upload
            const compressedImage = await compressImage(blob);
            // Generate unique filename
            const timestamp = Date.now();
            const fileName = `hidrometro_${timestamp}.jpg`;
            // Upload to Supabase Storage
            const { error: storageError } = await supabase_1.supabase.storage
                .from('image')
                .upload(fileName, compressedImage, {
                cacheControl: '3600',
                upsert: false
            });
            if (storageError) {
                throw new Error(`Failed to upload to Supabase: ${storageError.message}`);
            }
            // Get public URL
            const { data: urlData } = supabase_1.supabase.storage
                .from('image')
                .getPublicUrl(fileName);
            // Send to webhook for processing
            const formData = new FormData();
            formData.append('image', compressedImage, fileName);
            formData.append('title', title);
            formData.append('location', location);
            formData.append('supabase_url', urlData.publicUrl);
            const webhookResponse = await fetch(WEBHOOK_URL, {
                method: 'POST',
                body: formData,
                headers: {
                    'Accept': 'application/json',
                },
            });
            if (!webhookResponse.ok) {
                throw new Error(`Failed to process image: ${webhookResponse.statusText}`);
            }
            const data = await webhookResponse.json();
            toast({
                title: "Success!",
                description: `Image uploaded to Supabase Storage as ${fileName} and processing started`,
                duration: 5000,
            });
            // Reset the capture view and navigate to results
            setImgSrc(null);
            setTitle('');
            setLocation('');
            navigate('/results');
        }
        catch (err) {
            const errorMessage = err instanceof Error ? err.message : 'Failed to upload image';
            setError(errorMessage);
            toast({
                title: "Error",
                description: errorMessage,
                variant: "destructive",
                duration: 5000,
            });
        }
        finally {
            setIsUploading(false);
        }
    };
    const compressImage = async (file) => {
        return new Promise((resolve, reject) => {
            const img = new Image();
            img.src = URL.createObjectURL(file);
            img.onload = () => {
                const canvas = document.createElement('canvas');
                const ctx = canvas.getContext('2d');
                if (!ctx) {
                    reject(new Error('Failed to get canvas context'));
                    return;
                }
                // Set dimensions maintaining aspect ratio
                const MAX_WIDTH = 1280;
                const MAX_HEIGHT = 720;
                let width = img.width;
                let height = img.height;
                if (width > height) {
                    if (width > MAX_WIDTH) {
                        height *= MAX_WIDTH / width;
                        width = MAX_WIDTH;
                    }
                }
                else {
                    if (height > MAX_HEIGHT) {
                        width *= MAX_HEIGHT / height;
                        height = MAX_HEIGHT;
                    }
                }
                canvas.width = width;
                canvas.height = height;
                // Draw and compress
                ctx.drawImage(img, 0, 0, width, height);
                canvas.toBlob((blob) => {
                    if (blob) {
                        resolve(blob);
                    }
                    else {
                        reject(new Error('Failed to compress image'));
                    }
                }, 'image/jpeg', 0.8 // compression quality
                );
            };
            img.onerror = () => {
                reject(new Error('Failed to load image'));
            };
        });
    };
    return (<card_1.Card className="p-6 max-w-2xl mx-auto">
      <div className="space-y-4">
        {!imgSrc ? (<div className="relative rounded-lg overflow-hidden bg-black">
            <react_webcam_1.default audio={false} ref={webcamRef} screenshotFormat="image/jpeg" videoConstraints={CAPTURE_OPTIONS} className="w-full"/>
            <button_1.Button onClick={capture} className="absolute bottom-4 left-1/2 transform -translate-x-1/2" size="lg">
              <lucide_react_1.Camera className="mr-2 h-5 w-5"/>
              Capture Photo
            </button_1.Button>
          </div>) : (<div className="space-y-6">
            <img src={imgSrc} alt="Captured" className="w-full rounded-lg"/>
            
            <div className="space-y-4">
              <div className="space-y-2">
                <label_1.Label htmlFor="title">Image Title</label_1.Label>
                <input_1.Input id="title" placeholder="Enter image title" value={title} onChange={(e) => setTitle(e.target.value)} disabled={isUploading}/>
              </div>
              
              <div className="space-y-2">
                <label_1.Label htmlFor="location">Image Location</label_1.Label>
                <input_1.Input id="location" placeholder="Enter image location" value={location} onChange={(e) => setLocation(e.target.value)} disabled={isUploading}/>
              </div>
            </div>

            <div className="flex justify-center space-x-4">
              <button_1.Button onClick={retake} variant="secondary" disabled={isUploading}>
                <lucide_react_1.RefreshCw className={(0, utils_1.cn)("mr-2 h-5 w-5", isUploading && "animate-spin")}/>
                Retake
              </button_1.Button>
              <button_1.Button onClick={uploadImage} disabled={isUploading}>
                <lucide_react_1.Upload className={(0, utils_1.cn)("mr-2 h-5 w-5", isUploading && "animate-spin")}/>
                {isUploading ? 'Uploading...' : 'Upload'}
              </button_1.Button>
            </div>
          </div>)}

        {error && (<div className="text-red-500 text-center p-2 bg-red-50 rounded-lg">
            {error}
          </div>)}
      </div>
    </card_1.Card>);
}
