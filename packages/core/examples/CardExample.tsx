import React from "react";
import { Card } from "../src/components/Card";
import { Admin, AdminConfig } from "../src";

// Example configuration for the admin application
const exampleConfig: AdminConfig = {
  title: "Card Component Demo",
  resources: {},
  theme: {
    primaryColor: "#3b82f6",
    secondaryColor: "#6b7280",
    darkMode: false,
  },
  layout: {
    sidebar: true,
    header: true,
    footer: true,
    sidebarWidth: 250,
  },
  auth: {
    enabled: true,
    loginUrl: "/login",
    logoutUrl: "/logout",
  },
};

// Example content components
const UserProfile = () => (
  <div className="text-center">
    <div className="w-20 h-20 bg-gray-300 rounded-full mx-auto mb-4 flex items-center justify-center">
      <span className="text-2xl text-gray-600">👤</span>
    </div>
    <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
      John Doe
    </h3>
    <p className="text-sm text-gray-500 dark:text-gray-400 mb-4">
      Software Engineer
    </p>
    <div className="space-y-2 text-sm">
      <p>
        <span className="font-medium">Email:</span> john@example.com
      </p>
      <p>
        <span className="font-medium">Location:</span> San Francisco, CA
      </p>
      <p>
        <span className="font-medium">Experience:</span> 5 years
      </p>
    </div>
  </div>
);

const StatisticsCard = ({
  title,
  value,
  change,
  icon,
}: {
  title: string;
  value: string;
  change: string;
  icon: string;
}) => (
  <Card
    header={
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-medium text-gray-900 dark:text-white">
          {title}
        </h3>
        <span className="text-2xl">{icon}</span>
      </div>
    }
    footer={
      <div className="flex items-center text-sm">
        <span className="text-green-600 dark:text-green-400">{change}</span>
        <span className="text-gray-500 dark:text-gray-400 ml-2">
          from last month
        </span>
      </div>
    }
  >
    <div className="text-center">
      <p className="text-3xl font-bold text-gray-900 dark:text-white">
        {value}
      </p>
    </div>
  </Card>
);

const ProductCard = ({
  name,
  price,
  category,
  image,
}: {
  name: string;
  price: string;
  category: string;
  image: string;
}) => (
  <Card
    interactive
    header={
      <div className="w-full h-32 bg-gray-200 rounded-t-lg flex items-center justify-center">
        <span className="text-4xl">{image}</span>
      </div>
    }
    footer={
      <div className="flex items-center justify-between">
        <span className="text-sm text-gray-500 dark:text-gray-400">
          {category}
        </span>
        <button className="bg-blue-600 text-white px-3 py-1 rounded text-sm hover:bg-blue-700 transition-colors">
          Add to Cart
        </button>
      </div>
    }
  >
    <div className="text-center">
      <h3 className="font-medium text-gray-900 dark:text-white mb-2">{name}</h3>
      <p className="text-lg font-bold text-blue-600 dark:text-blue-400">
        {price}
      </p>
    </div>
  </Card>
);

const NotificationCard = ({
  title,
  message,
  type,
  time,
}: {
  title: string;
  message: string;
  type: "info" | "success" | "warning" | "error";
  time: string;
}) => {
  const typeStyles = {
    info: "border-blue-200 bg-blue-50 dark:bg-blue-900/20",
    success: "border-green-200 bg-green-50 dark:bg-green-900/20",
    warning: "border-yellow-200 bg-yellow-50 dark:bg-yellow-900/20",
    error: "border-red-200 bg-red-50 dark:bg-red-900/20",
  };

  const typeIcons = {
    info: "ℹ️",
    success: "✅",
    warning: "⚠️",
    error: "❌",
  };

  return (
    <Card
      className={typeStyles[type]}
      bordered
      elevated={false}
      header={
        <div className="flex items-center space-x-2">
          <span>{typeIcons[type]}</span>
          <h3 className="font-medium text-gray-900 dark:text-white">{title}</h3>
        </div>
      }
      footer={
        <span className="text-xs text-gray-500 dark:text-gray-400">{time}</span>
      }
    >
      <p className="text-sm text-gray-600 dark:text-gray-300">{message}</p>
    </Card>
  );
};

/**
 * Card Example Component
 *
 * This component demonstrates various ways to use the Card component
 * with different configurations and content types.
 */
