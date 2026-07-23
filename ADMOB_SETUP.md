# Google AdMob 獎勵廣告

目前原生 Android 測試版已接上 Google 官方測試廣告：

- Android 測試 App ID：`ca-app-pub-3940256099942544~3347511713`
- Android 測試獎勵廣告 ID：`ca-app-pub-3940256099942544/5224354917`
- iOS 測試獎勵廣告 ID：`ca-app-pub-3940256099942544/1712485313`

只有 AdMob 回傳 `Rewarded` 事件後，App 才會增加 1 顆愛心。使用者提早關閉、廣告載入失敗或在一般瀏覽器開啟時，都不會發放愛心。

## 正式上架前

1. 在 AdMob 建立 Android 與 iOS App。
2. 各自建立「獎勵廣告」單元。
3. Android App ID 寫入 `android/app/src/main/res/values/strings.xml`。
4. 正式廣告單元 ID 透過建置環境變數提供：
   - `VITE_ADMOB_REWARDED_ANDROID`
   - `VITE_ADMOB_REWARDED_IOS`
5. 將 `app/admob.ts` 的 `isTesting` 與 `initializeForTesting` 改為只在開發版啟用。
6. 實機測試時仍必須把裝置加入 AdMob 測試裝置，禁止用正式廣告自行反覆測試。

## Android 測試

```sh
pnpm cap sync android
pnpm cap open android
```

目前此專案的 Capacitor App ID 是 `com.ottertoeic.app`。

## iOS

iOS 共用的廣告呼叫程式已完成，但此電腦目前未安裝 Xcode／CocoaPods，因此尚未產生 iOS 原生專案。安裝完整 Xcode 與 CocoaPods 後執行：

```sh
pnpm cap add ios
pnpm cap sync ios
pnpm cap open ios
```

接著必須在 `Info.plist` 加入正式的 `GADApplicationIdentifier` 與 Google 要求的 `SKAdNetworkItems`。
