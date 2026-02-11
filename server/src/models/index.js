import User from './UserModel.js';
import Provider from './ProviderModel.js';
import Location from './LocationModel.js';
import Review from './ReviewModel.js';
import ReviewReply from './ReviewReplyModel.js';

// User 1-N Provider (owner)
User.hasMany(Provider, {
  foreignKey: 'owner_id',
  as: 'providers'
});

Provider.belongsTo(User, {
  foreignKey: 'owner_id',
  as: 'owner'
});

// User 1-N Review
User.hasMany(Review, {
  foreignKey: 'user_id',
  as: 'reviews'
});

Review.belongsTo(User, {
  foreignKey: 'user_id',
  as: 'user'
});

// Provider 1-N Review
Provider.hasMany(Review, {
  foreignKey: 'provider_id',
  as: 'reviews'
});

Review.belongsTo(Provider, {
  foreignKey: 'provider_id',
  as: 'provider'
});

// Provider 1-1 Location
Provider.hasOne(Location, {
  foreignKey: 'provider_id',
  as: 'location'
});

Location.belongsTo(Provider, {
  foreignKey: 'provider_id',
  as: 'provider'
});

// Review 1-N ReviewReply
Review.hasMany(ReviewReply, {
  foreignKey: 'review_id',
  as: 'replies'
});

ReviewReply.belongsTo(Review, {
  foreignKey: 'review_id',
  as: 'review'
});

// User 1-N ReviewReply
User.hasMany(ReviewReply, {
  foreignKey: 'user_id',
  as: 'reviewReplies'
});

ReviewReply.belongsTo(User, {
  foreignKey: 'user_id',
  as: 'user'
});

export { User, Provider, Location, Review, ReviewReply };
