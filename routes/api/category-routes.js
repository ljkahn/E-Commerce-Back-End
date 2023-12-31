const router = require('express').Router();
const { Category, Product } = require('../../models');

router.use('/ping', (req, res) => {
  res.send('ping ')
})

// http://localhost:3001/api/categories
router.get('/', async (req, res) => {
  // Find all categories with associated products
  try {
    // Use the findAll method to find all category data
    const categoryData = await Category.findAll({
      // Include (join) the product model with the category model
      include: [{ model: Product }],
    });
    // Display success message
    res.status(200).json(categoryData);
  } catch (err) {
    // Display error message
    res.status(500).json(err);
  }
});

// http://localhost:3001/api/categories/{user provided id}
router.get('/:id', async (req, res) => {
  // Find a category by its id and include the associated products
  try {
    // Search for category with id matching the user provided id
    const categoryData = await Category.findByPk(req.params.id, {
      // Include (join) the product model with the category model
      include: [{ model: Product }],
    });

    // if no category exists with the user provided id
    if (!categoryData) {
      // Display 404 not found status code and message to the user
      res.status(404).json({ message: 'No category found with that id!' });
      return;
    }

    // Display success message
    res.status(200).json(categoryData);
  } catch (err) {
    // Display error message
    res.status(500).json(err);
  }
});

// http://localhost:3001/api/categories
router.post('/', async (req, res) => {
  // Create POST route to create a new category
  try {
    // Create a new category with the provided input from the user (req.body)
    const categoryData = await Category.create(req.body);
    // Display success message
    res.status(200).json(categoryData);
  } catch (err) {
    // Display error message
    res.status(400).json(err);
  }
});

// http://localhost:3001/api/categories/{user provided id}
router.put('/:id', async (req, res) => {
  // Create PUT route to update a category by its `id` value
  try {
    // Update the category data with the user input
    const categoryData = await Category.update(req.body, {
      // Update where category id matches provided id
      where: {
        id: req.params.id,
      },
    });

    // if no category exists with this id
    if (!categoryData) {
      // send a 404 not found status and display the message to the user
      res.status(404).json({ message: 'No category found with that id!' });
      return;
    }

    // Display success message
    res.status(200).json(categoryData);

  } catch (err) {
    // Display error message
    res.status(500).json(err);
  }
});

// http://localhost:3001/api/categories/{user provided id}
router.delete('/:id', async (req, res) => {
  // Create DELETE route to remove a category by its `id` value
  try {
    // Remove category from related products
    const productsToUpdate = await Product.findAll({
      where: {
        category_id: req.params.id
      },
    });

    // Make a promise object for the map process
    await Promise.all(
      // Map over the products with the matching category_id
      productsToUpdate.map(async (product) => {
        // Remove the reference
        await product.update({ category_id: null });
      })
    );

    // Find the category by the provided id and use destroy method
    const categoryData = await Category.destroy({
      // Delete category where id matches the provided id
      where: {
        id: req.params.id,
      },
    });

    // if no category exists with this id
    if (!categoryData) {
      // Send 404 not found response and display the message to the user
      res.status(404).json({ message: 'No category found with that id!' });
      return;
    }

    // Display success message
    res.status(200).json(categoryData);
  } catch (err) {
    // Display error message
    res.status(500).json(err);
  }
});

// Export router
module.exports = router;