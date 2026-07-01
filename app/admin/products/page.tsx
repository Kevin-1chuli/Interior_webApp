"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { Plus, Search, Sofa, Trash2, Edit, Calendar } from "lucide-react";

export default function ProductsListPage() {
  const [products, setProducts] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");

  useEffect(() => {
    fetchProducts();
  }, []);

  const fetchProducts = async () => {
    try {
      const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:4000';
      const response = await fetch(`${apiUrl}/api/products`);
      const data = await response.json();
      if (data.success) {
        setProducts(data.data);
      }
    } catch (error) {
      console.error('Failed to fetch products:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleDelete = async (id: string, name: string) => {
    if (!confirm(`Are you sure you want to delete "${name}"?`)) return;

    try {
      const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:4000';
      const token = localStorage.getItem('admin_token');
      const response = await fetch(`${apiUrl}/api/products/${id}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });

      const data = await response.json();

      if (!response.ok || !data.success) {
        throw new Error(data.message || 'Failed to delete product');
      }

      fetchProducts();
    } catch (error: any) {
      console.error('Failed to delete:', error);
      alert(`Failed to delete product: ${error.message}`);
    }
  };

  const filteredProducts = products.filter(p => 
    p.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    p.category.toLowerCase().includes(searchQuery.toLowerCase())
  );

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-amber-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading products...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen" style={{ backgroundColor: "#f8f5f0" }}>
      <div className="max-w-7xl mx-auto p-6 lg:p-8">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-8">
          <div>
            <h1 className="text-4xl font-bold mb-2" style={{ color: "#1e1e1e", fontFamily: "'Playfair Display', serif" }}>
              Products
            </h1>
            <p className="text-base" style={{ color: "#6b6560" }}>
              Manage your furniture catalog
            </p>
          </div>
          <Link
            href="/admin/products/new"
            className="inline-flex items-center justify-center gap-2 font-medium px-6 py-3 rounded-lg transition-all hover:shadow-lg"
            style={{ backgroundColor: "#b8934a", color: "white" }}
            onMouseEnter={(e) => {
              e.currentTarget.style.backgroundColor = "#d4ac6e";
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.backgroundColor = "#b8934a";
            }}
          >
            <Plus className="w-5 h-5" />
            <span>Add Product</span>
          </Link>
        </div>

        {/* Search Bar */}
        {products.length > 0 && (
          <div className="mb-6">
            <div className="relative">
              <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5" style={{ color: "#6b6560" }} />
              <input
                type="text"
                placeholder="Search products..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-12 pr-4 py-3 rounded-lg outline-none bg-white transition-all"
                style={{ 
                  border: "2px solid #ede9e2",
                  fontFamily: "'Montserrat', sans-serif"
                }}
                onFocus={(e) => {
                  e.currentTarget.style.borderColor = "#b8934a";
                }}
                onBlur={(e) => {
                  e.currentTarget.style.borderColor = "#ede9e2";
                }}
              />
            </div>
          </div>
        )}

        {/* Products Grid/List */}
        {filteredProducts.length === 0 && !searchQuery ? (
          <div className="bg-white rounded-lg border p-12 text-center" style={{ borderColor: "#ede9e2" }}>
            <div 
              className="w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4"
              style={{ backgroundColor: "#f8f5f0" }}
            >
              <Sofa className="w-8 h-8" style={{ color: "#b8934a" }} />
            </div>
            <h3 className="text-xl font-semibold mb-2" style={{ color: "#1e1e1e", fontFamily: "'Playfair Display', serif" }}>
              No products yet
            </h3>
            <p className="mb-6" style={{ color: "#6b6560" }}>
              Start by adding your first product to the catalog
            </p>
            <Link
              href="/admin/products/new"
              className="inline-flex items-center gap-2 font-medium px-6 py-3 rounded-lg transition-all"
              style={{ backgroundColor: "#b8934a", color: "white" }}
            >
              <Plus className="w-5 h-5" />
              <span>Add Your First Product</span>
            </Link>
          </div>
        ) : filteredProducts.length === 0 ? (
          <div className="bg-white rounded-lg border p-12 text-center" style={{ borderColor: "#ede9e2" }}>
            <p style={{ color: "#6b6560" }}>No products match your search</p>
          </div>
        ) : (
          <div className="bg-white rounded-lg border overflow-hidden" style={{ borderColor: "#ede9e2" }}>
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr style={{ backgroundColor: "#f8f5f0", borderBottom: "1px solid #ede9e2" }}>
                    <th className="px-6 py-4 text-left text-xs font-semibold uppercase tracking-wider" style={{ color: "#6b6560", fontFamily: "'Montserrat', sans-serif" }}>
                      Product
                    </th>
                    <th className="px-6 py-4 text-left text-xs font-semibold uppercase tracking-wider" style={{ color: "#6b6560", fontFamily: "'Montserrat', sans-serif" }}>
                      Category
                    </th>
                    <th className="px-6 py-4 text-left text-xs font-semibold uppercase tracking-wider" style={{ color: "#6b6560", fontFamily: "'Montserrat', sans-serif" }}>
                      Price
                    </th>
                    <th className="px-6 py-4 text-left text-xs font-semibold uppercase tracking-wider" style={{ color: "#6b6560", fontFamily: "'Montserrat', sans-serif" }}>
                      Created
                    </th>
                    <th className="px-6 py-4 text-right text-xs font-semibold uppercase tracking-wider" style={{ color: "#6b6560", fontFamily: "'Montserrat', sans-serif" }}>
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {filteredProducts.map((product, idx) => (
                    <tr 
                      key={product.id} 
                      className="transition-colors hover:bg-opacity-50"
                      style={{ 
                        borderBottom: idx < filteredProducts.length - 1 ? "1px solid #ede9e2" : "none"
                      }}
                      onMouseEnter={(e) => {
                        e.currentTarget.style.backgroundColor = "#f8f5f0";
                      }}
                      onMouseLeave={(e) => {
                        e.currentTarget.style.backgroundColor = "transparent";
                      }}
                    >
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-4">
                          <div 
                            className="w-14 h-14 rounded-lg flex items-center justify-center flex-shrink-0 overflow-hidden"
                            style={{ backgroundColor: "#ede9e2" }}
                          >
                            {product.images && Array.isArray(product.images) && product.images.length > 0 ? (
                              <img 
                                src={product.images[0]} 
                                alt={product.name}
                                className="w-full h-full object-cover"
                              />
                            ) : (
                              <Sofa className="w-6 h-6" style={{ color: "#b8934a" }} />
                            )}
                          </div>
                          <div className="min-w-0">
                            <div className="font-semibold truncate" style={{ color: "#1e1e1e", fontFamily: "'Montserrat', sans-serif" }}>
                              {product.name}
                            </div>
                            <div className="text-sm truncate" style={{ color: "#6b6560" }}>
                              {product.description?.substring(0, 60) || 'No description'}
                            </div>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <span 
                          className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium capitalize"
                          style={{ 
                            backgroundColor: "#f8f5f0",
                            color: "#b8934a",
                            fontFamily: "'Montserrat', sans-serif"
                          }}
                        >
                          {product.category}
                        </span>
                      </td>
                      <td className="px-6 py-4">
                        <div className="font-semibold" style={{ color: "#1e1e1e", fontFamily: "'Montserrat', sans-serif" }}>
                          {product.currency} {Number(product.price).toLocaleString()}
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-2 text-sm" style={{ color: "#6b6560" }}>
                          <Calendar className="w-4 h-4" />
                          {new Date(product.createdAt).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex items-center justify-end gap-2">
                          <Link 
                            href={`/admin/products/${product.id}/edit`}
                            className="inline-flex items-center gap-1.5 px-3 py-1.5 text-sm font-medium rounded-lg transition-all"
                            style={{ color: "#b8934a" }}
                            onMouseEnter={(e) => {
                              e.currentTarget.style.backgroundColor = "#f8f5f0";
                            }}
                            onMouseLeave={(e) => {
                              e.currentTarget.style.backgroundColor = "transparent";
                            }}
                          >
                            <Edit className="w-4 h-4" />
                            Edit
                          </Link>
                          <button 
                            onClick={() => handleDelete(product.id, product.name)}
                            className="inline-flex items-center gap-1.5 px-3 py-1.5 text-sm font-medium rounded-lg transition-all"
                            style={{ color: "#dc2626" }}
                            onMouseEnter={(e) => {
                              e.currentTarget.style.backgroundColor = "#fee2e2";
                            }}
                            onMouseLeave={(e) => {
                              e.currentTarget.style.backgroundColor = "transparent";
                            }}
                          >
                            <Trash2 className="w-4 h-4" />
                            Delete
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* Results Count */}
        {filteredProducts.length > 0 && (
          <div className="mt-4 text-sm text-center" style={{ color: "#6b6560" }}>
            Showing {filteredProducts.length} of {products.length} products
          </div>
        )}
      </div>
    </div>
  );
}
