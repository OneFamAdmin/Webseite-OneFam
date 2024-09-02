import { useState } from "react";

type FormProps = {
    selectedOption: string;
    handleChange: (event: React.ChangeEvent<HTMLInputElement>) => void;
}

function Form({ selectedOption, handleChange }: FormProps) {
    const [email, setEmail] = useState("");

    const handleEmail = (event: React.ChangeEvent<HTMLInputElement>) => {
        setEmail(event.target?.value);
    }

    function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
        event.preventDefault();
        console.log("email: ", email);
    }

  return (
    <div className="my-8 p-8 bg-gray-600 rounded-2xl text-2xl">
        <h1 className="text-3xl font-bold mb-16 text-center">Würdest Du mitmachen?</h1>
        <form onSubmit={handleSubmit}>
            <div className="flex justify-evenly">
                <label className="cursor-pointer">
                    <input className="scale-150 cursor-pointer" style={{ marginRight: "20px" }} type="radio" value="yes" checked={selectedOption === "yes"} onChange={handleChange} />
                    <span>Yes</span>
                </label>

                <label className="cursor-pointer">
                    <input className="scale-150 cursor-pointer" style={{ marginRight: "20px" }} type="radio" value="no" checked={selectedOption === "no"} onChange={handleChange} />
                    <span>No</span>
                </label>
            </div>
            <p className="text-center text-md mt-16 mb-8">Email (Optional) um den Start nicht zu verpassen.</p>
            <div className="flex justify-center flex-col items-center">
                <input className="py-4 px-16 rounded-xl outline-none border-[2px] focus:border-amber-600" type="text" value={email} onChange={handleEmail} />
                <button type="submit" className="bg-amber-600 rounded-xl py-4 px-16 text-md mt-8 hover:bg-transparent hover:border-amber-600 border-2 duration-300">Abstimmen</button>
            </div>
        </form>
    </div>
  )
}

export default Form