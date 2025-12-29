import React, { useEffect, useState } from 'react'
import { useParams } from 'react-router-dom'
import { assets, facilityIcons, roomCommonData, roomsDummyData } from './../assets/assets'
import StarRating from './../components/StarRating'
import { toast } from 'react-hot-toast' // added toast import
import { useAppContext } from './../context/AppContext' // added import for useAppContext
import ReviewForm from './../components/ReviewForm'// ✅ added

const RoomDetails = () => {
    const { id } = useParams()

    // added
    const { getToken, axios, navigate } = useAppContext()

    const [room, setRoom] = useState(null) //added

    const [mainImage, setMainImage] = useState(null)
    const [checkInDate, setCheckInDate] = useState(null)
    const [checkOutDate, setCheckOutDate] = useState(null)
    const [guests, setGuests] = useState(1)
    const [isAvailable, setIsAvailable] = useState(false) // fixed
    // ✅ added
    const [reviews, setReviews] = useState([]) 
    const [newRating, setNewRating] = useState(5) 
    const [newComment, setNewComment] = useState('')
    // ✅ added till here
    
    const checkAvailability = async () => {
        try {
            if (!checkInDate || !checkOutDate) return
            if (checkInDate >= checkOutDate) {
                toast.error('Check-In Date should be less than Check-Out Date')
                return
            }

            const { data } = await axios.post('/api/bookings/check-availibility', {
                room: id,
                checkInDate,
                checkOutDate
            })

            if (data.isAvailiable) { // API uses isAvailiable (keep same)
                setIsAvailable(true)
                toast.success('Room is Available')
            } else {
                setIsAvailable(false)
                toast.error('Room is not Available')
            }
        } catch (error) {
            toast.error(error.message)
        }
    }

    
    const onSubmitHandler = async (e) => {
        e.preventDefault() // fixed 

        if (!isAvailable) {
            return checkAvailability()
        } else {
            try {
                const { data } = await axios.post(
                    '/api/bookings/book',
                    {
                        room: id,
                        checkInDate,
                        checkOutDate,
                        guests,
                        paymentMethod: "Pay At hotel"
                    },
                    { headers: { Authorization: `Bearer ${await getToken()}` } }
                )

                if (data.success) {
                    toast.success(data.message)
                    navigate('/my-bookings')
                    window.scrollTo(0, 0)
                } else {
                    toast.error(data.message) // edited
                }
            } catch (error) {
                toast.error(error.message) //edited
            }
        }
    }

    
    useEffect(() => {
        const foundRoom = roomsDummyData.find(r => r._id === id)
        if (foundRoom) {
            setRoom(foundRoom)
            setMainImage(foundRoom.images[0])
        }
    }, [id]) //edited

    //✅ FETCH REVIEWS 
    useEffect(() => {
        const fetchReviews = async () => {
            try {
                const { data } = await axios.get(`/api/reviews/${id}`)
                if (data.success) setReviews(data.reviews)
            } catch (err) {
                console.log("Error fetching reviews:", err.message)
            }
        }
        fetchReviews()
    }, [id])

    const submitReview = async (e) => {
        e.preventDefault()
        if (!user) return toast.error("You must be logged in to submit a review")

        try {
            const { data } = await axios.post(
                "/api/reviews",
                {
                    room: id,
                    rating: newRating,
                    comment: newComment
                },
                { headers: { Authorization: `Bearer ${await getToken()}` } }
            )
            if (data.success) {
                toast.success("Review submitted successfully")
                setReviews(prev => [data.review, ...prev]) 
                setNewRating(5)
                setNewComment('')
            }
        } catch (err) {
            toast.error(err.message)
        }
    }
     //✅ till here added
  
    if (!room) return null

    return (
        <div className='py-28 md:py-35 px-4 md:px-16 lg:px-24 xl:px-32'>
            {/* Room Details */}
            <div className='flex flex-col md:flex-row items-start md:items-center gap-2'>
                <h1 className='text-3xl md:text-4xl font-playfair'>
                    {room.hotel.name} <span className='font-inter text-sm'>({room.roomType})</span>
                </h1>
                <p className='text-xs font-inter py-1.5 px-3 text-white bg-orange-500 rounded-full'>20% OFF</p>
            </div>

            {/* Room Ratings */}
            <div className='flex items-center gap-1 mt-2'>
                <StarRating />
                <p className='ml-2'>200+ Reviews</p>
            </div>

            {/* Room address */}
            <div className='flex items-center gap-1 text-gray-500 mt-2'>
                <img src={assets.locationIcon} alt='location icon' />
                <span>{room.hotel.address}</span>
            </div>

            {/* Room Images */}
            <div className='flex flex-col lg:flex-row mt-6 gap-6'>
                <div className='lg:w-1/2 w-full'>
                    <img
                        src={mainImage}
                        alt='Room Image'
                        className='w-full rounded-xl shadow-lg object-cover'
                    />
                </div>
                <div className='grid grid-cols-2 gap-4 lg:w-1/2 w-full'>
                    {room?.images.length > 1 &&
                        room.images.map((image, index) => (
                            <img
                                key={index}
                                src={image}
                                alt='Room Image'
                                className={`w-full rounded-xl shadow-md object-cover cursor-pointer ${mainImage === image ? 'outline-3 outline-orange-500' : ''}`}
                                onClick={() => setMainImage(image)}
                            />
                        ))}
                </div>
            </div>

            {/* Room highlights */}
            <div className='flex flex-col md:flex-row md:justify-between mt-10'>
                <div className='flex flex-col'>
                    <h1 className='text-3xl md:text-4xl font-playfair'>
                        Experience Luxury Like Never Before
                    </h1>
                    <div className='flex flex-wrap items-center mt-3 mb-6 gap-4'>
                        {room.amenities.map((item, index) => (
                            <div key={index} className='flex items-center gap-2 px-3 py-2 rounded-lg bg-gray-100'>
                                <img src={facilityIcons[item]} alt={item} className='w-5 h-5' />
                                <p className='text-xs'>{item}</p>
                            </div>
                        ))}
                    </div>
                </div>

                {/* Room Price */}
                <p className='text-2xl font-medium ml-auto'>${room.pricePerNight}/night</p>
            </div>

            {/* Check-In / Check-Out Form */}
            <form
                onSubmit={onSubmitHandler}
                className='flex flex-col md:flex-row items-start md:items-center justify-between bg-white shadow-[0px_0px_20px_rgba(0,0,0,0.15)] p-6 rounded-xl mx-auto mt-16 max-w-6xl'
            >
                <div className='flex flex-col flex-wrap md:flex-row items-start md:items-center gap-4 md:gap-10 text-gray-500'>

                    {/* Check-In */}
                    <div className='flex flex-col'>
                        <label htmlFor='checkInDate' className='font-medium'>Check-In</label>
                        <input
                            onChange={(e) => setCheckInDate(e.target.value)}
                            min={new Date().toISOString().split('T')[0]} //  fixed missing () after toISOString
                            type='date'
                            id='checkInDate'
                            placeholder='Check-In'
                            className='w-full rounded border border-gray-300 px-3 py-2 mt-1.5 outline-none'
                            required
                        />
                    </div>

                    <div className='w-px h-15 bg-gray-300/70 max-md:hidden'></div>

                    {/* Check-Out */}
                    <div className='flex flex-col'>
                        <label htmlFor='checkOutDate' className='font-medium'>Check-Out</label>
                        <input
                            onChange={(e) => setCheckOutDate(e.target.value)}
                            min={checkInDate || new Date().toISOString().split('T')[0]} //ensure min is valid
                            disabled={!checkInDate}
                            type='date'
                            id='checkOutDate'
                            placeholder='Check-Out'
                            className='w-full rounded border border-gray-300 px-3 py-2 mt-1.5 outline-none'
                            required
                        />
                    </div>

                    <div className='w-px h-15 bg-gray-300/70 max-md:hidden'></div>

                    {/* Guests */}
                    <div className='flex flex-col'>
                        <label htmlFor='guests' className='font-medium'>Guests</label>
                        <input
                            type='number'
                            id='guests'
                            value={guests}
                            onChange={(e) => setGuests(e.target.value)}
                            placeholder='1'
                            className='max-w-20 rounded border border-gray-300 px-3 py-2 mt-1.5 outline-none'
                            required
                        />
                    </div>
                </div>

                <button
                    type='submit'
                    className='bg-primary hover:bg-primary-dull active:scale-95 transition-all text-white rounded-md max-md:w-full max-md:mt-6 md:px-25 py-3 md:py-4 text-base cursor-pointer'
                >
                    {isAvailable ? "Book Now" : "Check Availability"}
                </button>
            </form>

            {/*  ✅ t Reviews Section  */}
            <div className='mt-16 max-w-6xl mx-auto'>
                <h2 className='text-2xl font-playfair mb-4'>Reviews</h2>

                {user && (
                    <form onSubmit={submitReview} className='flex flex-col gap-3 mb-6'>
                        <label className='font-medium'>Your Rating</label>
                        <select
                            value={newRating}
                            onChange={(e) => setNewRating(Number(e.target.value))}
                            className='w-24 border border-gray-300 rounded px-2 py-1'
                        >
                            {[1,2,3,4,5].map(n => <option key={n} value={n}>{n} Star</option>)}
                        </select>

                        <textarea
                            value={newComment}
                            onChange={(e) => setNewComment(e.target.value)}
                            placeholder='Write your review...'
                            className='border border-gray-300 rounded px-3 py-2 w-full'
                            required
                        />

                        <button type='submit' className='bg-primary text-white px-4 py-2 rounded'>
                            Submit Review
                        </button>
                    </form>
                )}

                {reviews.length === 0 && <p>No reviews yet.</p>}
                {reviews.map((rev) => (
                    <div key={rev._id} className='border-b py-4'>
                        <div className='flex items-center gap-2'>
                            <p className='font-semibold'>{rev.user.name}</p>
                            <StarRating rating={rev.rating} />
                        </div>
                        <p className='text-gray-700'>{rev.comment}</p>
                    </div>
                ))}
            </div>
            {/* ✅ t added till here */}
        </div>
    )
}

export default RoomDetails
