const mysql = require('mysql2/promise');
require('dotenv').config();

async function setupDatabase() {
  console.log('Setting up database...');
  
  // Connect to MySQL server (without specifying database)
  const connection = await mysql.createConnection({
    host: process.env.MYSQL_HOST || 'localhost',
    port: parseInt(process.env.MYSQL_PORT || '3306'),
    user: process.env.MYSQL_USER || 'root',
    password: process.env.MYSQL_PASSWORD || '',
  });
  
  try {
    // Create database if it doesn't exist
    await connection.query(`CREATE DATABASE IF NOT EXISTS \`\${process.env.MYSQL_DATABASE || 'kms_sarl'}\``);
    console.log('Database created or already exists');
    
    // Use the database
    await connection.query(`USE \`\${process.env.MYSQL_DATABASE || 'kms_sarl'}\``);
    
    // Create tables
    console.log('Creating tables...');
    
    // ADMIN USERS TABLE
    await connection.execute(`
      CREATE TABLE IF NOT EXISTS admin_users (
        id VARCHAR(36) PRIMARY KEY DEFAULT (UUID()),
        email VARCHAR(255) UNIQUE NOT NULL,
        password_hash VARCHAR(255) NOT NULL,
        full_name VARCHAR(255) NOT NULL,
        role ENUM('super_admin', 'admin', 'editor') DEFAULT 'editor',
        avatar_url TEXT,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
      )
    `);
    
    // SESSIONS TABLE
    await connection.execute(`
      CREATE TABLE IF NOT EXISTS sessions (
        id VARCHAR(36) PRIMARY KEY DEFAULT (UUID()),
        user_id VARCHAR(36) NOT NULL,
        token VARCHAR(255) UNIQUE NOT NULL,
        expires_at TIMESTAMP NOT NULL,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        FOREIGN KEY (user_id) REFERENCES admin_users(id) ON DELETE CASCADE
      )
    `);
    
    // PROJECTS TABLE
    await connection.execute(`
      CREATE TABLE IF NOT EXISTS projects (
        id VARCHAR(36) PRIMARY KEY DEFAULT (UUID()),
        title VARCHAR(255) NOT NULL,
        slug VARCHAR(255) UNIQUE NOT NULL,
        description TEXT,
        full_description TEXT,
        category ENUM('construction', 'mining', 'logistics', 'consulting', 'procurement') NOT NULL,
        client VARCHAR(255),
        location VARCHAR(255),
        start_date DATE,
        end_date DATE,
        status ENUM('completed', 'ongoing', 'upcoming') DEFAULT 'ongoing',
        featured_image TEXT,
        gallery_images JSON,
        is_featured BOOLEAN DEFAULT FALSE,
        is_published BOOLEAN DEFAULT FALSE,
        created_by VARCHAR(36),
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
        FOREIGN KEY (created_by) REFERENCES admin_users(id) ON DELETE SET NULL
      )
    `);
    
    // NEWS/BLOG TABLE
    await connection.execute(`
      CREATE TABLE IF NOT EXISTS news (
        id VARCHAR(36) PRIMARY KEY DEFAULT (UUID()),
        title VARCHAR(255) NOT NULL,
        slug VARCHAR(255) UNIQUE NOT NULL,
        excerpt TEXT,
        content LONGTEXT,
        category ENUM('company', 'industry', 'projects', 'press', 'events') DEFAULT 'company',
        featured_image TEXT,
        author_id VARCHAR(36),
        author_name VARCHAR(255),
        is_featured BOOLEAN DEFAULT FALSE,
        is_published BOOLEAN DEFAULT FALSE,
        published_at TIMESTAMP NULL,
        views INT DEFAULT 0,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
        FOREIGN KEY (author_id) REFERENCES admin_users(id) ON DELETE SET NULL
      )
    `);
    
    // SERVICES TABLE
    await connection.execute(`
      CREATE TABLE IF NOT EXISTS services (
        id VARCHAR(36) PRIMARY KEY DEFAULT (UUID()),
        title VARCHAR(255) NOT NULL,
        slug VARCHAR(255) UNIQUE NOT NULL,
        short_description TEXT,
        full_description TEXT,
        icon VARCHAR(100),
        featured_image TEXT,
        features JSON,
        sort_order INT DEFAULT 0,
        is_active BOOLEAN DEFAULT TRUE,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
      )
    `);
    
    // JOB POSTINGS TABLE
    await connection.execute(`
      CREATE TABLE IF NOT EXISTS job_postings (
        id VARCHAR(36) PRIMARY KEY DEFAULT (UUID()),
        title VARCHAR(255) NOT NULL,
        slug VARCHAR(255) UNIQUE NOT NULL,
        department VARCHAR(255) NOT NULL,
        location VARCHAR(255) DEFAULT 'Kolwezi, DRC',
        employment_type ENUM('full-time', 'part-time', 'contract', 'internship') DEFAULT 'full-time',
        experience_level ENUM('entry', 'mid', 'senior', 'executive'),
        salary_range VARCHAR(100),
        description TEXT,
        requirements JSON,
        responsibilities JSON,
        benefits JSON,
        is_active BOOLEAN DEFAULT TRUE,
        application_deadline DATE,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
      )
    `);
    
    // JOB APPLICATIONS TABLE
    await connection.execute(`
      CREATE TABLE IF NOT EXISTS job_applications (
        id VARCHAR(36) PRIMARY KEY DEFAULT (UUID()),
        job_id VARCHAR(36),
        job_title VARCHAR(255),
        full_name VARCHAR(255) NOT NULL,
        email VARCHAR(255) NOT NULL,
        phone VARCHAR(50),
        resume_url TEXT,
        cover_letter TEXT,
        status ENUM('pending', 'reviewing', 'shortlisted', 'interviewed', 'hired', 'rejected') DEFAULT 'pending',
        notes TEXT,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
        FOREIGN KEY (job_id) REFERENCES job_postings(id) ON DELETE SET NULL
      )
    `);
    
    // CONTACT SUBMISSIONS TABLE
    await connection.execute(`
      CREATE TABLE IF NOT EXISTS contact_submissions (
        id VARCHAR(36) PRIMARY KEY DEFAULT (UUID()),
        full_name VARCHAR(255) NOT NULL,
        email VARCHAR(255) NOT NULL,
        phone VARCHAR(50),
        company VARCHAR(255),
        subject VARCHAR(255),
        service_interest VARCHAR(100),
        message TEXT NOT NULL,
        status ENUM('unread', 'read', 'responded', 'archived') DEFAULT 'unread',
        notes TEXT,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      )
    `);
    
    // SITE SETTINGS TABLE
    await connection.execute(`
      CREATE TABLE IF NOT EXISTS site_settings (
        id VARCHAR(36) PRIMARY KEY DEFAULT (UUID()),
        setting_key VARCHAR(100) UNIQUE NOT NULL,
        setting_value TEXT,
        setting_type ENUM('text', 'number', 'boolean', 'json', 'image') DEFAULT 'text',
        description TEXT,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
      )
    `);
    
    // PARTNERS/CLIENTS TABLE
    await connection.execute(`
      CREATE TABLE IF NOT EXISTS partners (
        id VARCHAR(36) PRIMARY KEY DEFAULT (UUID()),
        name VARCHAR(255) NOT NULL,
        logo_url TEXT,
        website_url TEXT,
        description TEXT,
        partner_type ENUM('client', 'partner', 'certification') DEFAULT 'client',
        sort_order INT DEFAULT 0,
        is_active BOOLEAN DEFAULT TRUE,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      )
    `);
    
    // TEAM MEMBERS TABLE
    await connection.execute(`
      CREATE TABLE IF NOT EXISTS team_members (
        id VARCHAR(36) PRIMARY KEY DEFAULT (UUID()),
        full_name VARCHAR(255) NOT NULL,
        position VARCHAR(255) NOT NULL,
        department VARCHAR(100),
        bio TEXT,
        photo_url TEXT,
        email VARCHAR(255),
        linkedin_url TEXT,
        sort_order INT DEFAULT 0,
        is_leadership BOOLEAN DEFAULT FALSE,
        is_active BOOLEAN DEFAULT TRUE,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
      )
    `);
    
    // TESTIMONIALS TABLE
    await connection.execute(`
      CREATE TABLE IF NOT EXISTS testimonials (
        id VARCHAR(36) PRIMARY KEY DEFAULT (UUID()),
        client_name VARCHAR(255) NOT NULL,
        client_position VARCHAR(255),
        client_company VARCHAR(255),
        client_photo TEXT,
        content TEXT NOT NULL,
        rating INT CHECK (rating >= 1 AND rating <= 5),
        project_id VARCHAR(36),
        is_featured BOOLEAN DEFAULT FALSE,
        is_active BOOLEAN DEFAULT TRUE,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        FOREIGN KEY (project_id) REFERENCES projects(id) ON DELETE SET NULL
      )
    `);
    
    // MEDIA LIBRARY TABLE
    await connection.execute(`
      CREATE TABLE IF NOT EXISTS media_library (
        id VARCHAR(36) PRIMARY KEY DEFAULT (UUID()),
        file_name VARCHAR(255) NOT NULL,
        file_url TEXT NOT NULL,
        file_type VARCHAR(100),
        file_size INT,
        alt_text TEXT,
        folder VARCHAR(100) DEFAULT 'general',
        uploaded_by VARCHAR(36),
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        FOREIGN KEY (uploaded_by) REFERENCES admin_users(id) ON DELETE SET NULL
      )
    `);
    
    console.log('Tables created successfully');
    
    // Insert seed data
    console.log('Inserting seed data...');
    
    // Create admin user (password: admin123)
    const bcrypt = require('bcryptjs');
    const passwordHash = await bcrypt.hash('admin123', 10);
    
    await connection.execute(`
      INSERT IGNORE INTO admin_users (id, email, password_hash, full_name, role) 
      VALUES (?, ?, ?, ?, ?)
    `, [
      '1', 
      'admin@kmssarl.org', 
      passwordHash, 
      'KMS Administrator', 
      'super_admin'
    ]);
    
    // Insert sample projects
    await connection.execute(`
      INSERT IGNORE INTO projects (id, title, slug, description, category, client, location, status, is_featured, is_published) 
      VALUES 
      (?, ?, ?, ?, ?, ?, ?, ?, ?, ?),
      (?, ?, ?, ?, ?, ?, ?, ?, ?, ?),
      (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    `, [
      '1', 'Kolwezi Mining Facility Expansion', 'kolwezi-mining-facility', 'Major expansion project for a copper mining facility including new processing infrastructure.', 'mining', 'Gécamines', 'Kolwezi, Lualaba', 'completed', true, true,
      '2', 'Commercial Complex Development', 'commercial-complex', 'Multi-story commercial building with modern amenities and sustainable design.', 'construction', 'Private Client', 'Lubumbashi', 'ongoing', true, true,
      '3', 'Mining Equipment Logistics', 'mining-equipment-logistics', 'Large-scale logistics operation for transporting heavy mining equipment.', 'logistics', 'Mining Corporation', 'Kolwezi - Lubumbashi Route', 'completed', false, true
    ]);
    
    // Insert site settings
    await connection.execute(`
      INSERT IGNORE INTO site_settings (setting_key, setting_value, setting_type, description) 
      VALUES 
      (?, ?, ?, ?),
      (?, ?, ?, ?),
      (?, ?, ?, ?),
      (?, ?, ?, ?),
      (?, ?, ?, ?),
      (?, ?, ?, ?)
    `, [
      'company_name', 'KMS SARL', 'text', 'Company display name',
      'company_email', 'info@kmssarl.org', 'text', 'Primary contact email',
      'company_phone', '+243 XXX XXX XXX', 'text', 'Primary contact phone',
      'company_address', 'Kolwezi, Lualaba Province, Democratic Republic of Congo', 'text', 'Company headquarters address',
      'hero_title', 'Building Tomorrow\'s Congo Today', 'text', 'Homepage hero section title',
      'hero_subtitle', 'Premier construction, mining support, and logistics services in the Democratic Republic of Congo', 'text', 'Homepage hero section subtitle'
    ]);
    
    console.log('Seed data inserted successfully');
    console.log('\nSetup complete!');
    console.log('Default admin credentials:');
    console.log('Email: admin@kmssarl.org');
    console.log('Password: admin123');
    console.log('\nYou can now start the development server with: npm run dev');
    
  } catch (error) {
    console.error('Error setting up database:', error);
  } finally {
    await connection.end();
  }
}

// Run the setup
setupDatabase().catch(console.error);