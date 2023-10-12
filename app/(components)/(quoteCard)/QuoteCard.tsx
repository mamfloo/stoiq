interface Quote {
  author: string, 
  quote: string, 
  likedBy: string[], 
  savedBy: string[]
}

export default function QuoteCard({quote}: {quote: Quote}) {
  return (
    <div className="bg-secondary border-2 border-accent rounded-lg p-3">
        <p>
            {quote.quote}
        </p>
        <p className="ml-2 mt-3 text-primary font-semibold">
            - {quote.author}
        </p>

    </div>
  )
}
