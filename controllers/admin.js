const Product = require('../models/product');

exports.getAddProduct = (req, res, next) => {
  res.render('admin/edit-product', {
    pageTitle: 'Add Product',
    path: '/admin/add-product',
    editing: false
  });
};

exports.postAddProduct = (req, res, next) => {
  const title = req.body.title;
  const imageUrl = req.body.imageUrl;
  const price = req.body.price;
  const description = req.body.description;

  // Ensure req.user is defined before calling createProduct
  if (!req.user) {
    // Handle case where user is not defined
    // You might want to redirect to an error page or return an error response
    return res.status(500).send('Internal Server Error');
  }
  req.user
    .createProduct({
      title: title,
      price: price,
      imageUrl: imageUrl,
      description: description
    })
    .then(result => {
      console.log('Created Product');
      res.redirect('/admin/products');
    })
    .catch(err => {
      console.error(err);
      // Handle product creation error
      res.status(500).send('Internal Server Error');
    });
};

exports.getEditProduct = (req, res, next) => {
  const editMode = req.query.edit;
  if (!editMode) {
    return res.redirect('/');
  }
  const prodId = req.params.productId;
  req.user.getProducts({where :{id:prodId}})
  //Product.findByPk(prodId)
  .then(products=>{
    const product= products[0];
    if (!product) {
      return res.redirect('/');
    }
    res.render('admin/edit-product', {
      pageTitle: 'Edit Product',
      path: '/admin/edit-product',
      editing: editMode,
      product: product
    });
  }).catch(err=> console.log(err));
};

exports.postEditProduct = (req, res, next) => {
  const prodId = req.body.productId;
  const updatedTitle = req.body.title;
  const updatedPrice = req.body.price;
  const updatedImageUrl = req.body.imageUrl;
  const updatedDesc = req.body.description;
  Product.findByPk(prodId)
  .then(product=>{
      product.title=updatedTitle;
      product.price=updatedPrice;
      product.imageUrl=updatedImageUrl;
      product.description=updatedDesc;
      return product.save();
  })
  .then(result=>{
    console.log('Updated product')
    res.redirect('/admin/products');
  })
  .catch(err=>console.log(err));
};

exports.getProducts = (req, res, next) => {
  req.user.getProducts()
  //Product.findAll()
  .then(products => {
      res.render('admin/products', {
      prods: products,
      pageTitle: 'Admin Products',
      path: '/admin/products'
    });
  })
  .catch(err=> console.log(err));
};

exports.postDeleteProduct = (req, res, next) => {
  const prodId = req.body.productId;
  Product.findByPk(prodId).then(product=>{
      return product.destroy();
  }).then((result)=>{
    console.log('destroyed product');
    res.redirect('/admin/products');
  }).catch(err=> console.log(err));
};
