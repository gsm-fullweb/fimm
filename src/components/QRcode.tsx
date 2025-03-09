import React, { useRef, useState } from 'react';
import { QrReader } from 'react-qr-reader';
import type { Result } from '@zxing/library';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { useToast } from '@/hooks/use-toast';
import { useNavigate } from 'react-router-dom';
import { supabase } from '@/lib/supabase';

export function QRcode() {
  const [data, setData] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const { toast } = useToast();
  const navigate = useNavigate();

  const handleScan = async (result: string | null) => {
    if (!result) return;
    
    try {
      // Parse QR code data (assuming format: title|location|user_id)
      const [title, location, user_id] = result.split('|');
      
      if (!title || !location || !user_id) {
        throw new Error('Invalid QR code format');
      }

      setIsLoading(true);
      setError(null);

      // Save to Supabase
      const { error } = await supabase
        .from('image')
        .insert([
          { 
            title,
            location, 
            user_id
          }
        ]);

      if (error) throw error;

      toast({
        title: "Success!",
        description: "QR code data saved successfully",
        duration: 5000,
      });

      navigate('/results');
      
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to process QR code';
      setError(errorMessage);
      toast({
        title: "Error",
        description: errorMessage,
        variant: "destructive",
        duration: 5000,
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Card className="p-6 max-w-2xl mx-auto">
      <div className="space-y-4">
        <div className="relative rounded-lg overflow-hidden bg-black">
          <QrReader
            constraints={{ facingMode: 'environment' }}
            onResult={(result: Result | null | undefined) => {
              if (result) {
                handleScan(result.getText());
              }
            }}
            scanDelay={500}
            className="w-full"
          />
        </div>

        {data && (
          <div className="space-y-4">
            <div className="text-center">
              <p className="text-sm text-gray-500">Scanned Data:</p>
              <p className="font-medium">{data}</p>
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
