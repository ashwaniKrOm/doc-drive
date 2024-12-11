import { cn, formatDateTime } from "@/lib/utils";

interface Props {
    date:string;
    className?:string;
}

const DateTime = ({date,className}:Props) => {
  return (
    <p className={cn("",className)}>{formatDateTime(date)}</p>
  )
}

export default DateTime
