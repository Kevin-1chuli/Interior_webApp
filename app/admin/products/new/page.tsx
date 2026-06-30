"use client";

import { useState, FormEvent } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";

export default function NewProductPage() {
  const router = useRouter();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    description: "",
    category: "",
    price: "",
    materials: "",
    dimensions: "",
  });
  const [images, setImages] = useState<File[]>([]);
  const [imagePreviews, setImagePreviews] = useState<string[]>([]);

  const categories = [
    { id: "beds", label: "Beds" },
    { id: "sofas", label: "Sofas" },
    { id: "wardrobes", label: "Wardrobes" },
    { id: "tv-units", label: "TV Units" },
    { id: "dining", label: "Dining" },
    { id: "coffee-tables", label: "Coffee Tables" },
  ];

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []);
    setImages(files);

    // Create previews
    const previews = files.map((file) => URL.createObjectURL(file));
    setImagePreviews(previews);
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
      formDataToSend.append('price', formData.price);
      formDataToSend.append('currency', 'UGX');
      formDataToSend.append('dimensions', formData.dimensions);
      
      // Add materials as JSON array
      const materialsArray = formData.materials 
        ? formData.materials.split(',').map(m => m.trim())
        : [];
      formDataToSend.append('materials', JSON.stringify(materialsArray));

      // Add images
      images.forEach((image) => {
        formDataToSend.append('images', image);
      });

      const response = await fetch('http://localhost:4000/api/products', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`
          // Don't set Content-Type header - browser will set it automatically with boundary
        },
        body: formDataToSend
      });

      const data = await response.json();

      if (!response.ok || !data.success) {
        throw new Error(data.message || 'Failed to create product');
      }

      alert("Product created successfully!");
      router.push("/admin/products");
    } catch (error: any) {
      console.error("Failed to create product:", error);
      alert(`Failed to create product: ${error.message}`);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="p-4 sm:p-6 md:p-8">
      {/* Header */}
      <div className="mb-8">
        <div className="flex items-center gap-2 text-sm text-gray-600 mb-2">
          <Link href="/admin/products" className="hover:text-gray-900">Products</Link>
          <span>/</span>
          <span className="text-gray-900">New Product</span>
        </div>
        <h1 className="text-3xl font-bold text-gray-900">Add New Product</h1>
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
              <select
                required
                value={formData.category}
                onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-yellow-500 focus:border-transparent outline-none"
              >
                <option value="">Select a category</option>
                {categories.map((cat) => (
                  <option key={cat.id} value={cat.id}>{cat.label}</option>
                ))}
              </select>
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

          {/* Images */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Product Images <span className="text-red-500">*</span>
            </label>
            <input
              type="file"
              multiple
              accept="image/*"
              onChange={handleImageChange}
              required
              className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-yellow-500 focus:border-transparent outline-none"
            />
            <p className="text-sm text-gray-500 mt-1">Upload 3-5 images (JPG, PNG)</p>

            {imagePreviews.length > 0 && (
              <div className="mt-4 grid grid-cols-3 sm:grid-cols-4 md:grid-cols-5 gap-4">
                {imagePreviews.map((preview, index) => (
                  <div key={index} className="relative aspect-square">
                    <img
                      src={preview}
                      alt={`Preview ${index + 1}`}
                      className="w-full h-full object-cover rounded-md border border-gray-200"
                    />
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
              {isSubmitting ? "Creating..." : "Create Product"}
            </button>
            <Link
              href="/admin/products"
              className="w-full sm:w-auto text-center text-gray-700 hover:text-gray-900 font-medium px-8 py-3"
            >
              Cancel
            </Link>
          </div>

          {/* Notice */}
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
            <p className="text-sm text-blue-700">
              <strong>Note:</strong> Images will be uploaded to Cloudinary and product data will be saved to PostgreSQL. Make sure Cloudinary credentials are configured in backend .env file.
            </p>
          </div>
        </div>
      </form>
    </div>
  );
}
