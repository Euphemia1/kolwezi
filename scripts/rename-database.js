const mysql = require('mysql2/promise');
require('dotenv').config();

async function renameDatabase() {
  console.log('Renaming database...');
  
  // Connect to MySQL server (without specifying database)
  const connection = await mysql.createConnection({
    host: process.env.MYSQL_HOST || 'localhost',
    port: parseInt(process.env.MYSQL_PORT || '3306'),
    user: process.env.MYSQL_USER || 'root',
    password: process.env.MYSQL_PASSWORD || '',
  });
  
  try {
    // Check if the old database exists
    const [oldDbExists] = await connection.execute(
      "SELECT SCHEMA_NAME FROM information_schema.SCHEMATA WHERE SCHEMA_NAME = ?",
      ['kms_sarl']
    );
    
    if (oldDbExists.length > 0) {
      console.log('Found existing kms_sarl database. Creating new kms database...');
      
      // Create new database
      await connection.execute('CREATE DATABASE IF NOT EXISTS `kms`');
      console.log('New kms database created.');
      
      // Copy tables from old database to new database
      console.log('Copying data from kms_sarl to kms...');
      
      // Get all tables from old database
      const [tables] = await connection.execute(
        "SELECT TABLE_NAME FROM information_schema.TABLES WHERE TABLE_SCHEMA = ?",
        ['kms_sarl']
      );
      
      for (const table of tables) {
        const tableName = table.TABLE_NAME;
        console.log(`Copying table: ${tableName}`);
        
        // Create table in new database
        const [createTableResult] = await connection.execute(
          `SHOW CREATE TABLE \`kms_sarl\`.\`${tableName}\``
        );
        
        const createTableSQL = createTableResult[0]['Create Table'].replace(/`kms_sarl`/g, '`kms`');
        await connection.execute(createTableSQL);
        
        // Copy data
        await connection.execute(
          `INSERT INTO \`kms\`.\`${tableName}\` SELECT * FROM \`kms_sarl\`.\`${tableName}\``
        );
      }
      
      console.log('All tables copied successfully.');
      
      // Drop old database
      console.log('Dropping old kms_sarl database...');
      await connection.execute('DROP DATABASE `kms_sarl`');
      console.log('Old database dropped successfully.');
    } else {
      console.log('No existing kms_sarl database found. Creating new kms database...');
      await connection.execute('CREATE DATABASE IF NOT EXISTS `kms`');
      console.log('New kms database created.');
    }
    
    console.log('Database rename/setup complete!');
    console.log('You can now start the development server with: npm run dev');
    
  } catch (error) {
    console.error('Error renaming database:', error);
  } finally {
    await connection.end();
  }
}

// Run the rename
renameDatabase().catch(console.error);