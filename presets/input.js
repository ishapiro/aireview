export default {
    input: {
        root: ({ context }) => ({
            class: [
                // Base
                'border border-surface-200',
                
                // Colors based on state
                {
                    'border-[#E8F5E9] hover:border-[#C8E6C9] focus:border-[#A5D6A7]': !context.disabled,
                    'border-surface-300 cursor-not-allowed opacity-60': context.disabled
                },
                
                // Invalid State
                { 'border-red-500': context.invalid },
                
                // Spacing
                'm-0',
                'font-sans text-surface-600',
                'p-3',
                'rounded-md',
                'transition-colors duration-200',
                
                // States
                'hover:border-[#C8E6C9]',
                'focus:outline-none focus:outline-offset-0 focus:border-[#A5D6A7] focus:ring-2 focus:ring-[#A5D6A7]/20',
                
                // Misc
                'appearance-none',
                'w-full'
            ]
        })
    }
} 