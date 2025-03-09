"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Home = Home;
const button_1 = require("@/components/ui/button");
const card_1 = require("@/components/ui/card");
const react_router_dom_1 = require("react-router-dom");
function Home() {
    const navigate = (0, react_router_dom_1.useNavigate)();
    return (<card_1.Card className="p-6 max-w-2xl mx-auto">
      <div className="space-y-4">
        <h1 className="text-2xl font-bold text-center">Selecione o tipo de captura</h1>
        
        <div className="flex flex-col space-y-4">
          <button_1.Button onClick={() => navigate('/camera')} className="w-full py-8 text-lg">
            Hidrômetro
          </button_1.Button>
          
          <button_1.Button onClick={() => navigate('/facade')} className="w-full py-8 text-lg">
            Fachadas das Casas
          </button_1.Button>
        </div>
      </div>
    </card_1.Card>);
}
