import type { HTMLAttributes } from "react";

type ProseProps = HTMLAttributes<HTMLDivElement>;

// Long-form reading measure (case studies, milestone bodies). Styling lives
// in the `.prose-editorial` layer in app.css.
export function Prose({ className = "", ...props }: ProseProps) {
  return <div className={`prose-editorial ${className}`} {...props} />;
}
