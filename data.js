/* 品目データはアプリ本体(app.js)から分離。公式ページを確認した品目だけ登録してください。 */
const APP_DATA = {
  area: "品川区 二葉4丁目",
  checkedOn: "2026-10-19",
  schedule: [
    { id: "burn", name: "燃やすごみ", weekdays: [3, 6], color: "burn" },
    { id: "resource", name: "資源", weekdays: [4], color: "resource" },
    { id: "other", name: "陶器・ガラス・金属ごみ", weekdays: [], nthWeekdays: [{ weekday: 1, weeks: [2, 4] }], color: "other" }
  ],
  specialDates: {},
  official: {
    schedule: "https://www.city.shinagawa.tokyo.jp/PC/kankyo/kankyo-gomi/gomi-kateigomi/wastedayslist/list_ha.html",
    items: "https://www.city.shinagawa.tokyo.jp/PC/kankyo/kankyo-gomi/20191127174730.html",
    guide: "https://www.city.shinagawa.tokyo.jp/PC/kankyo/kankyo-gomi/gomi-kateigomi/gomi-kateigomi-dashikata/hpg000005617.html",
    qa: "https://www.city.shinagawa.tokyo.jp/PC/kankyo/kankyo-gomi/20200929091450.html"
  },
  items: [
    { name: "はさみ", aliases: ["鋏", "ハサミ"], category: "other", note: "新聞紙等で包み、「キケン」と表示してください。", source: "items" },
    { name: "包丁", aliases: ["ほうちょう"], category: "other", note: "新聞紙等で包み、「キケン」と表示してください。", source: "items" },
    { name: "ナイフ等", aliases: ["ナイフ", "カッター"], category: "other", note: "新聞紙等で包み、「キケン」と表示してください。品目・形状により扱いが異なる場合は公式一覧を確認してください。", source: "items" },
    { name: "蛍光灯", aliases: ["けいこうとう"], category: "resource", note: "割れたものは新聞紙等で包み「キケン」と表示してください。", source: "items" },
    { name: "電球・LED", aliases: ["電球", "LED電球", "led"], category: "other", note: "蛍光灯は資源です。電球・LEDと蛍光灯を区別してください。", source: "guide" },
    { name: "ドライヤー", aliases: ["ヘアドライヤー"], category: "other", note: "一辺がおおむね30cmを超えるものは粗大ごみです。", source: "items" },
    { name: "フライパン", aliases: [], category: "other", note: "一辺がおおむね30cmを超える場合は粗大ごみの扱いを確認してください。", source: "items" },
    { name: "鍋", aliases: ["なべ"], category: "other", note: "一辺がおおむね30cmを超えるものは粗大ごみです。", source: "items" },
    { name: "ペットボトル", aliases: ["PETボトル"], category: "resource", note: "キャップ・ラベルを外し、中をすすいで出してください。最新の出し方は公式の資源回収案内を確認してください。", source: "guide" },
    { name: "びん", aliases: ["ビン", "ガラスびん"], category: "resource", note: "割れたびん、油などで汚れたびん、飲食用以外のびんは陶器・ガラス・金属ごみの日に出してください。", source: "guide" },
    { name: "缶（飲食用）", aliases: ["缶", "かん", "アルミ缶", "スチール缶"], category: "resource", note: "軽く水ですすぎ、中身の見える袋に入れてください。異物を入れないでください。一斗缶は陶器・ガラス・金属ごみです。", source: "guide" },
    { name: "新聞・折り込みチラシ", aliases: ["新聞", "チラシ"], category: "resource", note: "ひもでしばるか、新聞回収袋で出してください。", source: "guide" },
    { name: "段ボール", aliases: ["ダンボール"], category: "resource", note: "折りたたんで束ねてください。", source: "guide" },
    { name: "雑誌・書籍", aliases: ["雑誌", "本", "書籍"], category: "resource", note: "ひもでしばってください。", source: "guide" },
    { name: "紙パック", aliases: ["牛乳パック"], category: "resource", note: "すすいで開いて乾かしてください。内側がアルミ箔のものは燃やすごみです。", source: "guide" },
    { name: "豆腐の容器", aliases: ["豆腐パック"], category: "resource", note: "汚れの落とせないものは燃やすごみに出してください。", source: "items" },
    { name: "納豆の容器", aliases: ["納豆パック"], category: "resource", note: "汚れの落とせないものは燃やすごみに出してください。", source: "items" },
    { name: "歯ブラシ", aliases: [], category: "resource", note: "品川区の品目一覧では資源に分類されています。", source: "items" },
    { name: "ハンガー（金属製）", aliases: ["金属ハンガー"], category: "other", note: "プラスチック製ハンガーは資源です。素材を確認してください。", source: "items" },
    { name: "ハンガー（プラスチック製）", aliases: ["プラスチックハンガー"], category: "resource", note: "金属製ハンガーは陶器・ガラス・金属ごみです。素材を確認してください。", source: "items" },
    { name: "バケツ（金属製）", aliases: ["金属バケツ"], category: "other", note: "一辺がおおむね30cmを超えるものは粗大ごみです。", source: "items" },
    { name: "バケツ（プラスチック製）", aliases: ["プラバケツ"], category: "resource", note: "一辺がおおむね30cmを超えるものは粗大ごみです。", source: "items" },
    { name: "ホース（プラスチック製）", aliases: ["ホース"], category: "resource", note: "30cm以内に切断したものに限ります。一辺がおおむね30cmを超えるものは粗大ごみです。", source: "items" },
    { name: "猫用砂（鉱物系）", aliases: ["猫砂", "ねこ砂"], category: "other", note: "汚物は取り除いてください。素材によって分別が異なります。", source: "items" },
    { name: "猫用砂（紙・木・おから・シリカゲル製）", aliases: ["紙製猫砂", "木製猫砂"], category: "burn", note: "汚物は取り除いてください。鉱物系は陶器・ガラス・金属ごみです。", source: "items" },
    { name: "花火", aliases: [], category: "burn", note: "水に濡らしてから出してください。", source: "items" },
    { name: "保冷剤", aliases: [], category: "burn", note: "品川区の品目一覧では燃やすごみに分類されています。", source: "items" },
    { name: "クリップ", aliases: ["ゼムクリップ"], category: "other", note: "素材・大きさが特殊な場合は公式一覧を確認してください。", source: "items" },
    { name: "クレジットカード", aliases: ["カード"], category: "burn", note: "個人情報が含まれるため、必要に応じて裁断してから出してください。", source: "items" },
    { name: "プラスチック容器", aliases: ["プラ容器", "プラスチック製容器包装"], category: "resource", note: "汚れを落としてください。汚れの落とせないものは燃やすごみです。材質や製品によって異なるため公式一覧も確認してください。", source: "guide" },
    { name: "小型家電", aliases: ["家電"], category: "other", note: "一辺が30cmを超えるものは粗大ごみです。一部品目は拠点回収もあります。", source: "guide" },
    { name: "電池", aliases: ["乾電池"], category: "unknown", note: "電池の種類によって出し方が異なります。ボタン電池・小型充電式電池は通常収集できないものがあります。種類を確認し、公式案内を参照してください。", source: "items" },
    { name: "粗大ごみ", aliases: ["大きなごみ"], category: "special", note: "一辺がおおむね30cmを超えるものなどは粗大ごみになる場合があります。通常の集積所には出さず、品川区の粗大ごみ案内で申込み方法を確認してください。", source: "guide" }
  ],
  shortcuts: ["プラスチック容器", "ペットボトル", "びん", "缶", "段ボール", "電池", "電球", "はさみ", "小型家電", "粗大ごみ"]
};