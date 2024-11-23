import { FileUser, Loader2 } from "lucide-react";

export default function Loading() {
  return(
    <div className="flex items-center justify-center w-full h-[100vh]">

      <Loader2 className="mx-auto my-6 animate-spin" />
      
      <FileUser className="mx-auto my-6 animate-bounce w-20 h-24" />
      <Loader2 className="mx-auto my-6 animate-spin" />
    </div>
  ) 
}
