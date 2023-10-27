"use client"

import { Quotes } from '@/models/Quote'
import QuoteCard from '../(card)/QuoteCard'

export default function Quotes({quotes} : {quotes: Quotes[]}) {
    return (
        <div className="flex flex-col gap-3 mt-3">
            {quotes.map((q) => (
            <QuoteCard key={q._id} quote={q} />
            ))} 
        </div>
    )
}
