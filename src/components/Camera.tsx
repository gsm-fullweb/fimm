import React, { useRef, useState, useCallback } from 'react';
import Webcam from 'react-webcam';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Camera as CameraIcon, RefreshCw, Upload } from 'lucide-react';
import { cn } from '@/lib/utils';
import { useToast } from '@/hooks/use-toast';
import { useNavigate } from 'react-router-dom';
import { supabase } from '@/lib/supabase';

const CAPTURE_OPTIONS = {
  width: 1280,
  height: 720,
  facingMode: "user"
};

const WEBHOOK_URL = 'https://n8n-n8n.n1n956.easypanel.host/webhook-test/Fimm-Hidrometro';

export function Camera() {
  const webcamRef = useRef<Webcam>(null);
  const [imgSrc, setImgSrc] = useState<string | null>(null);
  const [isUploading, setIsUploading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [title, setTitle] = useState('');
  const [location, setLocation] = useState('');
  const { toast } = useToast();
  const navigate = useNavigate();

  const capture = useCallback(() => {
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
    if (!imgSrc) return;

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
      const { error: storageError } = await supabase.storage
        .from('image')
        .upload(fileName, compressedImage, {
          cacheControl: '3600',
          upsert: false
        });

      if (storageError) {
        throw new Error(`Failed to upload to Supabase: ${storageError.message}`);
      }

      // Get public URL
      const { data: urlData } = supabase.storage
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
      
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to upload image';
      setError(errorMessage);
      toast({
        title: "Error",
        description: errorMessage,
        variant: "destructive",
        duration: 5000,
      });
    } finally {
      setIsUploading(false);
    }
  };

  const compressImage = async (file: Blob): Promise<Blob> => {
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
        } else {
          if (height > MAX_HEIGHT) {
            width *= MAX_HEIGHT / height;
            height = MAX_HEIGHT;
          }
        }

        canvas.width = width;
        canvas.height = height;

        // Draw and compress
        ctx.drawImage(img, 0, 0, width, height);
        canvas.toBlob(
          (blob) => {
            if (blob) {
              resolve(blob);
            } else {
              reject(new Error('Failed to compress image'));
            }
          },
          'image/jpeg',
          0.8 // compression quality
        );
      };

      img.onerror = () => {
        reject(new Error('Failed to load image'));
      };
    });
  };

  return (
    <Card className="p-6 max-w-2xl mx-auto">
      <div className="space-y-4">
        {!imgSrc ? (
          <div className="relative rounded-lg overflow-hidden bg-black">
            <Webcam
              audio={false}
              ref={webcamRef}
              screenshotFormat="image/jpeg"
              videoConstraints={CAPTURE_OPTIONS}
              className="w-full"
            />
            <Button
              onClick={capture}
              className="absolute bottom-4 left-1/2 transform -translate-x-1/2"
              size="lg"
            >
              <CameraIcon className="mr-2 h-5 w-5" />
              Capture Photo
            </Button>
          </div>
        ) : (
          <div className="space-y-6">
            <img
              src={imgSrc}
              alt="Captured"
              className="w-full rounded-lg"
            />
            
            <div className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="title">Image Title</Label>
                <Input
                  id="title"
                  placeholder="Enter image title"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  disabled={isUploading}
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="location">Image Location</Label>
                <Input
                  id="location"
                  placeholder="Enter image location"
                  value={location}
                  onChange={(e) => setLocation(e.target.value)}
                  disabled={isUploading}
                />
              </div>
            </div>

            <div className="flex justify-center space-x-4">
              <Button
                onClick={retake}
                variant="secondary"
                disabled={isUploading}
              >
                <RefreshCw className={cn(
                  "mr-2 h-5 w-5",
                  isUploading && "animate-spin"
                )} />
                Retake
              </Button>
              <Button
                onClick={uploadImage}
                disabled={isUploading}
              >
                <Upload className={cn(
                  "mr-2 h-5 w-5",
                  isUploading && "animate-spin"
                )} />
                {isUploading ? 'Uploading...' : 'Upload'}
              </Button>
            </div>
          </div>
        )}

        {error && (
          <div className="text-red-500 text-center p-2 bg-red-50 rounded-lg">
            {error}
          </div>
        )}
      </div>
    </Card>
  );
}
