import { createClient } from '@supabase/supabase-js';

import 'dotenv/config';

const supabaseUrl = process.env.VITE_SUPABASE_URL;
const supabaseKey = process.env.VITE_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseKey) {
  throw new Error('Variáveis de ambiente VITE_SUPABASE_URL e VITE_SUPABASE_ANON_KEY são necessárias');
}

const supabase = createClient(supabaseUrl, supabaseKey);

export async function createTestUsers() {
    const users = [
        { matricula: '873562', email: 'user1@teste.com', password: 'password123' },
        { matricula: '773651', email: 'user2@teste.com', password: 'password123' }
    ];

    for (const user of users) {
        const { data, error } = await supabase.auth.signUp({
            email: user.email,
            password: user.password,
        });

        if (error) {
            console.error(`Error creating user with matricula ${user.matricula}:`, error.message);
        } else {
            if (data.user) {
                console.log(`User created with matricula ${user.matricula}:`, data.user);
                
                // Insere o usuário na tabela users com o user_id da autenticação
                const { error: dbError } = await supabase
                    .from('users')
                    .insert({
                        id: data.user.id,
                        registration_number: user.matricula
                    });

                if (dbError) {
                    console.error(`Error inserting user ${user.matricula} into users table:`, dbError.message);
                } else {
                    console.log(`User ${user.matricula} successfully inserted into users table`);
                }
            } else {
                console.error(`User data is null for matricula ${user.matricula}`);
            }
        }
        
        // Adiciona delay de 30 segundos entre cada criação
        await new Promise(resolve => setTimeout(resolve, 30000));
    }
}

// Para executar a criação de usuários de teste
createTestUsers();
