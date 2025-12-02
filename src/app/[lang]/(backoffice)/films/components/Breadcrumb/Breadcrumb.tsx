"use client";
import { forwardRef, useCallback, useContext, useMemo } from "react";
import Link from "next/link";
import { BreadcrumbsContext, type BreadcrumbItem } from "./context";
import Separator from "./separator.svg";
import { BreadcrumItemView } from "./Item";

interface BreadcrumbProps {
  items?: BreadcrumbItem[]; // if provided, uses this (good for SSR/SSG)
  itemsMax?: number; // when exceeded, collapse the middle items
  separator?: React.ReactNode; // default: chevron
  ItemAppearance?: React.FC<{ children: React.ReactNode }>;
  className?: string;
  LinkComponent?: any; // pass your router Link component here for client routing (Next.js, react-router)
  renderItem?: (item: BreadcrumbItem) => React.ReactNode; // custom renderer
  schema?: boolean; // include JSON-LD
}

function stableKey(item: BreadcrumbItem) {
  return item.key ?? item.href;
}

const Breadcrumb = forwardRef<HTMLElement, BreadcrumbProps>(
  (
    {
      items: itemsProps,
      itemsMax = 6,
      separator = <Separator />,
      className = "",
      LinkComponent = Link,
      renderItem,
      ItemAppearance,
      schema = true,
    }: BreadcrumbProps,
    ref
  ) => {
    const ctx = useContext(BreadcrumbsContext);

    const items = useMemo(
      () => itemsProps ?? ctx?.items ?? [],
      [itemsProps, ctx?.items]
    );

    const shouldCollapse = itemsMax < items.length;

    const renderList = useCallback(() => {
      if (!shouldCollapse) {
        return items.map((it, idx) => (
          <BreadcrumItemView
            key={stableKey(it)}
            item={it}
            separator={idx === items.length - 1 ? null : separator}
            position={idx + 1}
            ItemAppearance={ItemAppearance}
            LinkComponent={LinkComponent}
          />
        ));
      } else {
        const headCount = Math.floor((itemsMax - 1) / 2);
        const tailCount = Math.ceil((itemsMax - 1) / 2);

        const head = items.slice(0, headCount);
        const tail = items.slice(items.length - tailCount, tailCount);
        const middle = items.slice(headCount, items.length - tailCount);
        const headNodes = head.map((it, idx) => (
          <BreadcrumItemView
            key={stableKey(it)}
            item={it}
            LinkComponent={LinkComponent}
            separator={separator}
            position={idx + 1}
            ItemAppearance={ItemAppearance}
          />
        ));
        const tailNodes = tail.map((it) => {
          return (
            <BreadcrumItemView
              key={stableKey(it)}
              item={it}
              LinkComponent={LinkComponent}
              separator={separator}
              position={0}
              ItemAppearance={ItemAppearance}
            />
          );
        });

        const ellipsisNode = (
          <li className="flex items-center" key={"ellipsis"}>
            <details className="group relative">
              <summary className="list-none cursor-pointer select-none px-2 rounded-md hover:bg-gray-100">
                …
              </summary>
              <div className="absolute z-20 mt-2 p-2 bg-white rounded shadow-md border max-w-xs">
                <ol className="flex flex-col gap-1">
                  {middle.map((it) => (
                    <li key={stableKey(it)} className="text-sm">
                      {it.href && LinkComponent ? (
                        // eslint-disable-next-line @typescript-eslint/ban-ts-comment
                        // @ts-ignore
                        <LinkComponent
                          {...("to" in it ? { to: it.to } : { href: it.href })}
                          className="truncate block"
                        >
                          {it.label}
                        </LinkComponent>
                      ) : (
                        <span className="truncate block">{it.label}</span>
                      )}
                    </li>
                  ))}
                </ol>
              </div>
            </details>
          </li>
        );
        return [...headNodes, ellipsisNode, ...tailNodes];
      }
    }, [items, shouldCollapse, itemsMax, separator, LinkComponent]);

    const jsonLd = useMemo(() => {
      if (!schema) return null;
      const list = items.map((it, idx) => ({
        "@type": "ListItem",
        position: idx + 1,
        name: typeof it.label === "string" ? it.label : undefined,
        item: it.href ?? undefined,
      }));
      return {
        "@context": "https://schema.org",
        "@type": "BreadcrumbList",
        itemListElement: list,
      };
    }, [items, schema]);

    return (
      <nav aria-label="Breadcrumb" ref={ref} className={`w-full ${className}`}>
        <ol
          className="flex items-center gap-0 overflow-hidden text-ellipsis"
          itemScope
          itemType="http://schema.org/BreadcrumbList"
        >
          {renderItem
            ? items.map((it) => <li key={stableKey(it)}>{renderItem(it)}</li>)
            : renderList()}
        </ol>

        {schema && jsonLd && (
          // eslint-disable-next-line react/no-danger
          <script type="application/ld+json">{JSON.stringify(jsonLd)}</script>
        )}
      </nav>
    );
  }
);

export default Breadcrumb;
