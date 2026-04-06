import { Breadcrumb } from "@cocso-ui/react";

export default function BreadcrumbDefault() {
  return (
    <div className="p-4">
      <Breadcrumb>
        <a href="/">Home</a>
        <a href="/products">Products</a>
        <span>Detail</span>
      </Breadcrumb>
    </div>
  );
}
