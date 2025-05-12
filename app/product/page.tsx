"use client"

import Image from "next/image"
import { useState, useRef, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Badge } from "@/components/ui/badge"
import { ShoppingCart, Heart, Share2, Info, Slash, X, Check, ExternalLink } from "lucide-react"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Label } from "@/components/ui/label"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { useRouter } from "next/navigation"
import { useCart, type CartItem } from "@/context/cart-context"
import { v4 as uuidv4 } from "uuid"

export default function ProductPage() {
  const router = useRouter()
  const { addItem } = useCart()
  const materialTabRef = useRef(null)

  const [template, setTemplate] = useState("horizontal")
  const [charCount, setCharCount] = useState(1)
  const [price, setPrice] = useState(1300)
  const [baseTexture, setBaseTexture] = useState("normal") // "normal", "matte", "silk"
  const [textTexture, setTextTexture] = useState("normal") // "normal", "matte", "silk"
  const [baseColor, setBaseColor] = useState("#FFFFFF") // デフォルトは白
  const [baseColorName, setBaseColorName] = useState("ジェイドホワイト")
  const [textColor, setTextColor] = useState("#000000") // デフォルトは黒
  const [textColorName, setTextColorName] = useState("ブラック")
  const [inputText, setInputText] = useState("")
  const [selectedDecoration, setSelectedDecoration] = useState("none")
  const [selectedFont, setSelectedFont] = useState("overlapping")
  const [suffix, setSuffix] = useState("chan")
  const svgContainerRef = useRef(null)
  const [decorationError, setDecorationError] = useState(false)
  // 現在表示中のメイン画像を管理するステート
  const [currentMainImage, setCurrentMainImage] = useState("/custom-nameplate-new-1.png")
  // カートに追加した後のフィードバックを表示するステート
  const [addedToCart, setAddedToCart] = useState(false)
  // 現在選択されているタブ
  const [activeTab, setActiveTab] = useState("price")

  // 商品画像の配列
  const productImages = [
    { src: "/custom-nameplate-new-1.png", alt: "ネームプレートキーホルダー例 1" },
    { src: "/custom-nameplate-new-2.png", alt: "ネームプレートキーホルダー例 2" },
    { src: "/custom-nameplate-3.jpeg", alt: "ネームプレートキーホルダー例 3" },
    { src: "/custom-nameplate-4.jpeg", alt: "ネームプレートキーホルダー例 4" },
  ]

  // 各セクションのポップオーバー開閉状態
  const [openPopovers, setOpenPopovers] = useState({
    template: false,
    font: false,
    decoration: false,
    texture: false,
    baseColor: false,
    textColor: false,
    preview: false,
    suffix: false,
    attachment: false,
    text: false,
  })

  // ポップオーバーの開閉を制御する関数
  const togglePopover = (name) => {
    setOpenPopovers({
      ...openPopovers,
      [name]: !openPopovers[name],
    })
  }

  // 質感タブに移動する関数
  const scrollToMaterialTab = () => {
    setActiveTab("material")
    setTimeout(() => {
      window.scrollTo({
        top: document.getElementById("product-tabs").offsetTop - 100,
        behavior: "smooth",
      })
    }, 100)
  }

  // 装飾文字の配列
  const decorations = [
    { id: "none", name: "なし", icon: <Slash className="w-full h-full p-1" /> },
    { id: "ribbon", name: "リボン", image: "/decoration-ribbon.png" },
    { id: "heart-solid", name: "ハート", image: "/decoration-heart-solid.png" },
    { id: "heart-outline", name: "ハート（輪郭）", image: "/decoration-heart-outline.png" },
    { id: "flower", name: "花", image: "/decoration-flower.png" },
    { id: "crown", name: "王冠", image: "/decoration-crown.png" },
    { id: "star-outline", name: "星（輪郭）", image: "/decoration-star-outline.png" },
    { id: "cards", name: "トランプ", image: "/decoration-cards.png" },
    { id: "gem", name: "宝石", image: "/decoration-gem.png" },
    { id: "star-solid", name: "星", image: "/decoration-star-solid.png" },
    { id: "moon", name: "月", image: "/decoration-moon.png" },
  ]

  // アタッチメントの配列
  const attachments = [
    { id: "silver", name: "シルバー", image: "/attachment-silver.png" },
    { id: "pink-gold", name: "ピンクゴールド", image: "/attachment-pink-gold.png" },
    { id: "gold", name: "ゴールド", image: "/attachment-gold.png" },
  ]

  // カラーの配列（質感別）
  const colorsByTexture = {
    normal: [
      { name: "ジェイドホワイト", hex: "#FFFFFF" },
      { name: "マゼンタ", hex: "#EC008C" },
      { name: "ゴールド", hex: "#E4BD68" },
      { name: "ミスルトーグリーン", hex: "#3F8E43" },
      { name: "レッド", hex: "#C12E1F" },
      { name: "パープル", hex: "#5E43B7" },
      { name: "ベージュ", hex: "#F7E6DE" },
      { name: "ピンク", hex: "#F55A74" },
      { name: "サンフラワーイエロー", hex: "#FEC600" },
      { name: "ブロンズ", hex: "#847D48" },
      { name: "ターコイズ", hex: "#00B1B7" },
      { name: "インディゴパープル", hex: "#482960" },
      { name: "ライトグレー", hex: "#D1D3D5" },
      { name: "ホットピンク", hex: "#F5547C" },
      { name: "イエロー", hex: "#F4EE2A" },
      { name: "ココアブラウン", hex: "#6F5034" },
      { name: "シアン", hex: "#0086D6" },
      { name: "ブルーグレー", hex: "#5B6579" },
      { name: "シルバー", hex: "#A6A9AA" },
      { name: "オレンジ", hex: "#FF6A13" },
      { name: "ブライトグリーン", hex: "#BECF00" },
      { name: "ブラウン", hex: "#9D432C" },
      { name: "ブルー", hex: "#0A2989" },
      { name: "ダークグレー", hex: "#545454" },
      { name: "グレー", hex: "#8E9089" },
      { name: "パンプキンオレンジ", hex: "#FF9016" },
      { name: "バンブーグリーン", hex: "#00AE42" },
      { name: "マルーンレッド", hex: "#9D2235" },
      { name: "コバルトブルー", hex: "#0056B8" },
      { name: "ブラック", hex: "#000000" },
    ],
    matte: [
      { name: "アイボリーホワイト", hex: "#FFFFFF" },
      { name: "ボーンホワイト", hex: "#CBC6B8" },
      { name: "デザートタン", hex: "#E8DBB7" },
      { name: "ラテブラウン", hex: "#D3B7A7" },
      { name: "キャラメル", hex: "#AE835B" },
      { name: "テラコッタ", hex: "#B15533" },
      { name: "ダークブラウン", hex: "#7D6556" },
      { name: "ダークチョコレート", hex: "#4D3324" },
      { name: "ライラックパープル", hex: "#AE96D4" },
      { name: "さくらピンク", hex: "#E8AFCF" },
      { name: "マンダリンオレンジ", hex: "#F99963" },
      { name: "レモンイエロー", hex: "#F7D959" },
      { name: "プラム", hex: "#950051" },
      { name: "スカーレットレッド", hex: "#DE4343" },
      { name: "ダークレッド", hex: "#BB3D43" },
      { name: "ダークグリーン", hex: "#68724D" },
      { name: "グラスグリーン", hex: "#61C680" },
      { name: "アップルグリーン", hex: "#C2E189" },
      { name: "アイスブルー", hex: "#A3D8E1" },
      { name: "スカイブルー", hex: "#56B7E6" },
      { name: "マリンブルー", hex: "#0078BF" },
      { name: "ダークブルー", hex: "#042F56" },
      { name: "アッシュグレー", hex: "#9B9EA0" },
      { name: "ナルドグレー", hex: "#757575" },
      { name: "チャコール", hex: "#000000" },
    ],
    silk: [
      { name: "ゴールド", hex: "#F4A925" },
      { name: "シルバー", hex: "#C8C8C8" },
      { name: "チタングレー", hex: "#5F6367" },
      { name: "ブルー", hex: "#008BDA" },
      { name: "パープル", hex: "#8671CB" },
      { name: "キャンディレッド", hex: "#D02727" },
      { name: "キャンディグリーン", hex: "#018814" },
      { name: "ローズゴールド", hex: "#BA9594" },
      { name: "ベビーブルー", hex: "#A8C6EE" },
      { name: "ピンク", hex: "#F7ADA6" },
      { name: "ミント", hex: "#96DCB9" },
      { name: "シャンパン", hex: "#F3CFB2" },
      { name: "ホワイト", hex: "#FFFFFF" },
    ],
  }

  // 質感のカテゴリー
  const textureCategories = [
    { id: "normal", name: "ノーマル" },
    { id: "matte", name: "マット" },
    { id: "silk", name: "シルク（光沢）" },
  ]

  // 現在表示すべき色の配列を取得
  const getBaseColors = () => {
    return colorsByTexture[baseTexture] || []
  }

  const getTextColors = () => {
    return colorsByTexture[textTexture] || []
  }

  // 文字数に基づいて価格を計算する関数
  const calculatePrice = (count, template, hasDecoration) => {
    const basePrice = 1300
    const isFanStyle = template === "fan"

    // 装飾文字が「なし」の場合は文字数に加算しない
    const decorationCount = hasDecoration && hasDecoration !== "none" && !isFanStyle ? 1 : 0
    const totalCount = count + decorationCount

    if (isFanStyle) {
      // 推し活風の場合の料金表に基づいた計算
      if (totalCount <= 3) return basePrice

      // 4文字以上の場合、指定された料金表に従う
      const fanPrices = [
        1300,
        1300,
        1300, // 1-3文字
        1420,
        1540,
        1660,
        1780,
        1900,
        2020,
        2140, // 4-10文字
        2260,
        2380,
        2500,
        2620,
        2740,
        2860,
        2980,
        3100,
        3220,
        3340, // 11-20文字
      ]

      // 文字数が20を超える場合は、20文字の料金に120円×超過文字数を加算
      if (totalCount <= 20) {
        return fanPrices[totalCount - 1]
      } else {
        return fanPrices[19] + (totalCount - 20) * 120
      }
    } else {
      // 横書き・縦書きの場合は現在の計算方法を維持
      if (totalCount <= 4) return basePrice
      return basePrice + (totalCount - 4) * 120
    }
  }

  // テキスト入力時の処理
  const handleTextChange = (e) => {
    const text = e.target.value
    setInputText(text)

    // 「・」「、」「。」を除いた文字数をカウント
    const countableText = text.replace(/[・、。]/g, "")
    setCharCount(countableText.length)
    setPrice(calculatePrice(countableText.length, template, selectedDecoration))
  }

  // テンプレート変更時の処理
  const handleTemplateChange = (value) => {
    setTemplate(value)

    // 推し活風が選択された場合、装飾文字が「なし」なら警告を表示
    if (value === "fan" && selectedDecoration === "none") {
      setDecorationError(true)
    } else {
      setDecorationError(false)
    }

    // 料金を再計算
    setPrice(calculatePrice(charCount, value, selectedDecoration))
  }

  const handleBaseTextureChange = (value) => {
    setBaseTexture(value)
  }

  const handleTextTextureChange = (value) => {
    setTextTexture(value)
  }

  // ベースカラー選択時の処理
  const handleBaseColorChange = (colorHex, colorName) => {
    setBaseColor(colorHex)
    setBaseColorName(colorName)
  }

  // テキストカラー選択時の処理
  const handleTextColorChange = (colorHex, colorName) => {
    setTextColor(colorHex)
    setTextColorName(colorName)
  }

  // 装飾文字選択時の処理
  const handleDecorationChange = (decorationId) => {
    setSelectedDecoration(decorationId)

    // 推し活風が選択されている場合、装飾文字が「なし」なら警告を表示
    if (template === "fan" && decorationId === "none") {
      setDecorationError(true)
    } else {
      setDecorationError(false)
    }

    // 料金を再計算
    setPrice(calculatePrice(charCount, template, decorationId))
  }

  // フォント選択時の処理
  const handleFontChange = (fontId) => {
    setSelectedFont(fontId)
  }

  // 接尾辞選択時の処理
  const handleSuffixChange = (value) => {
    setSuffix(value)
  }

  // 選択された装飾文字の画像URLを取得
  const getDecorationImage = () => {
    const decoration = decorations.find((d) => d.id === selectedDecoration)
    return decoration ? decoration.image : null
  }

  // プレビューテキストを取得
  const getPreviewText = () => {
    if (inputText) {
      return template === "fan" ? `${inputText}${getSuffixText()}` : inputText
    }
    return template === "fan" ? `名前${getSuffixText()}` : "名前"
  }

  // 接尾辞のテキストを取得
  const getSuffixText = () => {
    switch (suffix) {
      case "chan":
        return "ちゃん"
      case "kun":
        return "くん"
      case "sama":
        return "さま"
      case "san":
        return "さん"
      case "oshi":
        return "推し"
      default:
        return "ちゃん"
    }
  }

  // フォントスタイルを取得
  const getFontStyle = () => {
    switch (selectedFont) {
      case "overlapping":
        return "font-bold tracking-wide"
      case "pop":
        return "font-bold tracking-normal"
      case "mincho":
        return "font-serif tracking-normal"
      default:
        return "font-bold tracking-wide"
    }
  }

  // テンプレートに基づいてSVGのパスを取得する関数を更新
  const getTemplateSvgPath = () => {
    if (template === "horizontal") return "/horizontal-template.svg"
    if (template === "vertical") return "/vertical-template.svg"
    return "/fan-template.svg"
  }

  // SVGを使用してプレビューをレンダリング
  useEffect(() => {
    const container = svgContainerRef.current
    if (!container) return

    // コンテナをクリア
    container.innerHTML = ""

    // 背景を白に設定
    container.style.backgroundColor = "#FFFFFF"

    // テンプレートSVGを読み込む
    fetch(getTemplateSvgPath())
      .then((response) => response.text())
      .then((svgText) => {
        // SVGをDOMに追加
        container.innerHTML = svgText

        // SVGのサイズを設定
        const svgElement = container.querySelector("svg")
        if (svgElement) {
          svgElement.setAttribute("width", "100%")
          svgElement.setAttribute("height", "100%")
          svgElement.setAttribute("preserveAspectRatio", "xMidYMid meet")

          // ベース部分（cls-1クラス）の色を変更
          const baseElements = svgElement.querySelectorAll(".cls-1")
          baseElements.forEach((element) => {
            element.style.fill = baseColor
          })

          // テキスト部分（cls-2クラス）の色を変更
          const textElements = svgElement.querySelectorAll(".cls-2")
          textElements.forEach((element) => {
            element.style.fill = textColor
          })

          // 入力されたテキストを表示（必要に応じて）
          if (inputText) {
            // テキスト要素を探す（もしカスタムテキストを表示したい場合）
            let textNode = svgElement.querySelector("text.input-text")

            // なければ作成（必要に応じて）
            if (!textNode && false) {
              // 現在は無効化（SVGにすでにテキストが含まれているため）
              textNode = document.createElementNS("http://www.w3.org/2000/svg", "text")
              textNode.setAttribute("class", "input-text")
              textNode.setAttribute("fill", textColor)
              textNode.setAttribute("font-family", "sans-serif")
              textNode.setAttribute("font-weight", "bold")

              // テンプレートによって位置とスタイルを調整
              if (template === "vertical") {
                textNode.setAttribute("x", "50%")
                textNode.setAttribute("y", "50%")
                textNode.setAttribute("text-anchor", "middle")
                textNode.setAttribute("dominant-baseline", "middle")
                textNode.setAttribute("writing-mode", "tb")
                textNode.setAttribute("font-size", "48")
                textNode.setAttribute("letter-spacing", "0.1em")
              } else if (template === "fan") {
                textNode.setAttribute("x", "50%")
                textNode.setAttribute("y", "50%")
                textNode.setAttribute("text-anchor", "middle")
                textNode.setAttribute("dominant-baseline", "middle")
                textNode.setAttribute("font-size", "36")
              } else {
                textNode.setAttribute("x", "50%")
                textNode.setAttribute("y", "50%")
                textNode.setAttribute("text-anchor", "middle")
                textNode.setAttribute("dominant-baseline", "middle")
                textNode.setAttribute("font-size", "48")
              }

              svgElement.appendChild(textNode)
              textNode.textContent = getPreviewText()
            }
          }
        }

        // 装飾画像を追加する部分を削除（プレビューに装飾文字を表示しない）
      })
      .catch((error) => {
        console.error("SVGの読み込みに失敗しました", error)

        // エラー時のフォールバック表示
        container.innerHTML = `
    <svg width="100%" height="100%" viewBox="0 0 400 400" xmlns="http://www.w3.org/2000/svg">
      <rect width="100%" height="100%" fill="${baseColor}" />
      <text x="50%" y="50%" textAnchor="middle" dominantBaseline="middle" fontSize="48" fontWeight="bold" fill="${textColor}">
        ${getPreviewText()}
      </text>
    </svg>
  `
      })
  }, [template, baseColor, textColor, inputText, suffix, selectedFont])

  useEffect(() => {
    if (template === "fan" && selectedDecoration === "none") {
      setDecorationError(true)
    }

    // 初期価格を設定
    setPrice(calculatePrice(charCount, template, selectedDecoration))
  }, [])

  useEffect(() => {
    // 現在のURLをローカルストレージに保存
    localStorage.setItem("lastViewedProduct", window.location.pathname + window.location.search)
  }, [])

  const isAddToCartDisabled = () => {
    // 推し活風が選択されていて、装飾文字が「なし」の場合は無効
    return template === "fan" && selectedDecoration === "none"
  }

  // カートに商品を追加する関数
  const handleAddToCart = () => {
    const newItem: CartItem = {
      id: uuidv4(), // ユニークID生成
      name: "ネームプレートキーホルダー",
      price: price,
      quantity: 1,
      image: currentMainImage,
      customizations: {
        template,
        font: selectedFont,
        decoration: selectedDecoration,
        baseColor,
        baseColorName,
        textColor,
        textColorName,
        text: inputText || "名前",
        baseTexture, // 追加
        textTexture, // 追加
        ...(template === "fan" && { suffix }),
      },
    }

    addItem(newItem)
    setAddedToCart(true)

    // 3秒後にフィードバックをリセット
    setTimeout(() => {
      setAddedToCart(false)
    }, 3000)
  }

  // カートページに移動する関数
  const goToCart = () => {
    router.push("/cart")
  }

  // カスタムポップオーバーコンポーネント
  const InfoPopover = ({ name, title, children }) => (
    <Popover open={openPopovers[name]} onOpenChange={(open) => setOpenPopovers({ ...openPopovers, [name]: open })}>
      <PopoverTrigger asChild>
        <Button variant="ghost" size="icon" className="h-6 w-6 ml-1">
          <Info className="h-4 w-4" />
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-80 p-0 bg-white shadow-lg rounded-lg border border-gray-200">
        <div className="flex items-center justify-between bg-gray-50 px-4 py-2 rounded-t-lg border-b">
          <h4 className="font-medium text-sm">{title}について</h4>
          <Button
            variant="ghost"
            size="icon"
            className="h-6 w-6"
            onClick={() => setOpenPopovers({ ...openPopovers, [name]: false })}
          >
            <X className="h-4 w-4" />
          </Button>
        </div>
        <div className="p-4 text-sm space-y-2">{children}</div>
      </PopoverContent>
    </Popover>
  )

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex flex-col md:flex-row gap-8">
        {/* 商品画像とプレビュー */}
        <div className="w-full md:w-1/2">
          {/* メイン商品画像 - 選択された画像を表示 */}
          <div className="relative aspect-square rounded-lg overflow-hidden mb-4">
            <Image
              src={currentMainImage || "/placeholder.svg"}
              alt="ネームプレートキーホルダー"
              fill
              className="object-contain"
              priority
            />
          </div>
          {/* サブ画像ギャラリー - クリックで選択できるようにする */}
          <div className="grid grid-cols-4 gap-2">
            {productImages.map((image, index) => (
              <div
                key={index}
                className={`relative aspect-square rounded-lg overflow-hidden cursor-pointer border-2 ${
                  currentMainImage === image.src ? "border-blue-500" : "border-transparent"
                }`}
                onClick={() => setCurrentMainImage(image.src)}
              >
                <Image src={image.src || "/placeholder.svg"} alt={image.alt} fill className="object-cover" />
              </div>
            ))}
          </div>
        </div>

        {/* 商品情報 */}
        <div className="w-full md:w-1/2">
          <h1 className="text-3xl font-bold mb-2">ネームプレートキーホルダー</h1>

          <div className="mb-4">
            <Badge className="bg-green-100 text-green-800 hover:bg-green-100">４〜7営業日で発送</Badge>
            <Badge variant="outline" className="ml-2">
              人気商品
            </Badge>
          </div>

          <p className="text-2xl font-bold mb-2">¥1,300〜</p>
          <p className="text-sm text-muted-foreground mb-4">送料：全国一律185円</p>
          <p className="text-sm text-muted-foreground mb-2">※制作内容によって金額が変動します。</p>
          <p className="text-sm text-muted-foreground mb-6">※この商品は注文個数で金額変動しません</p>

          <div className="space-y-6 mb-6">
            {/* テンプレート選択 */}
            <div>
              <div className="flex items-center mb-2">
                <h3 className="font-medium">デザインテンプレート</h3>
              </div>
              <RadioGroup
                defaultValue="horizontal"
                className="grid grid-cols-3 gap-4"
                onValueChange={handleTemplateChange}
              >
                <div>
                  <RadioGroupItem value="horizontal" id="horizontal" className="peer sr-only" />
                  <Label
                    htmlFor="horizontal"
                    className="flex flex-col items-center justify-between rounded-md border-2 border-muted bg-popover p-4 hover:bg-accent hover:text-accent-foreground peer-data-[state=checked]:border-primary [&:has([data-state=checked])]:border-primary"
                  >
                    <div className="relative w-full aspect-square mb-2">
                      <Image src="/horizontal-template.png" alt="横書き" fill className="object-contain" />
                    </div>
                    <span>横書き</span>
                  </Label>
                </div>
                <div>
                  <RadioGroupItem value="vertical" id="vertical" className="peer sr-only" />
                  <Label
                    htmlFor="vertical"
                    className="flex flex-col items-center justify-between rounded-md border-2 border-muted bg-popover p-4 hover:bg-accent hover:text-accent-foreground peer-data-[state=checked]:border-primary [&:has([data-state=checked])]:border-primary"
                  >
                    <div className="relative w-full aspect-square mb-2">
                      <Image src="/vertical-template.png" alt="縦書き" fill className="object-contain" />
                    </div>
                    <span>縦書き</span>
                  </Label>
                </div>
                <div>
                  <RadioGroupItem value="fan" id="fan" className="peer sr-only" />
                  <Label
                    htmlFor="fan"
                    className="flex flex-col items-center justify-between rounded-md border-2 border-muted bg-popover p-4 hover:bg-accent hover:text-accent-foreground peer-data-[state=checked]:border-primary [&:has([data-state=checked])]:border-primary"
                  >
                    <div className="relative w-full aspect-square mb-2">
                      <Image src="/fan-template.png" alt="推し活風" fill className="object-contain" />
                    </div>
                    <span>推し活風</span>
                  </Label>
                </div>
              </RadioGroup>
            </div>

            {/* フォント選択 */}
            <div>
              <div className="flex items-center mb-2">
                <h3 className="font-medium">フォント</h3>
              </div>
              <RadioGroup
                defaultValue="overlapping"
                className="grid grid-cols-3 gap-4"
                onValueChange={handleFontChange}
              >
                <div>
                  <RadioGroupItem value="overlapping" id="overlapping" className="peer sr-only" />
                  <Label
                    htmlFor="overlapping"
                    className="flex flex-col items-center justify-between rounded-md border-2 border-muted bg-popover p-4 hover:bg-accent hover:text-accent-foreground peer-data-[state=checked]:border-primary [&:has([data-state=checked])]:border-primary"
                  >
                    <div className="relative w-full aspect-square mb-2">
                      <Image src="/font-overlapping.png" alt="かさなり文字" fill className="object-contain" />
                    </div>
                    <span className="text-center">かさなり文字</span>
                  </Label>
                </div>
                <div>
                  <RadioGroupItem value="pop" id="pop" className="peer sr-only" />
                  <Label
                    htmlFor="pop"
                    className="flex flex-col items-center justify-between rounded-md border-2 border-muted bg-popover p-4 hover:bg-accent hover:text-accent-foreground peer-data-[state=checked]:border-primary [&:has([data-state=checked])]:border-primary"
                  >
                    <div className="relative w-full aspect-square mb-2">
                      <Image src="/font-pop.png" alt="ポップ" fill className="object-contain" />
                    </div>
                    <span className="text-center">ポップ</span>
                  </Label>
                </div>
                <div>
                  <RadioGroupItem value="mincho" id="mincho" className="peer sr-only" />
                  <Label
                    htmlFor="mincho"
                    className="flex flex-col items-center justify-between rounded-md border-2 border-muted bg-popover p-4 hover:bg-accent hover:text-accent-foreground peer-data-[state=checked]:border-primary [&:has([data-state=checked])]:border-primary"
                  >
                    <div className="relative w-full aspect-square mb-2">
                      <Image src="/font-mincho.png" alt="明朝体" fill className="object-contain" />
                    </div>
                    <span className="text-center">明朝体</span>
                  </Label>
                </div>
              </RadioGroup>
            </div>

            {/* 装飾文字 */}
            <div>
              <div className="flex items-center mb-2">
                <h3 className="font-medium">装飾文字</h3>
                <InfoPopover name="decoration" title="装飾文字">
                  <p>1つのみ選択可</p>
                  {template === "fan" && <p>※推し活風の場合は必須です</p>}
                  {template !== "fan" && <p>※横書き・縦書きの場合は1文字としてカウントされます</p>}
                  <p>「なし」を選ぶと追加料金はかかりません</p>
                </InfoPopover>
              </div>
              <div className="grid grid-cols-5 gap-2">
                {decorations.map((decoration, i) => (
                  <div key={i} className="relative">
                    {/* 推し活風の場合は「なし」を選択できないようにする */}
                    {!(template === "fan" && decoration.id === "none") && (
                      <>
                        <input
                          type="radio"
                          name="decoration"
                          id={`decoration-${i}`}
                          className="peer sr-only"
                          onChange={() => handleDecorationChange(decoration.id)}
                          checked={selectedDecoration === decoration.id}
                        />
                        <label
                          htmlFor={`decoration-${i}`}
                          className={`flex flex-col items-center justify-center rounded-md border-2 border-muted bg-popover p-2 hover:bg-accent hover:text-accent-foreground peer-checked:border-primary cursor-pointer ${
                            template === "fan" && decoration.id === "none" ? "opacity-50" : ""
                          }`}
                        >
                          <div className="relative w-full aspect-square">
                            {decoration.icon ? (
                              decoration.icon
                            ) : (
                              <Image
                                src={decoration.image || "/placeholder.svg"}
                                alt={decoration.name}
                                fill
                                className="object-contain p-1"
                              />
                            )}
                          </div>
                          <span className="text-xs mt-1 text-center">{decoration.name}</span>
                        </label>
                      </>
                    )}
                  </div>
                ))}
              </div>
            </div>

            {/* ベースカラー質感 */}
            <div>
              <div className="flex items-center mb-2">
                <h3 className="font-medium">ベースカラー質感</h3>
                <InfoPopover name="baseTexture" title="ベースカラー質感">
                  <p>ノーマル：標準的な光沢のある仕上がり</p>
                  <p>マット：落ち着いた質感の艶消し仕上げ</p>
                  <p>シルク：上品な光沢感のある特殊仕上げ</p>
                </InfoPopover>
                <Button
                  variant="link"
                  size="sm"
                  className="ml-2 text-blue-500 flex items-center"
                  onClick={scrollToMaterialTab}
                >
                  <span className="text-xs">質感について</span>
                  <ExternalLink className="h-3 w-3 ml-1" />
                </Button>
              </div>
              <RadioGroup
                defaultValue="normal"
                className="grid grid-cols-3 gap-2"
                onValueChange={handleBaseTextureChange}
              >
                {textureCategories.map((texture) => (
                  <div key={texture.id}>
                    <RadioGroupItem value={texture.id} id={`base-texture-${texture.id}`} className="peer sr-only" />
                    <Label
                      htmlFor={`base-texture-${texture.id}`}
                      className="flex items-center justify-center rounded-md border-2 border-muted bg-popover p-2 hover:bg-accent hover:text-accent-foreground peer-data-[state=checked]:border-primary [&:has([data-state=checked])]:border-primary cursor-pointer"
                    >
                      {texture.name}
                    </Label>
                  </div>
                ))}
              </RadioGroup>
            </div>

            {/* ベースカラー */}
            <div>
              <div className="flex items-center mb-2">
                <h3 className="font-medium">ベースカラー</h3>
                <InfoPopover name="baseColor" title="ベースカラー">
                  <p>プレートの背景色を選択</p>
                  <p>選択した質感によって利用できる色が変わります</p>
                  <p>テキストカラーとのコントラストを考慮して選択してください</p>
                </InfoPopover>
              </div>
              <div className="grid grid-cols-6 gap-2 max-h-40 overflow-y-auto">
                {getBaseColors().map((color, i) => (
                  <div key={`base-${i}`} className="relative">
                    <input
                      type="radio"
                      name="baseColor"
                      id={`base-color-${i}`}
                      className="peer sr-only"
                      onChange={() => handleBaseColorChange(color.hex, color.name)}
                      checked={baseColor === color.hex}
                    />
                    <label
                      htmlFor={`base-color-${i}`}
                      className="flex flex-col items-center justify-center rounded-md border-2 border-muted p-2 hover:bg-accent hover:text-accent-foreground peer-checked:border-primary cursor-pointer"
                    >
                      <div className="w-8 h-8 rounded-full border" style={{ backgroundColor: color.hex }}></div>
                      <span className="text-xs mt-1 text-center line-clamp-2">{color.name}</span>
                    </label>
                  </div>
                ))}
              </div>
            </div>

            {/* テキストカラー質感 */}
            <div>
              <div className="flex items-center mb-2">
                <h3 className="font-medium">テキストカラー質感</h3>
                <InfoPopover name="textTexture" title="テキストカラー質感">
                  <p>ノーマル：標準的な光沢のある仕上がり</p>
                  <p>マット：落ち着いた質感の艶消し仕上げ</p>
                  <p>シルク：上品な光沢感のある特殊仕上げ</p>
                </InfoPopover>
                <Button
                  variant="link"
                  size="sm"
                  className="ml-2 text-blue-500 flex items-center"
                  onClick={scrollToMaterialTab}
                >
                  <span className="text-xs">質感について</span>
                  <ExternalLink className="h-3 w-3 ml-1" />
                </Button>
              </div>
              <RadioGroup
                defaultValue="normal"
                className="grid grid-cols-3 gap-2"
                onValueChange={handleTextTextureChange}
              >
                {textureCategories.map((texture) => (
                  <div key={texture.id}>
                    <RadioGroupItem value={texture.id} id={`text-texture-${texture.id}`} className="peer sr-only" />
                    <Label
                      htmlFor={`text-texture-${texture.id}`}
                      className="flex items-center justify-center rounded-md border-2 border-muted bg-popover p-2 hover:bg-accent hover:text-accent-foreground peer-data-[state=checked]:border-primary [&:has([data-state=checked])]:border-primary cursor-pointer"
                    >
                      {texture.name}
                    </Label>
                  </div>
                ))}
              </RadioGroup>
            </div>

            {/* テキストカラー */}
            <div>
              <div className="flex items-center mb-2">
                <h3 className="font-medium">テキストカラー</h3>
                <InfoPopover name="textColor" title="テキストカラー">
                  <p>文字の色を選択</p>
                  <p>選択した質感によって利��できる色が変わります</p>
                  <p>ベースカラーとのコントラストを考慮して選択してください</p>
                </InfoPopover>
              </div>
              <div className="grid grid-cols-6 gap-2 max-h-40 overflow-y-auto">
                {getTextColors().map((color, i) => (
                  <div key={`text-${i}`} className="relative">
                    <input
                      type="radio"
                      name="textColor"
                      id={`text-color-${i}`}
                      className="peer sr-only"
                      onChange={() => handleTextColorChange(color.hex, color.name)}
                      checked={textColor === color.hex}
                    />
                    <label
                      htmlFor={`text-color-${i}`}
                      className="flex flex-col items-center justify-center rounded-md border-2 border-muted p-2 hover:bg-accent hover:text-accent-foreground peer-checked:border-primary cursor-pointer"
                    >
                      <div className="w-8 h-8 rounded-full border" style={{ backgroundColor: color.hex }}></div>
                      <span className="text-xs mt-1 text-center line-clamp-2">{color.name}</span>
                    </label>
                  </div>
                ))}
              </div>
            </div>

            {/* カラープレビュー */}
            <div>
              <div className="flex items-center mb-2">
                <h3 className="font-medium">カラープレビュー</h3>
                <InfoPopover name="preview" title="カラープレビュー">
                  <p>選択した色とテンプレートのプレビュー</p>
                  <p>実際の商品と色味が若干異なる場合があります</p>
                  <p>画面下部に選択中のカラー名が表示されます</p>
                </InfoPopover>
              </div>
              <div className="relative h-64 rounded-lg overflow-hidden mb-6 border shadow-md">
                <div ref={svgContainerRef} className="w-full h-full"></div>
                <div className="absolute bottom-0 left-0 right-0 bg-black bg-opacity-70 text-white p-2 text-sm">
                  <div className="flex justify-between">
                    <span>ベース: {baseColorName}</span>
                    <span>テキスト: {textColorName}</span>
                  </div>
                </div>
              </div>
            </div>

            {/* プレートに入れる文字 */}
            <div>
              <div className="flex items-center mb-2">
                <h3 className="font-medium">プレートに入れる文字</h3>
                <InfoPopover name="text" title="プレートに入れる文字">
                  <p>プレートに入れる文字を入力（最大20文字）</p>
                  <p>ひらがな、カタカナ、漢字、英数字が使用可能</p>
                  <p>「・」「、」「。」は文字数にカウントされません</p>
                  <p>文字数によって料金が変動します</p>
                </InfoPopover>
              </div>
              <Input
                placeholder="名前やメッセージを入力"
                maxLength={20}
                value={inputText}
                onChange={handleTextChange}
              />
              <p className="text-sm text-muted-foreground mt-1">20文字以内（残り{20 - inputText.length}文字）</p>
              <p className="text-xs text-muted-foreground mt-1">※「・」「、」「。」は文字数にカウントされません</p>
            </div>

            {/* 名前のうしろにつける言葉（推し活風のみ） */}
            {template === "fan" && (
              <div>
                <div className="flex items-center mb-2">
                  <h3 className="font-medium">名前の後に付ける言葉</h3>
                  <InfoPopover name="suffix" title="名前の後に付ける言葉">
                    <p>推し活風テンプレートで名前の後に付ける言葉</p>
                    <p>「ちゃん」「くん」「さま」「さん」「推し」から選択できます</p>
                  </InfoPopover>
                </div>
                <Select defaultValue="chan" onValueChange={handleSuffixChange}>
                  <SelectTrigger className="w-full">
                    <SelectValue placeholder="選択してください" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="chan">ちゃん</SelectItem>
                    <SelectItem value="kun">くん</SelectItem>
                    <SelectItem value="sama">さま</SelectItem>
                    <SelectItem value="san">さん</SelectItem>
                    <SelectItem value="oshi">推し</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            )}
          </div>

          <div className="flex flex-col gap-4 mb-8">
            <div className="bg-gray-50 p-4 rounded-lg border">
              <div className="flex justify-between items-center">
                <span className="text-lg">合計金額:</span>
                <span className="text-2xl font-bold">¥{price.toLocaleString()}</span>
              </div>
              <div className="text-sm text-muted-foreground mt-1">
                {(() => {
                  const decorationCount = selectedDecoration !== "none" && template !== "fan" ? 1 : 0
                  const totalCount = charCount + decorationCount

                  if (template === "fan") {
                    return totalCount > 3
                      ? `基本料金 ¥1,300 + 追加料金 ¥${((totalCount - 3) * 120).toLocaleString()} (${totalCount - 3}文字分)`
                      : "基本料金 ¥1,300"
                  } else {
                    return totalCount > 4
                      ? `基本料金 ¥1,300 + 追加料金 ¥${((totalCount - 4) * 120).toLocaleString()} (${totalCount - 4}文字分${decorationCount ? "・装飾文字含む" : ""})`
                      : "基本料金 ¥1,300"
                  }
                })()}
              </div>
            </div>
            <div className="flex gap-4">
              {addedToCart ? (
                <Button className="flex-1" size="lg" variant="outline" onClick={goToCart}>
                  <Check className="mr-2 h-5 w-5" />
                  カートに追加済み - カートへ進む
                </Button>
              ) : (
                <Button className="flex-1" size="lg" disabled={isAddToCartDisabled()} onClick={handleAddToCart}>
                  <ShoppingCart className="mr-2 h-5 w-5" />
                  カートに追加
                </Button>
              )}
              <Button variant="outline" size="icon" className="h-12 w-12">
                <Heart className="h-5 w-5" />
              </Button>
              <Button variant="outline" size="icon" className="h-12 w-12">
                <Share2 className="h-5 w-5" />
              </Button>
            </div>
          </div>

          <Tabs id="product-tabs" defaultValue="price" value={activeTab} onValueChange={setActiveTab}>
            <TabsList className="grid w-full grid-cols-5">
              <TabsTrigger value="price">料金表</TabsTrigger>
              <TabsTrigger value="material">素材・質感</TabsTrigger>
              <TabsTrigger value="specs">商品仕様</TabsTrigger>
              <TabsTrigger value="details">詳細</TabsTrigger>
              <TabsTrigger value="shipping">配送情報</TabsTrigger>
            </TabsList>
            <TabsContent value="price" className="pt-4">
              <div className="overflow-x-auto">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>文字数</TableHead>
                      <TableHead>横書き・縦書き (円)</TableHead>
                      <TableHead>推し活風 (円)</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {[...Array(20)].map((_, i) => (
                      <TableRow key={i}>
                        <TableCell>{i + 1}</TableCell>
                        <TableCell>{i < 4 ? "¥1,300" : `¥${(1300 + (i - 3) * 120).toLocaleString()}`}</TableCell>
                        <TableCell>{i < 3 ? "¥1,300" : `¥${(1300 + (i - 2) * 120).toLocaleString()}`}</TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            </TabsContent>
            <TabsContent value="details" className="pt-4">
              <ul className="list-disc pl-5 space-y-2 text-sm">
                <li>カスタマイズ可能なテキスト（1〜20文字）</li>
                <li>3種類のテンプレートから選択可能</li>
                <li>3種類のフォントスタイル</li>
                <li>10種類の装飾文字（オプション）</li>
                <li>2色まで選択可能</li>
                <li>3種類のアタッチメント（無料）</li>
                <li>耐久性に優れた設計</li>
              </ul>
            </TabsContent>
            <TabsContent value="shipping" className="pt-4">
              <div className="space-y-2 text-sm">
                <p>送料：全国一律185円（税込）</p>
                <p>通常配送: 4-7営業日以内に発送</p>
                <p>速達配送: 1-2営業日以内に発送（追加料金あり）</p>
                <p>※この商品は注文個数で金額変動しません</p>
              </div>
            </TabsContent>
            <TabsContent value="material" className="pt-4">
              <div className="space-y-4">
                <div>
                  <h3 className="font-medium mb-2">素材について</h3>
                  <p className="text-sm mb-2">素材はPLA（植物由来のプラスチック）で人にも地球にも優しい素材です。</p>
                  <p className="text-sm">軽量かつ丈夫で、長くお使いいただけます。</p>
                </div>

                <div>
                  <h3 className="font-medium mb-2">質感の種類</h3>

                  <div className="mb-4">
                    <h4 className="text-sm font-medium mb-1">ノーマル</h4>
                    <p className="text-sm mb-2">
                      標準的な光沢のある仕上がりです。発色が良く、鮮やかな色合いが特徴です。
                    </p>
                    <div className="grid grid-cols-3 gap-2">
                      <div className="aspect-video relative rounded overflow-hidden">
                        <Image src="/texture-normal-1.png" alt="ノーマル質感 赤" fill className="object-cover" />
                      </div>
                      <div className="aspect-video relative rounded overflow-hidden">
                        <Image src="/texture-normal-2.png" alt="ノーマル質感 白" fill className="object-cover" />
                      </div>
                      <div className="aspect-video relative rounded overflow-hidden">
                        <Image src="/texture-normal-3.png" alt="ノーマル質感 黒" fill className="object-cover" />
                      </div>
                    </div>
                  </div>

                  <div className="mb-4">
                    <h4 className="text-sm font-medium mb-1">マット</h4>
                    <p className="text-sm mb-2">
                      落ち着いた質感の艶消し仕上げです。光の反射が少なく、上品な印象を与えます。
                    </p>
                    <div className="grid grid-cols-3 gap-2">
                      <div className="aspect-video relative rounded overflow-hidden">
                        <Image src="/texture-matte-1.png" alt="マット質感 赤" fill className="object-cover" />
                      </div>
                      <div className="aspect-video relative rounded overflow-hidden">
                        <Image src="/texture-matte-2.png" alt="マット質感 白" fill className="object-cover" />
                      </div>
                      <div className="aspect-video relative rounded overflow-hidden">
                        <Image src="/texture-matte-3.png" alt="マット質感 黒" fill className="object-cover" />
                      </div>
                    </div>
                  </div>

                  <div>
                    <h4 className="text-sm font-medium mb-1">シルク（光沢）</h4>
                    <p className="text-sm mb-2">
                      上品な光沢感のある特殊仕上げです。高級感があり、特別な印象を与えます。
                    </p>
                    <div className="grid grid-cols-3 gap-2">
                      <div className="aspect-video relative rounded overflow-hidden">
                        <Image src="/texture-silk-1.png" alt="シルク質感 赤" fill className="object-cover" />
                      </div>
                      <div className="aspect-video relative rounded overflow-hidden">
                        <Image src="/texture-silk-2.png" alt="シルク質感 白" fill className="object-cover" />
                      </div>
                      <div className="aspect-video relative rounded overflow-hidden">
                        <Image src="/texture-silk-3.png" alt="シルク質感 グレー" fill className="object-cover" />
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </TabsContent>

            <TabsContent value="specs" className="pt-4">
              <Table>
                <TableBody>
                  <TableRow>
                    <TableCell className="font-medium">素材</TableCell>
                    <TableCell>PLA（植物由来のプラスチック）</TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell className="font-medium">サイズ</TableCell>
                    <TableCell>縦幅 約20mm　横幅 文字数によって変動　厚み 約3mm</TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell className="font-medium">包装</TableCell>
                    <TableCell>OPP袋個包装</TableCell>
                  </TableRow>
                </TableBody>
              </Table>
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </div>
  )
}
