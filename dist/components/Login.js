"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Login = Login;
const react_1 = require("react");
const react_router_dom_1 = require("react-router-dom");
const button_1 = require("@/components/ui/button");
const input_1 = require("@/components/ui/input");
const label_1 = require("@/components/ui/label");
const card_1 = require("@/components/ui/card");
const supabase_1 = require("@/lib/supabase");
function Login() {
    const [email, setEmail] = (0, react_1.useState)('');
    const [password, setPassword] = (0, react_1.useState)('');
    const [error, setError] = (0, react_1.useState)('');
    const [isLoading, setIsLoading] = (0, react_1.useState)(false);
    const navigate = (0, react_router_dom_1.useNavigate)();
    const handleLogin = async () => {
        setError('');
        setIsLoading(true);
        try {
            const { data, error } = await supabase_1.supabase.auth.signInWithPassword({
                email,
                password,
            });
            if (error)
                throw error;
            if (data.user) {
                navigate('/home');
            }
        }
        catch (err) {
            setError('Email ou senha inválidos');
            console.error(err);
        }
        finally {
            setIsLoading(false);
        }
    };
    const handleSignUp = async () => {
        setError('');
        setIsLoading(true);
        try {
            const { data, error } = await supabase_1.supabase.auth.signUp({
                email,
                password,
            });
            if (error)
                throw error;
            if (data.user) {
                setError('Verifique seu email para confirmar o cadastro');
            }
        }
        catch (err) {
            setError('Erro ao criar conta');
            console.error(err);
        }
        finally {
            setIsLoading(false);
        }
    };
    return (<card_1.Card className="p-6 max-w-md mx-auto mt-20">
      <div className="space-y-4">
        <h1 className="text-2xl font-bold text-center">Login</h1>
        
        <div className="space-y-2">
          <label_1.Label htmlFor="email">Email</label_1.Label>
          <input_1.Input id="email" type="email" value={email} onChange={(e) => setEmail(e.target.value)} placeholder="Digite seu email"/>
        </div>

        <div className="space-y-2">
          <label_1.Label htmlFor="password">Senha</label_1.Label>
          <input_1.Input id="password" type="password" value={password} onChange={(e) => setPassword(e.target.value)} placeholder="Digite sua senha"/>
        </div>

        {error && <p className="text-red-500 text-sm">{error}</p>}

        <button_1.Button onClick={handleLogin} className="w-full" disabled={isLoading}>
          {isLoading ? 'Entrando...' : 'Entrar'}
        </button_1.Button>

        <button_1.Button variant="outline" onClick={handleSignUp} className="w-full" disabled={isLoading}>
          {isLoading ? 'Criando conta...' : 'Criar nova conta'}
        </button_1.Button>

        <p className="text-sm text-center text-muted-foreground">
          Esqueceu sua senha?{' '}
          <react_router_dom_1.Link to="/reset-password" className="text-primary hover:underline">
            Redefinir senha
          </react_router_dom_1.Link>
        </p>
      </div>
    </card_1.Card>);
}
