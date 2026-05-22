import mysql from 'mysql2/promise'

async function setupDatabase() {
  const connection: any = await mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: '',
    port: 3306,
  })

  try {
    await connection.query('CREATE DATABASE IF NOT EXISTS taskcollab')
    await connection.query('USE taskcollab')
    console.log('✅ Database selected')

    // ============================================
    // USERS TABLE (with auth fields)
    // ============================================
    await connection.query(`
      CREATE TABLE IF NOT EXISTS users (
        id INT AUTO_INCREMENT PRIMARY KEY,
        name VARCHAR(255) NOT NULL,
        email VARCHAR(255) UNIQUE NOT NULL,
        password VARCHAR(255) NOT NULL,
        avatar VARCHAR(500),
        role VARCHAR(50) DEFAULT 'member',
        reset_token VARCHAR(255),
        reset_token_expires DATETIME,
        email_verified BOOLEAN DEFAULT FALSE,
        verification_token VARCHAR(255),
        last_login DATETIME,
        login_attempts INT DEFAULT 0,
        locked_until DATETIME,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
      )
    `)
    console.log('✅ Users table created')

    // ============================================
    // SESSIONS TABLE
    // ============================================
    await connection.query(`
      CREATE TABLE IF NOT EXISTS sessions (
        id INT AUTO_INCREMENT PRIMARY KEY,
        user_id INT NOT NULL,
        token VARCHAR(500) NOT NULL,
        refresh_token VARCHAR(500),
        ip_address VARCHAR(50),
        user_agent TEXT,
        expires_at DATETIME NOT NULL,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
      )
    `)
    console.log('✅ Sessions table created')

    // ============================================
    // PASSWORD RESET TOKENS TABLE
    // ============================================
    await connection.query(`
      CREATE TABLE IF NOT EXISTS password_resets (
        id INT AUTO_INCREMENT PRIMARY KEY,
        user_id INT NOT NULL,
        token VARCHAR(255) NOT NULL,
        expires_at DATETIME NOT NULL,
        used BOOLEAN DEFAULT FALSE,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
      )
    `)
    console.log('✅ Password resets table created')

    // ============================================
    // TASKS TABLE
    // ============================================
    await connection.query(`
      CREATE TABLE IF NOT EXISTS tasks (
        id INT AUTO_INCREMENT PRIMARY KEY,
        title VARCHAR(500) NOT NULL,
        description TEXT,
        status VARCHAR(50) DEFAULT 'todo',
        priority VARCHAR(50) DEFAULT 'medium',
        due_date DATE,
        completed_at DATETIME,
        estimated_hours INT,
        actual_hours INT,
        progress INT DEFAULT 0,
        user_id INT,
        story_points INT DEFAULT 1,
        sprint VARCHAR(100) DEFAULT 'Current',
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
        FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
      )
    `)
    console.log('✅ Tasks table created')

    // ============================================
    // COMMENTS TABLE
    // ============================================
    await connection.query(`
      CREATE TABLE IF NOT EXISTS comments (
        id INT AUTO_INCREMENT PRIMARY KEY,
        content TEXT NOT NULL,
        task_id INT,
        user_id INT,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
        FOREIGN KEY (task_id) REFERENCES tasks(id) ON DELETE CASCADE,
        FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
      )
    `)
    console.log('✅ Comments table created')

    console.log('✅ All database tables created successfully!')
  } catch (error) {
    console.error('❌ Database setup failed:', error)
  } finally {
    await connection.end()
  }
}

setupDatabase()