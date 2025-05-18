"use client"

import { useState } from "react"
import Image from "next/image"
import Link from "next/link"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"

// 商品カテゴリー
const productCategories = [
  {
    id: "all",
    name: "すべての商品",
  },
  {
    id: "figure",
    name: "フィギュア",
  },
  {
    id: "nameplate",
    name: "ネームプレート",
  },
  {
    id: "accessories",
    name: "アクセサリー",
  },
]

// 商品データ
const products = [
  {
    id: "sd-figure",
    name: "人物SDフィギュア",
    description:
      "あなたのイラストやキャラクターをかわいいSDフィギュアに。オリジナルキャラクターやファンアートを立体化します。",
    price: 25000,
    image: "/sd-figure-new.png",
    href: "/products/sd-figure",
    category: "figure",
    featured: true,
  },
  {
    id: "mascot-figure",
    name: "マスコットフィギュア",
    description: "企業やチームのマスコットキャラクターを3Dフィギュアに。イベントやプロモーションにも最適です。",
    price: 15000,
    image: "/animal-character-figure.png",
    href: "/products/mascot-figure",
    category: "figure",
    featured: true,
  },
  {
    id: "pet-figure",
    name: "ペットフィギュア",
    description: "大切なペットを精巧なフィギュアに。写真から忠実に再現し、永遠の思い出として残せます。",
    price: 15000,
    image: "/pet-figure-3.png",
    href: "/products/pet-figure",
    category: "figure",
    featured: true,
  },
  {
    id: "children-drawing",
    name: "子どもおえかきフィギュア",
    description: "お子様の描いた絵を立体的なフィギュアに。想像力豊かな作品を形にして特別な記念品に。",
    price: 9000,
    image: "/children-drawing-figure.png",
    href: "/products/children-drawing",
    category: "figure",
    featured: false,
  },
  {
    id: "nameplate-keychain",
    name: "ネームプレートキーホルダー",
    description: "オリジナルデザインのネームプレートキーホルダー。名前やメッセージを入れてパーソナライズできます。",
    price: 1300,
    image: "/nameplate-keychain-new.png",
    href: "/product",
    category: "nameplate",
    featured: true,
  },
  {
    id: "pixel-keychain",
    name: "ピクセルキーホルダー",
    description: "レトロなピクセルアートスタイルのキーホルダー。8ビット風のデザインがユニークでおしゃれ。",
    price: 1500,
    image: "/pixel-keychain-new.png",
    href: "/products/pixel-keychain",
    category: "accessories",
    featured: false,
  },
  {
    id: "pixel-stand",
    name: "ピクセルスタンド",
    description: "デスクやシェルフに飾れるピクセルアートスタンド。お気に入りのキャラクターやデザインをディスプレイに。",
    price: 2000,
    image: "/pixel-stand-new.png",
    href: "/products/pixel-stand",
    category: "accessories",
    featured: false,
  },
  {
    id: "bust-figure",
    name: "胸像フィギュア",
    description: "クラシックな胸像スタイルのフィギュア。記念品や贈り物として人気のアイテムです。",
    price: 18000,
    image: "/bust-figure-new.png",
    href: "/products/bust-figure",
    category: "figure",
    featured: false,
  },
]

export function ProductList() {
  const [selectedCategory, setSelectedCategory] = useState("all")

  // カテゴリーでフィルタリングした商品リスト
  const filteredProducts =
    selectedCategory === "all" ? products : products.filter((product) => product.category === selectedCategory)

  return (
    <>
      {/* 商品カテゴリータブ */}
      <Tabs defaultValue="all" className="w-full" onValueChange={setSelectedCategory}>
        <div className="flex justify-center mb-8">
          <TabsList className="grid grid-cols-2 md:grid-cols-4 gap-2">
            {productCategories.map((category) => (
              <TabsTrigger
                key={category.id}
                value={category.id}
                className="px-4 py-2 data-[state=active]:bg-[#f6be5a] data-[state=active]:text-white"
              >
                {category.name}
              </TabsTrigger>
            ))}
          </TabsList>
        </div>

        {/* 商品リスト - すべてのタブで同じコンテンツを表示し、フィルタリングで制御 */}
        <TabsContent value={selectedCategory} className="mt-0">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {filteredProducts.map((product) => (
              <Link href={product.href} key={product.id} className="group">
                <div className="bg-white rounded-lg overflow-hidden shadow-sm hover:shadow-md transition-shadow border border-gray-100">
                  {/* 商品画像 */}
                  <div className="relative aspect-square w-full">
                    <Image
                      src={product.image || "/placeholder.svg"}
                      alt={product.name}
                      fill
                      className="object-contain p-4 group-hover:scale-105 transition-transform duration-300"
                      sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 25vw"
                    />
                    {product.featured && (
                      <div className="absolute top-2 left-2 bg-[#f6be5a] text-white text-xs font-bold px-2 py-1 rounded">
                        人気
                      </div>
                    )}
                  </div>

                  {/* 商品情報 */}
                  <div className="p-4">
                    <h3 className="font-bold text-gray-900 mb-1 group-hover:text-[#f6be5a] transition-colors">
                      {product.name}
                    </h3>
                    <p className="text-gray-600 text-sm mb-2 line-clamp-2">{product.description}</p>
                    <p className="text-[#f6be5a] font-bold">¥{product.price.toLocaleString()}〜</p>
                  </div>
                </div>
              </Link>
            ))}
          </div>

          {/* 商品がない場合 */}
          {filteredProducts.length === 0 && (
            <div className="text-center py-12">
              <p className="text-gray-500">この商品カテゴリーには現在商品がありません。</p>
            </div>
          )}
        </TabsContent>
      </Tabs>
    </>
  )
}
