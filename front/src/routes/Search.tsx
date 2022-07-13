import { useEffect, useState } from "react"
import { useNavigate } from "react-router-dom"
import "./Search.scss"
import { Route } from "../types"

export default function Search() {
  const navigate = useNavigate()
  const [search, setSearch] = useState<string>("")
  const [suggestions, setSuggestions] = useState<Route[]>([])

  useEffect(() => {
    (async () => {
      let response = await fetch(`/api/routes/${search}`)
      if (response.ok) {
        setSuggestions(await response.json())
      }
    })()
  }, [search])

  return (
    <div className="search_route">
      <input className="search_route--search" type="text" value={search} onChange={e => setSearch(e.target.value)} />
      {suggestions.map(s =>
        <div className="search_route--suggestion" key={s.route_id} onClick={() => navigate(`/plan?route=${s.route_id}`)}>
          <div className="search_route--suggestion--agency">{s.agency_name}</div>
          <div className="search_route--suggestion--number">{s.route_short_name}</div>
          <div className="search_route--suggestion--description">{s.route_long_name.to}</div>
          <div style={{ flexGrow: 1 }} />
        </div>
      )}
    </div>
  )
}
