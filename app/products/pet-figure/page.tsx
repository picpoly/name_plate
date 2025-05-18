"use client"

import type React from "react"

import { useState, useRef, useEffect } from "react"
import Image from "next/image"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Badge } from "@/components/ui/badge"
import { Heart, Share2, Info, X, Check, Upload, Plus, Trash2, ShoppingCart } from "lucide-react"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Label } from "@/components/ui/label"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { useRouter } from "next/navigation"
import { useCart } from "@/context/cart-context"
import { v4 as uuidv4 } from "uuid"
import { Header } from "@/components/header"
import { Footer } from "@/components/footer"

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
    // 7cm prices
    { quantity: 1, size: "7cm", totalPrice: 15000, unitPrice: 15000 },
    { quantity: 2, size: "7cm", totalPrice: 20000, unitPrice: 10000 },
    { quantity: 3, size: "7cm", totalPrice: 25000, unitPrice: 8333 },
    { quantity: 4, size: "7cm", totalPrice: 30000, unitPrice: 7500 },
    { quantity: 5, size: "7cm", totalPrice: 35000, unitPrice: 7000 },
    { quantity: 6, size: "7cm", totalPrice: 39500, unitPrice: 6583 },
    { quantity: 7, size: "7cm", totalPrice: 44000, unitPrice: 6286 },
    { quantity: 8, size: "7cm", totalPrice: 48500, unitPrice: 6062 },
    { quantity: 9, size: "7cm", totalPrice: 53000, unitPrice: 5889 },
    { quantity: 10, size: "7cm", totalPrice: 57300, unitPrice: 5730 },
    { quantity: 11, size: "7cm", totalPrice: 61600, unitPrice: 5600 },
    { quantity: 12, size: "7cm", totalPrice: 65900, unitPrice: 5492 },
    { quantity: 13, size: "7cm", totalPrice: 70200, unitPrice: 5400 },
    { quantity: 14, size: "7cm", totalPrice: 74500, unitPrice: 5321 },
    { quantity: 15, size: "7cm", totalPrice: 78800, unitPrice: 5253 },
    { quantity: 16, size: "7cm", totalPrice: 83100, unitPrice: 5194 },
    { quantity: 17, size: "7cm", totalPrice: 87400, unitPrice: 5141 },
    { quantity: 18, size: "7cm", totalPrice: 91700, unitPrice: 5094 },
    { quantity: 19, size: "7cm", totalPrice: 96000, unitPrice: 5053 },
    { quantity: 20, size: "7cm", totalPrice: 100300, unitPrice: 5015 },
    { quantity: 21, size: "7cm", totalPrice: 104200, unitPrice: 4962 },
    { quantity: 22, size: "7cm", totalPrice: 108100, unitPrice: 4914 },
    { quantity: 23, size: "7cm", totalPrice: 112000, unitPrice: 4870 },
    { quantity: 24, size: "7cm", totalPrice: 115900, unitPrice: 4829 },
    { quantity: 25, size: "7cm", totalPrice: 119800, unitPrice: 4792 },
    { quantity: 26, size: "7cm", totalPrice: 123700, unitPrice: 4757 },
    { quantity: 27, size: "7cm", totalPrice: 127600, unitPrice: 4726 },
    { quantity: 28, size: "7cm", totalPrice: 131500, unitPrice: 4696 },
    { quantity: 29, size: "7cm", totalPrice: 135400, unitPrice: 4669 },
    { quantity: 30, size: "7cm", totalPrice: 139300, unitPrice: 4643 },
    { quantity: 31, size: "7cm", totalPrice: 143100, unitPrice: 4619 },
    { quantity: 32, size: "7cm", totalPrice: 146900, unitPrice: 4590 },
    { quantity: 33, size: "7cm", totalPrice: 150700, unitPrice: 4566 },
    { quantity: 34, size: "7cm", totalPrice: 154500, unitPrice: 4544 },
    { quantity: 35, size: "7cm", totalPrice: 158300, unitPrice: 4523 },
    { quantity: 36, size: "7cm", totalPrice: 162100, unitPrice: 4503 },
    { quantity: 37, size: "7cm", totalPrice: 165900, unitPrice: 4486 },
    { quantity: 38, size: "7cm", totalPrice: 169700, unitPrice: 4466 },
    { quantity: 39, size: "7cm", totalPrice: 173500, unitPrice: 4450 },
    { quantity: 40, size: "7cm", totalPrice: 177100, unitPrice: 4428 },
    { quantity: 41, size: "7cm", totalPrice: 180700, unitPrice: 4407 },
    { quantity: 42, size: "7cm", totalPrice: 184300, unitPrice: 4388 },
    { quantity: 43, size: "7cm", totalPrice: 187900, unitPrice: 4370 },
    { quantity: 44, size: "7cm", totalPrice: 191500, unitPrice: 4352 },
    { quantity: 45, size: "7cm", totalPrice: 195100, unitPrice: 4336 },
    { quantity: 46, size: "7cm", totalPrice: 198700, unitPrice: 4322 },
    { quantity: 47, size: "7cm", totalPrice: 202300, unitPrice: 4304 },
    { quantity: 48, size: "7cm", totalPrice: 205900, unitPrice: 4290 },
    { quantity: 49, size: "7cm", totalPrice: 209500, unitPrice: 4276 },
    { quantity: 50, size: "7cm", totalPrice: 212600, unitPrice: 4252 },

    // 8cm prices
    { quantity: 1, size: "8cm", totalPrice: 15500, unitPrice: 15500 },
    { quantity: 2, size: "8cm", totalPrice: 21000, unitPrice: 10500 },
    { quantity: 3, size: "8cm", totalPrice: 26500, unitPrice: 8833 },
    { quantity: 4, size: "8cm", totalPrice: 32000, unitPrice: 8000 },
    { quantity: 5, size: "8cm", totalPrice: 37500, unitPrice: 7500 },
    { quantity: 6, size: "8cm", totalPrice: 42500, unitPrice: 7083 },
    { quantity: 7, size: "8cm", totalPrice: 47500, unitPrice: 6786 },
    { quantity: 8, size: "8cm", totalPrice: 52500, unitPrice: 6563 },
    { quantity: 9, size: "8cm", totalPrice: 57500, unitPrice: 6389 },
    { quantity: 10, size: "8cm", totalPrice: 62300, unitPrice: 6230 },
    { quantity: 11, size: "8cm", totalPrice: 67100, unitPrice: 6100 },
    { quantity: 12, size: "8cm", totalPrice: 71900, unitPrice: 5992 },
    { quantity: 13, size: "8cm", totalPrice: 76700, unitPrice: 5900 },
    { quantity: 14, size: "8cm", totalPrice: 81500, unitPrice: 5821 },
    { quantity: 15, size: "8cm", totalPrice: 86300, unitPrice: 5753 },
    { quantity: 16, size: "8cm", totalPrice: 91100, unitPrice: 5694 },
    { quantity: 17, size: "8cm", totalPrice: 95900, unitPrice: 5641 },
    { quantity: 18, size: "8cm", totalPrice: 100700, unitPrice: 5594 },
    { quantity: 19, size: "8cm", totalPrice: 105500, unitPrice: 5553 },
    { quantity: 20, size: "8cm", totalPrice: 110300, unitPrice: 5515 },
    { quantity: 21, size: "8cm", totalPrice: 114700, unitPrice: 5462 },
    { quantity: 22, size: "8cm", totalPrice: 119100, unitPrice: 5414 },
    { quantity: 23, size: "8cm", totalPrice: 123500, unitPrice: 5370 },
    { quantity: 24, size: "8cm", totalPrice: 127900, unitPrice: 5329 },
    { quantity: 25, size: "8cm", totalPrice: 132300, unitPrice: 5292 },
    { quantity: 26, size: "8cm", totalPrice: 136700, unitPrice: 5258 },
    { quantity: 27, size: "8cm", totalPrice: 141100, unitPrice: 5226 },
    { quantity: 28, size: "8cm", totalPrice: 145500, unitPrice: 5196 },
    { quantity: 29, size: "8cm", totalPrice: 149900, unitPrice: 5169 },
    { quantity: 30, size: "8cm", totalPrice: 154300, unitPrice: 5143 },
    { quantity: 31, size: "8cm", totalPrice: 158600, unitPrice: 5116 },
    { quantity: 32, size: "8cm", totalPrice: 162900, unitPrice: 5091 },
    { quantity: 33, size: "8cm", totalPrice: 167200, unitPrice: 5067 },
    { quantity: 34, size: "8cm", totalPrice: 171500, unitPrice: 5044 },
    { quantity: 35, size: "8cm", totalPrice: 175800, unitPrice: 5023 },
    { quantity: 36, size: "8cm", totalPrice: 180100, unitPrice: 5003 },
    { quantity: 37, size: "8cm", totalPrice: 184400, unitPrice: 4984 },
    { quantity: 38, size: "8cm", totalPrice: 188700, unitPrice: 4966 },
    { quantity: 39, size: "8cm", totalPrice: 193000, unitPrice: 4949 },
    { quantity: 40, size: "8cm", totalPrice: 197100, unitPrice: 4928 },
    { quantity: 41, size: "8cm", totalPrice: 201200, unitPrice: 4907 },
    { quantity: 42, size: "8cm", totalPrice: 205300, unitPrice: 4888 },
    { quantity: 43, size: "8cm", totalPrice: 209400, unitPrice: 4870 },
    { quantity: 44, size: "8cm", totalPrice: 213500, unitPrice: 4852 },
    { quantity: 45, size: "8cm", totalPrice: 217600, unitPrice: 4836 },
    { quantity: 46, size: "8cm", totalPrice: 221700, unitPrice: 4820 },
    { quantity: 47, size: "8cm", totalPrice: 225800, unitPrice: 4804 },
    { quantity: 48, size: "8cm", totalPrice: 229900, unitPrice: 4790 },
    { quantity: 49, size: "8cm", totalPrice: 234000, unitPrice: 4776 },
    { quantity: 50, size: "8cm", totalPrice: 237600, unitPrice: 4752 },

    // 9cm prices
    { quantity: 1, size: "9cm", totalPrice: 15800, unitPrice: 15800 },
    { quantity: 2, size: "9cm", totalPrice: 21600, unitPrice: 10800 },
    { quantity: 3, size: "9cm", totalPrice: 27400, unitPrice: 9133 },
    { quantity: 4, size: "9cm", totalPrice: 33200, unitPrice: 8300 },
    { quantity: 5, size: "9cm", totalPrice: 39000, unitPrice: 7800 },
    { quantity: 6, size: "9cm", totalPrice: 44300, unitPrice: 7383 },
    { quantity: 7, size: "9cm", totalPrice: 49600, unitPrice: 7086 },
    { quantity: 8, size: "9cm", totalPrice: 54900, unitPrice: 6863 },
    { quantity: 9, size: "9cm", totalPrice: 60200, unitPrice: 6689 },
    { quantity: 10, size: "9cm", totalPrice: 65300, unitPrice: 6530 },
    { quantity: 11, size: "9cm", totalPrice: 70400, unitPrice: 6400 },
    { quantity: 12, size: "9cm", totalPrice: 75500, unitPrice: 6292 },
    { quantity: 13, size: "9cm", totalPrice: 80600, unitPrice: 6200 },
    { quantity: 14, size: "9cm", totalPrice: 85700, unitPrice: 6121 },
    { quantity: 15, size: "9cm", totalPrice: 90800, unitPrice: 6053 },
    { quantity: 16, size: "9cm", totalPrice: 95900, unitPrice: 5994 },
    { quantity: 17, size: "9cm", totalPrice: 101000, unitPrice: 5941 },
    { quantity: 18, size: "9cm", totalPrice: 106100, unitPrice: 5894 },
    { quantity: 19, size: "9cm", totalPrice: 111200, unitPrice: 5853 },
    { quantity: 20, size: "9cm", totalPrice: 116300, unitPrice: 5815 },
    { quantity: 21, size: "9cm", totalPrice: 121000, unitPrice: 5762 },
    { quantity: 22, size: "9cm", totalPrice: 125700, unitPrice: 5714 },
    { quantity: 23, size: "9cm", totalPrice: 130400, unitPrice: 5670 },
    { quantity: 24, size: "9cm", totalPrice: 135100, unitPrice: 5629 },
    { quantity: 25, size: "9cm", totalPrice: 139800, unitPrice: 5592 },
    { quantity: 26, size: "9cm", totalPrice: 144500, unitPrice: 5558 },
    { quantity: 27, size: "9cm", totalPrice: 149200, unitPrice: 5526 },
    { quantity: 28, size: "9cm", totalPrice: 153900, unitPrice: 5496 },
    { quantity: 29, size: "9cm", totalPrice: 158600, unitPrice: 5469 },
    { quantity: 30, size: "9cm", totalPrice: 163300, unitPrice: 5443 },
    { quantity: 31, size: "9cm", totalPrice: 167900, unitPrice: 5416 },
    { quantity: 32, size: "9cm", totalPrice: 172500, unitPrice: 5391 },
    { quantity: 33, size: "9cm", totalPrice: 177100, unitPrice: 5367 },
    { quantity: 34, size: "9cm", totalPrice: 181700, unitPrice: 5344 },
    { quantity: 35, size: "9cm", totalPrice: 186300, unitPrice: 5323 },
    { quantity: 36, size: "9cm", totalPrice: 190900, unitPrice: 5303 },
    { quantity: 37, size: "9cm", totalPrice: 195500, unitPrice: 5284 },
    { quantity: 38, size: "9cm", totalPrice: 200100, unitPrice: 5266 },
    { quantity: 39, size: "9cm", totalPrice: 204700, unitPrice: 5249 },
    { quantity: 40, size: "9cm", totalPrice: 209100, unitPrice: 5228 },
    { quantity: 41, size: "9cm", totalPrice: 213500, unitPrice: 5207 },
    { quantity: 42, size: "9cm", totalPrice: 217900, unitPrice: 5188 },
    { quantity: 43, size: "9cm", totalPrice: 222300, unitPrice: 5170 },
    { quantity: 44, size: "9cm", totalPrice: 226700, unitPrice: 5152 },
    { quantity: 45, size: "9cm", totalPrice: 231100, unitPrice: 5136 },
    { quantity: 46, size: "9cm", totalPrice: 235500, unitPrice: 5120 },
    { quantity: 47, size: "9cm", totalPrice: 239900, unitPrice: 5104 },
    { quantity: 48, size: "9cm", totalPrice: 244300, unitPrice: 5090 },
    { quantity: 49, size: "9cm", totalPrice: 248700, unitPrice: 5076 },
    { quantity: 50, size: "9cm", totalPrice: 252600, unitPrice: 5052 },

    // 10cm prices
    { quantity: 1, size: "10cm", totalPrice: 16000, unitPrice: 16000 },
    { quantity: 2, size: "10cm", totalPrice: 22000, unitPrice: 11000 },
    { quantity: 3, size: "10cm", totalPrice: 28000, unitPrice: 9333 },
    { quantity: 4, size: "10cm", totalPrice: 34000, unitPrice: 8500 },
    { quantity: 5, size: "10cm", totalPrice: 40000, unitPrice: 8000 },
    { quantity: 6, size: "10cm", totalPrice: 45500, unitPrice: 7583 },
    { quantity: 7, size: "10cm", totalPrice: 51000, unitPrice: 7286 },
    { quantity: 8, size: "10cm", totalPrice: 56500, unitPrice: 7063 },
    { quantity: 9, size: "10cm", totalPrice: 62000, unitPrice: 6889 },
    { quantity: 10, size: "10cm", totalPrice: 67300, unitPrice: 6730 },
    { quantity: 11, size: "10cm", totalPrice: 72600, unitPrice: 6600 },
    { quantity: 12, size: "10cm", totalPrice: 77900, unitPrice: 6492 },
    { quantity: 13, size: "10cm", totalPrice: 83200, unitPrice: 6400 },
    { quantity: 14, size: "10cm", totalPrice: 88500, unitPrice: 6321 },
    { quantity: 15, size: "10cm", totalPrice: 93800, unitPrice: 6253 },
    { quantity: 16, size: "10cm", totalPrice: 99100, unitPrice: 6194 },
    { quantity: 17, size: "10cm", totalPrice: 104400, unitPrice: 6141 },
    { quantity: 18, size: "10cm", totalPrice: 109700, unitPrice: 6094 },
    { quantity: 19, size: "10cm", totalPrice: 115000, unitPrice: 6053 },
    { quantity: 20, size: "10cm", totalPrice: 120300, unitPrice: 6015 },
    { quantity: 21, size: "10cm", totalPrice: 125200, unitPrice: 5962 },
    { quantity: 22, size: "10cm", totalPrice: 130100, unitPrice: 5914 },
    { quantity: 23, size: "10cm", totalPrice: 135000, unitPrice: 5870 },
    { quantity: 24, size: "10cm", totalPrice: 139900, unitPrice: 5829 },
    { quantity: 25, size: "10cm", totalPrice: 144800, unitPrice: 5792 },
    { quantity: 26, size: "10cm", totalPrice: 149700, unitPrice: 5758 },
    { quantity: 27, size: "10cm", totalPrice: 154600, unitPrice: 5726 },
    { quantity: 28, size: "10cm", totalPrice: 159500, unitPrice: 5696 },
    { quantity: 29, size: "10cm", totalPrice: 164400, unitPrice: 5669 },
    { quantity: 30, size: "10cm", totalPrice: 169300, unitPrice: 5643 },
    { quantity: 31, size: "10cm", totalPrice: 174100, unitPrice: 5616 },
    { quantity: 32, size: "10cm", totalPrice: 178900, unitPrice: 5591 },
    { quantity: 33, size: "10cm", totalPrice: 183700, unitPrice: 5567 },
    { quantity: 34, size: "10cm", totalPrice: 188500, unitPrice: 5544 },
    { quantity: 35, size: "10cm", totalPrice: 193300, unitPrice: 5523 },
    { quantity: 36, size: "10cm", totalPrice: 198100, unitPrice: 5503 },
    { quantity: 37, size: "10cm", totalPrice: 202900, unitPrice: 5484 },
    { quantity: 38, size: "10cm", totalPrice: 207700, unitPrice: 5466 },
    { quantity: 39, size: "10cm", totalPrice: 212500, unitPrice: 5449 },
    { quantity: 40, size: "10cm", totalPrice: 217100, unitPrice: 5428 },
    { quantity: 41, size: "10cm", totalPrice: 221700, unitPrice: 5407 },
    { quantity: 42, size: "10cm", totalPrice: 226300, unitPrice: 5388 },
    { quantity: 43, size: "10cm", totalPrice: 230900, unitPrice: 5370 },
    { quantity: 44, size: "10cm", totalPrice: 235500, unitPrice: 5352 },
    { quantity: 45, size: "10cm", totalPrice: 240100, unitPrice: 5336 },
    { quantity: 46, size: "10cm", totalPrice: 244700, unitPrice: 5320 },
    { quantity: 47, size: "10cm", totalPrice: 249300, unitPrice: 5304 },
    { quantity: 48, size: "10cm", totalPrice: 253900, unitPrice: 5290 },
    { quantity: 49, size: "10cm", totalPrice: 258500, unitPrice: 5276 },
    { quantity: 50, size: "10cm", totalPrice: 262600, unitPrice: 5252 },
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
    { src: "/pet-figure-3.png", alt: "ペットフィギュア例 1" },
    { src: "/pet-figure-1.jpeg", alt: "ペットフィギュア例 2" },
    { src: "/pet-figure-2.png", alt: "ペットフィギュア例 3" },
    { src: "/pet-figure-4.png", alt: "ペットフィギュア例 4" },
  ]

  // 現在表示中のメイン画像を管理するステート
  const [currentMainImage, setCurrentMainImage] = useState("/pet-figure-3.png")

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
    const currentStepSection = document.querySelector(`[data-step="${currentStep}"]`)

    // 次のステップに更新
    setCurrentStep(currentStep + 1)

    // 少し遅延を入れて、state更新後に次のステップのセクションを取得
    setTimeout(() => {
      const nextStepSection = document.querySelector(`[data-step="${currentStep + 1}"]`)
      if (nextStepSection) {
        // スムーズにスクロール
        nextStepSection.scrollIntoView({ behavior: "smooth", block: "start" })
      }
    }, 100)
  }

  // goToPrevStep 関数を以下のように修正します
  const goToPrevStep = () => {
    // 現在のステップのセクションを取得
    const currentStepSection = document.querySelector(`[data-step="${currentStep}"]`)

    // 前のステップに更新
    setCurrentStep(currentStep - 1)

    // 少し遅延を入れて、state更新後に前のステップのセクションを取得
    setTimeout(() => {
      const prevStepSection = document.querySelector(`[data-step="${currentStep - 1}"]`)
      if (prevStepSection) {
        // スムーズにスクロール
        prevStepSection.scrollIntoView({ behavior: "smooth", block: "start" })
      }
    }, 100)
  }

  // カートに追加する関数
  const handleAddToCart = () => {
    // 画像アップロードのバリデーション
    if (!uploadedFile) {
      setUploadError("ペットの画像のアップロードは必須です。")
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

    // ペットの種類を取得
    const selectedPetType = petTypes.find((type) => type.id === petType)
    const petTypeName = selectedPetType ? selectedPetType.name : ""

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
      name: "ペットフィギュア",
      price: getCurrentPrice(),
      quantity: quantity,
      image: "/pet-figure-3.png",
      customizations: {
        petType: petTypeName,
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
            <h1 className="text-3xl font-bold mb-2">ペットフィギュア</h1>

            <p className="text-gray-600 mb-4">
              大切なペットを写真から3Dフィギュアにします。リアルな造形で、愛するペットの姿を永遠に残せます。
              高品質な3Dプリント技術で細部まで再現します。
            </p>

            <div className="mb-4">
              <Badge className="bg-green-100 text-green-800 hover:bg-green-100">20〜45営業日で発送</Badge>
              <Badge variant="outline" className="ml-2">
                人気商品
              </Badge>
            </div>

            <p className="text-2xl font-bold mb-2">¥15,000〜</p>
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

                {/* ペットの種類 */}
                <div className="mb-6">
                  <div className="flex items-center mb-2">
                    <h3 className="font-medium">ペットの種類</h3>
                  </div>
                  <RadioGroup defaultValue="dog" className="grid grid-cols-4 gap-2" onValueChange={setPetType}>
                    {petTypes.map((type) => (
                      <div key={type.id}>
                        <RadioGroupItem value={type.id} id={`pet-type-${type.id}`} className="peer sr-only" />
                        <Label
                          htmlFor={`pet-type-${type.id}`}
                          className="flex items-center justify-center rounded-md border-2 border-muted bg-popover p-2 hover:bg-accent hover:text-accent-foreground peer-data-[state=checked]:border-primary [&:has([data-state=checked])]:border-primary cursor-pointer"
                        >
                          {type.name}
                        </Label>
                      </div>
                    ))}
                  </RadioGroup>
                </div>

                {/* フィギュアサイズ */}
                <div>
                  <div className="flex items-center mb-2">
                    <h3 className="font-medium">フィギュアサイズ</h3>
                    <InfoPopover name="size" title="フィギュアサイズ">
                      <p>フィギュアの大きさを選択できます。</p>
                      <p>標準サイズは12cmです。</p>
                      <p>大きいサイズほど細部の表現が可能になります。</p>
                      <p>小さいサイズは価格がお手頃になります。</p>
                    </InfoPopover>
                  </div>
                  <RadioGroup defaultValue="7cm" className="grid grid-cols-3 gap-4" onValueChange={setFigureSize}>
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
                // ステップ2のdivタグを修正
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
                          </RadioGroup>
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
                // ステップ3のdivタグを修正
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
                        <p>フィギュアを支える台座のタイプを選択できます。</p>
                        <p>台座なし：フィギュア単体でのお届けです。</p>
                        <p className="font-semibold mt-2">シンプル台座 +300円/体</p>
                        <p>お好きな色を１色お選びいただけます。</p>
                        <p>台座の設計はご依頼のフィギュアに合わせて最適なものをお作りします。</p>
                        <p>台座の形は豊富なテンプレートからお選びいただきます。</p>
                        <p className="font-semibold mt-2">デザイン台座 +500円/体</p>
                        <p>文字やロゴを入れたい方におすすめです！</p>
                        <p>こちらはデータ入稿が必要です。</p>
                        <p>形式：Ai / SVG</p>
                        <p>台座の設計はご依頼のフィギュアに合わせて最適なものをお作りします。</p>
                      </InfoPopover>
                    </div>
                    <RadioGroup defaultValue="none" className="grid grid-cols-3 gap-4" onValueChange={setBaseOption}>
                      {baseOptions.map((option) => (
                        <div key={option.id}>
                          <RadioGroupItem value={option.id} id={`base-${option.id}`} className="peer sr-only" />
                          <Label
                            htmlFor={`base-${option.id}`}
                            className="flex flex-col items-center justify-between rounded-md border-2 border-muted bg-popover p-4 hover:bg-accent hover:text-accent-foreground peer-data-[state=checked]:border-primary [&:has([data-state=checked])]:border-primary"
                          >
                            <span>{option.name}</span>
                            {option.price !== 0 && (
                              <span className="mt-1 text-sm text-gray-600">
                                {option.price > 0
                                  ? `+¥${option.price.toLocaleString()}`
                                  : `-¥${Math.abs(option.price).toLocaleString()}`}
                              </span>
                            )}
                          </Label>
                        </div>
                      ))}
                    </RadioGroup>
                  </div>

                  {/* 台座カラー質感 */}
                  {baseOption !== "none" && (
                    <div className="mb-6">
                      <div className="flex items-center mb-2">
                        <h3 className="font-medium">台座カラー質感</h3>
                        <InfoPopover name="baseTexture" title="台座カラー質感">
                          <p>ノーマル：標準的な光沢のある仕上がり</p>
                          <p>マット：落ち着いた質感の艶消し仕上げ</p>
                          <p>シルク：上品な光沢感のある特殊仕上げ</p>
                        </InfoPopover>
                      </div>
                      <RadioGroup
                        defaultValue="normal"
                        className="grid grid-cols-3 gap-2"
                        onValueChange={handleBaseTextureChange}
                      >
                        {textureCategories.map((texture) => (
                          <div key={texture.id}>
                            <RadioGroupItem
                              value={texture.id}
                              id={`base-texture-${texture.id}`}
                              className="peer sr-only"
                            />
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
                  )}

                  {/* 台座カラー */}
                  {baseOption !== "none" && (
                    <div>
                      <div className="flex items-center mb-2">
                        <h3 className="font-medium">台座カラー</h3>
                        <InfoPopover name="baseColor" title="台座カラー">
                          <p>台座の背景色を選択</p>
                          <p>選択した質感によって利用できる色が変わります</p>
                          <p>キャラクターの雰囲気に合わせたカラーをお選びください</p>
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
                  )}

                  {/* デザイン台座選択時のデザインアップロードセクション */}
                  {baseOption === "custom" && (
                    <div id="design-upload-section" className="mt-6">
                      <div className="flex items-center mb-2">
                        <h3 className="font-medium">
                          台座デザインデータをアップロード<span className="text-red-500 ml-1">*</span>
                        </h3>
                        <InfoPopover name="designUpload" title="台座デザインデータ">
                          <p>台座に入れるデザインデータをアップロードしてください。</p>
                          <p className="font-medium">推奨形式: SVG, AI</p>
                          <p>ベクター形式のデータが最適です。</p>
                          <p>解像度の高いPNG, JPGも可能ですが、品質が低下する場合があります。</p>
                          <p className="text-red-500 font-medium">※デザイン台座を選択した場合は必須です</p>
                        </InfoPopover>
                      </div>
                      <div
                        className={`border-2 border-dashed rounded-lg p-6 text-center ${designUploadError ? "border-red-500" : ""}`}
                      >
                        {designPreviewUrl ? (
                          <div className="space-y-4">
                            <div className="relative h-40 mx-auto">
                              <Image
                                src={designPreviewUrl || "/placeholder.svg"}
                                alt="デザインプレビュー"
                                fill
                                className="object-contain"
                              />
                            </div>
                            <p className="text-sm text-gray-600">{designUploadedFile?.name}</p>
                            <Button
                              variant="outline"
                              onClick={() => {
                                setDesignUploadedFile(null)
                                setDesignPreviewUrl(null)
                              }}
                            >
                              ファイルを削除
                            </Button>
                          </div>
                        ) : (
                          <div className="space-y-4">
                            <Upload className="mx-auto h-12 w-12 text-gray-400" />
                            <p className="text-sm text-gray-600">
                              SVG, AI形式を推奨
                              <br />
                              PNG, JPG, PDF形式も可能（最大10MB）
                            </p>
                            <Button variant="outline" asChild>
                              <label className="cursor-pointer">
                                ファイルを選択
                                <input
                                  type="file"
                                  className="hidden"
                                  accept=".svg,.ai,.jpg,.jpeg,.png,.pdf"
                                  onChange={handleDesignFileUpload}
                                />
                              </label>
                            </Button>
                          </div>
                        )}
                      </div>
                      {designUploadError && <p className="text-sm text-red-500 mt-2">{designUploadError}</p>}
                      <p className="text-sm text-gray-600 mt-2">
                        ※ベクター形式（SVG, AI）のデータを推奨します。より高品質な仕上がりになります。
                      </p>
                    </div>
                  )}

                  <div className="mt-6 flex justify-between">
                    <Button variant="outline" onClick={goToPrevStep}>
                      戻る
                    </Button>
                    <Button onClick={goToNextStep}>次へ進む</Button>
                  </div>
                </div>
              )}

              {/* ステップ4: キャラクター画像のアップロード */}
              {currentStep >= 4 && (
                // ステップ4のdivタグを修正
                <div className={`border rounded-lg p-6 ${currentStep === 4 ? "bg-blue-50" : ""}`} data-step="4">
                  <StepHeader
                    number={4}
                    title="ペット画像をアップロード"
                    description="フィギュア化したいペットの画像をアップロードしましょう。"
                  />

                  {/* ファイルアップロード */}
                  <div id="figure-upload-section">
                    <div className="flex items-center mb-2">
                      <h3 className="font-medium">
                        ペット画像をアップロード<span className="text-red-500 ml-1">*</span>
                      </h3>
                      <InfoPopover name="upload" title="ペット画像">
                        <p>フィギュア化したいペットの画像をアップロードしてください。</p>
                        <p>複数アングルの画像があると、より正確に再現できます。</p>
                        <p>JPG、PNG、PDF形式（最大10MB）に対応しています。</p>
                        <p className="text-red-500 font-medium">※画像のアップロードは必須です</p>
                      </InfoPopover>
                    </div>
                    <div
                      className={`border-2 border-dashed rounded-lg p-6 text-center ${uploadError ? "border-red-500" : ""}`}
                    >
                      {previewUrl ? (
                        <div className="space-y-4">
                          <div className="relative h-40 mx-auto">
                            <Image
                              src={previewUrl || "/placeholder.svg"}
                              alt="プレビュー"
                              fill
                              className="object-contain"
                            />
                          </div>
                          <p className="text-sm text-gray-600">{uploadedFile?.name}</p>
                          <Button
                            variant="outline"
                            onClick={() => {
                              setUploadedFile(null)
                              setPreviewUrl(null)
                            }}
                          >
                            ファイルを削除
                          </Button>
                        </div>
                      ) : (
                        <div className="space-y-4">
                          <Upload className="mx-auto h-12 w-12 text-gray-400" />
                          <p className="text-sm text-gray-600">
                            JPG、PNG、PDF形式のファイルをアップロード
                            <br />
                            （最大10MB）
                          </p>
                          <Button variant="outline" asChild>
                            <label className="cursor-pointer">
                              ファイルを選択
                              <input
                                type="file"
                                className="hidden"
                                accept=".jpg,.jpeg,.png,.pdf"
                                onChange={handleFileUpload}
                              />
                            </label>
                          </Button>
                        </div>
                      )}
                    </div>
                    {uploadError && <p className="text-sm text-red-500 mt-2">{uploadError}</p>}
                    <p className="text-sm text-gray-600 mt-2">
                      ※複数アングルの画像がある場合は、zipファイルにまとめてアップロードしてください
                    </p>
                  </div>

                  {/* 備考欄 */}
                  <div className="mt-6">
                    <h3 className="font-medium mb-2">備考・ご要望</h3>
                    <Textarea
                      placeholder="特記事項やご要望があればご記入ください"
                      value={notes}
                      onChange={(e) => setNotes(e.target.value)}
                    />
                  </div>

                  <div className="mt-6 flex justify-between">
                    <Button variant="outline" onClick={goToPrevStep}>
                      戻る
                    </Button>
                    <Button onClick={goToNextStep}>次へ進む</Button>
                  </div>
                </div>
              )}

              {/* ステップ5: 注文内容の確認 */}
              {currentStep >= 5 && (
                // ステップ5のdivタグを修正
                <div className={`border rounded-lg p-6 ${currentStep === 5 ? "bg-blue-50" : ""}`} data-step="5">
                  <StepHeader
                    number={5}
                    title="注文内容の確認"
                    description="選択内容と金額を確認して、カートに追加しましょう。"
                  />

                  <div className="bg-gray-50 p-4 rounded-lg border mb-6">
                    <h3 className="font-medium mb-2">注文内容</h3>
                    <ul className="space-y-2 text-sm">
                      <li>
                        <span className="font-medium">数量:</span> {quantity}個
                      </li>
                      <li>
                        <span className="font-medium">ペットの種類:</span>{" "}
                        {petTypes.find((type) => type.id === petType)?.name || ""}
                      </li>
                      <li>
                        <span className="font-medium">フィギュアサイズ:</span>{" "}
                        {figureSize === "7cm"
                          ? "7cm×7cm×7cm"
                          : figureSize === "8cm"
                            ? "8cm×8cm×8cm"
                            : figureSize === "9cm"
                              ? "9cm×9cm×9cm"
                              : "10cm×10cm×10cm"}
                      </li>
                      <li>
                        <span className="font-medium">フィギュア本体カラー:</span>
                        <ul className="ml-4 mt-1">
                          {figureColors.map((color) => (
                            <li key={color.id}>
                              {color.partName || "未指定"}: {color.colorName}（
                              {color.texture === "normal"
                                ? "ノーマル"
                                : color.texture === "matte"
                                  ? "マット"
                                  : "シルク"}
                              ）
                            </li>
                          ))}
                        </ul>
                      </li>
                      <li>
                        <span className="font-medium">台座オプション:</span>{" "}
                        {baseOption === "none" ? "台座なし" : baseOption === "simple" ? "シンプル台座" : "デザイン台座"}
                      </li>
                      {baseOption !== "none" && (
                        <li>
                          <span className="font-medium">台座カラー:</span> {baseColorName}（
                          {baseTexture === "normal" ? "ノーマル" : baseTexture === "matte" ? "マット" : "シルク"}）
                        </li>
                      )}
                      <li>
                        <span className="font-medium">ペット画像:</span>{" "}
                        {uploadedFile ? uploadedFile.name : "未アップロード"}
                      </li>
                      {baseOption === "custom" && (
                        <li>
                          <span className="font-medium">台座デザインデータ:</span>{" "}
                          {designUploadedFile ? designUploadedFile.name : "未アップロード"}
                        </li>
                      )}
                      {notes && (
                        <li>
                          <span className="font-medium">備考・ご要望:</span> {notes}
                        </li>
                      )}
                    </ul>
                  </div>

                  <div className="bg-gray-50 p-4 rounded-lg border mb-6">
                    <div className="flex justify-between items-center">
                      <span className="text-lg">合計金額:</span>
                      <span className="text-2xl font-bold">¥{calculateTotal().toLocaleString()}</span>
                    </div>
                    <div className="text-sm text-muted-foreground mt-1">
                      単価 ¥{getCurrentPrice().toLocaleString()} × {quantity}個
                    </div>
                    {figureColors.length > 4 && (
                      <div className="text-sm text-muted-foreground mt-1">
                        （内訳：基本料金 + 追加色料金 ¥{calculateExtraColorPrice().toLocaleString()}/体）
                      </div>
                    )}
                  </div>

                  <div className="flex gap-4">
                    {addedToCart ? (
                      <Button className="flex-1" size="lg" onClick={() => (window.location.href = "/cart")}>
                        <Check className="mr-2 h-5 w-5" />
                        カートに追加済み - カートへ進む
                      </Button>
                    ) : (
                      <Button className="flex-1" size="lg" onClick={handleAddToCart}>
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

                  <div className="mt-6 flex justify-start">
                    <Button variant="outline" onClick={goToPrevStep}>
                      戻る
                    </Button>
                  </div>
                </div>
              )}
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
                        <TableHead className="w-1/5">サイズ / 数量</TableHead>
                        <TableHead className="w-1/5">7cm×7cm×7cm</TableHead>
                        <TableHead className="w-1/5">8cm×8cm×8cm</TableHead>
                        <TableHead className="w-1/5">9cm×9cm×9cm</TableHead>
                        <TableHead className="w-1/5">10cm×10cm×10cm</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {[1, 2, 3, 4, 5, 10, 20, 30, 50].map((qty) => (
                        <TableRow key={qty}>
                          <TableCell>{qty}個</TableCell>
                          <TableCell>
                            ¥
                            {priceTable
                              .find((entry) => entry.quantity === qty && entry.size === "7cm")
                              ?.unitPrice.toLocaleString()}
                          </TableCell>
                          <TableCell>
                            ¥
                            {priceTable
                              .find((entry) => entry.quantity === qty && entry.size === "8cm")
                              ?.unitPrice.toLocaleString()}
                          </TableCell>
                          <TableCell>
                            ¥
                            {priceTable
                              .find((entry) => entry.quantity === qty && entry.size === "9cm")
                              ?.unitPrice.toLocaleString()}
                          </TableCell>
                          <TableCell>
                            ¥
                            {priceTable
                              .find((entry) => entry.quantity === qty && entry.size === "10cm")
                              ?.unitPrice.toLocaleString()}
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </div>
                <p className="text-sm text-gray-600 mt-4">※51個以上ご注文の方はご相談ください</p>
                <p className="text-sm text-gray-600 mt-2">
                  ※フィギュア本体カラーは4色まで追加料金なし、5色目以降は1色につき800円/体が追加されます
                </p>
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
                      <TableCell>7cm×7cm×7cm、8cm×8cm×8cm、9cm×9cm×9cm、10cm×10cm×10cmから選択可能</TableCell>
                    </TableRow>
                    <TableRow>
                      <TableCell className="font-medium">重量</TableCell>
                      <TableCell>約30g〜150g（サイズによる）</TableCell>
                    </TableRow>
                    <TableRow>
                      <TableCell className="font-medium">カラーバリエーション</TableCell>
                      <TableCell>ノーマル・マット・シルク質感の全80色以上から選択可能</TableCell>
                    </TableRow>
                    <TableRow>
                      <TableCell className="font-medium">台座オプション</TableCell>
                      <TableCell>台座なし／シンプル台座／デザイン台座から選択可能</TableCell>
                    </TableRow>

                    <TableRow>
                      <TableCell className="font-medium">製造方法</TableCell>
                      <TableCell>3Dモデリングデータを元に高精度3Dプリンター出力</TableCell>
                    </TableRow>
                    <TableRow>
                      <TableCell className="font-medium">包装</TableCell>
                      <TableCell>クッション材入り専用ギフトボックス</TableCell>
                    </TableRow>
                    <TableRow>
                      <TableCell className="font-medium">生産国</TableCell>
                      <TableCell>日本</TableCell>
                    </TableRow>
                    <TableRow>
                      <TableCell className="font-medium">納期目安</TableCell>
                      <TableCell>ご注文確定後 20〜45営業日</TableCell>
                    </TableRow>
                  </TableBody>
                </Table>
              </TabsContent>
              <TabsContent value="details" className="pt-4">
                <ul className="list-disc pl-5 space-y-2 text-sm">
                  <li>大切なペットを写真から3Dフィギュアにします</li>
                  <li>リアルな造形で、愛するペットの姿を永遠に残せます</li>
                  <li>高品質な3Dプリント技術で細部まで再現</li>
                  <li>丈夫で長持ちする素材を使用</li>
                  <li>記念品やプレゼントに最適</li>
                  <li>大切なペットの思い出を形に残せます</li>
                  <li>オリジナルデザインで他にはない特別な一品</li>
                </ul>

                <div className="mt-6">
                  <h3 className="font-medium mb-3">写真から忠実に再現</h3>
                  <div className="grid grid-cols-2 gap-4 mb-4">
                    <div className="relative aspect-square rounded overflow-hidden">
                      <Image src="/pet-figure-1.jpeg" alt="ペットフィギュア例" fill className="object-contain" />
                    </div>
                    <div className="relative aspect-square rounded overflow-hidden">
                      <Image src="/pet-figure-2.png" alt="ペットフィギュア例2" fill className="object-contain" />
                    </div>
                  </div>
                </div>

                <div className="mt-6 grid grid-cols-2 gap-4">
                  <div className="relative aspect-square rounded overflow-hidden">
                    <Image src="/pet-figure-3.png" alt="ペットフィギュア例3" fill className="object-contain" />
                  </div>
                  <div className="relative aspect-square rounded overflow-hidden">
                    <Image src="/pet-figure-4.png" alt="ペットフィギュア例4" fill className="object-contain" />
                  </div>
                </div>
              </TabsContent>
              <TabsContent value="shipping" className="pt-4">
                <div className="space-y-2 text-sm">
                  <p>
                    送料：<span className="text-green-600 font-medium">無料</span>
                  </p>
                  <p>通常配送: 20-45営業日以内に発送</p>
                  <p>※製作状況により納期が前後する場合があります</p>
                  <p>※お急ぎの場合はお問い合わせください</p>
                  <p>※海外発送も承ります（別途送料）</p>
                </div>

                <div className="mt-6 pt-4 border-t">
                  <div className="flex items-center justify-center space-x-2">
                    <Image
                      src="/abstract-credit-card-design.png"
                      alt="クレジットカード決済"
                      width={60}
                      height={40}
                      className="object-contain"
                    />
                    <span className="text-sm text-gray-600">各種クレジットカード対応</span>
                  </div>
                </div>
              </TabsContent>
            </Tabs>
          </div>
        </div>
      </div>

      {/* 関連商品 */}
      <div className="container mx-auto px-4 py-8">
        <h2 className="text-2xl font-bold mb-6">関連商品</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          <Link href="/products/sd-figure" className="block group">
            <div className="bg-white rounded-md overflow-hidden shadow-sm hover:shadow-md transition-shadow">
              <div className="relative aspect-square w-full">
                <Image
                  src="/sd-figure-new.png"
                  alt="人物SDフィギュア"
                  fill
                  className="object-contain p-2 group-hover:scale-105 transition-transform duration-300"
                />
              </div>
              <div className="p-4">
                <h3 className="font-bold text-gray-900 mb-1 group-hover:text-[#f6be5a] transition-colors">
                  人物SDフィギュア
                </h3>
                <p className="text-[#f6be5a] font-bold">¥25,000〜</p>
              </div>
            </div>
          </Link>
          <Link href="/products/pet-figure" className="block group">
            <div className="bg-white rounded-md overflow-hidden shadow-sm hover:shadow-md transition-shadow">
              <div className="relative aspect-square w-full">
                <Image
                  src="/pet-figure-3.png"
                  alt="ペットフィギュア"
                  fill
                  className="object-contain p-2 group-hover:scale-105 transition-transform duration-300"
                />
              </div>
              <div className="p-4">
                <h3 className="font-bold text-gray-900 mb-1 group-hover:text-[#f6be5a] transition-colors">
                  ペットフィギュア
                </h3>
                <p className="text-[#f6be5a] font-bold">¥15,000〜</p>
              </div>
            </div>
          </Link>
          <Link href="/products/children-drawing" className="block group">
            <div className="bg-white rounded-md overflow-hidden shadow-sm hover:shadow-md transition-shadow">
              <div className="relative aspect-square w-full">
                <Image
                  src="/children-drawing-figure.png"
                  alt="子どもおえかきフィギュア"
                  fill
                  className="object-contain p-2 group-hover:scale-105 transition-transform duration-300"
                />
              </div>
              <div className="p-4">
                <h3 className="font-bold text-gray-900 mb-1 group-hover:text-[#f6be5a] transition-colors">
                  子どもおえかきフィギュア
                </h3>
                <p className="text-[#f6be5a] font-bold">¥9,000〜</p>
              </div>
            </div>
          </Link>
          <Link href="/product" className="block group">
            <div className="bg-white rounded-md overflow-hidden shadow-sm hover:shadow-md transition-shadow">
              <div className="relative aspect-square w-full">
                <Image
                  src="/custom-nameplate-new-1.png"
                  alt="ネームプレートキーホルダー"
                  fill
                  className="object-contain p-2 group-hover:scale-105 transition-transform duration-300"
                />
              </div>
              <div className="p-4">
                <h3 className="font-bold text-gray-900 mb-1 group-hover:text-[#f6be5a] transition-colors">
                  ネームプレートキーホルダー
                </h3>
                <p className="text-[#f6be5a] font-bold">¥1,300〜</p>
              </div>
            </div>
          </Link>
        </div>
      </div>

      <Footer />
    </div>
  )
}
