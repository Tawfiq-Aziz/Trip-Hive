// File: src/pages/Experience.jsx
import React, { useEffect, useState } from 'react'
import { useAppContext } from '../context/AppContext'
import StarRating from '../components/StarRating'
import { toast } from 'react-hot-toast'

const Experience = () => {
    const { axios } = useAppContext()
    const [reviews, setReviews] = useState([])

    const fetchAllReviews = async () => {
        try {
            const { data } = await axios.get('/api/reviews')
            if (data.success) {
                setReviews(data.reviews)
            } else {
                toast.error(data.message)
            }
        } catch (error) {
            toast.error(error.message)
        }
    }

    useEffect(() => {
        fetchAllReviews()
    }, [])

    return (
        <div className='py-28 md:py-35 px-4 md:px-16 lg:px-24 xl:px-32'>
            <h1 className='text-4xl font-playfair mb-8'>Guest Experiences</h1>
            {reviews.length === 0 && <p>No reviews yet. Be the first to add one!</p>}
            <div className='grid gap-6'>
                {reviews.map((review) => (
                    <div key={review._id} className='border rounded-lg p-4 shadow'>
                        <div className='flex items-center gap-2 mb-2'>
                            <StarRating rating={review.rating} />
                            <span className='text-sm text-gray-500'>by {review.user.name}</span>
                        </div>
                        <p className='text-gray-700'>{review.comment}</p>
                        <p className='text-xs text-gray-400 mt-1'>Hotel: {review.hotel.name}</p>
                    </div>
                ))}
            </div>
        </div>
    )
}

export default Experience
