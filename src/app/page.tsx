import Image from "next/image";
import dbConnect from "../lib/dbConnect";

export default function Home() {
  dbConnect();
  return (
    <div> 
       <h1>Welcome to our mystery message app</h1>
        
    </div>
  );
}
