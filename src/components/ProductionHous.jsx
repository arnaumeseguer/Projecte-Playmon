import React from 'react'
import disney from '../assets/Images/disney.png'
import marvel from '../assets/Images/marvel.jpg'
import starwars from '../assets/Images/starwars.png'
import national from '../assets/Images/national.png'
import pixar from '../assets/Images/pixar.png'

function ProductionHous() {
    const ProductionHouseList = [
        {
            id: 1,
            image: disney,
        },
        {
            id: 2,
            image: marvel,
        },
        {
            id: 3,
            image: starwars,
        },
        {
            id: 4,
            image: national,
        },
        {
            id: 5,
            image: pixar,
        },
    ]

    return (
        <div className='flex gap-5 p-2 px-5 md:px-16 '>
            {ProductionHouseList.map((item) => (
                <div className='border-[2px] border-gray-600
                rounded-lg'>
                    <img src={item.image} className='w-full' />
                </div>
            ))}
        </div>
    )
}

export default ProductionHous