const Joi=require("joi");

module.exports.listingSchema = Joi.object({
    listing: Joi.object({
        title:Joi.string().required(),
        description:Joi.string().required(),
        location:Joi.string().required(),
        country:Joi.string().required(),
        price:Joi.number().required().min(0),
        image: Joi.object({
            url: Joi.string().allow("", null),
            filename: Joi.string().allow("", null),
        }).required(),        
    }).required(),
});

module.exports.reviewSchema = Joi.object({
    review: Joi.object({
        rating:Joi.number().max(5).min(1).required(),
        comment:Joi.string().required(),
    }).required(),
});