// review-model.js
const db = require('../database'); // Replace with actual path to your database connection

/* ***************************
 *  add a new review
 * ************************** */
async function addReview(review_text, review_date, inv_id, account_id) {
    const sql = `
        INSERT INTO review (review_text, review_date, inv_id, account_id)
        VALUES ($1, $2, $3, $4)
        RETURNING *;
    `;
    const values = [review_text, review_date, inv_id, account_id];
    try {
        const result = await db.query(sql, values);
        return result.rows[0];
    } catch (error) {
        console.error("Error adding review:", error);
        throw error;
    }
}

/* ***************************
 *  get reviews based off account_id
 * ************************** */
async function getReviewsByAccount(account_id) {
    const sql = `
        SELECT * FROM review WHERE account_id = $1 
    `;
    try {
        const result = await db.query(sql, [account_id]);
        return result.rows;
    } catch (error) {
        console.error("Error retrieving reviews:", error);
        throw error;
    }
}

/* ***************************
 *  get reviews based off inv_id
 * ************************** */
async function getReviewsByInventory(invId) {
    const sql = `
        SELECT r.review_text, r.review_date, a.account_screen_name 
        FROM review r
        JOIN account a ON r.account_id = a.account_id
        WHERE r.inv_id = $1
        ORDER BY r.review_date DESC;
    `;
    try {
        const result = await db.query(sql, [invId]);
        return result.rows;
    } catch (error) {
        console.error("Error retrieving reviews:", error);
        throw error;
    }
}

/* ***************************
 *  update a review
 * ************************** */
async function updateReview(reviewId, newReviewText) {
    const sql = `
        UPDATE review
        SET review_text = $1, review_date = NOW()
        WHERE review_id = $2
        RETURNING *;
    `;
    try {
        const result = await db.query(sql, [newReviewText, reviewId]);
        return result.rows[0];
    } catch (error) {
        console.error("Error updating review:", error);
        throw error;
    }
}

/* ***************************
 *  delete a review based on review_id
 * ************************** */
async function deleteReview(reviewId) {
    const sql = `
        DELETE FROM review
        WHERE review_id = $1;
    `;
    try {
        const result = await db.query(sql, [reviewId]);
        return result.rowCount;
    } catch (error) {
        console.error("Error deleting review:", error);
        throw error;
    }
}

module.exports = { addReview, getReviewsByInventory, updateReview, deleteReview, getReviewsByAccount };
