import { Heart, Edit, Trash2 } from 'lucide-react';
import { useState } from 'react';
import { likePost, deletePost, updatePost } from '../services/posts';
import type { Post } from '../services/posts';
import { useAuthStore } from '../store/useAuthStore';
import { useMutation, useQueryClient } from '@tanstack/react-query';

interface PostCardProps {
  post: Post;
}

export const PostCard: React.FC<PostCardProps> = ({ post }) => {
  const token = useAuthStore((state) => state.token);
  const userId = useAuthStore((state) => state.userId);
  const isAuthenticated = !!token;
  const isOwner = userId === post.authorId;
  const queryClient = useQueryClient();

  const [isEditing, setIsEditing] = useState(false);
  const [editTitle, setEditTitle] = useState(post.title || '');
  const [editContent, setEditContent] = useState(post.content || '');

  const editMutation = useMutation({
    mutationFn: (data: { id: string; title: string; content: string; image?: string }) =>
      updatePost(data.id, { title: data.title, content: data.content, image: data.image }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['posts'] });
      setIsEditing(false);
    },
  });

  const handleEditClick = () => {
    setEditTitle(post.title || '');
    setEditContent(post.content || '');
    setIsEditing(true);
  };

  const handleSaveEdit = () => {
    if (!editTitle || editTitle.trim().length < 3) {
      alert("O título deve ter no mínimo 3 caracteres");
      return;
    }
    if (!editContent || editContent.trim().length < 1) {
      alert("O conteúdo é obrigatório");
      return;
    }
    
    // Create the payload without undefined or null values
    const payload: { id: string; title: string; content: string; image?: string } = {
      id: post.id,
      title: editTitle,
      content: editContent,
    };
    
    if (post.image) {
      payload.image = post.image;
    }
    
    editMutation.mutate(payload);
  };

  const likeMutation = useMutation({
    mutationFn: (id: string) => likePost(id),
    onSuccess: () => {
      // Optimistic upate or invalidate
      queryClient.invalidateQueries({ queryKey: ['posts'] });
    },
  });

  const deleteMutation = useMutation({
    mutationFn: (id: string) => deletePost(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['posts'] });
    },
  });

  const handleLike = () => {
    if (!isAuthenticated) return;
    likeMutation.mutate(post.id);
  };

  const handleDelete = () => {
    if (confirm('Tem certeza que deseja deletar este post?')) {
      deleteMutation.mutate(post.id);
    }
  };

  const formatDate = (dateStr: string) => {
    const d = new Date(dateStr);
    return isNaN(d.getTime()) ? dateStr : new Intl.DateTimeFormat('pt-BR', { day: '2-digit', month: '2-digit', year: 'numeric' }).format(d);
  };

  return (
    <div className="bg-white dark:bg-bluet-950 rounded-xl shadow-sm border border-customZinc-550 dark:border-customZinc-550 p-5 mb-4 hover:bg-gray-50/50 transition-colors">
      <div className="flex justify-between items-start mb-2">
        <div className="flex items-center gap-2 text-sm">
          <span className="font-bold leading-6 text-bluet-600 dark:text-[#ffffff]">{post?.authorName || 'Usuário Desconhecido'}</span>

          <span className="text-customZinc-500 text-sm dark:text-customZinc-500">·</span>
          <span className="text-customZinc-500 text-sm dark:text-customZinc-500">{formatDate(post?.createdAt || new Date().toISOString())}</span>
        </div>

        {isOwner && (
          <div className="flex gap-2">
            <button onClick={handleEditClick} className="text-bluet-600 hover:text-bluet-500 dark:text-[#ffffff]  transition-colors p-1 hover:cursor-pointer" title="Editar">
              <Edit className="w-4 h-4" />
            </button>
            <button onClick={handleDelete} className="text-bluet-600 hover:text-brandRed dark:text-[#ffffff] transition-colors p-1 hover:cursor-pointer" title="Deletar">
              <Trash2 className="w-4 h-4" />
            </button>
          </div>
        )}
      </div>

      <div className="mb-3">
        {post.title && <h3 className="font-bold text-bluet-600 dark:text-[#ffffff] text-lg mb-1">{post.title}</h3>}
        <p className="text-bluet-600 dark:text-[#CBD5E1] whitespace-pre-wrap">{post.content}</p>
      </div>

      {post.image && (
        <div className="mb-2 rounded-xl overflow-hidden border border-gray-100 bg-gray-100">
          <img src={post.image} alt="Imagens do post" className="w-full h-auto object-cover max-h-[500px]" />
        </div>
      )}

      <div className="flex items-center text-gray-500">
        <button
          onClick={handleLike}
          disabled={likeMutation.isPending || !isAuthenticated}
          className={`flex items-center gap-1.5 transition-colors group hover:cursor-pointer text-brandRed hover:text-brandRed-hover ${post.hasLiked ? 'text-brandRed' : 'hover:text-brandRed-hover '
            }`}
        >
          <div className={`p-1.5 rounded-full group-hover:customZinc-550 text-brandRed hover:text-brandRed-hover hover:cursor-pointer`}>
            <Heart className={`w-5 h-5 ${post.hasLiked ? 'fill-current' : ''}`} />
          </div>
          <span className="text-sm font-medium">{post.likesCount}</span>
        </button>
      </div>

      {isEditing && (
        <div className="fixed inset-0 bg-[#00000070] flex items-center justify-center z-50 p-4">
          <div className="bg-[#ffffff] dark:bg-bluet-950 p-6 rounded-xl shadow-lg w-full max-w-md">
            <h2 className="text-xl font-bold mb-4 text-bluet-600 dark:text-[#ffffff]">Editar Post</h2>
            <input
              value={editTitle}
              onChange={(e) => setEditTitle(e.target.value)}
              className="w-full mb-3 p-2 border border-customZinc-550 rounded-md bg-transparent dark:text-white"
              placeholder="Título"
            />
            <textarea
              value={editContent}
              onChange={(e) => setEditContent(e.target.value)}
              className="w-full mb-4 p-2 border border-customZinc-550 rounded-md min-h-[100px] bg-transparent dark:text-white resize-none"
              placeholder="Conteúdo"
            />
            <div className="flex justify-end gap-2">
              <button
                onClick={() => setIsEditing(false)}
                className="px-4 py-2 text-customZinc-900 hover:text-brandRed hover:bg-gray-100 dark:hover:bg-bluet-900 rounded-md transition-colors hover:cursor-pointer"
              >
                Cancelar
              </button>
              <button
                onClick={handleSaveEdit}
                disabled={editMutation.isPending}
                className="px-4 py-2 bg-bluet-500 text-[#ffffff]  rounded-md hover:bg-bluet-700 transition-colors disabled:opacity-50 hover:cursor-pointer"
              >
                {editMutation.isPending ? 'Salvando...' : 'Salvar'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
