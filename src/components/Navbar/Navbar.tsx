import { NavLink, useNavigate } from "react-router-dom";
import oneFamLogo from "../../assets/onefam-logo.png";


function Navbar() {
    const navigate = useNavigate();

    const handleNavigation = (route: string) => {
        navigate(route);
    }

    const navItems = [
        {
            id: 1,
            title: "Home",
            route: "/#home"
        },
        {
            id: 2,
            title: "Vision",
            route: "/#vision"
        },
        {
            id: 3,
            title: "Philosophie",
            route: "/#philosophy"
        }
    ];

    return (
        <div className="flex justify-evenly items-center">
            <NavLink to='/'>
                <img className="w-32 hover:scale-110 duration-500" src={oneFamLogo} alt="" />
            </NavLink>
            <ul className="list-none flex justify-evenly py-4 md:py-8">{ navItems.map((navItem) => {
                return <li className="mx-8 cursor-pointer text-lg md:text-xl">
                    <button onClick={() => {handleNavigation(navItem.route)}}>{ navItem.title }</button>
                </li>
            }) }</ul>
        </div>
    )
}

export default Navbar