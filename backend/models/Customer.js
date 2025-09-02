const { db } = require('../database/database')

class Customer {
  // Create a new customer
  static create(customerData) {
    return new Promise((resolve, reject) => {
      const { first_name, last_name, phone_number, email } = customerData
      
      const query = `
        INSERT INTO customers (first_name, last_name, phone_number, email)
        VALUES (?, ?, ?, ?)
      `
      
      db.run(query, [first_name, last_name, phone_number, email], function(err) {
        if (err) {
          reject(err)
        } else {
          resolve({ id: this.lastID, ...customerData })
        }
      })
    })
  }

  // Get all customers with pagination
  static getAll(page = 1, limit = 10, searchTerm = '') {
    return new Promise((resolve, reject) => {
      const offset = (page - 1) * limit
      
      let query = `
        SELECT c.*, 
               COUNT(a.id) as address_count
        FROM customers c
        LEFT JOIN addresses a ON c.id = a.customer_id
      `
      
      let params = []
      
      if (searchTerm) {
        query += ` WHERE LOWER(c.first_name) LIKE LOWER(?) OR LOWER(c.last_name) LIKE LOWER(?) OR c.phone_number LIKE ?`
        params = [`%${searchTerm}%`, `%${searchTerm}%`, `%${searchTerm}%`]
      }
      
      query += ` GROUP BY c.id ORDER BY c.created_at DESC LIMIT ? OFFSET ?`
      params.push(limit, offset)
      
      db.all(query, params, (err, rows) => {
        if (err) {
          reject(err)
        } else {
          // Get total count
          let countQuery = `SELECT COUNT(DISTINCT c.id) as total FROM customers c`
          let countParams = []
          
          if (searchTerm) {
            countQuery += ` WHERE LOWER(c.first_name) LIKE LOWER(?) OR LOWER(c.last_name) LIKE LOWER(?) OR c.phone_number LIKE ?`
            countParams = [`%${searchTerm}%`, `%${searchTerm}%`, `%${searchTerm}%`]
          }
          
          db.get(countQuery, countParams, (err, countResult) => {
            if (err) {
              reject(err)
            } else {
              resolve({
                customers: rows,
                total: countResult.total,
                page: parseInt(page),
                totalPages: Math.ceil(countResult.total / limit)
              })
            }
          })
        }
      })
    })
  }

  // Get customer by ID
  static getById(id) {
    return new Promise((resolve, reject) => {
      const query = `SELECT * FROM customers WHERE id = ?`
      
      db.get(query, [id], (err, row) => {
        if (err) {
          reject(err)
        } else {
          resolve(row)
        }
      })
    })
  }

  // Update customer
  static update(id, customerData) {
    return new Promise((resolve, reject) => {
      const { first_name, last_name, phone_number, email } = customerData
      
      const query = `
        UPDATE customers 
        SET first_name = ?, last_name = ?, phone_number = ?, email = ?, updated_at = CURRENT_TIMESTAMP
        WHERE id = ?
      `
      
      db.run(query, [first_name, last_name, phone_number, email, id], function(err) {
        if (err) {
          reject(err)
        } else {
          resolve({ id, ...customerData })
        }
      })
    })
  }

  // Add these methods to your Customer class:

// Get total customer count
static getCount() {
  return new Promise((resolve, reject) => {
    const query = `SELECT COUNT(*) as count FROM customers`
    
    db.get(query, [], (err, row) => {
      if (err) reject(err)
      else resolve(row.count)
    })
  })
}

// Get customers added this month
static getThisMonth() {
  return new Promise((resolve, reject) => {
    const query = `
      SELECT COUNT(*) as count 
      FROM customers 
      WHERE DATE(created_at) >= DATE('now', 'start of month')
    `
    
    db.get(query, [], (err, row) => {
      if (err) reject(err)
      else resolve(row.count)
    })
  })
}

// Get location statistics
static getLocationStats() {
  return new Promise((resolve, reject) => {
    const query = `
      SELECT a.city, COUNT(DISTINCT c.id) as customer_count
      FROM customers c
      LEFT JOIN addresses a ON c.id = a.customer_id
      WHERE a.city IS NOT NULL
      GROUP BY a.city
      ORDER BY customer_count DESC
      LIMIT 5
    `
    
    db.all(query, [], (err, rows) => {
      if (err) reject(err)
      else resolve(rows)
    })
  })
}

// Get recent customers
static getRecent(limit = 5) {
  return new Promise((resolve, reject) => {
    const query = `
      SELECT * FROM customers 
      ORDER BY created_at DESC 
      LIMIT ?
    `
    
    db.all(query, [limit], (err, rows) => {
      if (err) reject(err)
      else resolve(rows)
    })
  })
}


  // Delete customer
  static delete(id) {
    return new Promise((resolve, reject) => {
      const query = `DELETE FROM customers WHERE id = ?`
      
      db.run(query, [id], function(err) {
        if (err) {
          reject(err)
        } else {
          resolve({ deleted: this.changes > 0 })
        }
      })
    })
  }

  // FIXED: Search customers by city, state, or pincode
  static searchByLocation(searchTerm, page = 1, limit = 10) {
    return new Promise((resolve, reject) => {
      const offset = (page - 1) * limit
      
      console.log('🔍 Searching for location:', searchTerm) // DEBUG
      
      // KEY FIX: Use LEFT JOIN instead of INNER JOIN and add case-insensitive search
      const query = `
        SELECT DISTINCT c.*, 
               a.city, 
               a.state, 
               a.pin_code,
               COUNT(a.id) as address_count
        FROM customers c
        LEFT JOIN addresses a ON c.id = a.customer_id
        WHERE LOWER(a.city) LIKE LOWER(?) 
           OR LOWER(a.state) LIKE LOWER(?) 
           OR LOWER(a.pin_code) LIKE LOWER(?)
           OR LOWER(a.address_line) LIKE LOWER(?)
        GROUP BY c.id
        ORDER BY c.created_at DESC
        LIMIT ? OFFSET ?
      `
      
      // Count query for total results
      const countQuery = `
        SELECT COUNT(DISTINCT c.id) as total
        FROM customers c
        LEFT JOIN addresses a ON c.id = a.customer_id
        WHERE LOWER(a.city) LIKE LOWER(?) 
           OR LOWER(a.state) LIKE LOWER(?) 
           OR LOWER(a.pin_code) LIKE LOWER(?)
           OR LOWER(a.address_line) LIKE LOWER(?)
      `
      
      const searchPattern = `%${searchTerm}%`
      const queryParams = [searchPattern, searchPattern, searchPattern, searchPattern, limit, offset]
      const countParams = [searchPattern, searchPattern, searchPattern, searchPattern]
      
      console.log('📝 SQL Query:', query) // DEBUG
      console.log('🎯 Search Pattern:', searchPattern) // DEBUG
      
      db.all(query, queryParams, (err, rows) => {
        if (err) {
          console.error('❌ Database query error:', err)
          reject(err)
        } else {
          console.log('📊 Query results:', rows) // DEBUG
          
          // Get total count
          db.get(countQuery, countParams, (err, countResult) => {
            if (err) {
              console.error('❌ Count query error:', err)
              reject(err)
            } else {
              resolve({
                customers: rows,
                total: countResult?.total || 0,
                page: parseInt(page),
                limit: parseInt(limit)
              })
            }
          })
        }
      })
    })
  }
}

module.exports = Customer
