import products from "@/data/products";
import { notFound } from "next/navigation";
import MobileProductDetail from "@/components/mobile/MobileProductDetail";

interface MobileProductPageProps {
  params: { slug: string };
}

export default async function MobileProductPage(props: MobileProductPageProps) {
  const { slug } = await props.params;
  const product = products.find((p) => p.slug === slug);
  if (!product) return notFound();
  return <MobileProductDetail product={product} />;
}
