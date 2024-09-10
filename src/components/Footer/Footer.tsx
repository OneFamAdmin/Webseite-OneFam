import { NavLink } from "react-router-dom"

function Footer() {
  return (
    <div className="text-xl text-center leading-10 my-12 py-4 border-t-2 border-t-amber-600">
        <p>Exklusive Reisen & Events</p>
        <p>
          <NavLink className="hover:underline hover:text-amber-600" to={"/imprint"} >
              impressum
          </NavLink>
        </p>
        <p>© 2024 OneFam</p>
    </div>
  )
}

export default Footer