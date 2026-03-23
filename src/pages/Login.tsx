import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { useNavigate, Link } from 'react-router-dom';
import { Input } from '../components/Input';
import { Button } from '../components/Button';
import { Eye, Mail } from 'lucide-react';
import { login } from '../services/auth';
import { useAuthStore } from '../store/useAuthStore';

const loginSchema = z.object({
  email: z.string().email('E-mail inválido').nonempty('O e-mail é obrigatório'),
  password: z.string().min(4, 'A senha deve ter pelo menos 4 caracteres').nonempty('A senha é obrigatória'),
});

type LoginFormInputs = z.infer<typeof loginSchema>;

const Login = () => {
  const navigate = useNavigate();
  const setAuthStore = useAuthStore((state) => state.setAuth);
  const [apiError, setApiError] = useState('');

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<LoginFormInputs>({
    resolver: zodResolver(loginSchema),
  });

  const onSubmit = async (data: LoginFormInputs) => {
    try {
      setApiError('');
      const response = await login(data);
      if (response && response.token) {
        // Assuming API returns { token: "...", user: { id: "..." } } or similar
        // Let's safe-guard the userId if we don't have it explicitly
        setAuthStore(response.token, response.user?.id || 'unknown');
        navigate('/');
      } else {
        setApiError('Não foi possível obter o token de acesso.');
      }
    } catch (error: unknown) {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const err = error as any;
      setApiError(err.response?.data?.message || 'Credenciais inválidas. Tente novamente.');
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-white dark:bg-gradient-to-t dark:from-[#0F172B] dark:to-[#070B14] font-sans p-4 transition-colors">
      <div className="w-full max-w-[480px] ">
        <div className="text-center mb-6 ">
          <h1 className="text-[40px] font-bold text-bluet-500 leading-[120%] dark:text-[#ffffff] mb-14">Mini Twitter</h1>

          <div className="flex border-b border-customZinc-550 dark:border-gray-700 mb-8">
            <Link to="/login" className="flex-1 pb-3 text-center border-b-2 border-bluet-500 text-bluet-500 font-bold leading-6 dark:text-[#ffffff]">
              Login
            </Link>
            <Link to="/register" className="flex-1 pb-3 text-center border-b-2 border-transparent text-customZinc-500 dark:text-customZinc-200 font-bold leading-6 hover:text-gray-600 dark:hover:text-gray-300">
              Cadastrar
            </Link>
          </div>

          <div className="text-left mt-6 mb-8">
            <h2 className="text-[30px] leading-9 font-bold text-bluet-500 dark:text-[#ffffff] mb-1">Olá, de novo!</h2>
            <p className="text-normal leading-6 text-customZinc-500 dark:text-customZinc-200">Por favor, insira os seus dados para fazer login.</p>
          </div>
        </div>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
          <Input
            label="E-mail"
            placeholder="Insira o seu e-mail"
            type="email"
            icon={<Mail className="w-5 h-5" />}
            error={errors.email?.message}
            {...register('email')}
          />
          <Input
            label="Senha"
            placeholder="Insira a sua senha"
            type="password"
            icon={<Eye className="w-5 h-5" />}
            error={errors.password?.message}
            autoComplete="new-password"
            {...register('password')}
          />

          {apiError && <p className="text-sm text-brandRed text-center">{apiError}</p>}

          <Button type="submit" isLoading={isSubmitting} className="mt-4 hover:cursor-pointer dark:!bg-bluet-500" style={{ color: 'white' }}>
            Continuar
          </Button>
        </form>

        <p className="text-xs text-center text-bluet-950 dark:text-customZinc-200 mt-6 px-4 leading-tight">
          Ao clicar em continuar, você concorda com nossos <br />
          <a href="#" className="font-semibold hover:underline">Termos de Serviço</a> e <a href="#" className="font-semibold hover:underline">Política de Privacidade</a>.
        </p>
      </div>
    </div>
  );
};

export default Login;
