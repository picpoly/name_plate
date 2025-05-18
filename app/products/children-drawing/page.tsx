"use client"

import type React from "react"

import { useState, useRef, useEffect } from "react"
import Image from "next/image"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Info, X, Plus, Trash2 } from "lucide-react"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Label } from "@/components/ui/label"
import { Input } from "@/components/ui/input"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { useRouter } from "next/navigation"
import { useCart } from "@/context/cart-context"
import { v4 as uuidv4 } from "uuid"
import { Header } from "@/components/header"

export default function PetFigurePage() {
  const router = useRouter()
  const { addItem } = useCart()
  const materialTabRef = useRef(null)

  const [quantity, setQuantity] = useState(1)
  const [baseOption, setBaseOption] = useState("none")
  const [baseColor, setBaseColor] = useState("white")
  const [baseColorName, setBaseColorName] = useState("ホワイト")
  const [baseTexture, setBaseTexture] = useState("normal") // "normal", "matte", "silk"
  const [uploadedFile, setUploadedFile] = useState<File | null>(null)
  const [previewUrl, setPreviewUrl] = useState<string | null>(null)
  const [uploadError, setUploadError] = useState<string | null>(null)
  const [designUploadedFile, setDesignUploadedFile] = useState<File | null>(null)
  const [designPreviewUrl, setDesignPreviewUrl] = useState<string | null>(null)
  const [designUploadError, setDesignUploadError] = useState<string | null>(null)
  const [notes, setNotes] = useState("")
  const [figureSize, setFigureSize] = useState("7cm")
  const [activeTab, setActiveTab] = useState("price")
  const [currentStep, setCurrentStep] = useState(1)
  const [petType, setPetType] = useState("dog") // 追加：ペットの種類

  // 代わりにカート関連の状態を追加
  const [addedToCart, setAddedToCart] = useState(false)

  // フィギュア本体のカラー選択用の状態
  const [figureColors, setFigureColors] = useState([
    { id: uuidv4(), texture: "normal", color: "#FFFFFF", colorName: "ジェイドホワイト", partName: "本体" },
    { id: uuidv4(), texture: "normal", color: "#000000", colorName: "ブラック", partName: "目" },
    { id: uuidv4(), texture: "normal", color: "#0A2989", colorName: "ブルー", partName: "服" },
    { id: uuidv4(), texture: "normal", color: "#F55A74", colorName: "ピンク", partName: "アクセント" },
  ])

  // ページ読み込み時に一番上にスクロール
  useEffect(() => {
    window.scrollTo(0, 0)
  }, [])

  // 価格表（ボリュームディスカウント）
  const figureSizes = [
    { id: "6cm", name: "6cm×6cm×6cm", price: 0 },
    { id: "7cm", name: "7cm×7cm×7cm", price: 0 },
    { id: "8cm", name: "8cm×8cm×8cm", price: 0 },
    { id: "9cm", name: "9cm×9cm×9cm", price: 0 },
    { id: "10cm", name: "10cm×10cm×10cm", price: 0 },
  ]

  // ペットの種類
  const petTypes = [
    { id: "dog", name: "犬" },
    { id: "cat", name: "猫" },
    { id: "bird", name: "鳥" },
    { id: "fish", name: "魚" },
    { id: "reptile", name: "爬虫類" },
    { id: "small_animal", name: "小動物" },
    { id: "insect", name: "昆虫" },
    { id: "other", name: "その他" },
  ]

  // Now, replace the existing price table with the comprehensive price table
  const priceTable = [
    // 60mm prices
    { quantity: 1, size: "6cm", totalPrice: 9000, unitPrice: 9000 },
    { quantity: 2, size: "6cm", totalPrice: 12000, unitPrice: 6000 },
    { quantity: 3, size: "6cm", totalPrice: 15000, unitPrice: 5000 },
    { quantity: 4, size: "6cm", totalPrice: 18000, unitPrice: 4500 },
    { quantity: 5, size: "6cm", totalPrice: 21000, unitPrice: 4200 },
    { quantity: 6, size: "6cm", totalPrice: 23700, unitPrice: 3950 },
    { quantity: 7, size: "6cm", totalPrice: 26400, unitPrice: 3771 },
    { quantity: 8, size: "6cm", totalPrice: 29100, unitPrice: 3638 },
    { quantity: 9, size: "6cm", totalPrice: 31800, unitPrice: 3533 },
    { quantity: 10, size: "6cm", totalPrice: 34500, unitPrice: 3450 },
    { quantity: 11, size: "6cm", totalPrice: 37200, unitPrice: 3382 },
    { quantity: 12, size: "6cm", totalPrice: 39900, unitPrice: 3325 },
    { quantity: 13, size: "6cm", totalPrice: 42600, unitPrice: 3277 },
    { quantity: 14, size: "6cm", totalPrice: 45300, unitPrice: 3236 },
    { quantity: 15, size: "6cm", totalPrice: 48000, unitPrice: 3200 },
    { quantity: 16, size: "6cm", totalPrice: 50500, unitPrice: 3156 },
    { quantity: 17, size: "6cm", totalPrice: 53000, unitPrice: 3118 },
    { quantity: 18, size: "6cm", totalPrice: 55500, unitPrice: 3083 },
    { quantity: 19, size: "6cm", totalPrice: 58000, unitPrice: 3053 },
    { quantity: 20, size: "6cm", totalPrice: 60500, unitPrice: 3025 },
    { quantity: 21, size: "6cm", totalPrice: 63000, unitPrice: 3000 },
    { quantity: 22, size: "6cm", totalPrice: 65500, unitPrice: 2977 },
    { quantity: 23, size: "6cm", totalPrice: 68000, unitPrice: 2957 },
    { quantity: 24, size: "6cm", totalPrice: 70500, unitPrice: 2938 },
    { quantity: 25, size: "6cm", totalPrice: 73000, unitPrice: 2920 },
    { quantity: 26, size: "6cm", totalPrice: 75300, unitPrice: 2896 },
    { quantity: 27, size: "6cm", totalPrice: 77600, unitPrice: 2874 },
    { quantity: 28, size: "6cm", totalPrice: 79900, unitPrice: 2854 },
    { quantity: 29, size: "6cm", totalPrice: 82200, unitPrice: 2835 },
    { quantity: 30, size: "6cm", totalPrice: 84500, unitPrice: 2817 },
    { quantity: 31, size: "6cm", totalPrice: 86800, unitPrice: 2800 },
    { quantity: 32, size: "6cm", totalPrice: 89100, unitPrice: 2784 },
    { quantity: 33, size: "6cm", totalPrice: 91400, unitPrice: 2768 },
    { quantity: 34, size: "6cm", totalPrice: 93700, unitPrice: 2756 },
    { quantity: 35, size: "6cm", totalPrice: 96000, unitPrice: 2743 },
    { quantity: 36, size: "6cm", totalPrice: 98200, unitPrice: 2728 },
    { quantity: 37, size: "6cm", totalPrice: 100400, unitPrice: 2714 },
    { quantity: 38, size: "6cm", totalPrice: 102600, unitPrice: 2700 },
    { quantity: 39, size: "6cm", totalPrice: 104800, unitPrice: 2687 },
    { quantity: 40, size: "6cm", totalPrice: 106900, unitPrice: 2672 },
    { quantity: 41, size: "6cm", totalPrice: 109000, unitPrice: 2659 },
    { quantity: 42, size: "6cm", totalPrice: 111100, unitPrice: 2645 },
    { quantity: 43, size: "6cm", totalPrice: 113200, unitPrice: 2633 },
    { quantity: 44, size: "6cm", totalPrice: 115300, unitPrice: 2620 },
    { quantity: 45, size: "6cm", totalPrice: 117400, unitPrice: 2609 },
    { quantity: 46, size: "6cm", totalPrice: 119500, unitPrice: 2598 },
    { quantity: 47, size: "6cm", totalPrice: 121600, unitPrice: 2587 },
    { quantity: 48, size: "6cm", totalPrice: 123700, unitPrice: 2577 },
    { quantity: 49, size: "6cm", totalPrice: 125800, unitPrice: 2567 },
    { quantity: 50, size: "6cm", totalPrice: 127900, unitPrice: 2558 },

    // 70mm prices
    { quantity: 1, size: "7cm", totalPrice: 9300, unitPrice: 9300 },
    { quantity: 2, size: "7cm", totalPrice: 12600, unitPrice: 6300 },
    { quantity: 3, size: "7cm", totalPrice: 15900, unitPrice: 5300 },
    { quantity: 4, size: "7cm", totalPrice: 19200, unitPrice: 4800 },
    { quantity: 5, size: "7cm", totalPrice: 22500, unitPrice: 4500 },
    { quantity: 6, size: "7cm", totalPrice: 25500, unitPrice: 4250 },
    { quantity: 7, size: "7cm", totalPrice: 28500, unitPrice: 4071 },
    { quantity: 8, size: "7cm", totalPrice: 31500, unitPrice: 3938 },
    { quantity: 9, size: "7cm", totalPrice: 34500, unitPrice: 3833 },
    { quantity: 10, size: "7cm", totalPrice: 37500, unitPrice: 3750 },
    { quantity: 11, size: "7cm", totalPrice: 40500, unitPrice: 3682 },
    { quantity: 12, size: "7cm", totalPrice: 43500, unitPrice: 3625 },
    { quantity: 13, size: "7cm", totalPrice: 46500, unitPrice: 3577 },
    { quantity: 14, size: "7cm", totalPrice: 49500, unitPrice: 3536 },
    { quantity: 15, size: "7cm", totalPrice: 52500, unitPrice: 3500 },
    { quantity: 16, size: "7cm", totalPrice: 55300, unitPrice: 3456 },
    { quantity: 17, size: "7cm", totalPrice: 58100, unitPrice: 3418 },
    { quantity: 18, size: "7cm", totalPrice: 60900, unitPrice: 3383 },
    { quantity: 19, size: "7cm", totalPrice: 63700, unitPrice: 3353 },
    { quantity: 20, size: "7cm", totalPrice: 66500, unitPrice: 3325 },
    { quantity: 21, size: "7cm", totalPrice: 69300, unitPrice: 3300 },
    { quantity: 22, size: "7cm", totalPrice: 72100, unitPrice: 3277 },
    { quantity: 23, size: "7cm", totalPrice: 74900, unitPrice: 3257 },
    { quantity: 24, size: "7cm", totalPrice: 77700, unitPrice: 3238 },
    { quantity: 25, size: "7cm", totalPrice: 80500, unitPrice: 3220 },
    { quantity: 26, size: "7cm", totalPrice: 83100, unitPrice: 3196 },
    { quantity: 27, size: "7cm", totalPrice: 85700, unitPrice: 3174 },
    { quantity: 28, size: "7cm", totalPrice: 88300, unitPrice: 3154 },
    { quantity: 29, size: "7cm", totalPrice: 90900, unitPrice: 3134 },
    { quantity: 30, size: "7cm", totalPrice: 93500, unitPrice: 3117 },
    { quantity: 31, size: "7cm", totalPrice: 96100, unitPrice: 3100 },
    { quantity: 32, size: "7cm", totalPrice: 98700, unitPrice: 3084 },
    { quantity: 33, size: "7cm", totalPrice: 101300, unitPrice: 3070 },
    { quantity: 34, size: "7cm", totalPrice: 103900, unitPrice: 3056 },
    { quantity: 35, size: "7cm", totalPrice: 106500, unitPrice: 3043 },
    { quantity: 36, size: "7cm", totalPrice: 109000, unitPrice: 3028 },
    { quantity: 37, size: "7cm", totalPrice: 111500, unitPrice: 3014 },
    { quantity: 38, size: "7cm", totalPrice: 114000, unitPrice: 3000 },
    { quantity: 39, size: "7cm", totalPrice: 116500, unitPrice: 2987 },
    { quantity: 40, size: "7cm", totalPrice: 118900, unitPrice: 2973 },
    { quantity: 41, size: "7cm", totalPrice: 121300, unitPrice: 2959 },
    { quantity: 42, size: "7cm", totalPrice: 123700, unitPrice: 2945 },
    { quantity: 43, size: "7cm", totalPrice: 126100, unitPrice: 2933 },
    { quantity: 44, size: "7cm", totalPrice: 128500, unitPrice: 2920 },
    { quantity: 45, size: "7cm", totalPrice: 130900, unitPrice: 2909 },
    { quantity: 46, size: "7cm", totalPrice: 133300, unitPrice: 2898 },
    { quantity: 47, size: "7cm", totalPrice: 135700, unitPrice: 2887 },
    { quantity: 48, size: "7cm", totalPrice: 138100, unitPrice: 2877 },
    { quantity: 49, size: "7cm", totalPrice: 140500, unitPrice: 2867 },
    { quantity: 50, size: "7cm", totalPrice: 142900, unitPrice: 2858 },

    // 80mm prices
    { quantity: 1, size: "8cm", totalPrice: 9500, unitPrice: 9500 },
    { quantity: 2, size: "8cm", totalPrice: 13000, unitPrice: 6500 },
    { quantity: 3, size: "8cm", totalPrice: 16500, unitPrice: 5500 },
    { quantity: 4, size: "8cm", totalPrice: 20000, unitPrice: 5000 },
    { quantity: 5, size: "8cm", totalPrice: 23500, unitPrice: 4700 },
    { quantity: 6, size: "8cm", totalPrice: 26700, unitPrice: 4450 },
    { quantity: 7, size: "8cm", totalPrice: 29900, unitPrice: 4271 },
    { quantity: 8, size: "8cm", totalPrice: 33100, unitPrice: 4138 },
    { quantity: 9, size: "8cm", totalPrice: 36300, unitPrice: 4033 },
    { quantity: 10, size: "8cm", totalPrice: 39500, unitPrice: 3950 },
    { quantity: 11, size: "8cm", totalPrice: 42700, unitPrice: 3882 },
    { quantity: 12, size: "8cm", totalPrice: 45900, unitPrice: 3825 },
    { quantity: 13, size: "8cm", totalPrice: 49100, unitPrice: 3777 },
    { quantity: 14, size: "8cm", totalPrice: 52300, unitPrice: 3736 },
    { quantity: 15, size: "8cm", totalPrice: 55500, unitPrice: 3700 },
    { quantity: 16, size: "8cm", totalPrice: 58500, unitPrice: 3656 },
    { quantity: 17, size: "8cm", totalPrice: 61500, unitPrice: 3618 },
    { quantity: 18, size: "8cm", totalPrice: 64500, unitPrice: 3583 },
    { quantity: 19, size: "8cm", totalPrice: 67500, unitPrice: 3553 },
    { quantity: 20, size: "8cm", totalPrice: 70500, unitPrice: 3525 },
    { quantity: 21, size: "8cm", totalPrice: 73500, unitPrice: 3500 },
    { quantity: 22, size: "8cm", totalPrice: 76500, unitPrice: 3477 },
    { quantity: 23, size: "8cm", totalPrice: 79500, unitPrice: 3457 },
    { quantity: 24, size: "8cm", totalPrice: 82500, unitPrice: 3438 },
    { quantity: 25, size: "8cm", totalPrice: 85500, unitPrice: 3420 },
    { quantity: 26, size: "8cm", totalPrice: 88300, unitPrice: 3396 },
    { quantity: 27, size: "8cm", totalPrice: 91100, unitPrice: 3374 },
    { quantity: 28, size: "8cm", totalPrice: 93900, unitPrice: 3354 },
    { quantity: 29, size: "8cm", totalPrice: 96700, unitPrice: 3334 },
    { quantity: 30, size: "8cm", totalPrice: 99500, unitPrice: 3317 },
    { quantity: 31, size: "8cm", totalPrice: 102300, unitPrice: 3300 },
    { quantity: 32, size: "8cm", totalPrice: 105100, unitPrice: 3284 },
    { quantity: 33, size: "8cm", totalPrice: 107900, unitPrice: 3270 },
    { quantity: 34, size: "8cm", totalPrice: 110700, unitPrice: 3256 },
    { quantity: 35, size: "8cm", totalPrice: 113500, unitPrice: 3243 },
    { quantity: 36, size: "8cm", totalPrice: 116200, unitPrice: 3228 },
    { quantity: 37, size: "8cm", totalPrice: 118900, unitPrice: 3214 },
    { quantity: 38, size: "8cm", totalPrice: 121600, unitPrice: 3200 },
    { quantity: 39, size: "8cm", totalPrice: 124300, unitPrice: 3187 },
    { quantity: 40, size: "8cm", totalPrice: 126900, unitPrice: 3173 },
    { quantity: 41, size: "8cm", totalPrice: 129500, unitPrice: 3159 },
    { quantity: 42, size: "8cm", totalPrice: 132100, unitPrice: 3145 },
    { quantity: 43, size: "8cm", totalPrice: 134700, unitPrice: 3133 },
    { quantity: 44, size: "8cm", totalPrice: 137300, unitPrice: 3120 },
    { quantity: 45, size: "8cm", totalPrice: 139900, unitPrice: 3109 },
    { quantity: 46, size: "8cm", totalPrice: 142500, unitPrice: 3098 },
    { quantity: 47, size: "8cm", totalPrice: 145100, unitPrice: 3087 },
    { quantity: 48, size: "8cm", totalPrice: 147700, unitPrice: 3077 },
    { quantity: 49, size: "8cm", totalPrice: 150300, unitPrice: 3067 },
    { quantity: 50, size: "8cm", totalPrice: 152900, unitPrice: 3058 },

    // 90mm prices
    { quantity: 1, size: "9cm", totalPrice: 9800, unitPrice: 9800 },
    { quantity: 2, size: "9cm", totalPrice: 13600, unitPrice: 6800 },
    { quantity: 3, size: "9cm", totalPrice: 17400, unitPrice: 5800 },
    { quantity: 4, size: "9cm", totalPrice: 21200, unitPrice: 5300 },
    { quantity: 5, size: "9cm", totalPrice: 25000, unitPrice: 5000 },
    { quantity: 6, size: "9cm", totalPrice: 28500, unitPrice: 4750 },
    { quantity: 7, size: "9cm", totalPrice: 32000, unitPrice: 4571 },
    { quantity: 8, size: "9cm", totalPrice: 35500, unitPrice: 4438 },
    { quantity: 9, size: "9cm", totalPrice: 39000, unitPrice: 4333 },
    { quantity: 10, size: "9cm", totalPrice: 42500, unitPrice: 4250 },
    { quantity: 11, size: "9cm", totalPrice: 46000, unitPrice: 4182 },
    { quantity: 12, size: "9cm", totalPrice: 49500, unitPrice: 4125 },
    { quantity: 13, size: "9cm", totalPrice: 53000, unitPrice: 4077 },
    { quantity: 14, size: "9cm", totalPrice: 56500, unitPrice: 4036 },
    { quantity: 15, size: "9cm", totalPrice: 60000, unitPrice: 4000 },
    { quantity: 16, size: "9cm", totalPrice: 63300, unitPrice: 3956 },
    { quantity: 17, size: "9cm", totalPrice: 66600, unitPrice: 3918 },
    { quantity: 18, size: "9cm", totalPrice: 69900, unitPrice: 3883 },
    { quantity: 19, size: "9cm", totalPrice: 73200, unitPrice: 3853 },
    { quantity: 20, size: "9cm", totalPrice: 76500, unitPrice: 3825 },
    { quantity: 21, size: "9cm", totalPrice: 79800, unitPrice: 3800 },
    { quantity: 22, size: "9cm", totalPrice: 83100, unitPrice: 3777 },
    { quantity: 23, size: "9cm", totalPrice: 86400, unitPrice: 3757 },
    { quantity: 24, size: "9cm", totalPrice: 89700, unitPrice: 3738 },
    { quantity: 25, size: "9cm", totalPrice: 93000, unitPrice: 3720 },
    { quantity: 26, size: "9cm", totalPrice: 96100, unitPrice: 3696 },
    { quantity: 27, size: "9cm", totalPrice: 99200, unitPrice: 3674 },
    { quantity: 28, size: "9cm", totalPrice: 102300, unitPrice: 3654 },
    { quantity: 29, size: "9cm", totalPrice: 105400, unitPrice: 3634 },
    { quantity: 30, size: "9cm", totalPrice: 108500, unitPrice: 3617 },
    { quantity: 31, size: "9cm", totalPrice: 111600, unitPrice: 3600 },
    { quantity: 32, size: "9cm", totalPrice: 114700, unitPrice: 3584 },
    { quantity: 33, size: "9cm", totalPrice: 117800, unitPrice: 3570 },
    { quantity: 34, size: "9cm", totalPrice: 120900, unitPrice: 3556 },
    { quantity: 35, size: "9cm", totalPrice: 124000, unitPrice: 3543 },
    { quantity: 36, size: "9cm", totalPrice: 127000, unitPrice: 3528 },
    { quantity: 37, size: "9cm", totalPrice: 130000, unitPrice: 3514 },
    { quantity: 38, size: "9cm", totalPrice: 133000, unitPrice: 3500 },
    { quantity: 39, size: "9cm", totalPrice: 136000, unitPrice: 3487 },
    { quantity: 40, size: "9cm", totalPrice: 138900, unitPrice: 3473 },
    { quantity: 41, size: "9cm", totalPrice: 141800, unitPrice: 3459 },
    { quantity: 42, size: "9cm", totalPrice: 144700, unitPrice: 3445 },
    { quantity: 43, size: "9cm", totalPrice: 147600, unitPrice: 3433 },
    { quantity: 44, size: "9cm", totalPrice: 150500, unitPrice: 3420 },
    { quantity: 45, size: "9cm", totalPrice: 153400, unitPrice: 3409 },
    { quantity: 46, size: "9cm", totalPrice: 156300, unitPrice: 3398 },
    { quantity: 47, size: "9cm", totalPrice: 159200, unitPrice: 3387 },
    { quantity: 48, size: "9cm", totalPrice: 162100, unitPrice: 3377 },
    { quantity: 49, size: "9cm", totalPrice: 165000, unitPrice: 3367 },
    { quantity: 50, size: "9cm", totalPrice: 167900, unitPrice: 3358 },

    // 100mm prices
    { quantity: 1, size: "10cm", totalPrice: 10000, unitPrice: 10000 },
    { quantity: 2, size: "10cm", totalPrice: 14000, unitPrice: 7000 },
    { quantity: 3, size: "10cm", totalPrice: 18000, unitPrice: 6000 },
    { quantity: 4, size: "10cm", totalPrice: 22000, unitPrice: 5500 },
    { quantity: 5, size: "10cm", totalPrice: 26000, unitPrice: 5200 },
    { quantity: 6, size: "10cm", totalPrice: 29700, unitPrice: 4950 },
    { quantity: 7, size: "10cm", totalPrice: 33400, unitPrice: 4771 },
    { quantity: 8, size: "10cm", totalPrice: 37100, unitPrice: 4638 },
    { quantity: 9, size: "10cm", totalPrice: 40800, unitPrice: 4533 },
    { quantity: 10, size: "10cm", totalPrice: 44500, unitPrice: 4450 },
    { quantity: 11, size: "10cm", totalPrice: 48200, unitPrice: 4382 },
    { quantity: 12, size: "10cm", totalPrice: 51900, unitPrice: 4325 },
    { quantity: 13, size: "10cm", totalPrice: 55600, unitPrice: 4277 },
    { quantity: 14, size: "10cm", totalPrice: 59300, unitPrice: 4236 },
    { quantity: 15, size: "10cm", totalPrice: 63000, unitPrice: 4200 },
    { quantity: 16, size: "10cm", totalPrice: 66500, unitPrice: 4156 },
    { quantity: 17, size: "10cm", totalPrice: 70000, unitPrice: 4118 },
    { quantity: 18, size: "10cm", totalPrice: 73500, unitPrice: 4083 },
    { quantity: 19, size: "10cm", totalPrice: 77000, unitPrice: 4053 },
    { quantity: 20, size: "10cm", totalPrice: 80500, unitPrice: 4025 },
    { quantity: 21, size: "10cm", totalPrice: 84000, unitPrice: 4000 },
    { quantity: 22, size: "10cm", totalPrice: 87500, unitPrice: 3977 },
    { quantity: 23, size: "10cm", totalPrice: 91000, unitPrice: 3957 },
    { quantity: 24, size: "10cm", totalPrice: 94500, unitPrice: 3938 },
    { quantity: 25, size: "10cm", totalPrice: 98000, unitPrice: 3920 },
    { quantity: 26, size: "10cm", totalPrice: 101300, unitPrice: 3896 },
    { quantity: 27, size: "10cm", totalPrice: 104600, unitPrice: 3874 },
    { quantity: 28, size: "10cm", totalPrice: 107900, unitPrice: 3854 },
    { quantity: 29, size: "10cm", totalPrice: 111200, unitPrice: 3834 },
    { quantity: 30, size: "10cm", totalPrice: 114500, unitPrice: 3817 },
    { quantity: 31, size: "10cm", totalPrice: 117800, unitPrice: 3800 },
    { quantity: 32, size: "10cm", totalPrice: 121100, unitPrice: 3784 },
    { quantity: 33, size: "10cm", totalPrice: 124400, unitPrice: 3770 },
    { quantity: 34, size: "10cm", totalPrice: 127700, unitPrice: 3756 },
    { quantity: 35, size: "10cm", totalPrice: 131000, unitPrice: 3743 },
    { quantity: 36, size: "10cm", totalPrice: 134200, unitPrice: 3728 },
    { quantity: 37, size: "10cm", totalPrice: 137400, unitPrice: 3714 },
    { quantity: 38, size: "10cm", totalPrice: 140600, unitPrice: 3700 },
    { quantity: 39, size: "10cm", totalPrice: 143800, unitPrice: 3687 },
    { quantity: 40, size: "10cm", totalPrice: 146900, unitPrice: 3673 },
    { quantity: 41, size: "10cm", totalPrice: 150000, unitPrice: 3659 },
    { quantity: 42, size: "10cm", totalPrice: 153100, unitPrice: 3645 },
    { quantity: 43, size: "10cm", totalPrice: 156200, unitPrice: 3633 },
    { quantity: 44, size: "10cm", totalPrice: 159300, unitPrice: 3620 },
    { quantity: 45, size: "10cm", totalPrice: 162400, unitPrice: 3609 },
    { quantity: 46, size: "10cm", totalPrice: 165500, unitPrice: 3598 },
    { quantity: 47, size: "10cm", totalPrice: 168600, unitPrice: 3587 },
    { quantity: 48, size: "10cm", totalPrice: 171700, unitPrice: 3577 },
    { quantity: 49, size: "10cm", totalPrice: 174800, unitPrice: 3567 },
    { quantity: 50, size: "10cm", totalPrice: 177900, unitPrice: 3558 },
  ]

  // 台座オプション
  const baseOptions = [
    { id: "none", name: "台座なし", price: 0 },
    { id: "simple", name: "シンプル台座", price: 300 },
    { id: "custom", name: "デザイン台座", price: 500 },
  ]

  // 台座カラー
  const baseColors = [
    { id: "white", name: "ホワイト", hex: "#FFFFFF" },
    { id: "black", name: "ブラック", hex: "#000000" },
    { id: "red", name: "レッド", hex: "#FF0000" },
    { id: "blue", name: "ブルー", hex: "#0000FF" },
    { id: "green", name: "グリーン", hex: "#00FF00" },
    { id: "yellow", name: "イエロー", hex: "#FFFF00" },
    { id: "pink", name: "ピンク", hex: "#FFC0CB" },
    { id: "purple", name: "パープル", hex: "#800080" },
  ]

  // 質感のカテゴリー
  const textureCategories = [
    { id: "normal", name: "ノーマル" },
    { id: "matte", name: "マット" },
    { id: "silk", name: "シルク（光沢）" },
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

  // 商品画像の配列 - 新しい画像に更新
  const productImages = [
    { src: "/children-drawing-figure-5.png", alt: "子どもの絵と完成したフィギュア" },
    { src: "/children-drawing-figure-2.png", alt: "子どもの絵からフィギュアへの変換例" },
    { src: "/children-drawing-figure-4.png", alt: "子どもおえかきフィギュア クローズアップ" },
    { src: "/children-drawing-figure-1.png", alt: "子どもおえかきフィギュア例 1" },
    { src: "/children-drawing-figure-3.png", alt: "子どもおえかきフィギュア デスク上の例" },
    { src: "/children-drawing-figure-6.png", alt: "おにぎりマンフィギュア例" },
  ]

  // 現在表示中のメイン画像を管理するステート
  const [currentMainImage, setCurrentMainImage] = useState("/children-drawing-figure-5.png")

  // 各セクションのポップオーバー開閉状態
  const [openPopovers, setOpenPopovers] = useState({
    size: false,
    base: false,
    baseColor: false,
    upload: false,
    preview: false,
    figureColor: false,
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
      const tabsElement = document.getElementById("product-tabs")
      if (tabsElement) {
        window.scrollTo({
          top: tabsElement.offsetTop - 100,
          behavior: "smooth",
        })
      }
    }, 100)
  }

  // 現在の単価を取得
  const getCurrentPrice = () => {
    // Find the price based on quantity and size
    const priceEntry = priceTable.find((entry) => entry.quantity === quantity && entry.size === figureSize)

    // If an exact match exists, use that price
    let unitPrice = priceEntry ? priceEntry.unitPrice : 0

    // If no exact match is found (for quantities > 50)
    if (!priceEntry) {
      // Find the entry for quantity=50 of the same size
      const baseEntry = priceTable.find((entry) => entry.quantity === 50 && entry.size === figureSize)
      if (baseEntry) {
        unitPrice = baseEntry.unitPrice
      } else {
        // Fallback to the first price entry if nothing else matches
        unitPrice = priceTable[0].unitPrice
      }
    }

    // Add the price for base option
    const selectedBaseOption = baseOptions.find((option) => option.id === baseOption)
    if (selectedBaseOption) {
      unitPrice += selectedBaseOption.price
    }

    // Add the price for extra colors (if any)
    const extraColors = Math.max(0, figureColors.length - 4)
    if (extraColors > 0) {
      unitPrice += extraColors * 800
    }

    return unitPrice
  }

  // 合計金額を計算
  const calculateTotal = () => {
    return getCurrentPrice() * quantity
  }

  // 追加色の料金を計算
  const calculateExtraColorPrice = () => {
    const extraColors = Math.max(0, figureColors.length - 4)
    return extraColors * 800
  }

  // ファイルアップロード処理
  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      setUploadedFile(file)
      const url = URL.createObjectURL(file)
      setPreviewUrl(url)
      setUploadError(null)
    }
  }

  // デザインファイルアップロード処理関数を追加
  const handleDesignFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      setDesignUploadedFile(file)
      const url = URL.createObjectURL(file)
      setDesignPreviewUrl(url)
      setDesignUploadError(null)
    }
  }

  // 数量変更処理
  const handleQuantityChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = Number.parseInt(e.target.value)
    if (!isNaN(value) && value > 0) {
      setQuantity(value)
    }
  }

  // 台座カラー選択時の処理
  const handleBaseColorChange = (colorHex, colorName) => {
    setBaseColor(colorHex)
    setBaseColorName(colorName)
  }

  // 現在表示すべき色の配列を取得
  const getBaseColors = () => {
    return colorsByTexture[baseTexture] || []
  }

  // 台座テクスチャ変更時の処理
  const handleBaseTextureChange = (value) => {
    setBaseTexture(value)
    // テクスチャが変わったら、そのテクスチャで利用可能な最初の色を選択
    const availableColors = colorsByTexture[value] || []
    if (availableColors.length > 0) {
      setBaseColor(availableColors[0].hex)
      setBaseColorName(availableColors[0].name)
    }
  }

  // フィギュア本体の色を追加
  const addFigureColor = () => {
    if (figureColors.length < 12) {
      const newColor = {
        id: uuidv4(),
        texture: "normal",
        color: "#FFFFFF",
        colorName: "ジェイドホワイト",
        partName: "",
      }
      setFigureColors([...figureColors, newColor])
    }
  }

  // フィギュア本体の色を削除
  const removeFigureColor = (id) => {
    if (figureColors.length > 1) {
      setFigureColors(figureColors.filter((color) => color.id !== id))
    }
  }

  // フィギュア本体の色を更新
  const updateFigureColor = (id, field, value) => {
    setFigureColors(
      figureColors.map((color) => {
        if (color.id === id) {
          if (field === "texture") {
            // テクスチャが変更された場合、そのテクスチャの最初の色を選択
            const availableColors = colorsByTexture[value] || []
            if (availableColors.length > 0) {
              return {
                ...color,
                texture: value,
                color: availableColors[0].hex,
                colorName: availableColors[0].name,
              }
            }
          }
          return { ...color, [field]: value }
        }
        return color
      }),
    )
  }

  // フィギュア本体の色名を更新
  const updateFigureColorName = (id, colorHex, colorName) => {
    setFigureColors(
      figureColors.map((color) => {
        if (color.id === id) {
          return { ...color, color: colorHex, colorName: colorName }
        }
        return color
      }),
    )
  }

  // goToNextStep 関数を以下のように修正します
  const goToNextStep = () => {
    // 現在のステップのセクションを取得
    const currentStepSection = document.querySelector(`[data-step="${currentStep}"]`);
    
    // 次のステップに更新
    setCurrentStep(currentStep + 1);
    
    // 少し遅延を入れて、state更新後に次のステップのセクションを取得
    setTimeout(() => {
      const nextStepSection = document.querySelector(`[data-step="${currentStep + 1}"]`);
      if (nextStepSection) {
        // スムーズにスクロール
        nextStepSection.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }
    }, 100);
  }

  // goToPrevStep 関数を以下のように修正します
  const goToPrevStep = () => {
    // 現在のステップのセクションを取得
    const currentStepSection = document.querySelector(`[data-step="${currentStep}"]`);
    
    // 前のステップに更新
    setCurrentStep(currentStep - 1);
    
    // 少し遅延を入れて、state更新後に前のステップのセクションを取得
    setTimeout(() => {
      const prevStepSection = document.querySelector(`[data-step="${currentStep - 1}"]`);
      if (prevStepSection) {
        // スムーズにスクロール
        prevStepSection.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }
    }, 100);
  }

  // カートに追加する関数
  const handleAddToCart = () => {
    // 画像アップロードのバリデーション
    if (!uploadedFile) {
      setUploadError("お子さんの絵のアップロードは必須です。")
      // アップロードセクションまでスクロール
      const uploadSection = document.getElementById("figure-upload-section")
      if (uploadSection) {
        uploadSection.scrollIntoView({ behavior: "smooth" })
      }
      return
    }

    // デザイン台座選択時のバリデーション
    if (baseOption === "custom" && !designUploadedFile) {
      setDesignUploadError("デザイン台座を選択した場合、デザインデータのアップロードは必須です。")
      // デザインアップロードセクションまでスクロール
      const designUploadSection = document.getElementById("design-upload-section")
      if (designUploadSection) {
        designUploadSection.scrollIntoView({ behavior: "smooth" })
      }
      return
    }

    // フィギュアサイズを取得
    const selectedSize = figureSizes.find((size) => size.id === figureSize)
    const sizeName = selectedSize ? selectedSize.name : ""

    // 台座オプションを取得
    const selectedBaseOption = baseOptions.find((option) => option.id === baseOption)
    const baseOptionName = selectedBaseOption ? selectedBaseOption.name : ""

    // カラー情報を整理
    const colorInfo = figureColors.map((color) => {
      return {
        partName: color.partName || "未指定",
        colorName: color.colorName,
        texture: color.texture === "normal" ? "ノーマル" : color.texture === "matte" ? "マット" : "シルク",
      }
    })

    const newItem = {
      id: uuidv4(),
      name: "子どもおえかきフィギュア",
      price: getCurrentPrice(),
      quantity: quantity,
      image: "/children-drawing-figure-5.png",
      customizations: {
        figureSize: sizeName,
        baseOption: baseOptionName,
        baseColor: baseOption !== "none" ? baseColorName : "なし",
        baseTexture:
          baseOption !== "none"
            ? baseTexture === "normal"
              ? "ノーマル"
              : baseTexture === "matte"
                ? "マット"
                : "シルク"
            : "なし",
        figureColors: colorInfo,
        notes: notes,
        uploadedFileName: uploadedFile ? uploadedFile.name : "",
        designFileName: designUploadedFile ? designUploadedFile.name : "",
      },
    }

    addItem(newItem)
    setAddedToCart(true)

    // 3秒後にフィードバックをリセット
    setTimeout(() => {
      setAddedToCart(false)
    }, 3000)
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

  // ステップコンポーネント
  const StepHeader = ({ number, title, description }) => (
    <div className="mb-6 border-b pb-4">
      <div className="flex items-center mb-2">
        <div className="bg-blue-500 text-white rounded-full w-8 h-8 flex items-center justify-center font-bold mr-3">
          {number}
        </div>
        <h3 className="text-xl font-bold">{title}</h3>
      </div>
      <p className="text-gray-600 ml-11">{description}</p>
    </div>
  )

  return (
    <div className="min-h-screen flex flex-col">
      <Header />

      <div className="container mx-auto px-4 py-8 flex-grow">
        <div className="flex flex-col md:flex-row gap-8">
          {/* 商品画像とプレビュー */}
          <div className="w-full md:w-1/2">
            {/* メイン商品画像 - 選択された画像を表示 */}
            <div className="relative aspect-square rounded-lg overflow-hidden mb-4">
              <Image
                src={currentMainImage || "/placeholder.svg"}
                alt="ペットフィギュア"
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
            <h1 className="text-3xl font-bold mb-2">子どもおえかきフィギュア</h1>

            <p className="text-gray-600 mb-4">
              お子さんの描いた絵をフィギュアにしませんか？ 成長の記録に、思い出をカタチとして残せます。
              たった１枚の絵からフィギュアにできます。 子どもの落書きでもOK！
            </p>

            <div className="mb-4">
              <Badge className="bg-green-100 text-green-800 hover:bg-green-100">20〜45営業日で発送</Badge>
              <Badge variant="outline" className="ml-2">
                人気商品
              </Badge>
            </div>

            <p className="text-2xl font-bold mb-2">¥9,000〜</p>
            <p className="text-sm text-muted-foreground mb-4">
              送料：<span className="text-green-600 font-medium">無料</span>
            </p>
            <p className="text-sm text-muted-foreground mb-2">※数量によって単価が変動します</p>
            <p className="text-sm text-muted-foreground mb-6">※オプション選択により金額が変動します</p>

            <div className="space-y-6 mb-6">
              {/* ステップ1: フィギュアサイズ選択 */}
              {/* 各ステップのdivタグに data-step 属性を追加します */}
              {/* ステップ1のdivタグを修正 */}
              <div className={`border rounded-lg p-6 ${currentStep === 1 ? "bg-blue-50" : ""}`} data-step="1">
                <StepHeader
                  number={1}
                  title="フィギュアサイズを選択"
                  description="フィギュアの大きさを選びましょう。大きいサイズほど細部の表現が可能になります。"
                />

                {/* 数量選択 */}
                <div className="mb-6">
                  <div className="flex items-center mb-2">
                    <h3 className="font-medium">数量</h3>
                  </div>
                  <div className="flex items-center">
                    <Input
                      type="number"
                      min="1"
                      value={quantity}
                      onChange={(e) => {
                        const value = Number.parseInt(e.target.value)
                        if (!isNaN(value) && value > 0) {
                          setQuantity(value)
                        } else if (e.target.value === "") {
                          setQuantity(1)
                        }
                      }}
                      className="w-24"
                    />
                    <span className="ml-2">個</span>
                  </div>
                  <p className="text-sm text-gray-600 mt-1">※同一デザインのみボリュームディスカウント対象</p>
                </div>

                {/* フィギュアサイズ */}
                <div>
                  <div className="flex items-center mb-2">
                    <h3 className="font-medium">フィギュアサイズ</h3>
                    <InfoPopover name="size" title="フィギュアサイズ">
                      <p>フィギュアの大きさを選択できます。</p>
                      <p>標準サイズは70mmです。</p>
                      <p>大きいサイズほど細部の表現が可能になります。</p>
                      <p>小さいサイズは価格がお手頃になります。</p>
                    </InfoPopover>
                  </div>
                  <RadioGroup defaultValue="6cm" className="grid grid-cols-3 gap-4" onValueChange={setFigureSize}>
                    {figureSizes.map((size) => (
                      <div key={size.id}>
                        <RadioGroupItem value={size.id} id={`size-${size.id}`} className="peer sr-only" />
                        <Label
                          htmlFor={`size-${size.id}`}
                          className="flex flex-col items-center justify-between rounded-md border-2 border-muted bg-popover p-4 hover:bg-accent hover:text-accent-foreground peer-data-[state=checked]:border-primary [&:has([data-state=checked])]:border-primary"
                        >
                          <span>{size.name}</span>
                          {size.price !== 0 && (
                            <span className="mt-1 text-sm text-gray-600">
                              {size.price > 0
                                ? `+¥${size.price.toLocaleString()}`
                                : `-¥${Math.abs(size.price).toLocaleString()}`}
                            </span>
                          )}
                        </Label>
                      </div>
                    ))}
                  </RadioGroup>
                </div>

                <div className="mt-6 flex justify-end">
                  <Button onClick={goToNextStep}>次へ進む</Button>
                </div>
              </div>

              {/* ステップ2: フィギュア本体カラー */}
              {currentStep >= 2 && (
                {/* ステップ2のdivタグを修正 */}
                <div className={`border rounded-lg p-6 ${currentStep === 2 ? "bg-blue-50" : ""}`} data-step="2">
                  <StepHeader
                    number={2}
                    title="フィギュア本体カラーを選択"
                    description="フィギュア本体の色を選びましょう。パーツごとに色と質感を設定できます。"
                  />

                  <div className="space-y-4">
                    {figureColors.map((colorItem, index) => (
                      <div key={colorItem.id} className="border rounded-md p-4">
                        <div className="flex justify-between items-center mb-3">
                          <h4 className="font-medium">色 {index + 1}</h4>
                          {figureColors.length > 1 && (
                            <Button
                              variant="ghost"
                              size="icon"
                              className="h-8 w-8 text-gray-500"
                              onClick={() => removeFigureColor(colorItem.id)}
                            >
                              <Trash2 className="h-4 w-4" />
                            </Button>
                          )}
                        </div>

                        {/* パーツ名入力 */}
                        <div className="mb-3">
                          <Label htmlFor={`part-name-${colorItem.id}`} className="mb-1 block text-sm">
                            パーツ名
                          </Label>
                          <Input
                            id={`part-name-${colorItem.id}`}
                            placeholder="例：本体、目、服、アクセントなど"
                            value={colorItem.partName}
                            onChange={(e) => updateFigureColor(colorItem.id, "partName", e.target.value)}
                            className="w-full"
                          />
                        </div>

                        {/* 質感選択 */}
                        <div className="mb-3">
                          <div className="flex items-center mb-1">
                            <Label className="block text-sm">質感</Label>
                            <Button
                              variant="link"
                              className="text-xs p-0 h-auto ml-2 text-blue-500"
                              onClick={scrollToMaterialTab}
                            >
                              質感について
                            </Button>
                          </div>
                          <RadioGroup
                            value={colorItem.texture}
                            className="grid grid-cols-3 gap-2"
                            onValueChange={(value) => updateFigureColor(colorItem.id, "texture", value)}
                          >
                            {textureCategories.map((texture) => (
                              <div key={texture.id}>
                                <RadioGroupItem
                                  value={texture.id}
                                  id={`texture-${colorItem.id}-${texture.id}`}
                                  className="peer sr-only"
                                />
                                <Label
                                  htmlFor={`texture-${colorItem.id}-${texture.id}`}
                                  className="flex items-center justify-center rounded-md border-2 border-muted bg-popover p-2 hover:bg-accent hover:text-accent-foreground peer-data-[state=checked]:border-primary [&:has([data-state=checked])]:border-primary cursor-pointer text-sm"
                                >
                                  {texture.name}
                                </Label>
                              </div>
                            ))}
                          </RadioGroup>\
                        </div>

                        {/* カラー選択 */}
                        <div>
                          <Label className="mb-1 block text-sm">カラー</Label>
                          <div className="grid grid-cols-6 gap-2 max-h-40 overflow-y-auto">
                            {colorsByTexture[colorItem.texture]?.map((color, i) => (
                              <div key={`color-${colorItem.id}-${i}`} className="relative">
                                <input
                                  type="radio"
                                  name={`color-${colorItem.id}`}
                                  id={`color-${colorItem.id}-${i}`}
                                  className="peer sr-only"
                                  onChange={() => updateFigureColorName(colorItem.id, color.hex, color.name)}
                                  checked={colorItem.color === color.hex}
                                />
                                <label
                                  htmlFor={`color-${colorItem.id}-${i}`}
                                  className="flex flex-col items-center justify-center rounded-md border-2 border-muted p-2 hover:bg-accent hover:text-accent-foreground peer-checked:border-primary cursor-pointer"
                                >
                                  <div
                                    className="w-6 h-6 rounded-full border"
                                    style={{ backgroundColor: color.hex }}
                                  ></div>
                                  <span className="text-xs mt-1 text-center line-clamp-1">{color.name}</span>
                                </label>
                              </div>
                            ))}
                          </div>
                        </div>
                      </div>
                    ))}

                    {/* 色追加ボタン */}
                    {figureColors.length < 12 && (
                      <Button
                        variant="outline"
                        className="w-full flex items-center justify-center"
                        onClick={addFigureColor}
                      >
                        <Plus className="mr-2 h-4 w-4" />
                        色を追加する（{figureColors.length}/12）
                      </Button>
                    )}

                    {/* 追加料金の表示 */}
                    {figureColors.length > 4 && (
                      <div className="text-sm text-gray-600 mt-2">
                        <p>
                          ※4色を超える{figureColors.length - 4}色の追加料金：¥
                          {calculateExtraColorPrice().toLocaleString()}/体
                        </p>
                      </div>
                    )}
                  </div>

                  <div className="mt-6 flex justify-between">
                    <Button variant="outline" onClick={goToPrevStep}>
                      戻る
                    </Button>
                    <Button onClick={goToNextStep}>次へ進む</Button>
                  </div>
                </div>
              )}

              {/* ステップ3: 台座オプション */}
              {currentStep >= 3 && (
                {/* ステップ3のdivタグを修正 */}
                <div className={`border rounded-lg p-6 ${currentStep === 3 ? "bg-blue-50" : ""}`} data-step="3">
                  <StepHeader
                    number={3}
                    title="台座オプションを選択"
                    description="フィギュアを支える台座のタイプとカラーを選びましょう。"
                  />

                  {/* 台座オプション */}
                  <div className="mb-6">
                    <div className="flex items-center mb-2">
                      <h3 className="font-medium">台座オプション</h3>
                      <InfoPopover name="base" title="台座オプション">
                        <p>フィギュアを支える台座のタイプを選択できます
