interface OptionWrapperProps {
    children: React.ReactNode;
    className?: string;
    title?: string;
    description?: string;
}
export default function OptionWrapper(props: OptionWrapperProps) {
  return (
    <div className={`bg-clientColors-card-background border border-clientColors-card-border p-4 rounded-lg ${props.className}`}>
      <p className="text-xl font-bold">{props.title}</p>
      <p>{props.description}</p>
      {props.children}
    </div>
  )
}