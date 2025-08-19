import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, useLocation } from 'react-router-dom';
import { useSuperAdmin } from '@react-superadmin/core';
import { Edit, Trash2, ArrowLeft, User, FileText, Package, Calendar, Mail, Phone, Building, Tag, Eye, ThumbsUp, Star } from 'lucide-react';
import { Card } from '../ui/Card';
import { Button } from '../ui/Button';
import { Badge } from '../ui/Badge';
import { Modal } from '../ui/Modal';
import { userService, postService, productService, User as UserType, Post, Product } from '../../services/mockService';
import { formatDate } from '../../utils/formatDate';
import { formatCurrency } from '../../utils/formatCurrency';

export const ResourceShow: React.FC = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const location = useLocation();
  
  // Extract resource name from the current path
  const pathSegments = location.pathname.split('/');
  const resourceName = pathSegments[1]; // /users/123 -> users
  
  const { resources } = useSuperAdmin();
  const resource = resources[resourceName || ''];
  
  const [data, setData] = useState<any>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [showDeleteModal, setShowDeleteModal] = useState(false);

  // Get the appropriate service based on resource name
  const getService = () => {
    switch (resourceName) {
      case 'users':
        return userService;
      case 'posts':
        return postService;
      case 'products':
        return productService;
      default:
        return null;
    }
  };

  const service = getService();

  // Load data
  useEffect(() => {
    if (service && id) {
      const loadData = async () => {
        setLoading(true);
        setError(null);
        
        try {
          const result = await service.read(id);
          setData(result);
        } catch (error) {
          setError('Failed to load data');
          console.error('Error loading data:', error);
        } finally {
          setLoading(false);
        }
      };
      
      loadData();
    }
  }, [service, id]);

  if (!resource || !service) {
    return <div>Resource not found</div>;
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary-600"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-red-50 border border-red-200 rounded-md p-4">
        <p className="text-red-800">Error: {error}</p>
      </div>
    );
  }

  if (!data) {
    return <div>Data not found</div>;
  }

  // Handle delete
  const handleDelete = async () => {
    try {
      await service.delete(id!);
      setShowDeleteModal(false);
      navigate(`/${resourceName}`);
    } catch (error) {
      console.error('Error deleting item:', error);
    }
  };

  // Get resource icon
  const getResourceIcon = () => {
    switch (resourceName) {
      case 'users':
        return <User className="w-6 h-6" />;
      case 'posts':
        return <FileText className="w-6 h-6" />;
      case 'products':
        return <Package className="w-6 h-6" />;
      default:
        return null;
    }
  };

  // Render user details
  const renderUserDetails = (user: UserType) => (
    <div className="space-y-6">
      {/* Header with avatar */}
      <div className="flex items-center space-x-4">
        <img
          src={user.avatar}
          alt={user.name}
          className="w-20 h-20 rounded-full object-cover"
        />
        <div>
          <h2 className="text-2xl font-bold text-gray-900">{user.name}</h2>
          <p className="text-gray-600">{user.email}</p>
          <div className="flex items-center space-x-2 mt-2">
            <Badge variant="outline">{user.role}</Badge>
            <Badge variant={user.status === 'active' ? 'success' : user.status === 'suspended' ? 'danger' : 'warning'}>
              {user.status}
            </Badge>
          </div>
        </div>
      </div>

      {/* User information grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card>
          <div className="p-4">
            <h3 className="text-lg font-medium text-gray-900 mb-4">Contact Information</h3>
            <div className="space-y-3">
              <div className="flex items-center space-x-3">
                <Mail className="w-5 h-5 text-gray-400" />
                <span className="text-gray-700">{user.email}</span>
              </div>
              <div className="flex items-center space-x-3">
                <Phone className="w-5 h-5 text-gray-400" />
                <span className="text-gray-700">{user.phone}</span>
              </div>
              <div className="flex items-center space-x-3">
                <Building className="w-5 h-5 text-gray-400" />
                <span className="text-gray-700">{user.department}</span>
              </div>
            </div>
          </div>
        </Card>

        <Card>
          <div className="p-4">
            <h3 className="text-lg font-medium text-gray-900 mb-4">Account Details</h3>
            <div className="space-y-3">
              <div className="flex items-center space-x-3">
                <Calendar className="w-5 h-5 text-gray-400" />
                <span className="text-gray-700">Created: {formatDate(user.createdAt)}</span>
              </div>
              <div className="flex items-center space-x-3">
                <Calendar className="w-5 h-5 text-gray-400" />
                <span className="text-gray-700">Last Login: {formatDate(user.lastLogin)}</span>
              </div>
            </div>
          </div>
        </Card>
      </div>
    </div>
  );

  // Render post details
  const renderPostDetails = (post: Post) => (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h2 className="text-2xl font-bold text-gray-900 mb-2">{post.title}</h2>
        <div className="flex items-center space-x-2 mb-4">
          <Badge variant={post.status === 'published' ? 'success' : post.status === 'draft' ? 'warning' : 'secondary'}>
            {post.status}
          </Badge>
          <Badge variant="outline">{post.category}</Badge>
        </div>
      </div>

      {/* Post content */}
      <Card>
        <div className="p-6">
          <div className="prose max-w-none">
            <p className="text-gray-700 leading-relaxed">{post.content}</p>
          </div>
        </div>
      </Card>

      {/* Post metadata */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card>
          <div className="p-4">
            <h3 className="text-lg font-medium text-gray-900 mb-4">Post Information</h3>
            <div className="space-y-3">
              <div className="flex items-center space-x-3">
                <User className="w-5 h-5 text-gray-400" />
                <span className="text-gray-700">{post.author}</span>
              </div>
              <div className="flex items-center space-x-3">
                <Calendar className="w-5 h-5 text-gray-400" />
                <span className="text-gray-700">
                  {post.publishedAt ? formatDate(post.publishedAt) : 'Not published'}
                </span>
              </div>
              <div className="flex items-center space-x-3">
                <Tag className="w-5 h-5 text-gray-400" />
                <span className="text-gray-700">{post.tags.join(', ')}</span>
              </div>
            </div>
          </div>
        </Card>

        <Card>
          <div className="p-4">
            <h3 className="text-lg font-medium text-gray-900 mb-4">Statistics</h3>
            <div className="space-y-3">
              <div className="flex items-center space-x-3">
                <Eye className="w-5 h-5 text-gray-400" />
                <span className="text-gray-700">{post.views} views</span>
              </div>
              <div className="flex items-center space-x-3">
                <ThumbsUp className="w-5 h-5 text-gray-400" />
                <span className="text-gray-700">{post.likes} likes</span>
              </div>
              <div className="flex items-center space-x-3">
                <Calendar className="w-5 h-5 text-gray-400" />
                <span className="text-gray-700">{post.readTime}</span>
              </div>
            </div>
          </div>
        </Card>
      </div>
    </div>
  );

  // Render product details
  const renderProductDetails = (product: Product) => (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h2 className="text-2xl font-bold text-gray-900 mb-2">{product.name}</h2>
        <div className="flex items-center space-x-2 mb-4">
          <Badge variant={product.status === 'in_stock' ? 'success' : product.status === 'low_stock' ? 'warning' : 'danger'}>
            {product.status.replace('_', ' ')}
          </Badge>
          <Badge variant="outline">{product.category}</Badge>
        </div>
      </div>

      {/* Product description */}
      <Card>
        <div className="p-6">
          <p className="text-gray-700 leading-relaxed">{product.description}</p>
        </div>
      </Card>

      {/* Product details grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card>
          <div className="p-4">
            <h3 className="text-lg font-medium text-gray-900 mb-4">Product Information</h3>
            <div className="space-y-3">
              <div className="flex items-center space-x-3">
                <Package className="w-5 h-5 text-gray-400" />
                <span className="text-gray-700">SKU: {product.sku}</span>
              </div>
              <div className="flex items-center space-x-3">
                <Building className="w-5 h-5 text-gray-400" />
                <span className="text-gray-700">Brand: {product.brand}</span>
              </div>
              <div className="flex items-center space-x-3">
                <Calendar className="w-5 h-5 text-gray-400" />
                <span className="text-gray-700">Created: {formatDate(product.createdAt)}</span>
              </div>
            </div>
          </div>
        </Card>

        <Card>
          <div className="p-4">
            <h3 className="text-lg font-medium text-gray-900 mb-4">Pricing & Stock</h3>
            <div className="space-y-3">
              <div className="flex items-center space-x-3">
                <span className="text-2xl font-bold text-primary-600">
                  {formatCurrency(product.price)}
                </span>
              </div>
              <div className="flex items-center space-x-3">
                <Package className="w-5 h-5 text-gray-400" />
                <span className="text-gray-700">Stock: {product.stock} units</span>
              </div>
              <div className="flex items-center space-x-3">
                <Star className="w-5 h-5 text-yellow-400" />
                <span className="text-gray-700">{product.rating} rating ({product.reviews} reviews)</span>
              </div>
            </div>
          </div>
        </Card>
      </div>
    </div>
  );

  // Render content based on resource type
  const renderContent = () => {
    switch (resourceName) {
      case 'users':
        return renderUserDetails(data);
      case 'posts':
        return renderPostDetails(data);
      case 'products':
        return renderProductDetails(data);
      default:
        return <div>Unsupported resource type</div>;
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-3">
          <Button variant="outline" onClick={() => navigate(`/${resourceName}`)}>
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to {resource.label}
          </Button>
          {getResourceIcon()}
          <div>
            <h1 className="text-2xl font-bold text-gray-900">{resource.label} Details</h1>
            <p className="text-gray-600">View {resource.label.toLowerCase()} information</p>
          </div>
        </div>
        
        <div className="flex items-center space-x-2">
          <Button variant="outline" onClick={() => navigate(`/${resourceName}/${id}/edit`)}>
            <Edit className="w-4 h-4 mr-2" />
            Edit
          </Button>
          <Button variant="danger" onClick={() => setShowDeleteModal(true)}>
            <Trash2 className="w-4 h-4 mr-2" />
            Delete
          </Button>
        </div>
      </div>

      {/* Content */}
      {renderContent()}

      {/* Delete Confirmation Modal */}
      <Modal
        isOpen={showDeleteModal}
        onClose={() => setShowDeleteModal(false)}
        title="Confirm Delete"
      >
        <div className="p-6">
          <p className="text-gray-600 mb-4">
            Are you sure you want to delete this {resource.label.toLowerCase()}? This action cannot be undone.
          </p>
          <div className="flex justify-end space-x-3">
            <Button variant="outline" onClick={() => setShowDeleteModal(false)}>
              Cancel
            </Button>
            <Button variant="danger" onClick={handleDelete}>
              Delete
            </Button>
          </div>
        </div>
      </Modal>
    </div>
  );
};
