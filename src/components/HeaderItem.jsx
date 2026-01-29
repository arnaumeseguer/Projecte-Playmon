import React from 'react'

function HeaderItem({ name, Icon }) {
    return (
        <div className="text-orange-500 flex items-center gap-3
            text-[15px] font-semibold cursor-pointer hover:underline underline-offset-8
            mb-2">
            <Icon />
            <h2 className='hidden md:block'>{name}</h2>
        </div>
    )
}

export default HeaderItem