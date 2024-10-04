const pool = require("../database/")

/* ***************************
 *  Get all classification data
 * ************************** */
async function getClassifications(){
  return await pool.query("SELECT * FROM public.classification ORDER BY classification_name")
}

async function getSpecificItem(){
  return await pool.query("SELECT inv_make, inv_model FROM public.inventory")
}

/* ***************************
 *  Get all inventory items and classification_name by classification_id
 * ************************** */
async function getInventoryByClassificationId(classification_id) {
    try {
      const data = await pool.query(
        `SELECT * FROM public.inventory AS i 
        JOIN public.classification AS c 
        ON i.classification_id = c.classification_id 
        WHERE i.classification_id = $1`,
        [classification_id]
      )
      //console.log(data)
      return data.rows
    } catch (error) {
      console.error("getclassificationsbyid error " + error)
    }
  }

/* ***************************
 *  Get specific Item
 * ************************** */
async function getSpecificItem(invID) {
  try {
    const data = await pool.query(
      `SELECT * FROM public.inventory
      WHERE inv_id = $1`, [invID]
    )
    return data.rows[0]
  } catch (error) {
      console.error("getSpecificItem error " + error)
  }
  
}
module.exports = {getClassifications, getInventoryByClassificationId, getSpecificItem}