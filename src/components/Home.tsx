import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { useNavigate } from 'react-router-dom';

export function Home() {
  const navigate = useNavigate();

  return (
    <Card className="p-6 max-w-2xl mx-auto">
      <div className="space-y-4">
        <h1 className="text-2xl font-bold text-center">Selecione o tipo de captura</h1>
        
        <div className="flex flex-col space-y-4">
          <Button 
            onClick={() => navigate('/camera')}
            className="w-full py-8 text-lg"
          >
            Hidrômetro
          </Button>
          
          <Button 
            onClick={() => navigate('/facade')}
            className="w-full py-8 text-lg"
          >
            Fachadas das Casas
          </Button>
        </div>
      </div>
    </Card>
  );
}
