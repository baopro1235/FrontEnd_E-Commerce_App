import { CircleCheck } from "lucide-react"

interface SuccessMessageProps {
  message: string
}

export default function SuccessMessage({ message }: SuccessMessageProps) {
  return (
    <p
      className="flex items-center gap-2 rounded-md border border-success/30 bg-success/10 px-4 py-3 text-sm font-medium text-success"
      role="status"
    >
      <CircleCheck aria-hidden="true" className="size-4 shrink-0" />
      {message}
    </p>
  )
}
