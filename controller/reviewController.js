const foodReviewModel = require("../model/reviewModel");
const foodPlanModel = require("../model/planModel");


 async function createReviewController(req,res){
    try{
        let reviewData = req.body;
        let review = await foodReviewModel.create(reviewData);
        let rating = review.rating;
        let reviewId = review["_id"];
        let currentPlan = await foodPlanModel.findById(review.plan);
        let totalNumRating = currentPlan.reviews.length;
        let prevAvg = currentPlan.averageRating;
        if(prevAvg){
            let totalSumRating = prevAvg*totalNumRating;
            let newAvg = (totalSumRating + rating)/(totalNumRating+1);
            currentPlan.averageRating = newAvg;
        }else{
            currentPlan.averageRating = rating;
        }
        currentPlan.reviews.push(reviewId);
        await currentPlan.save();
        res.status(201).json({
            review,
            result:"created"
        })
    }
    catch(err){
        console.log(err);
        res.status(500).json({message:err.message})
    }
}


async function getAllReviewController(req,res){
    try{
        let reviews = await foodReviewModel.find()
        .populate({ path: 'user', select: 'name pic' })
        .populate({ path: 'plan', select: 'name duration price'});
        res.status(200).json({
            reviews,
            result:"all reviews sent"
        })
    }
    catch(err){
        console.log(err);
        res.status(500).json({
            message:err.message
        })
    }
}

module.exports = {
    createReviewController,
    getAllReviewController
}