import products from "@/data/products";
import { notFound, redirect } from "next/navigation";
import { headers } from "next/headers";
import ProductDetailClient from "./ProductDetailClient";

function isMobileUserAgent(userAgent) {
  if (!userAgent) return false;
  return /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(userAgent);
}


export default async function ProductDetailPage(props) {
  const { slug } = await props.params;
  const product = products.find((p) => p.slug === slug);
  if (!product) return notFound();

  // Server-side user-agent detection: if mobile, redirect to mobile sub-route
  const headersList = await headers();
  const ua = headersList.get("user-agent") || "";
  if (isMobileUserAgent(ua)) {
    // Redirect to the dedicated mobile page
    redirect(`/products/${slug}/mobile`);
  }

  // Add homepage-like background overlay
  return (
    <>
      <div className="fixed inset-0 w-screen h-screen overflow-hidden" style={{ minHeight: '100dvh', minWidth: '100vw', zIndex: -1, pointerEvents: 'none' }}>
        <div className="absolute inset-0 bg-black" style={{ zIndex: -1, pointerEvents: 'none' }} />
        <div className="absolute inset-0 overflow-hidden" style={{ zIndex: -1, pointerEvents: 'none' }}>
          <div className="absolute inset-0 bg-black/40" style={{ zIndex: -1, pointerEvents: 'none' }} />
        </div>
      </div>
      <ProductDetailClient slug={slug} />
    </>
  );
}
