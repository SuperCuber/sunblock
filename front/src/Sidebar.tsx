import { useEffect, useState } from "react"
import "./Sidebar.scss"

interface Props {
  routes: any[],
  setRoute: (route_id: number) => void,
}

export default function Sidebar({ routes, setRoute }: Props) {
  const [search, setSearch] = useState<string>("")
  const [suggestions, setSuggestions] = useState<any[]>([])

  useEffect(() => {
    let exactMatches = routes.filter(r => r.route_short_name == search)
    if (exactMatches.length > 0) {
      setSuggestions(exactMatches)
    } else {
      setSuggestions(routes.filter(r => r.route_short_name.includes(search)))
    }
  }, [search])

  return (
    <div className="sidebar">
      <input className="sidebar--search" type="text" value={search} onChange={e => setSearch(e.target.value)} />
      {suggestions.map(s =>
        <div className="sidebar--suggestion" key={s.route_id} onClick={() => setRoute(s.route_id)}>
          <div className="sidebar--suggestion--number">{s.route_short_name}</div>
          <div className="sidebar--suggestion--description">{s.route_long_name.to}</div>
        </div>
      )}
    </div>
  )
}
