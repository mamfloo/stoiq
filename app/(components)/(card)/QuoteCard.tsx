"use client"

import { useState } from "react"
import Save from "./Save"
import { Quotes } from "@/models/Quote";

export default function QuoteCard({quote, removeFromList}: {quote: Quotes, removeFromList?: (id: string) => void}) {
  const [ isSaved, setIsSaved ] = useState(quote.isSaved);
  return (
    <div className="bg-secondary border-2 border-accent rounded-lg p-5  ">
        <p>
            {quote.quote}
        </p>
        <div className="flex justify-between">
          <p className="ml-2 mt-3 text-primary font-semibold">
              - {quote.author}
          </p>
          <Save isSaved={isSaved} setIsSaved={setIsSaved} referenceId={quote._id} removeFromList={removeFromList} type="quote"/>
        </div>
    </div>
  )
}
