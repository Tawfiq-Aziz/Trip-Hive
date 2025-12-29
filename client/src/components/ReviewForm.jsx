import React, { useState } from 'react'
import { useAppContext } from '../context/AppContext'
import StarRating from './StarRating'
import { toast } from 'react-hot-toast'

const ReviewForm = ({ roomId, onReviewAdded }) => {
    const { axios, getToken, user } = useAppContext()
    const [rating, setRating] = useState(5)
    const [comment, setComment] = useState('')
    const [loading, setLoading] = useState(false)

    const submitReview = async (e) => {
        e.preventDefault()
        if (!user) {
            toast.error('You must be logged in to add a review')
            return
        }
        try {
            setLoading(true)
            const { data } = await axios.post(
                '/api/reviews',
                {
                    room: roomId,
                    rating,
                    comment
                },
                {
                    headers: {
                        Authorization: `Bearer ${await getToken()}`
                    }
                }
            )
            if (data.success) {
                toast.success('Review added!')
                setComment('')
                setRating(5)
                onReviewAdded() // Refresh reviews in parent
            } else {
                toast.error(data.message)
            }
        } catch (error) {
            toast.error(error.message)
        } finally {
            setLoading(false)
        }
    }

    return (
        <form onSubmit={submitReview} className='mt-8 border-t pt-6 flex flex-col gap-4'>
            <h2 className='text-xl font-medium'>Add Your Review</h2>
            <div className='flex items-center gap-2'>
                <span>Rating:</span>
                <select
                    value={rating}
                    onChange={(e) => setRating(parseInt(e.target.value))}
                    className='border rounded px-2 py-1'
                >
                    {[5,4,3,2,1].map(r => <option key={r} value={r}>{r}</option>)}
                </select>
            </div>
            <textarea
                value={comment}
                onChange={(e) => setComment(e.target.value)}
                placeholder='Write your review here...'
                className='border rounded px-3 py-2 w-full'
                required
            />
            <button
                type='submit'
                className='bg-primary text-white rounded px-6 py-2 hover:bg-primary-dull transition'
                disabled={loading}
            >
                {loading ? 'Submitting...' : 'Submit Review'}
            </button>
        </form>
    )
}

export default ReviewForm
