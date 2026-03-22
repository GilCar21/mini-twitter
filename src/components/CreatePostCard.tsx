import { useState } from 'react';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { createPost } from '../services/posts';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Image as ImageIcon } from 'lucide-react';
import { Button } from './Button';
import { useAuthStore } from '../store/useAuthStore';

const createPostSchema = z.object({
  title: z.string().min(3, 'Mínimo de 3 caracteres').nonempty('O título é obrigatório'),
  content: z.string().min(1, 'Conteúdo obrigatório').nonempty('O conteúdo é obrigatório'),
  image: z.string().url('URL inválida').optional().or(z.literal('')),
});

type CreatePostInputs = z.infer<typeof createPostSchema>;

export const CreatePostCard = () => {
  const token = useAuthStore((state) => state.token);
  const isAuthenticated = !!token;
  const queryClient = useQueryClient();
  const [showImageInput, setShowImageInput] = useState(false);

  const { register, handleSubmit, reset, formState: { errors } } = useForm<CreatePostInputs>({
    resolver: zodResolver(createPostSchema),
  });

  const mutation = useMutation({
    mutationFn: createPost,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['posts'] });
      reset();
      setShowImageInput(false);
    },
  });

  if (!isAuthenticated) return null;

  const onSubmit = (data: CreatePostInputs) => {
    mutation.mutate({
      ...data,
      image: data.image || undefined,
    });
  };

  return (
    <div className="bg-white dark:bg-bluet-950 rounded-xl shadow-sm border border-customZinc-550 dark:border-customZinc-550 p-4 mb-6 relative transition-colors">
      <form onSubmit={handleSubmit(onSubmit)}>
        <input
          {...register('title')}
          placeholder="Título do post"
          className="w-full text-lg font-bold outline-none mb-1 placeholder-customZinc-500 dark:placeholder-customZinc-500 bg-transparent text-bluet-600 dark:text-customWhite-100"
        />
        {errors.title && <span className="text-xs text-brandRed-500 mb-2 block">{errors.title.message}</span>}

        <textarea
          {...register('content')}
          placeholder="E aí, o que está rolando?"
          className="w-full resize-none outline-none mb-1 placeholder-customZinc-500 dark:placeholder-customZinc-500 bg-transparent text-bluet-600 dark:text-customWhite-100 "
          rows={3}
        />
        {errors.content && <span className="text-xs text-brandRed-500 mb-2 block">{errors.content.message}</span>}

        {showImageInput && (
          <div className="mb-4">
            <input
              {...register('image')}
              placeholder="Cole a URL da imagem aqui"
              className="w-full px-3 py-2 border border-gray-200 dark:border-gray-700 rounded-md text-sm outline-none focus:border-bluet-500 bg-transparent dark:text-gray-100"
            />
            {errors.image && <span className="text-xs text-brandRed-500 mt-1 block">{errors.image.message}</span>}
          </div>
        )}

        <div className="flex justify-between items-center border-t border-customZinc-550 dark:border-gray-700 pt-3">
          <button
            type="button"
            onClick={() => setShowImageInput(!showImageInput)}
            className={`p-2 rounded-full transition-colors hover:cursor-pointer ${showImageInput ? 'bg-bluet-50 text-bluet-500  dark:bg-bluet-500' : 'text-bluet-500 hover:bg-bluet-600 dark:hover:bg-bluet-600'}`}
          >
            <ImageIcon className="w-8 h-8" />
          </button>
          <Button
            type="submit"
            isLoading={mutation.isPending}
            className="py-2 px-6 text-sm rounded-full max-w-fit hover:cursor-pointer bg-bluet-500 dark:!bg-bluet-500 hover:!bg-bluet-600 dark:hover:bg-bluet-600 text-[#FFFFFF]"
          >
            Postar
          </Button>
        </div>
      </form>
    </div>
  );
};
