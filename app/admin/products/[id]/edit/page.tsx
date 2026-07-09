"use client";

import { useState, useEffect, FormEvent } from "react";
import { useRouter, useParams } from "next/navigation";
import Link from "next/link";
import { getApiUrl } from "@/lib/config";
import { X } from "lucide-react";

interface Category {
  id: string;
  slug: string;
  name: string;
  isActive: boolean;
}

interface Product {
  id: string;
  name: string;
  description: string;
  category: string;
  categoryId: string | null;
  price: number;
  currency: string;
  materials: string[];
  dimensions: string | null;
  images: string[];
}

export default function EditProductPage() {
  const router = useRouter();
  const params = useParams();
  const productId = params.id as string;

  const [isLoading, setIsLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [categories, setCategories] = useState<Category[]>([]);
  const [categoriesLoading, setCategoriesLoading] = useState(true);
  const [categoriesError, setCategoriesError] = useState("");
  const [product, setProduct] = useState<Product | null>(null);
  const [formData, setFormData] = useState({
    name: "",
    description: "",
    category: "",
    categoryId: "",
    price: "",
    materials: "",
    dimensions: "",
  });
  const [existingImages, setExistingImages] = useState<string[]>([]);
  const [newImages, setNewImages] = useState<File[]>([]);
  const [newImagePreviews, setNewImagePreviews] = useState<string[]>([]);

  // Fetch product and categories on mount
  useEffect(() => {
    fetchCategories();
    fetchProduct();
  }, [productId]);

  const fetchProduct = async () => {
    try {
      setIsLoading(true);
      const response = await fetch(getApiUrl(`products/${productId}`));
      const data = await response.json();

      if (!response.ok || !data.success) {
        throw new Error(data.message || 'Failed to load product');
      }

      const productData = data.data;
      setProduct(productData);
      setExistingImages(productData.images || []);
      
      // Populate form
      setFormData({
        name: productData.name,
        description: productData.description || "",
        category: productData.category,
        categoryId: productData.categoryId || "",
        price: productData.price.toString(),
        materials: Array.isArray(productData.materials) 
          ? productData.materials.join(', ') 
          : "",
        dimensions: productData.dimensions || "",
      });
    } catch (error: any) {
      console.error('Failed to fetch product:', error);
      alert(`Failed to load product: ${error.message}`);
      router.push('/admin/products');
    } finally {
      setIsLoading(false);
    }
  };

  const fetchCategories = async () => {
    try {
      setCategoriesLoading(true);
      setCategoriesError("");
      
      const response = await fetch(getApiUrl('categories'));
      const data = await response.json();

      if (!response.ok || !data.success) {
        throw new Error(data.message || 'Failed to load categories');
      }

      // Only show active categories
      const activeCategories = data.data.filter((cat: Category) => cat.isActive);
      setCategories(activeCategories);
    } catch (error: any) {
      console.error('Failed to fetch categories:', error);
      setCategoriesError(error.message || 'Failed to load categories');
    } finally {
      setCategoriesLoading(false);
    }
  };

  const handleCategoryChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const selectedCategory = categories.find(cat => cat.id === e.target.value);
    if (selectedCategory) {
      setFormData({
        ...formData,
        category: selectedCategory.slug,
        categoryId: selectedCategory.id
      });
    } else {
      setFormData({
        ...formData,
        category: "",
        categoryId: ""
      });
    }
  };

  const handleNewImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []);
    setNewImages(files);

    // Create previews
    const previews = files.map((file) => URL.createObjectURL(file));
    setNewImagePreviews(previews);
  };

  const handleRemoveExistingImage = (index: number) => {
    setExistingImages(prev => prev.filter((_, i) => i !== index));
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      const token = localStorage.getItem("admin_token");
      if (!token) {
        alert("Please login first");
        router.push("/admin/login");
        return;
      }

      // Create FormData for multipart/form-data
      const formDataToSend = new FormData();
      formDataToSend.append('name', formData.name);
      formDataToSend.append('description', formData.description);
      formDataToSend.append('category', formData.category);
      if (formData.categoryId) {
        formDataToSend.append('categoryId', formData.categoryId);
      }
      formDataToSend.append('price', formData.price);
      formDataToSend.append('currency', product?.currency || 'UGX');
      formDataToSend.append('dimensions', formData.dimensions);
      
      // Add materials as JSON array
      const materialsArray = formData.materials 
        ? formData.materials.split(',').map(m => m.trim())
        : [];
      formDataToSend.append('materials', JSON.stringify(materialsArray));

      // Add existing images (that weren't removed)
      formDataToSend.append('existingImages', JSON.stringify(existingImages));

      // Add new images
      newImages.forEach((image) => {
        formDataToSend.append('images', image);
      });

      const response = await fetch(getApiUrl(`products/${productId}`), {
        method: 'PUT',
        headers: {
          'Authorization': `Bearer ${token}`
        },
        body: formDataToSend
      });

      const data = await response.json();

      if (!response.ok || !data.success) {
        throw new Error(data.message || 'Failed to update product');
      }

      alert("Product updated successfully!");
      router.push("/admin/products");
    } catch (error: any) {
      console.error("Failed to update product:", error);
      alert(`Failed to update product: ${error.message}`);
    } finally {
      setIsSubmitting(false);
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-amber-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading product...</p>
        </div>
      </div>
    );
  }

  if (!product) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <p className="text-gray-600">Product not found</p>
          <Link href="/admin/products" className="text-blue-600 hover:underline mt-4 inline-block">
            Back to Products
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="p-4 sm:p-6 md:p-8">
      {/* Header */}
      <div className="mb-8">
        <div className="flex items-center gap-2 text-sm text-gray-600 mb-2">
          <Link href="/admin/products" className="hover:text-gray-900">Products</Link>
          <span>/</span>
          <span className="text-gray-900">Edit Product</span>
        </div>
        <h1 className="text-3xl font-bold text-gray-900">Edit Product</h1>
      </div>

      {/* Form */}
      <form onSubmit={handleSubmit} className="max-w-4xl">
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-8 space-y-6">
          {/* Product Name */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Product Name <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              required
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-yellow-500 focus:border-transparent outline-none"
              placeholder="e.g., Modern Platform Bed"
            />
          </div>

          {/* Description */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Description <span className="text-red-500">*</span>
            </label>
            <textarea
              required
              rows={4}
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-yellow-500 focus:border-transparent outline-none"
              placeholder="Describe the product..."
            />
          </div>

          {/* Category & Price */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Category <span className="text-red-500">*</span>
              </label>
              {categoriesLoading ? (
                <div className="w-full px-4 py-2 border border-gray-300 rounded-md bg-gray-50 text-gray-500">
                  Loading categories...
                </div>
              ) : categoriesError ? (
                <div>
                  <div className="w-full px-4 py-2 border border-red-300 rounded-md bg-red-50 text-red-700 text-sm">
                    {categoriesError}
                  </div>
                  <button
                    type="button"
                    onClick={fetchCategories}
                    className="mt-2 text-sm text-blue-600 hover:text-blue-700 underline"
                  >
                    Retry
                  </button>
                </div>
              ) : (
                <select
                  required
                  value={formData.categoryId}
                  onChange={handleCategoryChange}
                  disabled={isSubmitting || categories.length === 0}
                  className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-yellow-500 focus:border-transparent outline-none disabled:bg-gray-50 disabled:text-gray-500"
                >
                  <option value="">Select a category</option>
                  {categories.map((cat) => (
                    <option key={cat.id} value={cat.id}>{cat.name}</option>
                  ))}
                </select>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Price (UGX) <span className="text-red-500">*</span>
              </label>
              <input
                type="number"
                required
                value={formData.price}
                onChange={(e) => setFormData({ ...formData, price: e.target.value })}
                className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-yellow-500 focus:border-transparent outline-none"
                placeholder="e.g., 2500000"
              />
            </div>
          </div>

          {/* Materials */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Materials
            </label>
            <input
              type="text"
              value={formData.materials}
              onChange={(e) => setFormData({ ...formData, materials: e.target.value })}
              className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-yellow-500 focus:border-transparent outline-none"
              placeholder="e.g., Solid Wood, Fabric Upholstery (comma-separated)"
            />
          </div>

          {/* Dimensions */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Dimensions
            </label>
            <input
              type="text"
              value={formData.dimensions}
              onChange={(e) => setFormData({ ...formData, dimensions: e.target.value })}
              className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-yellow-500 focus:border-transparent outline-none"
              placeholder="e.g., 180cm x 200cm x 45cm"
            />
          </div>

          {/* Existing Images */}
          {existingImages.length > 0 && (
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Current Images
              </label>
              <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-5 gap-4">
                {existingImages.map((imageUrl, index) => (
                  <div key={index} className="relative aspect-square group">
                    <img
                      src={imageUrl}
                      alt={`Product ${index + 1}`}
                      className="w-full h-full object-cover rounded-md border border-gray-200"
                    />
                    <button
                      type="button"
                      onClick={() => handleRemoveExistingImage(index)}
                      className="absolute top-1 right-1 bg-red-500 text-white p-1 rounded-full opacity-0 group-hover:opacity-100 transition-opacity hover:bg-red-600"
                      title="Remove image"
                    >
                      <X className="w-4 h-4" />
                    </button>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Add New Images */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Add New Images
            </label>
            <input
              type="file"
              multiple
              accept="image/*"
              onChange={handleNewImageChange}
              className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-yellow-500 focus:border-transparent outline-none"
            />
            <p className="text-sm text-gray-500 mt-1">Upload additional images (optional)</p>

            {newImagePreviews.length > 0 && (
              <div className="mt-4 grid grid-cols-3 sm:grid-cols-4 md:grid-cols-5 gap-4">
                {newImagePreviews.map((preview, index) => (
                  <div key={index} className="relative aspect-square">
                    <img
                      src={preview}
                      alt={`New ${index + 1}`}
                      className="w-full h-full object-cover rounded-md border border-green-200"
                    />
                    <div className="absolute top-1 left-1 bg-green-500 text-white text-xs px-2 py-0.5 rounded">
                      New
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Actions */}
          <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-4 pt-6 border-t border-gray-200">
            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full sm:w-auto bg-yellow-600 hover:bg-yellow-700 text-white font-medium px-8 py-3 rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isSubmitting ? "Updating..." : "Update Product"}
            </button>
            <Link
              href="/admin/products"
              className="w-full sm:w-auto text-center text-gray-700 hover:text-gray-900 font-medium px-8 py-3"
            >
              Cancel
            </Link>
          </div>

          {/* Notice */}
          <div className="bg-amber-50 border border-amber-200 rounded-lg p-4">
            <p className="text-sm text-amber-700">
              <strong>Note:</strong> New images will be uploaded to Cloudinary. Removed images will not be deleted from Cloudinary automatically.
            </p>
          </div>
        </div>
      </form>
    </div>
  );
}
