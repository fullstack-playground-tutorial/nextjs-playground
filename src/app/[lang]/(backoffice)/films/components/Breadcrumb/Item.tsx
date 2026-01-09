import { BreadcrumbItem } from "./context";

interface BreadcrumItemViewProps {
  item: BreadcrumbItem;
  LinkComponent?: any;
  separator: React.ReactNode;
  position: number;
  ItemAppearance?: React.FC<{ children: React.ReactNode }>;
}

export function BreadcrumItemView({
  item,
  LinkComponent,
  separator,
  position,
  ItemAppearance,
}: BreadcrumItemViewProps) {
  const isLink = (item.href || item.to) && LinkComponent;
  const isCurrent = item.isCurrent ?? false;
  const content = (
    <span
      className="truncate"
      title={
        typeof item.label === "string" ? item.label : item.title || undefined
      }
    >
      {item.label}
    </span>
  );
  return (
    <li
      className="flex items-center text-sm leading-none"
      itemProp="itemListElement"
      itemScope
      itemType="http://schema.org/ListItem"
    >
      {isLink ? (
        // LinkComponent is expected to accept `href`,`to` and `children`. This keeps the breadcrumb agnostic.
        <LinkComponent
          {...("to" in item ? { to: item.to } : { href: item.href })}
          aria-current={isCurrent ? "page" : undefined}
        >
          {ItemAppearance ? (
            <ItemAppearance>
              <span itemProp="name">{content}</span>
            </ItemAppearance>
          ) : (
            <span itemProp="name">{content}</span>
          )}
        </LinkComponent>
      ) : (
        <span
          aria-current={isCurrent ? "page" : undefined}
          className={isCurrent ? "font-semibold" : "dark:text-gray-600"}
        >
          <span itemProp="name">{content}</span>
        </span>
      )}

      <meta itemProp="position" content={String(position)} />

      {separator && (
        <span className="mx-2 select-none size-6" aria-hidden>
          {separator}
        </span>
      )}
    </li>
  );
}
