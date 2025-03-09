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
Object.defineProperty(exports, "__esModule", { value: true });
exports.QRcode = QRcode;
const react_1 = __importStar(require("react"));
const react_qr_reader_1 = require("react-qr-reader");
const card_1 = require("@/components/ui/card");
const use_toast_1 = require("@/hooks/use-toast");
const react_router_dom_1 = require("react-router-dom");
const supabase_1 = require("@/lib/supabase");
function QRcode() {
    const [data, setData] = (0, react_1.useState)(null);
    const [isLoading, setIsLoading] = (0, react_1.useState)(false);
    const [error, setError] = (0, react_1.useState)(null);
    const { toast } = (0, use_toast_1.useToast)();
    const navigate = (0, react_router_dom_1.useNavigate)();
    const handleScan = async (result) => {
        if (!result)
            return;
        try {
            // Parse QR code data (assuming format: title|location|user_id)
            const [title, location, user_id] = result.split('|');
            if (!title || !location || !user_id) {
                throw new Error('Invalid QR code format');
            }
            setIsLoading(true);
            setError(null);
            // Save to Supabase
            const { error } = await supabase_1.supabase
                .from('image')
                .insert([
                {
                    title,
                    location,
                    user_id
                }
            ]);
            if (error)
                throw error;
            toast({
                title: "Success!",
                description: "QR code data saved successfully",
                duration: 5000,
            });
            navigate('/results');
        }
        catch (err) {
            const errorMessage = err instanceof Error ? err.message : 'Failed to process QR code';
            setError(errorMessage);
            toast({
                title: "Error",
                description: errorMessage,
                variant: "destructive",
                duration: 5000,
            });
        }
        finally {
            setIsLoading(false);
        }
    };
    return (<card_1.Card className="p-6 max-w-2xl mx-auto">
      <div className="space-y-4">
        <div className="relative rounded-lg overflow-hidden bg-black">
          <react_qr_reader_1.QrReader constraints={{ facingMode: 'environment' }} onResult={(result) => {
            if (result) {
                handleScan(result.getText());
            }
        }} scanDelay={500} className="w-full"/>
        </div>

        {data && (<div className="space-y-4">
            <div className="text-center">
              <p className="text-sm text-gray-500">Scanned Data:</p>
              <p className="font-medium">{data}</p>
            </div>
          </div>)}

        {error && (<div className="text-red-500 text-center p-2 bg-red-50 rounded-lg">
            {error}
          </div>)}
      </div>
    </card_1.Card>);
}
