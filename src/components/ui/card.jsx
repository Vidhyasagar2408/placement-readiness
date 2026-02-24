function joinClassNames(...classes) {
  return classes.filter(Boolean).join(" ");
}

export function Card({ className = "", ...props }) {
  return <section className={joinClassNames("ui-card", className)} {...props} />;
}

export function CardHeader({ className = "", ...props }) {
  return <header className={joinClassNames("ui-card-header", className)} {...props} />;
}

export function CardTitle({ className = "", ...props }) {
  return <h3 className={joinClassNames("ui-card-title", className)} {...props} />;
}

export function CardContent({ className = "", ...props }) {
  return <div className={joinClassNames("ui-card-content", className)} {...props} />;
}
