import { useState, useEffect } from 'react';
import { useInfiniteQuery } from '@tanstack/react-query';
import { useInView } from 'react-intersection-observer';
import { getPosts } from '../services/posts';
import type { Post } from '../services/posts';
import { Header } from '../components/Header';
import { CreatePostCard } from '../components/CreatePostCard';
import { PostCard } from '../components/PostCard';

const Timeline = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const { ref, inView } = useInView();

  const {
    data,
    isLoading,
    isError,
    error,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage
  } = useInfiniteQuery({
    queryKey: ['posts', searchTerm],
    queryFn: ({ pageParam = 1 }) => getPosts({ page: pageParam, search: searchTerm }),
    getNextPageParam: (lastPage, allPages) => {
      const items = Array.isArray(lastPage) ? lastPage : lastPage?.items || lastPage?.posts || lastPage?.data || [];
      // Assuming a page has items, if it returns empty, it's the end. 
      return items.length > 0 ? allPages.length + 1 : undefined;
    },
    initialPageParam: 1,
  });

  useEffect(() => {
    if (inView && hasNextPage) {
      fetchNextPage();
    }
  }, [inView, hasNextPage, fetchNextPage]);

  const displayPosts = data?.pages.flatMap(page => {
    const items = Array.isArray(page) ? page : page?.items || page?.posts || page?.data || [];
    return items;
  }) || [];

  const handleSearch = (term: string) => {
    setSearchTerm(term);
  };

  return (
    <div className="min-h-screen bg-[#FFFFFF] dark:bg-gradient-to-t dark:from-[#0F172B] dark:to-[#070B14] flex flex-col items-center transition-colors">
      <Header onSearch={handleSearch} />

      <main className="w-full max-w-2xl px-4 py-8 flex-1">
        <CreatePostCard />

        <div className="space-y-4">
          {isLoading && (
            <div className="flex justify-center p-8">
              <span className="w-8 h-8 border-4 border-bluet-500 border-t-transparent rounded-full animate-spin block"></span>
            </div>
          )}

          {isError && (
            <div className="bg-brandRed-50 text-brandRed-600 p-4 rounded-xl text-center">
              Erro ao carregar posts.{' '}
              {error instanceof Error ? error.message : ''}
            </div>
          )}

          {!isLoading && !isError && displayPosts?.length === 0 && (
            <div className="text-center text-gray-500 dark:text-gray-400 p-8">
              Nenhum post encontrado.
            </div>
          )}

          {!isLoading && displayPosts && displayPosts.map((post: Post) => (
            <PostCard key={post.id} post={post} />
          ))}
        </div>

        {/* Load More Pagination - Infinite Scroll Trigger */}
        <div ref={ref} className="flex justify-center mt-8 pb-12 h-10">
          {isFetchingNextPage && (
            <span className="w-6 h-6 border-2 border-bluet-500 border-t-transparent rounded-full animate-spin block"></span>
          )}
          {!hasNextPage && displayPosts.length > 0 && (
            <span className="text-gray-500 dark:text-gray-400 text-sm">Você chegou ao fim!</span>
          )}
        </div>
      </main>
    </div>
  );
};

export default Timeline;
