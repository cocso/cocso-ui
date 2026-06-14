import { Breadcrumb } from "@cocso-ui/react";

export default function BreadcrumbSizes() {
  return (
    <div className="flex flex-col gap-4 p-4">
      <Breadcrumb size="sm">
        <a href="/">Home</a>
        <a href="/products">Products</a>
        <span>Detail</span>
      </Breadcrumb>
      <Breadcrumb size="md">
        <a href="/">Home</a>
        <a href="/products">Products</a>
        <span>Detail</span>
      </Breadcrumb>
      <Breadcrumb size="lg">
        <a href="/">Home</a>
        <a href="/products">Products</a>
        <span>Detail</span>
      </Breadcrumb>
    </div>
  );
}
