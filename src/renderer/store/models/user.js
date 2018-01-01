import mongoose from 'mongoose';

export default mongoose.model('User', {
    username:{type:String},
    pw:{type:String},
    userType:{type:String}
});
