const express = require("express");

const Recipe = require("../models/recipe");
const { ensureLoggedIn } = require("../middleware/auth");
const { validateNewRecipeSchema, validateEditRecipeSchema } = require("../middleware/schemaValidator");

const router = new express.Router();

/** Get list of recipes matching search criteria
 * GET /recipes/search/:searchTerm
 * expects req.headers.authorization to be a valid token obtained from /auth/register or /auth/token
 * but the search will still work without a valid token, only returning public recipes in that case
 * returns { recipes: [{ id, ownerId, publiclyShared, name, description, imageUrl }, ...] }
 */
router.get("/search/:searchTerm", ensureLoggedIn, async function (req, res, next) {
    try {
        const username = res.locals.user && res.locals.user.username;
        const { searchTerm } = req.params;
        const recipes = await Recipe.find(username, searchTerm);
        return res.json({ recipes });
    } catch (err) {
        return next(err);
    }
});

/** Get list of own recipes
 * GET /recipes/my
 * returns { recipes: [{ id, ownerId, publiclyShared, name, description, imageUrl }, ...] }
 * expects req.headers.authorization to be a valid token obtained from /auth/register or /auth/token
 */
router.get("/my", ensureLoggedIn, async function (req, res, next) {
    try {
        const username = res.locals.user && res.locals.user.username;
        const recipes = await Recipe.getMine(username);
        return res.json({ recipes });
    } catch (err) {
        return next(err);
    }
});

/** Get list of public recipes
 * GET /recipes/public
 * returns { recipes: [{ id, ownerId, publiclyShared, name, description, imageUrl }, ...] }
 * no authorization required
 */
router.get("/public", async function (req, res, next) {
    try {
        const recipes = await Recipe.getPublic();
        return res.json({ recipes });
    } catch (err) {
        return next(err);
    }
});

/** Get details of recipe
 * GET /recipes/:id
 * expects req.headers.authorization to be a valid token obtained from /auth/register or /auth/token,
 * but only if the recipe is private; if it's publiclyShared, no user info is needed
 * returns { recipe: { id, ownerId, publiclyShared, name, description, ingredients, directions, imageUrl } }
 */
router.get("/:id", async function (req, res, next) {
    try {
        const username = res.locals.user && res.locals.user.username;
        const { id } = req.params;
        const recipe = await Recipe.get(username, id);
        return res.json({ recipe });
    } catch (err) {
        return next(err);
    }
});

/** Add new recipe
 * POST /recipes/
 * expects req.headers.authorization to be a valid token obtained from /auth/register or /auth/token
 * expects { publiclyShared, name, description, ingredients, directions, imageUrl }
 * returns { recipe: { id, ownerId, publiclyShared, name, description, ingredients, directions, imageUrl } }
 */
router.post("/", ensureLoggedIn, validateNewRecipeSchema, async function (req, res, next) {
    try {
        const username = res.locals.user && res.locals.user.username;
        const recipe = await Recipe.add(username, req.body);
        return res.status(201).json({ recipe });
    } catch (err) {
        return next(err);
    }
});

/** Update existing recipe
 * PATCH /recipes/:id
 * expects req.headers.authorization to be a valid token obtained from /auth/register or /auth/token
 * expects { publiclyShared, name, description, ingredients, directions, imageUrl }, but any not included will be left unchanged in the database
 * returns { recipe: { id, ownerId, publiclyShared, name, description, ingredients, directions, imageUrl } }
 */
router.patch("/:id", ensureLoggedIn, validateEditRecipeSchema, async function (req, res, next) {
    try {
        const username = res.locals.user && res.locals.user.username;
        const { id } = req.params;
        // inside of Recipe.edit, we will check if the user is the owner of the recipe
        const recipe = await Recipe.edit(username, id, req.body);
        return res.json({ recipe });
    } catch (err) {
        return next(err);
    }
});

/** Delete existing recipe
 * DELETE /recipes/:id
 * expects req.headers.authorization to be a valid token obtained from /auth/register or /auth/token
 * returns { deleted: { recipeId, recipeName, message } }
 */
router.delete("/:id", ensureLoggedIn, async function (req, res, next) {
    try {
        const username = res.locals.user && res.locals.user.username;
        const { id } = req.params;
        // inside of Recipe.delete, we will check if the user is the owner of the recipe
        const deleted = await Recipe.delete(username, id);
        return res.json({ deleted });
    } catch (err) {
        return next(err);
    }
});


module.exports = router;