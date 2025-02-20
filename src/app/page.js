"use client"
import { useEffect, useRef } from "react";
import Header from "./components/Header"
import Banner from "./components/Banner";
import Locator from "./components/Locator";
import { Provider } from 'react-redux';
import { store } from "./store";


export default function Home() {

  return (
    
      <div className="relative h-screen overflow-y-scroll scrollbar-hide p-0 no-scrollbar">
        <Header displaySearch={true} />
        {/* <Content /> */}
        <Banner />
        <Locator />
      </div>
    
    


  );
}
