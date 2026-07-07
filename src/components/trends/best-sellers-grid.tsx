'use client';

import { useQuery } from '@tanstack/react-query';
import { productsOptions } from '@/entities/trend/queries';
import { formatPrice } from '@/shared/lib/format';

export function BestSellersGrid({
  categoryId,
  categoryName
}: {
  categoryId: string | null;
  categoryName: string | null;
}) {
  const { data, isLoading } = useQuery({
    ...productsOptions(categoryId ?? ''),
    enabled: Boolean(categoryId)
  });

  return (
    <section className="rounded-xl border border-[#E2E8F0] bg-white p-5 shadow-sm">
      <div className="flex items-center justify-between">
        <h2 className="text-lg font-bold text-[#1C2434]">
          인기 상품 TOP 10 {categoryName ? <span className="text-[#8A99AD]">· {categoryName}</span> : null}
        </h2>
        {data?.date ? (
          <span className="text-xs text-[#8A99AD]">
            {data.date} 수집{data.isStale ? ' (최근 수집일)' : ''}
          </span>
        ) : null}
      </div>
      <div className="mt-4">
        {!categoryId ? (
          <p className="py-8 text-center text-sm text-[#8A99AD]">카테고리를 선택하세요.</p>
        ) : isLoading ? (
          <p className="py-8 text-center text-sm text-[#8A99AD]">불러오는 중…</p>
        ) : !data?.products.length ? (
          <p className="py-8 text-center text-sm text-[#8A99AD]">수집된 상품이 없습니다.</p>
        ) : (
          <ul className="grid grid-cols-1 gap-2 sm:grid-cols-2">
            {data.products.map((product) => (
              <li key={product.rank}>
                <a
                  href={product.productUrl}
                  target="_blank"
                  rel="noreferrer"
                  className="flex items-center gap-3 rounded-lg border border-[#E2E8F0] p-3 transition-colors hover:bg-[#F9FBFD]"
                >
                  <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-md bg-[#F1F5F9] text-sm font-bold text-[#3C50E0]">
                    {product.rank}
                  </span>
                  {product.imageUrl ? (
                    // eslint-disable-next-line @next/next/no-img-element
                    <img
                      src={product.imageUrl}
                      alt=""
                      className="h-12 w-12 shrink-0 rounded-md object-cover"
                    />
                  ) : (
                    <span className="h-12 w-12 shrink-0 rounded-md bg-[#F1F5F9]" />
                  )}
                  <span className="min-w-0 flex-1">
                    <span className="block truncate text-sm font-medium text-[#1C2434]">
                      {product.productName}
                    </span>
                    <span className="mt-0.5 flex items-center gap-2 text-xs text-[#8A99AD]">
                      <span className="font-semibold text-[#1C2434]">{formatPrice(product.price)}</span>
                      {product.storeName ? <span>· {product.storeName}</span> : null}
                    </span>
                  </span>
                </a>
              </li>
            ))}
          </ul>
        )}
      </div>
    </section>
  );
}