export const CardExample: React.FC = () => {
  return (
    <Admin config={exampleConfig}>
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900 py-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
              Card Component Examples
            </h1>
            <p className="text-gray-600 dark:text-gray-400">
              Various ways to use the Card component for different content types
            </p>
          </div>

          <div className="space-y-8">
            {/* Basic Cards */}
            <section>
              <h2 className="text-2xl font-semibold text-gray-900 dark:text-white mb-6">
                Basic Cards
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                <Card>
                  <p className="text-gray-600 dark:text-gray-400">
                    This is a basic card with default styling. It includes
                    padding, borders, and subtle elevation.
                  </p>
                </Card>

                <Card elevated={false} bordered={false}>
                  <p className="text-gray-600 dark:text-gray-400">
                    This card has no elevation or borders, creating a flat
                    appearance.
                  </p>
                </Card>

                <Card padded={false}>
                  <p className="text-gray-600 dark:text-gray-400">
                    This card has no padding, allowing content to extend to the
                    edges.
                  </p>
                </Card>
              </div>
            </section>

            {/* Interactive Cards */}
            <section>
              <h2 className="text-2xl font-semibold text-gray-900 dark:text-white mb-6">
                Interactive Cards
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                <Card interactive>
                  <p className="text-gray-600 dark:text-gray-400">
                    Hover over this card to see interactive effects.
                  </p>
                </Card>

                <Card interactive selected>
                  <p className="text-gray-600 dark:text-gray-400">
                    This card is selected and interactive.
                  </p>
                </Card>

                <Card interactive disabled>
                  <p className="text-gray-600 dark:text-gray-400">
                    This card is disabled but still interactive.
                  </p>
                </Card>
              </div>
            </section>

            {/* Cards with Headers and Footers */}
            <section>
              <h2 className="text-2xl font-semibold text-gray-900 dark:text-white mb-6">
                Cards with Headers and Footers
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                <Card
                  header={<h3 className="text-lg font-medium">Card Header</h3>}
                  footer={
                    <button className="text-blue-600 hover:text-blue-800">
                      View Details
                    </button>
                  }
                >
                  <p className="text-gray-600 dark:text-gray-400">
                    This card has both a header and footer section.
                  </p>
                </Card>

                <Card
                  header={<h3 className="text-lg font-medium">Header Only</h3>}
                >
                  <p className="text-gray-600 dark:text-gray-400">
                    This card only has a header section.
                  </p>
                </Card>

                <Card
                  footer={
                    <button className="text-blue-600 hover:text-blue-800">
                      Action Button
                    </button>
                  }
                >
                  <p className="text-gray-600 dark:text-gray-400">
                    This card only has a footer section.
                  </p>
                </Card>
              </div>
            </section>

            {/* Statistics Cards */}
            <section>
              <h2 className="text-2xl font-semibold text-gray-900 dark:text-white mb-6">
                Statistics Cards
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                <StatisticsCard
                  title="Total Users"
                  value="1,234"
                  change="+12%"
                  icon="👥"
                />
                <StatisticsCard
                  title="Revenue"
                  value="$45,678"
                  change="+23%"
                  icon="💰"
                />
                <StatisticsCard
                  title="Orders"
                  value="567"
                  change="+8%"
                  icon="📦"
                />
                <StatisticsCard
                  title="Growth"
                  value="89%"
                  change="+5%"
                  icon="📈"
                />
              </div>
            </section>

            {/* Product Cards */}
            <section>
              <h2 className="text-2xl font-semibold text-gray-900 dark:text-white mb-6">
                Product Cards
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                <ProductCard
                  name="Wireless Headphones"
                  price="$99.99"
                  category="Electronics"
                  image="🎧"
                />
                <ProductCard
                  name="Coffee Maker"
                  price="$49.99"
                  category="Home & Kitchen"
                  image="☕"
                />
                <ProductCard
                  name="Running Shoes"
                  price="$79.99"
                  category="Sports"
                  image="👟"
                />
              </div>
            </section>

            {/* Notification Cards */}
            <section>
              <h2 className="text-2xl font-semibold text-gray-900 dark:text-white mb-6">
                Notification Cards
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <NotificationCard
                  title="System Update"
                  message="A new system update is available. Please restart your application to apply the changes."
                  type="info"
                  time="2 minutes ago"
                />
                <NotificationCard
                  title="Payment Successful"
                  message="Your payment of $99.99 has been processed successfully."
                  type="success"
                  time="5 minutes ago"
                />
                <NotificationCard
                  title="Storage Warning"
                  message="Your storage is running low. Consider upgrading your plan."
                  type="warning"
                  time="1 hour ago"
                />
                <NotificationCard
                  title="Connection Error"
                  message="Unable to connect to the server. Please check your internet connection."
                  type="error"
                  time="2 hours ago"
                />
              </div>
            </section>

            {/* User Profile Card */}
            <section>
              <h2 className="text-2xl font-semibold text-gray-900 dark:text-white mb-6">
                User Profile Card
              </h2>
              <div className="max-w-md">
                <Card
                  header={<h3 className="text-lg font-medium">User Profile</h3>}
                  footer={
                    <div className="flex space-x-2">
                      <button className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 transition-colors">
                        Edit Profile
                      </button>
                      <button className="bg-gray-600 text-white px-4 py-2 rounded hover:bg-gray-700 transition-colors">
                        View Details
                      </button>
                    </div>
                  }
                >
                  <UserProfile />
                </Card>
              </div>
            </section>
          </div>
        </div>
      </div>
    </Admin>
  );
};

export default CardExample;
