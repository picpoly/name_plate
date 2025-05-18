import Image from "next/image"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Header } from "@/components/header"
import { Footer } from "@/components/footer"
import { HeroSlider } from "@/components/hero-slider"
import { ChevronRight, ArrowRight } from "lucide-react"

export default function HomePage() {
  // 商品カテゴリー
  const products = [
    {
      name: "人物SDフィギュア",
      price: 25000,
      image: "/sd-figure-new.png",
      href: "/products/sd-figure",
    },
    {
      name: "マスコットフィギュア",
      price: 15000,
      image: "/animal-character-figure.png",
      href: "/products/mascot-figure",
    },
    {
      name: "ペットフィギュア",
      price: 15000,
      image: "/pet-figure-3.png",
      href: "/products/pet-figure",
    },
    {
      name: "子どもおえかきフィギュア",
      price: 9000,
      image: "/children-drawing-figure.png",
      href: "/products/children-drawing",
    },
    {
      name: "ネームプレートキーホルダー",
      price: 1300,
      image: "/custom-nameplate-new-1.png",
      href: "/product",
    },
  ]

  // お知らせ
  const news = [
    {
      date: "2025.05.12",
      title: "ECサイトをオープンしました！",
      href: "/news/2025-05-12",
    },
  ]

  return (
    <div className="min-h-screen flex flex-col">
      <Header />

      <main className="flex-grow">
        {/* メインビジュアル */}
        <HeroSlider />

        {/* プロモーションバナー */}
        <section className="py-6 bg-white">
          <div className="container mx-auto px-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {/* フィギュアバナー */}
              <Link href="/products/figure" className="block">
                <div className="relative rounded-md overflow-hidden">
                  <Image
                    src="/figure-banner.png"
                    alt="オリジナルフィギュア"
                    width={600}
                    height={106}
                    className="w-full h-auto"
                  />
                </div>
              </Link>

              {/* LINEバナー */}
              <Link href="/line" className="block">
                <div className="relative rounded-md overflow-hidden">
                  <Image
                    src="/line-banner.png"
                    alt="LINE公式アカウント"
                    width={600}
                    height={106}
                    className="w-full h-auto"
                  />
                </div>
              </Link>
            </div>
          </div>
        </section>

        {/* お知らせ */}
        <section className="py-6 bg-white">
          <div className="container mx-auto px-4">
            <div className="border rounded-md overflow-hidden">
              <div className="bg-gray-50 px-4 py-3 border-b">
                <h2 className="font-medium">重要なお知らせ</h2>
              </div>
              <div className="p-4">
                <ul className="space-y-3">
                  {news.map((item, index) => (
                    <li key={index} className="flex items-start">
                      <span className="text-gray-500 text-sm mr-4 whitespace-nowrap">{item.date}</span>
                      <Link href={item.href} className="text-sm hover:text-[#f6be5a]">
                        {item.title}
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>
            </div>

            <div className="mt-4">
              <Link href="/news" className="flex items-center justify-end text-sm text-gray-600 hover:text-[#f6be5a]">
                <span>弊社からのメールが届かないお客様へ</span>
                <ArrowRight className="ml-1 h-4 w-4" />
              </Link>
            </div>
          </div>
        </section>

        {/* 商品カテゴリー */}
        <section className="py-10 bg-gray-50">
          <div className="container mx-auto px-4">
            <h2 className="text-2xl font-bold text-center mb-8">商品カテゴリー</h2>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {products.map((product, index) => (
                <Link
                  href={product.name === "ネームプレートキーホルダー" ? "/product" : product.href}
                  key={index}
                  className="block group"
                >
                  <div className="bg-white rounded-md overflow-hidden shadow-sm hover:shadow-md transition-shadow">
                    {/* 画像コンテナを正方形に固定し、画像を大きく表示 */}
                    <div className="relative aspect-square w-full">
                      <Image
                        src={product.image || "/placeholder.svg"}
                        alt={product.name}
                        fill
                        className="object-contain p-2 group-hover:scale-105 transition-transform duration-300"
                        sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                        style={{
                          // ネームプレートの画像の場合、縁取りをなくす
                          border: product.name === "ネームプレートキーホルダー" ? "none" : undefined,
                        }}
                      />
                    </div>
                    <div className="p-4">
                      <h3 className="font-bold text-gray-900 mb-1 group-hover:text-[#f6be5a] transition-colors">
                        {product.name}
                      </h3>
                      <p className="text-[#f6be5a] font-bold">¥{product.price.toLocaleString()}〜</p>
                    </div>
                  </div>
                </Link>
              ))}
            </div>

            <div className="text-center mt-10">
              <Link href="/customer-orders">
                <Button size="lg" className="bg-[#f6be5a] hover:bg-[#e5ad49]">
                  お客様のオーダー紹介
                  <ChevronRight className="ml-2 h-4 w-4" />
                </Button>
              </Link>
            </div>
          </div>
        </section>

        {/* 制作の流れ */}
        <section className="py-10 bg-white">
          <div className="container mx-auto px-4">
            <h2 className="text-2xl font-bold text-center mb-8">制作の流れ</h2>

            <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
              <div className="text-center">
                <div className="relative w-16 h-16 bg-[#f6be5a] rounded-full flex items-center justify-center text-white text-2xl font-bold mx-auto mb-4">
                  1
                </div>
                <h3 className="text-lg font-bold text-gray-900 mb-2">商品を選ぶ</h3>
                <p className="text-sm text-gray-600">
                  フィギュアやグッズなど、ご希望の商品カテゴリーをお選びください。
                </p>
              </div>

              <div className="text-center">
                <div className="relative w-16 h-16 bg-[#f6be5a] rounded-full flex items-center justify-center text-white text-2xl font-bold mx-auto mb-4">
                  2
                </div>
                <h3 className="text-lg font-bold text-gray-900 mb-2">データを準備</h3>
                <p className="text-sm text-gray-600">
                  イラストや写真などのデータをご用意ください。データ制作ガイドをご参照ください。
                </p>
              </div>

              <div className="text-center">
                <div className="relative w-16 h-16 bg-[#f6be5a] rounded-full flex items-center justify-center text-white text-2xl font-bold mx-auto mb-4">
                  3
                </div>
                <h3 className="text-lg font-bold text-gray-900 mb-2">注文する</h3>
                <p className="text-sm text-gray-600">カートに追加して注文完了。データ確認後、製作を開始します。</p>
              </div>

              <div className="text-center">
                <div className="relative w-16 h-16 bg-[#f6be5a] rounded-full flex items-center justify-center text-white text-2xl font-bold mx-auto mb-4">
                  4
                </div>
                <h3 className="text-lg font-bold text-gray-900 mb-2">お届け</h3>
                <p className="text-sm text-gray-600">
                  丁寧に梱包して発送。商品によって納期が異なります。詳細は商品ページをご確認ください。
                </p>
              </div>
            </div>

            <div className="text-center mt-10">
              <Link href="/guide">
                <Button variant="outline" className="border-[#f6be5a] text-[#f6be5a] hover:bg-[#f6be5a]/10">
                  詳しいご利用ガイドを見る
                  <ChevronRight className="ml-2 h-4 w-4" />
                </Button>
              </Link>
            </div>
          </div>
        </section>

        {/* 特徴 */}
        <section className="py-10 bg-gray-50">
          <div className="container mx-auto px-4">
            <h2 className="text-2xl font-bold text-center mb-8">PIC&POLYの特徴</h2>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              <div className="bg-white p-6 rounded-md shadow-sm">
                <div className="text-[#f6be5a] font-bold text-lg mb-3">高品質な仕上がり</div>
                <p className="text-sm text-gray-600">
                  最新の3Dプリンティング技術と熟練したスタッフによる丁寧な仕上げで、高品質な製品をお届けします。細部までこだわった作りで、あなたのイメージを忠実に再現します。
                </p>
              </div>

              <div className="bg-white p-6 rounded-md shadow-sm">
                <div className="text-[#f6be5a] font-bold text-lg mb-3">1個からオーダーメイド</div>
                <p className="text-sm text-gray-600">
                  最小ロット1個から製作可能。個人のお客様はもちろん、企業様のノベルティや記念品としてもご利用いただけます。オリジナルデザインで他にはない特別な製品を作成できます。
                </p>
              </div>

              <div className="bg-white p-6 rounded-md shadow-sm">
                <div className="text-[#f6be5a] font-bold text-lg mb-3">安心のサポート</div>
                <p className="text-sm text-gray-600">
                  データ作成のサポートから納品後のアフターフォローまで、経験豊富なスタッフが丁寧にサポートします。初めての方でも安心してご利用いただけるよう、わかりやすいガイドもご用意しています。
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* CTA */}
        <section className="py-10 bg-[#f6be5a] text-white">
          <div className="container mx-auto px-4 text-center">
            <h2 className="text-2xl font-bold mb-4">あなたのアイデアを形にしませんか？</h2>
            <p className="mb-6 max-w-2xl mx-auto">
              オリジナルフィギュアからアクリルグッズまで、あなたのイメージを忠実に再現します。
              1個からオーダーメイドで製作可能です。
            </p>
            <Link href="/products">
              {/* ボタンの色を修正 - 白背景に黄色テキストで視認性を向上 */}
              <Button size="lg" className="bg-white text-[#f6be5a] hover:bg-gray-100 border-2 border-white">
                商品一覧を見る
                <ChevronRight className="ml-2 h-4 w-4" />
              </Button>
            </Link>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  )
}
