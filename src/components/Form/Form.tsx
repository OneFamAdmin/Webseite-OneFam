import { useState } from "react";
import { useScroll } from "../../context/ScrollContext";
import { useTranslation } from "react-i18next";

function Form() {
  const { t } = useTranslation();

  const [email, setEmail] = useState("");

  const handleEmail = (event: React.ChangeEvent<HTMLInputElement>) => {
    setEmail(event.target?.value);
  };

  function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    console.log("email: ", email);
  }

  const { FormComponent } = useScroll();

  return (
    <div
      ref={FormComponent}
      className="my-8 p-8 bg-gray-700 rounded-2xl text-2xl"
    >
      <h1 className="text-3xl font-bold mb-8 text-center">
        {t("joinTheFamilyHeading")}
      </h1>
      <form onSubmit={handleSubmit}>
        <div className="flex justify-center flex-col items-center">
          <input
            className="py-4 px-16 rounded-xl outline-none border-[2px] focus:border-amber-600"
            type="text"
            value={email}
            placeholder={t("emailPlaceholder")}
            onChange={handleEmail}
          />
          <button
            type="submit"
            className="bg-amber-600 rounded-xl py-4 px-16 text-md mt-8 hover:bg-transparent hover:border-amber-600 border-2 duration-300"
          >
            {t("submitButton")}
          </button>
        </div>
      </form>
    </div>
  );
}

export default Form;
