import { NavLink } from "react-router-dom"
import { useTranslation } from "react-i18next"

function Footer() {
  const { t } = useTranslation()

  return (
    <div className="text-xl text-center my-12 py-4 border-t-2 border-t-amber-600">

      <p>{t("exclusiveTravelEvents")}</p>
      
      <p>
        <NavLink className="hover:underline hover:text-amber-600" to={"/imprint"} >
          Impressum
        </NavLink>
      </p>
      <p>© 2024 OneFam</p>
    </div>
  )
}

export default Footer