import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '@/lib/supabase';
import { Card } from '@/components/ui/card';
import { Table, TableBody, TableCaption, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Button } from '@/components/ui/button';
import { CameraIcon } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

interface ImageRecord {
  id: string;
  created_at: string;
  title: string;
  location: string;
  image_url: string;
  status: string;
  description: string;
}

export function ResultsPage() {
  const [images, setImages] = useState<ImageRecord[]>([]);
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();
  const navigate = useNavigate();

  const fetchImages = async () => {
    try {
      setLoading(true);
      const { data, error } = await supabase
        .from('images')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;
      setImages(data || []);
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to fetch images",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchImages();
  }, []);

  return (
    <Card className="p-6 max-w-4xl mx-auto">
      <div className="flex justify-between items-center mb-6">
        <div className="flex items-center space-x-4">
          <Button 
            variant="outline" 
            onClick={() => navigate('/')}
            className="flex items-center"
          >
            <CameraIcon className="mr-2 h-4 w-4" />
            Back to Camera
          </Button>
          <h1 className="text-2xl font-bold">Image Results</h1>
        </div>
        <Button onClick={fetchImages} disabled={loading}>
          {loading ? 'Refreshing...' : 'Refresh'}
        </Button>
      </div>

      <Table className="w-full">
        <TableCaption>List of captured images and their processing status</TableCaption>
        <TableHeader>
          <TableRow>
            <TableHead className="w-[150px]">Title</TableHead>
            <TableHead className="w-[150px]">Location</TableHead>
            <TableHead className="w-[100px]">Status</TableHead>
            <TableHead className="w-[150px]">Date</TableHead>
            <TableHead className="w-[100px]">Image</TableHead>
            <TableHead className="min-w-[200px]">Description</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {images.map((image) => (
            <TableRow key={image.id}>
              <TableCell>{image.title}</TableCell>
              <TableCell>{image.location}</TableCell>
              <TableCell>{image.status}</TableCell>
              <TableCell>{new Date(image.created_at).toLocaleString()}</TableCell>
              <TableCell>
                {image.image_url && (
                  <a 
                    href={image.image_url} 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="text-blue-500 hover:underline"
                  >
                    View Image
                  </a>
                )}
              </TableCell>
              <TableCell className="max-w-[300px] whitespace-normal">
                <div className="line-clamp-3">
                  {image.description}
                </div>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </Card>
  );
}
