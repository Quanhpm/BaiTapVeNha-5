// Reusable Image Uploader component with drag & drop
import { useState, useRef, useCallback } from 'react';
import { CloudUpload, X } from 'lucide-react';

interface ImageUploaderProps {
    onImageChange: (file: File | null) => void;
    previewUrl?: string;
    disabled?: boolean;
    error?: string;
}

const ImageUploader = ({
    onImageChange,
    previewUrl,
    disabled = false,
    error,
}: ImageUploaderProps) => {
    const [isDragging, setIsDragging] = useState(false);
    const [preview, setPreview] = useState<string | null>(previewUrl || null);
    const inputRef = useRef<HTMLInputElement>(null);

    const handleFile = useCallback(
        (file: File | null) => {
            if (file) {
                // Validate file type
                if (!file.type.startsWith('image/')) {
                    alert('Please upload an image file');
                    return;
                }

                // Create preview
                const reader = new FileReader();
                reader.onloadend = () => {
                    setPreview(reader.result as string);
                };
                reader.readAsDataURL(file);
            } else {
                setPreview(null);
            }
            onImageChange(file);
        },
        [onImageChange]
    );

    const handleDragOver = (e: React.DragEvent) => {
        e.preventDefault();
        if (!disabled) setIsDragging(true);
    };

    const handleDragLeave = (e: React.DragEvent) => {
        e.preventDefault();
        setIsDragging(false);
    };

    const handleDrop = (e: React.DragEvent) => {
        e.preventDefault();
        setIsDragging(false);
        if (disabled) return;

        const files = e.dataTransfer.files;
        if (files.length > 0) {
            handleFile(files[0]);
        }
    };

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const files = e.target.files;
        if (files && files.length > 0) {
            handleFile(files[0]);
        }
    };

    const handleRemove = (e: React.MouseEvent) => {
        e.stopPropagation();
        setPreview(null);
        onImageChange(null);
        if (inputRef.current) {
            inputRef.current.value = '';
        }
    };

    const handleClick = () => {
        if (!disabled) {
            inputRef.current?.click();
        }
    };

    return (
        <div className="space-y-2">
            <label className="block text-sm font-medium text-gray-700">
                Upload Image
            </label>

            <div
                onClick={handleClick}
                onDragOver={handleDragOver}
                onDragLeave={handleDragLeave}
                onDrop={handleDrop}
                className={`
          flex flex-col justify-center items-center w-full h-48 
          bg-gray-50 rounded-lg 
          border-2 border-dashed 
          ${isDragging ? 'border-primary bg-primary/5' : 'border-gray-300'}
          ${error ? 'border-error' : ''}
          ${disabled ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer hover:bg-gray-100'}
          transition-colors relative group overflow-hidden
        `}
            >
                {preview ? (
                    // Preview Image
                    <div className="relative w-full h-full">
                        <img
                            src={preview}
                            alt="Preview"
                            className="w-full h-full object-cover"
                        />
                        {!disabled && (
                            <button
                                onClick={handleRemove}
                                className="absolute top-2 right-2 p-1.5 bg-error text-white rounded-full hover:opacity-90 transition-colors shadow-lg"
                                title="Remove image"
                            >
                                <X className="w-4 h-4" />
                            </button>
                        )}
                    </div>
                ) : (
                    // Upload Placeholder
                    <div className="flex flex-col justify-center items-center pt-5 pb-6">
                        <div className="p-3 bg-primary/10 rounded-full mb-3 group-hover:scale-110 transition-transform duration-200">
                            <CloudUpload className="w-8 h-8 text-primary" />
                        </div>
                        <p className="mb-2 text-sm text-gray-500">
                            <span className="font-semibold text-primary">Click to upload</span> or drag and drop
                        </p>
                        <p className="text-xs text-gray-400">
                            SVG, PNG, JPG or GIF (MAX. 800x400px)
                        </p>
                    </div>
                )}

                <input
                    ref={inputRef}
                    type="file"
                    className="hidden"
                    accept="image/*"
                    onChange={handleInputChange}
                    disabled={disabled}
                />
            </div>

            {error && <p className="text-sm text-error">{error}</p>}
        </div>
    );
};

export default ImageUploader;
