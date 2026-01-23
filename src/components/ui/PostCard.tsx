import { Pencil, Trash2 } from 'lucide-react';
import type { Post, User } from '../../interfaces/types';
import { formatDate } from '../../utils/helpers';

interface PostCardProps {
  post: Post;
  author?: User;
  onClick?: (post: Post) => void;
  onEdit?: (post: Post) => void;
  onDelete?: (post: Post) => void;
}

const PostCard = ({ post, author, onClick, onEdit, onDelete }: PostCardProps) => {
  return (
    <article 
      className="bg-white rounded-xl shadow-sm overflow-hidden flex flex-col hover:shadow-md transition-shadow cursor-pointer"
      onClick={() => onClick?.(post)}
    >
      {/* Image */}
      <div className="h-48 overflow-hidden">
        <img
          alt={post.title}
          className="w-full h-full object-cover"
          src={post.imageUrl || 'https://via.placeholder.com/400x300?text=No+Image'}
        />
      </div>

      {/* Content */}
      <div className="p-4 flex-1 flex flex-col">
        <h3 className="font-semibold text-lg text-gray-900 mb-2 leading-tight line-clamp-2">
          {post.title}
        </h3>
        <p className="text-sm text-gray-600 mb-4 flex-1 line-clamp-3">
          {post.description}
        </p>

        {/* Card Footer */}
        <div className="flex items-center justify-between mt-auto pt-4 border-t border-gray-100">
          <div className="flex items-center">
            <img
              alt={author?.name || 'Author'}
              className="h-8 w-8 rounded-full object-cover mr-2 bg-gray-200"
              src={`https://ui-avatars.com/api/?name=${encodeURIComponent(author?.name || 'User')}&background=random`}
            />
            <div>
              <p className="text-xs font-medium text-gray-900">{author?.name || 'Unknown'}</p>
              <p className="text-xs text-gray-500">{formatDate(post.createDate)}</p>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex space-x-3 text-gray-400">
            {onEdit && (
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  onEdit(post);
                }}
                className="hover:text-primary transition-colors"
                title="Edit"
              >
                <Pencil className="w-4 h-4" />
              </button>
            )}
            {onDelete && (
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  onDelete(post);
                }}
                className="hover:text-error transition-colors"
                title="Delete"
              >
                <Trash2 className="w-4 h-4" />
              </button>
            )}
          </div>
        </div>
      </div>
    </article>
  );
};

export default PostCard;
