import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient({
  datasources: {
    db: {
      url: "postgres://neondb_owner:npg_f9xB2jZKQeoa@ep-billowing-frog-a1xfrp7r-pooler.ap-southeast-1.aws.neon.tech/neondb?sslmode=require",
    },
  },
});

async function setupDatabase() {
  try {
    console.log("🚀 Setting up database...");

    // Create initial categories
    const categories = await Promise.all([
      prisma.category.upsert({
        where: { name: "Development" },
        update: {},
        create: {
          name: "Development",
          description: "Software development and programming topics",
        },
      }),
      prisma.category.upsert({
        where: { name: "Design" },
        update: {},
        create: {
          name: "Design",
          description: "UI/UX design and creative topics",
        },
      }),
      prisma.category.upsert({
        where: { name: "Marketing" },
        update: {},
        create: {
          name: "Marketing",
          description: "Digital marketing and growth topics",
        },
      }),
      prisma.category.upsert({
        where: { name: "Engineering" },
        update: {},
        create: {
          name: "Engineering",
          description: "Engineering and technical topics",
        },
      }),
    ]);

    console.log("✅ Categories created:", categories.length);

    // Create initial users
    const users = await Promise.all([
      prisma.user.upsert({
        where: { email: "john.doe@example.com" },
        update: {},
        create: {
          name: "John Doe",
          email: "john.doe@example.com",
          role: "admin",
          status: "active",
          department: "Engineering",
          avatar:
            "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150&h=150&fit=crop&crop=face",
          phone: "+1 (555) 123-4567",
        },
      }),
      prisma.user.upsert({
        where: { email: "jane.smith@example.com" },
        update: {},
        create: {
          name: "Jane Smith",
          email: "jane.smith@example.com",
          role: "user",
          status: "active",
          department: "Marketing",
          avatar:
            "https://images.unsplash.com/photo-1494790108755-2616b612b786?w=150&h=150&fit=crop&crop=face",
          phone: "+1 (555) 234-5678",
        },
      }),
      prisma.user.upsert({
        where: { email: "bob.johnson@example.com" },
        update: {},
        create: {
          name: "Bob Johnson",
          email: "bob.johnson@example.com",
          role: "moderator",
          status: "active",
          department: "Sales",
          avatar:
            "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&h=150&fit=crop&crop=face",
          phone: "+1 (555) 345-6789",
        },
      }),
    ]);

    console.log("✅ Users created:", users.length);

    // Create initial posts
    const posts = await Promise.all([
      prisma.post.upsert({
        where: { id: "post-1" },
        update: {},
        create: {
          id: "post-1",
          title: "Getting Started with React SuperAdmin",
          content:
            "React SuperAdmin is a powerful framework for building CRUD admin interfaces. This post will guide you through the basics of setting up your first admin panel.",
          authorId: users[0].id,
          status: "published",
          publishedAt: new Date(),
          tags: ["react", "admin", "tutorial"],
          category: "Development",
          readTime: "5 min read",
          views: 1247,
          likes: 89,
        },
      }),
      prisma.post.upsert({
        where: { id: "post-2" },
        update: {},
        create: {
          id: "post-2",
          title: "Advanced Form Validation Techniques",
          content:
            "Learn how to implement robust form validation in your admin interfaces using React SuperAdmin's built-in validation system.",
          authorId: users[1].id,
          status: "published",
          publishedAt: new Date(),
          tags: ["forms", "validation", "react"],
          category: "Development",
          readTime: "8 min read",
          views: 892,
          likes: 67,
        },
      }),
    ]);

    console.log("✅ Posts created:", posts.length);

    // Create initial products
    const products = await Promise.all([
      prisma.product.upsert({
        where: { id: "product-1" },
        update: {},
        create: {
          id: "product-1",
          name: "React SuperAdmin Pro",
          description:
            "Professional version with advanced features and priority support",
          price: 99.99,
          category: "Software",
          inStock: true,
          stock: 100,
          rating: 4.8,
          image:
            "https://images.unsplash.com/photo-1555066931-4365d3080a8a?w=300&h=200&fit=crop",
        },
      }),
      prisma.product.upsert({
        where: { id: "product-2" },
        update: {},
        create: {
          id: "product-2",
          name: "Admin Dashboard Template",
          description: "Ready-to-use admin dashboard template built with React",
          price: 49.99,
          category: "Template",
          inStock: true,
          stock: 50,
          rating: 4.6,
          image:
            "https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=300&h=200&fit=crop",
        },
      }),
    ]);

    console.log("✅ Products created:", products.length);

    console.log("🎉 Database setup completed successfully!");
    console.log(`📊 Summary:`);
    console.log(`   - Categories: ${categories.length}`);
    console.log(`   - Users: ${users.length}`);
    console.log(`   - Posts: ${posts.length}`);
    console.log(`   - Products: ${products.length}`);
  } catch (error) {
    console.error("❌ Error setting up database:", error);
    throw error;
  } finally {
    await prisma.$disconnect();
  }
}

// Run the setup if this file is executed directly
if (require.main === module) {
  setupDatabase()
    .then(() => {
      console.log("✅ Database setup completed");
      process.exit(0);
    })
    .catch((error) => {
      console.error("❌ Database setup failed:", error);
      process.exit(1);
    });
}

export { setupDatabase };
