const router = require('express').Router();
const { Category, Product } = require('../../models');

// The `/api/categories` endpoint

router.get('/', async (req, res) => {
  // find all categories
  // be sure to include its associated Products
  try {
    const categoryData = await Category.findAll ({
      include: [{ model: Product }],
    });
    res.status(200).json(categoryData);
  } catch (err) {
    console.log(err)
    res.status(500).json(err);
  }
});


router.get('/:id', async (req, res) => {
  // find one category by its `id` value
  // be sure to include its associated Products
try {
  const categoryData = await Category.findByPk(req.params.id, {
    include: [{ model: Product }],
  });
if (!categoryData) {
  res.status(404).json({ message: 'No category found with that id!'});
  return;
}

res.status(200).json(categoryData)
} catch (err) {
  console.log(err)
  res.status(500).json(err);
}

});

router.post('/', async (req, res) => {
  // create a new category
  try{ 
    const newCat = await Category.create(req.body);
    res.status(200).json(newCat);
  } catch(err) {
    console.log(err)
    res.status(400).json(err);
  }
});

router.put('/:id', async (req, res) => {
  // update a category by its `id` value
  try {
  const category = await Category.update (
    {
      category_name:req.body.category_name
    },
    {
      where: {
        id: req.params.id,
      },
    },
  );
  res.status(200).json(category);
  }catch (err) {
    console.log(err);
  }
  res.status(500).json(err);
});

router.delete('/:id',async (req, res) => {
  // delete a category by its `id` value
  try {
    const currentCat = await Category.findByPk(req.params.id);
    await currentCat.setProducts([])
    const categoryData = await currentCat.destroy();
    if(!categoryData) {
      res.status(404).json({message: 'There is no category with this id!'})
    }
    res.status(200).json(categoryData)
  } catch (err) {
    res.status(500).json(err);
  }
});

module.exports = router;
