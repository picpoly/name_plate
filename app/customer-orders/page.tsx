import Link from "next/link"
import Image from "next/image"
import { Button } from "@/components/ui/button"
import { Header } from "@/components/header"
import { Footer } from "@/components/footer"
import { ArrowLeft } from "lucide-react"

export default function CustomerOrdersPage() {
  // お客様の作品例
  const customerOrders = [
    {
      id: 1,
      title: "デスクトップ用ミニフィギュア",
      description:
        "シンプルでかわいい犬型の3Dフィギュア。デスク周りをさりげなく彩る、癒しのアイテムとして大変ご好評いただいています。",
      image: "/customer-order-1.jpeg",
      category: "ペットフィギュア",
      href: "/products/pet-figure",
    },
    {
      id: 2,
      title: "子どもの絵からの立体フィギュア",
      description: "お子様が描いた絵を忠実に立体化。シンプルな線画でも特徴をしっかり捉えた作品に仕上げました。",
      image: "/customer-order-2.jpeg",
      category: "子どもおえかきフィギュア",
      href: "/products/children-drawing",
    },
    {
      id: 3,
      title: "おにぎりキャラクターフィギュア",
      description: "オリジナルキャラクターを3Dフィギュア化。企業マスコットやブランドキャラクターにも最適です。",
      image: "/customer-order-3.png",
      category: "マスコットフィギュア",
      href: "/products/mascot-figure",
    },
    {
      id: 4,
      title: "カエルの王子様フィギュア",
      description: "鮮やかな色使いと愛らしい表情が魅力のキャラクターフィギュア。インテリアとしても人気です。",
      image: "/customer-order-4.jpeg",
      category: "マスコットフィギュア",
      href: "/products/mascot-figure",
    },
    {
      id: 5,
      title: "リアルなトイプードルフィギュア",
      description: "写真から作成した細部までリアルなペットフィギュア。大切なペットの姿を立体的に残せます。",
      image: "/customer-order-5.jpeg",
      category: "ペットフィギュア",
      href: "/products/pet-figure",
    },
    {
      id: 6,
      title: "植物モチーフのキャラクター",
      description: "ユニークな植物キャラクターのフィギュア。企業ノベルティや販促品としても人気があります。",
      image: "/customer-order-6.png",
      category: "マスコットフィギュア",
      href: "/products/mascot-figure",
    },
    {
      id: 7,
      title: "オリジナル龍キャラクター",
      description: "カラフルでポップなドラゴンキャラクター。子どもたちに人気の遊べるフィギュアです。",
      image: "/customer-order-7.jpeg",
      category: "マスコットフィギュア",
      href: "/products/mascot-figure",
    },
    {
      id: 8,
      title: "シンプルなキャラクターフィギュア",
      description: "ミニマルでシンプルなデザインのキャラクターフィギュア。インテリアとしてもおしゃれです。",
      image: "/customer-order-8.jpeg",
      category: "マスコットフィギュア",
      href: "/products/mascot-figure",
    },
  ]

  return (
    <div className="min-h-screen flex flex-col">
      <Header />

      <main className="flex-grow bg-white">
        <div className="container mx-auto px-4 py-8">
          <h1 className="text-3xl font-bold text-center mb-8">お客様のオーダー紹介</h1>
          <p className="text-center max-w-3xl mx-auto mb-12 text-gray-600">
            PIC&POLYでは、これまで多くのお客様のアイデアを形にしてきました。
            ここでは、実際にお客様にご注文いただいた作品の一部をご紹介します。
            あなたのアイデアを形にする参考にしてください。
          </p>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {customerOrders.map((order) => (
              <div key={order.id} className="bg-white rounded-lg shadow-md overflow-hidden">
                <div className="relative aspect-square">
                  <Image
                    src={order.image || "/placeholder.svg"}
                    alt={order.title}
                    fill
                    className="object-contain p-4"
                  />
                </div>
                <div className="p-6">
                  <div className="mb-2">
                    <span className="inline-block bg-[#f6be5a]/20 text-[#f6be5a] text-xs font-semibold px-2 py-1 rounded">
                      {order.category}
                    </span>
                  </div>
                  <h3 className="text-xl font-bold mb-2">{order.title}</h3>
                  <p className="text-gray-600 text-sm mb-4">{order.description}</p>
                  <Link href={order.href || "#"}>
                    <Button variant="outline" className="w-full border-[#f6be5a] text-[#f6be5a] hover:bg-[#f6be5a]/10">
                      同じカテゴリーを見る
                    </Button>
                  </Link>
                </div>
              </div>
            ))}
          </div>

          <div className="text-center mt-12">
            <Link href="/">
              <Button variant="outline" className="flex items-center mx-auto">
                <ArrowLeft className="mr-2 h-4 w-4" />
                トップページに戻る
              </Button>
            </Link>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  )
}
