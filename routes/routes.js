module.exports = function(app, io) {

	// var User = require('../app/models/user');

	var secretId;
	var secretSecret;
	if (process.env.secret) { // config vars
		secretId = process.env.id;
		secretSecret = process.env.secret;
	} else { // local
		var secrets = require('../secrets');
		secretId = secrets.Id;
		secretSecret = secrets.secret;
	}
	amazon = require('amazon-product-api');
	var client = amazon.createClient({
	  awsId: secretId,
	  awsSecret: secretSecret,
	  awsTag: "awsTagAmazonInstant"
	});

	require('../app/websockets/chat_handler')(io);

    app.use(function(req, res, next) {
        res.status(404);
        if (req.accepts('html')) {
            req.flash('error', "That page does not exist.")
    		res.redirect('/');
            return;
        }
        if (req.accepts('json')) {
            res.send({
                error: 'Not found'
            });
            return;
        }
        res.type('txt').send('Not found');
    });

    app.post('/amazon_query', function(req, res) {
    	var query = req.body["query"];
    	client.itemSearch({
		  searchIndex: 'All',
		  keywords: query,
		  responseGroup: 'ItemAttributes,Offers,Images'
		}, function(err, results, response) {
		  if (err) console.log(err);
		  if (results) {
			  all_products = [];
			  for (var i=0; i<results.length; i++) {
			  	var product = results[i];
			  	var productObject = {};
			  	productObject['url'] = product.DetailPageURL[0];
			  	if (product.LargeImage) {
			  		productObject['image_url'] = product.LargeImage[0].URL[0];
			  	} else if (product.MediumImage) {
			  		productObject['image_url'] = product.MediumImage[0].URL[0];
			  	} else if (product.SmallImage) {
			  		productObject['image_url'] = product.SmallImage[0].URL[0];
			  	}
			  	var productAttributes = product.ItemAttributes[0];
			  	if (product.OfferSummary) {
			  		var productPrice = product.OfferSummary[0];
				  	if (productPrice.LowestNewPrice) {
				  		productObject['price'] = product.OfferSummary[0].LowestNewPrice[0].FormattedPrice[0];
				  	} else if (productPrice.LowestUsedPrice) {
				  		productObject['price'] = product.OfferSummary[0].LowestUsedPrice[0].FormattedPrice[0];
				  	} else if (productPrice.LowestCollectiblePrice) {
				  		productObject['price'] = product.OfferSummary[0].LowestCollectiblePrice[0].FormattedPrice[0];
				  	}
				}
			  	productObject['brand'] = productAttributes.Brand;
			  	productObject['description'] = productAttributes.Feature;
			  	productObject['group'] = productAttributes.ProductGroup;
			  	productObject['type_name'] = productAttributes.ProductTypeName;
			  	productObject['title'] = productAttributes.Title;
			  	all_products.push(productObject);
			  }
			  // console.log(all_products);
			  // console.log(all_products.length);
			  res.render('../partials/video_results.ejs', {
				results: all_products
			  });
		  }
		});
    })

	app.get('/', function(req, res) {
		res.render('room.ejs', {
			results: null
		});
	});

	// app.get('/room/:id', function(req, res, next) {
	// 	// roomname = req.params.id;
	// 	res.render('room.ejs');
	// });
}