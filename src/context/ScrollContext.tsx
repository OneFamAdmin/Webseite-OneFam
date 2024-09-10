import { createContext, MutableRefObject, ReactNode, useContext, useRef } from "react"

type ScrollRefs = {
    HomeComponent: MutableRefObject<null | HTMLDivElement>;
    FormComponent: MutableRefObject<null | HTMLDivElement>;
    ImprintComponent: MutableRefObject<null | HTMLDivElement>;
}

const defaultScrollContext: ScrollRefs = {
    HomeComponent: { current: null },
    FormComponent: { current: null },
    ImprintComponent: { current: null }
};

export const scrollContext = createContext<ScrollRefs>(defaultScrollContext);

export const ScrollProvider = ({ children }: { children: ReactNode }) => {
    const HomeComponent = useRef<HTMLDivElement>(null);
    const FormComponent = useRef<HTMLDivElement>(null);
    const ImprintComponent = useRef<HTMLDivElement>(null);

    return (
        <scrollContext.Provider value={{
            HomeComponent, FormComponent, ImprintComponent 
        }}>
            { children }
        </scrollContext.Provider>
    )
}

export const useScroll = () => useContext(scrollContext);