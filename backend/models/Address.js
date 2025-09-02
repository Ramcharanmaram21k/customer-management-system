const { db } = require('../database/database')

class Address {
  // Create a new address
  static create(addressData) {
    return new Promise((resolve, reject) => {
      const { customer_id, address_line, city, state, pin_code, is_primary } = addressData
      
      const query = `
        INSERT INTO addresses (customer_id, address_line, city, state, pin_code, is_primary)
        VALUES (?, ?, ?, ?, ?, ?)
      `
      
      db.run(query, [customer_id, address_line, city, state, pin_code, is_primary || 0], function(err) {
        if (err) {
          reject(err)
        } else {
          resolve({ id: this.lastID, ...addressData })
        }
      })
    })
  }

  // Get addresses by customer ID
  static getByCustomerId(customerId) {
    return new Promise((resolve, reject) => {
      const query = `SELECT * FROM addresses WHERE customer_id = ? ORDER BY is_primary DESC, created_at DESC`
      
      db.all(query, [customerId], (err, rows) => {
        if (err) {
          reject(err)
        } else {
          resolve(rows)
        }
      })
    })
  }

  // Get customers with multiple addresses
  static getCustomersWithMultipleAddresses() {
    return new Promise((resolve, reject) => {
      const query = `
        SELECT c.*, COUNT(a.id) as address_count
        FROM customers c
        INNER JOIN addresses a ON c.id = a.customer_id
        GROUP BY c.id
        HAVING COUNT(a.id) > 1
        ORDER BY address_count DESC
      `
      
      db.all(query, [], (err, rows) => {
        if (err) {
          reject(err)
        } else {
          resolve(rows)
        }
      })
    })
  }

  // FIXED: This method needs to be INSIDE the class
  static getMultipleAddressCustomers() {
    return new Promise((resolve, reject) => {
      const query = `
        SELECT COUNT(*) as count
        FROM (
          SELECT customer_id
          FROM addresses
          GROUP BY customer_id
          HAVING COUNT(*) > 1
        )
      `
      
      db.get(query, [], (err, row) => {
        if (err) {
          console.error('Address query error:', err)
          reject(err)
        } else {
          resolve(row?.count || 0)
        }
      })
    })
  }

  // Update address
  static update(id, addressData) {
    return new Promise((resolve, reject) => {
      const { address_line, city, state, pin_code, is_primary } = addressData
      
      const query = `
        UPDATE addresses 
        SET address_line = ?, city = ?, state = ?, pin_code = ?, is_primary = ?, updated_at = CURRENT_TIMESTAMP
        WHERE id = ?
      `
      
      db.run(query, [address_line, city, state, pin_code, is_primary, id], function(err) {
        if (err) {
          reject(err)
        } else {
          resolve({ id, ...addressData })
        }
      })
    })
  }

  // Delete address
  static delete(id) {
    return new Promise((resolve, reject) => {
      const query = `DELETE FROM addresses WHERE id = ?`
      
      db.run(query, [id], function(err) {
        if (err) {
          reject(err)
        } else {
          resolve({ deleted: this.changes > 0 })
        }
      })
    })
  }

  // Get address by ID
  static getById(id) {
    return new Promise((resolve, reject) => {
      const query = `SELECT * FROM addresses WHERE id = ?`
      
      db.get(query, [id], (err, row) => {
        if (err) {
          reject(err)
        } else {
          resolve(row)
        }
      })
    })
  }
}

module.exports = Address
