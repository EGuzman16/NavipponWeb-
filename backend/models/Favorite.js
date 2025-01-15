import mongoose from 'mongoose';

const favoriteSchema = new mongoose.Schema({
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true,
    },
    experienceId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Experience',
        required: true,
    },
}, { timestamps: true });

const Favorite = mongoose.model('Favorite', favoriteSchema);

export  { Favorite };

export default favoriteSchema;
