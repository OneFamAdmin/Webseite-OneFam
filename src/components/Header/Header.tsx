import { NavLink } from "react-router-dom";
import oneFamLogo from "../../assets/onefam-logo.png";
import Flags from "./Flags/Flags.tsx"

function Header() {
    return (
        <div className="flex justify-between items-center">
            <NavLink to='/'>
                <img className="w-32 hover:scale-110 duration-500" src={oneFamLogo} alt="" />
            </NavLink>
            <Flags />
        </div>
    )
}

export default Header