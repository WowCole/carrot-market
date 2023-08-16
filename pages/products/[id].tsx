import type { NextPage } from "next";
import Button from "@/components/button";
import Layout from "@/components/layout";
import { useRouter } from "next/router";
import { Product, User } from "@prisma/client";
import Link from "next/link";
import useMutation from "@/libs/client/useMutation";
import { cn } from "@/libs/client/utils";
import { HeartIcon } from "@heroicons/react/24/solid";
import { HeartIcon as HeartIcon_empty } from "@heroicons/react/24/outline";
import useQueryWithMutate from "@/libs/client/useQueryWithMutate";
import { queryClient } from "../_app";

interface ProductWithUser extends Product {
  user: User;
}
type ItemDetailResponse = {
  ok: boolean;
  product: ProductWithUser;
  relatedProducts: Product[];
  isLinked: boolean;
};

const ItemDetail: NextPage = () => {
  const router = useRouter();
  const { id } = router.query;

  const { data, error, isLoading, mutateQuery, refetch } =
    useQueryWithMutate<ItemDetailResponse>({
      url: `/api/products/${id}`,
      options: {
        enabled: !!id,
      },
      mutateQueryFn: (prev) => ({
        ...prev,
        isLinked: !prev?.isLinked,
      }),
    });

  const { mutate: toggleFav } = useMutation<ItemDetailResponse>(
    `/api/products/${id}/fav`,
  );
  const onFavClick = () => {
    toggleFav({});
    mutateQuery();
  };

  return (
    <Layout canGoBack>
      <div className="px-4 py-4">
        <div className="mb-8">
          <div className="h-96 bg-slate-300" />
          <div className="flex cursor-pointer items-center space-x-3 border-b border-t py-3">
            <div className="h-12 w-12 rounded-full bg-slate-300" />
            <div>
              <p className="text-sm font-medium text-gray-700">
                {isLoading ? "..." : data?.product?.user.name}
              </p>
              <Link
                href={`/profile/${data?.product?.user.id}`}
                className="text-xs font-medium text-gray-500"
              >
                View profile &rarr;
              </Link>
            </div>
          </div>
          <div className="mt-5">
            <h1 className="text-3xl font-bold text-gray-900">
              {isLoading ? "..." : data?.product?.name}
            </h1>
            <span className="mt-3 block text-2xl text-gray-900">
              {isLoading ? "..." : `$${data?.product?.price}`}
            </span>
            <p className="my-6 text-gray-700 ">
              {isLoading ? "..." : data?.product?.description}
            </p>
            <div className="flex items-center justify-between space-x-2">
              <Button large text="Talk to seller" />
              <button
                className={cn(
                  "flex items-center justify-center rounded-md p-3",
                  data?.isLinked
                    ? "text-red-400 hover:bg-red-100 hover:text-red-500"
                    : "text-gray-400 hover:bg-gray-100 hover:text-gray-500",
                )}
                onClick={onFavClick}
              >
                {data?.isLinked ? (
                  <HeartIcon className="h-6 w-6" strokeWidth={2} />
                ) : (
                  <HeartIcon_empty className="h-6 w-6" strokeWidth={2} />
                )}
              </button>
            </div>
          </div>
        </div>
        <div>
          <h2 className="text-2xl font-bold text-gray-900">Similar items</h2>
          <div className="mt-6 grid grid-cols-2 gap-4 ">
            {data?.relatedProducts?.map((product) => (
              <Link href={`/products/${product?.id}`} key={product?.id}>
                <div className="mb-4 h-56 w-full bg-slate-300" />
                <h3 className="-mb-1 text-gray-700">{product?.name}</h3>
                <span className="text-sm font-medium text-gray-900">
                  ${product?.price}
                </span>
              </Link>
            ))}
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default ItemDetail;
