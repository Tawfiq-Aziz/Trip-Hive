import User from '../models/User.js';

// Middleware to check if user is authenticated
export const protect = async (req, res, next) => {
    try {
        const {userId} = req.auth;

        if (!userId) {
            return res.json({success: false, message: 'Not authenticated'});
        }
        
        let user = await User.findById(userId);
        
        // If user doesn't exist in DB, create them automatically
        if (!user) {
            console.log('👤 Creating new user:', userId);
            user = await User.create({
                _id: userId,
                email: req.auth?.primaryEmailAddress?.emailAddress || 'email@example.com',
                username: req.auth?.firstName ? `${req.auth.firstName} ${req.auth.lastName || ''}` : 'User',
                image: req.auth?.imageUrl || ''
            });
            console.log('✅ User created:', user._id);
        }
        
        req.user = user;
        next();
    } catch (error) {
        console.error('❌ Auth middleware error:', error);
        return res.json({success: false, message: 'Authentication error: ' + error.message});
    }
}