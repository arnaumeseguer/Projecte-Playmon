import React from 'react'

function HeaderItem({ name, Icon, onClick, isActive, isDetailPage }) {
    return (
        <div 
            onClick={onClick}
            className={`flex items-center gap-2.5 px-4 py-1.5 md:py-2 cursor-pointer transition-all duration-300 select-none
            ${isActive 
                ? 'bg-gradient-to-r from-[#CC8400] to-[#b06d00] text-white rounded-md shadow-[0_4px_15px_rgba(204,132,0,0.4)] border border-[#ffaa22]/40 scale-105' 
                : isDetailPage 
                    ? 'text-[#CC8400]/80 hover:text-[#CC8400] hover:bg-black/20 rounded-md font-semibold'
                    : 'text-white/60 hover:text-white hover:bg-white/5 rounded-md'
            }`}
        >
            <Icon className={`text-lg transition-transform ${isActive ? 'scale-110' : ''}`} />
            {name && <h2 className='hidden lg:block text-[15px] font-medium tracking-wide whitespace-nowrap'>{name}</h2>}
        </div>
    )
}

export default HeaderItem