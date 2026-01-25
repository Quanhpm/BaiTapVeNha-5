// User - Edit Post (Edit existing post with image upload)
import { useState, useEffect } from 'react';
import { useForm, type SubmitHandler } from 'react-hook-form';
import { useNavigate, useParams } from 'react-router-dom';
import { Loader2 } from 'lucide-react';
import { uploadApi } from '../../api/uploadApi';
import { postApi } from '../../api/postApi';
import { slugify } from '../../utils/helpers';
import type { Post } from '../../interfaces/types';
import ImageUploader from '../../components/ui/ImageUploader';

interface EditPostForm {
  title: string;
  description: string;
  urlTag: string;
}

const EditPost = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [post, setPost] = useState<Post | null>(null);
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [currentImageUrl, setCurrentImageUrl] = useState<string>('');
  const [uploading, setUploading] = useState(false);
  const [loading, setLoading] = useState(true);

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<EditPostForm>();

  useEffect(() => {
    if (id) {
      fetchPost(id);
    }
  }, [id]);

  const fetchPost = async (postId: string) => {
    try {
      setLoading(true);
      const posts = await postApi.getAll();
      const foundPost = posts.find((p) => p.id === postId);
      if (foundPost) {
        setPost(foundPost);
        setCurrentImageUrl(foundPost.imageUrl);
        reset({
          title: foundPost.title,
          description: foundPost.description,
          urlTag: foundPost.urlTag || '',
        });
      }
    } catch (error) {
      console.error('Error fetching post:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleImageChange = (file: File | null) => {
    setImageFile(file);
  };

  const onSubmit: SubmitHandler<EditPostForm> = async (data) => {
    if (!post) return;

    try {
      setUploading(true);

      // If new image uploaded, upload to Cloudinary
      let imageUrl = currentImageUrl;
      if (imageFile) {
        imageUrl = await uploadApi.uploadImage(imageFile);
      }

      // Update post data
      const updateData: Partial<Post> = {
        title: data.title,
        description: data.description,
        imageUrl: imageUrl,
        urlTag: slugify(data.urlTag || data.title),
      };

      // Call API to update post
      await postApi.update(post.id, updateData);

      alert('Post updated successfully!');
      navigate('/dashboard/posts');
    } catch (error) {
      console.error('Error updating post:', error);
      alert('An error occurred while updating the post. Please try again.');
    } finally {
      setUploading(false);
    }
  };

  const handleCancel = () => {
    navigate('/dashboard/posts');
  };

  const isLoading = uploading || isSubmitting;

  if (loading) {
    return (
      <div className="flex items-center justify-center h-full">
        <Loader2 className="animate-spin h-12 w-12 text-primary" />
      </div>
    );
  }

  if (!post) {
    return (
      <div className="flex flex-col items-center justify-center h-full">
        <p className="text-gray-500 text-lg mb-4">Post not found</p>
        <button
          onClick={handleCancel}
          className="px-4 py-2 bg-primary text-white rounded-lg hover:bg-primary-hover transition-colors"
        >
          Back to Posts
        </button>
      </div>
    );
  }

  return (
    <div className="flex-1 flex flex-col h-full overflow-hidden">
      <main className="flex-1 overflow-y-auto p-8">
        <div className="max-w-3xl mx-auto bg-white rounded-xl shadow-lg border border-gray-200 overflow-hidden">
          <form onSubmit={handleSubmit(onSubmit)}>
            {/* Form Content */}
            <div className="p-8 space-y-6">
              {/* Header */}
              <div>
                <h2 className="text-2xl font-bold text-gray-900 mb-2">
                  Edit Post
                </h2>
                <p className="text-sm text-gray-500">
                  Update the information below to edit your post.
                </p>
              </div>

              {/* Title Input */}
              <div className="space-y-2">
                <label
                  htmlFor="post-title"
                  className="block text-sm font-medium text-gray-700"
                >
                  Title
                </label>
                <input
                  {...register('title', {
                    required: 'Title is required',
                    minLength: {
                      value: 5,
                      message: 'Title must be at least 5 characters',
                    },
                  })}
                  type="text"
                  id="post-title"
                  placeholder="Enter post title"
                  disabled={isLoading}
                  className={`
                    w-full px-4 py-3 rounded-lg border 
                    ${errors.title ? 'border-error' : 'border-gray-200'}
                    bg-gray-50 
                    text-gray-900 
                    placeholder-gray-400 
                    focus:ring-2 focus:ring-primary focus:border-transparent 
                    outline-none transition-shadow
                    disabled:opacity-50 disabled:cursor-not-allowed
                  `}
                />
                {errors.title && (
                  <p className="text-sm text-error">{errors.title.message}</p>
                )}
              </div>

              {/* Description Textarea */}
              <div className="space-y-2">
                <label
                  htmlFor="post-description"
                  className="block text-sm font-medium text-gray-700"
                >
                  Description
                </label>
                <textarea
                  {...register('description', {
                    required: 'Description is required',
                    minLength: {
                      value: 10,
                      message: 'Description must be at least 10 characters',
                    },
                  })}
                  id="post-description"
                  placeholder="Write your post description..."
                  rows={6}
                  disabled={isLoading}
                  className={`
                    w-full px-4 py-3 rounded-lg border 
                    ${errors.description ? 'border-error' : 'border-gray-200'}
                    bg-gray-50 
                    text-gray-900 
                    placeholder-gray-400 
                    focus:ring-2 focus:ring-primary focus:border-transparent 
                    outline-none transition-shadow resize-none
                    disabled:opacity-50 disabled:cursor-not-allowed
                  `}
                />
                {errors.description && (
                  <p className="text-sm text-error">{errors.description.message}</p>
                )}
              </div>

              {/* URL Tag Input (SEO) */}
              <div className="space-y-2">
                <label
                  htmlFor="post-urlTag"
                  className="block text-sm font-medium text-gray-700"
                >
                  URL Tag (SEO)
                </label>
                <input
                  {...register('urlTag', {
                    pattern: {
                      value: /^[a-z0-9]+(?:-[a-z0-9]+)*$/,
                      message: 'URL tag must be lowercase letters, numbers, and hyphens only (e.g., my-new-post)',
                    },
                  })}
                  type="text"
                  id="post-urlTag"
                  placeholder="e.g., my-new-post (leave empty to auto-generate from title)"
                  disabled={isLoading}
                  className={`
                    w-full px-4 py-3 rounded-lg border 
                    ${errors.urlTag ? 'border-error' : 'border-gray-200'}
                    bg-gray-50 
                    text-gray-900 
                    placeholder-gray-400 
                    focus:ring-2 focus:ring-primary focus:border-transparent 
                    outline-none transition-shadow
                    disabled:opacity-50 disabled:cursor-not-allowed
                  `}
                />
                {errors.urlTag && (
                  <p className="text-sm text-error">{errors.urlTag.message}</p>
                )}
                <p className="text-xs text-gray-400">
                  This will be used in the post URL. Leave empty to auto-generate from title.
                </p>
              </div>

              {/* Image Uploader */}
              <ImageUploader
                onImageChange={handleImageChange}
                previewUrl={currentImageUrl}
                disabled={isLoading}
              />
            </div>

            {/* Footer Actions */}
            <div className="px-8 py-5 bg-gray-50 border-t border-gray-200 flex items-center justify-end space-x-3">
              <button
                type="button"
                onClick={handleCancel}
                disabled={isLoading}
                className="px-6 py-2.5 rounded-lg border border-gray-200 text-gray-700 bg-white hover:bg-gray-50 font-medium transition-colors focus:outline-none focus:ring-2 focus:ring-gray-200 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={isLoading}
                className="px-6 py-2.5 rounded-lg bg-primary hover:bg-primary-hover text-white font-medium shadow-md shadow-primary/20 transition-all transform active:scale-95 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary disabled:opacity-50 disabled:cursor-not-allowed flex items-center space-x-2"
              >
                {isLoading && <Loader2 className="animate-spin h-4 w-4" />}
                <span>{isLoading ? 'Saving...' : 'Save Changes'}</span>
              </button>
            </div>
          </form>
        </div>
      </main>
    </div>
  );
};

export default EditPost;
