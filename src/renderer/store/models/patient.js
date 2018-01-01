import mongoose from 'mongoose';

export default mongoose.model('Patient', {
    name:{type:String},
    clinic_id:{type:String},
    dOB:{type:String},
    clinic_details:{type:String},
    diagnosis:{type:String},
    investigations:{
        blood_picture:{type:String},
        bone_marrow:{type:String},
        bio_chem:{type:String}
    },
    treatment:{type:String},
    entry_date:{type:String},
});
