import BouncingText from "@/components/BounchingText";
import ScrolledImage from "@/components/ScrolledImage";

export default function HomePage() {
  return (
    <div className="grow max-w-7xl px-6 lg:px-8 mx-auto w-full">
      <div className="bg-red-400 h-[50vh] w-full mb-16"></div>
      <ScrolledImage/>
      <BouncingText text="huhah"/>
    </div>
  )
}
