import { NavLink } from "react-router-dom";
import oneFamLogo from "../../assets/onefam-logo.png";

function Header() {
    return (
        <div className="flex justify-evenly items-center">
            <NavLink to='/'>
                <img className="w-32 hover:scale-110 duration-500" src={oneFamLogo} alt="" />
            </NavLink>
        </div>
    )
}

export default Header