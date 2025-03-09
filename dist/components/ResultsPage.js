"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ResultsPage = ResultsPage;
const react_1 = require("react");
const react_router_dom_1 = require("react-router-dom");
const supabase_1 = require("@/lib/supabase");
const card_1 = require("@/components/ui/card");
const table_1 = require("@/components/ui/table");
const button_1 = require("@/components/ui/button");
const lucide_react_1 = require("lucide-react");
const use_toast_1 = require("@/hooks/use-toast");
function ResultsPage() {
    const [images, setImages] = (0, react_1.useState)([]);
    const [loading, setLoading] = (0, react_1.useState)(true);
    const { toast } = (0, use_toast_1.useToast)();
    const navigate = (0, react_router_dom_1.useNavigate)();
    const fetchImages = async () => {
        try {
            setLoading(true);
            const { data, error } = await supabase_1.supabase
                .from('images')
                .select('*')
                .order('created_at', { ascending: false });
            if (error)
                throw error;
            setImages(data || []);
        }
        catch (error) {
            toast({
                title: "Error",
                description: "Failed to fetch images",
                variant: "destructive",
            });
        }
        finally {
            setLoading(false);
        }
    };
    (0, react_1.useEffect)(() => {
        fetchImages();
    }, []);
    return (<card_1.Card className="p-6 max-w-4xl mx-auto">
      <div className="flex justify-between items-center mb-6">
        <div className="flex items-center space-x-4">
          <button_1.Button variant="outline" onClick={() => navigate('/')} className="flex items-center">
            <lucide_react_1.CameraIcon className="mr-2 h-4 w-4"/>
            Back to Camera
          </button_1.Button>
          <h1 className="text-2xl font-bold">Image Results</h1>
        </div>
        <button_1.Button onClick={fetchImages} disabled={loading}>
          {loading ? 'Refreshing...' : 'Refresh'}
        </button_1.Button>
      </div>

      <table_1.Table className="w-full">
        <table_1.TableCaption>List of captured images and their processing status</table_1.TableCaption>
        <table_1.TableHeader>
          <table_1.TableRow>
            <table_1.TableHead className="w-[150px]">Title</table_1.TableHead>
            <table_1.TableHead className="w-[150px]">Location</table_1.TableHead>
            <table_1.TableHead className="w-[100px]">Status</table_1.TableHead>
            <table_1.TableHead className="w-[150px]">Date</table_1.TableHead>
            <table_1.TableHead className="w-[100px]">Image</table_1.TableHead>
            <table_1.TableHead className="min-w-[200px]">Description</table_1.TableHead>
          </table_1.TableRow>
        </table_1.TableHeader>
        <table_1.TableBody>
          {images.map((image) => (<table_1.TableRow key={image.id}>
              <table_1.TableCell>{image.title}</table_1.TableCell>
              <table_1.TableCell>{image.location}</table_1.TableCell>
              <table_1.TableCell>{image.status}</table_1.TableCell>
              <table_1.TableCell>{new Date(image.created_at).toLocaleString()}</table_1.TableCell>
              <table_1.TableCell>
                {image.image_url && (<a href={image.image_url} target="_blank" rel="noopener noreferrer" className="text-blue-500 hover:underline">
                    View Image
                  </a>)}
              </table_1.TableCell>
              <table_1.TableCell className="max-w-[300px] whitespace-normal">
                <div className="line-clamp-3">
                  {image.description}
                </div>
              </table_1.TableCell>
            </table_1.TableRow>))}
        </table_1.TableBody>
      </table_1.Table>
    </card_1.Card>);
}
