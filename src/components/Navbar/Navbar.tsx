import { NavLink } from "react-router-dom";
import oneFamLogo from "../../assets/onefam-logo.png";
import { useScroll } from "../../context/ScrollContext";
import { RefObject } from "react";


function Navbar() {
    const handleScroll = (ref: RefObject<HTMLElement>) => {
        if (ref?.current) {
            ref.current.scrollIntoView({ behavior: "smooth" });
        }
    }

    const { HomeComponent, FormComponent, ImprintComponent } = useScroll();

    const navItems = [
        {
            id: 1,
            title: "Home",
            ref: HomeComponent
        },
        {
            id: 2,
            title: "Form",
            ref: FormComponent
        },
        {
            id: 3,
            title: "Imprint",
            ref: ImprintComponent
        }
    ];

    return (
        <div className="flex justify-evenly items-center">
            <NavLink to='/'>
                <img className="w-32 hover:scale-110 duration-500" src={oneFamLogo} alt="" />
            </NavLink>
            <ul className="list-none flex justify-evenly py-4 md:py-8">{ navItems.map((navItem) => {
                return <li className="mx-8 cursor-pointer text-lg md:text-xl">
                    <button onClick={() => {handleScroll(navItem.ref)}}>{ navItem.title }</button>
                </li>
            }) }</ul>
        </div>
    )
}

export default Navbar